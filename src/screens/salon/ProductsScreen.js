import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  Animated, 
  StatusBar, 
  ScrollView,
  Image 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export default function ProductsScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Animated values for smooth entrance animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Sample products data with Danish pricing
  const sampleProducts = [
  {
    id: 1,
      name: 'Hydrating Serum',
      category: 'skincare',
      price: '299 kr',
      originalPrice: '349 kr',
      description: 'Premium hydrating facial serum',
      image: 'hydratingserum',
      stock: 12,
      available: true,
  },
  {
    id: 2,
      name: 'Cleansing Oil',
      category: 'skincare',
      price: '249 kr',
      originalPrice: null,
      description: 'Gentle makeup removing oil',
      image: 'cleansingoil',
      stock: 8,
      available: true,
  },
  {
    id: 3,
      name: 'Premium Shampoo',
      category: 'haircare',
      price: '179 kr',
      originalPrice: null,
      description: 'Nourishing daily shampoo',
      image: 'shampoo',
      stock: 15,
      available: true,
  },
  {
    id: 4,
      name: 'Face Cream',
      category: 'skincare',
      price: '399 kr',
      originalPrice: '459 kr',
      description: 'Anti-aging daily moisturizer',
      image: 'facecream',
      stock: 6,
      available: true,
    },
    {
      id: 5,
      name: 'Hair Oil Treatment',
      category: 'haircare',
      price: '229 kr',
      originalPrice: null,
      description: 'Intensive hair repair oil',
      image: 'hairoil',
      stock: 0,
      available: false,
    },
    {
      id: 6,
      name: 'Body Lotion',
      category: 'bodycare',
      price: '159 kr',
      originalPrice: null,
      description: 'Moisturizing body lotion',
      image: 'bodylotion',
      stock: 20,
      available: true,
    },
  ];

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'skincare', name: 'Skincare' },
    { id: 'haircare', name: 'Hair Care' },
    { id: 'bodycare', name: 'Body Care' },
  ];

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    
    // Start entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Load products
    setProducts(sampleProducts);
  }, []);

  // Filter products by category
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  // Get product image
  const getProductImage = (imageName) => {
    switch (imageName) {
      case 'hydratingserum':
        return require('../../../assets/hydratingserum.png');
      case 'cleansingoil':
        return require('../../../assets/cleansingoil.png');
      case 'shampoo':
        return require('../../../assets/shampoo.png');
      case 'facecream':
        return require('../../../assets/facecream.png');
      case 'hairoil':
        return require('../../../assets/hairoil.png');
      case 'bodylotion':
        return require('../../../assets/bodylotion.png');
      default:
        return require('../../../assets/defaultproduct.png');
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleToggleAvailability = (productId) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId
          ? { ...product, available: !product.available }
          : product
      )
    );
  };

  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <View style={styles.productImageContainer}>
        <Image
          source={getProductImage(item.image)}
          style={styles.productImage}
          resizeMode="cover"
        />
        {!item.available && (
          <View style={styles.outOfStockOverlay}>
            <Text style={styles.outOfStockText}>Out of Stock</Text>
          </View>
        )}
        {item.originalPrice && (
          <View style={styles.saleTag}>
            <Text style={styles.saleTagText}>SALE</Text>
          </View>
        )}
      </View>

      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1} ellipsizeMode="tail">
          {item.name.length > 17 ? item.name.substring(0, 17) + '...' : item.name}
        </Text>
        <Text style={styles.productDescription}>{item.description}</Text>
        
        <View style={styles.priceContainer}>
      <Text style={styles.productPrice}>{item.price}</Text>
          {item.originalPrice && (
            <Text style={styles.originalPrice}>{item.originalPrice}</Text>
          )}
        </View>

        <View style={styles.productFooter}>
          <View style={styles.stockInfo}>
            <Text style={[
              styles.stockText,
              item.stock === 0 ? styles.stockTextEmpty : styles.stockTextAvailable
            ]}>
              {item.stock === 0 ? 'Out of stock' : `${item.stock} in stock`}
            </Text>
          </View>
          
          <View style={styles.productActions}>
            <TouchableOpacity
              style={[
                styles.availabilityButton,
                item.available ? styles.availabilityButtonActive : styles.availabilityButtonInactive
              ]}
              onPress={() => handleToggleAvailability(item.id)}
              activeOpacity={0.8}
            >
              <Ionicons 
                name={item.available ? 'checkmark-circle' : 'close-circle'} 
                size={16} 
                color={item.available ? '#22C55E' : '#EF4444'} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate('NewProduct', { product: item, mode: 'edit' })}
              activeOpacity={0.8}
            >
              <Ionicons name="create-outline" size={16} color="#626463" />
    </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#213527" />

      {/* Header - Deep green (#213527) - Same as other screens */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        {/* Logo Leaf & SANOVA - Centered horizontally and vertically */}
        <View style={styles.logoContainer}>
          {/* Logo - Same dimensions as other screens */}
          <Image 
            source={require('../../../assets/logo.png')}
            style={styles.logoIcon}
            resizeMode="contain"
          />
          {/* SANOVA text - Same styling as other screens */}
          <Text style={styles.headerTitle}>SANOVA</Text>
        </View>
      </Animated.View>

      {/* Main Card - Very light cream (#FAF6EC) */}
      <Animated.View
        style={[
          styles.mainCard,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        {/* Content Section */}
        <View style={styles.contentSection}>
          {/* Header Section with Title and Add Button */}
          <View style={styles.pageHeader}>
        <Text style={styles.sectionTitle}>Products</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('NewProduct')}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Category Filter Tabs */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScrollView}
            contentContainerStyle={styles.categoryContainer}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryTab,
                  selectedCategory === category.id && styles.activeCategoryTab
                ]}
                onPress={() => handleCategoryChange(category.id)}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.categoryTabText,
                  selectedCategory === category.id && styles.activeCategoryTabText
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Products Grid */}
        <FlatList
            data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
            columnWrapperStyle={styles.productRow}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
            scrollEnabled={true}
        />
      </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF6EC', // Exact cream background
  },

  // Header - Deep green (#213527) - Same as other screens
  header: {
    backgroundColor: '#213527', // Exact deep green color
    height: 115, // Same height as other screens
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    width: 80,
    height: 50,
    marginBottom: 6, // Same spacing as other screens
  },
  headerTitle: {
    fontSize: 25, // Same as other screens
    fontFamily: 'System',
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
  },

  // Main Card - Very light cream (#FAF6EC)
  mainCard: {
    backgroundColor: '#FAF6EC', // Very light cream
    borderTopLeftRadius: 28, // Top corners only, same as other screens
    borderTopRightRadius: 28,
    width: '100%',
    flex: 1,
    paddingHorizontal: 26, // 26px from left/right
    paddingTop: 38, // 38px margin-top
  },

  // Content Section
  contentSection: {
    flex: 1,
  },

  // Page Header with Title and Add Button
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },

  // Section Title - "Products", 25px, weight 700, #223527
  sectionTitle: {
    fontSize: 25, // 25px
    fontWeight: '700', // Weight 700
    color: '#223527', // #223527
  },

  // Add Button - Green circle with plus icon
  addButton: {
    width: 44,
    height: 44,
    backgroundColor: '#213527', // Deep green background
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },

  // Category Filter
  categoryScrollView: {
    marginBottom: 24,
  },

  categoryContainer: {
    paddingHorizontal: 0,
  },

  // Category Tab
  categoryTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginRight: 12,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },

  // Active Category Tab
  activeCategoryTab: {
    backgroundColor: '#213527', // Deep green background
  },

  // Category Tab Text - 14px, #626463
  categoryTabText: {
    fontSize: 14, // 14px
    color: '#626463', // #626463
    fontWeight: '500',
  },

  // Active Category Tab Text - White
  activeCategoryTabText: {
    color: '#FFFFFF', // White
    fontWeight: '600',
  },

  // List Container
  listContainer: {
    paddingBottom: 40,
  },

  // Product Row
  productRow: {
    justifyContent: 'space-between',
  },

  // Product Card - White background, 16px radius
  productCard: {
    backgroundColor: '#FFFFFF', // White background
    borderRadius: 16, // 16px radius
    padding: 3, // 3dp inner padding
    width: '48%', // 48% width for 2-column grid
    marginBottom: 16, // 16px between product cards
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },

  // Product Image Container
  productImageContainer: {
    width: '100%',
    height: 120, // 120px height
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    position: 'relative',
  },

  // Product Image
  productImage: {
    width: '100%',
    height: '100%',
  },

  // Out of Stock Overlay
  outOfStockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Out of Stock Text
  outOfStockText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },

  // Sale Tag
  saleTag: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  // Sale Tag Text
  saleTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Product Info
  productInfo: {
    flex: 1,
  },

  // Product Name - 15px, weight 600, #223527
  productName: {
    fontSize: 15, // 15px
    fontWeight: '600', // Weight 600
    color: '#223527', // #223527
    marginBottom: 4,
  },

  // Product Description - 12px, #626463
  productDescription: {
    fontSize: 12, // 12px
    color: '#626463', // #626463
    marginBottom: 8,
    lineHeight: 16,
  },

  // Price Container
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  // Product Price - 16px, weight 600, #223527
  productPrice: {
    fontSize: 16, // 16px
    fontWeight: '600', // Weight 600
    color: '#223527', // #223527
    marginRight: 8,
  },

  // Original Price - 14px, strikethrough, #626463
  originalPrice: {
    fontSize: 14, // 14px
    color: '#626463', // #626463
    textDecorationLine: 'line-through',
  },

  // Product Footer
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Stock Info
  stockInfo: {
    flex: 1,
  },

  // Stock Text - 12px
  stockText: {
    fontSize: 12, // 12px
    fontWeight: '500',
  },

  // Stock Text Available - Green
  stockTextAvailable: {
    color: '#22C55E',
  },

  // Stock Text Empty - Red
  stockTextEmpty: {
    color: '#EF4444',
  },

  // Product Actions
  productActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  // Availability Button
  availabilityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Availability Button Active
  availabilityButtonActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
  },

  // Availability Button Inactive
  availabilityButtonInactive: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },

  // Edit Button
  editButton: {
    width: 28,
    height: 28,
    backgroundColor: '#F5F3E6',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
