import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Header from '../components/Header';
import BookingCard from '../components/BookingCard';

const BookingsPage = () => {
  const [searchText, setSearchText] = useState('');

  const upcomingBookings = [
    {
      id: 1,
      serviceName: 'Haircut & Styling',
      salonName: 'Salon Elegance',
      address: 'Strøget 15, 1160 København',
      time: 'Today, 14:30',
      actionText: 'Se detaljer',
    },
    {
      id: 2,
      serviceName: 'Color Treatment',
      salonName: 'Hair Studio',
      address: 'Nørrebrogade 42, 2200 København',
      time: 'Tomorrow, 10:00',
      actionText: 'Se detaljer',
    },
  ];

  const pastBookings = [
    {
      id: 3,
      serviceName: 'Hair Wash & Blow Dry',
      salonName: 'Beauty Lounge',
      address: 'Vesterbrogade 8, 1620 København',
      time: 'Last week',
      actionText: 'Book igen',
    },
    {
      id: 4,
      serviceName: 'Manicure & Pedicure',
      salonName: 'Nail Art Studio',
      address: 'Østerbrogade 25, 2100 København',
      time: '2 weeks ago',
      actionText: 'Book igen',
    },
  ];

  const handleActionPress = (bookingId: number, action: string) => {
    console.log(`${action} pressed for booking ${bookingId}`);
  };

  return (
    <View style={styles.container}>
      <Header />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.mainTitle}>Mine Bookinger</Text>
        
        {/* Upcoming Bookings Section */}
        <Text style={styles.sectionTitle}>Kommende Bookinger</Text>
        {upcomingBookings.map((booking) => (
          <View key={booking.id} style={styles.cardContainer}>
            <BookingCard
              serviceName={booking.serviceName}
              salonName={booking.salonName}
              address={booking.address}
              time={booking.time}
              actionText={booking.actionText}
              onActionPress={() => handleActionPress(booking.id, booking.actionText)}
            />
          </View>
        ))}

        {/* Past Bookings Section */}
        <Text style={styles.sectionTitle}>Tidligere Bookinger</Text>
        {pastBookings.map((booking) => (
          <View key={booking.id} style={styles.cardContainer}>
            <BookingCard
              serviceName={booking.serviceName}
              salonName={booking.salonName}
              address={booking.address}
              time={booking.time}
              actionText={booking.actionText}
              onActionPress={() => handleActionPress(booking.id, booking.actionText)}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#232D1E',
    fontFamily: 'Inter',
    marginTop: 22,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#232D1E',
    fontFamily: 'Inter',
    marginTop: 18,
    marginBottom: 12,
  },
  cardContainer: {
    alignItems: 'center',
  },
});

export default BookingsPage;