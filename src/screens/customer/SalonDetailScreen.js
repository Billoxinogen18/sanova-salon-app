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
  const { salon, time } = route.params || {};
  
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

  // Use passed salon data or fallback to mock data
  const salonData = salon || {
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

  // Ensure images are properly formatted
  const heroImage = typeof salonData.heroImage === 'string' 
    ? { uri: salonData.heroImage } 
    : salonData.heroImage || require('../../../assets/saloon.png');
    
  const photos = salonData.photos ? salonData.photos.map(photo => 
    typeof photo === 'string' ? { uri: photo } : photo
  ) : [
    require('../../../assets/saloon.png'),
    require('../../../assets/barber.png'),
    require('../../../assets/haircut.png'),
    require('../../../assets/manicure.png'),
  ];

  // Helper function to get salon images based on specifications
  const getSalonImage = () => {
    const salonName = salonData.name || '';
    if (salonName.toLowerCase().includes('barber') || salonName.toLowerCase().includes('men')) {
      return require('../../../assets/barber.png');
    }
    return require('../../../assets/saloon.png'); // Default salon image
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor="#213527" />
      
      {/* Header Section - Deep green (#213527) - 111px height */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        {/* Logo Leaf & SANOVA - Centered horizontally and vertically */}
        <View style={styles.logoContainer}>
          {/* Leaf SVG - 38px width, 21px height, 16px from top header edge */}
          {/* Logo - Same dimensions as other screens */}
          <Image 
            source={require('../../../assets/logo.png')}
            style={styles.logoIcon}
            resizeMode="contain"
          />
          {/* SANOVA text - 26px, uppercase serif, white, letter-spacing 2px, 8px below icon */}
          <Text style={styles.headerTitle}>SANOVA</Text>
        </View>
      </Animated.View>
      
      {/* Main Card Salon Details - Cream (#FAF6EC) */}
      <Animated.View 
        style={[
          styles.mainCard,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        {/* Salon Image Section - Full width, 196px height, top corners 32px radius */}
        <View style={styles.salonImageSection}>
          <Image source={getSalonImage()} style={styles.salonImage} resizeMode="cover" />
        </View>

        {/* Salon Title Row - 22px below image */}
        <View style={styles.salonTitleRow}>
          <View style={styles.salonDetailsBlock}>
            {/* Title - "Gustav Salon", left-aligned, 27px, weight 700, #1A1A1A */}
            <Text style={styles.salonName}>{salonData.name || 'Gustav Salon'}</Text>
            {/* Address Row - "Frederiks Allé 28", 17px, weight 400, #3F4143, 7px below title */}
            <Text style={styles.salonAddress}>{salonData.address || 'Frederiks Allé 28'}</Text>
            {/* Star Rating - star icon 18px, #FEBC45, rating value 4,8, 15px, #6A6A6A */}
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={18} color="#FEBC45" style={styles.starIcon} />
              <Text style={styles.ratingText}>{salonData.rating || '4,8'}</Text>
            </View>
          </View>

          {/* Call Button - Right-aligned, 102x42px, #F5F4EF background, 12px radius */}
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity style={styles.callButton} onPress={handleCall}>
              <Ionicons name="call" size={24} color="#1B392E" style={styles.callIcon} />
              <Text style={styles.callText}>Call</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Services List - 24px below address */}
        <View style={styles.servicesSection}>
          {/* Title - "Services", bold, 21px, #1A1A1A */}
          <Text style={styles.servicesHeader}>Services</Text>
          
          {/* List Items - 4 items, vertical stack, 32px row height, 11px vertical space between rows */}
          {salonData.services.map((service, index) => (
            <TouchableOpacity
              key={index}
              style={styles.serviceRow}
              onPress={() => handleBookService(service)}
              activeOpacity={0.8}
            >
              {/* Service - Left-aligned, 18px, #222, weight 500 */}
              <Text style={styles.serviceName}>{service.name}</Text>
              {/* Price - Right-aligned, 18px, #222, weight 400 */}
              <Text style={styles.servicePrice}>{service.price}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Photos Section - 24px below services list */}
        <View style={styles.photosSection}>
          {/* Title - "Photos from the Salon", bold, 19px, #1A1A1A */}
          <Text style={styles.photosHeader}>Photos from the Salon</Text>
          
          {/* Photo Carousel Row - Horizontal Scroll, 4 images visible, 72x72px, 16px radius, 13px between images */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.photosScrollView}
            contentContainerStyle={styles.photosContainer}
          >
            {photos.map((photo, index) => (
              <View key={index} style={[styles.photoCard, index === 0 && styles.firstPhotoCard]}>
                <Image source={photo} style={styles.photoImage} />
              </View>
            ))}
          </ScrollView>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF6EC', // Exact cream background
  },
  
  // Header Section - Deep green (#213527) - 111px height
  header: {
    backgroundColor: '#213527', // Exact deep green color
    height: 111, // Exact height from screen top to base of green area, including status bar
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    width: 38,
    height: 21,
    marginBottom: 8, // 8px below icon
  },
  headerTitle: {
    fontSize: 26, // Exact 26px
    fontFamily: 'System', // Uppercase serif
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 2, // 2px letter spacing
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  
  // Main Card Salon Details - Cream (#FAF6EC)
  mainCard: {
    backgroundColor: '#FAF6EC', // Very light cream
    width: '100%', // 428px (100% safe area)
    height: 646, // 646px from header bottom to above tab navigator
    borderTopLeftRadius: 32, // Top corners only, 32px radius
    borderTopRightRadius: 32,
    overflow: 'hidden',
    elevation: 7,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.19,
    shadowRadius: 22,
  },
  
  // Salon Image Section - Full width, 196px height, top corners 32px radius
  salonImageSection: {
    width: '100%', // Full width 428px
    height: 196, // 196px height
    borderTopLeftRadius: 32, // Top left and right
    borderTopRightRadius: 32,
    overflow: 'hidden',
  },
  salonImage: {
    width: '100%',
    height: '100%',
  },
  
  // Salon Title Row - 22px below image
  salonTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 18, // 18px from left and right
    paddingTop: 22, // 22px below image
  },
  
  // Salon Details Block
  salonDetailsBlock: {
    flex: 1,
  },
  
  // Title - "Gustav Salon", left-aligned, 27px, weight 700, #1A1A1A
  salonName: {
    fontSize: 27, // 27px
    fontWeight: '700', // Weight 700
    color: '#1A1A1A', // #1A1A1A
    marginBottom: 7, // 7px below title
  },
  
  // Address Row - "Frederiks Allé 28", 17px, weight 400, #3F4143, 7px below title
  salonAddress: {
    fontSize: 17, // 17px
    fontWeight: '400', // Weight 400
    color: '#3F4143', // #3F4143
    marginBottom: 4, // Small gap before rating
  },
  
  // Rating Container
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  // Star Icon - 18px, #FEBC45
  starIcon: {
    marginRight: 6, // Space before rating text
  },
  
  // Rating Text - 15px, #6A6A6A
  ratingText: {
    fontSize: 15, // 15px
    color: '#6A6A6A', // #6A6A6A
  },
  
  // Call Button - Right-aligned, 102x42px, #F5F4EF background, 12px radius
  callButton: {
    width: 102, // 102px width
    height: 42, // 42px height
    backgroundColor: '#F5F4EF', // #F5F4EF background
    borderRadius: 12, // 12px border radius
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.09,
    shadowRadius: 8,
  },
  
  // Call icon - phone, 24px, #1B392E, 18px left margin in button
  callIcon: {
    marginRight: 8, // 8px left margin after icon
  },
  
  // Call text - "Call", 17px, #1B392E
  callText: {
    fontSize: 17, // 17px
    color: '#1B392E', // #1B392E
  },
  
  // Services List - 24px below address
  servicesSection: {
    paddingHorizontal: 18, // 18px from left
    paddingTop: 24, // 24px below address
  },
  
  // Title - "Services", bold, 21px, #1A1A1A
  servicesHeader: {
    fontSize: 21, // 21px
    fontWeight: 'bold',
    color: '#1A1A1A', // #1A1A1A
    marginBottom: 12, // Space below services header
  },
  
  // Service Row - 32px row height, 11px vertical space between rows
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 32, // 32px row height
    marginBottom: 11, // 11px vertical space between rows
  },
  
  // Service - Left-aligned, 18px, #222, weight 500
  serviceName: {
    fontSize: 18, // 18px
    color: '#222222', // #222
    fontWeight: '500', // Weight 500
  },
  
  // Price - Right-aligned, 18px, #222, weight 400
  servicePrice: {
    fontSize: 18, // 18px
    color: '#222222', // #222
    fontWeight: '400', // Weight 400
  },
  
  // Photos Section - 24px below services list
  photosSection: {
    paddingHorizontal: 18, // 18px from left
    paddingTop: 24, // 24px below services list
    paddingBottom: 27, // 27px below image row
  },
  
  // Title - "Photos from the Salon", bold, 19px, #1A1A1A
  photosHeader: {
    fontSize: 19, // 19px
    fontWeight: 'bold',
    color: '#1A1A1A', // #1A1A1A
    marginBottom: 12, // Space below title
  },
  
  photosScrollView: {
    // No additional styling needed
  },
  
  photosContainer: {
    paddingRight: 18, // Padding for last item
  },
  
  // Photo Card - 72x72px, 16px radius, 13px between images
  photoCard: {
    width: 72, // 72px width
    height: 72, // 72px height
    borderRadius: 16, // 16px border radius
    marginRight: 13, // 13px between images
    overflow: 'hidden',
  },
  
  // First photo card - 20px left margin
  firstPhotoCard: {
    marginLeft: 20, // 20px left margin
  },
  
  photoImage: {
    width: '100%',
    height: '100%',
  },
});