export const PwaAssetPaths = {
  sourceLogo: './assets/logo.png',
  manifestFileName: 'manifest.json',
  icon192FileName: 'pwa-icon-192.png',
  icon512FileName: 'pwa-icon-512.png',
  serviceWorkerFileName: 'service-worker.js',
  runtimeConfigFileName: 'runtime-config.js',
  publicDirectory: 'public',
  indexHtmlFileName: 'index.html',
} as const;

export const PwaPublicAssetUrls = {
  manifest: `/${PwaAssetPaths.manifestFileName}`,
  icon192: `/${PwaAssetPaths.icon192FileName}`,
  icon512: `/${PwaAssetPaths.icon512FileName}`,
  serviceWorker: `/${PwaAssetPaths.serviceWorkerFileName}`,
  runtimeConfig: `/${PwaAssetPaths.runtimeConfigFileName}`,
} as const;

export const PwaIconGenerationSizes = [
  { size: 192, fileName: PwaAssetPaths.icon192FileName },
  { size: 512, fileName: PwaAssetPaths.icon512FileName },
] as const;
