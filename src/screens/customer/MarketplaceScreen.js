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
  StatusBar,
  Image
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

const { width, height } = Dimensions.get('window');

export default function MarketplaceScreen({ navigation }) {
  const [searchText, setSearchText] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  // Animation controller
  // Removed animation controller

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

  // Beauty products exactly as shown in design screenshots
  const beautyProducts = [
    { id: 1, name: 'Moisturizing Shampoo', price: '150 kr', image: require('../../../assets/shampoo.png'), color: '#F5F1E8' },
    { id: 2, name: 'Hydrating Serum', price: '200 kr', image: require('../../../assets/hydratingserum.png'), color: '#8B4513' },
    { id: 3, name: 'Face Cream', price: '180 kr', image: require('../../../assets/facecream.png'), color: '#2D5A3D' },
    { id: 4, name: 'Body Lotion', price: '160 kr', image: require('../../../assets/bodylotion.png'), color: '#F5F1E8' },
    { id: 5, name: 'Body Lotion', price: '180 kr', image: require('../../../assets/bodylotion.png'), color: '#F5F1E8' },
    { id: 6, name: 'Hair Oil', price: '110 kr', image: require('../../../assets/hairoil.png'), color: '#F5F1E8' },
    { id: 7, name: 'Cleansing Oil', price: '180 kr', image: require('../../../assets/cleansingoil.png'), color: '#2D5A3D' },
    { id: 8, name: 'Cleansing Oil', price: '180 kr', image: require('../../../assets/cleansingoil.png'), color: '#F5F1E8' },
  ];

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
      // Cleanup animations if needed
      try {
        productsAnimatedValues.forEach(values => {
          if (values && values.opacity && typeof values.opacity.stopAnimation === 'function') {
            values.opacity.stopAnimation();
          }
          if (values && values.translateY && typeof values.translateY.stopAnimation === 'function') {
            values.translateY.stopAnimation();
          }
          if (values && values.scale && typeof values.scale.stopAnimation === 'function') {
            values.scale.stopAnimation();
          }
        });
      } catch (error) {
        console.warn('Animation cleanup error:', error);
      }
    };
  }, []);

  const startEntranceAnimations = () => {
    // Start animations directly with proper timing
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
      // Product animations
      ...productsAnimatedValues.map(values => 
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
          {/* Product Icon/SVG - Centered horizontally, 38px wide × 62px tall, 20px top margin, no background color */}
          <View style={styles.productIconContainer}>
            <Image source={item.image} style={styles.productIcon} />
          </View>
          {/* Product Title - Centered, 16px, weight 600, #222, 14px below icon */}
          <Text style={styles.productTitle} numberOfLines={1} ellipsizeMode="tail">
            {item.name.length > 17 ? item.name.substring(0, 17) + '...' : item.name}
          </Text>
          {/* Product Price - Centered, 14px, #545454, 3px below product name */}
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor="#213527" />
      
      {/* Header Section - Deep green (#213527) - 116px height */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: headerAnimatedValues.opacity,
            transform: [{ translateY: headerAnimatedValues.translateY }],
          }
        ]}
      >
        {/* Logo Leaf & SANOVA - Centered horizontally and vertically */}
        <View style={styles.logoContainer}>
          {/* Leaf icon SVG - 34px width, 20px height, 15px from top */}
          <Image 
            source={require('../../../assets/logo.png')}
            style={styles.logoIcon}
            resizeMode="contain"
          />
          {/* SANOVA text - 26px, uppercase serif, white, letter-spacing 2px, 7px margin under icon */}
          <Text style={styles.headerTitle}>SANOVA</Text>
        </View>
      </Animated.View>
      
      {/* Main Marketplace Card - Very light cream (#FAF6EC) */}
      <View style={styles.marketplaceCard}>
        {/* Search Bar - 26px from card top edge, 376px width (88% of container), 52px height */}
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
            {/* Black magnifier icon - 24x24px, left-aligned, 18px from bar edge */}
            <Ionicons 
              name="search" 
              size={24} 
              color="#000000" 
              style={styles.searchIcon}
            />
            {/* Search text - "Search", 20px, #353535, 10px left margin after icon */}
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="#353535"
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
                <Ionicons name="close-circle" size={20} color="#353535" />
              </TouchableOpacity>
            )}
          </Animated.View>
        </Animated.View>

        {/* Beauty Products Title - 28px below search bar, left-aligned, 28px from left card edge */}
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
        </Animated.View>
        
        {/* Product Grid Section - 2 columns, exact spacing and dimensions */}
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
          scrollEnabled={false} // Disable scroll since we're in ScrollView
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF6EC', // Exact cream background
  },
  
  // Header Section - Deep green (#213527) - 116px height
  header: {
    backgroundColor: '#213527', // Exact deep green color
    height: 116, // Exact height from screen top to base of green area, including status bar
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
    marginBottom: 7, // 7px margin under icon
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
  
  // Main Marketplace Card - Very light cream (#FAF6EC)
  marketplaceCard: {
    backgroundColor: '#FAF6EC', // Very light cream
    width: '100%', // 428px (100% safe area)
    height: 722, // Extends down to top of navigation bar
    borderTopLeftRadius: 28, // Top corners only
    borderTopRightRadius: 28,
    paddingHorizontal: 26, // Global padding for content
    paddingTop: 26, // 26px from card top edge
  },
  
  // Search Bar - 376px width (88% of container), 52px height
  searchContainer: {
    alignSelf: 'center',
    width: '88%', // 376px (88% of container)
    marginBottom: 28, // 28px below search bar
  },
  searchBar: {
    width: '100%',
    height: 52, // Exact height
    backgroundColor: '#FFFFFF', // White background
    borderRadius: 26, // Fully pill-shaped
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18, // 18px from bar edge
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 9,
  },
  searchIcon: {
    marginRight: 10, // 10px left margin after icon
  },
  searchInput: {
    flex: 1,
    fontSize: 20, // 20px font size
    color: '#353535', // Color #353535
    fontWeight: '400',
  },
  clearButton: {
    padding: 4,
  },
  
  // Beauty Products Title - 28px from left card edge
  titleContainer: {
    marginBottom: 22, // 22px below section title
    marginLeft: 2, // 28px from left card edge (26px + 2px)
  },
  sectionTitle: {
    fontSize: 21, // 21px
    fontWeight: '700', // Bold
    color: '#222222', // #222
  },
  
  // Product Grid Section - 2 columns grid
  productsContainer: {
    paddingBottom: 50, // Extra padding to avoid cutoff
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 22, // 22px between rows
    paddingHorizontal: 2, // 28px left/right padding adjustment
  },
  productCardContainer: {
    width: '48%', // Approximate for 163px with 16px gap
  },
  productCard: {
    width: 163, // 163px width
    height: 132, // 132px height
    backgroundColor: '#FFFFFF', // White background
    borderRadius: 18, // 18px corner radius
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3, // 3dp inner padding
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.09,
    shadowRadius: 10,
    paddingVertical: 20, // Top margin inside card
  },
  
  // Product Content - Centered horizontally, 38px wide × 62px tall, 20px top margin, no background color
  productIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14, // 14px below icon
    // No background color as specified
  },
  productIcon: {
    width: 38, // 38px wide
    height: 62, // 62px tall
    resizeMode: 'contain',
  },
  
  // Product Title - Centered, 16px, weight 600, #222, 14px below icon
  productTitle: {
    fontSize: 16, // 16px
    fontWeight: '600', // Weight 600
    color: '#222222', // #222
    textAlign: 'center',
    marginBottom: 3, // 3px below product name
  },
  
  // Product Price - Centered, 14px, #545454, 3px below product name
  productPrice: {
    fontSize: 14, // 14px
    color: '#545454', // #545454
    textAlign: 'center',
  },
});