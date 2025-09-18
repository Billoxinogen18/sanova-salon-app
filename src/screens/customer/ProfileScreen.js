import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, globalStyles } from '../../theme/styles';
import Header from '../../components/Header';

export default function ProfileScreen({ navigation }) {
  const profileOptions = [
    { id: 1, title: 'Order History', icon: 'receipt-outline', onPress: () => {} },
    { id: 2, title: 'Edit Phone Number', icon: 'create-outline', onPress: () => {} },
    { id: 3, title: 'Notifications', icon: 'notifications-outline', onPress: () => {} },
    { id: 4, title: 'Favorite Salons', icon: 'heart-outline', onPress: () => {} },
    { id: 5, title: 'Support', icon: 'help-circle-outline', onPress: () => {} },
  ];

  return (
    <View style={styles.container}>
      {/* Header with dark green background exactly as in design */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="leaf" size={24} color={colors.text.white} />
        </View>
        <Text style={styles.headerTitle}>My Account</Text>
      </View>
      
      <ScrollView style={styles.content}>
        {/* Phone Number Section - exactly as in design */}
        <View style={styles.phoneSection}>
          <Text style={styles.phoneLabel}>Phone Number</Text>
          <Text style={styles.phoneNumber}>+45 20 12 34 56</Text>
        </View>

        {/* Menu Options - exactly matching the design layout */}
        <View style={styles.optionsContainer}>
          {profileOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.optionItem}
              onPress={option.onPress}
            >
              <View style={styles.optionLeft}>
                <Ionicons name={option.icon} size={20} color={colors.text.primary} />
                <Text style={styles.optionTitle}>{option.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.text.secondary} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary, // Beige background
  },
  header: {
    backgroundColor: colors.primary, // Deep green header
    paddingTop: 60, // Account for status bar
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 16, // 16dp radius as specified
    borderBottomRightRadius: 16, // 16dp radius as specified
    overflow: 'hidden', // Make corner radius visible
  },
  logoContainer: {
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.white,
    textAlign: 'center',
    fontFamily: 'serif',
    letterSpacing: 2, // +2 letter spacing as specified
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
    backgroundColor: colors.background.primary,
    borderTopLeftRadius: 16, // 16dp radius as specified
    borderTopRightRadius: 16, // 16dp radius as specified
    marginTop: -16, // Overlap with header to create seamless curve
    overflow: 'hidden', // Make corner radius visible
  },
  phoneSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  phoneLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  phoneNumber: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.text.primary,
  },
  optionsContainer: {
    paddingTop: 8,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    backgroundColor: colors.background.primary,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionTitle: {
    fontSize: 16,
    color: colors.text.primary,
    marginLeft: 12,
    fontWeight: '400',
  },
});
