import React, { useRef, useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Animated, 
  TextInput, 
  Platform, 
  StatusBar, 
  Dimensions,
  Image
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { 
  typography, 
  spacing, 
  shadows, 
  borderRadius, 
  premiumComponents 
} from '../../theme/premiumStyles';
// Removed animations

const { width, height } = Dimensions.get('window');

export default function MapScreen({ navigation }) {
  console.log('🗺️ MapScreen component rendering...');
  
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searchFocused, setSearchFocused] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef(null);
  const [region, setRegion] = useState({
    latitude: 40.7128, // New York coordinates for testing
    longitude: -74.0060,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  
  console.log('🗺️ MapScreen state - mapReady:', mapReady, 'region:', region);

  // Animation controller
  // Removed animation controller

  // Animated values
  const headerAnimatedValues = useRef({
    opacity: new Animated.Value(1), // Start visible
    translateY: new Animated.Value(0), // Start at normal position
  }).current;

  const mapAnimatedValues = useRef({
    opacity: new Animated.Value(1), // Start visible
    scale: new Animated.Value(1), // Start at normal scale
  }).current;

  const searchAnimatedValues = useRef({
    opacity: new Animated.Value(1), // Start visible
    translateY: new Animated.Value(0), // Start at normal position
    scale: new Animated.Value(1),
  }).current;

  const productsAnimatedValues = useRef({
    opacity: new Animated.Value(1), // Start visible
    translateY: new Animated.Value(0), // Start at normal position
  }).current;

  const searchBorderAnimation = useRef(new Animated.Value(0)).current;
  const filterButtonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    console.log('🗺️ MapScreen useEffect triggered');
    console.log('🗺️ Initial region state:', region);
    console.log('🗺️ Initial mapReady state:', mapReady);
    
    StatusBar.setBarStyle('light-content');
    
    console.log('🗺️ MapScreen mounted, requesting location...');
    
    // Request location permissions immediately
    requestLocationPermission();

    // Fallback: show map after 2 seconds even if not ready
    // Removed fallback timer to prevent interference with map loading

    return () => {
      console.log('🗺️ MapScreen useEffect cleanup');
      // No timer to clear anymore
    };
  }, []);

  const startEntranceAnimations = () => {
    const headerAnimation = Animated.parallel([
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
    ]);
    // Map is already visible, no animation needed
    const mapAnimation = Animated.timing(mapAnimatedValues.opacity, {
      toValue: 1,
      duration: 0, // No animation
      useNativeDriver: true,
    });
    const searchAnimation = Animated.parallel([
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
    ]);
    const productsAnimation = Animated.parallel([
      Animated.timing(productsAnimatedValues.opacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(productsAnimatedValues.translateY, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]);

    // Start animations directly (map is always visible)
    Animated.stagger(200, [
      headerAnimation,
      searchAnimation,
      productsAnimation,
    ]).start();
  };

  const requestLocationPermission = async () => {
    console.log('🗺️ Requesting location permission...');
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        try {
          const loc = await Location.getCurrentPositionAsync({ 
            accuracy: Location.Accuracy.Balanced,
            timeout: 10000, // 10 second timeout
            maximumAge: 60000, // Accept cached location up to 1 minute old
          });
          const nextRegion = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            latitudeDelta: 0.0922, // Fixed zoom level
            longitudeDelta: 0.0421, // Fixed zoom level
          };
          setRegion(nextRegion);
          if (mapRef.current) {
            mapRef.current.animateToRegion(nextRegion, 1000);
          }
        } catch (locationError) {
          console.warn('Could not get current location, using default Iceland coordinates:', locationError.message);
          // Keep using the default Iceland coordinates
        }
      } else {
        console.warn('Location permission denied, using default Iceland coordinates');
        // Keep using the default Iceland coordinates
      }
    } catch (error) {
      console.warn('Error requesting location permission, using default coordinates:', error.message);
      // Keep using the default Iceland coordinates
    }
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

  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    hair: true,
    nails: true,
    massage: true,
    spa: true,
  });

  const handleFilterPress = () => {
    Animated.sequence([
      Animated.timing(filterButtonScale, { toValue: 0.9, duration: 100, useNativeDriver: true }),
      Animated.timing(filterButtonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start(() => {
      setShowFilters(!showFilters);
    });
  };

  const toggleFilter = (filterType) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: !prev[filterType]
    }));
  };

  const fetchPlaces = async (text) => {
    setSearchText(text);
    if (!text || text.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      // Use the same API key that's in your Android manifest
      const apiKey = "AIzaSyBD61clYyqUPsJcPsEZ_fPAQRJv1XDLwcQ";
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(text)}&location=${region.latitude},${region.longitude}&radius=20000&key=${apiKey}`;
      const res = await fetch(url);
      const json = await res.json();
      
      // Add error checking
      if (json.status !== 'OK' && json.status !== 'ZERO_RESULTS') {
        console.error('Places API Error:', json.status, json.error_message);
        setSuggestions([]);
        return;
      }
      
      setSuggestions(json?.predictions?.slice(0, 5) || []);
    } catch (e) {
      console.error('Places API fetch error:', e);
      setSuggestions([]);
    }
  };

  // Generate random salon markers around user location (reduced to prevent memory issues)
  const generateSalonMarkers = (userLat, userLng) => {
    const salons = [
      { name: 'Nordic Beauty', description: 'Hair & Spa', emoji: '💇‍♀️', color: '#4A6741', type: 'hair' },
      { name: 'Icelandic Style', description: 'Hair & Nails', emoji: '💅', color: '#8B4513', type: 'nails' },
      { name: 'Arctic Glow', description: 'Beauty & Wellness', emoji: '✨', color: '#2D5A3D', type: 'spa' },
      { name: 'Fjord Salon', description: 'Hair & Makeup', emoji: '💄', color: '#4A6741', type: 'hair' },
      { name: 'Aurora Spa', description: 'Massage & Wellness', emoji: '🧘‍♀️', color: '#8B4513', type: 'massage' },
    ]; // Reduced from 10 to 5 markers

    return salons.map((salon, index) => {
      // Generate random coordinates within 3km radius (reduced radius)
      const radius = 0.03; // ~3km
      const angle = (index * 72) * (Math.PI / 180); // Distribute evenly
      const distance = Math.random() * radius;
      
      const lat = userLat + (distance * Math.cos(angle));
      const lng = userLng + (distance * Math.sin(angle));
      
      return {
        ...salon,
        coordinate: { latitude: lat, longitude: lng }
      };
    });
  };

  const beautyProducts = [
    { id: 1, name: 'Moisturizing Shampoo', price: '150 kr' },
    { id: 2, name: 'Hydrating Serum', price: '200 kr' },
    { id: 3, name: 'Face Cream', price: '180 kr' },
  ];

  // Helper function to get product images based on specifications
  const getProductImage = (productName) => {
    switch (productName.toLowerCase()) {
      case 'moisturizing shampoo':
        return require('../../../assets/shampoo.png');
      case 'hydrating serum':
        return require('../../../assets/hydratingserum.png');
      case 'face cream':
        return require('../../../assets/facecream.png');
      default:
        return require('../../../assets/defaultproduct.png');
    }
  };

  const searchBorderColor = searchBorderAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border.primary, colors.primary],
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      {/* Header Section - Deep Green (#213527) - 122px height */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: headerAnimatedValues.opacity,
            transform: [{ translateY: headerAnimatedValues.translateY }],
          }
        ]}
      >
        {/* Logo Placement - Centered horizontally and vertically */}
        <View style={styles.logoContainer}>
          {/* Leaf symbol - 36px wide, 22px high */}
          <Image 
            source={require('../../../assets/logo.png')}
            style={styles.logoIcon}
            resizeMode="contain"
          />
          {/* SANOVA text - 26px, Playfair Display, letter-spacing 2px */}
          <Text style={styles.headerTitle}>SANOVA</Text>
        </View>
      </Animated.View>

      {/* Map Card - Cream (#FAF6EC) - Exact positioning */}
      <View style={styles.mapCard}>
        {/* Map Content - 340px height, 32px border radius (top only) */}
        <View style={styles.mapContentContainer}>
          {!mapReady && (
            <View style={styles.mapFallback}>
              <Text style={styles.mapFallbackText}>Loading Map...</Text>
              <Text style={styles.mapFallbackSubtext}>Finding nearby salons</Text>
            </View>
          )}
          
          <MapView
            ref={mapRef}
            style={styles.mapView}
            initialRegion={region}
            onMapReady={() => {
              console.log('🗺️ React Native MapView loaded!');
              setMapReady(true);
            }}
            onRegionChangeComplete={(newRegion) => {
              setRegion(newRegion);
            }}
            showsUserLocation={true}
            showsMyLocationButton={false}
            showsCompass={false}
            mapType="standard"
            loadingEnabled={true}
            loadingIndicatorColor="#213527"
            loadingBackgroundColor="#FAF6EC"
          >
            {/* Map Markers - Using custom mapmarker.png with optimized loading */}
            {generateSalonMarkers(region.latitude, region.longitude).map((salon, index) => (
              <Marker
                key={index}
                coordinate={salon.coordinate}
                title={salon.name.length > 17 ? salon.name.substring(0, 17) + '...' : salon.name}
                description={salon.description}
                onPress={() => {
                  const salonData = {
                    ...salon,
                    id: `salon_${index}`,
                    rating: 4.5 + Math.random() * 0.5,
                    address: `${salon.name} Address, Reykjavik`,
                    phone: '+354 123 4567',
                    hours: 'Mon-Fri: 9:00-18:00',
                    description: salon.description,
                    services: [
                      { name: "Haircut", price: '250 kr' },
                      { name: "Styling", price: '200 kr' },
                      { name: "Coloring", price: '400 kr' },
                    ]
                  };
                  navigation.navigate('SalonDetail', { salon: salonData });
                }}
              >
                <Image 
                  source={require('../../../assets/haircut.png')} 
                  style={styles.mapMarkerImage}
                  resizeMode="contain"
                />
              </Marker>
            ))}
          </MapView>
          
          {/* Map Filter Button - Circular, top right, 46x46px */}
          <Animated.View
            style={[
              styles.mapFilterButton,
              { transform: [{ scale: filterButtonScale }] }
            ]}
          >
            <TouchableOpacity 
              style={styles.filterButtonStyle}
              onPress={handleFilterPress}
              activeOpacity={0.8}
            >
              <Ionicons name="funnel-outline" size={28} color="#FFFFFF" />
            </TouchableOpacity>
          </Animated.View>
        </View>
        
        {/* Filter Panel */}
        {showFilters && (
          <Animated.View style={styles.filterPanel}>
            <Text style={styles.filterTitle}>Filter by Service</Text>
            <View style={styles.filterOptions}>
              {Object.entries(selectedFilters).map(([filterType, isSelected]) => (
                <TouchableOpacity
                  key={filterType}
                  style={[
                    styles.filterOption,
                    isSelected && styles.filterOptionSelected
                  ]}
                  onPress={() => toggleFilter(filterType)}
                >
                  <Text style={[
                    styles.filterOptionText,
                    isSelected && styles.filterOptionTextSelected
                  ]}>
                    {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Floating Search Bar - Inside map */}
        <View style={styles.floatingSearchBar}>
          <Animated.View 
            style={[
              styles.searchBarContainer,
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
              <Ionicons name="search" size={20} color="#626463" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search"
                placeholderTextColor="#626463"
                value={searchText}
                onChangeText={setSearchText}
                onFocus={() => {
                  setSearchFocused(true);
                  Animated.timing(searchBorderColor, {
                    toValue: '#213527',
                    duration: 200,
                    useNativeDriver: false,
                  }).start();
                }}
                onBlur={() => {
                  setSearchFocused(false);
                  Animated.timing(searchBorderColor, {
                    toValue: '#E5E5E5',
                    duration: 200,
                    useNativeDriver: false,
                  }).start();
                }}
              />
            </Animated.View>
            
            {/* Search Suggestions */}
            {searchFocused && searchSuggestions.length > 0 && (
              <Animated.View style={styles.searchSuggestions}>
                {searchSuggestions.slice(0, 3).map((s, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionItem}
                    onPress={async () => {
                      try {
                        const details = await getPlaceDetails(s.place_id);
                        if (details) {
                          const loc = details.geometry.location;
                          if (mapRef.current) {
                            const nextRegion = {
                              latitude: loc.lat,
                              longitude: loc.lng,
                              latitudeDelta: 0.02,
                              longitudeDelta: 0.02,
                            };
                            setRegion(nextRegion);
                            mapRef.current.animateToRegion(nextRegion, 1500);
                          }
                        }
                      } catch (error) {
                        console.error('Place details fetch error:', error);
                      }
                    }}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="location-outline" size={16} color="#444444" />
                    <Text style={styles.suggestionText}>{s.description}</Text>
                  </TouchableOpacity>
                ))}
              </Animated.View>
            )}
          </Animated.View>
        </View>
      </View>
      
      {/* Beauty Products Section - "Beauty Products" title, 21px bold, #1A1A1A */}
      <Animated.View 
        style={[
          styles.beautyProductsSection,
          {
            opacity: productsAnimatedValues.opacity,
            transform: [{ translateY: productsAnimatedValues.translateY }],
          }
        ]}
      >
        {/* Section Title - 18px below search bar, 24px left margin */}
        <Text style={styles.beautyProductsTitle}>Beauty Products</Text>
        
        {/* Product Cards - Horizontal scroll, 2 columns grid view */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.productsScrollView}
          contentContainerStyle={styles.productsScrollContainer}
        >
          {beautyProducts.map((product, index) => (
            <TouchableOpacity 
              key={product.id} 
              style={[
                styles.beautyProductCard,
                index === 0 && styles.firstProductCard,
              ]}
              onPress={() => {
                navigation.navigate('ProductDetail', { product });
              }}
              activeOpacity={0.9}
            >
              {/* Product Icon - 46px tall, 20px top margin inside card, no background color */}
              <View style={styles.productIconContainer}>
                <Image 
                  source={getProductImage(product.name)} 
                  style={styles.productIcon}
                />
              </View>
              {/* Product Title - 16px, weight 600, #222, 14px below icon */}
              <Text style={styles.beautyProductTitle}>{product.name}</Text>
              {/* Product Price - 14px, #545454, 3px below product name */}
              <Text style={styles.beautyProductPrice}>{product.price}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF6EC', // Exact cream background
  },
  
  // Header Section - Deep Green (#213527) - 122px height
  header: {
    backgroundColor: '#213527', // Exact deep green color
    height: 122, // Exact height including status bar
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.20,
    shadowRadius: 24,
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
    fontFamily: 'System', // Playfair Display equivalent
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 2, // 2px letter spacing
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  
  // Map Card - Cream (#FAF6EC) - Top corners 32px radius
  mapCard: {
    backgroundColor: '#FAF6EC', // Cream background
    width: '100%', // 428px (100% safe area)
    height: 500, // Increased height to make map larger
    borderTopLeftRadius: 32, // Top corners only
    borderTopRightRadius: 32,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.20,
    shadowRadius: 24,
  },
  mapContentContainer: {
    flex: 1,
    position: 'relative',
  },
  mapView: {
    flex: 1,
    backgroundColor: '#FAF6EC', // Pale yellow/beige grid
  },
  mapFallback: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FAF6EC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapFallbackText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  mapFallbackSubtext: {
    fontSize: 14,
    color: '#626463',
  },
  
  // Map Markers - 48x48px, perfect circle, soft gold (#CAB28D)
  mapMarker: {
    width: 48,
    height: 48,
    borderRadius: 24, // Perfect circle
    backgroundColor: '#CAB28D', // Soft gold
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 0, // No shadow
  },
  mapMarkerImage: {
    width: 32, // Haircut icon, centered
    height: 32,
    tintColor: '#213527', // Dark green tint
  },
  
  // Map Filter Button - Circular, top right, 46x46px
  mapFilterButton: {
    position: 'absolute',
    top: 32, // 32px from top of map card
    right: 32, // 32px from right edge
    zIndex: 10,
  },
  filterButtonStyle: {
    width: 46,
    height: 46,
    borderRadius: 23, // Circle
    backgroundColor: '#213527', // Deep green
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 0, // No shadow
  },
  
  // Floating Search Bar - At bottom of map with 5dp margin
  floatingSearchBar: {
    position: 'absolute',
    bottom: 5, // 5dp margin from bottom of map
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  
  // Search Bar Section - 24px below map card
  searchBarSection: {
    marginTop: 24, // 24px vertical space below map card
    paddingHorizontal: 24, // Global padding
  },
  searchBarContainer: {
    width: '87%', // 332px (87% of container)
    alignSelf: 'center',
  },
  searchBar: {
    width: '100%',
    height: 48, // Exact height
    backgroundColor: '#FFFFFF', // White background
    borderRadius: 24, // Fully pill-shaped
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18, // 18px from bar edge
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
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
  suggestions: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    maxHeight: 200,
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  suggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  suggestionText: {
    fontSize: 16,
    color: '#1A1A1A',
    flex: 1,
    marginLeft: 8,
  },
  
  // Beauty Products Section - 28px below search bar
  beautyProductsSection: {
    marginTop: 28, // 28px below search bar
    paddingHorizontal: 24, // Global padding
    paddingBottom: 100, // Extra padding to avoid tab bar
    backgroundColor: '#FAF6EC', // Cream background
  },
  beautyProductsTitle: {
    fontSize: 21, // 21px
    fontWeight: '700', // Bold
    color: '#222222', // #222
    marginBottom: 22, // 22px below section title
    marginLeft: 4, // 28px from left card edge (24px + 4px)
  },
  productsScrollView: {
    flexDirection: 'row',
  },
  productsScrollContainer: {
    paddingRight: 24,
  },
  beautyProductCard: {
    width: 163, // 163px width
    height: 132, // 132px height
    backgroundColor: '#FFFFFF', // White background
    borderRadius: 18, // 18px corner radius
    alignItems: 'center',
    marginRight: 16, // 16px gap between cards
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.09,
    shadowRadius: 10,
    paddingVertical: 20, // Top margin inside card
  },
  firstProductCard: {
    marginLeft: 24, // 28px left margin for first card
  },
  productIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14, // 14px below icon
  },
  productIcon: {
    width: 38, // 38px wide
    height: 62, // 62px tall
    // No background color as specified
  },
  beautyProductTitle: {
    fontSize: 16, // 16px
    fontWeight: '600', // Weight 600
    color: '#222222', // #222
    textAlign: 'center',
    marginBottom: 3, // 3px below product name
  },
  beautyProductPrice: {
    fontSize: 14, // 14px
    color: '#545454', // #545454
    textAlign: 'center',
  },
  
  // Filter Panel
  filterPanel: {
    position: 'absolute',
    top: 80,
    left: 24,
    right: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    zIndex: 15,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E7E6DD',
    backgroundColor: '#F8F6EC',
  },
  filterOptionSelected: {
    backgroundColor: '#213527',
    borderColor: '#213527',
  },
  filterOptionText: {
    fontSize: 12,
    color: '#1A1A1A',
  },
  filterOptionTextSelected: {
    color: '#FFFFFF',
  },
});
