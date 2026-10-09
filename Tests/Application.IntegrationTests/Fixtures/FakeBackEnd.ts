import { IProductSaveDto } from '../../../Application/Products/DataTransferObjects/IProductSaveDto';
import { ICustomerSaveDto } from '../../../Application/Persons/Customers/DataTransferObjects/ICustomerSaveDto';
import { IOrderSaveDto } from '../../../Application/Documents/Orders/DataTransferObjects/IOrderSaveDto';
import { IBudgetSaveDto } from '../../../Application/Documents/Budgets/DataTransferObjects/IBudgetSaveDto';
import { ILocalitySaveDto } from '../../../Application/Territories/Localities/DataTransferObjects/ILocalitySaveDto';
import { ICurrentUserDto } from '../../../Application/Persons/Users/DataTransferObjects/ICurrentUserDto';
import { IDocumentSaveDto } from '../../../Application/Documents/DataTransferObjects/IDocumentSaveDto';
import { IDocumentProductSaveDto } from '../../../Application/Documents/DataTransferObjects/IDocumentProductSaveDto';

export const FAKE_BACK_END_URL = 'http://fake-back-end.test';

export interface IRecordedRequest {
  method: string;
  path: string;
  query: URLSearchParams;
  body: unknown;
}

export interface IFailureOptions {
  status: number;
  /** Corpo ProblemDetails da API; sem ele (e sem `html`), a resposta vem com corpo vazio. */
  detail?: string;
  /** Página HTML de erro, como a que um proxy reverso devolve quando o upstream está fora. */
  html?: string;
  /** Restringe a falha às requisições cujo corpo satisfaça o predicado. */
  when?: (body: any) => boolean;
}

interface IInjectedFailure extends IFailureOptions {
  method: string;
  path: string;
}

class HttpError extends Error {
  constructor(readonly status: number, readonly detail: string) {
    super(detail);
  }
}

/** Tabela em memória com chave primária sequencial, como uma tabela do Postgres com identity. */
class FakeTable<T extends { id: number }> {
  private readonly rows = new Map<number, T>();
  private sequence = 0;

  insert(row: T): T {
    const created = { ...row, id: ++this.sequence };
    this.rows.set(created.id, created);
    return created;
  }

  delete(id: number): void {
    this.rows.delete(id);
  }

  exists(id: number): boolean {
    return this.rows.has(id);
  }

  all(): T[] {
    return [...this.rows.values()].sort((first, second) => first.id - second.id);
  }

  get count(): number {
    return this.rows.size;
  }
}

/**
 * Simula a API REST do core-back-end e o Postgres por trás dela, interceptando o `fetch` global.
 * Valida as chaves estrangeiras dos documentos como o banco faria, o que torna observável um envio
 * com referências locais (ids negativos) não remapeadas.
 */
export class FakeBackEnd {
  readonly products = new FakeTable<IProductSaveDto>();
  readonly customers = new FakeTable<ICustomerSaveDto>();
  readonly localities = new FakeTable<ILocalitySaveDto>();
  readonly orders = new FakeTable<IOrderSaveDto>();
  readonly budgets = new FakeTable<IBudgetSaveDto>();
  currentUser: ICurrentUserDto = { name: 'Vendedor de Teste' };

  readonly requests: IRecordedRequest[] = [];

  private readonly failures: IInjectedFailure[] = [];
  private isDown = false;

  /** Intercepta o `fetch` até o fim do teste (o JestSetup restaura os spies após cada teste). */
  install(): this {
    jest.spyOn(globalThis, 'fetch').mockImplementation((input, init) => this.handle(input, init));
    return this;
  }

  /** A próxima requisição que casar com método, caminho e opções falha com o status informado, sem gravar nada. */
  rejectNext(method: string, path: string, options: IFailureOptions): void {
    this.failures.push({ method, path, ...options });
  }

  /** Simula o servidor inacessível: o `fetch` rejeita, como em conexão recusada ou DNS. */
  goDown(): void {
    this.isDown = true;
  }

  clearRequests(): void {
    this.requests.length = 0;
  }

  requestsTo(method: string, path: string): IRecordedRequest[] {
    return this.requests.filter((request) => request.method === method && request.path === path);
  }

  private async handle(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    if (this.isDown) {
      throw new TypeError('Failed to fetch');
    }

    const url = new URL(String(input));
    const method = init?.method ?? 'GET';
    const body = typeof init?.body === 'string' ? JSON.parse(init.body) : undefined;
    const request: IRecordedRequest = { method, path: url.pathname, query: url.searchParams, body };

    this.requests.push(request);

    const failure = this.takeFailure(request);
    if (failure) {
      return this.respondFailure(failure);
    }

    try {
      return this.respond(200, this.route(request));
    } catch (error) {
      if (error instanceof HttpError) {
        return this.respond(error.status, { detail: error.detail });
      }
      throw error;
    }
  }

  private route({ method, path, query, body }: IRecordedRequest): unknown {
    switch (`${method} ${path}`) {
      case 'GET /products':
        return this.page(this.products.all(), query).map(({ id, description }) => ({ id, description }));
      case 'POST /products':
        return this.products.insert(body as IProductSaveDto);
      case 'GET /customers/synchronization':
        return this.page(this.customers.all(), query);
      case 'POST /customers':
        return this.customers.insert(body as ICustomerSaveDto);
      case 'POST /orders':
        return this.orders.insert(this.withValidReferences(body as IOrderSaveDto));
      case 'POST /budgets':
        return this.budgets.insert(this.withValidReferences(body as IBudgetSaveDto));
      case 'GET /localities/quantity':
        return this.localities.count;
      case 'GET /localities/synchronization':
        return this.page(this.localities.all(), query);
      case 'GET /users/current':
        return this.currentUser;
      default:
        throw new HttpError(404, `Rota não simulada: ${method} ${path}`);
    }
  }

  private withValidReferences<T extends IDocumentSaveDto<IDocumentProductSaveDto>>(document: T): T {
    if (!this.customers.exists(document.customerId)) {
      throw new HttpError(400, `Cliente ${document.customerId} não encontrado.`);
    }

    const missingProduct = document.products.find((line) => !this.products.exists(line.productId));
    if (missingProduct) {
      throw new HttpError(400, `Produto ${missingProduct.productId} não encontrado.`);
    }

    return document;
  }

  private page<T>(rows: T[], query: URLSearchParams): T[] {
    const start = Number(query.get('registersStart') ?? 0);
    const end = Number(query.get('registersEnd') ?? rows.length);
    return rows.slice(start, end);
  }

  private takeFailure({ method, path, body }: IRecordedRequest): IInjectedFailure | undefined {
    const index = this.failures.findIndex((failure) =>
      failure.method === method && failure.path === path && (failure.when?.(body) ?? true));
    return index < 0 ? undefined : this.failures.splice(index, 1)[0];
  }

  private respondFailure({ status, detail, html }: IInjectedFailure): Response {
    if (html !== undefined) {
      return new Response(html, { status, headers: { 'Content-Type': 'text/html' } });
    }
    if (detail !== undefined) {
      return this.respond(status, { detail });
    }
    return new Response(null, { status });
  }

  private respond(status: number, body: unknown): Response {
    return new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
