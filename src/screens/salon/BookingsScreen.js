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
  RefreshControl,
  ScrollView,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { firestoreService } from '../../services/firebaseService';
import realtimeServiceInstance from '../../services/realtimeService';

export default function BookingsScreen({ navigation }) {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('today');

  // Animated values for smooth entrance animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Sample bookings data for different time periods
  const sampleBookings = {
    today: [
      {
        id: 1,
        customerName: 'Emma Nielsen',
        phone: '+45 20 12 34 56',
        service: 'Classic Manicure',
        time: '11:00',
        duration: '45 min',
        price: '350 kr',
        status: 'confirmed',
        notes: 'Client prefers natural nail polish',
      },
      {
        id: 2,
        customerName: 'Lars Hansen',
        phone: '+45 30 45 67 89',
        service: 'Men\'s Haircut',
        time: '14:30',
        duration: '30 min',
        price: '450 kr',
        status: 'confirmed',
        notes: '',
      },
      {
        id: 3,
        customerName: 'Sofia Andersen',
        phone: '+45 40 78 90 12',
        service: 'Hair Color Treatment',
        time: '16:00',
        duration: '2 hours',
        price: '800 kr',
        status: 'pending',
        notes: 'First time client - allergic to ammonia',
      },
    ],
    upcoming: [
      {
        id: 4,
        customerName: 'Michael Christensen',
        phone: '+45 50 23 45 67',
        service: 'Beard Trim',
        time: '10:00',
        date: 'Tomorrow',
        duration: '20 min',
        price: '200 kr',
        status: 'confirmed',
        notes: '',
      },
      {
        id: 5,
        customerName: 'Anna Petersen',
        phone: '+45 60 34 56 78',
        service: 'Gel Manicure',
        time: '15:30',
        date: 'Friday',
        duration: '1 hour',
        price: '450 kr',
        status: 'confirmed',
        notes: 'Regular client - prefers red polish',
      },
    ],
  };

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
    
    // Load initial bookings
    setBookings(sampleBookings[selectedFilter]);
    
    // Initialize real-time monitoring
    initializeRealtimeMonitoring();

    return () => {
      realtimeServiceInstance.stopSalonMonitoring('salon_1');
    };
  }, []);

  // Handle filter change
  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    setBookings(sampleBookings[filter]);
  };

  // Format phone number for display
  const formatPhoneNumber = (phone) => {
    return phone.replace('+45 ', '');
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
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const handleBookingAction = async (booking, action) => {
    try {
      let successMessage = '';

      switch (action) {
        case 'confirm':
          successMessage = 'Booking confirmed successfully!';
          break;
        case 'cancel':
          successMessage = 'Booking cancelled successfully!';
          break;
        case 'complete':
          successMessage = 'Booking marked as completed!';
          break;
        case 'call':
          // Handle phone call
          successMessage = `Calling ${booking.customerName}...`;
          break;
      }

      Alert.alert('Success', successMessage);
      
      // Update local state
      const updatedBookings = bookings.map(b => 
        b.id === booking.id 
          ? { ...b, status: action === 'confirm' ? 'confirmed' : action === 'cancel' ? 'cancelled' : b.status }
          : b
      );
      setBookings(updatedBookings);
    } catch (error) {
      console.error('Error updating booking:', error);
      Alert.alert('Error', 'Failed to update booking. Please try again.');
    }
  };

  const renderBooking = ({ item, index }) => {
    return (
      <View style={styles.bookingCard}>
        <View style={styles.bookingHeader}>
          <View style={styles.customerInfo}>
            <Text style={styles.customerName} numberOfLines={1} ellipsizeMode="tail">
              {item.customerName.length > 17 ? item.customerName.substring(0, 17) + '...' : item.customerName}
            </Text>
            <Text style={styles.customerPhone}>{formatPhoneNumber(item.phone)}</Text>
          </View>
          <View style={styles.bookingActions}>
            <TouchableOpacity
              style={styles.callButton}
              onPress={() => handleBookingAction(item, 'call')}
              activeOpacity={0.8}
            >
              <Ionicons name="call" size={18} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={[
              styles.statusBadge,
              item.status === 'confirmed' ? styles.confirmedBadge : styles.pendingBadge
            ]}>
              <Text style={[
                styles.statusText,
                item.status === 'confirmed' ? styles.confirmedText : styles.pendingText
              ]}>
                {item.status}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.serviceInfo}>
          <Text style={styles.serviceName} numberOfLines={1} ellipsizeMode="tail">
            {item.service.length > 17 ? item.service.substring(0, 17) + '...' : item.service}
          </Text>
          <View style={styles.serviceDetails}>
            <Text style={styles.serviceTime}>{item.time}</Text>
            <Text style={styles.serviceDuration}>{item.duration}</Text>
            <Text style={styles.servicePrice}>{item.price}</Text>
          </View>
        </View>

        {item.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesLabel}>Notes:</Text>
            <Text style={styles.notesText}>{item.notes}</Text>
          </View>
        )}

        {item.status === 'pending' && (
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => handleBookingAction(item, 'confirm')}
              activeOpacity={0.9}
            >
              <Ionicons name="checkmark" size={18} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.declineButton}
              onPress={() => handleBookingAction(item, 'cancel')}
              activeOpacity={0.9}
            >
              <Ionicons name="close" size={18} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Decline</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
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
          {/* Header Section with Title and Add Button */}
          <View style={styles.pageHeader}>
            <Text style={styles.sectionTitle}>Bookings</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('NewBooking')}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Filter Tabs */}
          <View style={styles.filterTabs}>
            <TouchableOpacity
              style={[
                styles.filterTab,
                selectedFilter === 'today' && styles.activeFilterTab
              ]}
              onPress={() => handleFilterChange('today')}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.filterTabText,
                selectedFilter === 'today' && styles.activeFilterTabText
              ]}>
                Today
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterTab,
                selectedFilter === 'upcoming' && styles.activeFilterTab
              ]}
              onPress={() => handleFilterChange('upcoming')}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.filterTabText,
                selectedFilter === 'upcoming' && styles.activeFilterTabText
              ]}>
                Upcoming
              </Text>
            </TouchableOpacity>
          </View>

          {/* Bookings List */}
          <FlatList
            data={bookings}
            renderItem={renderBooking}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                colors={["#213527"]}
                tintColor="#213527"
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons name="calendar-outline" size={64} color="#626463" />
                <Text style={styles.emptyTitle}>No bookings yet</Text>
                <Text style={styles.emptySubtitle}>
                  Your {selectedFilter} appointments will appear here
                </Text>
              </View>
            }
          />
        </View>
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

  // Page Header with Title and Add Button
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },

  // Section Title - "Bookings", 25px, weight 700, #223527
  sectionTitle: {
    fontSize: 25, // 25px
    fontWeight: '700', // Weight 700
    color: '#223527', // #223527
  },

  // Add Button - Green circle with plus icon
  addButton: {
    width: 44,
    height: 44,
    backgroundColor: '#213527', // Deep green background
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },

  // Filter Tabs
  filterTabs: {
    flexDirection: 'row',
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 4,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },

  // Filter Tab
  filterTab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: 'center',
  },

  // Active Filter Tab
  activeFilterTab: {
    backgroundColor: '#213527', // Deep green background
  },

  // Filter Tab Text - 16px, #626463
  filterTabText: {
    fontSize: 16, // 16px
    color: '#626463', // #626463
    fontWeight: '500',
  },

  // Active Filter Tab Text - White
  activeFilterTabText: {
    color: '#FFFFFF', // White
    fontWeight: '600',
  },

  // List Container
  listContainer: {
    paddingBottom: 40,
    flexGrow: 1,
  },

  // Booking Card - White background, 18px radius
  bookingCard: {
    backgroundColor: '#FFFFFF', // White background
    borderRadius: 18, // 18px radius
    padding: 20, // 20px internal padding
    marginBottom: 16, // 16px between booking cards
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },

  // Booking Header - Customer info and actions
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },

  // Customer Info
  customerInfo: {
    flex: 1,
  },

  // Customer Name - 18px, weight 600, #223527
  customerName: {
    fontSize: 18, // 18px
    fontWeight: '600', // Weight 600
    color: '#223527', // #223527
    marginBottom: 4,
  },

  // Customer Phone - 15px, #626463
  customerPhone: {
    fontSize: 15, // 15px
    color: '#626463', // #626463
  },

  // Booking Actions - Right side buttons
  bookingActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  // Call Button - Green circle with phone icon
  callButton: {
    width: 36,
    height: 36,
    backgroundColor: '#22C55E', // Green background
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Status Badge
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },

  // Confirmed Badge - Green background
  confirmedBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
  },

  // Pending Badge - Orange background
  pendingBadge: {
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
  },

  // Status Text - 12px, weight 500
  statusText: {
    fontSize: 12, // 12px
    fontWeight: '500', // Weight 500
    textTransform: 'capitalize',
  },

  // Confirmed Text - Green color
  confirmedText: {
    color: '#22C55E',
  },

  // Pending Text - Orange color
  pendingText: {
    color: '#FBBF24',
  },

  // Service Info Section
  serviceInfo: {
    marginBottom: 16,
  },

  // Service Name - 16px, weight 600, #223527
  serviceName: {
    fontSize: 16, // 16px
    fontWeight: '600', // Weight 600
    color: '#223527', // #223527
    marginBottom: 8,
  },

  // Service Details Row
  serviceDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },

  // Service Time - 14px, #223527
  serviceTime: {
    fontSize: 14, // 14px
    color: '#223527', // #223527
    fontWeight: '500',
  },

  // Service Duration - 14px, #626463
  serviceDuration: {
    fontSize: 14, // 14px
    color: '#626463', // #626463
  },

  // Service Price - 14px, weight 600, #223527
  servicePrice: {
    fontSize: 14, // 14px
    fontWeight: '600', // Weight 600
    color: '#223527', // #223527
  },

  // Notes Section
  notesSection: {
    backgroundColor: '#F5F3E6', // Light background for notes
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },

  // Notes Label - 13px, weight 600, #223527
  notesLabel: {
    fontSize: 13, // 13px
    fontWeight: '600', // Weight 600
    color: '#223527', // #223527
    marginBottom: 4,
  },

  // Notes Text - 13px, #626463
  notesText: {
    fontSize: 13, // 13px
    color: '#626463', // #626463
    lineHeight: 18,
  },

  // Action Buttons Row
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },

  // Confirm Button - Green background
  confirmButton: {
    flex: 1,
    backgroundColor: '#22C55E', // Green background
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  // Decline Button - Red background
  declineButton: {
    flex: 1,
    backgroundColor: '#EF4444', // Red background
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  // Action Button Text - 14px, weight 600, #FFF
  actionButtonText: {
    fontSize: 14, // 14px
    fontWeight: '600', // Weight 600
    color: '#FFFFFF', // #FFF
  },

  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },

  // Empty Title - 20px, weight 600, #223527
  emptyTitle: {
    fontSize: 20, // 20px
    fontWeight: '600', // Weight 600
    color: '#223527', // #223527
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },

  // Empty Subtitle - 16px, #626463
  emptySubtitle: {
    fontSize: 16, // 16px
    color: '#626463', // #626463
    textAlign: 'center',
    lineHeight: 22,
  },
});
