import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { authService, firestoreService } from '../services/firebaseService';
import { colors } from '../theme/colors';

export default function SignUpScreenPremium({ navigation }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'customer'
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignUp = async () => {
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      const userData = {
        name: `${formData.firstName} ${formData.lastName}`,
        displayName: `${formData.firstName} ${formData.lastName}`,
        phone: formData.phone,
        role: formData.userType
      };

      console.log('🚀 Attempting sign up...');
      const result = await authService.signUp(formData.email, formData.password, userData);
      
      if (result.success) {
        console.log('✅ Sign up successful, navigating...');
        Alert.alert(
          'Success',
          'Account created successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                if (formData.userType === 'salon') {
                  navigation.replace('SalonOwnerApp');
                } else {
                  navigation.replace('CustomerApp');
                }
              }
            }
          ]
        );
      } else {
        console.error('❌ Sign up failed:', result.error);
        Alert.alert('Sign Up Failed', result.error);
      }
    } catch (error) {
      console.error('❌ Sign up error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    try {
      const result = await authService.signInWithGoogle();
      
      if (result.success) {
        // For Google sign-ups, default to customer role
        navigation.replace('CustomerApp');
      } else {
        Alert.alert('Google Sign-Up Failed', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Google Sign-Up failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserTypePress = (type) => {
    setFormData(prev => ({ ...prev, userType: type }));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join the Sanova community</Text>
          </View>

          {/* User Type Selection */}
          <View style={styles.userTypeContainer}>
            <TouchableOpacity
              style={[
                styles.userTypeButton,
                formData.userType === 'customer' && styles.userTypeButtonActive
              ]}
              onPress={() => handleUserTypePress('customer')}
            >
              <Ionicons 
                name="person" 
                size={20} 
                color={formData.userType === 'customer' ? colors.white : colors.text.primary} 
              />
              <Text style={[
                styles.userTypeText,
                formData.userType === 'customer' && styles.userTypeTextActive
              ]}>Customer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.userTypeButton,
                formData.userType === 'salon' && styles.userTypeButtonActive
              ]}
              onPress={() => handleUserTypePress('salon')}
            >
              <Ionicons 
                name="business" 
                size={20} 
                color={formData.userType === 'salon' ? colors.white : colors.text.primary} 
              />
              <Text style={[
                styles.userTypeText,
                formData.userType === 'salon' && styles.userTypeTextActive
              ]}>Salon Owner</Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <View style={styles.nameRow}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                <TextInput
                  style={styles.input}
                  placeholder="First Name"
                  placeholderTextColor={colors.text.secondary}
                  value={formData.firstName}
                  onChangeText={(value) => handleInputChange('firstName', value)}
                  autoCapitalize="words"
                />
              </View>

              <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                <TextInput
                  style={styles.input}
                  placeholder="Last Name"
                  placeholderTextColor={colors.text.secondary}
                  value={formData.lastName}
                  onChangeText={(value) => handleInputChange('lastName', value)}
                  autoCapitalize="words"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor={colors.text.secondary}
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Phone number (optional)"
                placeholderTextColor={colors.text.secondary}
                value={formData.phone}
                onChangeText={(value) => handleInputChange('phone', value)}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={colors.text.secondary}
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                secureTextEntry={!isPasswordVisible}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                <Ionicons
                  name={isPasswordVisible ? 'eye-off' : 'eye'}
                  size={20}
                  color={colors.text.secondary}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor={colors.text.secondary}
                value={formData.confirmPassword}
                onChangeText={(value) => handleInputChange('confirmPassword', value)}
                secureTextEntry={!isConfirmPasswordVisible}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
              >
                <Ionicons
                  name={isConfirmPasswordVisible ? 'eye-off' : 'eye'}
                  size={20}
                  color={colors.text.secondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.signUpButton, isLoading && styles.buttonDisabled]}
              onPress={handleSignUp}
              disabled={isLoading}
            >
              <Text style={styles.signUpButtonText}>
                {isLoading ? 'Creating Account...' : 'Sign Up'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleSignUp}
              disabled={isLoading}
            >
              <Ionicons name="logo-google" size={20} color={colors.text.primary} />
              <Text style={styles.googleButtonText}>Sign up with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginText}>
                Already have an account? <Text style={styles.loginTextBold}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: colors.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    opacity: 0.8,
  },
  userTypeContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 30,
    gap: 12,
  },
  userTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    gap: 8,
  },
  userTypeButtonActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  userTypeText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.white,
  },
  userTypeTextActive: {
    color: colors.white,
  },
  formContainer: {
    paddingHorizontal: 24,
    marginBottom: 30,
  },
  nameRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: 'rgba(38, 52, 40, 0.1)',
  },
  eyeIcon: {
    position: 'absolute',
    right: 20,
    top: 18,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  signUpButton: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  signUpButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
  },
  googleButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(38, 52, 40, 0.1)',
    gap: 12,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
  },
  loginLink: {
    alignItems: 'center',
  },
  loginText: {
    fontSize: 16,
    color: colors.white,
    opacity: 0.8,
  },
  loginTextBold: {
    fontWeight: '600',
    color: colors.accent,
    opacity: 1,
  },
});