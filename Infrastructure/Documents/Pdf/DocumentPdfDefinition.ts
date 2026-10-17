import type {
  Column,
  Content,
  ContentCanvas,
  ContentColumns,
  CustomTableLayout,
  TableCell,
  TDocumentDefinitions,
} from 'pdfmake/interfaces';
import {
  IDocumentTemplate,
  IDocumentTemplateCustomer,
  IDocumentTemplatePayment,
  IDocumentTemplateProduct,
  IDocumentTemplateSignature,
} from '../../../Application/Documents/DataTransferObjects/IDocumentTemplate';
import { DocumentSellerCompany } from '../../../Application/Documents/Templates/DocumentSellerCompany';
import { DOCUMENT_SELLER_COMPANY_LOGO } from '../../../Application/Documents/Templates/DocumentSellerCompanyLogo';

/**
 * Família registrada no pdfmake (Arimo: métricas idênticas às da Arial, licença SIL OFL 1.1). Os TTFs
 * vêm de github.com/googlefonts/Arimo (fonts/ttf): os servidos pelo Google Fonts terminam a tabela `glyf`
 * no último glifo (o NBSP), e o fontkit do pdfmake falha ao medi-lo ("Offset is outside the bounds").
 */
export const DOCUMENT_PDF_FONT_FAMILY = 'Arimo';

/** Milímetros para pontos (unidade do PDF). */
const mm = (value: number): number => (value * 72) / 25.4;

const PAGE_WIDTH = mm(210);
const PAGE_HEIGHT = mm(297);
const CONTENT_WIDTH = mm(180);

const Colors = {
  green: '#1b4d1b',
  greenShade: '#113013',
  greenSoft: '#eef4ee',
  line: '#c9d8c9',
  ink: '#1f1f1f',
  muted: '#444444',
  empty: '#666666',
  white: '#ffffff',
  black: '#000000',
} as const;

/** O pdfmake multiplica a altura natural da fonte (1,149 em na Arimo); converte o line-height do CSS. */
const lineHeight = (cssLineHeight: number): number => cssLineHeight / 1.149;

/**
 * Layout A4 do papel timbrado (orcamento_WS.docx). Grade geométrica, em mm:
 * margens laterais de 15 (conteúdo de 180), logo de 48,4 x 26,2 alinhado à margem direita
 * a 17,5 do topo, e reservas de 17,5/20 no topo/base de cada página para não invadir
 * os cantos decorativos, repetidos em todas as páginas pelo `background`.
 */
export function get(data: IDocumentTemplate): TDocumentDefinitions {
  return {
    pageSize: 'A4',
    pageMargins: [mm(15), mm(17.5), mm(15), mm(20)],
    info: { title: data.title, author: DocumentSellerCompany.name },
    background: buildPageBackground,
    defaultStyle: { font: DOCUMENT_PDF_FONT_FAMILY, fontSize: 11, lineHeight: lineHeight(1.35), color: Colors.ink },
    content: [
      buildHeader(data),
      buildCustomerSection(data.customer),
      buildProductsTable(data),
      buildPaymentSection(data.payment),
      buildObservationsSection(data),
      buildIssuerSection(),
      buildSignatures(data.sellerSignature, data.customerSignature),
    ],
  };
}

/** Cantos do papel timbrado (vetorizados de 1414 x 2000, proporção A4) e marca d'água. */
function buildPageBackground(): Content {
  const scale = (points: number[][]) =>
    points.map(([x, y]) => ({ x: (x * PAGE_WIDTH) / 1414, y: (y * PAGE_HEIGHT) / 2000 }));
  const polygon = (color: string, points: number[][]) =>
    ({ type: 'polyline' as const, points: scale(points), closePath: true, color, lineColor: color, lineWidth: 0 });

  return [
    {
      absolutePosition: { x: 0, y: 0 },
      canvas: [
        polygon(Colors.greenShade, [[0, 4], [160, 52], [0, 160]]),
        polygon(Colors.green, [[0, 0], [405, 0], [250, 96], [160, 52], [0, 4]]),
        polygon(Colors.greenShade, [[1414, 1795], [1265, 1918], [1414, 1975]]),
        polygon(Colors.green, [[1005, 2000], [1165, 1882], [1414, 1975], [1414, 2000]]),
      ],
    },
    {
      absolutePosition: { x: mm(15), y: mm(92) },
      image: DOCUMENT_SELLER_COMPANY_LOGO,
      width: CONTENT_WIDTH,
      opacity: 0.05,
    },
  ];
}

const NO_PADDING_LAYOUT: CustomTableLayout = {
  hLineWidth: () => 0,
  vLineWidth: () => 0,
  paddingLeft: () => 0,
  paddingRight: () => 0,
  paddingTop: () => 0,
  paddingBottom: () => 0,
};

function buildHeader(data: IDocumentTemplate): Content {
  const titleBlock: Content[] = [
    { text: data.title, fontSize: 20, bold: true, lineHeight: lineHeight(1.1), color: Colors.green },
    subtitle(`${DocumentSellerCompany.city}, ${data.issueDate}.`),
  ];

  return {
    layout: NO_PADDING_LAYOUT,
    table: {
      widths: ['*', mm(48.4)],
      heights: [mm(26.2)],
      body: [[
        { stack: titleBlock, verticalAlignment: 'bottom' },
        { image: DOCUMENT_SELLER_COMPANY_LOGO, width: mm(48.4), height: mm(26.2) },
      ]],
    },
  };
}

function subtitle(text: string): Content {
  return { text, fontSize: 10.5, color: Colors.muted, margin: [0, mm(1.2), 0, 0] };
}

function buildCustomerSection(customer: IDocumentTemplateCustomer): Content {
  const highlight = (label: string, value: string): Content =>
    ({ text: `${label} ${value}`, fontSize: 14, bold: true, lineHeight: lineHeight(1.3), color: Colors.green });

  return {
    margin: [0, mm(5), 0, 0],
    stack: [
      highlight('Cliente:', customer.name),
      ...(customer.city ? [highlight('Cidade:', customer.city)] : []),
      buildDetails([detailItem(customer.documentLabel || 'Documento', customer.document)]),
    ],
  };
}

interface IDetailItem {
  label: string;
  value?: string;
  link?: string;
  isWide?: boolean;
}

function detailItem(label: string, value?: string, link?: string, isWide = false): IDetailItem {
  return { label, value, link, isWide };
}

/** Grade de duas colunas (os itens largos ocupam a linha inteira); itens sem valor são omitidos. */
function buildDetails(items: IDetailItem[]): Content {
  const rows: IDetailItem[][] = [];

  for (const item of items.filter((current) => current.value)) {
    const lastRow = rows[rows.length - 1];

    if (item.isWide || !lastRow || lastRow.length === 2 || lastRow[0].isWide) rows.push([item]);
    else lastRow.push(item);
  }

  if (!rows.length) return [];

  return {
    margin: [0, mm(2), 0, 0],
    fontSize: 10,
    stack: rows.map((row, index): ContentColumns => ({
      columnGap: mm(8),
      margin: [0, index ? mm(1) : 0, 0, 0],
      columns: row[0].isWide
        ? [buildDetail(row[0])]
        : [buildDetail(row[0]), row[1] ? buildDetail(row[1]) : { text: '' }],
    })),
  };
}

function buildDetail(item: IDetailItem): Column {
  return {
    width: '*',
    columnGap: mm(1.5),
    columns: [
      { text: `${item.label}:`, bold: true, width: 'auto' },
      { text: item.value ?? '', link: item.link, width: '*' },
    ],
  };
}

type ProductsRowKind = 'bar' | 'columns' | 'product' | 'empty' | 'totals' | 'summary';

const PRODUCTS_CELL_HORIZONTAL_PADDING = mm(3.5);

/** No pdfmake a largura da coluna não inclui o padding: desconta-o das larguras totais (22 e 34 mm). */
const productsColumnWidth = (width: number): number => mm(width) - 2 * PRODUCTS_CELL_HORIZONTAL_PADDING;

const PRODUCTS_ROW_VERTICAL_PADDING: Record<ProductsRowKind, number> = {
  bar: mm(2),
  columns: mm(1.3),
  product: mm(1.3),
  empty: mm(8),
  totals: 0,
  summary: mm(1),
};

function buildProductsTable(data: IDocumentTemplate): Content {
  const bar = (text: string, alignment: 'left' | 'right'): TableCell[] => [
    { text, colSpan: 4, alignment, fillColor: Colors.green, color: Colors.white, fontSize: 13, bold: true },
    {}, {}, {},
  ];
  const columnHeader = (text: string, alignment: 'left' | 'right' = 'left'): TableCell =>
    ({ text: text.toUpperCase(), alignment, fontSize: 9, bold: true, color: Colors.green, characterSpacing: 0.18, noWrap: true });

  const kinds: ProductsRowKind[] = ['bar', 'columns'];
  const body: TableCell[][] = [
    bar('PRODUTOS', 'left'),
    [columnHeader('Descrição'), columnHeader('Qtd.', 'right'), columnHeader('Valor unitário', 'right'), columnHeader('Valor total', 'right')],
  ];

  if (data.products.length) {
    data.products.forEach((product, index) => {
      kinds.push('product');
      body.push(buildProductRow(product, index));
    });
  } else {
    kinds.push('empty');
    body.push([
      { text: 'Nenhum produto informado.', colSpan: 4, alignment: 'center', italics: true, color: Colors.empty },
      {}, {}, {},
    ]);
  }

  const totalsRow = kinds.length;
  kinds.push('totals');
  body.push([buildProductsTotals(data), {}, {}, {}]);

  return {
    margin: [0, mm(5), 0, 0],
    table: {
      widths: ['*', productsColumnWidth(22), productsColumnWidth(34), productsColumnWidth(34)],
      headerRows: 2,
      dontBreakRows: true,
      body,
    },
    layout: {
      // Barras verticais verdes nas laterais; linhas horizontais só entre colunas/produtos/totais.
      vLineWidth: (index, node) => (index === 0 || index === node.table.widths!.length ? mm(1) : 0),
      vLineColor: () => Colors.green,
      hLineWidth: (index) => {
        if (index === 2) return mm(0.4);
        if (index > 2 && index < totalsRow) return mm(0.2);
        return 0;
      },
      hLineColor: (index) => (index === 2 ? Colors.green : Colors.line),
      paddingLeft: () => PRODUCTS_CELL_HORIZONTAL_PADDING,
      paddingRight: () => PRODUCTS_CELL_HORIZONTAL_PADDING,
      paddingTop: (index) => PRODUCTS_ROW_VERTICAL_PADDING[kinds[index]],
      paddingBottom: (index) => PRODUCTS_ROW_VERTICAL_PADDING[kinds[index]],
    },
  };
}

/**
 * Subtotal, desconto e total numa única linha da tabela de produtos (tabela aninhada, com a mesma
 * última coluna): com `dontBreakRows` eles nunca se separam na quebra de página.
 */
function buildProductsTotals(data: IDocumentTemplate): TableCell {
  const summary = (label: string, value: string): TableCell[] => [
    { text: label, alignment: 'right', bold: true },
    { text: value, alignment: 'right', bold: true, noWrap: true },
  ];

  const kinds: ProductsRowKind[] = [];
  const body: TableCell[][] = [];

  if (data.discountValue) {
    kinds.push('summary', 'summary');
    body.push(summary('Subtotal', data.valueSubtotal), summary('Desconto', `- ${data.discountValue}`));
  }

  kinds.push('bar');
  body.push([
    {
      text: `VALOR TOTAL: ${data.valueTotal}`,
      colSpan: 2,
      alignment: 'right',
      fillColor: Colors.green,
      color: Colors.white,
      fontSize: 13,
      bold: true,
    },
    {},
  ]);

  return {
    colSpan: 4,
    // Cancels the outer cell padding: the nested table spans the whole row.
    margin: [-PRODUCTS_CELL_HORIZONTAL_PADDING, 0, -PRODUCTS_CELL_HORIZONTAL_PADDING, 0],
    table: { widths: ['*', productsColumnWidth(34)], body },
    layout: {
      vLineWidth: () => 0,
      hLineWidth: (index) => (index === 0 && data.discountValue ? mm(0.4) : 0),
      hLineColor: () => Colors.green,
      paddingLeft: () => PRODUCTS_CELL_HORIZONTAL_PADDING,
      paddingRight: () => PRODUCTS_CELL_HORIZONTAL_PADDING,
      paddingTop: (index) => PRODUCTS_ROW_VERTICAL_PADDING[kinds[index]],
      paddingBottom: (index) => PRODUCTS_ROW_VERTICAL_PADDING[kinds[index]],
    },
  };
}

function buildProductRow(product: IDocumentTemplateProduct, index: number): TableCell[] {
  const fillColor = index % 2 === 1 ? Colors.greenSoft : undefined;
  const number = (text: string): TableCell => ({ text, alignment: 'right', noWrap: true, fillColor });

  return [
    { text: product.description, fillColor },
    number(product.quantity),
    number(product.valueUnit),
    number(product.valueTotal),
  ];
}

function buildPaymentSection(payment: IDocumentTemplatePayment): Content {
  const line = (label: string, value: string | undefined, index: number): Content[] =>
    value ? [{ text: [{ text: `${label} `, bold: true }, value], margin: [0, index ? mm(1) : 0, 0, 0] }] : [];

  return {
    margin: [0, mm(5), 0, 0],
    stack: [
      ...line('FORMA DE PAGAMENTO:', payment.method, 0),
      ...line('ENTRADA:', payment.downPayment, 1),
      ...line('FORMA DE PAGAMENTO DA ENTRADA:', payment.downPaymentMethod, 1),
      ...line('PARCELAMENTO:', payment.installments, 1),
    ],
  };
}

/** Cada observação só é impressa se existir; sem nenhuma, a seção é omitida. */
function buildObservationsSection(data: IDocumentTemplate): Content {
  const observations = [
    { label: 'Observações:', value: data.observations },
    { label: 'Observações adicionais:', value: DocumentSellerCompany.additionalObservations },
  ].filter((observation): observation is { label: string; value: string } => !!observation.value);

  if (!observations.length) return [];

  return {
    margin: [0, mm(5), 0, 0],
    stack: observations.map(({ label, value }, index): Content => ({
      text: [{ text: `${label} `, bold: true }, value],
      margin: [0, index ? mm(2) : 0, 0, 0],
    })),
  };
}

function buildIssuerSection(): Content {
  return {
    unbreakable: true,
    margin: [0, mm(5), 0, 0],
    stack: [
      horizontalLine(CONTENT_WIDTH, mm(0.3), Colors.line),
      {
        text: DocumentSellerCompany.name,
        fontSize: 13,
        bold: true,
        color: Colors.green,
        margin: [0, mm(3), 0, 0],
      },
      buildDetails([
        detailItem('Endereço', DocumentSellerCompany.address, undefined, true),
        detailItem('Telefones', DocumentSellerCompany.phones),
        detailItem('Site', DocumentSellerCompany.site.label, DocumentSellerCompany.site.url),
        detailItem('E-mail', DocumentSellerCompany.email.label, DocumentSellerCompany.email.url),
        detailItem('Instagram', DocumentSellerCompany.instagram.label, DocumentSellerCompany.instagram.url),
      ]),
      { text: DocumentSellerCompany.presentation, fontSize: 9.5, italics: true, margin: [0, mm(1.5), 0, 0] },
    ],
  };
}

function horizontalLine(width: number, lineWidth: number, lineColor: string): ContentCanvas {
  return { canvas: [{ type: 'line', x1: 0, y1: 0, x2: width, y2: 0, lineWidth, lineColor }] };
}

const SIGNATURE_WIDTH = mm(80);
const SIGNATURE_IMAGE_HEIGHT = mm(20);

/** Cada assinatura só é impressa se existir, mas mantém sua coluna (vendedor à esquerda, cliente à direita). */
function buildSignatures(seller: IDocumentTemplateSignature, customer: IDocumentTemplateSignature): Content {
  if (!seller.image && !customer.image) return [];

  return {
    unbreakable: true,
    margin: [0, mm(5), 0, 0],
    columns: [
      buildSignature(seller, `Vendedor da ${DocumentSellerCompany.shortName}`),
      { text: '', width: '*' },
      buildSignature(customer, 'Cliente'),
    ],
  };
}

function buildSignature(signature: IDocumentTemplateSignature, role: string): Column {
  if (!signature.image) return { text: '', width: SIGNATURE_WIDTH };

  return {
    width: SIGNATURE_WIDTH,
    alignment: 'center',
    stack: [
      {
        layout: NO_PADDING_LAYOUT,
        table: {
          widths: [SIGNATURE_WIDTH],
          heights: [SIGNATURE_IMAGE_HEIGHT],
          body: [[{
            image: signature.image,
            fit: [SIGNATURE_WIDTH, SIGNATURE_IMAGE_HEIGHT],
            alignment: 'center',
            verticalAlignment: 'bottom',
          }]],
        },
      },
      { ...horizontalLine(SIGNATURE_WIDTH, mm(0.3), Colors.black), margin: [0, mm(1), 0, 0] },
      { text: role, fontSize: 10.5, bold: true, margin: [0, mm(1.5), 0, 0] },
      ...(signature.name ? [{ text: signature.name, fontSize: 10 }] : []),
    ],
  };
}
