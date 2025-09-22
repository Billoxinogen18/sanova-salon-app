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
  SafeAreaView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { authService, firestoreService } from '../services/firebaseService';

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
    <LinearGradient
      colors={['#194123', '#19572C']} // Exact gradient colors from specs
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#194123" />
      
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Brand Header Section - 48px from top */}
          <View style={styles.brandHeader}>
            {/* Leaf icon - 48x48px */}
            <Image 
              source={require('../../assets/logo.png')}
              style={styles.logoIcon}
              resizeMode="contain"
            />
            {/* SANOVA text - 32px, bold, white, 2px letter spacing */}
            <Text style={styles.brandName}>SANOVA</Text>
            {/* Subtitle - 16px, #C5DAC1, medium */}
            <Text style={styles.brandSubtitle}>Premium Wellness</Text>
          </View>

          {/* User Type Selector - Two buttons side by side */}
          <View style={styles.userTypeSelector}>
            <TouchableOpacity
              style={[
                styles.userTypeButton,
                userType === 'customer' && styles.userTypeButtonSelected
              ]}
              onPress={() => handleUserTypePress('customer')}
            >
              <Ionicons 
                name="person-outline" 
                size={20} 
                color="#FFFFFF" 
                style={styles.userTypeIcon}
              />
              <Text style={[
                styles.userTypeText,
                userType === 'customer' && styles.userTypeTextSelected
              ]}>CUSTOMER</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.userTypeButton,
                userType === 'salon' && styles.userTypeButtonSelected
              ]}
              onPress={() => handleUserTypePress('salon')}
            >
              <Ionicons 
                name="business-outline" 
                size={20} 
                color="#FFFFFF" 
                style={styles.userTypeIcon}
              />
              <Text style={[
                styles.userTypeText,
                userType === 'salon' && styles.userTypeTextSelected
              ]}>SALON OWNER</Text>
            </TouchableOpacity>
          </View>

          {/* Input Fields - 88% screen width, 50px height */}
          <View style={styles.inputFieldsContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder="Email address"
                placeholderTextColor="#B3B8BB"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder="Password"
                placeholderTextColor="#B3B8BB"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!isPasswordVisible}
              />
              <TouchableOpacity
                style={styles.eyeIconButton}
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                <Ionicons
                  name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color="#98A89B"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            {/* Sign In Button - 72% width, 50px height, white bg */}
            <TouchableOpacity
              style={[styles.signInButton, isLoading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={styles.signInButtonText}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            {/* Create Account Button - Same styling */}
            <TouchableOpacity
              style={styles.createAccountButton}
              onPress={() => navigation.navigate('SignUp')}
            >
              <Text style={styles.createAccountButtonText}>Create Account</Text>
            </TouchableOpacity>

            {/* Continue with Google Button - Google G logo + text */}
            <TouchableOpacity
              style={styles.googleSignInButton}
              onPress={handleGoogleSignIn}
              disabled={isLoading}
            >
              <Ionicons name="logo-google" size={22} color="#1C3A25" style={styles.googleIcon} />
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
    paddingHorizontal: 24, // Global horizontal padding
  },

  // Brand Header Section
  brandHeader: {
    alignItems: 'center',
    marginTop: 48, // 48px from top
  },
  logoIcon: {
    width: 48,
    height: 48,
  },
  brandName: {
    fontSize: 32,
    fontWeight: '700', // Bold
    color: '#FFFFFF',
    letterSpacing: 2,
    lineHeight: 40,
    textAlign: 'center',
    textTransform: 'uppercase',
    marginTop: 8, // Below logo
  },
  brandSubtitle: {
    fontSize: 16,
    color: '#C5DAC1',
    fontWeight: '500', // Medium
    textAlign: 'center',
    marginTop: 8,
  },

  // User Type Selector
  userTypeSelector: {
    flexDirection: 'row',
    marginTop: 24, // After brand header
    gap: 12, // 12px spacing between buttons
  },
  userTypeButton: {
    flex: 1, // 48% each
    height: 48,
    borderRadius: 12,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#324C38',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    gap: 10, // 10px padding between icon and text
  },
  userTypeButtonSelected: {
    backgroundColor: '#2C8A4C',
    borderColor: 'transparent',
  },
  userTypeIcon: {
    marginRight: 0,
  },
  userTypeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#C5DAC1',
  },
  userTypeTextSelected: {
    color: '#FFFFFF',
  },

  // Input Fields
  inputFieldsContainer: {
    marginTop: 24, // After user type selector
    gap: 18, // 18px between inputs
  },
  inputWrapper: {
    position: 'relative',
  },
  textInput: {
    width: '100%', // 88% of screen width
    height: 50,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    paddingLeft: 18, // Left padding inside input
    fontSize: 16,
    color: '#224A2D',
    borderWidth: 0, // No border
    elevation: 2, // Box shadow
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  eyeIconButton: {
    position: 'absolute',
    right: 16,
    top: 14,
    width: 22,
    height: 22,
  },

  // Action Buttons
  actionsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28, // 28px after inputs
    gap: 16, // 16px spacing between buttons
  },
  signInButton: {
    width: '72%', // 72% of screen width
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 25, // Pill shape
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2, // Subtle box shadow
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  signInButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C3A25',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  createAccountButton: {
    width: '72%',
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  createAccountButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C3A25',
  },
  googleSignInButton: {
    width: '72%',
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    gap: 10, // 10px between logo and text
  },
  googleIcon: {
    marginRight: 0,
  },
  googleButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C3A25',
  },
});