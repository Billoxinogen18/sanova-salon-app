import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { SanovaHeader, SanovaButton, SanovaCard } from '../../components';

const { width } = Dimensions.get('window');

export default function DateTimeSelectionScreen({ navigation, route }) {
  const { service } = route.params || {};
  
  const [selectedDate, setSelectedDate] = useState('25. april');
  const [selectedTime, setSelectedTime] = useState('11:00');
  
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

  const handleDateSelect = (date) => {
    // Touch feedback animation
    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    
    setSelectedDate(date);
  };

  const handleContinue = () => {
    // Button press animation
    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();

    // Navigate to payment method screen
    navigation.navigate('PaymentMethod', {
      service: service,
      selectedDate,
      selectedTime,
    });
  };

  return (
    <View style={styles.container}>
      {/* App Bar - Deep forest green, 76px height, rounded top corners */}
      <SanovaHeader height={76} />

      {/* Content Container - White card, 24px top radius, flush with screen sides */}
      <Animated.View 
        style={[
          styles.contentContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Section Header - "Book", Inter serif, 32px, bold, black */}
        <Text style={styles.sectionHeader}>Book</Text>

        {/* Service Description - "Classic Manicure", bold, Inter, 19px */}
        <Text style={styles.serviceDescription}>
          {service?.name || 'Classic Manicure'}
        </Text>

        {/* Subheader - "Date and Time", Inter, 16px, regular, muted green */}
        <Text style={styles.subheader}>Date and Time</Text>

        {/* Date Selector Card - Full-width, 44px height, specific styling */}
        <SanovaCard
          variant="light"
          size="small"
          onPress={() => {/* Open date picker */}}
          style={styles.dateSelectorCard}
        >
          <Text style={styles.dateTimeText}>
            {selectedDate} kl. {selectedTime}
          </Text>
          <Ionicons name="chevron-forward" size={16} color={colors.black} />
        </SanovaCard>

        {/* Continue Button - Bottom of card, 94% width, 51px height, 16px radius */}
        <SanovaButton
          title="Continue"
          onPress={handleContinue}
          variant="primary"
          size="large"
          style={styles.continueButton}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.warmCream, // Full screen warm cream
  },
  
  // Content Container - White card, 24px top radius, flush with screen sides
  contentContainer: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 10, // 10px below app bar
    paddingHorizontal: 24,
    paddingTop: 30, // 30px margin-top
  },
  
  // Section Header - "Book", Inter serif, 32px, bold, black, flush left
  sectionHeader: {
    fontFamily: 'Inter',
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.darkGreen,
    marginTop: 30,
  },
  
  // Service Description - Bold, Inter, 19px, margin-top 18px
  serviceDescription: {
    fontFamily: 'Inter',
    fontSize: 19,
    fontWeight: 'bold',
    color: colors.darkGreen,
    marginTop: 18,
  },
  
  // Subheader - Inter, 16px, regular, muted green, margin-top 28px
  subheader: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '400',
    color: colors.mutedGreen,
    marginTop: 28,
  },
  
  // Date Selector Card - Full-width, 44px height, specific styling
  dateSelectorCard: {
    width: '100%',
    height: 44,
    backgroundColor: colors.searchBarBg, // #FBF9F1
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginTop: 12,
    shadowColor: colors.deepForestGreen,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  
  // Date Time Text - Inter, 17px, dark green
  dateTimeText: {
    fontFamily: 'Inter',
    fontSize: 17,
    color: colors.darkGreen,
  },
  
  // Continue Button - Bottom of card, 94% width, 51px height, 16px radius
  continueButton: {
    width: '94%',
    marginTop: 22, // 22px top margin to button
    alignSelf: 'center',
  },
});
