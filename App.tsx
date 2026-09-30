import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LoginScreen } from './Presentation/Authentication/Screens/LoginScreen';
import { HomeScreen } from './Presentation/Home/Screens/HomeScreen';
import { AppShell } from './Presentation/Shared/Components/AppShell';
import { AppToast } from './Presentation/Shared/Components/AppToast';
import { UseAuthentication } from './Application/Authentication/Hooks/UseAuthentication';
import { ApplicationServicesContext } from './Application/DependencyInjection/ApplicationServicesContext';
import { ApplicationCompositionRoot } from './Presentation/DependencyInjection/ApplicationCompositionRoot';
import { colors } from './Presentation/Shared/Styles';

/**
 * O provedor de área segura mede as faixas ocupadas pelo sistema uma única vez
 * e as publica para a árvore inteira; quem as consome é a moldura (AppShell).
 * O provedor de serviços injeta as implementações concretas (composition root)
 * nos hooks da camada de aplicação.
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <ApplicationServicesContext.Provider value={ApplicationCompositionRoot}>
        <AppContent />
      </ApplicationServicesContext.Provider>
    </SafeAreaProvider>
  );
}

function AppContent() {
  const { accessToken, isLoading, isInitializing, login } =
    UseAuthentication();

  if (isInitializing) {
    return (
      <AppShell>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </AppShell>
    );
  }

  if (accessToken) {
    return (
      <>
        <StatusBar style="dark" />
        <AppShell>
          <HomeScreen userName={accessToken.userName} />
        </AppShell>
        <AppToast />
      </>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <AppShell>
        <LoginScreen
          isLoading={isLoading}
          onLogin={login}
        />
      </AppShell>
      <AppToast />
    </>
  );
}
