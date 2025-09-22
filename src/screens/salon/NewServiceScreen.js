import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  Animated, 
  StatusBar,
  Alert,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export default function NewServiceScreen({ navigation }) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration: '',
    description: '',
    category: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  // Animated values for smooth entrance animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Service categories
  const categories = [
    { id: 'haircuts', name: 'Haircuts' },
    { id: 'nails', name: 'Nails' },
    { id: 'coloring', name: 'Coloring' },
    { id: 'skincare', name: 'Skincare' },
    { id: 'massage', name: 'Massage' },
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
  }, []);

  // Handle input change
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Validate form
  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter service name');
      return false;
    }
    if (!formData.price.trim()) {
      Alert.alert('Error', 'Please enter service price');
      return false;
    }
    if (!formData.duration.trim()) {
      Alert.alert('Error', 'Please enter service duration');
      return false;
    }
    if (!formData.category) {
      Alert.alert('Error', 'Please select a category');
      return false;
    }
    return true;
  };

  // Handle service creation
  const handleCreateService = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Success', 
        'Service created successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create service. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.headerTitle}>New Service</Text>

        {/* Close Button */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons name="close" size={24} color="#FFFFFF" />
        </TouchableOpacity>
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
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Form Section */}
          <View style={styles.formSection}>
            {/* Service Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Service Name</Text>
              <TextInput
                style={styles.textInput}
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                placeholder="Enter service name"
                placeholderTextColor="#626463"
              />
            </View>

            {/* Category Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Category</Text>
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
                      styles.categoryButton,
                      formData.category === category.id && styles.categoryButtonActive
                    ]}
                    onPress={() => handleInputChange('category', category.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={[
                      styles.categoryButtonText,
                      formData.category === category.id && styles.categoryButtonTextActive
                    ]}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Price Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Price (kr)</Text>
              <TextInput
                style={styles.textInput}
                value={formData.price}
                onChangeText={(value) => handleInputChange('price', value)}
                placeholder="Enter price in kr"
                placeholderTextColor="#626463"
                keyboardType="numeric"
              />
            </View>

            {/* Duration Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Duration</Text>
              <TextInput
                style={styles.textInput}
                value={formData.duration}
                onChangeText={(value) => handleInputChange('duration', value)}
                placeholder="e.g., 45 min, 1 hour"
                placeholderTextColor="#626463"
              />
            </View>

            {/* Description Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.textInput, styles.descriptionInput]}
                value={formData.description}
                onChangeText={(value) => handleInputChange('description', value)}
                placeholder="Describe the service"
                placeholderTextColor="#626463"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>
        </ScrollView>

        {/* Create Service Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.createButton, isLoading && styles.createButtonDisabled]}
            onPress={handleCreateService}
            disabled={isLoading}
            activeOpacity={0.9}
          >
            {isLoading ? (
              <Text style={styles.createButtonText}>Creating...</Text>
            ) : (
              <Text style={styles.createButtonText}>Create Service</Text>
            )}
          </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 26, // 26px from left/right
    paddingTop: 20, // Safe area top padding
  },

  // Back Button
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Header Title - "New Service", 20px, weight 600, #FFFFFF
  headerTitle: {
    fontSize: 20, // 20px
    fontWeight: '600', // Weight 600
    color: '#FFFFFF', // #FFFFFF
    textAlign: 'center',
  },

  // Close Button
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
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

  // Content
  content: {
    flex: 1,
  },

  // Form Section
  formSection: {
    paddingBottom: 20,
  },

  // Input Group
  inputGroup: {
    marginBottom: 24,
  },

  // Input Label - 16px, weight 600, #223527
  inputLabel: {
    fontSize: 16, // 16px
    fontWeight: '600', // Weight 600
    color: '#223527', // #223527
    marginBottom: 8,
  },

  // Text Input - White background, 16px radius
  textInput: {
    backgroundColor: '#FFFFFF', // White background
    borderRadius: 16, // 16px radius
    paddingHorizontal: 20, // 20px internal padding
    paddingVertical: 16, // 16px internal padding
    fontSize: 16, // 16px
    color: '#223527', // #223527
    borderWidth: 1,
    borderColor: '#F0F0F0', // Light border
  },

  // Description Input - Multiline
  descriptionInput: {
    height: 100, // Fixed height for multiline
    textAlignVertical: 'top',
  },

  // Category Scroll View
  categoryScrollView: {
    marginTop: 8,
  },

  categoryContainer: {
    paddingHorizontal: 0,
  },

  // Category Button
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },

  // Category Button Active
  categoryButtonActive: {
    backgroundColor: '#213527',
    borderColor: '#213527',
  },

  // Category Button Text - 14px, #626463
  categoryButtonText: {
    fontSize: 14, // 14px
    color: '#626463', // #626463
    fontWeight: '500',
  },

  // Category Button Text Active - White
  categoryButtonTextActive: {
    color: '#FFFFFF', // White
    fontWeight: '600',
  },

  // Button Container
  buttonContainer: {
    paddingTop: 20,
    paddingBottom: 40, // Safe area bottom padding
  },

  // Create Button - Green background, 18px radius
  createButton: {
    backgroundColor: '#213527', // Deep green background
    borderRadius: 18, // 18px radius
    paddingVertical: 18, // 18px internal padding
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
  },

  // Create Button Disabled
  createButtonDisabled: {
    backgroundColor: '#626463', // Gray when disabled
    opacity: 0.7,
  },

  // Create Button Text - 18px, weight 600, #FFF
  createButtonText: {
    fontSize: 18, // 18px
    fontWeight: '600', // Weight 600
    color: '#FFFFFF', // #FFF
  },
});
