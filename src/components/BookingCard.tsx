import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface BookingCardProps {
  serviceName: string;
  salonName: string;
  address: string;
  time: string;
  actionText: string;
  onActionPress: () => void;
}

const BookingCard: React.FC<BookingCardProps> = ({
  serviceName,
  salonName,
  address,
  time,
  actionText,
  onActionPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name="content-cut" size={28} color="#1C3521" />
      </View>
      
      <View style={styles.detailsContainer}>
        <Text style={styles.serviceName}>{serviceName}</Text>
        <Text style={styles.salonInfo}>{salonName}</Text>
        <Text style={styles.address}>{address}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>
      
      <TouchableOpacity style={styles.actionButton} onPress={onActionPress}>
        <Text style={styles.actionText}>{actionText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '94%',
    height: 72,
    backgroundColor: '#FFFFFF',
    borderRadius: 13,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 12,
    shadowColor: '#1C3521',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 3,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F6EC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#232D1E',
    fontFamily: 'Inter',
    marginBottom: 2,
  },
  salonInfo: {
    fontSize: 13,
    fontWeight: '500',
    color: '#667A6E',
    fontFamily: 'Inter',
    marginBottom: 2,
  },
  address: {
    fontSize: 13,
    color: '#667A6E',
    fontFamily: 'Inter',
    marginBottom: 2,
  },
  time: {
    fontSize: 12,
    color: '#999999',
    fontFamily: 'Inter',
  },
  actionButton: {
    height: 32,
    paddingHorizontal: 22,
    backgroundColor: '#F8F6EC',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1C3521',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C3521',
    fontFamily: 'Inter',
    letterSpacing: 0.5,
  },
});

export default BookingCard;