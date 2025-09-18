import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import StatusBar from './StatusBar';

export default function Header({ title, showBack = false, rightIcon, onRightPress, onBackPress, showSearch = false }) {
  return (
    <View style={styles.container}>
      <StatusBar />
      <View style={styles.header}>
        {showBack ? (
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
        
        <View style={styles.logoContainer}>
          <Text style={styles.logoIcon}>🌿</Text>
          <Text style={styles.logoText}>SANOVA</Text>
        </View>
        
        {rightIcon ? (
          <TouchableOpacity onPress={onRightPress} style={styles.rightButton}>
            <Ionicons name={rightIcon} size={24} color={colors.text.primary} />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
      
      {showSearch && (
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={colors.text.secondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor={colors.text.secondary}
            />
          </View>
        </View>
      )}
      
      {title && <Text style={styles.title}>{title}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  rightButton: {
    padding: 8,
  },
  placeholder: {
    width: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: colors.text.primary,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
});
