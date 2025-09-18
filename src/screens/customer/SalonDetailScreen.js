import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, globalStyles } from '../../theme/styles';
import Header from '../../components/Header';

export default function SalonDetailScreen({ navigation, route }) {
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

  // Salon services exactly as shown in design
  const salonServices = [
    { id: 1, name: "Men's Haircut", price: '400 kr', emoji: '👨' },
    { id: 2, name: "Women's Haircut", price: '500 kr', emoji: '👩' },
    { id: 3, name: 'Hair Coloring', price: '600 kr', emoji: '🎨' },
    { id: 4, name: 'Manicure', price: '200 kr', emoji: '💅' },
    { id: 5, name: 'Pedicure', price: '250 kr', emoji: '🦶' },
  ];

  // Salon photos exactly as shown in design
  const salonPhotos = [
    { id: 1, emoji: '🏪' },
    { id: 2, emoji: '💇‍♀️' },
    { id: 3, emoji: '💅' },
    { id: 4, emoji: '✨' },
  ];

  const handleCallSalon = () => {
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
    ]).start();
  };

  const renderService = ({ item }) => (
    <TouchableOpacity 
      style={styles.serviceCard}
      onPress={() => navigation.navigate('ServiceDetail', { service: item })}
      activeOpacity={0.8}
    >
      <View style={styles.serviceIcon}>
        <Text style={styles.serviceEmoji}>{item.emoji}</Text>
      </View>
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceName}>{item.name}</Text>
        <Text style={styles.servicePrice}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderPhoto = ({ item }) => (
    <View style={styles.photoCard}>
      <Text style={styles.photoEmoji}>{item.emoji}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header with dark green background exactly as in design */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SANOVA</Text>
        <TouchableOpacity style={styles.callButton} onPress={handleCallSalon}>
          <Ionicons name="call" size={24} color={colors.text.white} />
        </TouchableOpacity>
      </View>
      
      <Animated.ScrollView 
        style={[styles.content, { opacity: fadeAnim }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Large salon image - exactly as shown in design */}
        <View style={styles.imageContainer}>
          <View style={styles.salonImage}>
            <Text style={styles.salonEmoji}>🏪</Text>
          </View>
        </View>

        {/* Salon Info - exactly as shown in design */}
        <View style={styles.salonInfo}>
          <Text style={styles.salonName}>Gustav Salon</Text>
          <Text style={styles.salonAddress}>Frederiks Alle 28, Copenhagen</Text>
          <Text style={styles.salonHours}>Åben 9:00 - 18:00</Text>
        </View>

        {/* Services Section - exactly as shown in design */}
        <View style={styles.servicesSection}>
          <Text style={styles.sectionTitle}>Tjenester</Text>
          <FlatList
            data={salonServices}
            renderItem={renderService}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        </View>

        {/* Photos Section - exactly as shown in design */}
        <View style={styles.photosSection}>
          <Text style={styles.sectionTitle}>Billeder fra salonen</Text>
          <FlatList
            data={salonPhotos}
            renderItem={renderPhoto}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.photosList}
          />
        </View>

        {/* Contact Section - exactly as shown in design */}
        <View style={styles.contactSection}>
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity 
              style={styles.callSalonButton}
              onPress={handleCallSalon}
              activeOpacity={0.9}
            >
              <Ionicons name="call" size={20} color={colors.text.white} />
              <Text style={styles.callSalonText}>Ring til salon</Text>
            </TouchableOpacity>
          </Animated.View>
          
          <TouchableOpacity style={styles.directionsButton} activeOpacity={0.8}>
            <Ionicons name="location" size={20} color={colors.primary} />
            <Text style={styles.directionsText}>Få vejvisning</Text>
          </TouchableOpacity>
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
  callButton: {
    padding: 8,
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
  salonImage: {
    flex: 1,
    backgroundColor: colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  salonEmoji: {
    fontSize: 80,
  },
  salonInfo: {
    padding: 20,
  },
  salonName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  salonAddress: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  salonHours: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  servicesSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  serviceCard: {
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
  serviceIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  serviceEmoji: {
    fontSize: 20,
  },
  serviceInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  photosSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  photosList: {
    flexDirection: 'row',
  },
  photoCard: {
    width: 80,
    height: 80,
    backgroundColor: colors.background.white,
    borderRadius: 12,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  photoEmoji: {
    fontSize: 30,
  },
  contactSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  callSalonButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  callSalonText: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  directionsButton: {
    flex: 1,
    backgroundColor: colors.background.white,
    borderWidth: 2,
    borderColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  directionsText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});