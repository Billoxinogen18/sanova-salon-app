import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  StatusBar, 
  Dimensions 
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
  AnimationController 
} from '../../theme/animations';
import notificationServiceInstance from '../../services/notificationService';

const { width, height } = Dimensions.get('window');

export default function PaymentSuccessScreen({ navigation, route }) {
  const { service, booking, paymentMethod } = route.params || {};

  // Animation controller
  const animationController = useRef(new AnimationController()).current;

  // Animated values
  const successAnimatedValues = useRef({
    opacity: new Animated.Value(0),
    scale: new Animated.Value(0.5),
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
      animationController.stopAllAnimations();
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

    const successAnimation = animationSequences.fadeInUp(successAnimatedValues, 0);
    const cardAnimation = animationSequences.fadeInUp(cardAnimatedValues, 200);
    const buttonAnimation = animationSequences.fadeInUp(buttonAnimatedValues, 600);

    animationController.registerAnimation('success', 
      Animated.parallel([
        checkmarkAnimation,
        successAnimation,
        cardAnimation,
        buttonAnimation,
      ])
    );

    animationController.animations.get('success').start();
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
      <StatusBar barStyle="dark-content" backgroundColor={colors.background.primary} />
      
      {/* Success Animation */}
      <Animated.View 
        style={[
          styles.successContainer,
          {
            opacity: successAnimatedValues.opacity,
            transform: [{ scale: successAnimatedValues.scale }],
          }
        ]}
      >
        <Animated.View 
          style={[
            styles.checkmarkContainer,
            { transform: [{ scale: checkmarkScale }] }
          ]}
        >
          <Ionicons name="checkmark-circle" size={80} color="#22c55e" />
        </Animated.View>
        
        <Text style={styles.successTitle}>Payment Successful!</Text>
        <Text style={styles.successSubtitle}>Your booking has been confirmed</Text>
      </Animated.View>

      {/* Booking Details Card */}
      <Animated.View 
        style={[
          styles.detailsCard,
          {
            opacity: cardAnimatedValues.opacity,
            transform: [
              { translateY: cardAnimatedValues.translateY },
              { scale: cardAnimatedValues.scale }
            ],
          }
        ]}
      >
        <View style={styles.serviceHeader}>
          <View style={styles.serviceIcon}>
            <Ionicons name="cut-outline" size={24} color={colors.primary} />
          </View>
          <View style={styles.serviceInfo}>
            <Text style={styles.serviceName}>{service?.name || 'Classic Manicure'}</Text>
            <Text style={styles.salonName}>{service?.salon || booking?.salonName || 'Gustav Salon'}</Text>
          </View>
        </View>

        <View style={styles.bookingDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={16} color={colors.text.secondary} />
            <Text style={styles.detailText}>
              {booking?.date || '25. april'} at {booking?.time || '11:00'}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={16} color={colors.text.secondary} />
            <Text style={styles.detailText}>{service?.duration || '45 min'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="card-outline" size={16} color={colors.text.secondary} />
            <Text style={styles.detailText}>
              Paid with {paymentMethod === 'card' ? 'Credit Card' : 
                       paymentMethod === 'applepay' ? 'Apple Pay' : 'MobilePay'}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="pricetag-outline" size={16} color={colors.text.secondary} />
            <Text style={styles.detailText}>{service?.price || '200 kr'}</Text>
          </View>
        </View>
      </Animated.View>

      {/* Action Buttons */}
      <Animated.View 
        style={[
          styles.buttonContainer,
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
          style={styles.primaryButton}
          onPress={handleGoToBookings}
          activeOpacity={0.9}
        >
          <Text style={styles.primaryButtonText}>View My Bookings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleLeaveReview}
          activeOpacity={0.9}
        >
          <Ionicons name="star-outline" size={16} color={colors.primary} />
          <Text style={styles.secondaryButtonText}>Leave a Review</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...premiumComponents.screenContainer,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  checkmarkContainer: {
    marginBottom: spacing.lg,
  },
  successTitle: {
    ...typography.title1,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  successSubtitle: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    opacity: 0.8,
  },
  detailsCard: {
    ...premiumComponents.floatingCard,
    backgroundColor: colors.background.white,
    marginBottom: spacing.xl,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  serviceIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(38, 52, 40, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    ...shadows.card,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    ...typography.bodyMedium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  salonName: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  bookingDetails: {
    gap: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  detailText: {
    ...typography.body,
    color: colors.text.primary,
    flex: 1,
  },
  buttonContainer: {
    gap: spacing.md,
  },
  primaryButton: {
    ...premiumComponents.primaryButton,
    backgroundColor: colors.primary,
  },
  primaryButtonText: {
    ...typography.button,
    color: colors.background.white,
  },
  secondaryButton: {
    ...premiumComponents.secondaryButton,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background.white,
    borderColor: colors.primary,
  },
  secondaryButtonText: {
    ...typography.button,
    color: colors.primary,
  },
});
