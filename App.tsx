import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { LoginScreen } from './Presentation/Screens/LoginScreen';
import { HomeScreen } from './Presentation/Screens/HomeScreen';
import { AppToast } from './Presentation/Components/AppToast';
import { AppVersionBadge } from './Presentation/Components/AppVersionBadge';
import { UseAuthentication } from './Application/Hooks/UseAuthentication';
import { colors } from './Presentation/Styles';

export default function App() {
  const { accessToken, isLoading, isInitializing, login } =
    UseAuthentication();

  if (isInitializing) {
    return (
      <>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
        <AppVersionBadge />
      </>
    );
  }

  if (accessToken) {
    return (
      <>
        <StatusBar style="dark" />
        <HomeScreen userName={accessToken.userName} />
        <AppToast />
        <AppVersionBadge />
      </>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <LoginScreen
        isLoading={isLoading}
        onLogin={login}
      />
      <AppToast />
      <AppVersionBadge />
    </>
  );
}
