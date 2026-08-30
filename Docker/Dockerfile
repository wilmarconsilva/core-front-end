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

# As variáveis EXPO_PUBLIC_* são embutidas no bundle em tempo de build (não são lidas em runtime).
# Consequência: mudar a URL da API exige rebuild da imagem. Declaradas DEPOIS do npm ci
# para que trocar a URL não invalide o cache das dependências.
ARG EXPO_PUBLIC_WEB_SERVICE_URL
ARG EXPO_PUBLIC_OPERATION_MODE=""

ENV EXPO_PUBLIC_WEB_SERVICE_URL=$EXPO_PUBLIC_WEB_SERVICE_URL \
    EXPO_PUBLIC_OPERATION_MODE=$EXPO_PUBLIC_OPERATION_MODE

# Falha cedo e com mensagem clara: sem a URL da API o app quebra no primeiro import
# (Application/Services/HttpClientService.ts).
RUN test -n "$EXPO_PUBLIC_WEB_SERVICE_URL" \
    || (echo "ERRO: build arg EXPO_PUBLIC_WEB_SERVICE_URL é obrigatório." && exit 1)

# Copia o código-fonte
COPY . .

# Sincroniza os artefatos de PWA (public/) e exporta o site estático em /src/dist
RUN npm run build:web


# ============================================
# Etapa 2: Runtime (nginx não-root, porta 8080)
# ============================================

FROM nginxinc/nginx-unprivileged:stable-alpine AS final

COPY Docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /src/dist /usr/share/nginx/html

EXPOSE 8080
