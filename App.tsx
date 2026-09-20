import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LoginScreen } from './Presentation/Screens/LoginScreen';
import { HomeScreen } from './Presentation/Screens/HomeScreen';
import { AppShell } from './Presentation/Components/AppShell';
import { AppToast } from './Presentation/Components/AppToast';
import { UseAuthentication } from './Application/Hooks/UseAuthentication';
import { colors } from './Presentation/Styles';

/**
 * O provedor de área segura mede as faixas ocupadas pelo sistema uma única vez
 * e as publica para a árvore inteira; quem as consome é a moldura (AppShell).
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
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
