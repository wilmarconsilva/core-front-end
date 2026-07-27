import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { IScreenTransitionProps } from '../Interfaces/ScreenTransition/IScreenTransitionProps';

/**
 * Wraps a screen with a fade + slide-up animation whenever `screenKey` changes.
 * Both animations run in parallel using the native driver (off the JS thread).
 */
export function ScreenTransition({ screenKey, children }: IScreenTransitionProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    opacity.setValue(0);
    translateY.setValue(10);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenKey]);

  return (
    <Animated.View style={{ flex: 1, opacity, transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  );
}
