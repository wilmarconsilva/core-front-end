export interface ISignatureCanvasProps {
  value?: string | null;
  onSignatureChange: (signatureBase64: string | null) => void;
  width?: number;
  height?: number;
}
