import React from 'react';
import { Text, View } from 'react-native';
import { IDocumentReport } from '../../Application/Interfaces/DataTransferObjects/Commercial/Documents/Reports/IDocumentReport';
import { formatCurrency } from '../../Application/Services/Utilities/FormatUtilities';
import { documentReportScreenStyles as styles } from '../Styles';

interface IDocumentReportCardProps {
  report: IDocumentReport;
  isAlternate: boolean;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.reportDetailRow}>
      <Text style={styles.reportDetailLabel}>{label}</Text>
      <Text style={styles.reportDetailValue}>{value}</Text>
    </View>
  );
}

/** Exibe todos os campos de um IDocumentReport (usado por relatórios de Pedidos e Orçamentos). */
export function DocumentReportCard({ report, isAlternate }: IDocumentReportCardProps) {
  const hasInstallments = !!report.paymentInstallmentQuantity;
  const hasDownPayment = !!report.paymentInstallmentDownPaymentValue;
  const showLastUpdate = report.lastUpdateDateTime && report.lastUpdateDateTime !== report.creationDateTime;

  return (
    <View style={[styles.reportRow, isAlternate ? styles.reportRowAlt : null]}>
      <View style={styles.reportHeader}>
        <Text style={styles.reportId}>{report.id}</Text>
        <Text style={styles.reportTotal}>{formatCurrency(report.valueTotal)}</Text>
      </View>

      <Text style={styles.reportCustomer}>{report.customerName}</Text>
      <Text style={styles.reportCity}>{report.customerLocalityState}</Text>
      <Text style={styles.reportDate}>Criado em {report.creationDateTime}</Text>
      {showLastUpdate && (
        <Text style={styles.reportDate}>Última atualização em {report.lastUpdateDateTime}</Text>
      )}

      <View style={styles.reportSection}>
        <DetailRow label="Subtotal" value={formatCurrency(report.valueSubtotal)} />
        {report.paymentDiscountValue > 0 && (
          <DetailRow label="Desconto" value={formatCurrency(report.paymentDiscountValue)} />
        )}
        <DetailRow label="Forma de pagamento" value={report.paymentMethodDescription} />
      </View>

      {hasInstallments && (
        <View style={styles.reportSection}>
          <DetailRow
            label="Parcelamento"
            value={`${report.paymentInstallmentQuantity}x de ${formatCurrency(report.paymentInstallmentValue ?? 0)}`}
          />
          {hasDownPayment && (
            <>
              <DetailRow label="Entrada" value={formatCurrency(report.paymentInstallmentDownPaymentValue ?? 0)} />
              {report.paymentInstallmentDownPaymentPercentage !== undefined && (
                <DetailRow label="Percentual de entrada" value={`${report.paymentInstallmentDownPaymentPercentage}%`} />
              )}
              {report.paymentInstallmentDownPaymentMethodDescription && (
                <DetailRow label="Forma de pagamento da entrada" value={report.paymentInstallmentDownPaymentMethodDescription} />
              )}
            </>
          )}
        </View>
      )}

      {report.observations && (
        <Text style={styles.reportObservations}>{report.observations}</Text>
      )}

      <Text style={styles.reportFooter}>Vendedor: {report.userName}</Text>
    </View>
  );
}
