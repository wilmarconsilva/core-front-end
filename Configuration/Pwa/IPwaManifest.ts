import { PwaDisplayMode } from './PwaDisplayMode';
import { IPwaManifestIcon } from './IPwaManifestIcon';

export interface IPwaManifest {
  readonly name: string;
  readonly short_name: string;
  readonly description: string;
  readonly start_url: string;
  readonly scope: string;
  readonly display: PwaDisplayMode;
  readonly theme_color: string;
  readonly background_color: string;
  readonly orientation: 'any' | 'natural' | 'portrait' | 'landscape';
  readonly lang: string;
  readonly icons: readonly IPwaManifestIcon[];
}
