import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, globalStyles } from '../../theme/styles';
import Header from '../../components/Header';

const products = [
  {
    id: 1,
    name: 'Muscular Relief Balm',
    price: '120 kr',
    image: '🧴',
    status: 'available',
  },
  {
    id: 2,
    name: 'Moisturizing Shampoo',
    price: '150 kr',
    image: '🧴',
    status: 'available',
  },
  {
    id: 3,
    name: 'Facial Cleanser',
    price: '100 kr',
    image: '🧴',
    status: 'available',
  },
  {
    id: 4,
    name: 'Styling Cream',
    price: '80 kr',
    image: '🧴',
    status: 'available',
  },
];

export default function ProductsScreen({ navigation }) {
  const renderProduct = ({ item }) => (
    <TouchableOpacity style={styles.productCard}>
      <View style={styles.productImage}>
        <Text style={styles.productImageText}>{item.image}</Text>
      </View>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>{item.price}</Text>
      {item.status === 'fulfilled' && (
        <View style={styles.fulfilledBadge}>
          <Text style={styles.fulfilledText}>Click & collect fulfilled</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={globalStyles.container}>
      <Header 
        rightIcon="add"
        onRightPress={() => navigation.navigate('NewProduct')}
      />
      
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Products</Text>
        
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 20,
    marginTop: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  productCard: {
    backgroundColor: colors.background.white,
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  productImageText: {
    fontSize: 30,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  fulfilledBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  fulfilledText: {
    fontSize: 10,
    color: colors.text.white,
    fontWeight: '600',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    marginLeft: -40,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addButtonText: {
    color: colors.text.white,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});
