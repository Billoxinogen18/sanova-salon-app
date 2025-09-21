import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { colors } from '../theme/colors';

const ProductCard = ({ 
  product, 
  variant = 'horizontal', // 'horizontal' for Map screen, 'grid' for Marketplace
  onPress 
}) => {
  const isHorizontal = variant === 'horizontal';
  const scaleValue = useRef(new Animated.Value(1)).current;
  
  const handlePressIn = () => {
    Animated.timing(scaleValue, {
      toValue: 0.95,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    // Button press animation
    Animated.sequence([
      Animated.timing(scaleValue, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleValue, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start(() => {
      onPress && onPress();
    });
  };
  
  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <TouchableOpacity 
        style={[
          styles.card,
          isHorizontal ? styles.horizontalCard : styles.gridCard
        ]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
      <View style={[
        styles.productImageContainer,
        isHorizontal ? styles.horizontalImageContainer : styles.gridImageContainer,
        { backgroundColor: product.color || '#F5F1E8' }
      ]}>
        <Text style={styles.productEmoji}>{product.emoji}</Text>
      </View>
      
      <View style={[
        styles.productInfo,
        isHorizontal ? styles.horizontalInfo : styles.gridInfo
      ]}>
        <Text style={[
          styles.productName,
          isHorizontal ? styles.horizontalName : styles.gridName
        ]}>
          {product.name}
        </Text>
        <Text style={[
          styles.productPrice,
          isHorizontal ? styles.horizontalPrice : styles.gridPrice
        ]}>
          {product.price}
        </Text>
      </View>
    </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.white,
    borderRadius: 13, // 13px radius as specified
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  // Horizontal variant for Map screen
  horizontalCard: {
    width: 98, // 98px wide as specified
    height: 80, // 80px tall as specified
    padding: 12,
    marginRight: 12, // 12px horizontal gap as specified
    alignItems: 'center',
    justifyContent: 'center',
  },
  horizontalImageContainer: {
    width: 44, // Max 44px as specified
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  horizontalInfo: {
    alignItems: 'center',
  },
  horizontalName: {
    fontSize: 15, // 15px as specified
    fontWeight: '500',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 4, // 4px below name as specified
  },
  horizontalPrice: {
    fontSize: 14, // 14px as specified
    color: colors.text.muted, // #667A6E as specified
    fontWeight: '400',
  },
  // Grid variant for Marketplace screen
  gridCard: {
    width: 92, // 92px wide as specified
    height: 80, // 80px tall as specified
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  gridImageContainer: {
    width: 38, // Max 38px height as specified
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  gridInfo: {
    flex: 1,
    justifyContent: 'space-between',
    height: '100%',
  },
  gridName: {
    fontSize: 14, // 14px as specified
    fontWeight: 'bold',
    color: colors.text.primary, // #232D1E as specified
    fontFamily: 'Inter',
    marginBottom: 4,
  },
  gridPrice: {
    fontSize: 13, // 13px as specified
    color: colors.text.muted, // #667A6E as specified
    fontWeight: '400',
    textAlign: 'right',
  },
  productEmoji: {
    fontSize: 20,
  },
});

export default ProductCard;