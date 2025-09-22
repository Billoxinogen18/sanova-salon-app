import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Animated, StatusBar, Dimensions, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { 
  typography, 
  spacing, 
  shadows, 
  borderRadius, 
  premiumComponents 
} from '../../theme/premiumStyles';

const { width, height } = Dimensions.get('window');

export default function ServiceDetailScreen({ navigation, route }) {
  const { service } = route.params || {
    service: {
      name: 'Men\'s Haircut',
      salon: 'Gustav Salon',
      date: 'Today, 11:00 AM',
      price: '400 kr',
      address: 'Frederiks Alle 28',
      description: 'Professional men\'s haircut with styling and consultation.',
      duration: '45 min',
      rating: 4.8,
      reviews: 127,
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop',
      services: ['Haircut', 'Styling', 'Consultation'],
      amenities: ['Free WiFi', 'Parking', 'Refreshments'],
    }
  };

  const [isFavorite, setIsFavorite] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Animated values
  const headerAnimatedValues = useRef({
    opacity: new Animated.Value(0),
    translateY: new Animated.Value(-30),
  }).current;

  const imageAnimatedValues = useRef({
    opacity: new Animated.Value(0),
    scale: new Animated.Value(0.9),
  }).current;

  const contentAnimatedValues = useRef({
    opacity: new Animated.Value(0),
    translateY: new Animated.Value(30),
  }).current;

  const buttonAnimatedValues = useRef({
    opacity: new Animated.Value(0),
    translateY: new Animated.Value(30),
    scale: new Animated.Value(1),
  }).current;

  const favoriteScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    
    // Start entrance animations
    startEntranceAnimations();
  }, []);

  const startEntranceAnimations = () => {
    Animated.stagger(200, [
      // Header animation
      Animated.parallel([
        Animated.timing(headerAnimatedValues.opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(headerAnimatedValues.translateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // Image animation
      Animated.parallel([
        Animated.timing(imageAnimatedValues.opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(imageAnimatedValues.scale, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // Content animation
      Animated.parallel([
        Animated.timing(contentAnimatedValues.opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(contentAnimatedValues.translateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // Button animation
      Animated.parallel([
        Animated.timing(buttonAnimatedValues.opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(buttonAnimatedValues.translateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  const handleBookNow = () => {
    // Animate button press
    Animated.sequence([
      Animated.timing(buttonAnimatedValues.scale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonAnimatedValues.scale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.navigate('BookingFlow', { service });
    });
  };

  const handleFavorite = () => {
    Animated.sequence([
      Animated.timing(favoriteScale, { toValue: 1.3, duration: 100, useNativeDriver: true }),
      Animated.timing(favoriteScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    setIsFavorite(!isFavorite);
  };

  const handleDirections = () => {
    const url = `https://maps.google.com/?q=${encodeURIComponent(service.address)}`;
    Linking.openURL(url);
  };

  const handleCall = () => {
    const phoneNumber = '+45 20 12 34 56'; // Default salon phone
    Linking.openURL(`tel:${phoneNumber}`);
  };

  // Helper function to get service images based on specifications
  const getServiceImage = () => {
    const serviceName = service.name || service.service || '';
    if (serviceName.toLowerCase().includes('manicure')) {
      return require('../../../assets/manicure.png');
    } else if (serviceName.toLowerCase().includes('haircut')) {
      return require('../../../assets/haircut.png');
    }
    return require('../../../assets/haircut.png'); // Default
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor="#213527" />
      
      {/* Header Section - Deep green (#213527) - 115px height */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: headerAnimatedValues.opacity,
            transform: [{ translateY: headerAnimatedValues.translateY }],
          }
        ]}
      >
        {/* Logo Leaf & SANOVA - Centered horizontally and vertically */}
        <View style={styles.logoContainer}>
          {/* Leaf SVG - 38px width, 21px height, 13px top space */}
          <Image 
            source={require('../../../assets/logo.png')}
            style={styles.logoIcon}
            resizeMode="contain"
          />
          {/* SANOVA text - 26px, uppercase serif, white, letter-spacing 2px, 7px below leaf icon */}
          <Text style={styles.headerTitle}>SANOVA</Text>
        </View>
      </Animated.View>
      
      {/* Service Image Section - Full width, 198px from header base downward */}
      <Animated.View 
        style={[
          styles.serviceImageSection,
          {
            opacity: imageAnimatedValues.opacity,
            transform: [{ scale: imageAnimatedValues.scale }],
          }
        ]}
      >
        <Image 
          source={getServiceImage()} 
          style={styles.serviceImage}
          resizeMode="cover"
        />
      </Animated.View>

      {/* Main Card Area - Very light cream (#FAF6EC) */}
      <Animated.View 
        style={[
          styles.mainCard,
          {
            opacity: contentAnimatedValues.opacity,
            transform: [{ translateY: contentAnimatedValues.translateY }],
          }
        ]}
      >
        {/* Service Info Block */}
        <View style={styles.serviceInfoBlock}>
          {/* Service Title - Centered, "Classic Manicure", 38px from base of service image */}
          <Text style={styles.serviceName}>
            {service.name || service.service || 'Classic Manicure'}
          </Text>
          {/* Below title - Centered, "Gustav Salon", 8px below title */}
          <Text style={styles.salonName}>
            {service.salon || 'Gustav Salon'}
          </Text>
          {/* Time and Price row - Horizontal, wide margin, 14px below salon name */}
          <View style={styles.timePriceRow}>
            <Text style={styles.timeText}>
              {service.date || 'Today, 11:00 AM'}
            </Text>
            <Text style={styles.priceText}>
              {service.price || '200 kr'}
            </Text>
          </View>
        </View>

        {/* Address Section - 16px below time/price row */}
        <View style={styles.addressSection}>
          <View style={styles.addressRow}>
            {/* Address icon - Pin location SVG, black, 18px */}
            <Ionicons 
              name="location-outline" 
              size={18} 
              color="#000000" 
              style={styles.addressIcon}
            />
            {/* Address text - 13px between icon and text */}
            <Text style={styles.addressText}>
              {service.address || 'Frederiks Alle 28'}
            </Text>
          </View>
        </View>

        {/* Action Buttons Container */}
        <Animated.View 
          style={[
            styles.actionButtonsContainer,
            {
              opacity: buttonAnimatedValues.opacity,
              transform: [
                { translateY: buttonAnimatedValues.translateY },
                { scale: buttonAnimatedValues.scale }
              ],
            }
          ]}
        >
          {/* Directions Button - Centered horizontally, 31px below address */}
          <TouchableOpacity 
            style={styles.directionsButton}
            onPress={handleDirections}
            activeOpacity={0.8}
          >
            <Text style={styles.directionsButtonText}>Directions</Text>
          </TouchableOpacity>
          
          {/* "Book Now" Button - 26px below Directions button */}
          <TouchableOpacity 
            style={styles.bookButton}
            onPress={handleBookNow}
            activeOpacity={0.9}
          >
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF6EC', // Exact cream background
  },
  
  // Header Section - Deep green (#213527) - 115px height
  header: {
    backgroundColor: '#213527', // Exact deep green color
    height: 115, // Exact height includes status bar and green header
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    width: 80,
    height: 50,
    marginBottom: 7, // 7px below leaf icon
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
  
  // Service Image Section - Full width, 198px from header base downward
  serviceImageSection: {
    width: '100%', // Full width
    height: 198, // 198px from header base downward
    borderTopLeftRadius: 28, // Top left and top right only
    borderTopRightRadius: 28,
    overflow: 'hidden',
  },
  serviceImage: {
    width: '100%',
    height: '100%',
  },
  
  // Main Card Area - Very light cream (#FAF6EC)
  mainCard: {
    backgroundColor: '#FAF6EC', // Very light cream
    borderTopLeftRadius: 28, // Top corners only
    borderTopRightRadius: 28,
    width: '100%', // 428px (100%)
    height: 531, // 531px from image base to top of navigation
    paddingHorizontal: 38, // 38px from card left edge
  },
  
  // Service Info Block
  serviceInfoBlock: {
    alignItems: 'center',
    marginTop: 38, // 38px from base of service image
  },
  
  // Service Title - Centered, 27px, weight 600, #223527
  serviceName: {
    fontSize: 27, // 27px
    fontWeight: '600', // Weight 600
    color: '#223527', // #223527
    textAlign: 'center',
    marginBottom: 8, // 8px below title
    lineHeight: 31, // Line height 31px
    maxWidth: '100%',
  },
  
  // Salon Name - Centered, 19px, weight 500, #223527, 8px below title
  salonName: {
    fontSize: 19, // 19px
    fontWeight: '500', // Weight 500
    color: '#223527', // #223527
    textAlign: 'center',
    marginBottom: 14, // 14px below salon name
  },
  
  // Time and Price row - Horizontal, wide margin, 14px below salon name
  timePriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16, // 16px below time/price row
  },
  
  // Time - Left side, 17px, #515145, weight 500
  timeText: {
    fontSize: 17, // 17px
    color: '#515145', // #515145
    fontWeight: '500', // Weight 500
  },
  
  // Price - Right side, 17px, #515145, weight 500
  priceText: {
    fontSize: 17, // 17px
    color: '#515145', // #515145
    fontWeight: '500', // Weight 500
  },
  
  // Address Section - 16px below time/price row
  addressSection: {
    marginBottom: 31, // 31px below address for directions button
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  // Address icon - Pin location SVG, black, 18px
  addressIcon: {
    marginRight: 13, // 13px between icon and text
  },
  
  // Address text - 17px, #515145
  addressText: {
    fontSize: 17, // 17px
    color: '#515145', // #515145
  },
  
  // Action Buttons Container
  actionButtonsContainer: {
    alignItems: 'center',
  },
  
  // Directions Button - Centered horizontally, 31px below address, 324px width, 53px height
  directionsButton: {
    width: 324, // 324px width
    height: 53, // 53px height
    backgroundColor: '#F5F3E6', // #F5F3E6 background
    borderRadius: 21, // 21px corner radius
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 26, // 26px below directions button
  },
  
  // Directions button text - 19px, #223527, weight 600
  directionsButtonText: {
    fontSize: 19, // 19px
    color: '#223527', // #223527
    fontWeight: '600', // Weight 600
    textAlign: 'center',
  },
  
  // "Book Now" Button - 26px below Directions button, 324px width, 53px height
  bookButton: {
    width: 324, // 324px width
    height: 53, // 53px height
    backgroundColor: '#213527', // Deep green #213527
    borderRadius: 21, // 21px corner radius
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Book Now button text - 20px, #FFF, weight 700
  bookButtonText: {
    fontSize: 20, // 20px
    color: '#FFFFFF', // #FFF
    fontWeight: '700', // Weight 700
    textAlign: 'center',
  },
});
