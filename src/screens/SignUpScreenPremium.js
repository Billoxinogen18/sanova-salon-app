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
  SafeAreaView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { authService, firestoreService } from '../services/firebaseService';

export default function SignUpScreenPremium({ navigation }) {
  const [formData, setFormData] = useState({
    firstName: '',
    secondName: '', // Changed to match specifications
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
    if (!formData.firstName || !formData.secondName || !formData.email || !formData.password) {
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
        name: `${formData.firstName} ${formData.secondName}`,
        displayName: `${formData.firstName} ${formData.secondName}`,
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
    <LinearGradient
      colors={['#224a2d', '#235234']} // Exact gradient colors from specs
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#224a2d" />
      
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView 
            style={styles.scrollView} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Header & Branding - 44px from top */}
            <View style={styles.headerBranding}>
              {/* SANOVA logo - 48x48px */}
                <Image 
                  source={require('../../assets/logo.png')}
                  style={styles.logoIcon}
                  resizeMode="contain"
                />
              {/* SANOVA text - 28px, weight 700, white, 1.5px letter spacing */}
              <Text style={styles.brandTitle}>SANOVA</Text>
              {/* Main title - 24px bold, white, 18px margin top */}
              <Text style={styles.pageTitle}>Create Account</Text>
              {/* Secondary subtitle - 15px, #89AF97, weight 500, 4px margin top */}
              <Text style={styles.pageSubtitle}>Join the Sanova community</Text>
            </View>

            {/* Selection Buttons (Customer / Salon Owner) - 24px margin top */}
            <View style={styles.selectionButtons}>
              <TouchableOpacity
                style={[
                  styles.selectionButton,
                  formData.userType === 'customer' && styles.selectionButtonActive
                ]}
                onPress={() => handleUserTypePress('customer')}
              >
                <Ionicons 
                  name="person-outline" 
                  size={20} 
                  color="#FFFFFF" 
                  style={styles.selectionIcon}
                />
                <Text style={[
                  styles.selectionText,
                  formData.userType === 'customer' && styles.selectionTextActive
                ]}>CUSTOMER</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.selectionButton,
                  formData.userType === 'salon' && styles.selectionButtonActive
                ]}
                onPress={() => handleUserTypePress('salon')}
              >
                <Ionicons 
                  name="business-outline" 
                  size={20} 
                  color="#FFFFFF" 
                  style={styles.selectionIcon}
                />
                <Text style={[
                  styles.selectionText,
                  formData.userType === 'salon' && styles.selectionTextActive
                ]}>SALON OWNER</Text>
              </TouchableOpacity>
            </View>

            {/* Input Fields - 88% width, min-height 48px */}
            <View style={styles.inputFields}>
              {/* First Name and Second Name - stacked vertically with 12px gap */}
              <View style={styles.inputField}>
                <TextInput
                  style={styles.textInput}
                  placeholder="First Name"
                  placeholderTextColor="#BFD7C6"
                  value={formData.firstName}
                  onChangeText={(value) => handleInputChange('firstName', value)}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputField}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Second Name"
                  placeholderTextColor="#BFD7C6"
                  value={formData.secondName}
                  onChangeText={(value) => handleInputChange('secondName', value)}
                  autoCapitalize="words"
                />
              </View>

              {/* Email field */}
              <View style={styles.inputField}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Email"
                  placeholderTextColor="#BFD7C6"
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Phone number (optional) */}
              <View style={styles.inputField}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Phone number (optional)"
                  placeholderTextColor="#BFD7C6"
                  value={formData.phone}
                  onChangeText={(value) => handleInputChange('phone', value)}
                  keyboardType="phone-pad"
                />
              </View>

              {/* Password with eye icon */}
              <View style={styles.inputField}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Password"
                  placeholderTextColor="#BFD7C6"
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  secureTextEntry={!isPasswordVisible}
                />
                <TouchableOpacity
                  style={styles.eyeIconButton}
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  <Ionicons
                    name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#A5B8A2"
                  />
                </TouchableOpacity>
              </View>

              {/* Confirm Password with eye icon */}
              <View style={styles.inputField}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Confirm Password"
                  placeholderTextColor="#BFD7C6"
                  value={formData.confirmPassword}
                  onChangeText={(value) => handleInputChange('confirmPassword', value)}
                  secureTextEntry={!isConfirmPasswordVisible}
                />
                <TouchableOpacity
                  style={styles.eyeIconButton}
                  onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                >
                  <Ionicons
                    name={isConfirmPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#A5B8A2"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Sign Up Button - 88% width, 52px height, white bg */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.signUpButton, isLoading && styles.buttonDisabled]}
                onPress={handleSignUp}
                disabled={isLoading}
              >
                <Text style={styles.signUpButtonText}>
                  {isLoading ? 'Creating Account...' : 'Sign Up'}
                </Text>
              </TouchableOpacity>

              {/* Google Sign Up - no border, white bg */}
              <TouchableOpacity
                style={styles.googleSignUpButton}
                onPress={handleGoogleSignUp}
                disabled={isLoading}
              >
                <Ionicons name="logo-google" size={22} color="#224A2D" style={styles.googleIcon} />
                <Text style={styles.googleButtonText}>Google</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
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
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24, // Global horizontal padding
  },

  // Header & Branding Section
  headerBranding: {
    alignItems: 'center',
    marginTop: 44, // 44px from top
  },
  logoIcon: {
    width: 80,
    height: 80,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '700', // Weight 700 (bold)
    color: '#FFFFFF',
    letterSpacing: 1.5, // 1.5px letter spacing
    lineHeight: 32,
    textAlign: 'center',
    textTransform: 'uppercase',
    marginTop: 8, // Directly under logo
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 28,
    marginTop: 18, // 18px after logo/title
  },
  pageSubtitle: {
    fontSize: 15,
    color: '#89AF97',
    fontWeight: '500', // Weight 500
    textAlign: 'center',
    marginTop: 4, // 4px after main title
  },

  // Selection Buttons Section
  selectionButtons: {
    flexDirection: 'row',
    marginTop: 24, // 24px after headers
    gap: 12, // 12px spacing between buttons (justifyContent space-between alternative)
  },
  selectionButton: {
    flex: 1, // 48% width each
    height: 48,
    borderRadius: 12,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#507456',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    gap: 10, // 10px spacing before text
  },
  selectionButtonActive: {
    backgroundColor: '#6AC38F',
    borderColor: 'transparent',
  },
  selectionIcon: {
    marginRight: 0,
  },
  selectionText: {
    fontSize: 18,
    fontWeight: '600', // Weight 600
    color: '#D1E5D7',
    textTransform: 'uppercase',
  },
  selectionTextActive: {
    color: '#FFFFFF',
  },

  // Input Fields Section
  inputFields: {
    marginTop: 24, // After selection buttons
  },
  inputField: {
    position: 'relative',
    marginBottom: 18, // 18px between each field
  },
  textInput: {
    width: '100%', // 88% of screen width
    minHeight: 52,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingLeft: 20, // 20px left padding
    paddingRight: 50, // Space for eye icon
    fontSize: 16,
    color: '#224A2D',
    borderWidth: 1,
    borderColor: '#E8F5E8',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  eyeIconButton: {
    position: 'absolute',
    right: 16,
    top: 14,
    width: 20,
    height: 20,
  },

  // Action Buttons Section
  actionButtons: {
    alignItems: 'center',
    marginTop: 28, // 28px after input fields
    gap: 18, // 18px after main submit
  },
  signUpButton: {
    width: '100%', // 88% width
    height: 52,
    backgroundColor: '#FFFFFF',
    borderRadius: 26, // Pill shape
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3, // Drop shadow for floating effect
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  signUpButtonText: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#1C3A25',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  googleSignUpButton: {
    width: '100%', // 88% width
    height: 52,
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    borderWidth: 0, // No border
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12, // 12px to the right of logo
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  googleIcon: {
    marginRight: 0,
  },
  googleButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#224A2D',
  },
});