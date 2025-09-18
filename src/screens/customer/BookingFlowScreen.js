import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Animated, 
  StatusBar, 
  Dimensions,
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { 
  typography, 
  spacing, 
  shadows, 
  borderRadius, 
  premiumComponents 
} from '../../theme/premiumStyles';
import { firestoreService, authService } from '../../services/firebaseService';

const { width, height } = Dimensions.get('window');

export default function BookingFlowScreen({ navigation, route }) {
  const { service, prefilledService } = route.params || {
    service: {
      name: 'Classic Manicure',
      price: '200 kr',
      salon: 'Gustav Salon',
      duration: '45 min',
    }
  };

  // Use prefilled service if available (from "Book Again" functionality)
  const bookingService = prefilledService || service;

  const [selectedDate, setSelectedDate] = useState('25. april');
  const [selectedTime, setSelectedTime] = useState('11:00');
  const [isLoading, setIsLoading] = useState(false);

  // Animation controller
  // Removed animation controller

  // Animated values
  const headerAnimatedValues = useRef({
    opacity: new Animated.Value(0),
    translateY: new Animated.Value(-30),
  }).current;

  const serviceCardAnimatedValues = useRef({
    opacity: new Animated.Value(0),
    translateY: new Animated.Value(30),
    scale: new Animated.Value(0.95),
  }).current;

  const dateSelectionAnimatedValues = useRef({
    opacity: new Animated.Value(0),
    translateY: new Animated.Value(30),
  }).current;

  const timeSelectionAnimatedValues = useRef({
    opacity: new Animated.Value(0),
    translateY: new Animated.Value(30),
  }).current;

  const buttonAnimatedValues = useRef({
    opacity: new Animated.Value(0),
    translateY: new Animated.Value(30),
    scale: new Animated.Value(1),
  }).current;

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    
    // Start entrance animations
    startEntranceAnimations();

    return () => {
      // Cleanup animations if needed
    };
  }, []);

  const startEntranceAnimations = () => {
    // Start animations directly with proper timing
    Animated.stagger(200, [
      // Header animation
      Animated.parallel([
        Animated.timing(headerAnimatedValues.opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(headerAnimatedValues.translateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // Service animation
      Animated.parallel([
        Animated.timing(serviceCardAnimatedValues.opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(serviceCardAnimatedValues.translateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(serviceCardAnimatedValues.scale, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // Date animation
      Animated.parallel([
        Animated.timing(dateSelectionAnimatedValues.opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(dateSelectionAnimatedValues.translateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // Time animation
      Animated.parallel([
        Animated.timing(timeSelectionAnimatedValues.opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(timeSelectionAnimatedValues.translateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // Button animation
      Animated.parallel([
        Animated.timing(buttonAnimatedValues.opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(buttonAnimatedValues.translateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(buttonAnimatedValues.scale, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  // Available dates exactly as shown in design
  const availableDates = [
    { id: 1, date: '24. april', day: 'I dag' },
    { id: 2, date: '25. april', day: 'I morgen' },
    { id: 3, date: '26. april', day: 'Fredag' },
    { id: 4, date: '27. april', day: 'Lørdag' },
  ];

  // Available times exactly as shown in design
  const availableTimes = [
    { id: 1, time: '09:00' },
    { id: 2, time: '10:00' },
    { id: 3, time: '11:00' },
    { id: 4, time: '12:00' },
    { id: 5, time: '14:00' },
    { id: 6, time: '15:00' },
    { id: 7, time: '16:00' },
    { id: 8, time: '17:00' },
  ];

  const handleDateSelect = (date) => {
    // Animate date selection
    const buttonScale = new Animated.Value(1);
    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    
    setSelectedDate(date);
  };

  const handleTimeSelect = (time) => {
    // Animate time selection
    const buttonScale = new Animated.Value(1);
    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    
    setSelectedTime(time);
  };

  const handleContinue = async () => {
    if (isLoading) return;
    
    setIsLoading(true);

    // Animate button press
    Animated.sequence([
      Animated.timing(buttonAnimatedValues.scale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonAnimatedValues.scale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();

    try {
      // Create booking in Firebase
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        Alert.alert('Error', 'Please log in to continue booking.');
        setIsLoading(false);
        return;
      }

      const bookingData = {
        userId: currentUser.uid,
        serviceId: bookingService.id || 'service-1',
        serviceName: bookingService.name,
        salonId: bookingService.salonId || 'salon-1',
        salonName: bookingService.salon || bookingService.salonName,
        date: selectedDate,
        time: selectedTime,
        duration: bookingService.duration || '45 min',
        price: bookingService.price || '200 kr',
        status: 'pending',
        customerName: currentUser.displayName || currentUser.email?.split('@')[0],
      };

      const result = await firestoreService.bookings.create(bookingData);
      
      if (result.success) {
        console.log('✅ Booking created successfully:', result.id);
        
        // Navigate to payment with booking data
        navigation.navigate('PaymentMethod', { 
          service: bookingService,
          booking: { ...bookingData, id: result.id },
          selectedDateTime: `${selectedDate} kl. ${selectedTime}` 
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('❌ Error creating booking:', error);
      Alert.alert('Error', 'Failed to create booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with dark green background exactly as in design */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book</Text>
        <View style={styles.placeholder} />
      </View>
      
      <Animated.ScrollView 
        style={[styles.content, { opacity: fadeAnim }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Service Info Card - exactly as shown in design */}
        <View style={styles.serviceCard}>
          <Text style={styles.serviceTitle}>Book</Text>
          <View style={styles.serviceInfo}>
            <Text style={styles.serviceName}>{service.name}</Text>
            <Text style={styles.serviceDetails}>
              Dato og tid: {selectedDate} kl. {selectedTime}
            </Text>
            <Text style={styles.serviceDuration}>Varighed: {service.duration || '45 min'}</Text>
            <Text style={styles.servicePrice}>{service.price}</Text>
          </View>
        </View>

        {/* Date Selection - exactly as shown in design */}
        <View style={styles.selectionSection}>
          <Text style={styles.sectionTitle}>Vælg dato</Text>
          <View style={styles.dateGrid}>
            {availableDates.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.dateCard,
                  selectedDate === item.date && styles.selectedCard
                ]}
                onPress={() => handleDateSelect(item.date)}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.dateText,
                  selectedDate === item.date && styles.selectedText
                ]}>
                  {item.date}
                </Text>
                <Text style={[
                  styles.dayText,
                  selectedDate === item.date && styles.selectedText
                ]}>
                  {item.day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Time Selection - exactly as shown in design */}
        <View style={styles.selectionSection}>
          <Text style={styles.sectionTitle}>Vælg tid</Text>
          <View style={styles.timeGrid}>
            {availableTimes.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.timeCard,
                  selectedTime === item.time && styles.selectedCard
                ]}
                onPress={() => handleTimeSelect(item.time)}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.timeText,
                  selectedTime === item.time && styles.selectedText
                ]}>
                  {item.time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Animated.ScrollView>

      {/* Continue Button - exactly as shown in design */}
      <View style={styles.continueButtonContainer}>
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.9}
          >
            <Text style={styles.continueButtonText}>Fortsæt</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 16, // 16dp radius as specified
    borderBottomRightRadius: 16, // 16dp radius as specified
    overflow: 'hidden', // Make corner radius visible
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.white,
    flex: 1,
    textAlign: 'center',
    fontFamily: 'serif',
    letterSpacing: 2, // +2 letter spacing as specified
    textTransform: 'uppercase',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: colors.background.primary,
    borderTopLeftRadius: 16, // 16dp radius as specified
    borderTopRightRadius: 16, // 16dp radius as specified
    marginTop: -16, // Overlap with header to create seamless curve
    overflow: 'hidden', // Make corner radius visible
  },
  serviceCard: {
    backgroundColor: colors.background.card, // Lighter cream shade for cards
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    marginBottom: 24,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  serviceInfo: {
    gap: 8,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  serviceDetails: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  serviceDuration: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  selectionSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  dateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  dateCard: {
    backgroundColor: colors.background.card, // Lighter cream shade for cards
    borderRadius: 12,
    padding: 16,
    width: '47%',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  dayText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  selectedText: {
    color: colors.text.white,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeCard: {
    backgroundColor: colors.background.card, // Lighter cream shade for cards
    borderRadius: 12,
    padding: 16,
    width: '22%',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
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