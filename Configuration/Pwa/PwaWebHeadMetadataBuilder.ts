import { AppBranding } from '../Brandings/AppBranding';
import { AppThemeColors } from '../Themes/AppThemeColors';
import { IPwaWebHeadMetadata } from './IPwaWebHeadMetadata';
import { IPwaWebHeadMetadataBuilder } from './IPwaWebHeadMetadataBuilder';
import { PwaPublicAssetUrls } from './PwaAssetPaths';

export class PwaWebHeadMetadataBuilder implements IPwaWebHeadMetadataBuilder {
  build(): IPwaWebHeadMetadata {
    return {
      title: AppBranding.name,
      description: AppBranding.description,
      themeColor: AppThemeColors.primary,
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
      this.serviceWorkerRegistrationScript(),
    ].join('\n    ');
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
