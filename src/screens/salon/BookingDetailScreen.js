import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Animated,
  Dimensions,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const { width } = Dimensions.get('window');

export default function BookingDetailScreen({ navigation, route }) {
  const { booking } = route.params || {};
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Mock booking data
  const bookingData = booking || {
    id: '1',
    clientName: 'Klara Jenkins',
    service: "Women's Haircut",
    date: 'Today',
    time: '14:00',
    duration: '45 min',
    price: '350 kr',
    status: 'confirmed',
    phone: '+45 20 12 34 56',
    notes: 'Regular haircut with styling',
  };

  const handleEditBooking = () => {
    // Navigate to edit booking screen
    console.log('Edit booking');
  };

  const handleCancelBooking = () => {
    // Handle booking cancellation
    console.log('Cancel booking');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <StatusBar barStyle="light-content" backgroundColor={colors.deepForestGreen} />
        
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        
        <View style={styles.logoContainer}>
          <Image source={require('../../../assets/logo.png')} style={styles.logoImage} />
          <Text style={styles.logoText}>SANOVA</Text>
        </View>
        
        <TouchableOpacity style={styles.editButton} onPress={handleEditBooking}>
          <Ionicons name="create-outline" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Booking Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Text style={styles.statusTitle}>Booking Details</Text>
            <View style={[styles.statusBadge, { backgroundColor: colors.lightGreen }]}>
              <Text style={styles.statusText}>Confirmed</Text>
            </View>
          </View>
        </View>

        {/* Client Information */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Client Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name:</Text>
            <Text style={styles.infoValue}>{bookingData.clientName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone:</Text>
            <Text style={styles.infoValue}>{bookingData.phone}</Text>
          </View>
        </View>

        {/* Service Information */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Service Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Service:</Text>
            <Text style={styles.infoValue}>{bookingData.service}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date:</Text>
            <Text style={styles.infoValue}>{bookingData.date}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Time:</Text>
            <Text style={styles.infoValue}>{bookingData.time}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Duration:</Text>
            <Text style={styles.infoValue}>{bookingData.duration}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Price:</Text>
            <Text style={styles.infoValue}>{bookingData.price}</Text>
          </View>
        </View>

        {/* Notes */}
        {bookingData.notes && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.notesText}>{bookingData.notes}</Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.editButton} onPress={handleEditBooking}>
            <Text style={styles.editButtonText}>Edit Booking</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancelBooking}>
            <Text style={styles.cancelButtonText}>Cancel Booking</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.warmCream,
  },
  
  header: {
    height: 76,
    backgroundColor: colors.deepForestGreen,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  logoImage: {
    width: 24,
    height: 24,
    marginRight: 8,
    tintColor: colors.white,
  },
  
  logoText: {
    ...typography.logo,
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 2,
    color: colors.white,
  },
  
  editButton: {
    padding: 8,
  },
  
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  
  statusCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: colors.deepForestGreen,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  statusTitle: {
    ...typography.title2,
    color: colors.darkGreen,
  },
  
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  
  statusText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '600',
  },
  
  sectionCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: colors.deepForestGreen,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  
  sectionTitle: {
    ...typography.title3,
    color: colors.darkGreen,
    marginBottom: 16,
  },
  
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  infoLabel: {
    ...typography.body,
    color: colors.mutedGreen,
  },
  
  infoValue: {
    ...typography.body,
    color: colors.darkGreen,
    fontWeight: '600',
  },
  
  notesText: {
    ...typography.body,
    color: colors.darkGreen,
    lineHeight: 22,
  },
  
  actionButtons: {
    marginTop: 20,
    marginBottom: 40,
  },
  
  editButton: {
    backgroundColor: colors.deepForestGreen,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  
  editButtonText: {
    ...typography.button,
    color: colors.white,
  },
  
  cancelButton: {
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  
  cancelButtonText: {
    ...typography.button,
    color: colors.darkGreen,
  },
});
