import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  StatusBar, 
  Dimensions,
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
import notificationServiceInstance from '../../services/notificationService';

const { width, height } = Dimensions.get('window');

export default function PaymentSuccessScreen({ navigation, route }) {
  const { service, booking, paymentMethod } = route.params || {};

  // Animation controller
  // Removed animation controller

  // Animated values
  const successAnimatedValues = useRef({
    opacity: new Animated.Value(0),
    scale: new Animated.Value(0.5),
    translateY: new Animated.Value(30), // Added missing translateY
  }).current;

  const cardAnimatedValues = useRef({
    opacity: new Animated.Value(0),
    translateY: new Animated.Value(50),
    scale: new Animated.Value(0.9),
  }).current;

  const buttonAnimatedValues = useRef({
    opacity: new Animated.Value(0),
    translateY: new Animated.Value(30),
    scale: new Animated.Value(1),
  }).current;

  const checkmarkScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
    
    // Start success animations
    startSuccessAnimations();
    
    // Send success notification
    sendSuccessNotification();

    return () => {
      // Cleanup animations if needed
    };
  }, []);

  const startSuccessAnimations = () => {
    // Checkmark animation
    const checkmarkAnimation = Animated.sequence([
      Animated.delay(300),
      Animated.spring(checkmarkScale, {
        toValue: 1,
        tension: 100,
        friction: 6,
        useNativeDriver: true,
      }),
    ]);

    // Start animations directly with proper timing
    Animated.stagger(200, [
      checkmarkAnimation,
      // Success animation
      Animated.parallel([
        Animated.timing(successAnimatedValues.opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(successAnimatedValues.translateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // Card animation
      Animated.parallel([
        Animated.timing(cardAnimatedValues.opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(cardAnimatedValues.translateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(cardAnimatedValues.scale, {
          toValue: 1,
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
      ]),
    ]).start();
  };

  const sendSuccessNotification = async () => {
    try {
      await notificationServiceInstance.sendLocalNotification(
        '🎉 Booking Confirmed!',
        `Your ${service?.name || 'appointment'} is confirmed. We'll send you a reminder.`,
        { 
          type: 'booking_success', 
          bookingId: booking?.id,
          serviceName: service?.name 
        }
      );
    } catch (error) {
      console.error('Error sending success notification:', error);
    }
  };

  const handleGoToBookings = () => {
    // Button press animation
    Animated.sequence([
      Animated.timing(buttonAnimatedValues.scale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonAnimatedValues.scale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'CustomerTabs', params: { screen: 'Bookings' } }],
      });
    });
  };

  const handleLeaveReview = () => {
    navigation.navigate('Review', { 
      service: {
        ...service,
        date: `${booking?.date || '25. april'} kl. ${booking?.time || '11:00'}`,
        salon: service?.salon || booking?.salonName,
      },
      booking 
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#213527" />
      
      {/* Header - Deep green (#213527) - Same as other screens */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: successAnimatedValues.opacity,
            transform: [{ translateY: successAnimatedValues.translateY }],
          }
        ]}
      >
        {/* Logo Leaf & SANOVA - Centered horizontally and vertically */}
        <View style={styles.logoContainer}>
          {/* Logo - Same dimensions as other screens */}
          <Image 
            source={require('../../../assets/logo.png')}
            style={styles.logoIcon}
            resizeMode="contain"
          />
          {/* SANOVA text - Same styling as other screens */}
          <Text style={styles.headerTitle}>SANOVA</Text>
        </View>
      </Animated.View>

      {/* Main Card - Very light cream (#FAF6EC) */}
      <Animated.View 
        style={[
          styles.mainCard,
          {
            opacity: cardAnimatedValues.opacity,
            transform: [
              { translateY: cardAnimatedValues.translateY },
              { scale: cardAnimatedValues.scale }
            ],
          }
        ]}
      >
        {/* Success Animation Container */}
        <View style={styles.successSection}>
          {/* Large checkmark - 84px diameter, #22C55E green */}
          <Animated.View 
            style={[
              styles.checkmarkContainer,
              { transform: [{ scale: checkmarkScale }] }
            ]}
          >
            <Ionicons name="checkmark-circle" size={84} color="#22C55E" />
          </Animated.View>
          
          {/* Success title - "Payment Successful!", 28px, weight 700, #223527 */}
          <Text style={styles.successTitle}>Payment Successful!</Text>
          {/* Success subtitle - "Your booking has been confirmed", 18px, #626463 */}
          <Text style={styles.successSubtitle}>Your booking has been confirmed</Text>
        </View>

        {/* Booking Details Card - White background, 18px radius */}
        <View style={styles.bookingCard}>
          {/* Service info header */}
          <View style={styles.serviceSection}>
            <Text style={styles.serviceName}>{service?.name || 'Classic Manicure'}</Text>
            <Text style={styles.salonName}>{service?.salon || booking?.salonName || 'Gustav Salon'}</Text>
          </View>
          
          {/* Booking details */}
          <View style={styles.detailsSection}>
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={18} color="#626463" />
              <Text style={styles.detailText}>
                {booking?.date || '25. april'} at {booking?.time || '11:00'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={18} color="#626463" />
              <Text style={styles.detailText}>{service?.duration || '45 min'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="card-outline" size={18} color="#626463" />
              <Text style={styles.detailText}>{service?.price || '200 kr'}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <Animated.View 
          style={[
            styles.buttonsContainer,
            {
              opacity: buttonAnimatedValues.opacity,
              transform: [
                { translateY: buttonAnimatedValues.translateY },
                { scale: buttonAnimatedValues.scale }
              ],
            }
          ]}
        >
          {/* Primary button - "View My Bookings", 344px width, 51px height */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleGoToBookings}
            activeOpacity={0.9}
          >
            <Text style={styles.primaryButtonText}>View My Bookings</Text>
          </TouchableOpacity>

          {/* Secondary button - "Leave a Review", 18px below primary */}
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleLeaveReview}
            activeOpacity={0.8}
          >
            <Ionicons name="star-outline" size={18} color="#223527" style={styles.starIcon} />
            <Text style={styles.secondaryButtonText}>Leave a Review</Text>
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
  
  // Header - Deep green (#213527) - Same as other screens
  header: {
    backgroundColor: '#213527', // Exact deep green color
    height: 115, // Same height as other screens
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
    marginBottom: 6, // Same spacing as other screens
  },
  headerTitle: {
    fontSize: 25, // Same as other screens
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
    borderTopLeftRadius: 28, // Top corners only, same as other screens
    borderTopRightRadius: 28,
    width: '100%',
    flex: 1,
    paddingHorizontal: 26, // 26px from left/right
    paddingTop: 50, // 50px margin-top for success section
    justifyContent: 'center',
  },
  
  // Success Animation Container
  successSection: {
    alignItems: 'center',
    marginBottom: 40, // 40px below success section
  },
  
  // Large checkmark container - 84px diameter, #22C55E green
  checkmarkContainer: {
    marginBottom: 24, // 24px below checkmark
  },
  
  // Success title - "Payment Successful!", 28px, weight 700, #223527
  successTitle: {
    fontSize: 28, // 28px
    fontWeight: '700', // Weight 700
    color: '#223527', // #223527
    textAlign: 'center',
    marginBottom: 12, // 12px below title
  },
  
  // Success subtitle - "Your booking has been confirmed", 18px, #626463
  successSubtitle: {
    fontSize: 18, // 18px
    color: '#626463', // #626463
    textAlign: 'center',
  },
  
  // Booking Details Card - White background, 18px radius
  bookingCard: {
    backgroundColor: '#FFFFFF', // White background
    borderRadius: 18, // 18px radius
    paddingHorizontal: 24, // 24px internal horizontal padding
    paddingVertical: 28, // 28px internal vertical padding
    marginBottom: 32, // 32px below booking card
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  
  // Service info header
  serviceSection: {
    marginBottom: 20, // 20px below service section
    paddingBottom: 20, // 20px internal bottom padding
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0', // Light divider
  },
  
  // Service name - "Classic Manicure", 22px, weight 700, #223527
  serviceName: {
    fontSize: 22, // 22px
    fontWeight: '700', // Weight 700
    color: '#223527', // #223527
    marginBottom: 6, // 6px below service name
  },
  
  // Salon name - "Gustav Salon", 17px, #626463
  salonName: {
    fontSize: 17, // 17px
    color: '#626463', // #626463
  },
  
  // Booking details section
  detailsSection: {
    gap: 14, // 14px between detail rows
  },
  
  // Detail row - Icon + text
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  // Detail text - 16px, #223527
  detailText: {
    fontSize: 16, // 16px
    color: '#223527', // #223527
    marginLeft: 12, // 12px left margin from icon
  },
  
  // Action Buttons Container
  buttonsContainer: {
    alignItems: 'center',
    paddingBottom: 40, // 40px margin-bottom from safe area
  },
  
  // Primary button - "View My Bookings", 344px width, 51px height, #163A24 background
  primaryButton: {
    width: 344, // 344px width
    height: 51, // 51px height
    backgroundColor: '#163A24', // #163A24 background
    borderRadius: 25, // Pill-shaped radius 25px
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18, // 18px below primary button
  },
  
  // Primary button text - "View My Bookings", #FFF, 20px, weight 600
  primaryButtonText: {
    fontSize: 20, // 20px
    color: '#FFFFFF', // #FFF
    fontWeight: '600', // Weight 600
  },
  
  // Secondary button - "Leave a Review", 18px below primary
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  
  // Star icon - 18px, #223527, 8px right margin
  starIcon: {
    marginRight: 8, // 8px right margin from star icon
  },
  
  // Secondary button text - "Leave a Review", #223527, 18px
  secondaryButtonText: {
    fontSize: 18, // 18px
    color: '#223527', // #223527
    fontWeight: '500',
  },
});
