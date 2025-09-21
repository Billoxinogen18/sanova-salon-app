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
  TextInput,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const { width } = Dimensions.get('window');

export default function AvailableTimesScreen({ navigation, route }) {
  const [searchText, setSearchText] = useState('');
  const [selectedTime, setSelectedTime] = useState(null);
  
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

  const handleTimeSelect = (time) => {
    // Touch feedback animation
    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    
    setSelectedTime(time);
    
    // Navigate to salon detail or booking flow
    navigation.navigate('SalonDetail', { time });
  };

  // Mock data for available times with actual service images
  const availableTimes = [
    {
      id: 1,
      service: 'Classic Manicure',
      salon: 'Gustav Salon',
      distance: '0.8 km',
      time: '10:00 AM',
      image: require('../../../assets/manicure.png'),
    },
    {
      id: 2,
      service: 'Hair Styling',
      salon: 'Style Salon',
      distance: '1.2 km',
      time: '11:30 AM',
      image: require('../../../assets/haircut.png'),
    },
    {
      id: 3,
      service: 'Barber Cut',
      salon: 'Barber Shop',
      distance: '0.5 km',
      time: '2:00 PM',
      image: require('../../../assets/barber.png'),
    },
    {
      id: 4,
      service: 'Salon Manicure',
      salon: 'Beauty Studio',
      distance: '1.5 km',
      time: '3:30 PM',
      image: require('../../../assets/saloonmanicure.png'),
    },
  ];

  return (
    <View style={styles.container}>
      {/* Top Header Bar - Deep forest green, 72px height, rounded top corners */}
      <View style={styles.headerBar}>
        <StatusBar barStyle="light-content" backgroundColor={colors.deepForestGreen} />
        
        {/* SANOVA Logo - Centered, flat white leaf icon above wordmark */}
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
        {/* Search Bar Component - 26px radius, subtle shadow */}
        <View style={styles.searchBarContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={colors.darkGreen} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor={colors.gray}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>

        {/* Section Header - "Available Times" flush left */}
        <Text style={styles.sectionHeader}>Available Times</Text>

        {/* Time/Card List */}
        <ScrollView style={styles.timesList} showsVerticalScrollIndicator={false}>
          {availableTimes.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.timeCard}
              onPress={() => handleTimeSelect(item)}
              activeOpacity={0.8}
            >
              {/* Service Image - Left side */}
              <Image source={item.image} style={styles.serviceImage} />
              
              {/* Card Content Block */}
              <View style={styles.cardContentBlock}>
                {/* Service Title - Top left of card */}
                <Text style={styles.serviceTitle}>{item.service}</Text>
                
                {/* Salon Name - Directly below service */}
                <Text style={styles.salonName}>{item.salon}</Text>
                
                {/* Location and Distance */}
                <View style={styles.locationContainer}>
                  <Ionicons name="location" size={14} color={colors.lightGray} style={styles.locationIcon} />
                  <Text style={styles.distanceText}>{item.distance}</Text>
                </View>
              </View>

              {/* Time Button - Far right, vertically centered */}
              <TouchableOpacity 
                style={styles.timeButton}
                onPress={() => handleTimeSelect(item)}
                activeOpacity={0.8}
              >
                <Text style={styles.timeButtonText}>{item.time}</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Navigation Bar - Fixed height 63px, deep forest green */}
      <View style={styles.navigationBar}>
        <TouchableOpacity style={styles.navItem}>
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
  
  // Top Header Bar - Deep forest green, 72px height, rounded top corners
  headerBar: {
    height: 72,
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
    paddingHorizontal: 24,
  },
  
  // Search Bar Component - 26px radius, subtle shadow
  searchBarContainer: {
    marginTop: 18, // 18px vertical margin above
    marginBottom: 24, // 24px margin below
  },
  
  searchBar: {
    height: 48,
    backgroundColor: colors.searchBarBg, // #FBF9F1
    borderRadius: 26,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    shadowColor: colors.deepForestGreen,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  
  searchIcon: {
    marginRight: 12,
  },
  
  searchInput: {
    flex: 1,
    fontFamily: 'Inter',
    fontSize: 16,
    color: colors.darkGreen,
  },
  
  // Section Header - Inter bold, 24px, flush left
  sectionHeader: {
    fontFamily: 'Inter',
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.darkGreen,
    marginBottom: 22, // 22px margin-bottom for strong separation
  },
  
  timesList: {
    flex: 1,
  },
  
  // Time Card - 74px height, 92% width, 16px radius
  timeCard: {
    width: '92%',
    height: 74,
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: 11, // 11px margin-bottom between cards
    paddingHorizontal: 20, // 20px left/right inside card
    paddingVertical: 12, // 12px top/bottom inside card
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: colors.deepForestGreen,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.11,
    shadowRadius: 12,
    elevation: 3,
    alignSelf: 'center',
  },
  
  // Service Image - 50px square, left side of card
  serviceImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  
  // Card Content Block - Maximum width 70% of card
  cardContentBlock: {
    flex: 1,
    maxWidth: '70%',
  },
  
  // Service Title - Inter bold, 17px, 2px space below
  serviceTitle: {
    fontFamily: 'Inter',
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.darkGreen,
    marginBottom: 2,
  },
  
  // Salon Name - Medium weight, 15px
  salonName: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '500',
    color: colors.mutedGreen, // #555F55
    marginBottom: 2,
  },
  
  // Location Container
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  // Location Icon - Light gray, 14px, vertically centered
  locationIcon: {
    marginRight: 4, // 4px padding left of pin icon
  },
  
  // Distance Text - Inter medium, 13px
  distanceText: {
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray, // #7B857B
  },
  
  // Time Button - 69px wide, 40px tall, 18px radius
  timeButton: {
    width: 69,
    height: 40,
    backgroundColor: colors.paleIvory, // #EFEEDF
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12, // 12px left/right internal
    paddingVertical: 7, // 7px top/bottom
    shadowColor: colors.deepForestGreen,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.09,
    shadowRadius: 8,
    elevation: 2,
  },
  
  // Time Button Text - Inter bold, 16px, perfectly centered
  timeButtonText: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.darkGreen,
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
    minWidth: 48, // Minimum touch target
    minHeight: 48,
  },
  
  navLabel: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: colors.white,
    marginTop: 2,
  },
});
