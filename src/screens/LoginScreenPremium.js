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
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { authService, firestoreService } from '../services/firebaseService';
import { colors } from '../theme/colors';
import { typography, spacing, shadows, borderRadius } from '../theme/premiumStyles';
import { animationSequences, AnimationController } from '../theme/animations';

const { width, height } = Dimensions.get('window');

export default function LoginScreenPremium({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('customer');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Animation controller
  const animationController = useRef(new AnimationController()).current;

  // Animated values
  const logoAnimatedValues = useRef({
    scale: new Animated.Value(0.8),
    opacity: new Animated.Value(0),
    rotate: new Animated.Value(0),
  }).current;

  const headerAnimatedValues = useRef({
    opacity: new Animated.Value(0),
    translateY: new Animated.Value(-30),
  }).current;

  const formAnimatedValues = useRef({
    opacity: new Animated.Value(0),
    translateY: new Animated.Value(50),
    scale: new Animated.Value(0.95),
  }).current;

  const buttonAnimatedValues = useRef({
    opacity: new Animated.Value(0),
    translateY: new Animated.Value(30),
    scale: new Animated.Value(1),
  }).current;

  const userTypeAnimatedValues = useRef({
    opacity: new Animated.Value(0),
    translateY: new Animated.Value(20),
  }).current;

  const emailInputScale = useRef(new Animated.Value(1)).current;
  const passwordInputScale = useRef(new Animated.Value(1)).current;
  const emailBorderAnimation = useRef(new Animated.Value(0)).current;
  const passwordBorderAnimation = useRef(new Animated.Value(0)).current;

  // Floating animation for logo
  const floatingAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    
    // Start entrance animations
    startEntranceAnimations();
    
    // Start floating animation for logo
    startFloatingAnimation();

    return () => {
      animationController.stopAllAnimations();
    };
  }, []);

  const startEntranceAnimations = () => {
    const logoAnimation = animationSequences.fadeInUp(logoAnimatedValues, 0);
    const headerAnimation = animationSequences.fadeInUp(headerAnimatedValues, 200);
    const userTypeAnimation = animationSequences.fadeInUp(userTypeAnimatedValues, 400);
    const formAnimation = animationSequences.fadeInUp(formAnimatedValues, 600);
    const buttonAnimation = animationSequences.fadeInUp(buttonAnimatedValues, 800);

    animationController.registerAnimation('entrance', 
      Animated.parallel([
        logoAnimation,
        headerAnimation,
        userTypeAnimation,
        formAnimation,
        buttonAnimation,
      ])
    );

    animationController.animations.get('entrance').start();
  };

  const startFloatingAnimation = () => {
    const floating = Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnimation, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnimation, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );

    animationController.registerAnimation('floating', floating);
    floating.start();
  };

  const handleEmailFocus = () => {
    setEmailFocused(true);
    Animated.parallel([
      Animated.timing(emailInputScale, { toValue: 1.02, duration: 200, useNativeDriver: true }),
      Animated.timing(emailBorderAnimation, { toValue: 1, duration: 200, useNativeDriver: false }),
    ]).start();
  };

  const handleEmailBlur = () => {
    setEmailFocused(false);
    Animated.parallel([
      Animated.timing(emailInputScale, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.timing(emailBorderAnimation, { toValue: 0, duration: 200, useNativeDriver: false }),
    ]).start();
  };

  const handlePasswordFocus = () => {
    setPasswordFocused(true);
    Animated.parallel([
      Animated.timing(passwordInputScale, { toValue: 1.02, duration: 200, useNativeDriver: true }),
      Animated.timing(passwordBorderAnimation, { toValue: 1, duration: 200, useNativeDriver: false }),
    ]).start();
  };

  const handlePasswordBlur = () => {
    setPasswordFocused(false);
    Animated.parallel([
      Animated.timing(passwordInputScale, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.timing(passwordBorderAnimation, { toValue: 0, duration: 200, useNativeDriver: false }),
    ]).start();
  };

  const handleUserTypePress = (type) => {
    if (type !== userType) {
      // Animate user type selection
      Animated.sequence([
        Animated.timing(userTypeAnimatedValues.scale, { toValue: 0.98, duration: 100, useNativeDriver: true }),
        Animated.timing(userTypeAnimatedValues.scale, { toValue: 1, duration: 100, useNativeDriver: true }),
      ]).start();
      
      setUserType(type);
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);

    // Button press animation
    Animated.sequence([
      Animated.timing(buttonAnimatedValues.scale, { toValue: 0.96, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonAnimatedValues.scale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();

    try {
      const signInResult = await authService.signIn(email, password);
      
      if (!signInResult.success) {
        Alert.alert('Login Failed', signInResult.error);
        setIsLoading(false);
        return;
      }

      const user = signInResult.user;
      const userDataResult = await firestoreService.users.get(user.uid);
      
      if (userDataResult.success) {
        const userData = userDataResult.data;
        
        if (userData.role !== userType) {
          Alert.alert(
            'Account Type Mismatch', 
            `This account is registered as a ${userData.role}. Please select the correct account type.`
          );
          setIsLoading(false);
          return;
        }
        
        // Success animation before navigation
        Animated.parallel([
          Animated.timing(formAnimatedValues.scale, { toValue: 1.05, duration: 200, useNativeDriver: true }),
          Animated.timing(formAnimatedValues.opacity, { toValue: 0.8, duration: 200, useNativeDriver: true }),
        ]).start(() => {
          if (userType === 'customer') {
            navigation.navigate('CustomerApp');
          } else {
            navigation.navigate('SalonOwnerApp');
          }
        });
      } else {
        const newUserData = {
          uid: user.uid,
          email: user.email,
          name: user.displayName || email.split('@')[0],
          role: userType,
          phone: '',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        await firestoreService.users.create(user.uid, newUserData);
        
        if (userType === 'customer') {
          navigation.navigate('CustomerApp');
        } else {
          navigation.navigate('SalonOwnerApp');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Failed', error.message || 'An unexpected error occurred');
      setIsLoading(false);
    }
  };

  const logoFloatingTransform = floatingAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  const emailBorderColor = emailBorderAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border.primary, colors.primary],
  });

  const passwordBorderColor = passwordBorderAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border.primary, colors.primary],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Background Elements */}
        <View style={styles.backgroundPattern} />
        
        {/* Logo Section */}
        <Animated.View 
          style={[
            styles.logoSection,
            {
              opacity: logoAnimatedValues.opacity,
              transform: [
                { scale: logoAnimatedValues.scale },
                { translateY: logoFloatingTransform },
                { 
                  rotate: logoAnimatedValues.rotate.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  })
                }
              ],
            }
          ]}
        >
          <View style={styles.logoContainer}>
            <Ionicons name="leaf" size={48} color={colors.background.white} />
          </View>
          <Text style={styles.logoText}>SANOVA</Text>
          <Text style={styles.logoSubtext}>Luxury Beauty Experience</Text>
        </Animated.View>

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
          <Text style={styles.welcomeText}>Welcome Back</Text>
          <Text style={styles.subText}>Sign in to continue your journey</Text>
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
          <View style={styles.userTypeContainer}>
            <TouchableOpacity
              style={[
                styles.userTypeButton,
                userType === 'customer' && styles.activeUserType
              ]}
              onPress={() => handleUserTypePress('customer')}
              activeOpacity={0.8}
            >
              <Ionicons 
                name="person" 
                size={20} 
                color={userType === 'customer' ? colors.background.white : colors.text.primary} 
              />
              <Text style={[
                styles.userTypeText,
                userType === 'customer' && styles.activeUserTypeText
              ]}>
                Customer
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.userTypeButton,
                userType === 'salon' && styles.activeUserType
              ]}
              onPress={() => handleUserTypePress('salon')}
              activeOpacity={0.8}
            >
              <Ionicons 
                name="storefront" 
                size={20} 
                color={userType === 'salon' ? colors.background.white : colors.text.primary} 
              />
              <Text style={[
                styles.userTypeText,
                userType === 'salon' && styles.activeUserTypeText
              ]}>
                Salon Owner
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Form Section */}
        <Animated.View 
          style={[
            styles.formSection,
            {
              opacity: formAnimatedValues.opacity,
              transform: [
                { translateY: formAnimatedValues.translateY },
                { scale: formAnimatedValues.scale }
              ],
            }
          ]}
        >
          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <Animated.View
              style={[
                styles.inputContainer,
                {
                  borderColor: emailBorderColor,
                  transform: [{ scale: emailInputScale }],
                }
              ]}
            >
              <Ionicons name="mail-outline" size={20} color={colors.text.secondary} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter your email"
                placeholderTextColor={colors.text.secondary}
                value={email}
                onChangeText={setEmail}
                onFocus={handleEmailFocus}
                onBlur={handleEmailBlur}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </Animated.View>
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <Animated.View
              style={[
                styles.inputContainer,
                {
                  borderColor: passwordBorderColor,
                  transform: [{ scale: passwordInputScale }],
                }
              ]}
            >
              <Ionicons name="lock-closed-outline" size={20} color={colors.text.secondary} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter your password"
                placeholderTextColor={colors.text.secondary}
                value={password}
                onChangeText={setPassword}
                onFocus={handlePasswordFocus}
                onBlur={handlePasswordBlur}
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

          {/* Forgot Password */}
          <TouchableOpacity style={styles.forgotPassword} activeOpacity={0.7}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
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
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <Animated.View style={styles.loadingSpinner} />
                <Text style={styles.loginButtonText}>Signing In...</Text>
              </View>
            ) : (
              <Text style={styles.loginButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <View style={styles.signupSection}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('SignUp')}
              activeOpacity={0.7}
            >
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
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
  backgroundPattern: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.03,
    backgroundColor: colors.accent,
  },
  logoSection: {
    alignItems: 'center',
    paddingTop: spacing.xxxl + 20,
    paddingBottom: spacing.xl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    ...shadows.card,
  },
  logoText: {
    ...typography.title1,
    color: colors.background.white,
    fontFamily: 'serif',
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },
  logoSubtext: {
    ...typography.caption,
    color: colors.background.white,
    opacity: 0.8,
    letterSpacing: 1,
  },
  headerSection: {
    alignItems: 'center',
    paddingBottom: spacing.xl,
  },
  welcomeText: {
    ...typography.title2,
    color: colors.background.white,
    marginBottom: spacing.xs,
  },
  subText: {
    ...typography.body,
    color: colors.background.white,
    opacity: 0.8,
  },
  userTypeSection: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  userTypeContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: borderRadius.lg,
    padding: 4,
    backdropFilter: 'blur(10px)',
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
  inputGroup: {
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: spacing.sm,
  },
  forgotPasswordText: {
    ...typography.caption,
    color: colors.background.white,
    opacity: 0.8,
  },
  buttonSection: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  loginButton: {
    backgroundColor: colors.background.white,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    ...shadows.elevated,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
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
  signupSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    ...typography.body,
    color: colors.background.white,
    opacity: 0.8,
  },
  signupLink: {
    ...typography.bodyMedium,
    color: colors.background.white,
  },
});
