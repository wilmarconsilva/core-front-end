import React from 'react';
import { Text, View } from 'react-native';
import { ScreenScrollView } from '../Components/ScreenScrollView';
import { Breadcrumb } from '../Components/Breadcrumb';
import { MenuItem } from '../Components/MenuItem';
import { IReportsScreenProps } from '../Interfaces/Reports/IReportsScreenProps';
import { gridStyles, layoutStyles, typographyStyles } from '../Styles';

export function ReportsScreen({ onGoBack, onNavigateToBudgetReport, onNavigateToOrderReport }: IReportsScreenProps) {
  return (
    <View style={layoutStyles.screenWrapper}>
      <ScreenScrollView contentContainerStyle={layoutStyles.scrollContainer}>
        <Breadcrumb
          items={[
            { label: 'Início', onPress: onGoBack },
            { label: 'Relatórios' },
          ]}
        />

        <Text style={typographyStyles.title}>Relatórios</Text>
        <Text style={typographyStyles.subtitle}>
          Selecione o tipo de relatório
        </Text>

        <View style={gridStyles.grid}>
          <MenuItem
            icon="cash-outline"
            label="Orçamentos"
            onPress={onNavigateToBudgetReport}
          />
          <MenuItem
            icon="clipboard-outline"
            label="Pedidos"
            onPress={onNavigateToOrderReport}
          />
        </View>
      </ScreenScrollView>
    </View>
  );
}

