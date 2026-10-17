import { ApplicationSession } from '../../Fixtures/ApplicationSession';
import { FakeBackEnd } from '../../Fixtures/FakeBackEnd';
import { IndexedDbInspector } from '../../Fixtures/IndexedDbInspector';
import { ProductSaveDtoBuilder } from '../../Builders/ProductSaveDtoBuilder';
import { CustomerSaveDtoBuilder } from '../../Builders/CustomerSaveDtoBuilder';
import { LocalitySaveDtoBuilder } from '../../Builders/LocalitySaveDtoBuilder';
import { DocumentSaveDtoBuilder } from '../../Builders/DocumentSaveDtoBuilder';
import { OfflineStoreNames } from '../../../../Infrastructure/Shared/Persistence/IndexedDb/IndexedDbSchema';
import { ICustomerSaveDto } from '../../../../Application/Persons/Customers/DataTransferObjects/ICustomerSaveDto';
import { IOrderSaveDto } from '../../../../Application/Documents/Orders/DataTransferObjects/IOrderSaveDto';
import { ICurrentUserDto } from '../../../../Application/Persons/Users/DataTransferObjects/ICurrentUserDto';
import { SynchronizationStatus } from '../../../../Application/Offline/Services/Interfaces/IDataSynchronizationService';

/**
 * Sincronização entre o IndexedDB do dispositivo e o back-end, exercitando o wiring real do
 * composition root: repositórios IndexedDB, serviços HTTP e o DataSynchronizationService.
 * Os registros locais são criados como o usuário os cria: numa sessão offline, pelos serviços de CRUD.
 */
describe('DataSynchronizationService', () => {
  let backEnd: FakeBackEnd;

  beforeEach(() => {
    backEnd = new FakeBackEnd().install();
  });

  async function synchronizeOnline(): Promise<SynchronizationStatus> {
    const { services } = ApplicationSession.startOnline();
    await services.dataSynchronizationService.synchronize();
    return services.dataSynchronizationService.getStatus();
  }

  function seedProducts(quantity: number): void {
    for (let index = 1; index <= quantity; index++) {
      backEnd.products.insert(ProductSaveDtoBuilder.product(`Produto ${index}`));
    }
  }

  function seedCustomers(quantity: number): void {
    for (let index = 1; index <= quantity; index++) {
      backEnd.customers.insert(CustomerSaveDtoBuilder.customer(`Cliente ${index}`));
    }
  }

  test('Synchronize_EmptyIndexedDb_DownloadsSnapshotsPageByPage', async () => {
    seedProducts(120);
    seedCustomers(120);
    backEnd.localities.insert(LocalitySaveDtoBuilder.locality('Blumenau'));
    backEnd.localities.insert(LocalitySaveDtoBuilder.locality('Joinville'));

    const status = await synchronizeOnline();

    expect(status).toBe('success');
    expect(backEnd.requestsTo('GET', '/products').map((request) => request.query.get('registersStart')))
      .toEqual(['0', '50', '100']);
    expect(backEnd.requestsTo('GET', '/customers/synchronization')).toHaveLength(3);
    expect(await IndexedDbInspector.getIds(OfflineStoreNames.products)).toHaveLength(120);

    const customers = await IndexedDbInspector.getAll<ICustomerSaveDto>(OfflineStoreNames.customers);
    expect(customers).toHaveLength(120);
    expect(customers[0]).toEqual(backEnd.customers.all()[0]);

    expect(await IndexedDbInspector.getIds(OfflineStoreNames.localities)).toEqual([1, 2]);
    expect(await IndexedDbInspector.getAll<ICurrentUserDto>(OfflineStoreNames.currentUser))
      .toEqual([{ key: 'current', name: 'Vendedor de Teste' }]);
  });

  test('Synchronize_RecordsCreatedOffline_PushesThemWithReferencesRemappedToServerIds', async () => {
    seedProducts(2);
    seedCustomers(3);

    const { services } = ApplicationSession.startOffline();
    const product = await services.productService.create(ProductSaveDtoBuilder.product('Areia'));
    const customer = await services.customerService.create(CustomerSaveDtoBuilder.customer('João Offline'));
    await services.orderService.create(DocumentSaveDtoBuilder.order(customer.id, [product.id]));
    await services.budgetService.create(DocumentSaveDtoBuilder.budget(customer.id, [product.id]));

    const status = await synchronizeOnline();

    expect(status).toBe('success');
    expect(product.id).toBe(-1);
    expect(customer.id).toBe(-1);

    const [serverProduct] = backEnd.products.all().slice(-1);
    const [serverCustomer] = backEnd.customers.all().slice(-1);
    expect(serverProduct).toMatchObject({ id: 3, description: 'Areia' });
    expect(serverCustomer).toMatchObject({ id: 4, name: 'João Offline' });

    for (const table of [backEnd.orders, backEnd.budgets]) {
      const [document] = table.all();
      expect(table.count).toBe(1);
      expect(document.customerId).toBe(serverCustomer.id);
      expect(document.products.map((line) => line.productId)).toEqual([serverProduct.id]);
    }
    expect(backEnd.requestsTo('POST', '/orders')[0].body).toMatchObject({ id: 0 });

    expect(await IndexedDbInspector.getIds(OfflineStoreNames.orders)).toEqual([]);
    expect(await IndexedDbInspector.getIds(OfflineStoreNames.budgets)).toEqual([]);
    expect(await IndexedDbInspector.getIds(OfflineStoreNames.products)).toEqual([1, 2, 3]);
    expect(await IndexedDbInspector.getIds(OfflineStoreNames.customers)).toEqual([1, 2, 3, 4]);
    expect(await IndexedDbInspector.getPendencies()).toEqual([]);
  });

  test('Synchronize_CustomerWithoutStreetAndNeighborhoodCreatedOffline_PushesItWithoutThem', async () => {
    const { services } = ApplicationSession.startOffline();
    await services.customerService.create(CustomerSaveDtoBuilder.customerWithoutStreetAndNeighborhood('Cliente Sem Logradouro'));

    const status = await synchronizeOnline();

    expect(status).toBe('success');
    const [serverCustomer] = backEnd.customers.all();
    expect(serverCustomer).toMatchObject({ id: 1, name: 'Cliente Sem Logradouro', addresses: [{ localityId: 1 }] });
    expect(serverCustomer.addresses[0].street).toBeUndefined();
    expect(serverCustomer.addresses[0].neighborhood).toBeUndefined();

    const customers = await IndexedDbInspector.getAll<ICustomerSaveDto>(OfflineStoreNames.customers);
    expect(customers).toEqual([serverCustomer]);
    expect(await IndexedDbInspector.getPendencies()).toEqual([]);
  });

  test('Synchronize_CustomerRejectedByBackEnd_RegistersPendencyAndKeepsLocalRecord', async () => {
    const { services } = ApplicationSession.startOffline();
    await services.customerService.create(CustomerSaveDtoBuilder.customer('Cliente Inválido'));
    await services.customerService.create(CustomerSaveDtoBuilder.customer('Cliente Válido'));
    backEnd.rejectNext('POST', '/customers', {
      status: 400,
      detail: 'CPF inválido.',
      when: (body) => body.name === 'Cliente Inválido',
    });

    const status = await synchronizeOnline();

    expect(status).toBe('error');
    expect(backEnd.customers.all().map((customer) => customer.name)).toEqual(['Cliente Válido']);

    const customers = await IndexedDbInspector.getAll<ICustomerSaveDto>(OfflineStoreNames.customers);
    expect(customers.map(({ id, name }) => ({ id, name }))).toEqual([
      { id: -1, name: 'Cliente Inválido' },
      { id: 1, name: 'Cliente Válido' },
    ]);
    expect(await IndexedDbInspector.getPendencies()).toEqual([{
      key: 'customer:-1',
      entityType: 'customer',
      recordId: -1,
      description: 'Cliente Inválido',
      failureMessage: 'CPF inválido.',
    }]);
  });

  test('Synchronize_OrderRejectedByBackEnd_KeepsItWithRemappedReferencesAndRegistersPendency', async () => {
    backEnd.customers.insert(CustomerSaveDtoBuilder.customer('Maria da Silva'));
    await synchronizeOnline();

    const { services } = ApplicationSession.startOffline();
    const product = await services.productService.create(ProductSaveDtoBuilder.product('Brita'));
    await services.orderService.create(DocumentSaveDtoBuilder.order(1, [product.id]));
    backEnd.rejectNext('POST', '/orders', { status: 400, detail: 'Forma de pagamento inválida.' });

    const status = await synchronizeOnline();

    expect(status).toBe('error');
    expect(backEnd.orders.count).toBe(0);

    const [order] = await IndexedDbInspector.getAll<IOrderSaveDto>(OfflineStoreNames.orders);
    expect(order.id).toBe(-1);
    expect(order.customerId).toBe(1);
    expect(order.products[0].productId).toBe(backEnd.products.all()[0].id);

    expect(await IndexedDbInspector.getPendencies()).toEqual([{
      key: 'order:-1',
      entityType: 'order',
      recordId: -1,
      description: 'Maria da Silva - 10/01/2026',
      failureMessage: 'Forma de pagamento inválida.',
    }]);
  });

  // Online o usuário não vê os registros criados offline: sem a pendência, o registro pareceria ter sumido.
  test.each([
    ['inacessível', 'não definido', () => backEnd.goDown()],
    ['respondendo 500 sem corpo', '500', () => backEnd.rejectNext('POST', '/customers', { status: 500 })],
    ['respondendo 503 sem corpo', '503', () => backEnd.rejectNext('POST', '/customers', { status: 503 })],
    ['com página HTML do proxy (502)', '502', () => backEnd.rejectNext('POST', '/customers', {
      status: 502,
      html: '<html><body><h1>502 Bad Gateway</h1></body></html>',
    })],
  ])('Synchronize_BackEndFailure_RegistersPendencyAndKeepsLocalRecordForRetry (%s)', async (_, status, makeFail) => {
    const { services } = ApplicationSession.startOffline();
    await services.customerService.create(CustomerSaveDtoBuilder.customer('Cliente Pendente'));
    makeFail();

    const synchronizationStatus = await synchronizeOnline();

    expect(synchronizationStatus).toBe('error');
    expect(await IndexedDbInspector.getIds(OfflineStoreNames.customers)).toEqual([-1]);

    const [pendency] = await IndexedDbInspector.getPendencies();
    expect(pendency).toMatchObject({ key: 'customer:-1', description: 'Cliente Pendente' });
    // Mensagem genérica do APIConsumerUtility: nem vazia, nem a página HTML do proxy.
    expect(pendency.failureMessage).toMatch(/^Falha inesperada\./);
    expect(pendency.failureMessage).toContain(`Status: ${status} - `);
  });

  test('Synchronize_PreviouslyRejectedRecordAccepted_ResolvesPendency', async () => {
    const { services } = ApplicationSession.startOffline();
    await services.customerService.create(CustomerSaveDtoBuilder.customer('Cliente Tardio'));
    backEnd.rejectNext('POST', '/customers', { status: 400, detail: 'Serviço de validação de CPF indisponível.' });
    await synchronizeOnline();
    expect(await IndexedDbInspector.getPendencies()).toHaveLength(1);

    const status = await synchronizeOnline();

    expect(status).toBe('success');
    expect(backEnd.customers.all().map((customer) => customer.name)).toEqual(['Cliente Tardio']);
    expect(await IndexedDbInspector.getIds(OfflineStoreNames.customers)).toEqual([1]);
    expect(await IndexedDbInspector.getPendencies()).toEqual([]);
  });

  test('Synchronize_ServerRecordDeleted_RemovesItFromSnapshotAndKeepsLocalRecords', async () => {
    seedProducts(3);
    await synchronizeOnline();
    expect(await IndexedDbInspector.getIds(OfflineStoreNames.products)).toEqual([1, 2, 3]);

    const { services } = ApplicationSession.startOffline();
    await services.productService.create(ProductSaveDtoBuilder.product('Produto Rejeitado'));
    backEnd.products.delete(2);
    backEnd.rejectNext('POST', '/products', { status: 400, detail: 'Descrição já cadastrada.' });

    await synchronizeOnline();

    expect(await IndexedDbInspector.getIds(OfflineStoreNames.products)).toEqual([-1, 1, 3]);
  });

  test('Synchronize_LocalityQuantityUnchanged_SkipsLocalitiesDownload', async () => {
    backEnd.localities.insert(LocalitySaveDtoBuilder.locality('Blumenau'));
    await synchronizeOnline();
    expect(backEnd.requestsTo('GET', '/localities/synchronization')).toHaveLength(1);

    backEnd.clearRequests();
    await synchronizeOnline();
    expect(backEnd.requestsTo('GET', '/localities/synchronization')).toHaveLength(0);

    backEnd.localities.insert(LocalitySaveDtoBuilder.locality('Joinville'));
    await synchronizeOnline();
    expect(backEnd.requestsTo('GET', '/localities/synchronization')).toHaveLength(1);
    expect(await IndexedDbInspector.getIds(OfflineStoreNames.localities)).toEqual([1, 2]);
  });

  test('Synchronize_CalledTwiceInSameSession_RunsOnceAndNotifiesStatusChanges', async () => {
    const { services } = ApplicationSession.startOnline();
    const statuses: SynchronizationStatus[] = [];
    services.dataSynchronizationService.subscribe((status) => statuses.push(status));

    await services.dataSynchronizationService.synchronize();
    const requestsAfterFirstRun = backEnd.requests.length;
    await services.dataSynchronizationService.synchronize();

    expect(statuses).toEqual(['idle', 'syncing', 'success']);
    expect(backEnd.requests).toHaveLength(requestsAfterFirstRun);
  });
});
