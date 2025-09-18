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
  RefreshControl 
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
import { 
  animationSequences, 
  AnimationController, 
  microAnimations 
} from '../../theme/animations';
import { firestoreService, authService } from '../../services/firebaseService';
import realtimeServiceInstance from '../../services/realtimeService';
import notificationServiceInstance from '../../services/notificationService';

const { width, height } = Dimensions.get('window');

export default function BookingsScreen({ navigation }) {
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [previousBookings, setPreviousBookings] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Animation controller
  const animationController = useRef(new AnimationController()).current;

  // Animated values
  const headerAnimatedValues = useRef({
    opacity: new Animated.Value(0),
    translateY: new Animated.Value(-30),
  }).current;

  const upcomingAnimatedValues = useRef({
    opacity: new Animated.Value(0),
    translateY: new Animated.Value(30),
    scale: new Animated.Value(0.95),
  }).current;

  const previousAnimatedValues = useRef({
    opacity: new Animated.Value(0),
    translateY: new Animated.Value(30),
    scale: new Animated.Value(0.95),
  }).current;

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    
    // Start entrance animations
    startEntranceAnimations();
    
    // Load initial bookings data
    loadBookingsData();
    
    // Initialize real-time monitoring for booking updates
    initializeRealtimeMonitoring();

    return () => {
      animationController.stopAllAnimations();
    };
  }, []);

  const startEntranceAnimations = () => {
    const headerAnimation = animationSequences.fadeInUp(headerAnimatedValues, 0);
    const upcomingAnimation = animationSequences.fadeInUp(upcomingAnimatedValues, 200);
    const previousAnimation = animationSequences.fadeInUp(previousAnimatedValues, 400);

    animationController.registerAnimation('entrance', 
      Animated.parallel([
        headerAnimation,
        upcomingAnimation,
        previousAnimation,
      ])
    );

    animationController.animations.get('entrance').start();
  };

  const loadBookingsData = async () => {
    try {
      setIsLoading(true);
      const currentUser = authService.getCurrentUser();
      
      if (currentUser) {
        const bookingsResult = await firestoreService.bookings.getByUser(currentUser.uid);
        
        if (bookingsResult.success) {
          const allBookings = bookingsResult.data;
          const now = new Date();
          
          // Separate upcoming and previous bookings
          const upcoming = allBookings.filter(booking => {
            const bookingDate = new Date(booking.date);
            return bookingDate >= now && booking.status !== 'cancelled' && booking.status !== 'completed';
          });
          
          const previous = allBookings.filter(booking => {
            const bookingDate = new Date(booking.date);
            return bookingDate < now || booking.status === 'completed' || booking.status === 'cancelled';
          });
          
          setUpcomingBookings(upcoming);
          setPreviousBookings(previous);
        }
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeRealtimeMonitoring = async () => {
    try {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        // Listen for real-time booking updates
        const result = await realtimeServiceInstance.startListeningToUserBookings?.(currentUser.uid, (bookings) => {
          console.log('📅 Real-time booking updates for customer:', bookings.length);
          
          const now = new Date();
          const upcoming = bookings.filter(booking => {
            const bookingDate = new Date(booking.date);
            return bookingDate >= now && booking.status !== 'cancelled' && booking.status !== 'completed';
          });
          
          const previous = bookings.filter(booking => {
            const bookingDate = new Date(booking.date);
            return bookingDate < now || booking.status === 'completed' || booking.status === 'cancelled';
          });
          
          setUpcomingBookings(upcoming);
          setPreviousBookings(previous);
          
          // Show notification for booking status updates
          if (bookings.length > 0) {
            const latestBooking = bookings[0];
            if (latestBooking.status === 'confirmed') {
              notificationServiceInstance.sendLocalNotification(
                'Booking Confirmed!',
                `Your ${latestBooking.serviceName} appointment is confirmed.`,
                { type: 'booking_confirmed', bookingId: latestBooking.id }
              );
            }
          }
        });
      }
    } catch (error) {
      console.error('Error initializing real-time monitoring:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadBookingsData();
    setIsRefreshing(false);
  };

  const handleBookingPress = (booking) => {
    // Button press animation
    const buttonScale = new Animated.Value(1);
    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start(() => {
      navigation.navigate('BookingDetail', { booking });
    });
  };

  const handleBookAgain = (booking) => {
    // Navigate to booking flow with pre-filled service
    navigation.navigate('BookingFlow', { 
      prefilledService: {
        id: booking.serviceId,
        name: booking.serviceName,
        salonId: booking.salonId,
        salonName: booking.salonName
      }
    });
  };

  // Mock data for initial display (will be replaced by real data)
  const mockUpcomingBookings = [
    {
      id: 1,
      serviceName: 'Classic Manicure',
      salonName: 'Gustav Salon',
      salonAddress: 'Frederiks Alle 28',
      date: new Date(),
      time: '11:00',
      status: 'confirmed',
      icon: '💅',
    },
  ];

  const mockPreviousBookings = [
    {
      id: 2,
      serviceName: 'Haircut',
      salonName: 'Hair Studio',
      salonAddress: 'Borgergade 14',
      date: new Date('2024-04-15'),
      time: '14:00',
      status: 'completed',
      icon: '✂️',
      canBook: true,
    },
  ];

  const displayUpcomingBookings = upcomingBookings.length > 0 ? upcomingBookings : mockUpcomingBookings;
  const displayPreviousBookings = previousBookings.length > 0 ? previousBookings : mockPreviousBookings;

  return (
    <View style={styles.container}>
      {/* Header with dark green background exactly as in design */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="leaf" size={24} color={colors.text.white} />
        </View>
        <Text style={styles.headerTitle}>Mine Bookinger</Text>
      </View>
      
      <Animated.ScrollView 
        style={[styles.content, { opacity: fadeAnim }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Upcoming Bookings Section - exactly as shown in design */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kommende Bookinger</Text>
          {upcomingBookings.map((booking) => (
            <View key={booking.id} style={styles.bookingCard}>
              <View style={styles.bookingIcon}>
                <Text style={styles.iconText}>{booking.icon}</Text>
              </View>
              <View style={styles.bookingInfo}>
                <Text style={styles.serviceName}>{booking.service}</Text>
                <Text style={styles.salonName}>{booking.salon} - {booking.address}</Text>
                <Text style={styles.bookingDate}>{booking.date}</Text>
              </View>
              <TouchableOpacity style={styles.detailsButton} activeOpacity={0.8}>
                <Text style={styles.detailsButtonText}>Se detaljer</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Previous Bookings Section - exactly as shown in design */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tidligere Bookinger</Text>
          {previousBookings.map((booking) => (
            <View key={booking.id} style={styles.bookingCard}>
              <View style={styles.bookingIcon}>
                <Text style={styles.iconText}>{booking.icon}</Text>
              </View>
              <View style={styles.bookingInfo}>
                <Text style={styles.serviceName}>{booking.service}</Text>
                <Text style={styles.salonName}>{booking.salon} - {booking.address}</Text>
                <Text style={styles.bookingDate}>{booking.date}</Text>
              </View>
              <View style={styles.actionButtons}>
                {booking.canBook && (
                  <TouchableOpacity style={styles.bookAgainButton} activeOpacity={0.8}>
                    <Text style={styles.bookAgainText}>Book igen</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>
      </Animated.ScrollView>
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
    paddingHorizontal: 20,
    backgroundColor: colors.background.primary,
    borderTopLeftRadius: 16, // 16dp radius as specified
    borderTopRightRadius: 16, // 16dp radius as specified
    marginTop: -16, // Overlap with header to create seamless curve
    overflow: 'hidden', // Make corner radius visible
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
    marginTop: 20,
  },
  bookingCard: {
    backgroundColor: colors.background.white, // White background for cards
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookingIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconText: {
    fontSize: 20,
  },
  bookingInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  salonName: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  bookingDate: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  detailsButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  detailsButtonText: {
    color: colors.text.white,
    fontSize: 12,
    fontWeight: '600',
  },
  actionButtons: {
    alignItems: 'flex-end',
  },
  bookAgainButton: {
    backgroundColor: colors.background.primary,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bookAgainText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
});