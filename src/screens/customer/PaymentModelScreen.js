import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Image } from 'react-native';
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
      {/* Header - Deep green (#213527) - Same as previous screens */}
      <Animated.View 
        style={[
          styles.header,
          { opacity: fadeAnim }
        ]}
      >
        {/* Logo Leaf & SANOVA - Centered horizontally and vertically */}
        <View style={styles.logoContainer}>
          {/* Logo - Same dimensions as previous screens */}
          <Image 
            source={require('../../../assets/logo.png')}
            style={styles.logoIcon}
            resizeMode="contain"
          />
          {/* SANOVA text - Same styling as previous screens */}
          <Text style={styles.headerTitle}>SANOVA</Text>
        </View>
      </Animated.View>

      {/* Main Card - Very light cream (#FAF6EC) */}
      <Animated.View 
        style={[
          styles.mainCard,
          { opacity: fadeAnim }
        ]}
      >
        {/* Content Section */}
        <View style={styles.contentSection}>
          {/* Title - "Payment", 25px, weight 700, #223527, 38px margin-top */}
          <Text style={styles.sectionTitle}>Payment</Text>
          
          {/* Payment Option Cards - Each 97px high, 26px radius, white background */}
          
          {/* Option 1 - "Pay half now, half after" */}
          <TouchableOpacity
            style={[
              styles.paymentOptionCard,
              styles.firstPaymentOption, // 32px margin-top after title
              selectedModel === 'split' && styles.selectedOptionCard
            ]}
            onPress={() => handlePaymentOptionPress('split')}
            activeOpacity={0.8}
          >
            <View style={styles.optionContent}>
              {/* Title - "Pay half now, half after", 19px, weight 700, #223527 */}
              <Text style={styles.optionTitle}>Pay half now, half after</Text>
              {/* Description - "You agree to pay 175 kr now and forfeit this amount if you don't show up.", 16px, #4E504F, weight 400 */}
              <Text style={styles.optionDescription}>
                You agree to pay 175 kr now and forfeit this amount if you don't show up.
              </Text>
            </View>
            {/* Checkmark circle - right-aligned, 23px diameter, filled #163A24 when active */}
            <View style={[
              styles.checkmarkCircle, 
              selectedModel === 'split' && styles.checkmarkCircleActive
            ]}>
              {selectedModel === 'split' && (
                <Ionicons name="checkmark" size={14} color="#FFFFFF" />
              )}
            </View>
          </TouchableOpacity>

          {/* Option 2 - "Pay full amount" - 22px vertical space between options */}
          <TouchableOpacity
            style={[
              styles.paymentOptionCard,
              selectedModel === 'full' && styles.selectedOptionCard
            ]}
            onPress={() => handlePaymentOptionPress('full')}
            activeOpacity={0.8}
          >
            <View style={styles.optionContent}>
              {/* Title - "Pay full amount", 19px, weight 700, #223527 */}
              <Text style={styles.optionTitle}>Pay full amount</Text>
              {/* Description - "Cancel by [date/time] and get a full refund.", 16px, #4E504F, weight 400 */}
              <Text style={styles.optionDescription}>
                Cancel by [date/time] and get a full refund.
              </Text>
            </View>
            {/* Checkmark circle - white with border #163A24 when inactive */}
            <View style={[
              styles.checkmarkCircle, 
              selectedModel === 'full' && styles.checkmarkCircleActive
            ]}>
              {selectedModel === 'full' && (
                <Ionicons name="checkmark" size={14} color="#FFFFFF" />
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Continue Button - Centered, 344px width, 51px height, #F1EBD1 background */}
        <Animated.View 
          style={[
            styles.continueButtonContainer,
            { transform: [{ scale: buttonScale }] }
          ]}
        >
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={handlePayment}
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
    backgroundColor: '#FAF6EC', // Exact cream background
  },
  
  // Header - Deep green (#213527) - Same as previous screens
  header: {
    backgroundColor: '#213527', // Exact deep green color
    height: 115, // Same height as previous screens
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    width: 36,
    height: 22,
    marginBottom: 6, // Same spacing as previous screens
  },
  headerTitle: {
    fontSize: 25, // Same as previous screens
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
  
  // Title - "Payment", 25px, weight 700, #223527, 38px margin-top
  sectionTitle: {
    fontSize: 25, // 25px
    fontWeight: '700', // Weight 700
    color: '#223527', // #223527
    marginBottom: 32, // 32px margin-top after payment title
  },
  
  // Payment Option Cards - Each 97px high, 26px radius, white background
  paymentOptionCard: {
    height: 97, // 97px high
    backgroundColor: '#FFFFFF', // White background
    borderRadius: 26, // 26px radius
    flexDirection: 'row',
    alignItems: 'flex-start', // Align to top for multiline text
    justifyContent: 'space-between',
    paddingHorizontal: 22, // Internal horizontal padding
    paddingVertical: 18, // Internal vertical padding
    marginBottom: 22, // 22px vertical space between options
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 13,
  },
  
  // First payment option - 32px margin-top after title
  firstPaymentOption: {
    // Already handled by sectionTitle marginBottom
  },
  
  // Selected option card state
  selectedOptionCard: {
    backgroundColor: '#F5F5F5', // Slightly different background when selected
    borderWidth: 2,
    borderColor: '#163A24',
  },
  
  // Option content - Left side content
  optionContent: {
    flex: 1,
    paddingRight: 16, // Space before checkmark
  },
  
  // Option title - "Pay half now, half after", 19px, weight 700, #223527
  optionTitle: {
    fontSize: 19, // 19px
    fontWeight: '700', // Weight 700
    color: '#223527', // #223527
    marginBottom: 6, // 6px below title
  },
  
  // Option description - 16px, #4E504F, weight 400
  optionDescription: {
    fontSize: 16, // 16px
    color: '#4E504F', // #4E504F
    fontWeight: '400', // Weight 400
    lineHeight: 22, // Better line height for multiline text
  },
  
  // Checkmark circle - right-aligned, 23px diameter
  checkmarkCircle: {
    width: 23, // 23px diameter
    height: 23,
    borderRadius: 11.5, // Half of diameter for perfect circle
    backgroundColor: '#FFFFFF', // White background when inactive
    borderWidth: 2,
    borderColor: '#163A24', // Border color #163A24
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2, // Slight adjustment to align with text
  },
  
  // Checkmark circle active state - filled #163A24 when active
  checkmarkCircleActive: {
    backgroundColor: '#163A24', // #163A24 background when active
    borderColor: '#163A24',
  },
  
  // Continue Button Container - Centered, 42px margin-bottom from safe area
  continueButtonContainer: {
    alignItems: 'center',
    paddingBottom: 42, // 42px margin-bottom from safe area
    marginTop: 'auto', // Push to bottom
  },
  
  // Continue Button - 344px width, 51px height, #F1EBD1 background
  continueButton: {
    width: 344, // 344px width
    height: 51, // 51px height
    backgroundColor: '#F1EBD1', // #F1EBD1 background (warm beige)
    borderRadius: 25, // Pill-shaped radius 25px
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Continue button text - "Continue", #223527, 20px, weight 600
  continueButtonText: {
    fontSize: 20, // 20px
    color: '#223527', // #223527
    fontWeight: '600', // Weight 600
  },
});
