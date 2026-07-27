import { AppBranding } from '../Branding/AppBranding';
import { AppThemeColors } from '../Theme/AppThemeColors';
import { IPwaManifest } from './IPwaManifest';
import { IPwaManifestBuilder } from './IPwaManifestBuilder';
import { PwaPublicAssetUrls } from './PwaAssetPaths';

export class PwaManifestBuilder implements IPwaManifestBuilder {
  build(): IPwaManifest {
    return {
      name: AppBranding.name,
      short_name: AppBranding.shortName,
      description: AppBranding.description,
      start_url: '/',
      scope: '/',
      display: 'standalone',
      theme_color: AppThemeColors.primary,
      background_color: AppThemeColors.surface,
      orientation: 'any',
      lang: AppBranding.languageTag,
      icons: [
        {
          src: PwaPublicAssetUrls.icon192,
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: PwaPublicAssetUrls.icon512,
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: PwaPublicAssetUrls.icon512,
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    };
  }
}
