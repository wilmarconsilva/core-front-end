import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { ScreenScrollView } from '../../Shared/Components/ScreenScrollView';
import { FormField } from '../../Shared/Components/FormField';
import { PasswordField } from '../../Shared/Components/PasswordField';
import { PrimaryButton } from '../../Shared/Components/PrimaryButton';
import { ILoginScreenProps } from '../Interfaces/ILoginScreenProps';
import { layoutStyles, typographyStyles } from '../../Shared/Styles';

export function LoginScreen({
  isLoading,
  onLogin,
}: ILoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    onLogin({ email: email, password });
  };

  return (
    <KeyboardAvoidingView
      style={layoutStyles.screenWrapper}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScreenScrollView
        contentContainerStyle={layoutStyles.loginContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={layoutStyles.card}>
          <Text style={typographyStyles.title}>Bem-vindo</Text>
          <Text style={typographyStyles.subtitle}>Faça login para continuar</Text>

          <FormField
            label="E-mail"
            placeholder="seu@email.com"
            keyboardType="email-address"
            returnKeyType="next"
            value={email}
            onChangeText={setEmail}
            editable={!isLoading}
          />

          <PasswordField
            label="Senha"
            placeholder="••••••••"
            returnKeyType="go"
            value={password}
            onChangeText={setPassword}
            editable={!isLoading}
            onSubmitEditing={handleLogin}
          />

          <PrimaryButton
            title="Entrar"
            isLoading={isLoading}
            onPress={handleLogin}
          />
        </View>
      </ScreenScrollView>
    </KeyboardAvoidingView>
  );
}

