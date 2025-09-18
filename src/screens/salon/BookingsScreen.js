import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  Animated, 
  StatusBar, 
  Alert,
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
import { firestoreService } from '../../services/firebaseService';
import realtimeServiceInstance from '../../services/realtimeService';

export default function BookingsScreen({ navigation }) {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Animation controller
  // Removed animation controller

  // Animated values
  const headerAnimatedValues = useRef({
    opacity: new Animated.Value(0),
    translateY: new Animated.Value(-30),
  }).current;

  const listAnimatedValues = useRef({
    opacity: new Animated.Value(0),
    translateY: new Animated.Value(30),
  }).current;

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
    
    // Start entrance animations
    startEntranceAnimations();
    
    // Load bookings data
    loadBookingsData();
    
    // Initialize real-time monitoring
    initializeRealtimeMonitoring();

    return () => {
      // Cleanup animations if needed
      realtimeServiceInstance.stopSalonMonitoring('salon_1');
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
      // List animation
      Animated.parallel([
        Animated.timing(listAnimatedValues.opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(listAnimatedValues.translateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(listAnimatedValues.scale, {
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
      const result = await firestoreService.bookings.getBySalon('salon_1');
      
      if (result.success) {
        setBookings(result.data);
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeRealtimeMonitoring = async () => {
    try {
      await realtimeServiceInstance.startSalonMonitoring('salon_1', {
        onBookingsUpdate: (realtimeBookings) => {
          console.log('📅 Real-time bookings update:', realtimeBookings.length);
          setBookings(realtimeBookings);
        }
      });
    } catch (error) {
      console.error('Error initializing real-time monitoring:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadBookingsData();
    setIsRefreshing(false);
  };

  const handleBookingAction = async (booking, action) => {
    try {
      let updateData = {};
      let successMessage = '';

      switch (action) {
        case 'confirm':
          updateData = { status: 'confirmed' };
          successMessage = 'Booking confirmed successfully!';
          break;
        case 'cancel':
          updateData = { status: 'cancelled' };
          successMessage = 'Booking cancelled successfully!';
          break;
        case 'complete':
          updateData = { status: 'completed' };
          successMessage = 'Booking marked as completed!';
          break;
        case 'paid':
          updateData = { paymentStatus: 'paid', paymentDate: new Date() };
          successMessage = 'Payment recorded successfully!';
          break;
      }

      const result = await firestoreService.bookings.update(booking.id, updateData);
      
      if (result.success) {
        Alert.alert('Success', successMessage);
        // Real-time updates will handle UI refresh
      } else {
        Alert.alert('Error', 'Failed to update booking. Please try again.');
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      Alert.alert('Error', 'Failed to update booking. Please try again.');
    }
  };

  const renderBooking = ({ item, index }) => {
    const animatedValues = {
      opacity: new Animated.Value(1),
      translateY: new Animated.Value(0),
      scale: new Animated.Value(1),
    };

    return (
      <Animated.View
        style={[
          styles.bookingCardContainer,
          {
            opacity: animatedValues.opacity,
            transform: [
              { translateY: animatedValues.translateY },
              { scale: animatedValues.scale },
            ],
          }
        ]}
      >
        <TouchableOpacity 
          style={styles.bookingCard}
          onPress={() => navigation.navigate('BookingDetail', { booking: item })}
          activeOpacity={0.9}
        >
          <View style={styles.bookingLeft}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatar}>{item.avatar || '👤'}</Text>
            </View>
            <View style={styles.bookingInfo}>
              <Text style={styles.customerName}>{item.customerName || item.customer}</Text>
              <Text style={styles.serviceName}>{item.serviceName || item.service}</Text>
              <Text style={styles.bookingTime}>{item.date} at {item.time}</Text>
            </View>
          </View>
          
          <View style={styles.bookingRight}>
            <View style={[
              styles.statusBadge, 
              item.status === 'confirmed' ? styles.confirmedBadge :
              item.status === 'pending' ? styles.pendingBadge :
              item.status === 'completed' ? styles.completedBadge : styles.cancelledBadge
            ]}>
              <Text style={[
                styles.statusText,
                item.status === 'confirmed' ? styles.confirmedText :
                item.status === 'pending' ? styles.pendingText :
                item.status === 'completed' ? styles.completedText : styles.cancelledText
              ]}>
                {(item.status || 'pending').toUpperCase()}
              </Text>
            </View>
            
            <View style={styles.actionButtons}>
              {item.status === 'pending' && (
                <>
                  <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={() => handleBookingAction(item, 'confirm')}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="checkmark" size={16} color={colors.background.white} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => handleBookingAction(item, 'cancel')}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="close" size={16} color={colors.background.white} />
                  </TouchableOpacity>
                </>
              )}
              {item.status === 'confirmed' && (
                <TouchableOpacity
                  style={styles.completeButton}
                  onPress={() => handleBookingAction(item, 'complete')}
                  activeOpacity={0.8}
                >
                  <Ionicons name="checkmark-done" size={16} color={colors.background.white} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={globalStyles.container}>
      <Header 
        title="Bookings" 
        rightIcon="add"
        onRightPress={() => navigation.navigate('NewBooking')}
      />
      
      <View style={styles.content}>
        <Text style={styles.dateText}>Tuesday, May 7</Text>
        
        <FlatList
          data={bookings}
          renderItem={renderBooking}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  dateText: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  bookingCard: {
    backgroundColor: colors.background.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    fontSize: 32,
    marginRight: 16,
  },
  bookingInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  bookingTime: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
});
