import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { IDocumentReport } from '../../../../Application/Interfaces/DataTransferObjects/Commercial/Documents/Reports/IDocumentReport';
import { IDocumentReportFilter } from '../../../../Application/Interfaces/DataTransferObjects/Commercial/Documents/Reports/IDocumentReportFilter';
import { IDocumentReportListing } from '../../../../Application/Interfaces/DataTransferObjects/Commercial/Documents/Reports/IDocumentReportListing';
import { IDocumentReportSummary } from '../../../../Application/Interfaces/DataTransferObjects/Commercial/Documents/Reports/IDocumentReportSummary';
import { formatCurrency } from '../../../../Application/Services/Utilities/FormatUtilities';
import { Breadcrumb } from '../../../Components/Breadcrumb';
import { DateField } from '../../../Components/DateField';
import { DocumentReportCard } from '../../../Components/DocumentReportCard';
import { PrimaryButton } from '../../../Components/PrimaryButton';
import { IDocumentReportScreenProps } from '../../../Interfaces/Screens/IDocumentReportScreenProps';
import {
  colors,
  documentReportScreenStyles as styles,
  layoutStyles,
  listScreenStyles,
  typographyStyles,
} from '../../../Styles';

const REGISTERS_START = 0;
const REGISTERS_END = 50;

/** Template Method para relatórios de documentos comerciais (Pedidos, Orçamentos, ...). */
export function DocumentReportScreen<TReport extends IDocumentReport, TSummary extends IDocumentReportSummary>({
  title,
  breadcrumbLabel,
  service,
  onGoBack,
}: IDocumentReportScreenProps<TReport, TSummary>) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<IDocumentReportListing<TReport, TSummary> | null>(null);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const filter: IDocumentReportFilter = {
        registersStart: REGISTERS_START,
        registersEnd: REGISTERS_END,
        creationDateTimeStart: startDate || undefined,
        creationDateTimeEnd: endDate || undefined,
      };
      const result = await service.get(filter);
      setData(result);
    } catch {
      // Error handled by service
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={layoutStyles.screenWrapper}>
      <ScrollView contentContainerStyle={[layoutStyles.scrollContainer, { justifyContent: 'flex-start' }]}>
        <Breadcrumb items={[
          { label: 'Início', onPress: onGoBack },
          { label: 'Relatórios', onPress: onGoBack },
          { label: breadcrumbLabel },
        ]} />
        <Text style={typographyStyles.title}>{title}</Text>

        <View style={layoutStyles.sectionCardSpaced}>
          <View style={styles.filterRow}>
            <View style={listScreenStyles.filterFieldCompact}>
              <DateField label="Data início" value={startDate} onChangeText={setStartDate} />
            </View>
            <View style={listScreenStyles.filterFieldCompact}>
              <DateField label="Data fim" value={endDate} onChangeText={setEndDate} />
            </View>
            <PrimaryButton title="Gerar" isLoading={isLoading} onPress={handleSearch} style={styles.actionBtn} />
          </View>
        </View>

        {data?.summary && (
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Total Geral</Text>
            <Text style={styles.summaryValue}>{formatCurrency(data.summary.valueTotal)}</Text>
          </View>
        )}

        {isLoading && (
          <View style={{ paddingVertical: 32, alignItems: 'center' }}>
            <ActivityIndicator color={colors.primary} />
          </View>
        )}

        {!isLoading && data && (
          <View style={layoutStyles.sectionCardSpaced}>
            {data.registers.length === 0 ? (
              <Text style={styles.emptyText}>Nenhum registro encontrado.</Text>
            ) : (
              data.registers.map((report, idx) => (
                <DocumentReportCard key={report.id} report={report} isAlternate={idx % 2 !== 0} />
              ))
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
