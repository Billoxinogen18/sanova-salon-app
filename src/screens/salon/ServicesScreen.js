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

export default function ServicesScreen({ navigation }) {
  const [services, setServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Animated values for smooth entrance animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Sample services data with Danish pricing
  const sampleServices = [
    {
      id: 1,
      name: "Women's Haircut",
      category: 'haircuts',
      price: '450 kr',
      duration: '45 min',
      description: 'Professional cut and styling for women',
      image: 'haircut',
      active: true,
    },
    {
      id: 2,
      name: "Men's Haircut",
      category: 'haircuts',
      price: '350 kr',
      duration: '30 min',
      description: 'Classic men\'s cut and styling',
      image: 'haircut',
      active: true,
    },
    {
      id: 3,
      name: 'Classic Manicure',
      category: 'nails',
      price: '350 kr',
      duration: '45 min',
      description: 'Complete nail care and polish',
      image: 'manicure',
      active: true,
    },
    {
      id: 4,
      name: 'Hair Color Treatment',
      category: 'coloring',
      price: '800 kr',
      duration: '2 hours',
      description: 'Professional hair coloring service',
      image: 'haircut',
      active: true,
    },
    {
      id: 5,
      name: 'Beard Trim',
      category: 'haircuts',
      price: '200 kr',
      duration: '20 min',
      description: 'Professional beard shaping and trimming',
      image: 'haircut',
      active: true,
    },
    {
      id: 6,
      name: 'Gel Manicure',
      category: 'nails',
      price: '450 kr',
      duration: '60 min',
      description: 'Long-lasting gel nail treatment',
      image: 'manicure',
      active: false,
    },
  ];

  const categories = [
    { id: 'all', name: 'All Services' },
    { id: 'haircuts', name: 'Haircuts' },
    { id: 'nails', name: 'Nails' },
    { id: 'coloring', name: 'Coloring' },
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
    
    // Load services
    setServices(sampleServices);
  }, []);

  // Filter services by category
  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(service => service.category === selectedCategory);

  // Get service image
  const getServiceImage = (imageName) => {
    switch (imageName) {
      case 'haircut':
        return require('../../../assets/haircut.png');
      case 'manicure':
        return require('../../../assets/manicure.png');
      default:
        return require('../../../assets/haircut.png');
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleToggleService = (serviceId) => {
    setServices(prevServices =>
      prevServices.map(service =>
        service.id === serviceId
          ? { ...service, active: !service.active }
          : service
      )
    );
  };

  const renderService = ({ item }) => (
    <View style={styles.serviceCard}>
      <View style={styles.serviceHeader}>
        <View style={styles.serviceImageContainer}>
          <Image
            source={getServiceImage(item.image)}
            style={styles.serviceImage}
            resizeMode="cover"
          />
        </View>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            item.active ? styles.toggleButtonActive : styles.toggleButtonInactive
          ]}
          onPress={() => handleToggleService(item.id)}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.toggleButtonText,
            item.active ? styles.toggleButtonTextActive : styles.toggleButtonTextInactive
          ]}>
            {item.active ? 'Active' : 'Inactive'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.serviceInfo}>
        <Text style={styles.serviceName} numberOfLines={1} ellipsizeMode="tail">
          {item.name.length > 17 ? item.name.substring(0, 17) + '...' : item.name}
        </Text>
        <Text style={styles.serviceDescription}>{item.description}</Text>
        
        <View style={styles.serviceDetails}>
          <View style={styles.priceContainer}>
            <Text style={styles.servicePrice}>{item.price}</Text>
            <Text style={styles.serviceDuration}>{item.duration}</Text>
          </View>
          
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('NewService', { service: item, mode: 'edit' })}
            activeOpacity={0.8}
          >
            <Ionicons name="create-outline" size={18} color="#626463" />
          </TouchableOpacity>
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
            <Text style={styles.sectionTitle}>Services</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('NewService')}
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

          {/* Services List */}
          <FlatList
            data={filteredServices}
            renderItem={renderService}
            keyExtractor={(item) => item.id.toString()}
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

  // Section Title - "Services", 25px, weight 700, #223527
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

  // Service Card - White background, 18px radius
  serviceCard: {
    backgroundColor: '#FFFFFF', // White background
    borderRadius: 18, // 18px radius
    padding: 20, // 20px internal padding
    marginBottom: 16, // 16px between service cards
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },

  // Service Header - Image and toggle
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },

  // Service Image Container
  serviceImageContainer: {
    width: 64,
    height: 64,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F5F3E6',
  },

  // Service Image
  serviceImage: {
    width: '100%',
    height: '100%',
  },

  // Toggle Button
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },

  // Toggle Button Active
  toggleButtonActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderColor: '#22C55E',
  },

  // Toggle Button Inactive
  toggleButtonInactive: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: '#EF4444',
  },

  // Toggle Button Text - 12px, weight 500
  toggleButtonText: {
    fontSize: 12, // 12px
    fontWeight: '500', // Weight 500
  },

  // Toggle Button Text Active - Green
  toggleButtonTextActive: {
    color: '#22C55E',
  },

  // Toggle Button Text Inactive - Red
  toggleButtonTextInactive: {
    color: '#EF4444',
  },

  // Service Info Section
  serviceInfo: {
    flex: 1,
  },

  // Service Name - 18px, weight 600, #223527
  serviceName: {
    fontSize: 18, // 18px
    fontWeight: '600', // Weight 600
    color: '#223527', // #223527
    marginBottom: 6,
  },

  // Service Description - 14px, #626463
  serviceDescription: {
    fontSize: 14, // 14px
    color: '#626463', // #626463
    marginBottom: 12,
    lineHeight: 20,
  },

  // Service Details Row
  serviceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Price Container
  priceContainer: {
    flex: 1,
  },

  // Service Price - 16px, weight 600, #223527
  servicePrice: {
    fontSize: 16, // 16px
    fontWeight: '600', // Weight 600
    color: '#223527', // #223527
    marginBottom: 2,
  },

  // Service Duration - 14px, #626463
  serviceDuration: {
    fontSize: 14, // 14px
    color: '#626463', // #626463
  },

  // Edit Button
  editButton: {
    width: 36,
    height: 36,
    backgroundColor: '#F5F3E6',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
