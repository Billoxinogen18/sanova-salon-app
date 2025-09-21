import React, { useRef, useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Animated, 
  Dimensions, 
  StatusBar 
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import SearchBar from '../../components/SearchBar';
import MapMarker from '../../components/MapMarker';
import ProductCard from '../../components/ProductCard';

const { width, height } = Dimensions.get('window');

export default function MapScreen({ navigation }) {
  const [searchText, setSearchText] = useState('');
  const [mapReady, setMapReady] = useState(false);
  const filterButtonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
  }, []);

  const handleFilterPress = () => {
    Animated.sequence([
      Animated.timing(filterButtonScale, { toValue: 0.9, duration: 100, useNativeDriver: true }),
      Animated.timing(filterButtonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const beautyProducts = [
    { id: 1, name: 'Moisturizing Shampoo', price: '150 kr', emoji: '🧴' },
    { id: 2, name: 'Hydrating Serum', price: '200 kr', emoji: '✨' },
    { id: 3, name: 'Face Cream', price: '180 kr', emoji: '🌿' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      {/* Header Bar - Forest Green with Logo */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="leaf" size={20} color={colors.background.white} />
          <Ionicons name="leaf" size={20} color={colors.background.white} style={{ marginLeft: -8 }} />
        </View>
        <Text style={styles.headerTitle}>SANOVA</Text>
      </View>

      {/* Map Section - 60% of screen height */}
      <View style={styles.mapContainer}>
        <WebView
          style={styles.mapView}
          source={{
            html: `
              <!DOCTYPE html>
              <html>
              <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                  body { margin: 0; padding: 0; background-color: #F8F6EC; }
                  #map { width: 100%; height: 100%; }
                </style>
              </head>
              <body>
                <div id="map"></div>
                <script>
                  function initMap() {
                    const map = new google.maps.Map(document.getElementById('map'), {
                      center: { lat: 40.7128, lng: -74.0060 },
                      zoom: 13,
                      mapTypeId: 'roadmap',
                      styles: [
                        {
                          featureType: 'all',
                          elementType: 'geometry.fill',
                          stylers: [{ color: '#F8F6EC' }]
                        },
                        {
                          featureType: 'road',
                          elementType: 'geometry.fill',
                          stylers: [{ color: '#F5F1E8' }]
                        },
                        {
                          featureType: 'water',
                          elementType: 'geometry.fill',
                          stylers: [{ color: '#E8F4F8' }]
                        },
                        {
                          featureType: 'poi.park',
                          elementType: 'geometry.fill',
                          stylers: [{ color: '#E8F5E8' }]
                        }
                      ]
                    });
                    
                    // Add salon markers with custom styling
                    const salons = [
                      { lat: 40.7128, lng: -74.0060, title: "Nordic Beauty" },
                      { lat: 40.7228, lng: -74.0160, title: "Icelandic Style" },
                      { lat: 40.7328, lng: -74.0260, title: "Arctic Glow" },
                      { lat: 40.7028, lng: -73.9960, title: "Scandinavian Spa" },
                      { lat: 40.7428, lng: -74.0360, title: "Nordic Wellness" }
                    ];
                    
                    salons.forEach(salon => {
                      const marker = new google.maps.Marker({
                        position: { lat: salon.lat, lng: salon.lng },
                        map: map,
                        title: salon.title,
                        icon: {
                          path: google.maps.SymbolPath.CIRCLE,
                          fillColor: '#C6AE78',
                          fillOpacity: 1,
                          strokeWeight: 0,
                          scale: 18
                        }
                      });
                    });
                  }
                </script>
                <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBD61clYyqUPsJcPsEZ_fPAQRJv1XDLwcQ&callback=initMap"></script>
              </body>
              </html>
            `
          }}
          onLoad={() => setMapReady(true)}
        />
        
        {/* Filter Button - Top Right */}
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
            <Ionicons name="funnel-outline" size={28} color={colors.background.white} />
          </TouchableOpacity>
        </Animated.View>
      </View>
      
      {/* Search Bar - Floating above content */}
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder="Search"
          value={searchText}
          onChangeText={setSearchText}
          containerStyle={styles.searchBarContainer}
        />
      </View>

      {/* Beauty Products Section */}
      <View style={styles.productsSection}>
        <Text style={styles.sectionTitle}>Beauty Products</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.productsScrollView}
          contentContainerStyle={styles.productsScrollContainer}
        >
          {beautyProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              variant="horizontal"
              onPress={() => navigation.navigate('ProductDetail', { product })}
            />
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
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.background.white,
    fontFamily: 'serif',
    letterSpacing: 2,
  },
  mapContainer: {
    height: height * 0.6, // 60% of screen height as specified
    position: 'relative',
    backgroundColor: colors.background.primary,
  },
  mapView: {
    flex: 1,
  },
  filterButtonContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
  filterButton: {
    backgroundColor: colors.primary,
    width: 44, // 44px circle as specified
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  searchContainer: {
    position: 'absolute',
    bottom: height * 0.6 - 50, // Position above map
    left: 32, // 32px margin as specified
    right: 32,
    zIndex: 10,
  },
  searchBarContainer: {
    backgroundColor: colors.background.white, // #F8F6EC as specified
    borderRadius: 18, // 18px radius as specified
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productsSection: {
    flex: 1,
    paddingTop: 18, // 18px top margin as specified
    paddingHorizontal: 20,
    backgroundColor: colors.background.primary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  productsScrollView: {
    flexDirection: 'row',
  },
  productsScrollContainer: {
    paddingRight: 20,
  },
});