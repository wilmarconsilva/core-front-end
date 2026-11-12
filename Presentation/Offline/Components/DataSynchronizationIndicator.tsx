import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, LayoutChangeEvent, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UseDataSynchronization } from '../../../Application/Offline/Hooks/UseDataSynchronization';
import { UseOperationMode } from '../../../Application/Offline/Hooks/UseOperationMode';
import { SynchronizationStatus } from '../../../Application/Offline/Services/Interfaces/IDataSynchronizationService';
import { colors, FLOATING_INDICATOR_BOTTOM } from '../../Shared/Styles';
import { OperationMode } from '../../../Application/Offline/Services/OperationModeService';

type IndicatorAppearance = {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  label: string;
  spinning: boolean;
};

/** Tempo que o estado final (sucesso ou falha) permanece visível antes de sair de cena. */
const AUTO_HIDE_DELAY_MS = 5000;

/**
 * Parâmetros copiados do react-native-toast-message para que a entrada e a
 * saída deste indicador sejam indistinguíveis das de um toast do app:
 * `DEFAULT_ANIMATION_CONFIG` (spring, friction 8) e a interpolação de opacidade
 * de `useSlideAnimation`. Como o `AppToast` usa `position="bottom"`, o
 * movimento é de baixo para cima na entrada e o inverso na saída.
 */
const TOAST_SPRING_FRICTION = 8;
const TOAST_OPACITY_INPUT_RANGE = [0, 0.7, 1];
const TOAST_OPACITY_OUTPUT_RANGE = [0, 1, 1];

/** Distância usada enquanto a altura real ainda não foi medida. */
const TRAVEL_FALLBACK = 96;

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
 * Indicador fixo no canto inferior esquerdo que reflete o status da sincronização.
 * Puramente apresentacional: observa o status e nunca bloqueia a interface.
 *
 * Entra deslizando como um toast quando a sincronização começa e sai da mesma
 * forma, em sentido contrário, 5 segundos após o término (sucesso ou falha). Os
 * registros que falharam continuam acessíveis em Pendências de Sincronização. O
 * modo offline permanece, porque descreve uma condição que persiste na sessão.
 */
export function DataSynchronizationIndicator() {
  const { status } = UseDataSynchronization();
  const operationMode = UseOperationMode();
  const insets = useSafeAreaInsets();
  const spin = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(0)).current;
  const [height, setHeight] = useState(0);
  const [isHidden, setIsHidden] = useState(false);

  const appearance = resolveAppearance(status, operationMode);
  const isSpinning = appearance?.spinning ?? false;
  const hasAppearance = appearance !== null;
  const isFinished = status === 'success' || status === 'error';
  const shouldAutoHide = isFinished && operationMode !== OperationMode.Offline;

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

  useEffect(() => {
    if (!hasAppearance) {
      return;
    }

    // Traz o indicador de volta: cobre tanto a entrada (início da sincronização)
    // quanto o caso de uma saída em andamento ser interrompida por um status novo.
    setIsHidden(false);
    Animated.spring(slide, {
      toValue: 1,
      friction: TOAST_SPRING_FRICTION,
      // O react-native-web não tem o módulo nativo de animação. É também o que
      // a própria biblioteca de toast faz fora do iOS.
      useNativeDriver: false,
    }).start();

    if (!shouldAutoHide) {
      return;
    }

    const timer = setTimeout(() => {
      Animated.spring(slide, {
        toValue: 0,
        friction: TOAST_SPRING_FRICTION,
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished) setIsHidden(true);
      });
    }, AUTO_HIDE_DELAY_MS);

    return () => clearTimeout(timer);
  }, [status, operationMode, hasAppearance, shouldAutoHide, slide]);

  const onLayout = (e: LayoutChangeEvent) => setHeight(e.nativeEvent.layout.height);

  // Mesma proporção do toast: o dobro da própria altura, o que o tira de cena
  // por completo independentemente do tamanho do rótulo.
  const travel = height > 0 ? height * 2 : TRAVEL_FALLBACK;

  const animationStyle = useMemo(
    () => ({
      opacity: slide.interpolate({
        inputRange: TOAST_OPACITY_INPUT_RANGE,
        outputRange: TOAST_OPACITY_OUTPUT_RANGE,
      }),
      transform: [
        {
          translateY: slide.interpolate({
            inputRange: [0, 1],
            outputRange: [travel, 0],
          }),
        },
      ],
    }),
    [slide, travel],
  );

  if (!appearance || isHidden) {
    return null;
  }

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <Animated.View
      style={[styles.container, { bottom: insets.bottom + FLOATING_INDICATOR_BOTTOM }, animationStyle]}
      onLayout={onLayout}
      pointerEvents="none"
    >
      <Animated.View style={isSpinning ? { transform: [{ rotate }] } : undefined}>
        <Ionicons name={appearance.icon} size={18} color={appearance.color} />
      </Animated.View>
      <Text style={[styles.label, { color: appearance.color }]}>{appearance.label}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Ancorado à área de telas do AppShell, que não rola — por isso o
    // indicador fica parado. O afastamento do rodapé vem por estilo inline,
    // porque depende da área segura do aparelho.
    position: 'absolute',
    left: 16,
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
