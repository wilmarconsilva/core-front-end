import path from 'path';
import { ExpoConfigWriter } from '../Expo/ExpoConfigWriter';
import { AppVersion } from '../Versions/AppVersion';
import { IPackageJsonVersionWriter } from '../Versions/Interfaces/IPackageJsonVersionWriter';
import { IPwaArtifactWriter } from './IPwaArtifactWriter';
import { IPwaManifestBuilder } from './IPwaManifestBuilder';
import { IPwaWebHeadMetadataBuilder } from './IPwaWebHeadMetadataBuilder';
import { PwaAssetPaths } from './PwaAssetPaths';

export interface IPwaArtifactSyncService {
  sync(projectRoot: string): Promise<void>;
}

export class PwaArtifactSyncService implements IPwaArtifactSyncService {
  constructor(
    private readonly manifestBuilder: IPwaManifestBuilder,
    private readonly webHeadMetadataBuilder: IPwaWebHeadMetadataBuilder,
    private readonly artifactWriter: IPwaArtifactWriter,
    private readonly expoConfigWriter: ExpoConfigWriter,
    private readonly packageJsonVersionWriter: IPackageJsonVersionWriter,
  ) {}

  async sync(projectRoot: string): Promise<void> {
    const publicDirectoryPath = path.join(projectRoot, PwaAssetPaths.publicDirectory);
    const indexHtmlPath = path.join(publicDirectoryPath, PwaAssetPaths.indexHtmlFileName);
    const serviceWorkerPath = path.join(publicDirectoryPath, PwaAssetPaths.serviceWorkerFileName);

    const manifest = this.manifestBuilder.build();
    const headMetadata = this.webHeadMetadataBuilder.build();
    const headMetadataHtml = this.webHeadMetadataBuilder.toHtml(headMetadata);

    await this.expoConfigWriter.write(projectRoot);
    await this.packageJsonVersionWriter.write(projectRoot, AppVersion.semanticVersion);
    await this.artifactWriter.writeIcons(projectRoot, publicDirectoryPath);
    await this.artifactWriter.writeManifest(manifest, publicDirectoryPath);
    await this.artifactWriter.updateIndexHtml(headMetadata, indexHtmlPath, headMetadataHtml);
    await this.artifactWriter.updateServiceWorkerCacheVersion(
      AppVersion.semanticVersion,
      serviceWorkerPath,
    );
  }
}
