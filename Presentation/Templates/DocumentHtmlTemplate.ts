import { IDocumentTemplate } from '../../Application/Interfaces/DataTransferObjects/Commercial/Documents/IDocumentTemplate';

export function get(data: IDocumentTemplate): string {
  const observationsBlock = data.observations
    ? `<p><span class="label">Observações:</span> ${escapeHtml(data.observations)}</p>`
    : '';

  const signatureBlock = buildSignatureBlock(data.customerSignatureImage);

  const title = `${escapeHtml(data.documentTitle)} ${data.id}`;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8"/>
  <title>${title}</title>
  <style>
    @page { margin: 12mm; }
    body { font-family: Arial, sans-serif; margin: 0; padding: 0; color: #333; }
    h1 { border-bottom: 2px solid #333; padding-bottom: 10px; margin: 0 0 16px; }
    .info p { margin: 4px 0; }
    .totals { margin-top: 20px; text-align: right; }
    .totals p { margin: 4px 0; }
    .label { font-weight: bold; }
    .signature { margin-top: 32px; }
    .signature .label { display: block; margin-bottom: 8px; }
    .signature img { max-width: 320px; max-height: 120px; display: block; }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <div class="info">
    <p><span class="label">Cliente:</span> ${escapeHtml(data.customerName)}</p>
    <p><span class="label">Data:</span> ${escapeHtml(data.creationDateTime)}</p>
    <p><span class="label">Forma de pagamento:</span> ${escapeHtml(data.paymentMethod)}</p>
    ${observationsBlock}
  </div>
  <div class="totals">
    <p><span class="label">Subtotal:</span> ${escapeHtml(data.valueSubtotal)}</p>
    <p><span class="label">Total:</span> ${escapeHtml(data.valueTotal)}</p>
  </div>
  ${signatureBlock}
</body>
</html>`;
}

function buildSignatureBlock(signature?: string): string {
  if (!signature) return '';

  const base64 = signature.replace(/^data:image\/png;base64,/, '').replace(/[^A-Za-z0-9+/=]/g, '');
  if (!base64) return '';

  return `<div class="signature">
    <span class="label">Assinatura do cliente</span>
    <img src="data:image/png;base64,${base64}" alt="Assinatura do cliente" />
  </div>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
