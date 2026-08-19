import { AppBranding } from '../Brandings/AppBranding';
import { appThemeColors } from '../Themes/appThemeColors';
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
          backgroundColor: appThemeColors.surface,
        },
        android: {
          adaptiveIcon: {
            foregroundImage: PwaAssetPaths.sourceLogo,
            backgroundColor: appThemeColors.surface,
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
          themeColor: appThemeColors.primary,
          backgroundColor: appThemeColors.surface,
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
