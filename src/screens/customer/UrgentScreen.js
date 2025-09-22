import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, TextInput, StatusBar, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { 
  typography, 
  spacing, 
  shadows, 
  borderRadius, 
  premiumComponents 
} from '../../theme/premiumStyles';

export default function UrgentScreen({ navigation }) {
  const [searchText, setSearchText] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  // Animated values
  const headerAnimatedValues = useRef({
    opacity: new Animated.Value(0),
    translateY: new Animated.Value(-30),
  }).current;

  const searchAnimatedValues = useRef({
    opacity: new Animated.Value(0),
    translateY: new Animated.Value(20),
    scale: new Animated.Value(1),
  }).current;

  const titleAnimatedValues = useRef({
    opacity: new Animated.Value(0),
    translateY: new Animated.Value(20),
  }).current;

  const appointmentsAnimatedValues = useRef([]).current;
  const searchBorderAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    
    // Initialize appointment animations
    if (appointmentsAnimatedValues.length === 0) {
      availableTimes.forEach((_, index) => {
        appointmentsAnimatedValues.push({
          opacity: new Animated.Value(0),
          translateY: new Animated.Value(30),
          scale: new Animated.Value(0.9),
        });
      });
    }

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
      // Search animation
      Animated.parallel([
        Animated.timing(searchAnimatedValues.opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(searchAnimatedValues.translateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // Title animation
      Animated.parallel([
        Animated.timing(titleAnimatedValues.opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(titleAnimatedValues.translateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // Appointment animations
      ...appointmentsAnimatedValues.map(values => 
        Animated.parallel([
          Animated.timing(values.opacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(values.translateY, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(values.scale, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();
  };

  const handleSearchFocus = () => {
    setSearchFocused(true);
    Animated.parallel([
      Animated.timing(searchBorderAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(searchAnimatedValues.scale, {
        toValue: 1.02,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSearchBlur = () => {
    setSearchFocused(false);
    Animated.parallel([
      Animated.timing(searchBorderAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(searchAnimatedValues.scale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Available appointment times exactly as shown in design
  const availableTimes = [
    {
      id: 1,
      service: 'Classic Manicure',
      salon: 'Nail Spa Studio',
      time: '10:00 AM',
      distance: '0.5 km away',
    },
    {
      id: 2,
      service: "Men's Haircut",
      salon: 'Trendy Salon',
      time: '11:30 AM',
      distance: '1.2 km away',
    },
    {
      id: 3,
      service: 'Swedish Massage',
      salon: 'Wellness Center',
      time: '12:00 PM',
      distance: '1.3 km away',
    },
  ];

  const searchBorderColor = searchBorderAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border.primary, colors.primary],
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor="#213527" />
      
      {/* Header Section - Deep green (#213527) - 113px height */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: headerAnimatedValues.opacity,
            transform: [{ translateY: headerAnimatedValues.translateY }],
          }
        ]}
      >
        {/* Logo Leaf & SANOVA - Positioned center-top */}
        <View style={styles.logoContainer}>
          {/* Leaf SVG - 34px width, 20px height, 14px top space */}
          <Image 
            source={require('../../../assets/logo.png')}
            style={styles.logoIcon}
            resizeMode="contain"
          />
          {/* SANOVA text - 26px, uppercase serif, white, letter-spacing 2px, 7px below leaf icon */}
          <Text style={styles.headerTitle}>SANOVA</Text>
        </View>
      </Animated.View>
      
      {/* Main Card (Urgent Times Container) - Very pale cream (#FAF6EC) */}
      <View style={styles.urgentCard}>
        {/* Search Bar - 26px from card top/screen edge, 375px width, 52px height */}
        <Animated.View 
          style={[
            styles.searchContainer,
            {
              opacity: searchAnimatedValues.opacity,
              transform: [
                { translateY: searchAnimatedValues.translateY },
                { scale: searchAnimatedValues.scale },
              ],
            }
          ]}
        >
          <Animated.View
            style={[
              styles.searchBar,
              { borderColor: searchBorderColor }
            ]}
          >
            {/* Black magnifier icon - 22x22px, left-aligned, 18px inside bar */}
            <Ionicons 
              name="search" 
              size={22} 
              color="#000000" 
              style={styles.searchIcon}
            />
            {/* Search text - "Search", 19px, #32343A, 11px left margin after icon */}
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="#32343A"
              value={searchText}
              onChangeText={setSearchText}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
            />
            {searchText.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchText('')}
                style={styles.clearButton}
                activeOpacity={0.7}
              >
                <Ionicons name="close-circle" size={20} color="#32343A" />
              </TouchableOpacity>
            )}
          </Animated.View>
        </Animated.View>

        {/* Available Times Section - 23px below search bar */}
        <Animated.View
          style={[
            styles.titleContainer,
            {
              opacity: titleAnimatedValues.opacity,
              transform: [{ translateY: titleAnimatedValues.translateY }],
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Available Times</Text>
        </Animated.View>
        
        {/* Booking Cards - Vertical list, 17px spacing between cards */}
        <ScrollView 
          style={styles.appointmentsContainer}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        >
          {availableTimes.map((item, index) => {
            const animatedValues = appointmentsAnimatedValues[index] || {
              opacity: new Animated.Value(1),
              translateY: new Animated.Value(0),
              scale: new Animated.Value(1),
            };

            return (
              <Animated.View
                key={item.id}
                style={[
                  styles.appointmentCardContainer,
                  {
                    opacity: animatedValues.opacity,
                    transform: [
                      { translateY: animatedValues.translateY },
                      { scale: animatedValues.scale },
                    ],
                  }
                ]}
              >
                <TouchableOpacity 
                  style={styles.appointmentCard}
                  onPress={() => navigation.navigate('ServiceDetail', { service: item })}
                  activeOpacity={0.9}
                >
                  <View style={styles.appointmentInfo}>
                    {/* Service Title - 18px from card top, 19px from left, 18px weight 700, #232323 */}
                    <Text style={styles.serviceName}>{item.service}</Text>
                    {/* Salon Name - 8px gap from title, 15px, #484848, weight 400 */}
                    <Text style={styles.salonName}>{item.salon}</Text>
                    {/* Location/Distance Row - Pin icon + distance, 8px below salon name */}
                    <View style={styles.locationRow}>
                      <Ionicons 
                        name="location-outline" 
                        size={15} 
                        color="#000000" 
                        style={styles.pinIcon}
                      />
                      <Text style={styles.distance}>{item.distance}</Text>
                    </View>
                  </View>
                  {/* Time Badge - Right-aligned, vertically centered, 101x44px, #F5F3E6 background */}
                  <View style={styles.timeBadge}>
                    <Text style={styles.timeText}>{item.time}</Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF6EC', // Exact cream background
  },
  
  // Header Section - Deep green (#213527) - 113px height
  header: {
    backgroundColor: '#213527', // Exact deep green color
    height: 113, // Exact height from screen top to base of green header, including status bar
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
  
  // Main Card (Urgent Times Container) - Very pale cream (#FAF6EC)
  urgentCard: {
    backgroundColor: '#FAF6EC', // Very pale cream
    width: '100%', // 428px (100% safe area)
    height: 726, // Down to top of navigation bar
    borderTopLeftRadius: 28, // Top corners only
    borderTopRightRadius: 28,
    paddingHorizontal: 26, // Global padding for content
    paddingTop: 26, // 26px from card top/screen edge
  },
  
  // Search Bar - 375px width, 52px height
  searchContainer: {
    alignSelf: 'center',
    width: 375, // Exact 375px width
    marginBottom: 23, // 23px below search bar
  },
  searchBar: {
    width: '100%',
    height: 52, // Exact height
    backgroundColor: '#FFFFFF', // White background
    borderRadius: 26, // Fully pill-shaped
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18, // 18px inside bar
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 9,
  },
  searchIcon: {
    marginRight: 11, // 11px left margin after icon
  },
  searchInput: {
    flex: 1,
    fontSize: 19, // 19px font size
    color: '#32343A', // Color #32343A
    fontWeight: '400',
  },
  clearButton: {
    padding: 4,
  },
  
  // Available Times Section - 23px below search bar, 30px left padding
  titleContainer: {
    marginBottom: 17, // 17px spacing between cards
    marginLeft: 4, // 30px left padding (26px + 4px)
  },
  sectionTitle: {
    fontSize: 22, // 22px
    fontWeight: '700', // Bold
    color: '#232323', // #232323
  },
  
  // Booking Cards - Container, vertical list, 17px spacing between cards
  appointmentsContainer: {
    flex: 1,
    paddingBottom: 50, // Extra padding to avoid cutoff
  },
  appointmentCardContainer: {
    marginBottom: 17, // 17px spacing between cards
    alignSelf: 'center',
  },
  appointmentCard: {
    width: 364, // 364px width
    height: 96, // 96px height
    backgroundColor: '#FFFFFF', // White background
    borderRadius: 18, // 18px corner radius
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 19, // 19px from left horizontal padding
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.09,
    shadowRadius: 11,
  },
  
  // Content Placement
  appointmentInfo: {
    flex: 1,
    paddingVertical: 18, // 18px from card top
  },
  
  // Service Title - 18px weight 700, #232323, 18px from card top, 19px from left
  serviceName: {
    fontSize: 18, // 18px
    fontWeight: '700', // Weight 700
    color: '#232323', // #232323
    marginBottom: 8, // 8px gap from title
  },
  
  // Salon Name - 15px, #484848, weight 400, 8px gap from title
  salonName: {
    fontSize: 15, // 15px
    color: '#484848', // #484848
    fontWeight: '400', // Weight 400
    marginBottom: 8, // 8px below salon name
  },
  
  // Location/Distance Row - Pin icon + distance text
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pinIcon: {
    marginRight: 4, // Small spacing between icon and text
  },
  distance: {
    fontSize: 15, // 15px
    color: '#747474', // #747474
  },
  
  // Time Badge - Right-aligned, vertically centered, 101x44px, #F5F3E6 background
  timeBadge: {
    width: 101, // 101px width
    height: 44, // 44px height
    backgroundColor: '#F5F3E6', // #F5F3E6 background
    borderRadius: 14, // 14px corner radius
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Time text - center aligned, 17px, #232323, weight 600
  timeText: {
    fontSize: 17, // 17px
    color: '#232323', // #232323
    fontWeight: '600', // Weight 600
    textAlign: 'center',
  },
});