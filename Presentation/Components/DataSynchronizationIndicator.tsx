import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { UseDataSynchronization } from '../../Application/Hooks/UseDataSynchronization';
import { UseOperationMode } from '../../Application/Hooks/UseOperationMode';
import { SynchronizationStatus } from '../../Application/Interfaces/Services/IDataSynchronizationService';
import { colors } from '../Styles';
import { OperationMode } from '../../Application/Services/Offline/OperationModeService';

type IndicatorAppearance = {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  label: string;
  spinning: boolean;
};

function resolveAppearance(status: SynchronizationStatus, operationMode: OperationMode): IndicatorAppearance | null {
  if (operationMode === OperationMode.Offline) {
    return { icon: 'cloud-offline-outline', color: colors.textSecondary, label: 'Offline', spinning: false };
  }

  switch (status) {
    case 'syncing':
      return { icon: 'sync-outline', color: colors.primary, label: 'Sincronizando...', spinning: true };
    case 'success':
      return { icon: 'cloud-done-outline', color: colors.primary, label: 'Sincronizado', spinning: false };
    case 'error':
      return { icon: 'warning-outline', color: colors.error, label: 'Falha na sincronização', spinning: false };
    default:
      return null;
  }
}

/**
 * Fixed bottom-left indicator that reflects the synchronization status.
 * Purely presentational: it observes the status and never blocks the UI.
 */
export function DataSynchronizationIndicator() {
  const { status } = UseDataSynchronization();
  const operationMode = UseOperationMode();
  const spin = useRef(new Animated.Value(0)).current;

  const appearance = resolveAppearance(status, operationMode);
  const isSpinning = appearance?.spinning ?? false;

  useEffect(() => {
    if (!isSpinning) {
      spin.stopAnimation();
      spin.setValue(0);
      return;
    }

    const animation = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    );

    animation.start();
    return () => animation.stop();
  }, [isSpinning, spin]);

  if (!appearance) {
    return null;
  }

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View style={isSpinning ? { transform: [{ rotate }] } : undefined}>
        <Ionicons name={appearance.icon} size={18} color={appearance.color} />
      </Animated.View>
      <Text style={[styles.label, { color: appearance.color }]}>{appearance.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    bottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surface,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});
