import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  Animated,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, globalStyles } from '../../theme/styles';
import Header from '../../components/Header';

export default function ReviewScreen({ navigation, route }) {
  const { service } = route.params || {
    service: {
      name: 'Classic Manicure',
      salon: 'Gustav Salon',
      date: '24. april 2024 kl. 11:00'
    }
  };

  const [rating, setRating] = useState(5); // Default 5 stars as shown in design
  const [reviewText, setReviewText] = useState('');
  const [buttonScale] = useState(new Animated.Value(1));
  const [fadeAnim] = useState(new Animated.Value(0));
  const [starAnimations] = useState(Array.from({ length: 5 }, () => new Animated.Value(1)));

  React.useEffect(() => {
    // Fade in animation when screen loads
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleStarPress = (starIndex) => {
    // Animate star selection
    Animated.sequence([
      Animated.timing(starAnimations[starIndex], {
        toValue: 1.3,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(starAnimations[starIndex], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setRating(starIndex + 1);
  };

  const handleSendReview = () => {
    if (reviewText.trim() === '') {
      Alert.alert('Error', 'Please write a review before sending.');
      return;
    }

    // Animate button press
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
    ]).start(() => {
      // Show success message and navigate back
      Alert.alert('Success', 'Your review has been sent!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack()
        }
      ]);
    });
  };

  const getRatingText = (rating) => {
    const ratingTexts = ['', 'Dårlig', 'Okay', 'God', 'Meget god', 'Fantastisk'];
    return ratingTexts[rating] || '';
  };

  return (
    <View style={styles.container}>
      {/* Header with dark green background exactly as in design */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hvordan var din oplevelse?</Text>
      </View>
      
      <Animated.ScrollView 
        style={[styles.content, { opacity: fadeAnim }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Service Info Card - exactly as shown in design */}
        <View style={styles.serviceCard}>
          <View style={styles.serviceIcon}>
            <Text style={styles.serviceIconText}>G</Text>
          </View>
          <View style={styles.serviceInfo}>
            <Text style={styles.salonName}>{service.salon || 'Gustav Salon'}</Text>
            <Text style={styles.serviceName}>{service.name || 'Classic Manicure'}</Text>
            <Text style={styles.serviceDate}>{service.date || '24. april 2024 kl. 11:00'}</Text>
          </View>
        </View>

        {/* Rating Stars - exactly as shown in design */}
        <View style={styles.ratingSection}>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star, index) => (
              <TouchableOpacity
                key={star}
                onPress={() => handleStarPress(index)}
                activeOpacity={0.7}
              >
                <Animated.View style={{ transform: [{ scale: starAnimations[index] }] }}>
                  <Ionicons 
                    name={star <= rating ? 'star' : 'star-outline'} 
                    size={40} 
                    color={star <= rating ? '#FFD700' : '#E5E5E5'}
                    style={styles.star}
                  />
                </Animated.View>
              </TouchableOpacity>
            ))}
          </View>
          
          {/* Rating Labels - exactly as shown in design */}
          <View style={styles.ratingLabels}>
            <Text style={styles.ratingLabel}>Dårlig</Text>
            <Text style={styles.ratingLabel}>Okay</Text>
            <Text style={styles.ratingLabel}>God</Text>
            <Text style={styles.ratingLabel}>Meget god</Text>
            <Text style={styles.ratingLabel}>Fantastisk</Text>
          </View>
        </View>

        {/* Review Question - exactly as shown in design */}
        <View style={styles.reviewSection}>
          <Text style={styles.reviewQuestion}>Har du lyst til at uddybe?</Text>
          
          <View style={styles.reviewInputContainer}>
            <TextInput
              style={styles.reviewInput}
              placeholder="Valgfrit"
              placeholderTextColor={colors.text.secondary}
              value={reviewText}
              onChangeText={setReviewText}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Photo Upload Option - exactly as shown in design */}
          <TouchableOpacity style={styles.photoUpload} activeOpacity={0.8}>
            <Ionicons name="camera-outline" size={24} color={colors.text.secondary} />
            <Text style={styles.photoUploadText}>Del et billede{'\n'}af resultatet</Text>
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>

      {/* Send Review Button - exactly as shown in design */}
      <View style={styles.sendButtonContainer}>
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity 
            style={styles.sendButton}
            onPress={handleSendReview}
            activeOpacity={0.9}
          >
            <Text style={styles.sendButtonText}>Send anmeldelse</Text>
          </TouchableOpacity>
        </Animated.View>
        
        <TouchableOpacity style={styles.skipButton} onPress={() => navigation.goBack()}>
          <Text style={styles.skipButtonText}>Spring over</Text>
        </TouchableOpacity>
      </View>
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
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.white,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  serviceCard: {
    backgroundColor: colors.background.white,
    borderRadius: 12,
    padding: 20,
    margin: 20,
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
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  serviceIconText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.white,
  },
  serviceInfo: {
    flex: 1,
  },
  salonName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  serviceDate: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  ratingSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  star: {
    marginHorizontal: 8,
  },
  ratingLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  ratingLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
    flex: 1,
  },
  reviewSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  reviewQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  reviewInputContainer: {
    backgroundColor: colors.background.white,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reviewInput: {
    padding: 16,
    fontSize: 16,
    color: colors.text.primary,
    minHeight: 100,
  },
  photoUpload: {
    backgroundColor: colors.background.white,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderStyle: 'dashed',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  photoUploadText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
  },
  sendButtonContainer: {
    padding: 20,
    backgroundColor: colors.background.primary,
  },
  sendButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sendButtonText: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  skipButtonText: {
    fontSize: 16,
    color: colors.text.secondary,
    textDecorationLine: 'underline',
  },
});