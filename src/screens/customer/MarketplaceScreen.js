import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  StatusBar 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import SearchBar from '../../components/SearchBar';
import ProductCard from '../../components/ProductCard';

export default function MarketplaceScreen({ navigation }) {
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
  }, []);

  // Beauty products exactly as shown in design screenshots
  const beautyProducts = [
    { id: 1, name: 'Moisturizing Shampoo', price: '150 kr', emoji: '🧴', color: '#F5F1E8' },
    { id: 2, name: 'Hydrating Serum', price: '200 kr', emoji: '🧴', color: '#8B4513' },
    { id: 3, name: 'Face Cream', price: '180 kr', emoji: '🟢', color: '#2D5A3D' },
    { id: 4, name: 'Body Lotion', price: '160 kr', emoji: '🧴', color: '#F5F1E8' },
    { id: 5, name: 'Body Lotion', price: '180 kr', emoji: '🧴', color: '#F5F1E8' },
    { id: 6, name: 'Hair Oil', price: '110 kr', emoji: '🧴', color: '#F5F1E8' },
    { id: 7, name: 'Cleansing Oil', price: '180 kr', emoji: '🟢', color: '#2D5A3D' },
    { id: 8, name: 'Cleansing Oil', price: '180 kr', emoji: '🧴', color: '#F5F1E8' },
  ];

  const handleProductPress = (item) => {
    navigation.navigate('ProductDetail', { product: item });
  };

  const renderProduct = ({ item, index }) => {
    return (
      <ProductCard
        product={item}
        variant="grid"
        onPress={() => handleProductPress(item)}
      />
    );
  };

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
      
      <View style={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <SearchBar
            placeholder="Search"
            value={searchText}
            onChangeText={setSearchText}
            containerStyle={styles.searchBarContainer}
          />
        </View>

        {/* Section Header */}
        <View style={styles.titleContainer}>
          <Text style={styles.sectionTitle}>Beauty Products</Text>
        </View>
        
        {/* Products Grid - 2-column grid */}
        <FlatList
          data={beautyProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.productsContainer}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />} // 12px vertical gap
        />
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: colors.background.primary,
    paddingTop: 20,
  },
  searchContainer: {
    marginBottom: 18, // 18px margin below search bar as specified
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
  titleContainer: {
    marginBottom: 18, // 18px margin top/bottom as specified
  },
  sectionTitle: {
    fontSize: 20, // 20px as specified
    fontWeight: 'bold',
    color: colors.text.primary, // #232D1E as specified
    fontFamily: 'Inter',
  },
  productsContainer: {
    paddingBottom: 100, // Extra padding for bottom navigation
  },
  row: {
    justifyContent: 'space-between',
  },
});