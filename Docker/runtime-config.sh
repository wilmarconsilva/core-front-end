#!/bin/sh
# ============================================
# Configuração de runtime do front-end
# ============================================
# Executado pelo entrypoint do nginx (/docker-entrypoint.d) antes de o servidor subir.
# Gera o /runtime-config.js a partir das variáveis de ambiente do container, para que a MESMA
# imagem sirva qualquer ambiente. O index.html carrega esse arquivo antes do bundle
# (ver Application/Shared/Utilities/WebApiRestUrlResolver.ts).
#
# Variáveis:
#   WEB_API_REST_URL  (obrigatória)  URL pública da API REST, ex.: https://api.seudominio.com.br
#
# Qualquer erro aqui aborta a inicialização do container: é melhor não subir do que subir
# "saudável" apontando para a API errada.
set -eu

ME=$(basename "$0")
TARGET="${RUNTIME_CONFIG_PATH:-/usr/share/nginx/html/runtime-config.js}"

fail() {
  echo "$ME: ERRO: $1" >&2
  exit 1
}

url="${WEB_API_REST_URL:-}"

# Barras finais são removidas: as rotas são concatenadas já começando com "/".
while [ "${url%/}" != "$url" ]; do
  url="${url%/}"
done

[ -n "$url" ] || fail "a variável WEB_API_REST_URL não foi definida (ex.: https://api.seudominio.com.br)."

# O valor é interpolado em JavaScript, então a validação é por lista branca: esquema http(s),
# host, porta e caminho opcionais. Isso barra aspas, barras invertidas, espaços, "<" e quebras
# de linha — ou seja, também impede injeção de código no arquivo gerado.
[ "$(printf '%s' "$url" | wc -l)" -eq 0 ] || fail "WEB_API_REST_URL não pode conter quebra de linha."
printf '%s' "$url" | grep -Eq '^https?://[A-Za-z0-9.-]+(:[0-9]{1,5})?(/[A-Za-z0-9._~/-]*)?$' \
  || fail "WEB_API_REST_URL inválida: '$url'. Formato esperado: http(s)://host[:porta][/caminho]."

cat > "$TARGET" <<JS
// Gerado por $ME na inicialização do container. Não editar: é sobrescrito a cada start.
globalThis.__CORE_RUNTIME_CONFIG__ = Object.freeze({ WEB_API_REST_URL: "$url" });
JS

echo "$ME: configuração de runtime gerada em $TARGET (WEB_API_REST_URL=$url)."
