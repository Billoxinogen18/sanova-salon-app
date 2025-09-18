import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { authService, firestoreService } from '../services/firebaseService';
import { colors } from '../theme/colors';

const { width, height } = Dimensions.get('window');

export default function LoginScreenPremium({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('customer');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const result = await authService.signIn(email, password);
      
      if (result.success) {
        // Get user data from Firestore
        const userDoc = await firestoreService.users.get(result.user.uid);
        
        if (userDoc.success) {
          const userData = userDoc.data;
          
          // Navigate based on user role
          if (userData.role === 'salon') {
            navigation.replace('SalonOwnerApp');
          } else {
            navigation.replace('CustomerApp');
          }
        } else {
          navigation.replace('CustomerApp'); // Default to customer
        }
      } else {
        Alert.alert('Login Failed', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await authService.signInWithGoogle();
      
      if (result.success) {
        // Get user data from Firestore to determine navigation
        const userDoc = await firestoreService.users.get(result.user.uid);
        
        if (userDoc.success) {
          const userData = userDoc.data;
          
          // Navigate based on user role
          if (userData.role === 'salon') {
            navigation.replace('SalonOwnerApp');
          } else {
            navigation.replace('CustomerApp');
          }
        } else {
          navigation.replace('CustomerApp'); // Default to customer for Google sign-ins
        }
      } else {
        Alert.alert('Google Sign-In Failed', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Google Sign-In failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserTypePress = (type) => {
    setUserType(type);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>🌿</Text>
            <Text style={styles.brandName}>SANOVA</Text>
            <Text style={styles.tagline}>Premium Wellness</Text>
          </View>
        </View>

        {/* User Type Selection */}
        <View style={styles.userTypeContainer}>
          <TouchableOpacity
            style={[
              styles.userTypeButton,
              userType === 'customer' && styles.userTypeButtonActive
            ]}
            onPress={() => handleUserTypePress('customer')}
          >
            <Ionicons 
              name="person" 
              size={20} 
              color={userType === 'customer' ? colors.white : colors.text.primary} 
            />
            <Text style={[
              styles.userTypeText,
              userType === 'customer' && styles.userTypeTextActive
            ]}>Customer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.userTypeButton,
              userType === 'salon' && styles.userTypeButtonActive
            ]}
            onPress={() => handleUserTypePress('salon')}
          >
            <Ionicons 
              name="business" 
              size={20} 
              color={userType === 'salon' ? colors.white : colors.text.primary} 
            />
            <Text style={[
              styles.userTypeText,
              userType === 'salon' && styles.userTypeTextActive
            ]}>Salon Owner</Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor={colors.text.secondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={colors.text.secondary}
              value={password}
              onChangeText={setPassword}
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
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleSignIn}
            disabled={isLoading}
          >
            <Ionicons name="logo-google" size={20} color={colors.text.primary} />
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signUpLink}
            onPress={() => navigation.navigate('SignUp')}
          >
            <Text style={styles.signUpText}>
              Don't have an account? <Text style={styles.signUpTextBold}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
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
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoText: {
    fontSize: 40,
    marginBottom: 8,
  },
  brandName: {
    fontSize: 32,
    fontWeight: '600',
    color: colors.white,
    letterSpacing: 2,
    marginBottom: 4,
  },
  tagline: {
    fontSize: 14,
    color: colors.text.secondary,
    opacity: 0.8,
  },
  userTypeContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 40,
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
    marginBottom: 40,
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
  loginButton: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
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
  signUpLink: {
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 16,
    color: colors.white,
    opacity: 0.8,
  },
  signUpTextBold: {
    fontWeight: '600',
    color: colors.accent,
    opacity: 1,
  },
});