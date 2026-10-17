// Desfaz o `fetch` interceptado pelo PublicFolderHost e o `window` que ele expõe.
afterEach(() => {
  jest.restoreAllMocks();
  delete (globalThis as { window?: unknown }).window;
});
