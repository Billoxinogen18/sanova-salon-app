import React, { useEffect, useRef, useState } from 'react';
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
import realtimeServiceInstance from '../../services/realtimeService';
import notificationServiceInstance from '../../services/notificationService';

const { width, height } = Dimensions.get('window');

export default function DashboardScreen({ navigation }) {
  const [realtimeBookings, setRealtimeBookings] = useState([]);
  const [realtimeReviews, setRealtimeReviews] = useState([]);
  const [todayRevenue, setTodayRevenue] = useState(250);
  const [weekRevenue, setWeekRevenue] = useState(1100);
  const [monthRevenue, setMonthRevenue] = useState(4200);

  // Animation controller
  // Removed animation controller

  // Animated values
  const headerAnimatedValues = useRef({
    opacity: new Animated.Value(0),
    translateY: new Animated.Value(-30),
  }).current;

  const welcomeAnimatedValues = useRef({
    opacity: new Animated.Value(0),
    translateY: new Animated.Value(20),
  }).current;

  const bookingsAnimatedValues = useRef({
    opacity: new Animated.Value(0),
    translateY: new Animated.Value(30),
    scale: new Animated.Value(0.95),
  }).current;

  const revenueAnimatedValues = useRef({
    opacity: new Animated.Value(0),
    translateY: new Animated.Value(30),
    scale: new Animated.Value(0.95),
  }).current;

  const buttonsAnimatedValues = useRef({
    opacity: new Animated.Value(0),
    translateY: new Animated.Value(40),
  }).current;

  const upcomingBookings = [
    {
      id: 1,
      customer: 'Klara Nielsen',
      service: "Women's Haircut & Style",
      time: '14:00',
      avatar: '👩',
      status: 'confirmed',
      duration: '1h 30min',
    },
    {
      id: 2,
      customer: 'Erik Andersen',
      service: 'Men\'s Cut & Beard Trim',
      time: '16:00',
      avatar: '👨',
      status: 'pending',
      duration: '45min',
    },
  ];

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
    
    // Start entrance animations
    startEntranceAnimations();
    
    // Initialize real-time monitoring
    initializeRealtimeServices();

    return () => {
      // Cleanup animations if needed
      // Stop real-time monitoring when component unmounts
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
      // Welcome animation
      Animated.parallel([
        Animated.timing(welcomeAnimatedValues.opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(welcomeAnimatedValues.translateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // Bookings animation
      Animated.parallel([
        Animated.timing(bookingsAnimatedValues.opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(bookingsAnimatedValues.translateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(bookingsAnimatedValues.scale, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // Revenue animation
      Animated.parallel([
        Animated.timing(revenueAnimatedValues.opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(revenueAnimatedValues.translateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(revenueAnimatedValues.scale, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // Buttons animation
      Animated.parallel([
        Animated.timing(buttonsAnimatedValues.opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(buttonsAnimatedValues.translateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  const initializeRealtimeServices = async () => {
    try {
      // Start monitoring real-time updates for this salon
      const result = await realtimeServiceInstance.startSalonMonitoring('salon_1', {
        onBookingsUpdate: (bookings) => {
          console.log('📅 Real-time bookings update:', bookings.length);
          setRealtimeBookings(bookings);
          
          // Show notification for new bookings
          if (bookings.length > realtimeBookings.length) {
            notificationServiceInstance.sendLocalNotification(
              'New Booking!',
              'You have a new booking request.',
              { type: 'new_booking' }
            );
          }
        },
        onReviewsUpdate: (reviews) => {
          console.log('⭐ Real-time reviews update:', reviews.length);
          setRealtimeReviews(reviews);
          
          // Show notification for new reviews
          if (reviews.length > realtimeReviews.length) {
            const latestReview = reviews[0];
            notificationServiceInstance.sendLocalNotification(
              'New Review!',
              `${latestReview.rating} stars: "${latestReview.reviewText?.substring(0, 50)}..."`,
              { type: 'new_review' }
            );
          }
        }
      });

      if (result.success) {
        console.log('✅ Real-time monitoring started successfully');
      }
    } catch (error) {
      console.error('❌ Error initializing real-time services:', error);
    }
  };

  const handleActionPress = (action, screen) => {
    // Button press animation
    const buttonScale = new Animated.Value(1);
    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start(() => {
      navigation.navigate(screen);
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background.primary} />
      
      {/* Premium Animated Header */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: headerAnimatedValues.opacity,
            transform: [{ translateY: headerAnimatedValues.translateY }],
          }
        ]}
      >
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <Image source={require('../../../assets/icon.png')} style={styles.logoImage} />
          </View>
          <Text style={styles.headerTitle}>SANOVA</Text>
          <Text style={styles.headerSubtitle}>Salon Dashboard</Text>
        </View>
        <TouchableOpacity style={styles.profileButton} activeOpacity={0.8}>
          <Ionicons name="person-circle-outline" size={32} color={colors.primary} />
        </TouchableOpacity>
      </Animated.View>
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Premium Animated Welcome Section */}
        <Animated.View 
          style={[
            styles.welcomeSection,
            {
              opacity: welcomeAnimatedValues.opacity,
              transform: [{ translateY: welcomeAnimatedValues.translateY }],
            }
          ]}
        >
          <Text style={styles.welcomeText}>Hello, Glamorous Salon</Text>
          <Text style={styles.dateText}>Tuesday, May 7 • {new Date().getFullYear()}</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{realtimeBookings.length || upcomingBookings.length}</Text>
              <Text style={styles.statLabel}>Today's Bookings</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{realtimeReviews.length || 12}</Text>
              <Text style={styles.statLabel}>Total Reviews</Text>
            </View>
          </View>
        </Animated.View>

        {/* Premium Animated Bookings Section */}
        <Animated.View 
          style={[
            styles.upcomingBookings,
            {
              opacity: bookingsAnimatedValues.opacity,
              transform: [
                { translateY: bookingsAnimatedValues.translateY },
                { scale: bookingsAnimatedValues.scale }
              ],
            }
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Appointments</Text>
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => navigation.navigate('Bookings')}
              activeOpacity={0.8}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          {upcomingBookings.map((booking, index) => (
            <TouchableOpacity 
              key={booking.id} 
              style={styles.bookingCard}
              onPress={() => navigation.navigate('BookingDetail', { booking })}
              activeOpacity={0.9}
            >
              <View style={styles.bookingLeft}>
                <View style={styles.avatarContainer}>
                  <Text style={styles.avatar}>{booking.avatar}</Text>
                </View>
                <View style={styles.bookingInfo}>
                  <Text style={styles.customerName}>{booking.customer}</Text>
                  <Text style={styles.serviceName}>{booking.service}</Text>
                  <Text style={styles.bookingDuration}>{booking.duration}</Text>
                </View>
              </View>
              <View style={styles.bookingRight}>
                <Text style={styles.bookingTime}>{booking.time}</Text>
                <View style={[
                  styles.statusBadge, 
                  booking.status === 'confirmed' ? styles.confirmedBadge : styles.pendingBadge
                ]}>
                  <Text style={[
                    styles.statusText,
                    booking.status === 'confirmed' ? styles.confirmedText : styles.pendingText
                  ]}>
                    {booking.status.toUpperCase()}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
          
          <View style={styles.bookingFooter}>
            <Ionicons name="calendar-outline" size={16} color={colors.text.secondary} />
            <Text style={styles.bookingFooterText}>
              {upcomingBookings.length} appointments scheduled for today
            </Text>
          </View>
        </Animated.View>

        {/* Premium Animated Revenue Section */}
        <Animated.View 
          style={[
            styles.revenueSection,
            {
              opacity: revenueAnimatedValues.opacity,
              transform: [
                { translateY: revenueAnimatedValues.translateY },
                { scale: revenueAnimatedValues.scale }
              ],
            }
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Revenue Analytics</Text>
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => navigation.navigate('Payments')}
              activeOpacity={0.8}
            >
              <Text style={styles.viewAllText}>View Details</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.revenueCard}>
            <View style={styles.revenueHeader}>
              <View>
                <Text style={styles.revenueLabel}>Today's Revenue</Text>
                <Text style={styles.revenueAmount}>${todayRevenue}</Text>
              </View>
              <View style={styles.revenueIcon}>
                <Ionicons name="trending-up" size={24} color={colors.accent} />
              </View>
            </View>
            <View style={styles.revenueProgress}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '65%' }]} />
              </View>
              <Text style={styles.progressText}>65% of weekly goal</Text>
            </View>
          </View>

          <View style={styles.revenueStats}>
            <View style={styles.revenueStatCard}>
              <Ionicons name="calendar-outline" size={20} color={colors.primary} />
              <Text style={styles.statValue}>${weekRevenue}</Text>
              <Text style={styles.statLabel}>This Week</Text>
              <Text style={styles.statChange}>+12%</Text>
            </View>
            <View style={styles.revenueStatCard}>
              <Ionicons name="calendar" size={20} color={colors.primary} />
              <Text style={styles.statValue}>${monthRevenue}</Text>
              <Text style={styles.statLabel}>This Month</Text>
              <Text style={styles.statChange}>+8%</Text>
            </View>
          </View>

          <View style={styles.productsRevenue}>
            <View style={styles.productsHeader}>
              <Ionicons name="business-outline" size={20} color={colors.text.secondary} />
              <Text style={styles.productsLabel}>Product Sales</Text>
            </View>
            <Text style={styles.productsAmount}>$45</Text>
            <Text style={styles.productsNote}>Click & collect orders fulfilled</Text>
          </View>
        </Animated.View>

        {/* Premium Animated Action Buttons */}
        <Animated.View 
          style={[
            styles.actionButtons,
            {
              opacity: buttonsAnimatedValues.opacity,
              transform: [{ translateY: buttonsAnimatedValues.translateY }],
            }
          ]}
        >
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleActionPress('new_booking', 'NewBooking')}
            activeOpacity={0.9}
          >
            <View style={styles.actionButtonIcon}>
              <Ionicons name="calendar-outline" size={24} color={colors.background.white} />
            </View>
            <Text style={styles.actionButtonText}>New Booking</Text>
            <Text style={styles.actionButtonSubtext}>Schedule appointment</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleActionPress('new_product', 'NewProduct')}
            activeOpacity={0.9}
          >
            <View style={styles.actionButtonIcon}>
              <Ionicons name="add-circle-outline" size={24} color={colors.background.white} />
            </View>
            <Text style={styles.actionButtonText}>Add Product</Text>
            <Text style={styles.actionButtonSubtext}>Manage inventory</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleActionPress('services', 'Services')}
            activeOpacity={0.9}
          >
            <View style={styles.actionButtonIcon}>
              <Ionicons name="cut-outline" size={24} color={colors.background.white} />
            </View>
            <Text style={styles.actionButtonText}>Services</Text>
            <Text style={styles.actionButtonSubtext}>Manage offerings</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...premiumComponents.screenContainer,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.lg,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  logoContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(38, 52, 40, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    ...shadows.card,
  },
  headerTitle: {
    ...typography.title2,
    color: colors.primary,
    fontFamily: 'serif',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  profileButton: {
    padding: spacing.sm,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  welcomeSection: {
    marginBottom: spacing.xl,
    paddingTop: spacing.lg,
  },
  welcomeText: {
    ...typography.title1,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  dateText: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.background.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.card,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    ...typography.title2,
    color: colors.primary,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  upcomingBookings: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.title3,
    color: colors.text.primary,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  viewAllText: {
    ...typography.captionMedium,
    color: colors.primary,
  },
  bookingCard: {
    ...premiumComponents.elevatedCard,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    backgroundColor: colors.background.white,
  },
  bookingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bookingRight: {
    alignItems: 'flex-end',
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    ...shadows.card,
  },
  avatar: {
    fontSize: 24,
  },
  bookingInfo: {
    flex: 1,
  },
  customerName: {
    ...typography.bodyMedium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  serviceName: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  bookingDuration: {
    ...typography.small,
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
  bookingTime: {
    ...typography.bodyMedium,
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  confirmedBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
  },
  pendingBadge: {
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
  },
  statusText: {
    ...typography.small,
    fontWeight: '600',
  },
  confirmedText: {
    color: '#22c55e',
  },
  pendingText: {
    color: '#fbbf24',
  },
  bookingFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  bookingFooterText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  revenueSection: {
    marginBottom: spacing.xl,
  },
  revenueCard: {
    ...premiumComponents.floatingCard,
    backgroundColor: colors.background.white,
    marginBottom: spacing.lg,
  },
  revenueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  revenueLabel: {
    ...typography.captionMedium,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  revenueAmount: {
    ...typography.display,
    color: colors.text.primary,
    fontWeight: '700',
  },
  revenueIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(212, 185, 143, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  revenueProgress: {
    marginTop: spacing.md,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.background.secondary,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 3,
  },
  progressText: {
    ...typography.small,
    color: colors.text.secondary,
  },
  revenueStats: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  revenueStatCard: {
    flex: 1,
    ...premiumComponents.premiumCard,
    backgroundColor: colors.background.white,
    alignItems: 'center',
    padding: spacing.lg,
  },
  statValue: {
    ...typography.title3,
    color: colors.text.primary,
    fontWeight: '700',
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.small,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  statChange: {
    ...typography.small,
    color: '#22c55e',
    fontWeight: '600',
  },
  productsRevenue: {
    ...premiumComponents.premiumCard,
    backgroundColor: colors.background.white,
  },
  productsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  productsLabel: {
    ...typography.captionMedium,
    color: colors.text.secondary,
  },
  productsAmount: {
    ...typography.title3,
    color: colors.text.primary,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  productsNote: {
    ...typography.small,
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
  actionButtons: {
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  actionButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadows.elevated,
  },
  actionButtonIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  actionButtonText: {
    ...typography.bodyMedium,
    color: colors.background.white,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  actionButtonSubtext: {
    ...typography.small,
    color: colors.background.white,
    opacity: 0.8,
  },
  
  logoImage: {
    width: 24,
    height: 24,
  },
});
