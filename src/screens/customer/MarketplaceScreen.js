import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  FlatList, 
  Animated, 
  TextInput, 
  Dimensions,
  StatusBar 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { 
  typography, 
  spacing, 
  shadows, 
  borderRadius, 
  premiumComponents 
} from '../../theme/premiumStyles';
import { 
  animationSequences, 
  AnimationController, 
  microAnimations 
} from '../../theme/animations';

const { width, height } = Dimensions.get('window');

export default function MarketplaceScreen({ navigation }) {
  const [searchText, setSearchText] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  // Animation controller
  const animationController = useRef(new AnimationController()).current;

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

  const productsAnimatedValues = useRef([]).current;
  const searchBorderAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    
    // Initialize product animations
    if (productsAnimatedValues.length === 0) {
      beautyProducts.forEach((_, index) => {
        productsAnimatedValues.push({
          opacity: new Animated.Value(0),
          translateY: new Animated.Value(30),
          scale: new Animated.Value(0.9),
        });
      });
    }

    // Start entrance animations
    startEntranceAnimations();

    return () => {
      animationController.stopAllAnimations();
    };
  }, []);

  const startEntranceAnimations = () => {
    const headerAnimation = animationSequences.fadeInUp(headerAnimatedValues, 0);
    const searchAnimation = animationSequences.fadeInUp(searchAnimatedValues, 200);
    const titleAnimation = animationSequences.fadeInUp(titleAnimatedValues, 400);
    
    // Stagger product animations
    const productAnimations = productsAnimatedValues.map((values, index) => 
      animationSequences.fadeInUp(values, 600 + (index * 100))
    );

    animationController.registerAnimation('entrance', 
      Animated.parallel([
        headerAnimation,
        searchAnimation,
        titleAnimation,
        ...productAnimations,
      ])
    );

    animationController.animations.get('entrance').start();
  };

  const handleSearchFocus = () => {
    setSearchFocused(true);
    Animated.parallel([
      microAnimations.inputFocus(searchBorderAnimation, searchAnimatedValues.scale),
    ]).start();
  };

  const handleSearchBlur = () => {
    setSearchFocused(false);
    Animated.parallel([
      microAnimations.inputBlur(searchBorderAnimation, searchAnimatedValues.scale),
    ]).start();
  };

  // Beauty products exactly as shown in design screenshots
  const beautyProducts = [
    { id: 1, name: 'Moisturizing Shampoo', price: '150 kr', emoji: '🧴', color: '#F4E4BC' },
    { id: 2, name: 'Hydrating Serum', price: '200 kr', emoji: '🧴', color: '#8B4513' },
    { id: 3, name: 'Face Cream', price: '180 kr', emoji: '🟢', color: '#2D5A3D' },
    { id: 4, name: 'Body Lotion', price: '160 kr', emoji: '🧴', color: '#F4E4BC' },
    { id: 5, name: 'Body Lotion', price: '180 kr', emoji: '🧴', color: '#F4E4BC' },
    { id: 6, name: 'Hair Oil', price: '110 kr', emoji: '🧴', color: '#F4E4BC' },
    { id: 7, name: 'Cleansing Oil', price: '180 kr', emoji: '🟢', color: '#2D5A3D' },
    { id: 8, name: 'Cleansing Oil', price: '180 kr', emoji: '🧴', color: '#F4E4BC' },
  ];

  const handleProductPress = (item, index) => {
    // Button press animation
    const productScale = new Animated.Value(1);
    Animated.sequence([
      Animated.timing(productScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(productScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start(() => {
      navigation.navigate('ProductDetail', { product: item });
    });
  };

  const renderProduct = ({ item, index }) => {
    const animatedValues = productsAnimatedValues[index] || {
      opacity: new Animated.Value(1),
      translateY: new Animated.Value(0),
      scale: new Animated.Value(1),
    };

    return (
      <Animated.View
        style={[
          styles.productCardContainer,
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
          style={styles.productCard}
          onPress={() => handleProductPress(item, index)}
          activeOpacity={0.9}
        >
          <View style={[styles.productImageContainer, { backgroundColor: item.color }]}>
            <Text style={styles.productEmoji}>{item.emoji}</Text>
          </View>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>{item.price}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const searchBorderColor = searchBorderAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border.primary, colors.primary],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      {/* Animated Header with premium design */}
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
          <Ionicons name="leaf" size={24} color={colors.background.white} />
        </View>
        <Text style={styles.headerTitle}>SANOVA</Text>
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
              {
                borderColor: searchBorderColor,
              }
            ]}
          >
            <Ionicons 
              name="search" 
              size={20} 
              color={searchFocused ? colors.primary : colors.text.secondary} 
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search beauty products..."
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
          <Text style={styles.sectionTitle}>Beauty Products</Text>
          <Text style={styles.sectionSubtitle}>Discover premium beauty essentials</Text>
        </Animated.View>
        
        {/* Premium Products Grid with Animations */}
        <FlatList
          data={beautyProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.productsContainer}
          removeClippedSubviews={false}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          windowSize={10}
          scrollEventThrottle={16}
        />
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
  productsContainer: {
    paddingBottom: spacing.xxxl,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  productCardContainer: {
    width: '48%',
  },
  productCard: {
    ...premiumComponents.premiumCard,
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background.white,
    borderRadius: borderRadius.lg,
    ...shadows.elevated,
  },
  productImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadows.card,
  },
  productEmoji: {
    fontSize: 28,
  },
  productName: {
    ...typography.captionMedium,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
    lineHeight: 16,
  },
  productPrice: {
    ...typography.bodyMedium,
    color: colors.accent,
    fontWeight: '700',
  },
});