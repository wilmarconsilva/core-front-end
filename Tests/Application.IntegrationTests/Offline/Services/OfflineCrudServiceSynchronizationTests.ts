import { ApplicationSession } from '../../Fixtures/ApplicationSession';
import { FakeBackEnd } from '../../Fixtures/FakeBackEnd';
import { IndexedDbInspector } from '../../Fixtures/IndexedDbInspector';
import { ProductSaveDtoBuilder } from '../../Builders/ProductSaveDtoBuilder';
import { CustomerSaveDtoBuilder } from '../../Builders/CustomerSaveDtoBuilder';
import { DocumentSaveDtoBuilder } from '../../Builders/DocumentSaveDtoBuilder';
import { OfflineStoreNames } from '../../../../Infrastructure/Shared/Persistence/IndexedDb/IndexedDbSchema';
import { IOrderSaveDto } from '../../../../Application/Documents/Orders/DataTransferObjects/IOrderSaveDto';
import { IBudgetSaveDto } from '../../../../Application/Documents/Budgets/DataTransferObjects/IBudgetSaveDto';
import { SynchronizationEntityType } from '../../../../Application/Offline/DataTransferObjects/SynchronizationEntityType';

/**
 * Correção de uma pendência de sincronização: online, salvar um registro local (id negativo) o envia
 * ao back-end como novo e atualiza os documentos locais que ainda o referenciam pelo id local.
 */
describe('OfflineCrudService (reenvio de registro local)', () => {
  let backEnd: FakeBackEnd;

  beforeEach(() => {
    backEnd = new FakeBackEnd().install();
  });

  async function createDocumentsOffline(): Promise<{ customerId: number; productId: number }> {
    const { services } = ApplicationSession.startOffline();
    const customer = await services.customerService.create(CustomerSaveDtoBuilder.customer('Cliente com CPF errado'));
    const product = await services.productService.create(ProductSaveDtoBuilder.product('Produto sem unidade'));
    await services.orderService.create(DocumentSaveDtoBuilder.order(customer.id, [product.id]));
    await services.budgetService.create(DocumentSaveDtoBuilder.budget(customer.id, [product.id]));

    return { customerId: customer.id, productId: product.id };
  }

  async function getStoredDocuments(): Promise<Array<IOrderSaveDto | IBudgetSaveDto>> {
    return [
      ...await IndexedDbInspector.getAll<IOrderSaveDto>(OfflineStoreNames.orders),
      ...await IndexedDbInspector.getAll<IBudgetSaveDto>(OfflineStoreNames.budgets),
    ];
  }

  test('Update_LocalCustomerOnline_CreatesItAndRemapsLocalDocumentsAndResolvesPendency', async () => {
    const { customerId, productId } = await createDocumentsOffline();
    const { services } = ApplicationSession.startOnline();
    await services.synchronizationPendencyService.register({
      entityType: SynchronizationEntityType.Customer,
      recordId: customerId,
      description: 'Cliente com CPF errado',
      failureMessage: 'CPF inválido.',
    });

    const created = await services.customerService.update(
      customerId,
      CustomerSaveDtoBuilder.customer('Cliente Corrigido', customerId),
    );

    expect(created).toMatchObject({ id: 1, name: 'Cliente Corrigido' });
    expect(backEnd.requestsTo('POST', '/customers')[0].body).toMatchObject({ id: 0 });
    expect(await IndexedDbInspector.getIds(OfflineStoreNames.customers)).toEqual([]);
    expect(await IndexedDbInspector.getPendencies()).toEqual([]);

    const documents = await getStoredDocuments();
    expect(documents).toHaveLength(2);
    for (const document of documents) {
      expect(document.customerId).toBe(created.id);
      expect(document.products[0].productId).toBe(productId);
    }
  });

  test('Update_LocalProductOnline_CreatesItAndRemapsLocalDocuments', async () => {
    const { customerId, productId } = await createDocumentsOffline();
    const { services } = ApplicationSession.startOnline();

    const created = await services.productService.update(
      productId,
      ProductSaveDtoBuilder.product('Produto Corrigido', productId),
    );

    expect(created).toMatchObject({ id: 1, description: 'Produto Corrigido' });
    expect(await IndexedDbInspector.getIds(OfflineStoreNames.products)).toEqual([]);

    const documents = await getStoredDocuments();
    expect(documents).toHaveLength(2);
    for (const document of documents) {
      expect(document.customerId).toBe(customerId);
      expect(document.products[0].productId).toBe(created.id);
    }
  });

  test('GetById_LocalRecordOnline_ReadsItFromIndexedDb', async () => {
    const { customerId } = await createDocumentsOffline();
    const { services } = ApplicationSession.startOnline();

    const customer = await services.customerService.getById(customerId);

    expect(customer).toMatchObject({ id: customerId, name: 'Cliente com CPF errado' });
    expect(backEnd.requests).toEqual([]);
  });
});
