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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      {/* Premium Animated Header */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: headerAnimatedValues.opacity,
            transform: [{ translateY: headerAnimatedValues.translateY }],
          }
        ]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.background.white} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>SANOVA</Text>
        </View>
        <TouchableOpacity onPress={handleCall} style={styles.callButton}>
          <Ionicons name="call" size={20} color={colors.background.white} />
        </TouchableOpacity>
      </Animated.View>
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Premium Hero Image */}
        <Animated.View 
          style={[
            styles.imageContainer,
            {
              opacity: imageAnimatedValues.opacity,
              transform: [{ scale: imageAnimatedValues.scale }],
            }
          ]}
        >
          <View style={styles.imageWrapper}>
            <View style={styles.serviceImage}>
              <View style={styles.imagePlaceholder}>
                <Ionicons name="cut" size={60} color={colors.text.secondary} />
                <Text style={styles.imageText}>Professional Haircut</Text>
              </View>
            </View>
            
            {/* Favorite Button */}
            <TouchableOpacity 
              style={styles.favoriteButton}
              onPress={handleFavorite}
              activeOpacity={0.8}
            >
              <Animated.View style={{ transform: [{ scale: favoriteScale }] }}>
                <Ionicons 
                  name={isFavorite ? "heart" : "heart-outline"} 
                  size={24} 
                  color={isFavorite ? "#FF6B6B" : colors.background.white} 
                />
              </Animated.View>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Premium Content */}
        <Animated.View 
          style={[
            styles.detailsContainer,
            {
              opacity: contentAnimatedValues.opacity,
              transform: [{ translateY: contentAnimatedValues.translateY }],
            }
          ]}
        >
          {/* Service Header */}
          <View style={styles.serviceHeader}>
            <View style={styles.serviceTitleContainer}>
              <Text style={styles.serviceName}>{service.name || 'Service Name'}</Text>
              <Text style={styles.salonName}>{service.salon || 'Salon Name'}</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>{service.price || 'Price'}</Text>
              <Text style={styles.duration}>{service.duration || 'Duration'}</Text>
            </View>
          </View>

          {/* Rating and Reviews */}
          <View style={styles.ratingContainer}>
            <View style={styles.ratingStars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons 
                  key={star}
                  name={star <= Math.floor(service.rating || 0) ? "star" : "star-outline"} 
                  size={16} 
                  color="#FFD700" 
                />
              ))}
            </View>
            <Text style={styles.ratingText}>{service.rating || 0} ({service.reviews || 0} reviews)</Text>
          </View>

          {/* Service Info Cards */}
          <View style={styles.infoCards}>
            <View style={styles.infoCard}>
              <Ionicons name="time-outline" size={20} color={colors.primary} />
              <Text style={styles.infoText}>{service.date || 'Date'}</Text>
            </View>
            <View style={styles.infoCard}>
              <Ionicons name="location-outline" size={20} color={colors.primary} />
              <Text style={styles.infoText}>{service.address || 'Address'}</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>About This Service</Text>
            <Text style={styles.description}>
              {showFullDescription ? (service.description || 'No description available') : ((service.description && service.description.length > 100) ? service.description.substring(0, 100) + '...' : (service.description || 'No description available'))}
            </Text>
            <TouchableOpacity 
              onPress={() => setShowFullDescription(!showFullDescription)}
              style={styles.readMoreButton}
            >
              <Text style={styles.readMoreText}>
                {showFullDescription ? 'Read Less' : 'Read More'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Services Included */}
          <View style={styles.servicesContainer}>
            <Text style={styles.sectionTitle}>Services Included</Text>
            {(service.services || []).map((item, index) => (
              <View key={index} style={styles.serviceItem}>
                <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
                <Text style={styles.serviceItemText}>{item}</Text>
              </View>
            ))}
          </View>

          {/* Amenities */}
          <View style={styles.amenitiesContainer}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenitiesGrid}>
              {(service.amenities || []).map((item, index) => (
                <View key={index} style={styles.amenityItem}>
                  <Ionicons name="checkmark" size={14} color={colors.primary} />
                  <Text style={styles.amenityText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Premium Action Buttons */}
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
        <TouchableOpacity 
          style={styles.directionsButton}
          onPress={handleDirections}
          activeOpacity={0.8}
        >
          <Ionicons name="navigate" size={20} color={colors.primary} />
          <Text style={styles.directionsButtonText}>Directions</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.bookButton}
          onPress={handleBookNow}
          activeOpacity={0.9}
        >
          <Text style={styles.bookButtonText}>Book Now</Text>
          <Ionicons name="arrow-forward" size={20} color={colors.background.white} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...premiumComponents.screenContainer,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: spacing.xxxl + 20,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadows.elevated,
  },
  backButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.round,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.title2,
    color: colors.background.white,
    fontFamily: 'serif',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  callButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.round,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  content: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  imageContainer: {
    height: 280,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.floating,
  },
  imageWrapper: {
    flex: 1,
    position: 'relative',
  },
  serviceImage: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  imageText: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  favoriteButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.card,
  },
  detailsContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl + 100, // Extra padding for action buttons
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  serviceTitleContainer: {
    flex: 1,
  },
  serviceName: {
    ...typography.title1,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  salonName: {
    ...typography.title3,
    color: colors.text.secondary,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    ...typography.title2,
    color: colors.primary,
    fontWeight: '700',
  },
  duration: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  ratingStars: {
    flexDirection: 'row',
    marginRight: spacing.sm,
  },
  ratingText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  infoCards: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  infoCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.white,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.card,
  },
  infoText: {
    ...typography.caption,
    color: colors.text.primary,
    marginLeft: spacing.sm,
    flex: 1,
  },
  descriptionContainer: {
    marginBottom: spacing.xl,
  },
  descriptionTitle: {
    ...typography.title3,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  description: {
    ...typography.body,
    color: colors.text.secondary,
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  readMoreButton: {
    alignSelf: 'flex-start',
  },
  readMoreText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  servicesContainer: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.title3,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  serviceItemText: {
    ...typography.body,
    color: colors.text.primary,
    marginLeft: spacing.sm,
  },
  amenitiesContainer: {
    marginBottom: spacing.xl,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    ...shadows.card,
  },
  amenityText: {
    ...typography.caption,
    color: colors.text.primary,
    marginLeft: spacing.xs,
  },
  actionButtonsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: spacing.lg,
    backgroundColor: colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    gap: spacing.md,
  },
  directionsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.white,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.primary,
    ...shadows.card,
  },
  directionsButtonText: {
    ...typography.bodyMedium,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  bookButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.elevated,
  },
  bookButtonText: {
    ...typography.bodyMedium,
    color: colors.background.white,
    fontWeight: '600',
    marginRight: spacing.sm,
  },
});
