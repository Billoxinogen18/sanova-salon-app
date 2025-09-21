import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface ProductCardProps {
  name: string;
  price: string;
  image?: string;
  width?: number;
  height?: number;
  imageSize?: number;
  fontSize?: number;
  priceFontSize?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  name,
  price,
  image,
  width = 98,
  height = 80,
  imageSize = 44,
  fontSize = 15,
  priceFontSize = 14,
}) => {
  return (
    <View style={[styles.container, { width, height }]}>
      <View style={styles.imageContainer}>
        <View style={[styles.productImage, { width: imageSize, height: imageSize }]} />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.productName, { fontSize }]} numberOfLines={2}>
          {name}
        </Text>
        <Text style={[styles.price, { fontSize: priceFontSize }]}>
          {price}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F6EC',
    borderRadius: 13,
    padding: 12,
    marginRight: 12,
    shadowColor: '#1C3521',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  productImage: {
    backgroundColor: '#E8E4D8',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#1C3521',
  },
  textContainer: {
    alignItems: 'center',
  },
  productName: {
    fontFamily: 'Inter',
    fontWeight: '500',
    color: '#1C3521',
    textAlign: 'center',
    marginBottom: 4,
  },
  price: {
    fontFamily: 'Inter',
    color: '#667A6E',
    textAlign: 'center',
  },
});

export default ProductCard;