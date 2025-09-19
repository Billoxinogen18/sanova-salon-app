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
  Dimensions 
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
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
    const fallbackTimer = setTimeout(() => {
      console.log('🗺️ Fallback timer triggered, setting mapReady to true');
      setMapReady(true);
    }, 2000);

    return () => {
      console.log('🗺️ MapScreen useEffect cleanup');
      clearTimeout(fallbackTimer);
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
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
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

  const handleFilterPress = () => {
    Animated.sequence([
      Animated.timing(filterButtonScale, { toValue: 0.9, duration: 100, useNativeDriver: true }),
      Animated.timing(filterButtonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
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

  const beautyProducts = [
    { id: 1, name: 'Moisturizing Shampoo', price: '150 kr', emoji: '🧴' },
    { id: 2, name: 'Hydrating Serum', price: '200 kr', emoji: '✨' },
    { id: 3, name: 'Face Cream', price: '180 kr', emoji: '🌿' },
  ];

  const searchBorderColor = searchBorderAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border.primary, colors.primary],
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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
          <Ionicons name="leaf" size={20} color={colors.background.white} />
        </View>
        <Text style={styles.headerTitle}>SANOVA</Text>
        <Text style={styles.headerSubtitle}>Find nearby salons</Text>
      </Animated.View>

      {/* Map Container - Always Visible */}
      <View style={styles.mapContainer}>
        <View style={styles.mapWrapper}>
          {/* Fallback view to test if container is working */}
          {!mapReady && (
            <View style={styles.mapFallback}>
              <Text style={styles.mapFallbackText}>Loading Map...</Text>
              <Text style={styles.mapFallbackSubtext}>Finding nearby salons</Text>
            </View>
          )}
          {console.log('🗺️ Rendering MapView with mapReady:', mapReady)}
          {console.log('🗺️ Map container style:', styles.mapContainer)}
          {console.log('🗺️ Map wrapper style:', styles.mapWrapper)}
          {console.log('🗺️ Map view style:', styles.mapView)}
          <MapView
            ref={mapRef}
            style={styles.mapView}
            initialRegion={{
              latitude: 40.7128, // New York coordinates for testing
              longitude: -74.0060,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            onMapReady={() => {
              console.log('🗺️ Map is ready!');
              console.log('🗺️ Map ref exists:', !!mapRef.current);
              console.log('🗺️ Map container style:', styles.mapView);
              setMapReady(true);
            }}
            onError={(error) => {
              console.error('🚨 Map error:', error);
              console.error('🚨 Map error details:', JSON.stringify(error));
              console.error('🚨 Map error type:', typeof error);
              console.error('🚨 Map error message:', error?.message);
            }}
            onMapLoaded={() => {
              console.log('✅ Map loaded successfully!');
              console.log('✅ Map tiles should be visible now');
            }}
            onRegionChange={(region) => {
              console.log('🗺️ Map region changed:', region);
              console.log('🗺️ Region latitude:', region.latitude);
              console.log('🗺️ Region longitude:', region.longitude);
            }}
            onRegionChangeComplete={(region) => {
              console.log('🗺️ Map region change complete:', region);
              console.log('🗺️ Final region set:', region);
              setRegion(region);
            }}
            showsUserLocation={false}
            showsMyLocationButton={false}
            mapType="hybrid"
            loadingEnabled={true}
            loadingIndicatorColor="#4A6741"
            loadingBackgroundColor="#F5F1E8"
            >
              {[
                { lat: 37.78825, lng: -122.4324, title: "Nordic Beauty", description: "Hair & Spa" },
                { lat: 37.78925, lng: -122.4334, title: "Icelandic Style", description: "Hair & Nails" },
                { lat: 37.78725, lng: -122.4314, title: "Aurora Salon", description: "Premium Beauty" },
                { lat: 37.79025, lng: -122.4344, title: "Viking Cuts", description: "Modern Salon" },
                { lat: 37.78625, lng: -122.4304, title: "Fjord Beauty", description: "Full Service" },
                { lat: 37.78525, lng: -122.4294, title: "Glacier Spa", description: "Wellness & Beauty" },
                { lat: 37.79125, lng: -122.4354, title: "Northern Lights", description: "Luxury Salon" },
                { lat: 37.78425, lng: -122.4284, title: "Elf Salon", description: "Creative Cuts" },
                { lat: 37.79225, lng: -122.4364, title: "Geyser Beauty", description: "Natural Care" },
                { lat: 37.78325, lng: -122.4274, title: "Volcano Style", description: "Trendy Cuts" },
                { lat: 37.79325, lng: -122.4374, title: "Midnight Sun", description: "24/7 Beauty" },
                { lat: 37.78225, lng: -122.4264, title: "Puffin Parlor", description: "Family Salon" }
              ].map((salon, idx) => (
                <Marker
                  key={idx}
                  coordinate={{ latitude: salon.lat, longitude: salon.lng }}
                  title={salon.title}
                  description={salon.description}
                >
                  <View style={styles.customMarker}>
                    <View style={styles.markerInner}>
                      <Ionicons name="cut" size={18} color={colors.text.white} />
                    </View>
                    <View style={styles.markerShadow} />
                  </View>
                </Marker>
          ))}
        </MapView>
        </View>
        
        {/* Filter Button */}
        <Animated.View
          style={[
            styles.filterButtonContainer,
            { transform: [{ scale: filterButtonScale }] }
          ]}
        >
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={handleFilterPress}
            activeOpacity={0.8}
          >
            <Ionicons name="funnel-outline" size={20} color={colors.background.white} />
          </TouchableOpacity>
        </Animated.View>
        
        {/* Search Bar */}
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
              placeholder="Search salons, services..."
              placeholderTextColor={colors.text.secondary}
              value={searchText}
              onChangeText={fetchPlaces}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
            />
            {searchText.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  setSearchText('');
                  setSuggestions([]);
                }}
                style={styles.clearButton}
                activeOpacity={0.7}
              >
                <Ionicons name="close-circle" size={20} color={colors.text.secondary} />
              </TouchableOpacity>
            )}
          </Animated.View>
          
          {suggestions.length > 0 && (
            <Animated.View style={styles.suggestions}>
              {suggestions.map((s) => (
                <TouchableOpacity
                  key={s.place_id}
                  style={styles.suggestion}
                  onPress={async () => {
                    setSuggestions([]);
                    setSearchText(s.description);
                    try {
                      const apiKey = "AIzaSyBD61clYyqUPsJcPsEZ_fPAQRJv1XDLwcQ";
                      const detailsRes = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${s.place_id}&key=${apiKey}`);
                      const details = await detailsRes.json();
                      
                      if (details.status === 'OK') {
                        const loc = details?.result?.geometry?.location;
                        if (loc && mapRef.current) {
                          const nextRegion = {
                            latitude: loc.lat,
                            longitude: loc.lng,
                            latitudeDelta: 0.02,
                            longitudeDelta: 0.02,
                          };
                          setRegion(nextRegion);
                          mapRef.current.animateToRegion(nextRegion, 1500);
                        }
                      } else {
                        console.error('Place details error:', details.status, details.error_message);
                      }
                    } catch (error) {
                      console.error('Place details fetch error:', error);
                    }
                  }}
                  activeOpacity={0.8}
                >
                  <Ionicons name="location-outline" size={16} color={colors.text.secondary} />
                  <Text style={styles.suggestionText}>{s.description}</Text>
                </TouchableOpacity>
              ))}
            </Animated.View>
          )}
        </Animated.View>
      </View>
      
      {/* Premium Animated Beauty Products Section */}
      <Animated.View 
        style={[
          styles.productsSection,
          {
            opacity: productsAnimatedValues.opacity,
            transform: [{ translateY: productsAnimatedValues.translateY }],
          }
        ]}
      >
        <View style={styles.productsSectionHeader}>
          <Text style={styles.sectionTitle}>Featured Products</Text>
          <Text style={styles.sectionSubtitle}>Premium beauty essentials</Text>
        </View>
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
                styles.productCard,
                index === 0 && styles.firstProductCard,
                index === beautyProducts.length - 1 && styles.lastProductCard,
              ]}
              onPress={() => {
                // Product press animation
                Animated.sequence([
                  Animated.timing(new Animated.Value(1), { toValue: 0.95, duration: 100, useNativeDriver: true }),
                  Animated.timing(new Animated.Value(0.95), { toValue: 1, duration: 100, useNativeDriver: true }),
                ]).start(() => {
                  navigation.navigate('ProductDetail', { product });
                });
              }}
              activeOpacity={0.9}
            >
              <View style={styles.productImageContainer}>
                <Text style={styles.productImage}>{product.emoji}</Text>
              </View>
              <Text style={styles.productTitle}>{product.name}</Text>
              <Text style={styles.productPrice}>{product.price}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>
    </ScrollView>
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
    ...shadows.elevated,
  },
  logoContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
  mapContainer: {
    height: 500, // Increased height to make map more visible
    position: 'relative',
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: colors.background.white,
    marginTop: -2,
    ...shadows.floating,
  },
  mapWrapper: {
    flex: 1,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: colors.background.primary,
    borderWidth: 1,
    borderColor: 'rgba(38, 52, 40, 0.1)',
    borderBottomWidth: 0,
  },
  mapView: {
    flex: 1,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
  },
  mapFallback: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.background.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
  },
  mapFallbackText: {
    ...typography.title2,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  mapFallbackSubtext: {
    ...typography.body,
    color: colors.text.secondary,
  },
  filterButtonContainer: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.lg,
    zIndex: 10,
  },
  filterButton: {
    backgroundColor: 'rgba(38, 52, 40, 0.9)',
    borderRadius: borderRadius.round,
    padding: spacing.md,
    ...shadows.floating,
  },
  searchContainer: {
    position: 'absolute',
    bottom: spacing.xl + 20,
    left: spacing.lg,
    right: spacing.lg,
    zIndex: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + 2,
    borderWidth: 1,
    borderColor: 'rgba(38, 52, 40, 0.1)',
    ...shadows.floating,
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
  suggestions: {
    marginTop: spacing.sm,
    backgroundColor: colors.background.white,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    maxHeight: 200,
    ...shadows.elevated,
  },
  suggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    gap: spacing.sm,
  },
  suggestionText: {
    ...typography.body,
    color: colors.text.primary,
    flex: 1,
  },
  productsSection: {
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl + 20, // Extra padding to avoid tab bar
    backgroundColor: colors.background.primary,
  },
  productsSectionHeader: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.title3,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    ...typography.caption,
    color: colors.text.secondary,
    opacity: 0.8,
  },
  productsScrollView: {
    flexDirection: 'row',
  },
  productsScrollContainer: {
    paddingRight: spacing.lg,
  },
  productCard: {
    ...premiumComponents.premiumCard,
    width: 140,
    alignItems: 'center',
    marginRight: spacing.md,
    backgroundColor: colors.background.white,
    ...shadows.card,
  },
  firstProductCard: {
    marginLeft: 0,
  },
  lastProductCard: {
    marginRight: 0,
  },
  productImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadows.card,
  },
  productImage: {
    fontSize: 26,
  },
  productTitle: {
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
  customMarker: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerInner: {
    backgroundColor: colors.accent,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.background.white,
    ...shadows.floating,
    zIndex: 2,
  },
  markerShadow: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.15)',
    width: 46,
    height: 46,
    borderRadius: 23,
    top: 2,
    left: -3,
    zIndex: 1,
  },
});
