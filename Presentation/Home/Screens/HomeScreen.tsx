import React from 'react';
import { Text, View } from 'react-native';
import { ScreenScrollView } from '../../Shared/Components/ScreenScrollView';
import { Breadcrumb } from '../../Shared/Components/Breadcrumb';
import { MenuItem } from '../../Shared/Components/MenuItem';
import { ScreenTransition } from '../../Shared/Components/ScreenTransition';
import { DataSynchronizationIndicator } from '../../Offline/Components/DataSynchronizationIndicator';
import { gridStyles, layoutStyles, typographyStyles } from '../../Shared/Styles';
import { UseNavigation, Screen } from '../../../Application/Shared/Hooks/UseNavigation';
import { UseOperationMode } from '../../../Application/Offline/Hooks/UseOperationMode';
import { IHomeMenuProps } from '../Interfaces/IHomeMenuProps';
import { IHomeScreenProps } from '../Interfaces/IHomeScreenProps';
import { ReportsScreen } from '../../Reports/Screens/ReportsScreen';
import { CustomersListScreen } from '../../Persons/Customers/Screens/CustomersListScreen';
import { CustomerFormScreen } from '../../Persons/Customers/Screens/CustomerFormScreen';
import { ProductsListScreen } from '../../Products/Screens/ProductsListScreen';
import { ProductFormScreen } from '../../Products/Screens/ProductFormScreen';
import { BudgetsListScreen } from '../../Documents/Budgets/Screens/BudgetsListScreen';
import { BudgetFormScreen } from '../../Documents/Budgets/Screens/BudgetFormScreen';
import { OrdersListScreen } from '../../Documents/Orders/Screens/OrdersListScreen';
import { OrderFormScreen } from '../../Documents/Orders/Screens/OrderFormScreen';
import { BudgetReportScreen } from '../../Documents/Budgets/Screens/BudgetReportScreen';
import { OrderReportScreen } from '../../Documents/Orders/Screens/OrderReportScreen';
import { SynchronizationPendenciesScreen } from '../../Offline/Screens/SynchronizationPendenciesScreen';
import { OperationMode } from '../../../Application/Offline/Services/OperationModeService';
import { ISynchronizationPendency } from '../../../Application/Offline/DataTransferObjects/ISynchronizationPendency';
import { SynchronizationEntityType } from '../../../Application/Offline/DataTransferObjects/SynchronizationEntityType';

function HomeMenuScreen({ userName, navigate, operationMode }: IHomeMenuProps) {

  return (
    <View style={layoutStyles.screenWrapper}>
      <ScreenScrollView contentContainerStyle={layoutStyles.scrollContainer}>
        <Breadcrumb items={[{ label: 'Início' }]} />
        <Text style={typographyStyles.title}>Olá, {userName}!</Text>
        <Text style={typographyStyles.subtitle}>O que deseja acessar?</Text>
        <View style={gridStyles.grid}>
          <MenuItem icon="people-outline" label="Clientes" menuItemSize="medium" onPress={() => navigate({ name: 'customers' })} />
          <MenuItem icon="cube-outline" label="Produtos" menuItemSize="medium" onPress={() => navigate({ name: 'products' })} />
          <MenuItem icon="cash-outline" label="Orçamentos" menuItemSize="medium" onPress={() => navigate({ name: 'budgets' })} />
          <MenuItem icon="clipboard-outline" label="Pedidos" menuItemSize="medium" onPress={() => navigate({ name: 'orders' })} />
          {operationMode === OperationMode.Online && (
            <>
              <MenuItem icon="bar-chart-outline" label="Relatórios" menuItemSize="medium" onPress={() => navigate({ name: 'reports' })} />
              <MenuItem icon="cloud-upload-outline" label="Pendências de Sincronização" menuItemSize="medium" onPress={() => navigate({ name: 'synchronizationPendencies' })} />
            </>
          )}
        </View>
      </ScreenScrollView>
    </View>
  );

}

function screenKey(screen: Screen): string {
  if (!('id' in screen)) return screen.name;
  if (screen.id) return `${screen.name}-${screen.id}`;

  // Dois documentos novos originados de orçamentos diferentes precisam de chaves diferentes,
  // senão a tela não remonta e reaproveita o estado do anterior.
  const origin = 'budgetId' in screen && screen.budgetId ? `budget-${screen.budgetId}` : 'new';

  return `${screen.name}-${origin}`;
}

/** Resolves the form screen that edits the local record of a synchronization pendency. */
function pendencyFormScreen(pendency: ISynchronizationPendency): Screen {
  switch (pendency.entityType) {
    case SynchronizationEntityType.Product:
      return { name: 'productForm', id: pendency.recordId };
    case SynchronizationEntityType.Customer:
      return { name: 'customerForm', id: pendency.recordId };
    case SynchronizationEntityType.Order:
      return { name: 'orderForm', id: pendency.recordId };
    case SynchronizationEntityType.Budget:
      return { name: 'budgetForm', id: pendency.recordId };
  }
}

export function HomeScreen({ userName }: IHomeScreenProps) {
  const { currentScreen, navigate, goBack } = UseNavigation();
  const operationMode = UseOperationMode();

  function renderScreen() {
    switch (currentScreen.name) {
      case 'customers':
        return <CustomersListScreen onGoBack={goBack} onNavigateToForm={(id) => navigate({ name: 'customerForm', id })} />;
      case 'customerForm':
        return <CustomerFormScreen id={currentScreen.id} onGoBack={goBack} />;

      case 'products':
        return <ProductsListScreen onGoBack={goBack} onNavigateToForm={(id) => navigate({ name: 'productForm', id })} />;
      case 'productForm':
        return <ProductFormScreen id={currentScreen.id} onGoBack={goBack} />;

      case 'budgets':
        return (
          <BudgetsListScreen
            onGoBack={goBack}
            onNavigateToForm={(id) => navigate({ name: 'budgetForm', id })}
            onNavigateToOrderForm={(budgetId) => navigate({ name: 'orderForm', budgetId })}
          />
        );
      case 'budgetForm':
        return <BudgetFormScreen id={currentScreen.id} onGoBack={goBack} />;

      case 'orders':
        return <OrdersListScreen onGoBack={goBack} onNavigateToForm={(id) => navigate({ name: 'orderForm', id })} />;
      case 'orderForm':
        return <OrderFormScreen id={currentScreen.id} budgetId={currentScreen.budgetId} onGoBack={goBack} />;

      case 'reports':
        return (
          <ReportsScreen
            onGoBack={goBack}
            onNavigateToBudgetReport={() => navigate({ name: 'budgetReport' })}
            onNavigateToOrderReport={() => navigate({ name: 'orderReport' })}
          />
        );
      case 'budgetReport':
        return <BudgetReportScreen onGoBack={goBack} />;
      case 'orderReport':
        return <OrderReportScreen onGoBack={goBack} />;

      case 'synchronizationPendencies':
        return (
          <SynchronizationPendenciesScreen
            onGoBack={goBack}
            onEditPendency={(pendency) => navigate(pendencyFormScreen(pendency))}
          />
        );

      default:
        return <HomeMenuScreen userName={userName} navigate={navigate} operationMode={operationMode} />;
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <ScreenTransition screenKey={screenKey(currentScreen)}>
        {renderScreen()}
      </ScreenTransition>
      <DataSynchronizationIndicator />
    </View>
  );
}

