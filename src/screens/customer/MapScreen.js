import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, TextInput, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { colors, globalStyles } from '../../theme/styles';
import Header from '../../components/Header';

export default function MapScreen({ navigation }) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const mapRef = useRef(null);
  const [region, setRegion] = useState({
    latitude: 37.4220936, // Google headquarters
    longitude: -122.083922, // Google headquarters
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  React.useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        const nextRegion = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        };
        setRegion(nextRegion);
        if (mapRef.current) {
          mapRef.current.animateToRegion(nextRegion, 400);
        }
      }
    })();
  }, []);

  const fetchPlaces = async (text) => {
    setSearchText(text);
    if (!text || text.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const key = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(text)}&location=${region.latitude},${region.longitude}&radius=20000&key=${"AIzaSyAWjP5QFRy8ijfaf-2KDN0ac9hZavOjPlQ"}`;
      const res = await fetch(url);
      const json = await res.json();
      setSuggestions(json?.predictions?.slice(0, 5) || []);
    } catch (e) {
      setSuggestions([]);
    }
  };

  const beautyProducts = [
    { id: 1, name: 'Moisturizing Shampoo', price: '150 kr', emoji: '🧴' },
    { id: 2, name: 'Moisturizing Shampoo', price: '150 kr', emoji: '🧴' },
  ];

  return (
    <View style={styles.container}>
      {/* Header with SANOVA logo at the very top */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="leaf" size={16} color={colors.text.white} />
        </View>
        <Text style={styles.headerTitle}>SANOVA</Text>
      </View>

      {/* Map Container extending to top with only top corner radius */}
      <View style={styles.mapContainer}>
        <View style={styles.mapWrapper}>
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={styles.mapView}
          initialRegion={{
            latitude: 37.4220936,
            longitude: -122.083922,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          onMapReady={() => {
            console.log('Map is ready!');
            console.log('Region:', region);
          }}
          onError={(error) => {
            console.log('Map error:', error);
            console.error('Full map error:', JSON.stringify(error));
          }}
          onMapLoaded={() => console.log('Map loaded successfully!')}
          showsUserLocation={true}
          showsMyLocationButton={true}
          mapType="standard"
          loadingEnabled={false}
          // Keep map uncontrolled; track region without forcing re-renders
          onRegionChangeComplete={setRegion}
          renderToHardwareTextureAndroid={true}
        >
          {[
            { lat: 37.425, lng: -122.085, title: "Glamorous Salon", description: "Hair & Beauty" },
            { lat: 37.420, lng: -122.080, title: "Style Studio", description: "Hair & Nails" },
            { lat: 37.418, lng: -122.090, title: "Beauty Lounge", description: "Spa & Wellness" },
            { lat: 37.430, lng: -122.075, title: "Hair Palace", description: "Premium Hair" },
            { lat: 37.415, lng: -122.095, title: "Salon Central", description: "Full Service" },
            { lat: 37.410, lng: -122.070, title: "Beauty Spot", description: "Quick Services" },
            { lat: 37.435, lng: -122.085, title: "Style Hub", description: "Modern Salon" },
            { lat: 37.428, lng: -122.100, title: "Glamour Zone", description: "Luxury Beauty" }
          ].map((salon, idx) => (
            <Marker
              key={idx}
              coordinate={{ latitude: salon.lat, longitude: salon.lng }}
              title={salon.title}
              description={salon.description}
            >
              <View style={styles.customMarker}>
                <Ionicons name="cut" size={20} color={colors.text.white} />
              </View>
            </Marker>
          ))}
        </MapView>
        </View>
        
        {/* Filter button positioned inside map at top left */}
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="funnel-outline" size={20} color={colors.text.white} />
        </TouchableOpacity>
        
        {/* Search Bar INSIDE the map */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={colors.text.secondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor={colors.text.secondary}
              value={searchText}
              onChangeText={fetchPlaces}
            />
          </View>
          {suggestions.length > 0 && (
            <View style={styles.suggestions}>
              {suggestions.map((s) => (
                <TouchableOpacity
                  key={s.place_id}
                  style={styles.suggestion}
                  onPress={async () => {
                    setSuggestions([]);
                    setSearchText(s.description);
                    try {
                      const detailsRes = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${s.place_id}&key=${"AIzaSyAWjP5QFRy8ijfaf-2KDN0ac9hZavOjPlQ"}`);
                      const details = await detailsRes.json();
                      const loc = details?.result?.geometry?.location;
                      if (loc) {
                        setRegion({
                          latitude: loc.lat,
                          longitude: loc.lng,
                          latitudeDelta: 0.02,
                          longitudeDelta: 0.02,
                        });
                      }
                    } catch {}
                  }}
                >
                  <Text style={styles.suggestionText}>{s.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
      
      {/* Beauty Products Section with 2dp padding from top */}
      <View style={styles.productsSection}>
        <Text style={styles.sectionTitle}>Beauty Products</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.productsScrollView}
        >
          {beautyProducts.map((product) => (
            <TouchableOpacity 
              key={product.id} 
              style={styles.productCard}
              onPress={() => navigation.navigate('ProductDetail', { product })}
              activeOpacity={0.8}
            >
              <View style={styles.productImageContainer}>
                <Text style={styles.productImage}>{product.emoji}</Text>
              </View>
              <Text style={styles.productTitle}>{product.name}</Text>
              <Text style={styles.productPrice}>{product.price}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
    // NO bottom corner radius - extends straight
  },
  logoContainer: {
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.white,
    textAlign: 'center',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
    // NO margins - extends to edges
  },
  mapWrapper: {
    flex: 1,
    borderTopLeftRadius: 16, // 16dp corner radius curved inwards top-left
    borderTopRightRadius: 16, // 16dp corner radius curved inwards top-right
    overflow: 'hidden',
    backgroundColor: colors.background.primary, // Add background color to show rounded corners
  },
  mapView: {
    flex: 1,
  },
  filterButton: {
    position: 'absolute',
    top: 15,
    left: 15,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 8,
    zIndex: 1,
  },
  searchContainer: {
    position: 'absolute',
    bottom: 10, // Position search bar inside map
    left: 20,
    right: 20,
    zIndex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.primary, // New cream background
    borderRadius: 50, // 50dp corner radius - completely round
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  suggestions: {
    marginTop: 8,
    backgroundColor: colors.background.primary, // New cream background
    borderRadius: 12,
    overflow: 'hidden',
  },
  suggestion: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.primary,
  },
  suggestionText: {
    color: colors.text.primary,
    fontSize: 14,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: colors.text.primary,
  },
  productsSection: {
    paddingTop: 2, // 2dp padding from top as specified
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  productsScrollView: {
    flexDirection: 'row',
  },
  productCard: {
    backgroundColor: colors.background.card, // Lighter shade for grid items
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 140,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  productImage: {
    fontSize: 24,
  },
  productTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  customMarker: {
    backgroundColor: colors.accent,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.text.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});
