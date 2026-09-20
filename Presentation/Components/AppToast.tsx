import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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

/** Folga entre o toast e o fim da área útil, acima do indicador de gestos. */
const TOAST_BOTTOM_GAP = 40;

/**
 * O toast é irmão da moldura (AppShell), e não filho: ele cobre a tela inteira,
 * inclusive as faixas do sistema. Por isso soma a faixa inferior por conta
 * própria, em vez de herdar o recuo da moldura.
 */
export function AppToast() {
  const insets = useSafeAreaInsets();

  return (
    <Toast
      position="bottom"
      bottomOffset={TOAST_BOTTOM_GAP + insets.bottom}
      config={toastConfig}
      visibilityTime={10000}
    />
  );
}
