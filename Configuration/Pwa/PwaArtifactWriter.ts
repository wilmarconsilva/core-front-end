import { promises as fs } from 'fs';
import path from 'path';
import { generateImageAsync } from '@expo/image-utils';
import { AppThemeColors } from '../Theme/AppThemeColors';
import { IPwaArtifactWriter } from './IPwaArtifactWriter';
import { IPwaManifest } from './IPwaManifest';
import { IPwaWebHeadMetadata } from './IPwaWebHeadMetadata';
import {
  PwaAssetPaths,
  PwaIconGenerationSizes,
} from './PwaAssetPaths';

const PWA_HEAD_START_MARKER = '<!-- PWA_HEAD_START -->';
const PWA_HEAD_END_MARKER = '<!-- PWA_HEAD_END -->';

export class PwaArtifactWriter implements IPwaArtifactWriter {
  async writeManifest(manifest: IPwaManifest, publicDirectoryPath: string): Promise<void> {
    await fs.mkdir(publicDirectoryPath, { recursive: true });

    const manifestPath = path.join(publicDirectoryPath, PwaAssetPaths.manifestFileName);
    await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  }

  async writeIcons(projectRoot: string, publicDirectoryPath: string): Promise<void> {
    await fs.mkdir(publicDirectoryPath, { recursive: true });

    const sourceLogoPath = path.join(projectRoot, PwaAssetPaths.sourceLogo);

    await Promise.all(
      PwaIconGenerationSizes.map(async ({ size, fileName }) => {
        const { source } = await generateImageAsync(
          { projectRoot, cacheType: 'pwa-icons' },
          {
            src: sourceLogoPath,
            width: size,
            height: size,
            resizeMode: 'contain',
            backgroundColor: AppThemeColors.surface,
          },
        );

        await fs.writeFile(path.join(publicDirectoryPath, fileName), source);
      }),
    );
  }

  async updateIndexHtml(
    _headMetadata: IPwaWebHeadMetadata,
    indexHtmlPath: string,
    headMetadataHtml: string,
  ): Promise<void> {
    const indexHtml = await fs.readFile(indexHtmlPath, 'utf8');
    const pwaHeadBlock = `${PWA_HEAD_START_MARKER}\n    ${headMetadataHtml}\n    ${PWA_HEAD_END_MARKER}`;

    const updatedIndexHtml = indexHtml.includes(PWA_HEAD_START_MARKER)
      ? indexHtml.replace(
          new RegExp(`${PWA_HEAD_START_MARKER}[\\s\\S]*?${PWA_HEAD_END_MARKER}`),
          pwaHeadBlock,
        )
      : indexHtml.replace(
          '<title>%WEB_TITLE%</title>',
          `<title>%WEB_TITLE%</title>\n    ${pwaHeadBlock}`,
        );

    await fs.writeFile(indexHtmlPath, updatedIndexHtml, 'utf8');
  }
}
