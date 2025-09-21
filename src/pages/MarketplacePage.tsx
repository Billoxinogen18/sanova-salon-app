import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import GridProductCard from '../components/GridProductCard';

const { width } = Dimensions.get('window');
const cardWidth = 92;
const gap = 12;
const paddingHorizontal = 20;
const availableWidth = width - (paddingHorizontal * 2);
const itemsPerRow = Math.floor((availableWidth + gap) / (cardWidth + gap));

const MarketplacePage = () => {
  const [searchText, setSearchText] = useState('');

  // Sample beauty products for marketplace
  const beautyProducts = [
    { id: 1, name: 'Moisturizing Shampoo', price: '150 kr' },
    { id: 2, name: 'Hydrating Conditioner', price: '150 kr' },
    { id: 3, name: 'Repairing Mask', price: '200 kr' },
    { id: 4, name: 'Styling Gel', price: '120 kr' },
    { id: 5, name: 'Hair Oil', price: '180 kr' },
    { id: 6, name: 'Volume Spray', price: '140 kr' },
    { id: 7, name: 'Color Protection', price: '160 kr' },
    { id: 8, name: 'Deep Treatment', price: '220 kr' },
    { id: 9, name: 'Heat Protectant', price: '130 kr' },
    { id: 10, name: 'Dry Shampoo', price: '110 kr' },
  ];

  const renderProduct = ({ item }: { item: any }) => (
    <GridProductCard
      name={item.name}
      price={item.price}
    />
  );

  return (
    <View style={styles.container}>
      <Header />
      <SearchBar value={searchText} onChangeText={setSearchText} />
      
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Beauty Products</Text>
        
        <FlatList
          data={beautyProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#232D1E',
    fontFamily: 'Inter',
    marginBottom: 18,
  },
  grid: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
});

export default MarketplacePage;