import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, globalStyles } from '../../theme/styles';
import Header from '../../components/Header';

const bookings = [
  {
    id: 1,
    customer: 'Klara Jenkins',
    service: "Women's Haircut",
    time: '2.00',
    avatar: '👩',
  },
  {
    id: 2,
    customer: 'Mark Howard',
    service: 'Beard Trim',
    time: '3.00',
    avatar: '👨',
  },
  {
    id: 3,
    customer: 'Emma Wilson',
    service: 'Manicure',
    time: '4.00',
    avatar: '👩',
  },
  {
    id: 4,
    customer: 'Sarah Johnson',
    service: 'Hair Coloring',
    time: '5.00',
    avatar: '👩',
  },
];

export default function BookingsScreen({ navigation }) {
  const renderBooking = ({ item }) => (
    <View style={styles.bookingCard}>
      <Text style={styles.avatar}>{item.avatar}</Text>
      <View style={styles.bookingInfo}>
        <Text style={styles.customerName}>{item.customer}</Text>
        <Text style={styles.serviceName}>{item.service}</Text>
      </View>
      <Text style={styles.bookingTime}>{item.time}</Text>
    </View>
  );

  return (
    <View style={globalStyles.container}>
      <Header 
        title="Bookings" 
        rightIcon="add"
        onRightPress={() => navigation.navigate('NewBooking')}
      />
      
      <View style={styles.content}>
        <Text style={styles.dateText}>Tuesday, May 7</Text>
        
        <FlatList
          data={bookings}
          renderItem={renderBooking}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  dateText: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  bookingCard: {
    backgroundColor: colors.background.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
});
