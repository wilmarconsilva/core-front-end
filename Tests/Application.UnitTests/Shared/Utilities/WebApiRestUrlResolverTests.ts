import { resolveWebApiRestUrl } from '../../../../Application/Shared/Utilities/WebApiRestUrlResolver';

describe('resolveWebApiRestUrl', () => {
  const RUNTIME_URL = 'https://api-hml.exemplo.com.br';
  const BUILD_TIME_URL = 'https://localhost:7294';

  it('ResolveWebApiRestUrl_ComUrlDeRuntimeEDeBuild_PriorizaARuntime', () => {
    expect(resolveWebApiRestUrl(RUNTIME_URL, BUILD_TIME_URL)).toBe(RUNTIME_URL);
  });

  it('ResolveWebApiRestUrl_SemUrlDeRuntime_UsaADeBuild', () => {
    expect(resolveWebApiRestUrl(undefined, BUILD_TIME_URL)).toBe(BUILD_TIME_URL);
  });

  it('ResolveWebApiRestUrl_ComUrlDeRuntimeEmBranco_UsaADeBuild', () => {
    expect(resolveWebApiRestUrl('   ', BUILD_TIME_URL)).toBe(BUILD_TIME_URL);
  });

  it('ResolveWebApiRestUrl_ComEspacosEBarraFinal_NormalizaAUrl', () => {
    expect(resolveWebApiRestUrl(`  ${RUNTIME_URL}// `, undefined)).toBe(RUNTIME_URL);
  });

  it('ResolveWebApiRestUrl_SemNenhumaUrl_LancaErro', () => {
    expect(() => resolveWebApiRestUrl(undefined, '')).toThrow('WEB_API_REST_URL');
  });
});
