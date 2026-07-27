import React from 'react';
import { View } from 'react-native';
import { IFilterActionBarProps } from '../Interfaces/FilterActionBar/IFilterActionBarProps';
import { filterActionBarStyles as styles } from '../Styles';
import { PrimaryButton } from './PrimaryButton';

/**
 * Standardized filter row used on all list screens.
 * Places filter fields on the left and action buttons (Search / New) on the right,
 * all vertically aligned at the bottom edge.
 */
export function FilterActionBar({
  children,
  onSearch,
  onNew,
  newLabel = '+ Novo',
  isSearching,
}: IFilterActionBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.filters}>{children}</View>
      <View style={styles.actions}>
        <PrimaryButton
          title="Buscar"
          onPress={onSearch}
          isLoading={isSearching}
          style={styles.btn}
        />
        {onNew && (
          <PrimaryButton
            title={newLabel}
            onPress={onNew}
            style={styles.btn}
          />
        )}
      </View>
    </View>
  );
}
