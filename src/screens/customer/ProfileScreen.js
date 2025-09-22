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
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { authService } from '../../services/firebaseService';

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
      case 'bookings':
        navigation.navigate('BookingHistory');
        break;
      case 'payments':
        navigation.navigate('PaymentHistory');
        break;
      case 'edit':
        navigation.navigate('EditPhone');
        break;
      case 'notifications':
        Alert.alert('Notifications', 'Notification settings will be available soon!');
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
      id: 'bookings',
      icon: 'calendar',
      label: 'My Bookings',
    },
    {
      id: 'payments',
      icon: 'card',
      label: 'Payment History',
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

  const handleLogout = async () => {
    // Touch feedback animation
    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    
    try {
      // Handle Firebase logout
      await authService.signOut();
      console.log('User logged out');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor="#213527" />
      
      {/* Header - Deep green (#213527) - Same as other screens */}
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
          {/* Logo - Same dimensions as other screens */}
          <Image 
            source={require('../../../assets/logo.png')}
            style={styles.logoIcon}
            resizeMode="contain"
          />
          {/* SANOVA text - Same styling as other screens */}
          <Text style={styles.headerTitle}>SANOVA</Text>
        </View>
      </Animated.View>

      {/* Main Card - Very light cream (#FAF6EC) */}
      <Animated.View 
        style={[
          styles.mainCard,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        {/* Content Section */}
        <View style={styles.contentSection}>
          {/* Title - "My Account", 25px, weight 700, #223527, 38px margin-top */}
          <Text style={styles.sectionTitle}>My Account</Text>
          
          {/* Phone Number Card - 375px width, 66px height, white background, 18px radius */}
          <View style={styles.phoneCard}>
            <View style={styles.phoneInfo}>
              <Text style={styles.phoneLabel}>Phone Number</Text>
              <Text style={styles.phoneNumber}>+45 20 12 34 56</Text>
            </View>
            {/* Edit icon - right side, 20px */}
            <TouchableOpacity onPress={() => handleOptionPress('edit')} activeOpacity={0.8}>
              <Ionicons name="create-outline" size={20} color="#626463" />
            </TouchableOpacity>
          </View>

          {/* Navigation Options - Each 54px height, white background, 18px radius */}
          {navigationOptions.map((option, index) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.navigationOption,
                index === 0 && styles.firstNavigationOption, // 26px margin-top after phone card
              ]}
              onPress={() => handleOptionPress(option.id)}
              activeOpacity={0.8}
            >
              <View style={styles.optionContent}>
                {/* Icon - Left side, 20px */}
                <Ionicons 
                  name={option.icon} 
                  size={20} 
                  color="#626463" 
                  style={styles.optionIcon} 
                />
                {/* Label - "My Bookings", etc., 18px, #223527 */}
                <Text style={styles.optionLabel}>{option.label}</Text>
                {/* Arrow - Right side, 16px */}
                <Ionicons 
                  name="chevron-forward" 
                  size={16} 
                  color="#626463" 
                />
              </View>
            </TouchableOpacity>
          ))}
          
          {/* Logout Button - 26px below last navigation option, 344px width, 51px height */}
          <Animated.View 
            style={[
              styles.logoutButtonContainer,
              { transform: [{ scale: buttonScale }] }
            ]}
          >
            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={handleLogout}
              activeOpacity={0.9}
            >
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </Animated.View>
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
  
  // Header - Deep green (#213527) - Same as other screens
  header: {
    backgroundColor: '#213527', // Exact deep green color
    height: 115, // Same height as other screens
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    width: 36,
    height: 22,
    marginBottom: 6, // Same spacing as other screens
  },
  headerTitle: {
    fontSize: 25, // Same as other screens
    fontFamily: 'System',
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  
  // Main Card - Very light cream (#FAF6EC)
  mainCard: {
    backgroundColor: '#FAF6EC', // Very light cream
    borderTopLeftRadius: 28, // Top corners only, same as other screens
    borderTopRightRadius: 28,
    width: '100%',
    flex: 1,
    paddingHorizontal: 26, // 26px from left/right
    paddingTop: 38, // 38px margin-top
  },
  
  // Content Section
  contentSection: {
    flex: 1,
  },
  
  // Title - "My Account", 25px, weight 700, #223527, 38px margin-top
  sectionTitle: {
    fontSize: 25, // 25px
    fontWeight: '700', // Weight 700
    color: '#223527', // #223527
    marginBottom: 32, // 32px below title for phone card
  },
  
  // Phone Number Card - 375px width, 66px height, white background, 18px radius
  phoneCard: {
    width: 375, // 375px width
    height: 66, // 66px height
    backgroundColor: '#FFFFFF', // White background
    borderRadius: 18, // 18px radius
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20, // 20px internal horizontal padding
    alignSelf: 'center',
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 11,
    marginBottom: 26, // 26px margin-top after phone card
  },
  
  // Phone info - Left side content
  phoneInfo: {
    flex: 1,
  },
  
  // Phone label - "Phone Number", 15px, #626463
  phoneLabel: {
    fontSize: 15, // 15px
    color: '#626463', // #626463
    marginBottom: 3, // 3px below label
  },
  
  // Phone number - "+45 20 12 34 56", 18px, weight 600, #223527
  phoneNumber: {
    fontSize: 18, // 18px
    fontWeight: '600', // Weight 600
    color: '#223527', // #223527
  },
  
  // Navigation Options - Each 54px height, white background, 18px radius
  navigationOption: {
    height: 54, // 54px height
    backgroundColor: '#FFFFFF', // White background
    borderRadius: 18, // 18px radius
    justifyContent: 'center',
    marginBottom: 14, // 14px between options
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 11,
  },
  
  // First navigation option - 26px margin-top after phone card
  firstNavigationOption: {
    // Already handled by phoneCard marginBottom
  },
  
  // Option content - Internal row layout
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20, // 20px internal horizontal padding
  },
  
  // Option icon - Left side, 20px
  optionIcon: {
    marginRight: 16, // 16px right margin from icon
  },
  
  // Option label - "My Bookings", etc., 18px, #223527
  optionLabel: {
    fontSize: 18, // 18px
    color: '#223527', // #223527
    fontWeight: '500',
    flex: 1,
  },
  
  // Logout Button Container - 26px below last navigation option
  logoutButtonContainer: {
    alignItems: 'center',
    marginTop: 26, // 26px below last navigation option
    paddingBottom: 40, // 40px margin-bottom from safe area
  },
  
  // Logout Button - 344px width, 51px height, #F1EBD1 background
  logoutButton: {
    width: 344, // 344px width
    height: 51, // 51px height
    backgroundColor: '#F1EBD1', // #F1EBD1 background (warm beige)
    borderRadius: 25, // Pill-shaped radius 25px
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Logout button text - "Logout", #223527, 20px, weight 600
  logoutButtonText: {
    fontSize: 20, // 20px
    color: '#223527', // #223527
    fontWeight: '600', // Weight 600
  },
});