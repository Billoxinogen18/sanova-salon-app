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

export default function SalonDetailScreen({ navigation, route }) {
  const { time } = route.params || {};
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleCall = () => {
    // Touch feedback animation
    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    
    // Handle call functionality
    console.log('Call salon');
  };

  const handleBookService = (service) => {
    navigation.navigate('DateTimeSelection', { service });
  };

  // Mock data with actual assets
  const salonData = {
    name: 'Gustav Salon',
    address: 'Frederiks Allé 28',
    rating: 4.8,
    heroImage: require('../../../assets/saloon.png'),
    services: [
      { name: "Women's Haircut", price: '350 kr' },
      { name: "Men's Haircut", price: '250 kr' },
      { name: "Hair Coloring", price: '450 kr' },
      { name: "Hair Styling", price: '200 kr' },
    ],
    photos: [
      require('../../../assets/saloon.png'),
      require('../../../assets/barber.png'),
      require('../../../assets/haircut.png'),
      require('../../../assets/manicure.png'),
    ],
  };

  return (
    <View style={styles.container}>
      {/* App Bar - Deep forest green, 76px height, rounded top corners */}
      <View style={styles.appBar}>
        <StatusBar barStyle="light-content" backgroundColor={colors.deepForestGreen} />
        
        {/* SANOVA Logo */}
        <View style={styles.logoContainer}>
          <Image source={require('../../../assets/icon.png')} style={styles.logoImage} />
          <Text style={styles.logoText}>SANOVA</Text>
        </View>
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
        {/* Hero Image - Full width, 30px top radius, 168px height */}
        <View style={styles.heroImageContainer}>
          <Image source={salonData.heroImage} style={styles.heroImage} />
        </View>

        {/* Main Salon Card Section - White background */}
        <View style={styles.salonCard}>
          {/* Salon Details Block */}
          <View style={styles.salonDetailsBlock}>
            {/* Salon Name - Playfair Display or Inter, bold, 24px */}
            <Text style={styles.salonName}>{salonData.name}</Text>
            
            {/* Salon Address - Inter, regular, 15px */}
            <Text style={styles.salonAddress}>{salonData.address}</Text>
            
            {/* Rating - Star icon with rating value */}
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color={colors.gold} style={styles.starIcon} />
              <Text style={styles.ratingText}>{salonData.rating}</Text>
            </View>
          </View>

          {/* Call Button - Top right in main card */}
          <TouchableOpacity style={styles.callButton} onPress={handleCall}>
            <Ionicons name="call" size={16} color={colors.darkGreen} style={styles.callIcon} />
            <Text style={styles.callText}>Call</Text>
          </TouchableOpacity>
        </View>

        {/* Services List Block */}
        <View style={styles.servicesSection}>
          <Text style={styles.servicesHeader}>Services</Text>
          
          {salonData.services.map((service, index) => (
            <TouchableOpacity
              key={index}
              style={styles.serviceRow}
              onPress={() => handleBookService(service)}
              activeOpacity={0.8}
            >
              <Text style={styles.serviceName}>{service.name}</Text>
              <Text style={styles.servicePrice}>{service.price}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Photos Section */}
        <View style={styles.photosSection}>
          <Text style={styles.photosHeader}>Photos from the Salon</Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.photosScrollView}
            contentContainerStyle={styles.photosContainer}
          >
            {salonData.photos.map((photo, index) => (
              <View key={index} style={styles.photoCard}>
                <Image source={photo} style={styles.photoImage} />
              </View>
            ))}
          </ScrollView>
        </View>
      </Animated.View>

      {/* Navigation Bar - Fixed height 63px, deep forest green */}
      <View style={styles.navigationBar}>
        <TouchableOpacity style={[styles.navItem, styles.activeNavItem]}>
          <Ionicons name="map" size={30} color={colors.white} />
          <Text style={styles.navLabel}>Map</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="storefront" size={24} color={colors.white} />
          <Text style={styles.navLabel}>Marketplace</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="flash" size={24} color={colors.white} />
          <Text style={styles.navLabel}>Urgent</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="calendar" size={24} color={colors.white} />
          <Text style={styles.navLabel}>Bookings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.warmCream, // Warm cream background
  },
  
  // App Bar - Deep forest green, 76px height, rounded top corners
  appBar: {
    height: 76,
    backgroundColor: colors.deepForestGreen,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  logoImage: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  
  logoText: {
    ...typography.logo,
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 2,
    color: colors.white,
  },
  
  content: {
    flex: 1,
  },
  
  // Hero Image - Full width, 30px top radius, 168px height
  heroImageContainer: {
    width: '100%',
    height: 168,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  
  // Main Salon Card Section - White background
  salonCard: {
    backgroundColor: colors.white,
    paddingHorizontal: 25, // 25px page side padding
    paddingTop: 22, // 22px margin-top below image
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  
  // Salon Details Block
  salonDetailsBlock: {
    flex: 1,
  },
  
  // Salon Name - Playfair Display or Inter, bold, 24px
  salonName: {
    fontFamily: 'Inter',
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.darkGreen,
    marginBottom: 4,
  },
  
  // Salon Address - Inter, regular, 15px
  salonAddress: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '400',
    color: colors.mutedGreen, // #22311F
    marginBottom: 8,
  },
  
  // Rating Container
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  // Star Icon - Gold, 14px wide, elevates 1px above address baseline
  starIcon: {
    marginRight: 4,
  },
  
  // Rating Text - Small bold font, gold color
  ratingText: {
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.gold,
  },
  
  // Call Button - Top right in main card
  callButton: {
    height: 38,
    width: 82,
    backgroundColor: colors.paleIvory, // #EFEEDF
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.deepForestGreen,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 7,
    elevation: 2,
  },
  
  callIcon: {
    marginRight: 8,
  },
  
  callText: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '500',
    color: colors.darkGreen,
  },
  
  // Services List Block
  servicesSection: {
    backgroundColor: colors.white,
    paddingHorizontal: 25,
    paddingTop: 23, // 23px margin-top below address/call row
    paddingBottom: 20,
  },
  
  // Services Header - Inter, bold, 20px
  servicesHeader: {
    fontFamily: 'Inter',
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.darkGreen,
    marginBottom: 11, // 11px top margin below Services header
  },
  
  // Service Row
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6, // 6px between rows
    minHeight: 48, // Minimum touch target
  },
  
  // Service Name - Inter, regular, 16px
  serviceName: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '400',
    color: colors.darkGreen,
  },
  
  // Service Price - Inter bold, 16px, right-aligned
  servicePrice: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.mutedGreen, // #6B7D46
  },
  
  // Photos Section
  photosSection: {
    backgroundColor: colors.white,
    paddingHorizontal: 25,
    paddingTop: 22, // 22px margin above
    paddingBottom: 20,
  },
  
  // Photos Header - Inter, bold, 18px
  photosHeader: {
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.darkGreen,
    marginBottom: 8, // 8px below for clear separation
  },
  
  photosScrollView: {
    marginTop: 8,
  },
  
  photosContainer: {
    paddingRight: 25,
  },
  
  // Photo Card - 70px square, 14px radius
  photoCard: {
    width: 70,
    height: 70,
    backgroundColor: colors.white,
    borderRadius: 14,
    marginRight: 12, // 12px horizontal between images
    shadowColor: colors.deepForestGreen,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  photoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
  },
  
  // Navigation Bar - Fixed height 63px, deep forest green
  navigationBar: {
    height: 63,
    backgroundColor: colors.deepForestGreen,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 8,
  },
  
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 48,
    minHeight: 48,
  },
  
  activeNavItem: {
    // Active state styling if needed
  },
  
  navLabel: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: colors.white,
    marginTop: 2,
  },
});