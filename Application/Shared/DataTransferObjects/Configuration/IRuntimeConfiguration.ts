/**
 * Configuração definida na INICIALIZAÇÃO do container, e não no build da imagem.
 *
 * O `Docker/runtime-config.sh` gera o `/runtime-config.js` a partir das variáveis de ambiente do
 * container, e o `index.html` o carrega antes do bundle, publicando-o em `globalThis`. Assim, a
 * mesma imagem serve qualquer ambiente (homologação, produção).
 *
 * Só existe no build web servido pelo nginx. Em desenvolvimento local, nos testes e em builds
 * nativos o objeto fica ausente (ou vazio) e vale o valor de build (`EXPO_PUBLIC_*`).
 */
export interface IRuntimeConfiguration {
  readonly WEB_API_REST_URL?: string;
}

declare global {
  // `var` é obrigatório: só declarações `var` viram propriedades de `globalThis`.
  // eslint-disable-next-line no-var
  var __CORE_RUNTIME_CONFIG__: IRuntimeConfiguration | undefined;
}
