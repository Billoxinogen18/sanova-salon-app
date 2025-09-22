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
import realtimeServiceInstance from '../../services/realtimeService';
import notificationServiceInstance from '../../services/notificationService';
import { authService } from '../../services/firebaseService';

const { width, height } = Dimensions.get('window');

export default function DashboardScreen({ navigation }) {
  const [realtimeBookings, setRealtimeBookings] = useState([]);
  const [realtimeReviews, setRealtimeReviews] = useState([]);
  const [todayRevenue, setTodayRevenue] = useState(1250);
  const [weekRevenue, setWeekRevenue] = useState(5200);
  const [monthRevenue, setMonthRevenue] = useState(18400);

  // Animated values for smooth entrance animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Logout function
  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await authService.signOut();
              console.log('Salon owner logged out');
              navigation.navigate('Login');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };
  const upcomingBookings = [
    {
      id: 1,
      customer: 'Emma Nielsen',
      service: 'Classic Manicure',
      time: '11:00',
      status: 'confirmed',
      price: '350 kr',
    },
    {
      id: 2,
      customer: 'Lars Hansen',
      service: 'Men\'s Haircut',
      time: '14:30',
      status: 'confirmed',
      price: '450 kr',
    },
    {
      id: 3,
      customer: 'Sofia Andersen',
      service: 'Hair Color Treatment',
      time: '16:00',
      status: 'pending',
      price: '800 kr',
    },
  ];

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    
    // Start entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Initialize real-time monitoring
    initializeRealtimeServices();

    return () => {
      // Stop real-time monitoring when component unmounts
      realtimeServiceInstance.stopSalonMonitoring('salon_1');
    };
  }, []);

  // Format currency
  const formatCurrency = (amount) => {
    return `${amount.toLocaleString()} kr`;
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor="#213527" />

      {/* Header - Deep green (#213527) - Same as other screens */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
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
        
        {/* Logout Button - Top right */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </Animated.View>

      {/* Main Card - Very light cream (#FAF6EC) */}
      <Animated.View
        style={[
          styles.mainCard,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        {/* Content Section */}
        <View style={styles.contentSection}>
          {/* Welcome Section - "Dashboard", salon name, date */}
          <View style={styles.welcomeSection}>
            <Text style={styles.sectionTitle}>Dashboard</Text>
            <Text style={styles.salonName}>Gustav Salon</Text>
            <Text style={styles.dateText}>Today • {new Date().toLocaleDateString('da-DK', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</Text>
          </View>

          {/* Today's Revenue Card */}
          <View style={styles.revenueCard}>
            <View style={styles.revenueHeader}>
              <View>
                <Text style={styles.revenueLabel}>Today's Revenue</Text>
                <Text style={styles.revenueAmount}>{formatCurrency(todayRevenue)}</Text>
              </View>
              <View style={styles.trendIcon}>
                <Ionicons name="trending-up" size={24} color="#22C55E" />
              </View>
            </View>
            <View style={styles.revenueDetails}>
              <View style={styles.revenueDetailItem}>
                <Text style={styles.revenueDetailLabel}>This Week</Text>
                <Text style={styles.revenueDetailValue}>{formatCurrency(weekRevenue)}</Text>
              </View>
              <View style={styles.revenueDetailItem}>
                <Text style={styles.revenueDetailLabel}>This Month</Text>
                <Text style={styles.revenueDetailValue}>{formatCurrency(monthRevenue)}</Text>
              </View>
            </View>
          </View>

          {/* Upcoming Bookings Section */}
          <View style={styles.bookingsSection}>
            <View style={styles.bookingsHeader}>
              <Text style={styles.bookingsTitle}>Upcoming Bookings</Text>
              <TouchableOpacity 
                style={styles.viewAllButton}
                onPress={() => navigation.navigate('Bookings')}
                activeOpacity={0.8}
              >
                <Text style={styles.viewAllText}>View All</Text>
                <Ionicons name="chevron-forward" size={16} color="#223527" />
              </TouchableOpacity>
            </View>
            
            {upcomingBookings.map((booking, index) => (
              <View key={booking.id} style={styles.bookingCard}>
                <View style={styles.bookingInfo}>
                  <Text style={styles.customerName}>{booking.customer}</Text>
                  <Text style={styles.serviceName}>{booking.service}</Text>
                  <View style={styles.bookingDetails}>
                    <Text style={styles.bookingTime}>{booking.time}</Text>
                    <Text style={styles.bookingPrice}>{booking.price}</Text>
                  </View>
                </View>
                <View style={[
                  styles.statusBadge,
                  booking.status === 'confirmed' ? styles.confirmedBadge : styles.pendingBadge
                ]}>
                  <Text style={[
                    styles.statusText,
                    booking.status === 'confirmed' ? styles.confirmedText : styles.pendingText
                  ]}>
                    {booking.status}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Quick Action Buttons */}
          <View style={styles.actionButtonsSection}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('NewBooking')}
              activeOpacity={0.9}
            >
              <Ionicons name="calendar-outline" size={22} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Create Booking</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('Products')}
              activeOpacity={0.9}
            >
              <Ionicons name="storefront-outline" size={22} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Manage Products</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </ScrollView>

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
    position: 'relative', // For logout button positioning
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    width: 80,
    height: 50,
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
  logoutButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  // Main Card - Very light cream (#FAF6EC)
  mainCard: {
    backgroundColor: '#FAF6EC', // Very light cream
    borderTopLeftRadius: 28, // Top corners only, same as other screens
    borderTopRightRadius: 28,
    width: '100%',
    flex: 1,
    paddingHorizontal: 26, // 26px from left/right
    paddingTop: 38, // 38px margin-top
  },

  // Content Section
  contentSection: {
    flex: 1,
  },

  // Welcome Section
  welcomeSection: {
    marginBottom: 32,
  },
  
  // Section Title - "Dashboard", 25px, weight 700, #223527
  sectionTitle: {
    fontSize: 25, // 25px
    fontWeight: '700', // Weight 700
    color: '#223527', // #223527
    marginBottom: 8,
  },

  // Salon name - "Gustav Salon", 19px, weight 600, #223527
  salonName: {
    fontSize: 19, // 19px
    fontWeight: '600', // Weight 600
    color: '#223527', // #223527
    marginBottom: 6,
  },

  // Date text - 16px, #626463
  dateText: {
    fontSize: 16, // 16px
    color: '#626463', // #626463
  },

  // Revenue Card - White background, 18px radius
  revenueCard: {
    backgroundColor: '#FFFFFF', // White background
    borderRadius: 18, // 18px radius
    padding: 24, // 24px internal padding
    marginBottom: 28, // 28px below revenue card
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },

  // Revenue header
  revenueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },

  // Revenue label - "Today's Revenue", 16px, #626463
  revenueLabel: {
    fontSize: 16, // 16px
    color: '#626463', // #626463
    marginBottom: 8,
  },

  // Revenue amount - "1,250 kr", 28px, weight 700, #223527
  revenueAmount: {
    fontSize: 28, // 28px
    fontWeight: '700', // Weight 700
    color: '#223527', // #223527
  },

  // Trend icon container
  trendIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Revenue details section
  revenueDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },

  // Revenue detail item
  revenueDetailItem: {
    alignItems: 'center',
  },

  // Revenue detail label - "This Week", 14px, #626463
  revenueDetailLabel: {
    fontSize: 14, // 14px
    color: '#626463', // #626463
    marginBottom: 6,
  },

  // Revenue detail value - "5,200 kr", 18px, weight 600, #223527
  revenueDetailValue: {
    fontSize: 18, // 18px
    fontWeight: '600', // Weight 600
    color: '#223527', // #223527
  },

  // Bookings Section
  bookingsSection: {
    marginBottom: 32,
  },

  // Bookings header
  bookingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  // Bookings title - "Upcoming Bookings", 20px, weight 600, #223527
  bookingsTitle: {
    fontSize: 20, // 20px
    fontWeight: '600', // Weight 600
    color: '#223527', // #223527
  },

  // View all button
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // View all text - "View All", 16px, #223527
  viewAllText: {
    fontSize: 16, // 16px
    color: '#223527', // #223527
    marginRight: 4,
  },

  // Booking Card - White background, 15px radius
  bookingCard: {
    backgroundColor: '#FFFFFF', // White background
    borderRadius: 15, // 15px radius
    padding: 18, // 18px internal padding
    marginBottom: 12, // 12px between booking cards
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },

  // Booking info - Left side content
  bookingInfo: {
    flex: 1,
  },

  // Customer name - "Emma Nielsen", 17px, weight 600, #223527
  customerName: {
    fontSize: 17, // 17px
    fontWeight: '600', // Weight 600
    color: '#223527', // #223527
    marginBottom: 4,
  },

  // Service name - "Classic Manicure", 15px, #626463
  serviceName: {
    fontSize: 15, // 15px
    color: '#626463', // #626463
    marginBottom: 8,
  },

  // Booking details - Time and price row
  bookingDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Booking time - "11:00", 14px, #223527
  bookingTime: {
    fontSize: 14, // 14px
    color: '#223527', // #223527
    marginRight: 12,
  },

  // Booking price - "350 kr", 14px, weight 500, #223527
  bookingPrice: {
    fontSize: 14, // 14px
    fontWeight: '500', // Weight 500
    color: '#223527', // #223527
  },

  // Status badge - Right side, rounded
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },

  // Confirmed badge - Green background
  confirmedBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
  },

  // Pending badge - Orange background
  pendingBadge: {
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
  },

  // Status text - 12px, weight 500
  statusText: {
    fontSize: 12, // 12px
    fontWeight: '500', // Weight 500
    textTransform: 'capitalize',
  },

  // Confirmed text - Green color
  confirmedText: {
    color: '#22C55E',
  },

  // Pending text - Orange color
  pendingText: {
    color: '#FBBF24',
  },

  // Action Buttons Section
  actionButtonsSection: {
    gap: 16,
    marginTop: 20,
    marginBottom: 40,
  },

  // Action Button - Green background, 18px radius
  actionButton: {
    backgroundColor: '#213527', // Deep green background
    borderRadius: 18, // 18px radius
    padding: 20, // 20px internal padding
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
  },

  // Action button text - "Create Booking", #FFF, 18px, weight 600
  actionButtonText: {
    fontSize: 18, // 18px
    fontWeight: '600', // Weight 600
    color: '#FFFFFF', // #FFF
    marginLeft: 12, // 12px left margin from icon
  },
});
