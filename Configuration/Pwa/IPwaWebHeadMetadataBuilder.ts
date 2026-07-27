import { IPwaWebHeadMetadata } from './IPwaWebHeadMetadata';

export interface IPwaWebHeadMetadataBuilder {
  build(): IPwaWebHeadMetadata;
  toHtml(metadata: IPwaWebHeadMetadata): string;
}
