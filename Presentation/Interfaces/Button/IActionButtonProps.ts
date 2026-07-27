import { TouchableOpacityProps } from 'react-native';

export interface IActionButtonProps extends TouchableOpacityProps {
  title: string;
  isLoading?: boolean;
}
