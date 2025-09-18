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
    latitude: 65.972595, // Iceland coordinates
    longitude: -18.530737, // Iceland coordinates
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

  // Debug API key
  React.useEffect(() => {
    const testApiKey = async () => {
      try {
        const apiKey = "AIzaSyBD61clYyqUPsJcPsEZ_fPAQRJv1XDLwcQ";
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=Copenhagen&key=${apiKey}`);
        const data = await response.json();
        console.log('API Key test result:', data.status);
        if (data.status !== 'OK') {
          console.error('API Key issue:', data.error_message);
        }
      } catch (error) {
        console.error('API Key test failed:', error);
      }
    };
    
    testApiKey();
  }, []);

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
            key="iceland-map"
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={styles.mapView}
          initialRegion={{
            latitude: 65.972595, // Iceland coordinates from your emulator
            longitude: -18.530737, // Iceland coordinates from your emulator
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          onMapReady={() => {
            console.log('Map is ready!');
            console.log('Region:', region);
            // Force map to stay on Iceland coordinates
            if (mapRef.current) {
              mapRef.current.animateToRegion({
                latitude: 65.972595,
                longitude: -18.530737,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }, 1000);
            }
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
                { lat: 65.975, lng: -18.535, title: "Nordic Beauty", description: "Hair & Spa" },
                { lat: 65.970, lng: -18.525, title: "Icelandic Style", description: "Hair & Nails" },
                { lat: 65.968, lng: -18.540, title: "Aurora Salon", description: "Premium Beauty" },
                { lat: 65.978, lng: -18.520, title: "Viking Cuts", description: "Modern Salon" },
                { lat: 65.965, lng: -18.545, title: "Fjord Beauty", description: "Full Service" },
                { lat: 65.960, lng: -18.515, title: "Glacier Spa", description: "Wellness & Beauty" },
                { lat: 65.985, lng: -18.530, title: "Northern Lights", description: "Luxury Salon" },
                { lat: 65.955, lng: -18.550, title: "Elf Salon", description: "Creative Cuts" },
                { lat: 65.980, lng: -18.510, title: "Geyser Beauty", description: "Natural Care" },
                { lat: 65.950, lng: -18.520, title: "Volcano Style", description: "Trendy Cuts" },
                { lat: 65.990, lng: -18.540, title: "Midnight Sun", description: "24/7 Beauty" },
                { lat: 65.945, lng: -18.535, title: "Puffin Parlor", description: "Family Salon" }
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
                          mapRef.current.animateToRegion(nextRegion, 1000);
                        }
                      } else {
                        console.error('Place details error:', details.status, details.error_message);
                      }
                    } catch (error) {
                      console.error('Place details fetch error:', error);
                    }
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
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
      },
      markerInner: {
        backgroundColor: colors.accent,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: colors.text.white,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 8,
        zIndex: 2,
      },
      markerShadow: {
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0.2)',
        width: 42,
        height: 42,
        borderRadius: 21,
        top: 2,
        left: -3,
        zIndex: 1,
      },
});
