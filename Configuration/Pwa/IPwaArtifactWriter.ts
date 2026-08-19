import { IPwaManifest } from './IPwaManifest';
import { IPwaWebHeadMetadata } from './IPwaWebHeadMetadata';

export interface IPwaArtifactWriter {
  writeManifest(manifest: IPwaManifest, publicDirectoryPath: string): Promise<void>;
  writeIcons(projectRoot: string, publicDirectoryPath: string): Promise<void>;
  updateIndexHtml(
    headMetadata: IPwaWebHeadMetadata,
    indexHtmlPath: string,
    headMetadataHtml: string,
  ): Promise<void>;
  updateServiceWorkerCacheVersion(cacheVersion: string, serviceWorkerPath: string): Promise<void>;
}
