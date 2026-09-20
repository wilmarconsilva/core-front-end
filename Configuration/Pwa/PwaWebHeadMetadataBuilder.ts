import { AppBranding } from '../Brandings/AppBranding';
import { appThemeColors } from '../Themes/AppThemeColors';
import { IPwaWebHeadMetadata } from './IPwaWebHeadMetadata';
import { IPwaWebHeadMetadataBuilder } from './IPwaWebHeadMetadataBuilder';
import { PwaPublicAssetUrls } from './PwaAssetPaths';

export class PwaWebHeadMetadataBuilder implements IPwaWebHeadMetadataBuilder {
  build(): IPwaWebHeadMetadata {
    return {
      title: AppBranding.name,
      description: AppBranding.description,
      themeColor: appThemeColors.primary,
      backgroundColor: appThemeColors.background,
      manifestPath: PwaPublicAssetUrls.manifest,
      appleMobileWebAppTitle: AppBranding.shortName,
      appleTouchIconPath: PwaPublicAssetUrls.icon192,
      languageTag: AppBranding.languageTag,
    };
  }

  toHtml(metadata: IPwaWebHeadMetadata): string {
    return [
      `<link rel="manifest" href="${metadata.manifestPath}" />`,
      `<meta name="mobile-web-app-capable" content="yes" />`,
      `<meta name="apple-mobile-web-app-capable" content="yes" />`,
      `<meta name="apple-mobile-web-app-status-bar-style" content="default" />`,
      `<meta name="apple-mobile-web-app-title" content="${metadata.appleMobileWebAppTitle}" />`,
      `<link rel="apple-touch-icon" href="${metadata.appleTouchIconPath}" />`,
      this.safeAreaStyle(metadata),
      this.serviceWorkerRegistrationScript(),
    ].join('\n    ');
  }

  /**
   * O recuo das faixas do sistema é responsabilidade da moldura da aplicação
   * (AppShell), que usa a mesma medição em iOS, Android e web — por isso não se
   * repete aqui. O que só o documento pode fazer é pintar o fundo antes de o
   * bundle subir, evitando a tarja branca no primeiro quadro.
   */
  private safeAreaStyle(metadata: IPwaWebHeadMetadata): string {
    return [
      '<style id="pwa-safe-area">',
      '      html,',
      '      body {',
      `        background-color: ${metadata.backgroundColor};`,
      '      }',
      '    </style>',
    ].join('\n');
  }

  private serviceWorkerRegistrationScript(): string {
    return [
      '<script>',
      "      if ('serviceWorker' in navigator) {",
      "        window.addEventListener('load', function () {",
      `          navigator.serviceWorker.register('${PwaPublicAssetUrls.serviceWorker}').catch(function () {});`,
      '        });',
      '      }',
      '    </script>',
    ].join('\n');
  }
}
