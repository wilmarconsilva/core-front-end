import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text } from 'react-native';
import { IMenuItemProps } from '../Interfaces/MenuItem/IMenuItemProps';
import { IPressableInteractionState } from '../Interfaces/Pressable/IPressableInteractionState';
import { colors, gridStyles, interactionStyles } from '../Styles';

export function MenuItem({ icon, label, menuItemSize, onPress }: IMenuItemProps) {
  return (
    <Pressable
      style={({ pressed, hovered }: IPressableInteractionState) => [
        menuItemSize === 'large' ? gridStyles.menuItemLarge : gridStyles.menuItemMedium,
        (pressed || hovered) && interactionStyles.hovered,
      ]}
      onPress={onPress}
    >
      <Ionicons
        name={icon}
        size={32}
        color={colors.primary}
        style={gridStyles.menuItemIcon}
      />
      <Text style={gridStyles.menuItemText}>{label}</Text>
    </Pressable>
  );
}
