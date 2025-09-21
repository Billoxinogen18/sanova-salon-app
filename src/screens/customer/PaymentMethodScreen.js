import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const { width } = Dimensions.get('window');

export default function PaymentMethodScreen({ navigation, route }) {
  const { service, selectedDate, selectedTime } = route.params || {};
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePaymentMethodSelect = (method) => {
    // Touch feedback animation
    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    
    setSelectedPaymentMethod(method);
  };

  const handlePayNow = () => {
    // Button press animation
    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();

    // Navigate to payment terms screen
    navigation.navigate('PaymentTerms', {
      service: service,
      selectedDate,
      selectedTime,
      paymentMethod: selectedPaymentMethod,
    });
  };

  const paymentMethods = [
    {
      id: 'card',
      label: 'Credit or Debit Card',
      icon: 'card',
      logo: 'https://img.icons8.com/color-glass/48/visa.png', // Visa logo
    },
    {
      id: 'apple',
      label: 'Apple Pay',
      icon: 'phone-portrait',
      logo: 'https://img.icons8.com/ios-filled/50/apple-pay.png', // Apple Pay logo
    },
    {
      id: 'mobile',
      label: 'Mobile Pay',
      icon: 'phone-portrait',
      logo: 'https://img.icons8.com/fluency/48/speaker-phone.png', // Mobile Pay logo
    },
  ];

  return (
    <View style={styles.container}>
      {/* App Bar - Same as previous screen */}
      <View style={styles.appBar}>
        <StatusBar barStyle="light-content" backgroundColor={colors.deepForestGreen} />
        
        {/* SANOVA Logo */}
        <View style={styles.logoContainer}>
          <Image source={require('../../../assets/logo.png')} style={styles.logoImage} />
          <Text style={styles.logoText}>SANOVA</Text>
        </View>
      </View>

      {/* Content Container - White card, top corners radius 24px */}
      <Animated.View 
        style={[
          styles.contentContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Section Header - "Payment Method", flush left, Inter bold, 26px */}
        <Text style={styles.sectionHeader}>Payment Method</Text>

        {/* Payment Option Cards */}
        {paymentMethods.map((method, index) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.paymentCard,
              selectedPaymentMethod === method.id && styles.selectedPaymentCard,
            ]}
            onPress={() => handlePaymentMethodSelect(method.id)}
            activeOpacity={0.8}
          >
            <View style={styles.paymentCardContent}>
              <Text style={styles.paymentLabel}>{method.label}</Text>
              <Image source={{ uri: method.logo }} style={styles.paymentLogo} />
            </View>
          </TouchableOpacity>
        ))}

        {/* Pay Now Button - Bottom, full width minus 16px margins, 50px height */}
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity 
            style={styles.payNowButton}
            onPress={handlePayNow}
            activeOpacity={0.9}
          >
            <Text style={styles.payNowButtonText}>Pay Now</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.warmCream, // Warm cream background
  },
  
  // App Bar - Same styling as previous screen
  appBar: {
    height: 76,
    backgroundColor: colors.deepForestGreen,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  logoImage: {
    width: 24,
    height: 24,
    marginRight: 8,
    tintColor: colors.white,
  },
  
  logoText: {
    ...typography.logo,
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 2,
    color: colors.white,
  },
  
  // Content Container - White card, top corners radius 24px, flush left/right
  contentContainer: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 12, // 12px margin-top
    paddingHorizontal: 24,
    paddingTop: 26, // 26px margin-top
  },
  
  // Section Header - Inter bold, 26px, flush left
  sectionHeader: {
    fontFamily: 'Inter',
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.darkGreen,
    marginTop: 26,
  },
  
  // Payment Option Cards - Each card 52px height, 96% width
  paymentCard: {
    width: '96%',
    height: 52,
    backgroundColor: colors.paymentCardBg, // #FDF7EA
    borderRadius: 12,
    marginVertical: 7, // 14px vertical margin between cards (7px each side)
    shadowColor: colors.deepForestGreen,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 7,
    elevation: 2,
  },
  
  selectedPaymentCard: {
    backgroundColor: colors.paleIvory, // Slightly different when selected
    borderWidth: 2,
    borderColor: colors.deepForestGreen,
  },
  
  paymentCardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22, // 22px left/right internal padding
  },
  
  // Payment Label - Inter medium, 18px, left-aligned
  paymentLabel: {
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: '500',
    color: colors.darkGreen,
  },
  
  // Payment Logo - 32px wide, right-aligned
  paymentLogo: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  
  // Pay Now Button - Bottom, full width minus 16px margins, 50px height
  payNowButton: {
    width: width - 32, // Full width minus 16px margins
    height: 50,
    backgroundColor: colors.deepForestGreen,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30, // Space from last payment card
    alignSelf: 'center',
    shadowColor: colors.deepForestGreen,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  
  // Pay Now Button Text - Inter bold, 18px, white, letter-spacing 1.2px
  payNowButtonText: {
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
    letterSpacing: 1.2,
  },
});