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
          {/* Leaf SVG - Same dimensions as other screens */}
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
          {/* Appointment Card - 375px width, 96px height, white background, 18px radius */}
          <View style={styles.appointmentCard}>
            {/* Profile circle - left side, 44px diameter, #2C5A3E background */}
            <View style={styles.profileCircle}>
              <Text style={styles.profileInitial}>G</Text>
            </View>
            
            {/* Appointment info - right side of circle */}
            <View style={styles.appointmentInfo}>
              <Text style={styles.serviceName}>Classic Manicure</Text>
              <Text style={styles.salonName}>Gustav Salon</Text>
              <Text style={styles.dateTime}>24. april 2024 kl. 11.00</Text>
            </View>
          </View>

          {/* 5-Star Rating System - Centered, 34px below appointment card */}
          <View style={styles.ratingSection}>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  style={styles.starButton}
                  onPress={() => handleRatingSelect(star)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={star <= selectedRating ? 'star' : 'star-outline'}
                    size={38} // 38px star size
                    color="#FEBC45" // Gold color #FEBC45
                    style={styles.starIcon}
                  />
                </TouchableOpacity>
              ))}
            </View>
            
            {/* Danish labels under stars - "Dårlig", "Okay", "God", "Meget god", "Fantastisk" */}
            <View style={styles.labelsContainer}>
              {ratingLabels.map((label, index) => (
                <Text key={index} style={styles.ratingLabel}>{label}</Text>
              ))}
            </View>
          </View>

          {/* Comment Input Section - 26px below rating labels */}
          <View style={styles.commentSection}>
            <Text style={styles.commentPrompt}>Har du lyst til at uddybe?</Text>
            <TextInput
              style={styles.commentInput}
              placeholder="Valgfrit"
              placeholderTextColor="#626463"
              value={feedbackText}
              onChangeText={setFeedbackText}
              multiline
              maxLength={500}
            />
          </View>

          {/* Photo Upload Section - 18px below comment input */}
          <TouchableOpacity style={styles.photoSection} activeOpacity={0.8}>
            <Ionicons name="camera" size={24} color="#626463" style={styles.cameraIcon} />
            <Text style={styles.photoLabel}>Del et billede af resultatet</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Action Buttons */}
        <View style={styles.buttonsContainer}>
          {/* Submit Button - 344px width, 51px height, #163A24 background */}
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleSubmitReview}
              activeOpacity={0.9}
            >
              <Text style={styles.submitButtonText}>Send anmeldelse</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Skip Button - 18px below submit button */}
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>Spring over</Text>
          </TouchableOpacity>
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
    width: 80,
    height: 50,
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
    paddingTop: 40, // 40px margin-top
  },
  
  // Content Section
  contentSection: {
    flex: 1,
  },
  
  // Appointment Card - 375px width, 96px height, white background, 18px radius
  appointmentCard: {
    width: 375, // 375px width
    height: 96, // 96px height
    backgroundColor: '#FFFFFF', // White background
    borderRadius: 18, // 18px radius
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 19, // 19px internal horizontal padding
    alignSelf: 'center',
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.09,
    shadowRadius: 11,
    marginBottom: 34, // 34px below appointment card
  },
  
  // Profile circle - left side, 44px diameter, #2C5A3E background
  profileCircle: {
    width: 44, // 44px diameter
    height: 44,
    borderRadius: 22, // Half of diameter for perfect circle
    backgroundColor: '#2C5A3E', // #2C5A3E background
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15, // 15px right margin from circle
  },
  
  // Profile initial - White "G", 19px, weight bold
  profileInitial: {
    fontSize: 19, // 19px
    fontWeight: 'bold',
    color: '#FFFFFF', // White
  },
  
  // Appointment info - right side of circle
  appointmentInfo: {
    flex: 1,
  },
  
  // Service name - "Classic Manicure", 18px, weight 700, #232323
  serviceName: {
    fontSize: 18, // 18px
    fontWeight: '700', // Weight 700
    color: '#232323', // #232323
    marginBottom: 8, // 8px below service name
  },
  
  // Salon name - "Gustav Salon", 15px, #484848
  salonName: {
    fontSize: 15, // 15px
    color: '#484848', // #484848
    marginBottom: 8, // 8px below salon name
  },
  
  // Date time - "24. april 2024 kl. 11.00", 15px, #747474
  dateTime: {
    fontSize: 15, // 15px
    color: '#747474', // #747474
  },
  
  // 5-Star Rating System - Centered, 34px below appointment card
  ratingSection: {
    alignItems: 'center',
    marginBottom: 26, // 26px below rating labels
  },
  
  // Stars container - Horizontal row of 5 stars
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8, // 8px below stars
  },
  
  // Star button - Individual star touch target
  starButton: {
    padding: 4, // Touch target padding
    marginHorizontal: 6, // 12px between stars (6px each side)
  },
  
  // Star icon - 38px star size, #FEBC45 gold color
  starIcon: {
    // No additional styling needed
  },
  
  // Labels container - Danish labels under stars
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 8, // Align with stars
  },
  
  // Rating label - "Dårlig", "Okay", "God", "Meget god", "Fantastisk", 13px, #626463
  ratingLabel: {
    fontSize: 13, // 13px
    color: '#626463', // #626463
    textAlign: 'center',
    flex: 1, // Equal spacing
  },
  
  // Comment Input Section - 26px below rating labels
  commentSection: {
    marginBottom: 18, // 18px below comment input
  },
  
  // Comment prompt - "Har du lyst til at uddybe?", 18px, #626463
  commentPrompt: {
    fontSize: 18, // 18px
    color: '#626463', // #626463
    marginBottom: 16, // 16px below prompt
  },
  
  // Comment input - Multi-line text input, white background, 15px radius
  commentInput: {
    backgroundColor: '#FFFFFF', // White background
    borderRadius: 15, // 15px radius
    paddingHorizontal: 18, // 18px horizontal padding
    paddingVertical: 16, // 16px vertical padding
    fontSize: 16, // 16px text
    color: '#232323', // Text color
    textAlignVertical: 'top', // Align text to top for multiline
    minHeight: 80, // Minimum height for multiline
    elevation: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  
  // Photo Upload Section - 18px below comment input
  photoSection: {
    backgroundColor: '#FFFFFF', // White background
    borderRadius: 15, // 15px radius
    borderWidth: 2,
    borderColor: '#E5E5E5', // Light border
    borderStyle: 'dashed',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18, // 18px horizontal padding
    paddingVertical: 20, // 20px vertical padding
    elevation: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  
  // Camera icon - 24px camera icon, #626463 color
  cameraIcon: {
    marginRight: 12, // 12px right margin from icon
  },
  
  // Photo label - "Del et billede af resultatet", 16px, #626463
  photoLabel: {
    fontSize: 16, // 16px
    color: '#626463', // #626463
  },
  
  // Bottom Action Buttons
  buttonsContainer: {
    alignItems: 'center',
    paddingBottom: 40, // 40px margin-bottom from safe area
    marginTop: 'auto', // Push to bottom
  },
  
  // Submit Button - 344px width, 51px height, #163A24 background
  submitButton: {
    width: 344, // 344px width
    height: 51, // 51px height
    backgroundColor: '#163A24', // #163A24 background
    borderRadius: 25, // Pill-shaped radius 25px
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18, // 18px below submit button
  },
  
  // Submit button text - "Send anmeldelse", #FFF, 20px, weight 600
  submitButtonText: {
    fontSize: 20, // 20px
    color: '#FFFFFF', // #FFF
    fontWeight: '600', // Weight 600
  },
  
  // Skip Button - "Spring over", 18px below submit button
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  
  // Skip button text - "Spring over", #626463, 18px
  skipButtonText: {
    fontSize: 18, // 18px
    color: '#626463', // #626463
    textAlign: 'center',
  },
});