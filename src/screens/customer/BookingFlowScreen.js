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
  Alert,
  Image
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
  const { service, prefilledService } = route.params || {};
  
  // Default service data
  const defaultService = {
    name: 'Classic Manicure',
    price: '200 kr',
    salon: 'Gustav Salon',
    duration: '45 min',
  };

  // Use prefilled service if available (from "Book Again" functionality), otherwise use service, otherwise use default
  const bookingService = prefilledService || service || defaultService;

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
      console.log('🚀 Starting booking creation process...');
      
      // Create booking in Firebase
      const currentUser = authService.getCurrentUser();
      console.log('👤 Current user:', currentUser ? currentUser.uid : 'No user');
      
      if (!currentUser) {
        console.error('❌ No authenticated user found');
        Alert.alert('Error', 'Please log in to continue booking.');
        setIsLoading(false);
        return;
      }

      const bookingData = {
        userId: currentUser.uid,
        serviceId: bookingService.id || 'service-1',
        serviceName: bookingService.name || 'Service Name',
        salonId: bookingService.salonId || 'salon-1',
        salonName: bookingService.salon || bookingService.salonName || 'Salon Name',
        date: selectedDate,
        time: selectedTime,
        duration: bookingService.duration || '45 min',
        price: bookingService.price || '200 kr',
        status: 'pending',
        customerName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Customer',
      };

      console.log('📝 Booking data to create:', bookingData);
      console.log('🔥 Calling firestoreService.bookings.create...');

      const result = await firestoreService.bookings.create(bookingData);
      
      console.log('📊 Booking creation result:', result);
      
      if (result.success) {
        console.log('✅ Booking created successfully:', result.id);
        
        // Navigate to payment with booking data
        navigation.navigate('PaymentMethod', { 
          service: bookingService,
          booking: { ...bookingData, id: result.id },
          selectedDateTime: `${selectedDate} kl. ${selectedTime}` 
        });
      } else {
        console.error('❌ Booking creation failed:', result.error);
        throw new Error(result.error || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('❌ Error creating booking:', error);
      console.error('❌ Error stack:', error.stack);
      Alert.alert('Error', `Failed to create booking: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor="#213527" />
      
      {/* Header - Deep green (#213527) - 115px height */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: headerAnimatedValues.opacity,
            transform: [{ translateY: headerAnimatedValues.translateY }],
          }
        ]}
      >
        {/* Logo Leaf & SANOVA - Centered horizontally and vertically */}
        <View style={styles.logoContainer}>
          {/* Logo - 36px width, 22px height, 13px from top */}
          <Image 
            source={require('../../../assets/logo.png')}
            style={styles.logoIcon}
            resizeMode="contain"
          />
          {/* SANOVA text - 25px, uppercase serif, white, letter-spacing 2px, 6px margin below logo */}
          <Text style={styles.headerTitle}>SANOVA</Text>
        </View>
      </Animated.View>
      
      {/* Main Card Background - Very light cream (#FAF6EC) */}
      <Animated.View 
        style={[
          styles.mainCard,
          {
            opacity: serviceCardAnimatedValues.opacity,
            transform: [
              { translateY: serviceCardAnimatedValues.translateY },
              { scale: serviceCardAnimatedValues.scale }
            ],
          }
        ]}
      >
        {/* Content Section */}
        <View style={styles.contentSection}>
          {/* Section Title - "Book", 27px, weight 700, #223527, 34px from top of main card */}
          <Text style={styles.sectionTitle}>Book</Text>
          {/* Service name - "Classic Manicure", 19px, weight 600, #223527, 16px below */}
          <Text style={styles.serviceName}>{bookingService.name || 'Classic Manicure'}</Text>
          
          {/* Date Section Title - "Date and Time", 18px, #626463, 22px below */}
          <Text style={styles.dateTimeTitle}>Date and Time</Text>
          
          {/* Date Chip - 308px width, 54px height, 15px radius, white background */}
          <Animated.View
            style={[
              styles.dateChipContainer,
              {
                opacity: dateSelectionAnimatedValues.opacity,
                transform: [{ translateY: dateSelectionAnimatedValues.translateY }],
              }
            ]}
          >
            <TouchableOpacity style={styles.dateChip} activeOpacity={0.8}>
              {/* Chip text - "April 25, 11:00 AM", 17px, #235327, weight 400 */}
              <Text style={styles.dateChipText}>April 25, 11:00 AM</Text>
              {/* Arrow icon - right-aligned, 16px from edge */}
              <Ionicons name="chevron-forward" size={20} color="#235327" />
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Continue Button - Bottom, 36px margin-bottom from bottom safe area */}
        <Animated.View 
          style={[
            styles.continueButtonContainer,
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
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.9}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF6EC', // Exact cream background
  },
  
  // Header - Deep green (#213527) - 115px height
  header: {
    backgroundColor: '#213527', // Exact deep green color
    height: 115, // 115px height including status bar
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
    marginBottom: 6, // 6px margin below logo
  },
  headerTitle: {
    fontSize: 25, // 25px
    fontFamily: 'System', // Uppercase serif
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 2, // 2px letter spacing
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  
  // Main Card Background - Very light cream (#FAF6EC)
  mainCard: {
    backgroundColor: '#FAF6EC', // Very light cream
    borderTopLeftRadius: 28, // Top corners only
    borderTopRightRadius: 28,
    width: '100%',
    minHeight: 650, // Ensure enough height
    paddingHorizontal: 34, // 34px from left card edge
    paddingTop: 34, // 34px from top of main card
  },
  
  // Content Section
  contentSection: {
    flex: 1,
  },
  
  // Section Title - "Book", 27px, weight 700, #223527, 34px from top of main card
  sectionTitle: {
    fontSize: 27, // 27px
    fontWeight: '700', // Weight 700
    color: '#223527', // #223527
    marginBottom: 16, // 16px below
  },
  
  // Service name - "Classic Manicure", 19px, weight 600, #223527, 16px below
  serviceName: {
    fontSize: 19, // 19px
    fontWeight: '600', // Weight 600
    color: '#223527', // #223527
    marginBottom: 22, // 22px below
  },
  
  // Date Section Title - "Date and Time", 18px, #626463, 22px below
  dateTimeTitle: {
    fontSize: 18, // 18px
    color: '#626463', // #626463
    marginBottom: 16, // 16px below section title
  },
  
  // Date Chip Container
  dateChipContainer: {
    alignSelf: 'flex-start',
    marginBottom: 200, // Space before continue button
  },
  
  // Date Chip - 308px width, 54px height, 15px radius, white background
  dateChip: {
    width: 308, // 308px width
    height: 54, // 54px height
    backgroundColor: '#FFFFFF', // White background
    borderRadius: 15, // 15px border radius
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18, // 18px from left edge
    elevation: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  
  // Chip text - "April 25, 11:00 AM", 17px, #235327, weight 400
  dateChipText: {
    fontSize: 17, // 17px
    color: '#235327', // #235327
    fontWeight: '400', // Weight 400
  },
  
  // Continue Button - Bottom, 36px margin-bottom from bottom safe area
  continueButtonContainer: {
    alignItems: 'center',
    paddingBottom: 36, // 36px margin-bottom from bottom safe area
  },
  
  // Continue Button - 344px width, 51px height, pill-shaped radius 25px, #163A24 background
  continueButton: {
    width: 344, // 344px width
    height: 51, // 51px height
    backgroundColor: '#163A24', // #163A24 background
    borderRadius: 25, // Pill-shaped radius 25px
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Continue button text - "Continue", #FFF, 20px, weight 600
  continueButtonText: {
    fontSize: 20, // 20px
    color: '#FFFFFF', // #FFF
    fontWeight: '600', // Weight 600
  },
});