import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { globalStyles } from '../theme/styles';

export default function WelcomeScreenSimple({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoText}>🌿</Text>
          </View>
          <Text style={styles.logoTitle}>SANOVA</Text>
          <Text style={styles.tagline}>Modern Beauty & Wellness</Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[globalStyles.button, styles.customerButton]}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[globalStyles.button, styles.ownerButton]}
            onPress={() => navigation.navigate('SignUp')}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 80,
  },
  logoIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 40,
  },
  logoTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text.light,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: colors.text.light,
    opacity: 0.8,
  },
  buttonContainer: {
    width: '100%',
  },
  customerButton: {
    backgroundColor: colors.background.primary,
    marginBottom: 16,
  },
  ownerButton: {
    backgroundColor: colors.background.primary,
  },
  buttonText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});
