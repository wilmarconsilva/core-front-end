# syntax=docker/dockerfile:1

# ============================================
# Etapa 1: Build (Expo Web / PWA)
# ============================================

FROM node:22-alpine AS build

WORKDIR /src

ENV EXPO_NO_TELEMETRY=1 \
    CI=1

# Copia os manifests primeiro: a instalação de dependências só refaz quando eles mudam.
COPY package.json package-lock.json ./
RUN npm ci

# A URL da API NÃO entra no build: ela é definida na inicialização do container pela variável
# WEB_API_REST_URL (Docker/runtime-config.sh), então a mesma imagem serve qualquer ambiente.
#
# As demais variáveis EXPO_PUBLIC_* continuam embutidas no bundle em tempo de build. Declaradas
# DEPOIS do npm ci para que trocá-las não invalide o cache das dependências.
ARG EXPO_PUBLIC_OPERATION_MODE=""

ENV EXPO_PUBLIC_OPERATION_MODE=$EXPO_PUBLIC_OPERATION_MODE

# Copia o código-fonte
COPY . .

# Sincroniza os artefatos de PWA (public/) e exporta o site estático em /src/dist.
# Falha o build se o runtime-config.js não for exportado (o nginx serviria o index.html no lugar).
# O sed garante LF no script do entrypoint mesmo que o checkout no Windows o traga com CRLF.
RUN npm run build:web \
    && test -f dist/runtime-config.js \
    && sed -i 's/\r$//' Docker/runtime-config.sh


# ============================================
# Etapa 2: Runtime (nginx não-root, porta 8080)
# ============================================

FROM nginxinc/nginx-unprivileged:stable-alpine AS final

COPY Docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /src/dist /usr/share/nginx/html

# O runtime-config.js é reescrito na inicialização pelo usuário não-root do nginx (uid 101).
# Só esse arquivo recebe permissão de escrita; o restante do site continua somente-leitura.
COPY --from=build --chown=101:101 /src/dist/runtime-config.js /usr/share/nginx/html/runtime-config.js

# Scripts em /docker-entrypoint.d rodam antes do nginx; se falharem, o container não sobe.
COPY --from=build --chmod=0755 /src/Docker/runtime-config.sh /docker-entrypoint.d/40-runtime-config.sh

EXPOSE 8080
