import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { FAKE_BACK_END_URL } from './FakeBackEnd';

// O HttpClientService exige a URL da API ao ser carregado.
process.env.EXPO_PUBLIC_WEB_API_REST_URL = FAKE_BACK_END_URL;

// Os toasts dependem da UI do React Native, ausente nos testes de integração.
jest.mock('react-native-toast-message', () => ({
  __esModule: true,
  default: { show: jest.fn(), hide: jest.fn() },
}));

beforeEach(() => {
  // Cada teste começa com um IndexedDB vazio; dentro do teste ele é compartilhado entre as sessões da aplicação.
  globalThis.indexedDB = new IDBFactory();

  // O APIConsumerUtility registra no console cada erro da API; nos cenários de rejeição isso é esperado.
  jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

// Desfaz os spies, inclusive o `fetch` interceptado pelo FakeBackEnd.
afterEach(() => {
  jest.restoreAllMocks();
});
