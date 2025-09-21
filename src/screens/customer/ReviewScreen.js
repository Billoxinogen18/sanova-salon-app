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

export default function ReviewScreen({ navigation, route }) {
  const [selectedRating, setSelectedRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  
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

  const handleRatingSelect = (rating) => {
    // Touch feedback animation
    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    
    setSelectedRating(rating);
  };

  const handleSubmitReview = () => {
    // Button press animation
    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();

    // Handle review submission
    console.log('Submitting review:', { rating: selectedRating, feedback: feedbackText });
    navigation.goBack();
  };

  const handleSkip = () => {
    navigation.goBack();
  };

  const ratingLabels = [
    'Dårlig',
    'Okay', 
    'God',
    'Meget god',
    'Fantastisk'
  ];

  return (
    <View style={styles.container}>
      {/* App Bar - Deep forest green, 74px height, rounded top corners */}
      <View style={styles.appBar}>
        <StatusBar barStyle="light-content" backgroundColor={colors.deepForestGreen} />
        
        {/* SANOVA Logo */}
        <View style={styles.logoContainer}>
          <Image source={require('../../../assets/logo.png')} style={styles.logoImage} />
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
        {/* Page Title - "Hvordan var din oplevelse?", flush left, Inter bold, 24px */}
        <Text style={styles.pageTitle}>Hvordan var din oplevelse?</Text>

        {/* Review Card - White, radius 16px, 92% width, centered horizontally */}
        <View style={styles.reviewCard}>
          {/* Profile Circle - Dark green avatar, white capital "G" */}
          <View style={styles.profileCircle}>
            <Text style={styles.profileInitial}>G</Text>
          </View>

          {/* Salon Details - Vertical stack beside avatar */}
          <View style={styles.salonDetails}>
            <Text style={styles.salonName}>Gustav Salon</Text>
            <Text style={styles.serviceName}>Classic Manicure</Text>
            <Text style={styles.appointmentTime}>24. april 2024 kl. 11.00</Text>
          </View>
        </View>

        {/* Star Rating Component - Horizontal row, centered beneath review card */}
        <View style={styles.starRatingContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              style={styles.starContainer}
              onPress={() => handleRatingSelect(star)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={star <= selectedRating ? 'star' : 'star-outline'}
                size={32}
                color={colors.gold}
                style={styles.starIcon}
              />
              <Text style={styles.starLabel}>{ratingLabels[star - 1]}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Additional Feedback Section */}
        <View style={styles.feedbackSection}>
          <Text style={styles.feedbackPrompt}>Har du lyst til at uddybe?</Text>
          
          <TextInput
            style={styles.feedbackInput}
            placeholder="Valgfrit"
            placeholderTextColor={colors.gray}
            value={feedbackText}
            onChangeText={setFeedbackText}
            multiline
            maxLength={500}
          />
        </View>

        {/* Photo Upload Section */}
        <TouchableOpacity style={styles.photoUploadSection} activeOpacity={0.8}>
          <Ionicons name="camera" size={25} color={colors.lightGreen} style={styles.cameraIcon} />
          <Text style={styles.photoUploadLabel}>Del et billede af resultatet</Text>
        </TouchableOpacity>

        {/* Action Buttons */}
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSubmitReview}
            activeOpacity={0.9}
          >
            <Text style={styles.submitButtonText}>Send anmeldelse</Text>
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>Spring over</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.warmCream, // Warm cream background
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
    tintColor: colors.white,
  },
  
  logoText: {
    ...typography.logo,
    fontSize: 26, // 26px as specified
    fontWeight: 'bold',
    letterSpacing: 2,
    color: colors.white,
  },
  
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  
  // Page Title - Inter bold, 24px, flush left
  pageTitle: {
    fontFamily: 'Inter',
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.darkGreen,
    marginTop: 38, // 38px margin-top from app bar
  },
  
  // Review Card - White, radius 16px, 92% width, centered horizontally
  reviewCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginTop: 12, // 12px margin-top below header
    width: '92%',
    alignSelf: 'center',
    paddingHorizontal: 22, // 22px left/right
    paddingVertical: 18, // 18px top/bottom
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.deepForestGreen,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.09,
    shadowRadius: 10,
    elevation: 3,
  },
  
  // Profile Circle - Dark green avatar, radius 22px
  profileCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.lightGreen, // #294C3B
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Profile Initial - White capital "G", Inter bold, 19px
  profileInitial: {
    fontFamily: 'Inter',
    fontSize: 19,
    fontWeight: 'bold',
    color: colors.white,
  },
  
  // Salon Details - Vertical stack beside avatar
  salonDetails: {
    marginLeft: 12, // 12px left margin from avatar
    flex: 1,
  },
  
  // Salon Name - Inter bold, 17px, margin-bottom 3px
  salonName: {
    fontFamily: 'Inter',
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.darkGreen,
    marginBottom: 3,
  },
  
  // Service Name - Inter regular, 16px, margin-bottom 3px
  serviceName: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '400',
    color: colors.darkGreen,
    marginBottom: 3,
  },
  
  // Appointment Time - Inter regular, 15px
  appointmentTime: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '400',
    color: colors.gray, // #7B857B
  },
  
  // Star Rating Container - Horizontal row, centered beneath review card
  starRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16, // 16px margin-top
    paddingHorizontal: 20,
  },
  
  starContainer: {
    alignItems: 'center',
    marginHorizontal: 7, // 14px apart (7px each side)
    minWidth: 48, // Minimum touch target
    minHeight: 48,
  },
  
  // Star Icon - Flat gold, size 32px
  starIcon: {
    marginBottom: 4,
  },
  
  // Star Label - Inter regular, 13px, centered under icon
  starLabel: {
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: '400',
    color: colors.gray, // #78857B
    textAlign: 'center',
  },
  
  // Additional Feedback Section
  feedbackSection: {
    marginTop: 38, // 38px margin-top after stars
  },
  
  // Feedback Prompt - Inter medium, 16px, flush left
  feedbackPrompt: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '500',
    color: colors.darkGreen,
    marginBottom: 12,
  },
  
  // Feedback Input - Single line, placeholder "Valgfrit"
  feedbackInput: {
    width: '100%',
    height: 38,
    backgroundColor: colors.searchBarBg, // #FBF9F1
    borderRadius: 12,
    paddingHorizontal: 18, // 18px left padding
    fontFamily: 'Inter',
    fontSize: 16,
    color: colors.darkGreen,
    textAlignVertical: 'top',
  },
  
  // Photo Upload Section - White block, radius 14px, dashed outline
  photoUploadSection: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.lightGray, // #A0AEA8
    borderStyle: 'dashed',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14, // 14px horizontal padding
    paddingVertical: 16,
    marginTop: 20,
    minHeight: 48, // Minimum touch target
  },
  
  // Camera Icon - Flat camera, 25px, medium green
  cameraIcon: {
    marginRight: 8, // 8px margin-left from icon
  },
  
  // Photo Upload Label - Inter medium, 15px
  photoUploadLabel: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '500',
    color: colors.darkGreen,
  },
  
  // Submit Button - Deep forest green, full card width minus 18px margins
  submitButton: {
    width: width - 36, // Full width minus 18px left/right margin
    height: 50,
    backgroundColor: colors.deepForestGreen,
    borderRadius: 24, // Fully rounded radius
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 27, // 27px margin-top below photo upload section
    alignSelf: 'center',
    shadowColor: colors.deepForestGreen,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  
  // Submit Button Text - Inter bold, 18px, pure white
  submitButtonText: {
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },
  
  // Skip Button - Flush center, Inter regular, 16px
  skipButton: {
    alignItems: 'center',
    marginTop: 22, // 22px below primary button
    paddingVertical: 12,
    minHeight: 48, // Minimum touch target
  },
  
  skipButtonText: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '400',
    color: colors.darkGreen,
  },
});