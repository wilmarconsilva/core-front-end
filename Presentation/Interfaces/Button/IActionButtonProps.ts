import { PressableProps, StyleProp, ViewStyle } from 'react-native';

export interface IActionButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  title: string;
  isLoading?: boolean;
  style?: StyleProp<ViewStyle>;
}
