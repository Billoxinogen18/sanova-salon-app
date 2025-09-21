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

export default function ProfileScreen({ navigation, route }) {
  const [selectedOption, setSelectedOption] = useState(null);
  
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

  const handleOptionPress = (option) => {
    // Touch feedback animation
    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    
    setSelectedOption(option);
    
    // Handle navigation based on option
    switch (option) {
      case 'history':
        navigation.navigate('OrderHistory');
        break;
      case 'edit':
        navigation.navigate('EditPhone');
        break;
      case 'notifications':
        navigation.navigate('Notifications');
        break;
      case 'favorites':
        navigation.navigate('FavoriteSalons');
        break;
      case 'support':
        navigation.navigate('Support');
        break;
      default:
        break;
    }
  };

  const navigationOptions = [
    {
      id: 'history',
      icon: 'time',
      label: 'Order History',
    },
    {
      id: 'edit',
      icon: 'create',
      label: 'Edit Phone Number',
    },
    {
      id: 'notifications',
      icon: 'notifications',
      label: 'Notifications',
    },
    {
      id: 'favorites',
      icon: 'heart',
      label: 'Favorite Salons',
    },
    {
      id: 'support',
      icon: 'help-circle',
      label: 'Support',
    },
  ];

  return (
    <View style={styles.container}>
      {/* App Bar - Deep forest green, 74px height, rounded top corners */}
      <View style={styles.appBar}>
        <StatusBar barStyle="light-content" backgroundColor={colors.deepForestGreen} />
        
        {/* SANOVA Logo */}
        <View style={styles.logoContainer}>
          <Image source={require('../../../assets/icon.png')} style={styles.logoImage} />
          <Text style={styles.logoText}>SANOVA</Text>
        </View>
      </View>

      {/* Main Content Card - White, top corners radius 24px, flush to screen edges */}
      <Animated.View 
        style={[
          styles.contentCard,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Header - "My Account", flush left, Inter bold, 25px */}
        <Text style={styles.header}>My Account</Text>

        {/* Phone Info Block - Light cream background, radius 16px */}
        <View style={styles.phoneInfoCard}>
          <Text style={styles.phoneLabel}>Phone Number</Text>
          <Text style={styles.phoneNumber}>+45 20 12 34 56</Text>
        </View>

        {/* Navigation Options List */}
        <View style={styles.navigationList}>
          {navigationOptions.map((option, index) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.navigationRow,
                index < navigationOptions.length - 1 && styles.navigationRowWithDivider,
              ]}
              onPress={() => handleOptionPress(option.id)}
              activeOpacity={0.8}
            >
              <View style={styles.rowContent}>
                {/* Icon - Left-most, vector SVG, pure black, 22px */}
                <Ionicons 
                  name={option.icon} 
                  size={22} 
                  color={colors.darkGreen} 
                  style={styles.rowIcon} 
                />
                
                {/* Label - Left-aligned, Inter medium, 17px */}
                <Text style={styles.rowLabel}>{option.label}</Text>
                
                {/* Right Arrow - Vector chevron, flush right */}
                <Ionicons 
                  name="chevron-forward" 
                  size={17} 
                  color={colors.darkGreen} 
                  style={styles.chevronIcon} 
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.warmCream, // Soft, warm cream background
  },
  
  // App Bar - Deep forest green, 74px height, rounded top corners
  appBar: {
    height: 74,
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
  
  // Main Content Card - White, top corners radius 24px, flush to screen edges
  contentCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 24, // 24px margin-top from top of card/container
  },
  
  // Header - Inter bold, 25px, flush left
  header: {
    fontFamily: 'Inter',
    fontSize: 25,
    fontWeight: 'bold',
    color: colors.darkGreen,
    marginTop: 24,
  },
  
  // Phone Info Block - Light cream background, radius 16px
  phoneInfoCard: {
    backgroundColor: colors.lightCream, // #F8F6EC
    borderRadius: 16,
    paddingHorizontal: 22, // 22px left/right
    paddingVertical: 16, // 16px top/bottom
    marginTop: 18, // 18px margin-top below header
    shadowColor: colors.deepForestGreen,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  
  // Phone Label - Inter regular, 15px
  phoneLabel: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '400',
    color: colors.mutedGreen, // #6A7463
    marginBottom: 2,
  },
  
  // Phone Number - Inter bold, 19px
  phoneNumber: {
    fontFamily: 'Inter',
    fontSize: 19,
    fontWeight: 'bold',
    color: colors.darkGreen,
  },
  
  // Navigation Options List
  navigationList: {
    marginTop: 22, // 22px margin-top below phone card
    flex: 1,
  },
  
  // Navigation Row - 56px height, width 100% of card
  navigationRow: {
    height: 56,
    width: '100%',
    backgroundColor: colors.lightCream, // #F8F6EC
    justifyContent: 'center',
    minHeight: 48, // Minimum touch target
  },
  
  navigationRowWithDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.dividerGray, // #EBE6DC, 1px, 14% opacity
  },
  
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18, // 18px left margin from edge
    flex: 1,
  },
  
  // Row Icon - Left-most, vector SVG, pure black, 22px
  rowIcon: {
    marginRight: 22, // 22px spacing from icon
  },
  
  // Row Label - Left-aligned, Inter medium, 17px
  rowLabel: {
    fontFamily: 'Inter',
    fontSize: 17,
    fontWeight: '500',
    color: colors.darkGreen,
    flex: 1,
  },
  
  // Chevron Icon - Vector chevron, flush right, 24px right margin
  chevronIcon: {
    marginRight: 24, // 24px right margin
  },
});