import { ExpoConfigWriter } from '../Expo/ExpoConfigWriter';
import { PackageJsonVersionWriter } from '../Versions/PackageJsonVersionWriter';
import { PwaArtifactSyncService } from './PwaArtifactSyncService';
import { PwaArtifactWriter } from './PwaArtifactWriter';
import { PwaManifestBuilder } from './PwaManifestBuilder';
import { PwaWebHeadMetadataBuilder } from './PwaWebHeadMetadataBuilder';

export class PwaCompositionRoot {
  static createArtifactSyncService(): PwaArtifactSyncService {
    return new PwaArtifactSyncService(
      new PwaManifestBuilder(),
      new PwaWebHeadMetadataBuilder(),
      new PwaArtifactWriter(),
      new ExpoConfigWriter(),
      new PackageJsonVersionWriter(),
    );
  }
}
