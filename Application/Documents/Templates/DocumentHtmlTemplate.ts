import {
  IDocumentTemplate,
  IDocumentTemplateCustomer,
  IDocumentTemplatePayment,
  IDocumentTemplateProduct,
  IDocumentTemplateSignature,
} from '../DataTransferObjects/IDocumentTemplate';
import { DocumentSellerCompany } from './DocumentSellerCompany';
import { DOCUMENT_SELLER_COMPANY_LOGO } from './DocumentSellerCompanyLogo';

/**
 * Layout A4 do papel timbrado (orcamento_WS.docx). Grade geométrica, em mm:
 * margens laterais de 15 (conteúdo de 180), logo de 48,4 x 26,2 alinhado à margem direita
 * a 17,5 do topo, e reservas de 17,5/20 no topo/base de cada página para não invadir
 * os cantos decorativos. As reservas ficam em thead/tfoot porque o navegador os repete
 * em todas as páginas impressas.
 */
export function get(documentTitle: string, data: IDocumentTemplate): string {
  const title = data.number ? `${documentTitle} ${data.number}` : documentTitle;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8"/>
  <title>${escapeHtml(title)}</title>
  <style>${STYLES}</style>
</head>
<body>
  ${PAGE_BACKGROUND}
  <table class="page">
    <thead><tr><td><div class="page-top"></div></td></tr></thead>
    <tfoot><tr><td><div class="page-bottom"></div></td></tr></tfoot>
    <tbody><tr><td class="page-content">
      <header class="document-header">
        <div>
          <h1>${escapeHtml(title)}</h1>
          <p class="document-subtitle">${escapeHtml(DocumentSellerCompany.city)}, ${escapeHtml(data.issueDate)}.</p>
          ${data.budgetId ? `<p class="document-subtitle">Originado através do orçamento ${data.budgetId}</p>` : ''}
        </div>
        <img class="logo" src="${DOCUMENT_SELLER_COMPANY_LOGO}" alt="${escapeHtml(DocumentSellerCompany.name)}" />
      </header>
      ${buildCustomerSection(data.customer)}
      ${buildProductsTable(data)}
      ${buildPaymentSection(data.payment, data.observations)}
      ${buildIssuerSection()}
      ${buildSignatures(data.sellerSignature, data.customerSignature)}
    </td></tr></tbody>
  </table>
</body>
</html>`;
}

function buildCustomerSection(customer: IDocumentTemplateCustomer): string {
  const details = [
    detailItem(customer.documentLabel ?? 'Documento', customer.document)
  ].join('');

  return `<section class="customer">
        <p class="highlight"><span>Cliente:</span> ${escapeHtml(customer.name)}</p>
        ${customer.city ? `<p class="highlight"><span>Cidade:</span> ${escapeHtml(customer.city)}</p>` : ''}
        ${details ? `<dl class="details">${details}</dl>` : ''}
      </section>`;
}

function detailItem(label: string, value?: string, className = '', href?: string): string {
  if (!value) return '';

  const content = href ? `<a href="${escapeHtml(href)}">${escapeHtml(value)}</a>` : escapeHtml(value);

  return `<div class="detail ${className}"><dt>${escapeHtml(label)}:</dt><dd>${content}</dd></div>`;
}

function buildProductsTable(data: IDocumentTemplate): string {
  const rows = data.products.length
    ? data.products.map(buildProductRow).join('')
    : '<tr><td colspan="4" class="empty">Nenhum produto informado.</td></tr>';

  const discountRows = data.discountValue
    ? `<tr class="summary"><td colspan="3">Subtotal</td><td class="number">${escapeHtml(data.valueSubtotal)}</td></tr>
          <tr class="summary"><td colspan="3">Desconto</td><td class="number">- ${escapeHtml(data.discountValue)}</td></tr>`
    : '';

  return `<table class="products">
        <colgroup><col/><col class="col-quantity"/><col class="col-value"/><col class="col-value"/></colgroup>
        <thead>
          <tr><th colspan="4" class="bar">PRODUTOS</th></tr>
          <tr class="columns"><th>Descrição</th><th class="number">Qtd.</th><th class="number">Valor unitário</th><th class="number">Valor total</th></tr>
        </thead>
        <tbody>${rows}</tbody>
        <tbody class="totals">
          ${discountRows}
          <tr><td colspan="4" class="bar number">VALOR TOTAL: ${escapeHtml(data.valueTotal)}</td></tr>
        </tbody>
      </table>`;
}

function buildProductRow(product: IDocumentTemplateProduct): string {
  return `<tr>
            <td>${escapeHtml(product.description)}</td>
            <td class="number">${escapeHtml(product.quantity)}</td>
            <td class="number">${escapeHtml(product.valueUnit)}</td>
            <td class="number">${escapeHtml(product.valueTotal)}</td>
          </tr>`;
}

function buildPaymentSection(payment: IDocumentTemplatePayment, observations?: string): string {
  return `<section class="payment">
        <p><span class="label">FORMA DE PAGAMENTO:</span> ${escapeHtml(payment.method)}</p>
        ${payment.downPayment ? `<p><span class="label">ENTRADA:</span> ${escapeHtml(payment.downPayment)}</p>` : ''}
        ${payment.installments ? `<p><span class="label">PARCELAMENTO:</span> ${escapeHtml(payment.installments)}</p>` : ''}
        ${observations ? `<p class="observations"><span class="label">Observações:</span> ${escapeHtml(observations)}</p>` : ''}
      </section>`;
}

function buildIssuerSection(): string {
  const contacts = [
    detailItem('Endereço', DocumentSellerCompany.address, 'detail-wide'),
    detailItem('Telefones', DocumentSellerCompany.phones),
    detailItem('Site', DocumentSellerCompany.site.label, '', DocumentSellerCompany.site.url),
    detailItem('E-mail', DocumentSellerCompany.email.label, '', DocumentSellerCompany.email.url),
    detailItem('Instagram', DocumentSellerCompany.instagram.label, '', DocumentSellerCompany.instagram.url)
  ].join('');

  return `<section class="issuer">
        <p class="issuer-name">${escapeHtml(DocumentSellerCompany.name)}</p>
        <dl class="details">${contacts}</dl>
        <p class="issuer-presentation">${escapeHtml(DocumentSellerCompany.presentation)}</p>
      </section>`;
}

/** Cada assinatura só é impressa se existir, mas mantém sua coluna (vendedor à esquerda, cliente à direita). */
function buildSignatures(seller: IDocumentTemplateSignature, customer: IDocumentTemplateSignature): string {
  const signatures = [
    buildSignature(seller, `Vendedor da ${DocumentSellerCompany.shortName}`, 'signature-seller'),
    buildSignature(customer, 'Cliente', 'signature-customer'),
  ].join('');

  return signatures ? `<div class="signatures">${signatures}</div>` : '';
}

function buildSignature(signature: IDocumentTemplateSignature, role: string, className: string): string {
  if (!signature.image) return '';

  return `<div class="signature ${className}">
          <div class="signature-image"><img src="${escapeHtml(signature.image)}" alt="Assinatura - ${escapeHtml(role)}" /></div>
          <p class="signature-role">${escapeHtml(role)}</p>
          ${signature.name ? `<p class="signature-name">${escapeHtml(signature.name)}</p>` : ''}
        </div>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Cantos do papel timbrado (vetorizados de 1414 x 2000, proporção A4) e marca d'água, repetidos em toda página. */
const PAGE_BACKGROUND = `<div class="page-background" aria-hidden="true">
    <svg viewBox="0 0 1414 2000" preserveAspectRatio="none">
      <polygon class="shade" points="0,4 160,52 0,160"/>
      <polygon class="tone" points="0,0 405,0 250,96 160,52 0,4"/>
      <polygon class="shade" points="1414,1795 1265,1918 1414,1975"/>
      <polygon class="tone" points="1005,2000 1165,1882 1414,1975 1414,2000"/>
    </svg>
    <img class="watermark" src="${DOCUMENT_SELLER_COMPANY_LOGO}" alt="" />
  </div>`;

const STYLES = `
    @page { size: A4; margin: 0; }
    :root { --green: #1b4d1b; --green-shade: #113013; --green-soft: #eef4ee; --line: #c9d8c9; --ink: #1f1f1f; }
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; }
    body {
      font-family: Arial, Helvetica, sans-serif; font-size: 11pt; line-height: 1.35; color: var(--ink);
      -webkit-print-color-adjust: exact; print-color-adjust: exact;
    }
    p { margin: 0; }

    .page-background { position: fixed; top: 0; left: 0; width: 210mm; height: 297mm; z-index: -1; }
    .page-background svg { position: absolute; inset: 0; width: 100%; height: 100%; }
    .page-background .tone { fill: var(--green); }
    .page-background .shade { fill: var(--green-shade); }
    .watermark { position: absolute; left: 15mm; top: 92mm; width: 180mm; opacity: 0.05; }

    .page { width: 210mm; border-collapse: collapse; }
    .page > thead > tr > td, .page > tfoot > tr > td { padding: 0; }
    .page-top { height: 17.5mm; }
    .page-bottom { height: 20mm; }
    .page-content { padding: 0 15mm; vertical-align: top; }

    .document-header { display: flex; justify-content: space-between; align-items: flex-end; height: 26.2mm; }
    .document-header h1 { margin: 0; font-size: 20pt; line-height: 1.1; color: var(--green); }
    .document-subtitle { margin-top: 1.2mm; font-size: 10.5pt; color: #444; }
    .logo { width: 48.4mm; height: 26.2mm; display: block; }

    .customer { margin-top: 5mm; }
    .highlight { font-size: 14pt; font-weight: bold; color: var(--green); line-height: 1.3; }
    .details {
      display: grid; grid-template-columns: 1fr 1fr; column-gap: 8mm; row-gap: 1mm;
      margin: 2mm 0 0; font-size: 10pt;
    }
    .detail { display: flex; gap: 1.5mm; min-width: 0; }
    .detail-wide { grid-column: 1 / -1; }
    .detail dt { font-weight: bold; white-space: nowrap; }
    .detail dd { margin: 0; overflow-wrap: anywhere; }
    .detail dd a { color: inherit; text-decoration: none; }

    .products { width: 100%; margin-top: 5mm; border-collapse: collapse; table-layout: fixed; }
    .products .col-quantity { width: 22mm; }
    .products .col-value { width: 34mm; }
    .products th, .products td { padding: 1.3mm 3.5mm; text-align: left; vertical-align: top; }
    .products tr > :first-child { border-left: 1mm solid var(--green); }
    .products tr > :last-child { border-right: 1mm solid var(--green); }
    .products .number { text-align: right; white-space: nowrap; }
    .products .bar { padding: 2mm 3.5mm; background: var(--green); color: #fff; font-size: 13pt; font-weight: bold; }
    .products .columns th {
      font-size: 9pt; text-transform: uppercase; letter-spacing: 0.02em; color: var(--green);
      border-bottom: 0.4mm solid var(--green);
    }
    .products tbody tr { break-inside: avoid; }
    .products tbody:not(.totals) tr + tr td { border-top: 0.2mm solid var(--line); }
    .products tbody:not(.totals) tr:nth-child(even) td { background: var(--green-soft); }
    .products .empty { padding: 8mm 3.5mm; text-align: center; font-style: italic; color: #666; }
    .products .summary td { padding-top: 1mm; padding-bottom: 1mm; font-weight: bold; text-align: right; }
    .products .summary:first-child td { border-top: 0.4mm solid var(--green); }
    .products .totals { break-inside: avoid; }

    .payment { margin-top: 5mm; font-size: 11pt; }
    .payment p + p { margin-top: 1mm; }
    .label { font-weight: bold; }
    .observations { margin-top: 2mm !important; white-space: pre-line; }

    .issuer { margin-top: 5mm; padding-top: 3mm; border-top: 0.3mm solid var(--line); break-inside: avoid; }
    .issuer-name { font-size: 13pt; font-weight: bold; color: var(--green); }
    .issuer-presentation { margin-top: 1.5mm; font-size: 9.5pt; font-style: italic; }

    .signatures { display: grid; grid-template-columns: 80mm 80mm; justify-content: space-between; margin-top: 5mm; break-inside: avoid; }
    .signature { text-align: center; }
    .signature-seller { grid-column: 1; }
    .signature-customer { grid-column: 2; }
    .signature-image { display: flex; align-items: flex-end; justify-content: center; height: 20mm; }
    .signature-image img { max-width: 100%; max-height: 20mm; object-fit: contain; }
    .signature-role { margin-top: 1mm; padding-top: 1.5mm; border-top: 0.3mm solid #000; font-size: 10.5pt; font-weight: bold; }
    .signature-name { font-size: 10pt; }
  `;
