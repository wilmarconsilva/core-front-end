// Configuração de runtime: este arquivo é SUBSTITUÍDO na inicialização do container
// (Docker/runtime-config.sh), a partir das variáveis de ambiente do ambiente publicado.
// Fora do container (expo start, testes) fica vazio e valem as variáveis EXPO_PUBLIC_* do .env.
globalThis.__CORE_RUNTIME_CONFIG__ = {};
