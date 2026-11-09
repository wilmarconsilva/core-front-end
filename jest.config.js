const nodePreset = require('jest-expo/node/jest-preset');

/** O `idb` é distribuído apenas como ESM e, como os pacotes React Native, precisa ser transpilado. */
const [expoTransformIgnorePattern, ...otherTransformIgnorePatterns] = nodePreset.transformIgnorePatterns;
const transformIgnorePatterns = [
  expoTransformIgnorePattern.replace('(?!(', '(?!(idb|'),
  ...otherTransformIgnorePatterns,
];

/**
 * Cada suíte de testes é um projeto do Jest (espelhando os projetos de `core-back-end/Tests`).
 * Futuros testes de componentes React Native entram como outro projeto, com `preset: 'jest-expo'`.
 */
module.exports = {
  // A primeira sessão de cada arquivo transpila a cadeia de módulos do composition root (incluindo pacotes React Native).
  testTimeout: 30000,
  projects: [
    {
      displayName: 'unit',
      preset: 'jest-expo/node',
      testMatch: ['<rootDir>/Tests/Application.UnitTests/**/*Tests.ts'],
      transformIgnorePatterns,
    },
    {
      displayName: 'integration',
      // Preset de Node: a sincronização não renderiza componentes, e o IndexedDB é simulado em memória.
      preset: 'jest-expo/node',
      testMatch: ['<rootDir>/Tests/Application.IntegrationTests/**/*Tests.ts'],
      setupFilesAfterEnv: ['<rootDir>/Tests/Application.IntegrationTests/Fixtures/JestSetup.ts'],
      transformIgnorePatterns,
    },
    {
      displayName: 'integration:infrastructure',
      preset: 'jest-expo/node',
      testMatch: ['<rootDir>/Tests/Infrastructure.IntegrationTests/**/*Tests.ts'],
      setupFilesAfterEnv: ['<rootDir>/Tests/Infrastructure.IntegrationTests/Fixtures/JestSetup.ts'],
      transformIgnorePatterns,
      // O mesmo build de navegador que o Metro empacota (no Node, `pdfmake` resolveria a versão de servidor).
      moduleNameMapper: { '^pdfmake$': '<rootDir>/node_modules/pdfmake/build/pdfmake.js' },
    },
  ],
};
