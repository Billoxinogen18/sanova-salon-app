import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, globalStyles } from '../../theme/styles';
import Header from '../../components/Header';

export default function DashboardScreen({ navigation }) {
  const upcomingBookings = [
    {
      id: 1,
      customer: 'Klara',
      service: "Women's Haircut",
      time: '14.00',
      avatar: '👩',
    },
  ];

  return (
    <View style={globalStyles.container}>
      <Header 
        rightIcon="person-circle-outline"
        onRightPress={() => {}}
      />
      
      <ScrollView style={styles.content}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Hello Glamorous Salon</Text>
          <Text style={styles.dateText}>Tuesday, May 7</Text>
        </View>

        <View style={styles.upcomingBookings}>
          <Text style={styles.sectionTitle}>Upcoming bookings</Text>
          {upcomingBookings.map((booking) => (
            <View key={booking.id} style={styles.bookingCard}>
              <Text style={styles.avatar}>{booking.avatar}</Text>
              <View style={styles.bookingInfo}>
                <Text style={styles.customerName}>{booking.customer}</Text>
                <Text style={styles.serviceName}>{booking.service}</Text>
              </View>
              <Text style={styles.bookingTime}>{booking.time} ></Text>
            </View>
          ))}
          <View style={styles.bookingFooter}>
            <Text style={styles.bookingFooterText}>1 day</Text>
            <Text style={styles.bookingFooterText}>1 dag</Text>
          </View>
        </View>

        <View style={styles.revenueSection}>
          <Text style={styles.sectionTitle}>Revenue Overview</Text>
          
          <View style={styles.revenueCard}>
            <Text style={styles.revenueLabel}>Today's revenue</Text>
            <Text style={styles.revenueAmount}>$250</Text>
          </View>

          <View style={styles.revenueStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>$1,100</Text>
              <Text style={styles.statLabel}>This week</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>$4,200</Text>
              <Text style={styles.statLabel}>This month</Text>
            </View>
          </View>

          <View style={styles.productsRevenue}>
            <Text style={styles.productsLabel}>Products</Text>
            <Text style={styles.productsAmount}>$45</Text>
            <Text style={styles.productsNote}>Click & collect fulfilled</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('NewBooking')}
          >
            <Ionicons name="calendar" size={24} color={colors.text.white} />
            <Text style={styles.actionButtonText}>Create New Booking</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('NewProduct')}
          >
            <Ionicons name="cart" size={24} color={colors.text.white} />
            <Text style={styles.actionButtonText}>Add Product</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  upcomingBookings: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  bookingCard: {
    backgroundColor: colors.background.white,
    borderRadius: 12,
    padding: 16,
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
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  bookingFooterText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  revenueSection: {
    marginBottom: 24,
  },
  revenueCard: {
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
  revenueLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  revenueAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  revenueStats: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  statItem: {
    flex: 1,
    backgroundColor: colors.background.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  productsRevenue: {
    backgroundColor: colors.background.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productsLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  productsAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  productsNote: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: colors.text.white,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});
