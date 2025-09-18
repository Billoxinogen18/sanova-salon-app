import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { authService } from '../services/firebaseService';
import { colors } from '../theme/colors';
import { typography, spacing, shadows, borderRadius } from '../theme/premiumStyles';
import { animationSequences, AnimationController } from '../theme/animations';

export default function SignUpScreenPremium({ navigation }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'customer',
    phone: '',
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // Animation controller
  const animationController = useRef(new AnimationController()).current;

  // Animated values for different sections
  const headerAnimatedValues = useRef({
    opacity: new Animated.Value(0),
    translateY: new Animated.Value(-30),
  }).current;

  const userTypeAnimatedValues = useRef({
    opacity: new Animated.Value(0),
    translateY: new Animated.Value(20),
  }).current;

  const formAnimatedValues = useRef([
    { opacity: new Animated.Value(0), translateY: new Animated.Value(30) }, // Name inputs
    { opacity: new Animated.Value(0), translateY: new Animated.Value(30) }, // Email input
    { opacity: new Animated.Value(0), translateY: new Animated.Value(30) }, // Phone input
    { opacity: new Animated.Value(0), translateY: new Animated.Value(30) }, // Password inputs
  ]).current;

  const buttonAnimatedValues = useRef({
    opacity: new Animated.Value(0),
    translateY: new Animated.Value(30),
    scale: new Animated.Value(1),
  }).current;

  // Input field animations
  const inputAnimations = useRef({
    firstName: { scale: new Animated.Value(1), borderColor: new Animated.Value(0) },
    lastName: { scale: new Animated.Value(1), borderColor: new Animated.Value(0) },
    email: { scale: new Animated.Value(1), borderColor: new Animated.Value(0) },
    phone: { scale: new Animated.Value(1), borderColor: new Animated.Value(0) },
    password: { scale: new Animated.Value(1), borderColor: new Animated.Value(0) },
    confirmPassword: { scale: new Animated.Value(1), borderColor: new Animated.Value(0) },
  }).current;

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    startEntranceAnimations();

    return () => {
      animationController.stopAllAnimations();
    };
  }, []);

  const startEntranceAnimations = () => {
    const headerAnimation = animationSequences.fadeInUp(headerAnimatedValues, 0);
    const userTypeAnimation = animationSequences.fadeInUp(userTypeAnimatedValues, 200);
    const formAnimations = animationSequences.staggerFadeIn(formAnimatedValues, 150);
    const buttonAnimation = animationSequences.fadeInUp(buttonAnimatedValues, 800);

    const entranceAnimation = Animated.parallel([
      headerAnimation,
      userTypeAnimation,
      formAnimations,
      buttonAnimation,
    ]);

    animationController.registerAnimation('entrance', entranceAnimation);
    entranceAnimation.start();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleInputFocus = (field) => {
    setFocusedField(field);
    const animations = inputAnimations[field];
    if (animations) {
      Animated.parallel([
        Animated.timing(animations.scale, { toValue: 1.02, duration: 200, useNativeDriver: true }),
        Animated.timing(animations.borderColor, { toValue: 1, duration: 200, useNativeDriver: false }),
      ]).start();
    }
  };

  const handleInputBlur = (field) => {
    setFocusedField(null);
    const animations = inputAnimations[field];
    if (animations) {
      Animated.parallel([
        Animated.timing(animations.scale, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(animations.borderColor, { toValue: 0, duration: 200, useNativeDriver: false }),
      ]).start();
    }
  };

  const handleUserTypePress = (type) => {
    if (type !== formData.userType) {
      Animated.sequence([
        Animated.timing(userTypeAnimatedValues.scale, { toValue: 0.98, duration: 100, useNativeDriver: true }),
        Animated.timing(userTypeAnimatedValues.scale, { toValue: 1, duration: 100, useNativeDriver: true }),
      ]).start();
      
      handleInputChange('userType', type);
    }
  };

  const validateForm = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim() || 
        !formData.email.trim() || !formData.password.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    // Button press animation
    Animated.sequence([
      Animated.timing(buttonAnimatedValues.scale, { toValue: 0.96, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonAnimatedValues.scale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();

    try {
      const userData = {
        name: `${formData.firstName} ${formData.lastName}`,
        displayName: `${formData.firstName} ${formData.lastName}`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        role: formData.userType,
      };

      const signUpResult = await authService.signUp(formData.email, formData.password, userData);
      
      if (!signUpResult.success) {
        Alert.alert('Sign Up Failed', signUpResult.error);
        setIsLoading(false);
        return;
      }

      // Success animation
      Animated.parallel([
        Animated.timing(formAnimatedValues[0].scale, { toValue: 1.05, duration: 200, useNativeDriver: true }),
        Animated.timing(formAnimatedValues[0].opacity, { toValue: 0.8, duration: 200, useNativeDriver: true }),
      ]).start(() => {
        Alert.alert(
          'Success', 
          'Account created successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                if (formData.userType === 'customer') {
                  navigation.navigate('CustomerApp');
                } else {
                  navigation.navigate('SalonOwnerApp');
                }
              }
            }
          ]
        );
      });
    } catch (error) {
      console.error('Sign up error:', error);
      Alert.alert('Sign Up Failed', error.message || 'An unexpected error occurred');
      setIsLoading(false);
    }
  };

  const getInputBorderColor = (field) => {
    return inputAnimations[field]?.borderColor.interpolate({
      inputRange: [0, 1],
      outputRange: [colors.border.primary, colors.primary],
    }) || colors.border.primary;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Section */}
          <Animated.View 
            style={[
              styles.headerSection,
              {
                opacity: headerAnimatedValues.opacity,
                transform: [{ translateY: headerAnimatedValues.translateY }],
              }
            ]}
          >
            <View style={styles.logoContainer}>
              <Ionicons name="leaf" size={32} color={colors.background.white} />
            </View>
            <Text style={styles.headerTitle}>Create Account</Text>
            <Text style={styles.headerSubtitle}>Join the Sanova community</Text>
          </Animated.View>

          {/* User Type Selection */}
          <Animated.View 
            style={[
              styles.userTypeSection,
              {
                opacity: userTypeAnimatedValues.opacity,
                transform: [
                  { translateY: userTypeAnimatedValues.translateY },
                  { scale: userTypeAnimatedValues.scale || 1 }
                ],
              }
            ]}
          >
            <Text style={styles.sectionLabel}>I am a...</Text>
            <View style={styles.userTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.userTypeButton,
                  formData.userType === 'customer' && styles.activeUserType
                ]}
                onPress={() => handleUserTypePress('customer')}
                activeOpacity={0.8}
              >
                <Ionicons 
                  name="person" 
                  size={20} 
                  color={formData.userType === 'customer' ? colors.background.white : colors.text.primary} 
                />
                <Text style={[
                  styles.userTypeText,
                  formData.userType === 'customer' && styles.activeUserTypeText
                ]}>
                  Customer
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.userTypeButton,
                  formData.userType === 'salon' && styles.activeUserType
                ]}
                onPress={() => handleUserTypePress('salon')}
                activeOpacity={0.8}
              >
                <Ionicons 
                  name="storefront" 
                  size={20} 
                  color={formData.userType === 'salon' ? colors.background.white : colors.text.primary} 
                />
                <Text style={[
                  styles.userTypeText,
                  formData.userType === 'salon' && styles.activeUserTypeText
                ]}>
                  Salon Owner
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Name Fields */}
          <Animated.View 
            style={[
              styles.formSection,
              {
                opacity: formAnimatedValues[0].opacity,
                transform: [{ translateY: formAnimatedValues[0].translateY }],
              }
            ]}
          >
            <Text style={styles.sectionLabel}>Personal Information</Text>
            <View style={styles.nameRow}>
              <View style={styles.halfInputGroup}>
                <Text style={styles.inputLabel}>First Name *</Text>
                <Animated.View
                  style={[
                    styles.inputContainer,
                    {
                      borderColor: getInputBorderColor('firstName'),
                      transform: [{ scale: inputAnimations.firstName.scale }],
                    }
                  ]}
                >
                  <TextInput
                    style={styles.textInput}
                    placeholder="First name"
                    placeholderTextColor={colors.text.secondary}
                    value={formData.firstName}
                    onChangeText={(value) => handleInputChange('firstName', value)}
                    onFocus={() => handleInputFocus('firstName')}
                    onBlur={() => handleInputBlur('firstName')}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                </Animated.View>
              </View>

              <View style={styles.halfInputGroup}>
                <Text style={styles.inputLabel}>Last Name *</Text>
                <Animated.View
                  style={[
                    styles.inputContainer,
                    {
                      borderColor: getInputBorderColor('lastName'),
                      transform: [{ scale: inputAnimations.lastName.scale }],
                    }
                  ]}
                >
                  <TextInput
                    style={styles.textInput}
                    placeholder="Last name"
                    placeholderTextColor={colors.text.secondary}
                    value={formData.lastName}
                    onChangeText={(value) => handleInputChange('lastName', value)}
                    onFocus={() => handleInputFocus('lastName')}
                    onBlur={() => handleInputBlur('lastName')}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                </Animated.View>
              </View>
            </View>
          </Animated.View>

          {/* Contact Information */}
          <Animated.View 
            style={[
              styles.formSection,
              {
                opacity: formAnimatedValues[1].opacity,
                transform: [{ translateY: formAnimatedValues[1].translateY }],
              }
            ]}
          >
            <Text style={styles.sectionLabel}>Contact Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address *</Text>
              <Animated.View
                style={[
                  styles.inputContainer,
                  {
                    borderColor: getInputBorderColor('email'),
                    transform: [{ scale: inputAnimations.email.scale }],
                  }
                ]}
              >
                <Ionicons name="mail-outline" size={20} color={colors.text.secondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.text.secondary}
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  onFocus={() => handleInputFocus('email')}
                  onBlur={() => handleInputBlur('email')}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </Animated.View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <Animated.View
                style={[
                  styles.inputContainer,
                  {
                    borderColor: getInputBorderColor('phone'),
                    transform: [{ scale: inputAnimations.phone.scale }],
                  }
                ]}
              >
                <Ionicons name="call-outline" size={20} color={colors.text.secondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Optional"
                  placeholderTextColor={colors.text.secondary}
                  value={formData.phone}
                  onChangeText={(value) => handleInputChange('phone', value)}
                  onFocus={() => handleInputFocus('phone')}
                  onBlur={() => handleInputBlur('phone')}
                  keyboardType="phone-pad"
                />
              </Animated.View>
            </View>
          </Animated.View>

          {/* Password Fields */}
          <Animated.View 
            style={[
              styles.formSection,
              {
                opacity: formAnimatedValues[2].opacity,
                transform: [{ translateY: formAnimatedValues[2].translateY }],
              }
            ]}
          >
            <Text style={styles.sectionLabel}>Security</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password *</Text>
              <Animated.View
                style={[
                  styles.inputContainer,
                  {
                    borderColor: getInputBorderColor('password'),
                    transform: [{ scale: inputAnimations.password.scale }],
                  }
                ]}
              >
                <Ionicons name="lock-closed-outline" size={20} color={colors.text.secondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Create a password"
                  placeholderTextColor={colors.text.secondary}
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  onFocus={() => handleInputFocus('password')}
                  onBlur={() => handleInputBlur('password')}
                  secureTextEntry={!isPasswordVisible}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                  style={styles.eyeIcon}
                  activeOpacity={0.7}
                >
                  <Ionicons 
                    name={isPasswordVisible ? "eye-outline" : "eye-off-outline"} 
                    size={20} 
                    color={colors.text.secondary} 
                  />
                </TouchableOpacity>
              </Animated.View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Confirm Password *</Text>
              <Animated.View
                style={[
                  styles.inputContainer,
                  {
                    borderColor: getInputBorderColor('confirmPassword'),
                    transform: [{ scale: inputAnimations.confirmPassword.scale }],
                  }
                ]}
              >
                <Ionicons name="lock-closed-outline" size={20} color={colors.text.secondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Confirm your password"
                  placeholderTextColor={colors.text.secondary}
                  value={formData.confirmPassword}
                  onChangeText={(value) => handleInputChange('confirmPassword', value)}
                  onFocus={() => handleInputFocus('confirmPassword')}
                  onBlur={() => handleInputBlur('confirmPassword')}
                  secureTextEntry={!isConfirmPasswordVisible}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                  style={styles.eyeIcon}
                  activeOpacity={0.7}
                >
                  <Ionicons 
                    name={isConfirmPasswordVisible ? "eye-outline" : "eye-off-outline"} 
                    size={20} 
                    color={colors.text.secondary} 
                  />
                </TouchableOpacity>
              </Animated.View>
            </View>
          </Animated.View>

          {/* Button Section */}
          <Animated.View 
            style={[
              styles.buttonSection,
              {
                opacity: buttonAnimatedValues.opacity,
                transform: [
                  { translateY: buttonAnimatedValues.translateY },
                  { scale: buttonAnimatedValues.scale }
                ],
              }
            ]}
          >
            <TouchableOpacity
              style={[styles.signUpButton, isLoading && styles.signUpButtonDisabled]}
              onPress={handleSignUp}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <Animated.View style={styles.loadingSpinner} />
                  <Text style={styles.signUpButtonText}>Creating Account...</Text>
                </View>
              ) : (
                <Text style={styles.signUpButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            <View style={styles.loginSection}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity 
                onPress={() => navigation.navigate('Login')}
                activeOpacity={0.7}
              >
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
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
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  headerSection: {
    alignItems: 'center',
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    ...shadows.card,
  },
  headerTitle: {
    ...typography.title2,
    color: colors.background.white,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.background.white,
    opacity: 0.8,
  },
  userTypeSection: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
  sectionLabel: {
    ...typography.captionMedium,
    color: colors.background.white,
    marginBottom: spacing.md,
    opacity: 0.9,
  },
  userTypeContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: borderRadius.lg,
    padding: 4,
  },
  userTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  activeUserType: {
    backgroundColor: colors.primary,
    ...shadows.card,
  },
  userTypeText: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  activeUserTypeText: {
    color: colors.background.white,
  },
  formSection: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
  nameRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  halfInputGroup: {
    flex: 1,
    marginBottom: spacing.lg,
  },
  inputLabel: {
    ...typography.captionMedium,
    color: colors.background.white,
    marginBottom: spacing.sm,
    opacity: 0.9,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
    ...shadows.card,
  },
  inputIcon: {
    marginRight: spacing.md,
  },
  textInput: {
    flex: 1,
    ...typography.body,
    color: colors.text.primary,
  },
  eyeIcon: {
    padding: spacing.xs,
  },
  buttonSection: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  signUpButton: {
    backgroundColor: colors.background.white,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    ...shadows.elevated,
  },
  signUpButtonDisabled: {
    opacity: 0.7,
  },
  signUpButtonText: {
    ...typography.button,
    color: colors.primary,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  loadingSpinner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
    borderTopColor: 'transparent',
  },
  loginSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    ...typography.body,
    color: colors.background.white,
    opacity: 0.8,
  },
  loginLink: {
    ...typography.bodyMedium,
    color: colors.background.white,
  },
});
