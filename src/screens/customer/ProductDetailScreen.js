import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, globalStyles } from '../../theme/styles';
import Header from '../../components/Header';

export default function ProductDetailScreen({ navigation, route }) {
  const { product } = route.params || {
    product: {
      name: 'Moisturizing Shampoo',
      price: '150 kr',
      salon: 'Gustav Salon',
      address: 'Frederiks Alle 28',
      description: 'A gentle, moisturizing shampoo perfect for all hair types.',
      emoji: '🧴',
    }
  };

  const [fadeAnim] = useState(new Animated.Value(0));
  const [buttonScale] = useState(new Animated.Value(1));

  React.useEffect(() => {
    // Fade in animation when screen loads
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleBuyNow = () => {
    // Animate button press
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.navigate('PaymentMethod', { product });
    });
  };

  // Related products exactly as shown in design
  const relatedProducts = [
    { id: 1, name: 'Hydrating Serum', price: '200 kr', emoji: '💧' },
    { id: 2, name: 'Face Cream', price: '160 kr', emoji: '🧴' },
    { id: 3, name: 'Hair Oil', price: '120 kr', emoji: '🫒' },
  ];

  return (
    <View style={styles.container}>
      {/* Header with dark green background exactly as in design */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SANOVA</Text>
        <View style={styles.placeholder} />
      </View>
      
      <Animated.ScrollView 
        style={[styles.content, { opacity: fadeAnim }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Large product image - exactly as shown in design */}
        <View style={styles.imageContainer}>
          <View style={styles.productImage}>
            <Text style={styles.productEmoji}>{product.emoji}</Text>
          </View>
        </View>

        {/* Product Details - exactly as shown in design */}
        <View style={styles.detailsContainer}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.price}>{product.price}</Text>
          <Text style={styles.salonName}>{product.salon}</Text>
          <Text style={styles.address}>{product.address}</Text>
        </View>

        {/* Description - exactly as shown in design */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>Beskrivelse</Text>
          <Text style={styles.descriptionText}>
            {product.description || 'Et højkvalitets skønhedsprodukt designet til at forbedre din skønhedsrutine.'}
          </Text>
        </View>

        {/* Related Products - exactly as shown in design */}
        <View style={styles.relatedProducts}>
          <Text style={styles.relatedTitle}>Andre produkter du vil synes om</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {relatedProducts.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.relatedCard}
                onPress={() => navigation.push('ProductDetail', { product: item })}
                activeOpacity={0.8}
              >
                <View style={styles.relatedImageContainer}>
                  <Text style={styles.relatedImage}>{item.emoji}</Text>
                </View>
                <Text style={styles.relatedName}>{item.name}</Text>
                <Text style={styles.relatedPrice}>{item.price}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Animated.ScrollView>

      {/* Køb nu Button - exactly as shown in design */}
      <View style={styles.buyButtonContainer}>
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity 
            style={styles.buyButton}
            onPress={handleBuyNow}
            activeOpacity={0.9}
          >
            <Text style={styles.buyButtonText}>Køb nu</Text>
          </TouchableOpacity>
        </Animated.View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.white,
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    height: 300,
    backgroundColor: colors.background.white,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    flex: 1,
    backgroundColor: colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productEmoji: {
    fontSize: 80,
  },
  detailsContainer: {
    padding: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 12,
  },
  salonName: {
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  descriptionContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  relatedProducts: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  relatedTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  relatedCard: {
    backgroundColor: colors.background.white,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 120,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  relatedImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  relatedImage: {
    fontSize: 24,
  },
  relatedName: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 4,
  },
  relatedPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  buyButtonContainer: {
    padding: 20,
    backgroundColor: colors.background.primary,
  },
  buyButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buyButtonText: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: '600',
  },
});