import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Animated, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, globalStyles } from '../../theme/styles';
import Header from '../../components/Header';

export default function MarketplaceScreen({ navigation }) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [searchText, setSearchText] = useState('');

  React.useEffect(() => {
    // Fade in animation when screen loads
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

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

  const renderProduct = ({ item }) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
      activeOpacity={0.8}
    >
      <View style={[styles.productImageContainer, { backgroundColor: item.color }]}>
        <Text style={styles.productEmoji}>{item.emoji}</Text>
      </View>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>{item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header with dark green background exactly as in design */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="leaf" size={24} color={colors.text.white} />
        </View>
        <Text style={styles.headerTitle}>SANOVA</Text>
      </View>

      {/* Search Bar - exactly as shown in design */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={colors.text.secondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor={colors.text.secondary}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>
      
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Beauty Products Title */}
        <Text style={styles.sectionTitle}>Beauty Products</Text>
        
        {/* Products Grid - exactly as shown in design with 2 columns */}
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
        />
      </Animated.View>
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
    borderBottomLeftRadius: 16, // 16dp radius as specified
    borderBottomRightRadius: 16, // 16dp radius as specified
    overflow: 'hidden', // Make corner radius visible
  },
  logoContainer: {
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.white,
    textAlign: 'center',
    fontFamily: 'serif',
    letterSpacing: 2, // +2 letter spacing as specified
    textTransform: 'uppercase',
  },
  searchContainer: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.primary, // Soft beige background
    borderRadius: 8, // 8dp radius as specified
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border.primary,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: colors.text.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: colors.background.primary,
    borderTopLeftRadius: 16, // 16dp radius as specified
    borderTopRightRadius: 16, // 16dp radius as specified
    marginTop: -16, // Overlap with header to create seamless curve
    overflow: 'hidden', // Make corner radius visible
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 20,
    marginTop: 20,
  },
  productsContainer: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  productCard: {
    backgroundColor: colors.background.white, // White background for cards
    borderRadius: 12, // 12dp radius as specified
    padding: 16,
    width: '48%',
    alignItems: 'center',
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary, // Soft beige background
    marginBottom: 12,
  },
  productEmoji: {
    fontSize: 24,
  },
  productName: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.accent, // Golden ochre for prices
  },
});