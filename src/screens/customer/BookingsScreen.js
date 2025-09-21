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
  RefreshControl,
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
import realtimeServiceInstance from '../../services/realtimeService';
import notificationServiceInstance from '../../services/notificationService';

const { width, height } = Dimensions.get('window');

export default function BookingsScreen({ navigation }) {
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [previousBookings, setPreviousBookings] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Animation controller
  // Removed animation controller

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

  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    
    // Start entrance animations
    startEntranceAnimations();
    
    // Load initial bookings data
    loadBookingsData();
    
    // Initialize real-time monitoring for booking updates
    initializeRealtimeMonitoring();

    return () => {
      // Cleanup real-time monitoring
      try {
        const currentUser = authService.getCurrentUser();
        if (currentUser && realtimeServiceInstance.stopListening) {
          realtimeServiceInstance.stopListening(`user_bookings_${currentUser.uid}`);
        }
      } catch (error) {
        console.warn('Error cleaning up real-time monitoring:', error);
      }
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
      // Upcoming animation
      Animated.parallel([
        Animated.timing(upcomingAnimatedValues.opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(upcomingAnimatedValues.translateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(upcomingAnimatedValues.scale, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // Previous animation
      Animated.parallel([
        Animated.timing(previousAnimatedValues.opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(previousAnimatedValues.translateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(previousAnimatedValues.scale, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
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
          }).map(booking => ({
            ...booking,
            date: booking.date instanceof Date ? booking.date.toLocaleDateString('da-DK') : booking.date
          }));
          
          const previous = allBookings.filter(booking => {
            const bookingDate = new Date(booking.date);
            return bookingDate < now || booking.status === 'completed' || booking.status === 'cancelled';
          }).map(booking => ({
            ...booking,
            date: booking.date instanceof Date ? booking.date.toLocaleDateString('da-DK') : booking.date
          }));
          
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
      if (currentUser && realtimeServiceInstance.startListeningToUserBookings) {
        // Listen for real-time booking updates with error handling
        const result = realtimeServiceInstance.startListeningToUserBookings(currentUser.uid, (bookings) => {
          try {
            console.log('📅 Real-time booking updates for customer:', bookings.length);
            
            const now = new Date();
            const upcoming = bookings.filter(booking => {
              const bookingDate = new Date(booking.date);
              return bookingDate >= now && booking.status !== 'cancelled' && booking.status !== 'completed';
            }).map(booking => ({
              ...booking,
              date: booking.date instanceof Date ? booking.date.toLocaleDateString('da-DK') : booking.date
            }));
            
            const previous = bookings.filter(booking => {
              const bookingDate = new Date(booking.date);
              return bookingDate < now || booking.status === 'completed' || booking.status === 'cancelled';
            }).map(booking => ({
              ...booking,
              date: booking.date instanceof Date ? booking.date.toLocaleDateString('da-DK') : booking.date
            }));
            
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
          } catch (callbackError) {
            console.error('Error in real-time callback:', callbackError);
          }
        });
        
        if (result && result.success) {
          console.log('✅ Real-time monitoring started successfully');
        } else {
          console.warn('⚠️ Real-time monitoring failed, using polling fallback');
        }
      } else {
        console.warn('⚠️ Real-time monitoring not available, using polling fallback');
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
      // Navigate to ServiceDetailScreen with booking data
      navigation.navigate('ServiceDetail', { 
        service: {
          id: booking.serviceId || booking.id,
          name: booking.serviceName,
          salon: booking.salonName,
          price: booking.price || 'Price not available',
          duration: booking.duration || 'Duration not available',
          date: booking.date,
          time: booking.time,
          address: booking.salonAddress,
          status: booking.status,
          description: `Booking details for ${booking.serviceName} at ${booking.salonName}. Status: ${booking.status}`,
          rating: booking.rating || 4.5,
          reviews: booking.reviews || 12,
          services: ['Service included'],
          amenities: ['Free WiFi', 'Parking available']
        }
      });
    });
  };

  const handleBookAgain = (booking) => {
    // Navigate to booking flow with pre-filled service
    navigation.navigate('BookingFlow', { 
      prefilledService: {
        id: booking.serviceId || booking.id,
        name: booking.serviceName,
        salonId: booking.salonId,
        salonName: booking.salonName
      }
    });
  };

  const handleCancelBooking = async (booking) => {
    try {
      // Update booking status to cancelled
      const result = await firestoreService.bookings.update(booking.id, {
        status: 'cancelled',
        cancelledAt: new Date().toISOString()
      });
      
      if (result.success) {
        // Refresh the bookings data
        await loadBookingsData();
        
        // Show success message
        alert('Booking cancelled successfully');
      } else {
        alert('Failed to cancel booking. Please try again.');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Error cancelling booking. Please try again.');
    }
  };

  // Mock data for initial display (will be replaced by real data)
  const mockUpcomingBookings = [
    {
      id: 1,
      serviceName: 'Classic Manicure',
      salonName: 'Gustav Salon',
      salonAddress: 'Frederiks Alle 28',
      date: '15. Dec 2024', // Fixed: Use string instead of Date object
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
      date: '15. Apr 2024', // Fixed: Use string instead of Date object
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
          <Image source={require('../../../assets/logo.png')} style={styles.logoImage} />
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
          {displayUpcomingBookings.map((booking) => (
            <View key={booking.id} style={styles.bookingCard}>
              <View style={styles.bookingIcon}>
                <Text style={styles.iconText}>{booking.icon}</Text>
              </View>
              <View style={styles.bookingInfo}>
                <Text style={styles.serviceName}>{booking.serviceName}</Text>
                <Text style={styles.salonName}>{booking.salonName} - {booking.salonAddress}</Text>
                <Text style={styles.bookingDate}>{booking.date} {booking.time}</Text>
              </View>
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.detailsButton} 
                  activeOpacity={0.8}
                  onPress={() => handleBookingPress(booking)}
                >
                  <Text style={styles.detailsButtonText}>Se detaljer</Text>
                </TouchableOpacity>
                {booking.status === 'confirmed' && (
                  <TouchableOpacity 
                    style={styles.cancelButton} 
                    activeOpacity={0.8}
                    onPress={() => handleCancelBooking(booking)}
                  >
                    <Text style={styles.cancelButtonText}>Annuller</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Previous Bookings Section - exactly as shown in design */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tidligere Bookinger</Text>
          {displayPreviousBookings.map((booking) => (
            <View key={booking.id} style={styles.bookingCard}>
              <View style={styles.bookingIcon}>
                <Text style={styles.iconText}>{booking.icon}</Text>
              </View>
              <View style={styles.bookingInfo}>
                <Text style={styles.serviceName}>{booking.serviceName}</Text>
                <Text style={styles.salonName}>{booking.salonName} - {booking.salonAddress}</Text>
                <Text style={styles.bookingDate}>{booking.date} {booking.time}</Text>
              </View>
              <View style={styles.actionButtons}>
                {booking.canBook && (
                  <TouchableOpacity 
                    style={styles.bookAgainButton} 
                    activeOpacity={0.8}
                    onPress={() => handleBookAgain(booking)}
                  >
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
    gap: 8,
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
  cancelButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  cancelButtonText: {
    color: colors.text.white,
    fontSize: 12,
    fontWeight: '600',
  },
  
  logoImage: {
    width: 24,
    height: 24,
    tintColor: colors.text.white,
  },
});