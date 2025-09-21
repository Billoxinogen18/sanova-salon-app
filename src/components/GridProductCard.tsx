import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface GridProductCardProps {
  name: string;
  price: string;
  image?: string;
}

const GridProductCard: React.FC<GridProductCardProps> = ({
  name,
  price,
  image,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <View style={styles.productImage} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.productName} numberOfLines={2}>
          {name}
        </Text>
        <Text style={styles.price}>
          {price}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 92,
    height: 80,
    backgroundColor: '#F8F6EC',
    borderRadius: 13,
    padding: 8,
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
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  productImage: {
    width: 38,
    height: 38,
    backgroundColor: '#E8E4D8',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#1C3521',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontFamily: 'Inter',
    fontWeight: 'bold',
    fontSize: 14,
    color: '#232D1E',
    lineHeight: 16,
  },
  price: {
    fontFamily: 'Inter',
    fontSize: 13,
    color: '#667A6E',
    textAlign: 'right',
  },
});

export default GridProductCard;