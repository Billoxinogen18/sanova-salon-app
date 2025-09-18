import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, globalStyles } from '../../theme/styles';
import Header from '../../components/Header';

export default function ServiceDetailScreen({ navigation, route }) {
  const { service } = route.params || {
    service: {
      name: 'Classic Manicure',
      salon: 'Gustav Salon',
      date: 'Today, 11:00 AM',
      price: '200 kr',
      address: 'Frederiks Alle 28',
      description: 'A classic manicure includes nail shaping, cuticle care, and polish application.',
    }
  };

  const [fadeAnim] = useState(new Animated.Value(0));
  const [buttonScale] = useState(new Animated.Value(1));

  React.useEffect(() => {
    // Fade in animation when screen loads
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleBookNow = () => {
    // Animate button press
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.navigate('BookingFlow', { service });
    });
  };

  return (
    <View style={styles.container}>
      {/* Header with dark green background exactly as in design */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SANOVA</Text>
        <View style={styles.placeholder} />
      </View>
      
      <Animated.ScrollView 
        style={[styles.content, { opacity: fadeAnim }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Large service image - exactly as shown in design */}
        <View style={styles.imageContainer}>
          <View style={styles.serviceImage}>
            {/* This would be a real image in production */}
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imageText}>Service Image</Text>
            </View>
          </View>
        </View>

        {/* Service Details - exactly as shown in design */}
        <View style={styles.detailsContainer}>
          <Text style={styles.serviceName}>{service.name}</Text>
          <Text style={styles.salonName}>{service.salon}</Text>
          <Text style={styles.dateTime}>{service.date}</Text>
          <Text style={styles.price}>{service.price}</Text>
          
          {/* Address with directions - exactly as shown in design */}
          <View style={styles.addressContainer}>
            <Ionicons name="location-outline" size={16} color={colors.text.primary} />
            <Text style={styles.address}>{service.address}</Text>
          </View>
          
          <TouchableOpacity style={styles.directionsButton} activeOpacity={0.8}>
            <Text style={styles.directionsText}>Directions</Text>
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>

      {/* Book Now Button - exactly as shown in design */}
      <View style={styles.bookButtonContainer}>
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity 
            style={styles.bookButton}
            onPress={handleBookNow}
            activeOpacity={0.9}
          >
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        </Animated.View>
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
    color: colors.text.white,
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    height: 250,
    backgroundColor: colors.background.white,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceImage: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 8,
    padding: 20,
  },
  imageText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  detailsContainer: {
    padding: 20,
  },
  serviceName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  salonName: {
    fontSize: 18,
    color: colors.text.primary,
    marginBottom: 8,
  },
  dateTime: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 12,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  address: {
    fontSize: 14,
    color: colors.text.primary,
    marginLeft: 8,
    flex: 1,
  },
  directionsButton: {
    alignSelf: 'flex-start',
  },
  directionsText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  bookButtonContainer: {
    padding: 20,
    backgroundColor: colors.background.primary,
  },
  bookButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookButtonText: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
