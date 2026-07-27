export interface IPwaManifestIcon {
  readonly src: string;
  readonly sizes: string;
  readonly type: string;
  readonly purpose?: 'any' | 'maskable' | 'monochrome';
}
