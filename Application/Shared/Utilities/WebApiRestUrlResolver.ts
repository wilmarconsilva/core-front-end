const TRAILING_SLASHES = /\/+$/;

/**
 * Resolve a URL da API REST.
 *
 * Precedência:
 * 1. `runtimeUrl`: definida pelo container na inicialização (build web servido pelo nginx).
 * 2. `buildTimeUrl`: `EXPO_PUBLIC_WEB_API_REST_URL`, embutida no bundle pelo Expo
 *    (desenvolvimento local, testes e builds nativos).
 *
 * A barra final é removida porque as rotas são concatenadas já começando com "/".
 */
export function resolveWebApiRestUrl(
  runtimeUrl: string | undefined,
  buildTimeUrl: string | undefined,
): string {
  const url = runtimeUrl?.trim() || buildTimeUrl?.trim();

  if (!url) {
    throw new Error(
      'A URL da API REST não foi definida. No container, defina a variável WEB_API_REST_URL; '
        + 'fora dele, defina EXPO_PUBLIC_WEB_API_REST_URL no .env.',
    );
  }

  return url.replace(TRAILING_SLASHES, '');
}
