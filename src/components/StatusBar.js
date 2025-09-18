import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function StatusBar() {
  return (
    <View style={styles.statusBar}>
      <Text style={styles.time}>9:41</Text>
      <View style={styles.icons}>
        <Ionicons name="cellular" size={16} color={colors.text.primary} style={styles.icon} />
        <Ionicons name="wifi" size={16} color={colors.text.primary} style={styles.icon} />
        <Ionicons name="battery-full" size={16} color={colors.text.primary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statusBar: {
    height: 44,
    backgroundColor: colors.background.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  time: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 4,
  },
});
