import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { globalStyles } from '../../theme/styles';
import { firestoreService } from '../../services/firebaseService';
import { auth } from '../../../firebaseconfig';

export default function PaymentHistoryScreen({ navigation }) {
  // Sample payment data for demonstration
  const [payments, setPayments] = useState([
    {
      id: '1',
      salonName: 'Gustav Salon',
      serviceName: 'Classic Manicure',
      amount: '200 kr',
      date: '25. april 2024',
      time: '11:00',
      status: 'paid',
      paymentMethod: 'Credit Card'
    },
    {
      id: '2',
      salonName: 'Beauty Studio',
      serviceName: 'Hair Cut & Style',
      amount: '350 kr',
      date: '20. april 2024',
      time: '14:30',
      status: 'paid',
      paymentMethod: 'Apple Pay'
    },
    {
      id: '3',
      salonName: 'Nail Art Center',
      serviceName: 'Gel Manicure',
      amount: '280 kr',
      date: '15. april 2024',
      time: '10:15',
      status: 'paid',
      paymentMethod: 'MobilePay'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (user) {
        // Get payments from bookings
        const userBookingsResult = await firestoreService.bookings.getByUserId(user.uid);
        const userBookings = userBookingsResult?.success ? userBookingsResult.data : [];
        const completedBookings = userBookings?.filter(booking => 
          booking.status === 'completed' || booking.status === 'confirmed'
        ) || [];
        
        // Transform bookings to payment format
        const paymentData = completedBookings.map(booking => ({
          id: booking.id,
          amount: booking.price,
          date: booking.date,
          time: booking.time,
          salonName: booking.salonName,
          serviceName: booking.serviceName,
          status: booking.status === 'completed' ? 'paid' : 'pending',
          paymentMethod: 'Card', // Default for now
          bookingId: booking.id,
        }));
        
        setPayments(paymentData);
      }
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPayments();
    setRefreshing(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return colors.success;
      case 'pending': return colors.warning;
      case 'failed': return colors.error;
      case 'refunded': return colors.text.secondary;
      default: return colors.text.secondary;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid': return 'checkmark-circle';
      case 'pending': return 'time';
      case 'failed': return 'close-circle';
      case 'refunded': return 'refresh-circle';
      default: return 'help-circle';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('da-DK', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      return dateString;
    }
  };

  const renderPaymentItem = ({ item }) => (
    <TouchableOpacity style={styles.paymentCard} activeOpacity={0.8}>
      {/* Transaction header */}
      <View style={styles.transactionHeader}>
        <Text style={styles.transactionSalon}>{item.salonName || 'Gustav Salon'}</Text>
        <Text style={styles.transactionAmount}>{item.amount || '200 kr'}</Text>
      </View>
      
      {/* Service info */}
      <Text style={styles.transactionService}>{item.serviceName || 'Classic Manicure'}</Text>
      
      {/* Date and time */}
      <View style={styles.transactionDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color="#626463" />
          <Text style={styles.detailText}>{item.date || '25. april 2024'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={16} color="#626463" />
          <Text style={styles.detailText}>{item.time || '11:00'}</Text>
        </View>
      </View>
      
      {/* Status badge */}
      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
        <Ionicons 
          name={getStatusIcon(item.status)} 
          size={14} 
          color="#FFFFFF" 
        />
        <Text style={styles.statusText}>{item.status === 'paid' ? 'Completed' : item.status}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="card-outline" size={64} color="#626463" />
      <Text style={styles.emptyTitle}>No Payments Yet</Text>
      <Text style={styles.emptySubtitle}>
        Your payment history will appear here once you complete your first booking.
      </Text>
      <TouchableOpacity 
        style={styles.exploreButton}
        onPress={() => navigation.navigate('Map')}
        activeOpacity={0.9}
      >
        <Text style={styles.exploreButtonText}>Book a Service</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#213527" />
      
      {/* Header - Deep green (#213527) - Same as other screens */}
      <View style={styles.header}>
        {/* Back button - Left side */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        {/* Logo Leaf & SANOVA - Centered */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../../assets/logo.png')}
            style={styles.logoIcon}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>SANOVA</Text>
        </View>
        
        {/* Placeholder for balance */}
        <View style={styles.placeholder} />
      </View>

      {/* Main Card - Very light cream (#FAF6EC) */}
      <View style={styles.mainCard}>
        {/* Title - "Payment History", 25px, weight 700, #223527 */}
        <Text style={styles.sectionTitle}>Payment History</Text>
        
        {/* Payments List */}
        <FlatList
          data={payments}
          renderItem={renderPaymentItem}
          keyExtractor={(item) => item.id || item.bookingId || Math.random().toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#213527"]}
              tintColor="#213527"
            />
          }
          ListEmptyComponent={!loading ? renderEmptyState : null}
        />
      </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  backButton: {
    padding: 8,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  logoIcon: {
    width: 36,
    height: 22,
    marginBottom: 6,
  },
  headerTitle: {
    fontSize: 25,
    fontFamily: 'System',
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  
  // Main Card - Very light cream (#FAF6EC)
  mainCard: {
    backgroundColor: '#FAF6EC',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    width: '100%',
    flex: 1,
    paddingHorizontal: 26,
    paddingTop: 38,
  },
  
  // Title - "Payment History", 25px, weight 700, #223527
  sectionTitle: {
    fontSize: 25,
    fontWeight: '700',
    color: '#223527',
    marginBottom: 32,
  },
  
  listContainer: {
    paddingBottom: 40,
    flexGrow: 1,
  },
  
  // Payment Card - 375px width, white background, 18px radius
  paymentCard: {
    width: 375,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 16,
    alignSelf: 'center',
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 11,
  },
  
  // Transaction header - Salon name and amount
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  // Transaction salon - "Gustav Salon", 18px, weight 700, #223527
  transactionSalon: {
    fontSize: 18,
    fontWeight: '700',
    color: '#223527',
  },
  
  // Transaction amount - "200 kr", 18px, weight 600, #223527
  transactionAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#223527',
  },
  
  // Transaction service - "Classic Manicure", 15px, #626463
  transactionService: {
    fontSize: 15,
    color: '#626463',
    marginBottom: 12,
  },
  
  // Transaction details section
  transactionDetails: {
    marginBottom: 16,
  },
  
  // Detail row - Icon + text
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  
  // Detail text - 14px, #626463
  detailText: {
    fontSize: 14,
    color: '#626463',
    marginLeft: 8,
  },
  
  // Status badge - Right-aligned, colored background
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  
  // Status text - 13px, weight 500, white
  statusText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#FFFFFF',
    marginLeft: 6,
    textTransform: 'capitalize',
  },
  
  // Empty state styling
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#223527',
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#626463',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  exploreButton: {
    width: 200,
    height: 48,
    backgroundColor: '#163A24',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exploreButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
