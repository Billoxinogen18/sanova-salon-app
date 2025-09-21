import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import CustomMarker from '../components/CustomMarker';

const { width, height } = Dimensions.get('window');

const MapPage = () => {
  const [searchText, setSearchText] = useState('');

  // Sample salon locations
  const salonLocations = [
    { id: 1, latitude: 55.6761, longitude: 12.5683, name: 'Salon 1' },
    { id: 2, latitude: 55.6771, longitude: 12.5693, name: 'Salon 2' },
    { id: 3, latitude: 55.6751, longitude: 12.5673, name: 'Salon 3' },
    { id: 4, latitude: 55.6781, longitude: 12.5703, name: 'Salon 4' },
    { id: 5, latitude: 55.6741, longitude: 12.5663, name: 'Salon 5' },
  ];

  // Sample beauty products
  const beautyProducts = [
    { id: 1, name: 'Moisturizing Shampoo', price: '150 kr' },
    { id: 2, name: 'Hydrating Conditioner', price: '150 kr' },
    { id: 3, name: 'Repairing Mask', price: '200 kr' },
    { id: 4, name: 'Styling Gel', price: '120 kr' },
  ];

  return (
    <View style={styles.container}>
      <Header />
      
      {/* Map Section - 60% of screen height */}
      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: 55.6761,
            longitude: 12.5683,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          customMapStyle={[
            {
              featureType: 'all',
              elementType: 'geometry.fill',
              stylers: [{ color: '#F8F6EC' }],
            },
            {
              featureType: 'water',
              elementType: 'geometry.fill',
              stylers: [{ color: '#B8D4E3' }],
            },
            {
              featureType: 'road',
              elementType: 'geometry.fill',
              stylers: [{ color: '#F0EDE5' }],
            },
            {
              featureType: 'poi',
              elementType: 'geometry.fill',
              stylers: [{ color: '#E8F5E8' }],
            },
            {
              featureType: 'transit',
              elementType: 'geometry.fill',
              stylers: [{ color: '#F0EDE5' }],
            },
          ]}
        >
          {salonLocations.map((salon) => (
            <Marker
              key={salon.id}
              coordinate={{
                latitude: salon.latitude,
                longitude: salon.longitude,
              }}
            >
              <CustomMarker />
            </Marker>
          ))}
        </MapView>
        
        {/* Filter Button */}
        <TouchableOpacity style={styles.filterButton}>
          <Icon name="tune" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <SearchBar value={searchText} onChangeText={setSearchText} />

      {/* Beauty Products Section */}
      <View style={styles.productsSection}>
        <Text style={styles.sectionTitle}>Beauty Products</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productsScroll}
        >
          {beautyProducts.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              price={product.price}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mapContainer: {
    height: height * 0.6,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  filterButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1C3521',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1C3521',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  productsSection: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C3521',
    fontFamily: 'Inter',
    marginBottom: 12,
  },
  productsScroll: {
    paddingRight: 16,
  },
});

export default MapPage;