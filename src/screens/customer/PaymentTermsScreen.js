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

export default function PaymentTermsScreen({ navigation, route }) {
  const { service, selectedDate, selectedTime, paymentMethod } = route.params || {};
  
  const [selectedTerms, setSelectedTerms] = useState('half');
  
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

  const handleTermsSelect = (terms) => {
    // Touch feedback animation
    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    
    setSelectedTerms(terms);
  };

  const handleContinue = () => {
    // Button press animation
    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();

    // Navigate to payment success or booking confirmation
    navigation.navigate('PaymentSuccess', {
      service: service,
      selectedDate,
      selectedTime,
      paymentMethod,
      paymentTerms: selectedTerms,
    });
  };

  const paymentTerms = [
    {
      id: 'half',
      header: 'Pay half now, half after',
      description: 'You agree to pay 175 kr now and forfeit this amount if you don\'t show up.',
      selected: true,
    },
    {
      id: 'full',
      header: 'Pay full amount',
      description: 'Cancel by [date/time] and get a full refund',
      selected: false,
    },
  ];

  return (
    <View style={styles.container}>
      {/* App Bar - Same styling as previous screens */}
      <View style={styles.appBar}>
        <StatusBar barStyle="light-content" backgroundColor={colors.deepForestGreen} />
        
        {/* SANOVA Logo */}
        <View style={styles.logoContainer}>
          <Image source={require('../../../assets/logo.png')} style={styles.logoImage} />
          <Text style={styles.logoText}>SANOVA</Text>
        </View>
      </View>

      {/* Content Card - White, top corners radius 24px, flush to screen edges */}
      <Animated.View 
        style={[
          styles.contentCard,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Title - "Payment", flush left, Inter bold, 27px */}
        <Text style={styles.title}>Payment</Text>

        {/* Option Card Group - Two stacked white cards */}
        {paymentTerms.map((term, index) => (
          <TouchableOpacity
            key={term.id}
            style={[
              styles.optionCard,
              selectedTerms === term.id && styles.selectedOptionCard,
            ]}
            onPress={() => handleTermsSelect(term.id)}
            activeOpacity={0.8}
          >
            <View style={styles.optionCardContent}>
              <View style={styles.optionTextContainer}>
                {/* Header - Inter bold, 17px */}
                <Text style={styles.optionHeader}>{term.header}</Text>
                
                {/* Description - Inter regular, 15px, grey */}
                <Text style={styles.optionDescription}>{term.description}</Text>
              </View>
              
              {/* Tick Icon - Circle with tick or empty circle */}
              <View style={styles.tickContainer}>
                {selectedTerms === term.id ? (
                  <View style={styles.selectedTick}>
                    <Ionicons name="checkmark" size={16} color={colors.white} />
                  </View>
                ) : (
                  <View style={styles.emptyTick} />
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Continue Button - Bottom, full width minus 18px margins, 51px height */}
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.9}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
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
  
  // App Bar - Same styling as previous screens
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
  
  // Content Card - White, top corners radius 24px, flush to screen edges
  contentCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 12, // 12px margin-top
    paddingHorizontal: 24,
    paddingTop: 26, // 26px margin-top
  },
  
  // Title - Inter bold, 27px, flush left
  title: {
    fontFamily: 'Inter',
    fontSize: 27,
    fontWeight: 'bold',
    color: colors.darkGreen,
    marginTop: 26,
  },
  
  // Option Card - Slightly off-white, border radius 16px, subtle border
  optionCard: {
    width: '97%', // 97% of container
    backgroundColor: colors.offWhite, // #F6F3E9
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderLight, // #E7E6DD
    paddingVertical: 18, // 18px vertical padding
    paddingHorizontal: 20, // 20px horizontal padding
    marginBottom: 14, // 14px margin-bottom between cards
    alignSelf: 'center',
  },
  
  selectedOptionCard: {
    backgroundColor: colors.paleIvory, // Slightly different when selected
    borderColor: colors.deepForestGreen,
  },
  
  optionCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  optionTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  
  // Option Header - Inter bold, 17px, left-aligned
  optionHeader: {
    fontFamily: 'Inter',
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.darkGreen,
    marginBottom: 5,
  },
  
  // Option Description - Inter regular, 15px, grey
  optionDescription: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '400',
    color: colors.gray, // #7B857B
  },
  
  // Tick Container - Right-aligned and vertically centered
  tickContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Selected Tick - Circle, green border, solid green fill with white tick
  selectedTick: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.success, // #3D7645
    borderWidth: 2,
    borderColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Empty Tick - Empty circle, green border
  emptyTick: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.success,
  },
  
  // Continue Button - Bottom, full width minus 18px margins, 51px height
  continueButton: {
    width: width - 36, // Full width minus 18px margins
    height: 51,
    backgroundColor: colors.paleGold, // #EFE7C8
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30, // Space from last option card
    alignSelf: 'center',
    shadowColor: colors.deepForestGreen,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  
  // Continue Button Text - Inter bold, 18px, dark green
  continueButtonText: {
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.darkGreen,
  },
});
