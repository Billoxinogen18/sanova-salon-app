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
        <View style={styles.logoContainer}>
          <Image source={require('../../../assets/logo.png')} style={styles.logoImage} />
        </View>
        <Text style={styles.headerTitle}>SANOVA</Text>
        <Text style={styles.headerSubtitle}>Find urgent appointments</Text>
      </Animated.View>
      
      <View style={styles.content}>
        {/* Premium Animated Search Bar */}
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
            <Ionicons 
              name="search" 
              size={20} 
              color={searchFocused ? colors.primary : colors.text.secondary} 
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search urgent appointments..."
              placeholderTextColor={colors.text.secondary}
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
                <Ionicons name="close-circle" size={20} color={colors.text.secondary} />
              </TouchableOpacity>
            )}
          </Animated.View>
        </Animated.View>

        {/* Premium Animated Section Title */}
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
          <Text style={styles.sectionSubtitle}>Book your urgent appointment now</Text>
        </Animated.View>
        
        {/* Premium Animated Appointments List */}
        <ScrollView 
          style={styles.appointmentsContainer}
          showsVerticalScrollIndicator={false}
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
                    <Text style={styles.serviceName}>{item.service}</Text>
                    <Text style={styles.salonName}>{item.salon}</Text>
                    <Text style={styles.distance}>{item.distance}</Text>
                  </View>
                  <View style={styles.timeInfo}>
                    <Text style={styles.timeText}>{item.time}</Text>
                    <Ionicons name="chevron-forward" size={16} color={colors.text.secondary} />
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </ScrollView>
      </View>
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
    alignItems: 'center',
    borderBottomLeftRadius: borderRadius.lg,
    borderBottomRightRadius: borderRadius.lg,
    ...shadows.elevated,
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    ...shadows.card,
  },
  headerTitle: {
    ...typography.title2,
    color: colors.background.white,
    fontFamily: 'serif',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.background.white,
    opacity: 0.8,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.background.primary,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    marginTop: -borderRadius.lg,
    paddingTop: spacing.xl,
  },
  searchContainer: {
    marginBottom: spacing.xl,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.white,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 2,
    borderColor: colors.border.primary,
    ...shadows.card,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    ...typography.body,
    color: colors.text.primary,
  },
  clearButton: {
    padding: spacing.xs,
  },
  titleContainer: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.title2,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    ...typography.caption,
    color: colors.text.secondary,
    opacity: 0.8,
  },
  appointmentsContainer: {
    flex: 1,
    paddingBottom: spacing.xxxl,
  },
  appointmentCardContainer: {
    marginBottom: spacing.lg,
  },
  appointmentCard: {
    ...premiumComponents.premiumCard,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background.white,
    ...shadows.elevated,
  },
  appointmentInfo: {
    flex: 1,
  },
  serviceName: {
    ...typography.title3,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  salonName: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  distance: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  timeInfo: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  timeText: {
    ...typography.title3,
    color: colors.text.primary,
  },
  
  logoImage: {
    width: 24,
    height: 24,
    tintColor: colors.background.white,
  },
});