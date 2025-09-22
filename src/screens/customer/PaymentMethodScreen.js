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
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import stripeService from '../../services/stripeService';

const { width } = Dimensions.get('window');

export default function PaymentMethodScreen({ navigation, route }) {
  const { service, selectedDate, selectedTime } = route.params || {};
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    
    // Load payment methods
    loadPaymentMethods();
    
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

  const loadPaymentMethods = async () => {
    try {
      const methods = await stripeService.getPaymentMethods();
      setPaymentMethods(methods);
    } catch (error) {
      console.error('Error loading payment methods:', error);
    }
  };

  const handlePaymentMethodSelect = (method) => {
    // Touch feedback animation
    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    
    setSelectedPaymentMethod(method);
  };

  const handlePayNow = async () => {
    if (isProcessingPayment) return;
    
    setIsProcessingPayment(true);
    
    try {
      // Button press animation
      Animated.sequence([
        Animated.timing(buttonScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
        Animated.timing(buttonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
      ]).start();

      // Parse amount from service price
      console.log('🔍 Service object:', service);
      console.log('🔍 Service price:', service?.price);
      
      const amount = stripeService.parseAmount(service?.price || '200 kr');
      console.log('🔍 Parsed amount:', amount);
      
      if (amount === 0) {
        console.error('❌ Invalid service price:', service?.price);
        Alert.alert('Error', `Invalid service price: ${service?.price || 'No price provided'}`);
        return;
      }

      // Generate a booking ID for this payment
      const bookingId = `booking_${Date.now()}`;

      // Process payment with Stripe
      const paymentResult = await stripeService.processPayment(
        amount,
        'dkk',
        bookingId,
        {
          service: service?.name || 'Service',
          date: selectedDate,
          time: selectedTime,
        }
      );

      if (paymentResult.success) {
        // Navigate to payment success screen
        navigation.navigate('PaymentSuccess', {
          paymentIntentId: paymentResult.paymentIntentId,
          amount: amount,
          currency: 'dkk',
          service: service,
          selectedDate,
          selectedTime,
          bookingId,
        });
      } else {
        // Handle payment failure
        await stripeService.handlePaymentFailure(new Error(paymentResult.error));
      }
    } catch (error) {
      console.error('Payment error:', error);
      await stripeService.handlePaymentFailure(error);
    } finally {
      setIsProcessingPayment(false);
    }
  };


  // Payment options with exact icons as specified
  const paymentOptions = [
    {
      id: 'card',
      name: 'Credit or Debit Card',
      iconComponent: (
        <Ionicons 
          name="card" 
          size={32} 
          color="#223527" 
          style={styles.paymentIcon}
        />
      )
    },
    {
      id: 'apple',
      name: 'Apple Pay',
      iconComponent: (
        <Ionicons 
          name="logo-apple" 
          size={32} 
          color="#223527" 
          style={styles.paymentIcon}
        />
      )
    },
    {
      id: 'mobilepay',
      name: 'MobilePay',
      iconComponent: (
        <Ionicons 
          name="phone-portrait" 
          size={32} 
          color="#223527" 
          style={styles.paymentIcon}
        />
      )
    }
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#213527" />
      
      {/* Header - Deep green (#213527) - Same as previous screen */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        {/* Logo Leaf & SANOVA - Centered horizontally and vertically */}
        <View style={styles.logoContainer}>
          {/* Logo - Same dimensions as previous screen */}
          <Image 
            source={require('../../../assets/logo.png')}
            style={styles.logoIcon}
            resizeMode="contain"
          />
          {/* SANOVA text - Same styling as previous screen */}
          <Text style={styles.headerTitle}>SANOVA</Text>
        </View>
      </Animated.View>

      {/* Main Card - Very light cream (#FAF6EC) */}
      <Animated.View 
        style={[
          styles.mainCard,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        {/* Content Section */}
        <View style={styles.contentSection}>
          {/* Title - "Payment Method", 25px, weight 700, #223527, left-aligned 34px, margin-top 38px */}
          <Text style={styles.sectionTitle}>Payment Method</Text>
          
          {/* Payment Options - Each row 66px high, 26px radius, white background */}
          {paymentOptions.map((option, index) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.paymentOption,
                index === 0 && styles.firstPaymentOption, // 32px margin-top after payment method title
                selectedPaymentMethod === option.id && styles.selectedPaymentOption,
              ]}
              onPress={() => handlePaymentMethodSelect(option.id)}
              activeOpacity={0.8}
            >
              {/* Option text - Left side, 18px, #223527 */}
              <Text style={styles.optionText}>{option.name}</Text>
              {/* Payment logo - Right side */}
              {option.iconComponent}
            </TouchableOpacity>
          ))}
        </View>

        {/* Pay Now Button - Centered, 344px width, 51px height, pill-shaped */}
        <Animated.View 
          style={[
            styles.payButtonContainer,
            { transform: [{ scale: buttonScale }] }
          ]}
        >
          <TouchableOpacity 
            style={[
              styles.payButton,
              isProcessingPayment && styles.payButtonDisabled
            ]}
            onPress={handlePayNow}
            activeOpacity={0.9}
            disabled={isProcessingPayment}
          >
            {isProcessingPayment ? (
              <View style={styles.loadingContainer}>
                <Ionicons name="hourglass" size={20} color="#FFFFFF" />
                <Text style={styles.payButtonText}>Processing...</Text>
              </View>
            ) : (
              <Text style={styles.payButtonText}>Pay Now</Text>
            )}
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF6EC', // Exact cream background
  },
  
  // Header - Deep green (#213527) - Same as previous screen
  header: {
    backgroundColor: '#213527', // Exact deep green color
    height: 115, // Same height as previous screen
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    width: 80,
    height: 50,
    marginBottom: 6, // Same spacing as previous screen
  },
  headerTitle: {
    fontSize: 25, // Same as previous screen
    fontFamily: 'System',
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  
  // Main Card - Very light cream (#FAF6EC)
  mainCard: {
    backgroundColor: '#FAF6EC', // Very light cream
    borderTopLeftRadius: 28, // Top corners only, same as previous
    borderTopRightRadius: 28,
    width: '100%',
    flex: 1,
    paddingHorizontal: 34, // 34px from left/right
    paddingTop: 38, // 38px margin-top
  },
  
  // Content Section
  contentSection: {
    flex: 1,
  },
  
  // Title - "Payment Method", 25px, weight 700, #223527, left-aligned 34px, margin-top 38px
  sectionTitle: {
    fontSize: 25, // 25px
    fontWeight: '700', // Weight 700
    color: '#223527', // #223527
    marginBottom: 32, // 32px margin-top after payment method title
  },
  
  // Payment Options - Each row 66px high, 26px radius, white background, soft shadow
  paymentOption: {
    height: 66, // 66px high
    backgroundColor: '#FFFFFF', // White background
    borderRadius: 26, // 26px radius
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24, // Internal padding
    marginBottom: 20, // 20px between options
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 13,
  },
  
  // First payment option - 32px margin-top after payment method title
  firstPaymentOption: {
    // Already handled by sectionTitle marginBottom
  },
  
  // Selected payment option state
  selectedPaymentOption: {
    backgroundColor: '#F0F8F0', // Slightly different background when selected
    borderWidth: 2,
    borderColor: '#223527',
  },
  
  // Option text - Left side, 18px, #223527
  optionText: {
    fontSize: 18, // 18px
    color: '#223527', // #223527
    fontWeight: '500',
  },
  
  // Payment icon - Right side
  paymentIcon: {
    width: 32, // Standard icon size
    height: 32,
  },
  
  // Pay Now Button Container - Centered, 40px margin-bottom from safe area
  payButtonContainer: {
    alignItems: 'center',
    paddingBottom: 40, // 40px margin-bottom from safe area
    marginTop: 'auto', // Push to bottom
  },
  
  // Pay Now Button - 344px width, 51px height, pill-shaped radius 25px, #163A24 background
  payButton: {
    width: 344, // 344px width
    height: 51, // 51px height
    backgroundColor: '#163A24', // #163A24 background
    borderRadius: 25, // Pill-shaped radius 25px
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Pay button disabled state
  payButtonDisabled: {
    opacity: 0.6,
  },
  
  // Loading container
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Pay button text - "Pay Now", #FFF, 20px, weight 600
  payButtonText: {
    fontSize: 20, // 20px
    color: '#FFFFFF', // #FFF
    fontWeight: '600', // Weight 600
    marginLeft: 8, // Space after loading icon if present
  },
});