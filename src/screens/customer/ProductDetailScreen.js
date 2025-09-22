import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Image } from 'react-native';
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
      image: require('../../../assets/shampoo.png'),
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

  // Helper function to get product images based on specifications
  const getProductImage = () => {
    const productName = product.name || '';
    if (productName.toLowerCase().includes('shampoo')) {
      return require('../../../assets/shampoo.png');
    } else if (productName.toLowerCase().includes('serum')) {
      return require('../../../assets/hydratingserum.png');
    } else if (productName.toLowerCase().includes('cream')) {
      return require('../../../assets/facecream.png');
    } else if (productName.toLowerCase().includes('lotion')) {
      return require('../../../assets/bodylotion.png');
    } else if (productName.toLowerCase().includes('oil') && productName.toLowerCase().includes('hair')) {
      return require('../../../assets/hairoil.png');
    } else if (productName.toLowerCase().includes('oil')) {
      return require('../../../assets/cleansingoil.png');
    }
    return require('../../../assets/defaultproduct.png');
  };

  // Related products with actual images
  const relatedProducts = [
    { id: 1, name: 'Hydrating Serum', price: '200 kr', image: require('../../../assets/hydratingserum.png') },
    { id: 2, name: 'Face Cream', price: '160 kr', image: require('../../../assets/facecream.png') },
    { id: 3, name: 'Hair Oil', price: '120 kr', image: require('../../../assets/hairoil.png') },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section - Deep green (#213527) - 112px height */}
      <Animated.View 
        style={[styles.header, { opacity: fadeAnim }]}
      >
        {/* Back Arrow Icon - Left-aligned, 26px from left screen edge, 23px from top, 22x22px, white */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        {/* Logo Leaf & SANOVA - Centered horizontally */}
        <View style={styles.logoContainer}>
          {/* Logo - 36px width, 22px height, 18px from top */}
          <Image 
            source={require('../../../assets/logo.png')}
            style={styles.logoIcon}
            resizeMode="contain"
          />
          {/* SANOVA text - 25px, uppercase serif, white, letter-spacing 2px, 6px margin below logo */}
          <Text style={styles.headerTitle}>SANOVA</Text>
        </View>
        <View style={styles.placeholder} />
      </Animated.View>
      
      {/* Main Product Card - Very light cream (#FAF6EC) */}
      <Animated.View 
        style={[styles.productCard, { opacity: fadeAnim }]}
      >
        {/* Product Image & Title Row - 47px from left card edge, 37px from card top */}
        <View style={styles.productImageTitleRow}>
          {/* Product Image - Bottle SVG/icon, 98px tall × 56px wide */}
          <View style={styles.productImageContainer}>
            <Image 
              source={getProductImage()} 
              style={styles.productImage}
              resizeMode="contain"
            />
          </View>
          
          {/* Title section - Top aligned to image, left margin 144px */}
          <View style={styles.titleSection}>
            {/* Product Title - 28px, weight 700, #232323, max 2 lines, line-height 34px */}
            <Text style={styles.productName}>{product.name || 'Moisturizing Shampoo'}</Text>
            {/* Price - 19px, #404040, weight 500, 8px below title */}
            <Text style={styles.price}>{product.price || '150 kr'}</Text>
            {/* Salon Name - weight 600, #232323, 18px, 7px between name and address */}
            <Text style={styles.salonName}>{product.salon || 'Gustav Salon'}</Text>
            {/* Address - 16px, #656565, left-aligned with title */}
            <Text style={styles.address}>{product.address || 'Frederiks Alle 28'}</Text>
          </View>
        </View>

        {/* "Køb nu" (Buy Now) Button - Center aligned, 34px below address text */}
        <Animated.View style={[styles.buyButtonContainer, { transform: [{ scale: buttonScale }] }]}>
          <TouchableOpacity 
            style={styles.buyButton}
            onPress={handleBuyNow}
            activeOpacity={0.9}
          >
            <Text style={styles.buyButtonText}>Køb nu</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* "Andere produkter du vil synes om" (Related Products) */}
        <View style={styles.relatedProducts}>
          {/* Title - Left-aligned, 28px above row, 30px from card left edge */}
          <Text style={styles.relatedTitle}>Andere produkter du vil synes om</Text>
          {/* Product Row - Horizontal scroll list/cards */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.relatedScrollContainer}
          >
            {relatedProducts.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.relatedCard, index === 0 && styles.firstRelatedCard]}
                onPress={() => navigation.push('ProductDetail', { product: item })}
                activeOpacity={0.8}
              >
                {/* Product SVG - centered top, 44px tall, 21px top margin inside card */}
                <View style={styles.relatedImageContainer}>
                  <Image 
                    source={item.image} 
                    style={styles.relatedImage}
                    resizeMode="contain"
                  />
                </View>
                {/* Product Title - 14px bold, #1A1A1A, center aligned, 16px below image */}
                <Text style={styles.relatedName}>{item.name}</Text>
                {/* Product Price - 16px, #6A6A6A, 5px below title */}
                <Text style={styles.relatedPrice}>{item.price}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF6EC', // Exact cream background
  },
  
  // Header Section - Deep green (#213527) - 112px height
  header: {
    backgroundColor: '#213527', // Exact deep green color
    height: 112, // Exact height from screen top to start of product card background, including status bar
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 26, // 26px from left screen edge
    paddingTop: 23, // 23px from top
  },
  
  // Back Arrow Icon - Left-aligned, 26px from left screen edge, 23px from top, 22x22px, white
  backButton: {
    padding: 4,
  },
  
  // Logo Leaf & SANOVA - Centered horizontally
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  logoIcon: {
    width: 36,
    height: 22,
    marginBottom: 6, // 6px margin below logo
  },
  headerTitle: {
    fontSize: 25, // 25px
    fontFamily: 'System', // Uppercase serif
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 2, // 2px letter spacing
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  placeholder: {
    width: 40, // Balance the back button
  },
  
  // Main Product Card - Very light cream (#FAF6EC)
  productCard: {
    backgroundColor: '#FAF6EC', // Very light cream
    width: '100%', // 428px (100%)
    height: 656, // 656px covers everything above tab bar
    borderTopLeftRadius: 26, // Top corners only
    borderTopRightRadius: 26,
    paddingTop: 37, // 37px from card top
  },
  
  // Product Image & Title Row - Height 111px
  productImageTitleRow: {
    flexDirection: 'row',
    height: 111, // Title row height
    marginHorizontal: 47, // 47px from left card edge
    marginBottom: 34, // 34px below address text for button
  },
  
  // Product Image - Bottle SVG/icon, 98px tall × 56px wide
  productImageContainer: {
    width: 56, // 56px wide
    height: 98, // 98px tall
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: 56, // 56px wide
    height: 98, // 98px tall
    resizeMode: 'contain',
  },
  
  // Title section - Top aligned to image, left margin 144px (47px + 97px spacing)
  titleSection: {
    flex: 1,
    marginLeft: 41, // Additional spacing after image (144px total from left edge)
    justifyContent: 'flex-start',
  },
  
  // Product Title - 28px, weight 700, #232323, max 2 lines, line-height 34px
  productName: {
    fontSize: 28, // 28px
    fontWeight: '700', // Weight 700
    color: '#232323', // #232323
    lineHeight: 34, // Line height 34px
    marginBottom: 8, // 8px below title
    maxHeight: 68, // Max 2 lines (34px * 2)
  },
  
  // Price - 19px, #404040, weight 500, 8px below title
  price: {
    fontSize: 19, // 19px
    color: '#404040', // #404040
    fontWeight: '500', // Weight 500
    marginBottom: 7, // 7px between name and address
  },
  
  // Salon Name - weight 600, #232323, 18px
  salonName: {
    fontSize: 18, // 18px
    color: '#232323', // #232323
    fontWeight: '600', // Weight 600
    marginBottom: 7, // 7px between name and address
  },
  
  // Address - 16px, #656565, left-aligned with title
  address: {
    fontSize: 16, // 16px
    color: '#656565', // #656565
  },
  
  // "Køb nu" (Buy Now) Button - Center aligned, 334px width, 53px height
  buyButtonContainer: {
    alignItems: 'center',
    marginBottom: 28, // 28px above related products title
  },
  buyButton: {
    width: 334, // 334px width
    height: 53, // 53px height
    backgroundColor: '#F5F0DF', // Soft warm beige #F5F0DF
    borderRadius: 27, // Fully pill-shaped
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Buy button text - "Køb nu", bold, 20px, #232323, letter-spacing 1px
  buyButtonText: {
    fontSize: 20, // 20px
    color: '#232323', // #232323
    fontWeight: 'bold',
    letterSpacing: 1, // 1px letter spacing
  },
  
  // "Andere produkter du vil synes om" (Related Products)
  relatedProducts: {
    marginLeft: 30, // 30px from card left edge
  },
  
  // Related Products Title - 17px, bold, #1A1A1A, 28px above row
  relatedTitle: {
    fontSize: 17, // 17px
    fontWeight: 'bold',
    color: '#1A1A1A', // #1A1A1A
    marginBottom: 28, // 28px above row
  },
  
  // Product Row - Horizontal scroll list/cards
  relatedScrollContainer: {
    paddingRight: 30, // Padding for last item
  },
  
  // Related Product Cards - 121px width × 142px height
  relatedCard: {
    width: 121, // 121px width
    height: 142, // 142px height
    backgroundColor: '#FFFFFF', // White background
    borderRadius: 18, // 18px corner radius
    alignItems: 'center',
    marginRight: 17, // 17px between cards
    paddingTop: 21, // 21px top margin inside card
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.09,
    shadowRadius: 12,
  },
  
  // First card - 27px left margin
  firstRelatedCard: {
    marginLeft: 0, // 27px left margin handled by parent
  },
  
  // Related Product Image Container
  relatedImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16, // 16px below image
  },
  
  // Related Product Image - 44px tall
  relatedImage: {
    width: 40, // Reasonable width
    height: 44, // 44px tall
  },
  
  // Related Product Title - 14px bold, #1A1A1A, center aligned, 16px below image
  relatedName: {
    fontSize: 14, // 14px
    fontWeight: 'bold',
    color: '#1A1A1A', // #1A1A1A
    textAlign: 'center',
    marginBottom: 5, // 5px below title
  },
  
  // Related Product Price - 16px, #6A6A6A, 5px below title
  relatedPrice: {
    fontSize: 16, // 16px
    color: '#6A6A6A', // #6A6A6A
    textAlign: 'center',
  },
});