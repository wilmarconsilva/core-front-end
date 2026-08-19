import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppVersion } from '../../Configuration/Versions/AppVersion';
import { colors } from '../Styles';

/** Fixed bottom-right badge showing the running app version, present across every screen. */
export function AppVersionBadge() {
  return (
    <View style={styles.container} pointerEvents="none">
      <Text style={styles.label}>v{AppVersion.semanticVersion}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
  },
});
