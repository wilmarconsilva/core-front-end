import React from 'react';
import { Text, View } from 'react-native';
import { ScreenScrollView } from '../Components/ScreenScrollView';
import { Breadcrumb } from '../Components/Breadcrumb';
import { MenuItem } from '../Components/MenuItem';
import { ScreenTransition } from '../Components/ScreenTransition';
import { DataSynchronizationIndicator } from '../Components/DataSynchronizationIndicator';
import { gridStyles, layoutStyles, typographyStyles } from '../Styles';
import { UseNavigation, Screen } from '../../Application/Hooks/UseNavigation';
import { UseOperationMode } from '../../Application/Hooks/UseOperationMode';
import { IHomeMenuProps } from '../Interfaces/Home/IHomeMenuProps';
import { IHomeScreenProps } from '../Interfaces/Home/IHomeScreenProps';
import { ReportsScreen } from './ReportsScreen';
import { CustomersListScreen } from './Customers/CustomersListScreen';
import { CustomerFormScreen } from './Customers/CustomerFormScreen';
import { ProductsListScreen } from './Products/ProductsListScreen';
import { ProductFormScreen } from './Products/ProductFormScreen';
import { BudgetsListScreen } from './Commercial/Documents/Budgets/BudgetsListScreen';
import { BudgetFormScreen } from './Commercial/Documents/Budgets/BudgetFormScreen';
import { OrdersListScreen } from './Commercial/Documents/Orders/OrdersListScreen';
import { OrderFormScreen } from './Commercial/Documents/Orders/OrderFormScreen';
import { BudgetReportScreen } from './Commercial/Documents/Budgets/BudgetReportScreen';
import { OrderReportScreen } from './Commercial/Documents/Orders/OrderReportScreen';
import { SynchronizationPendenciesScreen } from './Offline/SynchronizationPendenciesScreen';
import { OperationMode } from '../../Application/Services/Offline/OperationModeService';
import { ISynchronizationPendency } from '../../Application/Interfaces/DataTransferObjects/Offline/ISynchronizationPendency';
import { SynchronizationEntityType } from '../../Application/Interfaces/DataTransferObjects/Offline/SynchronizationEntityType';

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

