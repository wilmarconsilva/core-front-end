import { Ionicons } from '@expo/vector-icons';

export interface IMenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  menuItemSize: 'medium' | 'large'; 
  onPress: () => void;
}
