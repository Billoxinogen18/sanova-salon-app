import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { globalStyles } from '../../theme/styles';
import { firestoreService } from '../../services/firebaseService';
import { auth } from '../../firebaseconfig';

export default function PaymentHistoryScreen({ navigation }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
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
        const userBookings = await firestoreService.bookings.getByUserId(user.uid);
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
    <TouchableOpacity style={styles.paymentCard}>
      <View style={styles.paymentHeader}>
        <View style={styles.paymentInfo}>
          <Text style={styles.salonName}>{item.salonName || 'Salon'}</Text>
          <Text style={styles.serviceName}>{item.serviceName || 'Service'}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Ionicons 
            name={getStatusIcon(item.status)} 
            size={16} 
            color={colors.background.white} 
          />
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      
      <View style={styles.paymentDetails}>
        <View style={styles.amountRow}>
          <Text style={styles.amountLabel}>Amount:</Text>
          <Text style={styles.amountValue}>{item.amount || 'N/A'}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="calendar" size={16} color={colors.text.secondary} />
          <Text style={styles.detailText}>{formatDate(item.date)}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="time" size={16} color={colors.text.secondary} />
          <Text style={styles.detailText}>{item.time || 'N/A'}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="card" size={16} color={colors.text.secondary} />
          <Text style={styles.detailText}>{item.paymentMethod || 'Card'}</Text>
        </View>
      </View>
      
      {item.status === 'paid' && (
        <View style={styles.receiptButton}>
          <Ionicons name="receipt" size={16} color={colors.primary} />
          <Text style={styles.receiptButtonText}>Receipt Available</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="card-outline" size={64} color={colors.text.secondary} />
      <Text style={styles.emptyTitle}>No Payments Yet</Text>
      <Text style={styles.emptySubtitle}>
        Your payment history will appear here once you complete your first booking.
      </Text>
      <TouchableOpacity 
        style={styles.exploreButton}
        onPress={() => navigation.navigate('Map')}
      >
        <Text style={styles.exploreButtonText}>Book a Service</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={globalStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.background.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment History</Text>
        <View style={styles.placeholder} />
      </View>

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
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={!loading ? renderEmptyState : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.background.white,
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  listContainer: {
    padding: 20,
    flexGrow: 1,
  },
  paymentCard: {
    backgroundColor: colors.background.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  salonName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.background.white,
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  paymentDetails: {
    marginBottom: 12,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.primary,
  },
  amountLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
  },
  amountValue: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginLeft: 8,
  },
  receiptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: colors.background.secondary,
  },
  receiptButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.primary,
    marginLeft: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  exploreButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.background.white,
  },
});
