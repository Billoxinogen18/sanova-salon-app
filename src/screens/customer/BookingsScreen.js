import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar,
  Animated 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export default function BookingsScreen({ navigation }) {
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
  }, []);

  const upcomingBookings = [
    {
      id: 1,
      serviceName: 'Hair Cut & Style',
      salonName: 'Nordic Beauty Salon',
      address: 'Reykjavik, Iceland',
      time: 'Today, 2:00 PM',
      icon: 'cut'
    },
    {
      id: 2,
      serviceName: 'Manicure & Pedicure',
      salonName: 'Icelandic Style',
      address: 'Reykjavik, Iceland',
      time: 'Tomorrow, 10:00 AM',
      icon: 'hand-left'
    }
  ];

  const pastBookings = [
    {
      id: 3,
      serviceName: 'Facial Treatment',
      salonName: 'Arctic Glow Spa',
      address: 'Reykjavik, Iceland',
      time: 'Last week',
      icon: 'sparkles'
    },
    {
      id: 4,
      serviceName: 'Eyebrow Shaping',
      salonName: 'Scandinavian Beauty',
      address: 'Reykjavik, Iceland',
      time: '2 weeks ago',
      icon: 'eye'
    }
  ];

  const handleBookingPress = (booking) => {
    // Navigate to booking details
    console.log('Booking pressed:', booking);
  };

  const handleActionPress = (booking, action) => {
    // Button press animation
    const buttonScale = new Animated.Value(1);
    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.9, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start(() => {
      if (action === 'details') {
        // Navigate to booking details
        console.log('View details:', booking);
      } else if (action === 'book_again') {
        // Navigate to booking flow
        console.log('Book again:', booking);
      }
    });
  };

  const renderBookingCard = (booking, isUpcoming = true) => (
    <TouchableOpacity 
      key={booking.id}
      style={styles.bookingCard}
      onPress={() => handleBookingPress(booking)}
      activeOpacity={0.9}
    >
      <View style={styles.bookingIconContainer}>
        <Ionicons name={booking.icon} size={28} color={colors.text.primary} />
      </View>
      <View style={styles.bookingInfo}>
        <Text style={styles.serviceName}>{booking.serviceName}</Text>
        <Text style={styles.salonName}>{booking.salonName}</Text>
        <Text style={styles.salonAddress}>{booking.address}</Text>
        <Text style={styles.bookingTime}>{booking.time}</Text>
      </View>
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => handleActionPress(booking, isUpcoming ? 'details' : 'book_again')}
        activeOpacity={0.7} // Button darkens by 10% on tap as specified
      >
        <Text style={styles.actionButtonText}>
          {isUpcoming ? 'Se detaljer' : 'Book igen'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      {/* Header Bar - Forest Green with Logo */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="leaf" size={20} color={colors.background.white} />
          <Ionicons name="leaf" size={20} color={colors.background.white} style={{ marginLeft: -8 }} />
        </View>
        <Text style={styles.headerTitle}>SANOVA</Text>
      </View>
      
      <View style={styles.content}>
        {/* Main Header */}
        <Text style={styles.mainHeader}>Mine Bookinger</Text>

        <ScrollView 
          style={styles.bookingsContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.bookingsContent}
        >
          {/* Upcoming Bookings Section */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Kommende Bookinger</Text>
            {upcomingBookings.map(booking => renderBookingCard(booking, true))}
          </View>

          {/* Past Bookings Section */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Tidligere Bookinger</Text>
            {pastBookings.map(booking => renderBookingCard(booking, false))}
          </View>
        </ScrollView>
      </View>
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
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.background.white,
    fontFamily: 'serif',
    letterSpacing: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: colors.background.primary,
    paddingTop: 22, // 22px top margin as specified
  },
  mainHeader: {
    fontSize: 22, // 22px as specified
    fontWeight: 'bold',
    color: colors.text.primary, // #232D1E as specified
    marginBottom: 24,
    fontFamily: 'Inter',
  },
  bookingsContainer: {
    flex: 1,
  },
  bookingsContent: {
    paddingBottom: 100, // Extra padding for bottom navigation
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    fontSize: 16, // 16px as specified
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 18, // 18px margin top/bottom as specified
    fontFamily: 'Inter',
  },
  bookingCard: {
    backgroundColor: colors.background.white,
    borderRadius: 13, // 13px radius as specified
    padding: 16,
    marginBottom: 18, // 18px vertical gap as specified
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2, // Y2px as specified
    },
    shadowOpacity: 0.14, // 14% opacity as specified
    shadowRadius: 10, // blur=10px as specified
    elevation: 2,
  },
  bookingIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  bookingInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16, // 16px as specified
    fontWeight: 'bold',
    color: colors.text.primary, // #232D1E as specified
    marginBottom: 6, // 6px vertical spacing as specified
  },
  salonName: {
    fontSize: 13, // 13px as specified
    fontWeight: '500',
    color: colors.text.secondary,
    marginBottom: 6, // 6px vertical spacing as specified
  },
  salonAddress: {
    fontSize: 13, // 13px as specified
    fontWeight: '500',
    color: colors.text.secondary,
    marginBottom: 6, // 6px vertical spacing as specified
  },
  bookingTime: {
    fontSize: 12, // 12px as specified
    color: colors.text.muted,
  },
  actionButton: {
    backgroundColor: colors.background.white, // #F8F6EC as specified
    height: 32, // 32px height as specified
    paddingHorizontal: 22, // 22px horizontal padding as specified
    borderRadius: 16, // Pill shape
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  actionButtonText: {
    fontSize: 13, // 13px as specified
    fontWeight: '600',
    color: colors.text.primary, // #1C3521 as specified
    letterSpacing: 0.5,
    fontFamily: 'Inter',
  },
});