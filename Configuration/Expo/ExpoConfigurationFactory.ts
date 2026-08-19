import { AppBranding } from '../Brandings/AppBranding';
import { AppThemeColors } from '../Themes/AppThemeColors';
import { AppVersion } from '../Versions/AppVersion';
import { PwaAssetPaths } from '../Pwa/PwaAssetPaths';
import { ExpoProjectIdentity } from './ExpoProjectIdentity';

export class ExpoConfigurationFactory {
  static create() {
    return {
      expo: {
        name: AppBranding.name,
        slug: ExpoProjectIdentity.slug,
        version: AppVersion.semanticVersion,
        orientation: 'portrait',
        icon: PwaAssetPaths.sourceLogo,
        userInterfaceStyle: 'light',
        splash: {
          image: PwaAssetPaths.sourceLogo,
          resizeMode: 'contain',
          backgroundColor: AppThemeColors.surface,
        },
        android: {
          adaptiveIcon: {
            foregroundImage: PwaAssetPaths.sourceLogo,
            backgroundColor: AppThemeColors.surface,
          },
          newArchEnabled: true,
          edgeToEdge: {
            enabled: true,
          },
          predictiveBackGestureEnabled: false,
        },
        ios: {
          supportsTablet: true,
          newArchEnabled: true,
        },
        web: {
          favicon: PwaAssetPaths.sourceLogo,
          name: AppBranding.shortName,
          shortName: AppBranding.shortName,
          description: AppBranding.description,
          themeColor: AppThemeColors.primary,
          backgroundColor: AppThemeColors.surface,
          display: 'standalone',
          orientation: 'any',
          lang: AppBranding.languageTag,
          scope: '/',
          startUrl: '/',
        },
        plugins: ['expo-font'],
      },
    };
  }
}
