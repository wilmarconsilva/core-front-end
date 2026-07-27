import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { Breadcrumb } from '../../../../Components/Breadcrumb';
import { DateField } from '../../../../Components/DateField';
import { PrimaryButton } from '../../../../Components/PrimaryButton';
import { BudgetReportService } from '../../../../../Application/Services/Commercial/Documents/Budgets/BudgetReportService';
import { IBudgetReportFilter } from '../../../../../Application/Interfaces/DataTransferObjects/Commercial/Documents/Budgets/Reports/IBudgetReportFilter';
import { IBudgetReportListing } from '../../../../../Application/Interfaces/DataTransferObjects/Commercial/Documents/Budgets/Reports/IBudgetReportListing';
import { IBackOnlyScreenProps } from '../../../../Interfaces/Screens/IBackOnlyScreenProps';
import {
  colors,
  documentReportScreenStyles as styles,
  layoutStyles,
  listScreenStyles,
  typographyStyles,
} from '../../../../Styles';

const budgetReportService = new BudgetReportService();

export function BudgetReportScreen({ onGoBack }: IBackOnlyScreenProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<IBudgetReportListing | null>(null);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const filter: IBudgetReportFilter = {
        registersStart: 0,
        registersEnd: 50,
        creationDateTimeStart: startDate || undefined,
        creationDateTimeEnd: endDate || undefined,
      };
      const result = await budgetReportService.get(filter);
      setData(result);
    } catch {
      // Error handled by service
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const formatDate = (s: string) => new Date(s).toLocaleDateString('pt-BR');

  return (
    <View style={layoutStyles.screenWrapper}>
      <ScrollView contentContainerStyle={[layoutStyles.scrollContainer, { justifyContent: 'flex-start' }]}>
        <Breadcrumb items={[
          { label: 'Início', onPress: onGoBack },
          { label: 'Relatórios', onPress: onGoBack },
          { label: 'Orçamentos' },
        ]} />
        <Text style={typographyStyles.title}>Relatório de Orçamentos</Text>
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
                <View key={report.id} style={[styles.reportRow, idx % 2 !== 0 ? styles.reportRowAlt : null]}>
                  <View style={styles.reportHeader}>
                    <Text style={styles.reportId}>#{report.id}</Text>
                    <Text style={styles.reportTotal}>{formatCurrency(report.valueTotal)}</Text>
                  </View>
                  <Text style={styles.reportCustomer}>{report.customerName}</Text>
                  <Text style={styles.reportCity}>{report.customerLocalityState}</Text>
                  <Text style={styles.reportDate}>{formatDate(report.creationDateTime)}</Text>
                  <Text style={styles.reportPayment}>{report.paymentMethodDescription}</Text>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
