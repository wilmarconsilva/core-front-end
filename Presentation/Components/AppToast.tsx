import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Toast, { ToastConfig, ToastConfigParams } from 'react-native-toast-message';
import { appToastStyles as styles, colors } from '../Styles';

type ToastVariant = 'success' | 'error' | 'info';

const variantConfig: Record<ToastVariant, { accent: string; icon: keyof typeof Ionicons.glyphMap; iconColor: string }> = {
  success: { accent: colors.primary, icon: 'checkmark-circle-outline', iconColor: colors.primary },
  error:   { accent: '#DC2626',      icon: 'alert-circle-outline',     iconColor: '#DC2626'      },
  info:    { accent: '#2563EB',      icon: 'information-circle-outline', iconColor: '#2563EB'    },
};

function ToastItem({ text1, text2, type = 'info' }: ToastConfigParams<unknown> & { type?: ToastVariant }) {
  const { accent, icon, iconColor } = variantConfig[type as ToastVariant] ?? variantConfig.info;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => Toast.hide()}
      style={[styles.container, { borderLeftColor: accent }]}
    >
      <Ionicons name={icon} size={20} color={iconColor} style={styles.icon} />
      <View style={styles.textContainer}>
        {!!text1 && <Text style={styles.text1}>{text1}</Text>}
        {!!text2 && <Text style={styles.text2}>{text2}</Text>}
      </View>
    </TouchableOpacity>
  );
}

const toastConfig: ToastConfig = {
  success: (props) => <ToastItem {...props} type="success" />,
  error:   (props) => <ToastItem {...props} type="error" />,
  info:    (props) => <ToastItem {...props} type="info" />,
};

export function AppToast() {
  return (
    <Toast
      position="bottom"
      bottomOffset={40}
      config={toastConfig}
      visibilityTime={10000}
    />
  );
}
