import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, globalStyles } from '../../theme/styles';
import Header from '../../components/Header';

export default function BookingsScreen({ navigation }) {
  const [fadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    // Fade in animation when screen loads
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  // Upcoming bookings exactly as shown in design
  const upcomingBookings = [
    {
      id: 1,
      service: 'Classic Manicure',
      salon: 'Gustav Salon',
      address: 'Frederiks Alle 28',
      date: 'I dag kl. 11:00',
      status: 'confirmed',
      icon: '💅',
    },
  ];

  // Previous bookings exactly as shown in design
  const previousBookings = [
    {
      id: 2,
      service: 'Haircut',
      salon: 'Hair Studio',
      address: 'Borgergade 14',
      date: '15. apr. 2024',
      status: 'completed',
      icon: '✂️',
      canBook: true,
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header with dark green background exactly as in design */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="leaf" size={24} color={colors.text.white} />
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
          {upcomingBookings.map((booking) => (
            <View key={booking.id} style={styles.bookingCard}>
              <View style={styles.bookingIcon}>
                <Text style={styles.iconText}>{booking.icon}</Text>
              </View>
              <View style={styles.bookingInfo}>
                <Text style={styles.serviceName}>{booking.service}</Text>
                <Text style={styles.salonName}>{booking.salon} - {booking.address}</Text>
                <Text style={styles.bookingDate}>{booking.date}</Text>
              </View>
              <TouchableOpacity style={styles.detailsButton} activeOpacity={0.8}>
                <Text style={styles.detailsButtonText}>Se detaljer</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Previous Bookings Section - exactly as shown in design */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tidligere Bookinger</Text>
          {previousBookings.map((booking) => (
            <View key={booking.id} style={styles.bookingCard}>
              <View style={styles.bookingIcon}>
                <Text style={styles.iconText}>{booking.icon}</Text>
              </View>
              <View style={styles.bookingInfo}>
                <Text style={styles.serviceName}>{booking.service}</Text>
                <Text style={styles.salonName}>{booking.salon} - {booking.address}</Text>
                <Text style={styles.bookingDate}>{booking.date}</Text>
              </View>
              <View style={styles.actionButtons}>
                {booking.canBook && (
                  <TouchableOpacity style={styles.bookAgainButton} activeOpacity={0.8}>
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
});