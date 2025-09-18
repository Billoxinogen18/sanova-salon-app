import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, globalStyles } from '../../theme/styles';
import Header from '../../components/Header';

export default function PaymentMethodScreen({ navigation, route }) {
  const { service } = route.params || {};
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [buttonScale] = useState(new Animated.Value(1));
  const [fadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    // Fade in animation when screen loads
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit or Debit Card',
      logo: 'VISA',
      icon: 'card-outline',
    },
    {
      id: 'applepay',
      name: 'Apple Pay',
      logo: '🍎 Pay',
      icon: 'logo-apple',
    },
    {
      id: 'mobilepay',
      name: 'MobilePay',
      logo: 'MobilePay',
      icon: 'phone-portrait-outline',
    },
  ];

  const handleMethodSelect = (method) => {
    // Animate selection
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    setSelectedMethod(method);
  };

  const handlePayNow = () => {
    // Animate button press
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Navigate after animation completes
      navigation.navigate('PaymentModel', { 
        service, 
        paymentMethod: selectedMethod 
      });
    });
  };

  return (
    <View style={styles.container}>
      {/* Header with dark green background exactly as in design */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="leaf" size={24} color={colors.text.white} />
        </View>
        <Text style={styles.headerTitle}>Payment Method</Text>
      </View>
      
      <Animated.ScrollView 
        style={[styles.content, { opacity: fadeAnim }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Payment Methods - exactly as shown in design */}
        <View style={styles.paymentMethods}>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentMethodCard,
                selectedMethod === method.id && styles.selectedPaymentMethod
              ]}
              onPress={() => handleMethodSelect(method.id)}
              activeOpacity={0.8}
            >
              <View style={styles.paymentMethodInfo}>
                <View style={styles.methodLeft}>
                  <Text style={styles.paymentMethodName}>{method.name}</Text>
                </View>
                <View style={styles.methodRight}>
                  <Text style={styles.paymentLogo}>{method.logo}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.ScrollView>

      <View style={styles.payButtonContainer}>
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity 
            style={styles.payButton}
            onPress={handlePayNow}
            activeOpacity={0.9}
          >
            <Text style={styles.payButtonText}>Pay Now</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 16, // 16dp radius as specified
    borderBottomRightRadius: 16, // 16dp radius as specified
    overflow: 'hidden', // Make corner radius visible
  },
  logoContainer: {
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.white,
    textAlign: 'center',
    fontFamily: 'serif',
    letterSpacing: 2, // +2 letter spacing as specified
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
    backgroundColor: colors.background.primary,
    borderTopLeftRadius: 16, // 16dp radius as specified
    borderTopRightRadius: 16, // 16dp radius as specified
    marginTop: -16, // Overlap with header to create seamless curve
    overflow: 'hidden', // Make corner radius visible
  },
  paymentMethods: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  paymentMethodCard: {
    backgroundColor: colors.background.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  selectedPaymentMethod: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  methodLeft: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
  },
  methodRight: {
    alignItems: 'flex-end',
  },
  paymentLogo: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  payButtonContainer: {
    padding: 20,
    backgroundColor: colors.background.primary,
  },
  payButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  payButtonText: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: '600',
  },
});