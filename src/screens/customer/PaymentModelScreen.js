import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, globalStyles } from '../../theme/styles';
import Header from '../../components/Header';

export default function PaymentModelScreen({ navigation, route }) {
  const { service, selectedDateTime, paymentMethod } = route.params || {};
  const [selectedModel, setSelectedModel] = useState('split'); // Default to split payment as in design
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

  const handlePaymentOptionPress = (model) => {
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
    
    setSelectedModel(model);
  };

  const handlePayment = () => {
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
      navigation.navigate('PaymentSuccess');
    });
  };

  return (
    <View style={styles.container}>
      {/* Header with dark green background exactly as in design */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Payment</Text>
      </View>
      
      <Animated.ScrollView 
        style={[styles.content, { opacity: fadeAnim }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Payment Model Options - exactly as shown in design */}
        <View style={styles.paymentOptions}>
          {/* Pay half now, half after - Selected in design */}
          <TouchableOpacity
            style={styles.paymentOption}
            onPress={() => handlePaymentOptionPress('split')}
            activeOpacity={0.8}
          >
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Pay half now, half after</Text>
              <Text style={styles.optionDescription}>
                You agree to pay 175 kr now and{'\n'}forfeit this amount if you don't show up.
              </Text>
            </View>
            <Animated.View style={[
              styles.radioButton, 
              selectedModel === 'split' && styles.radioButtonSelected,
              { transform: [{ scale: selectedModel === 'split' ? buttonScale : 1 }] }
            ]}>
              {selectedModel === 'split' && <Ionicons name="checkmark" size={16} color={colors.text.white} />}
            </Animated.View>
          </TouchableOpacity>

          {/* Pay full amount */}
          <TouchableOpacity
            style={styles.paymentOption}
            onPress={() => handlePaymentOptionPress('full')}
            activeOpacity={0.8}
          >
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Pay full amount</Text>
              <Text style={styles.optionDescription}>
                Cancel by [date/time] and{'\n'}get a full refund
              </Text>
            </View>
            <Animated.View style={[
              styles.radioButton, 
              selectedModel === 'full' && styles.radioButtonSelected,
              { transform: [{ scale: selectedModel === 'full' ? buttonScale : 1 }] }
            ]}>
              {selectedModel === 'full' && <View style={styles.radioButtonInner} />}
            </Animated.View>
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>

      <View style={styles.continueButtonContainer}>
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={handlePayment}
            activeOpacity={0.9}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
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
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.white,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  paymentOptions: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  paymentOption: {
    backgroundColor: colors.background.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionContent: {
    flex: 1,
    marginRight: 16,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border.primary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.white,
  },
  radioButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  continueButtonContainer: {
    padding: 20,
    backgroundColor: colors.background.primary,
  },
  continueButton: {
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
  continueButtonText: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
