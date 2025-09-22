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
  Modal,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export default function NewBookingScreen({ navigation }) {
  const [formData, setFormData] = useState({
    client: '',
    phone: '',
    service: '',
    date: '',
    time: '',
    notes: '',
  });

  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Animated values for smooth entrance animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Available services
  const availableServices = [
    { id: 1, name: "Women's Haircut", price: '450 kr', duration: '45 min' },
    { id: 2, name: "Men's Haircut", price: '350 kr', duration: '30 min' },
    { id: 3, name: 'Classic Manicure', price: '350 kr', duration: '45 min' },
    { id: 4, name: 'Hair Color Treatment', price: '800 kr', duration: '2 hours' },
    { id: 5, name: 'Beard Trim', price: '200 kr', duration: '20 min' },
    { id: 6, name: 'Gel Manicure', price: '450 kr', duration: '60 min' },
  ];

  // Available dates (next 30 days)
  const availableDates = [];
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    availableDates.push({
      id: i,
      date: date,
      formatted: date.toLocaleDateString('da-DK', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      }),
      full: date.toLocaleDateString('da-DK', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    });
  }

  // Available time slots
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00'
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

  // Handle service selection
  const handleServiceSelect = (service) => {
    setFormData(prev => ({ ...prev, service: service.name }));
    setShowServiceModal(false);
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    setFormData(prev => ({ ...prev, date: date.full }));
    setShowDateModal(false);
  };

  // Handle time selection
  const handleTimeSelect = (time) => {
    setFormData(prev => ({ ...prev, time: time }));
    setShowTimeModal(false);
  };

  // Validate form
  const validateForm = () => {
    if (!formData.client.trim()) {
      Alert.alert('Error', 'Please enter client name');
      return false;
    }
    if (!formData.phone.trim()) {
      Alert.alert('Error', 'Please enter phone number');
      return false;
    }
    if (!formData.service) {
      Alert.alert('Error', 'Please select a service');
      return false;
    }
    if (!formData.date) {
      Alert.alert('Error', 'Please select a date');
      return false;
    }
    if (!formData.time) {
      Alert.alert('Error', 'Please select a time');
      return false;
    }
    return true;
  };

  // Handle booking creation
  const handleCreateBooking = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Success', 
        'Booking created successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Render service item
  const renderServiceItem = ({ item }) => (
    <TouchableOpacity
      style={styles.serviceItem}
      onPress={() => handleServiceSelect(item)}
      activeOpacity={0.8}
    >
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceName} numberOfLines={1} ellipsizeMode="tail">
          {item.name.length > 17 ? item.name.substring(0, 17) + '...' : item.name}
        </Text>
        <Text style={styles.serviceDetails}>{item.duration} • {item.price}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#626463" />
    </TouchableOpacity>
  );

  // Render date item
  const renderDateItem = ({ item }) => (
    <TouchableOpacity
      style={styles.dateItem}
      onPress={() => handleDateSelect(item)}
      activeOpacity={0.8}
    >
      <Text style={styles.dateText}>{item.formatted}</Text>
    </TouchableOpacity>
  );

  // Render time item
  const renderTimeItem = ({ item }) => (
    <TouchableOpacity
      style={styles.timeItem}
      onPress={() => handleTimeSelect(item)}
      activeOpacity={0.8}
    >
      <Text style={styles.timeText}>{item}</Text>
    </TouchableOpacity>
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
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.headerTitle}>New Booking</Text>

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
        <View style={styles.content}>
          {/* Form Section */}
          <View style={styles.formSection}>
            {/* Client Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Client Name</Text>
              <TextInput
                style={styles.textInput}
                value={formData.client}
                onChangeText={(value) => handleInputChange('client', value)}
                placeholder="Enter client name"
                placeholderTextColor="#626463"
              />
            </View>

            {/* Phone Number Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.textInput}
                value={formData.phone}
                onChangeText={(value) => handleInputChange('phone', value)}
                placeholder="Enter phone number"
                placeholderTextColor="#626463"
                keyboardType="phone-pad"
              />
            </View>

            {/* Service Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Service</Text>
              <TouchableOpacity
                style={styles.selectInput}
                onPress={() => setShowServiceModal(true)}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.selectText,
                  !formData.service && styles.placeholderText
                ]}>
                  {formData.service || 'Select service'}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#626463" />
              </TouchableOpacity>
            </View>

            {/* Date Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Date</Text>
              <TouchableOpacity
                style={styles.selectInput}
                onPress={() => setShowDateModal(true)}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.selectText,
                  !formData.date && styles.placeholderText
                ]}>
                  {formData.date || 'Select date'}
                </Text>
                <Ionicons name="calendar-outline" size={20} color="#626463" />
              </TouchableOpacity>
            </View>

            {/* Time Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Time</Text>
              <TouchableOpacity
                style={styles.selectInput}
                onPress={() => setShowTimeModal(true)}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.selectText,
                  !formData.time && styles.placeholderText
                ]}>
                  {formData.time || 'Select time'}
                </Text>
                <Ionicons name="time-outline" size={20} color="#626463" />
              </TouchableOpacity>
            </View>

            {/* Notes Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Notes (Optional)</Text>
              <TextInput
                style={[styles.textInput, styles.notesInput]}
                value={formData.notes}
                onChangeText={(value) => handleInputChange('notes', value)}
                placeholder="Add any special notes or requests"
                placeholderTextColor="#626463"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </View>
        </View>

        {/* Create Booking Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.createButton, isLoading && styles.createButtonDisabled]}
            onPress={handleCreateBooking}
            disabled={isLoading}
            activeOpacity={0.9}
          >
            {isLoading ? (
              <Text style={styles.createButtonText}>Creating...</Text>
            ) : (
              <Text style={styles.createButtonText}>Create Booking</Text>
            )}
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Service Selection Modal */}
      <Modal
        visible={showServiceModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowServiceModal(false)}
            >
              <Ionicons name="close" size={24} color="#223527" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Service</Text>
            <View style={styles.modalSpacer} />
          </View>
          
          <FlatList
            data={availableServices}
            renderItem={renderServiceItem}
            keyExtractor={(item) => item.id.toString()}
            style={styles.modalList}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </Modal>

      {/* Date Selection Modal */}
      <Modal
        visible={showDateModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowDateModal(false)}
            >
              <Ionicons name="close" size={24} color="#223527" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Date</Text>
            <View style={styles.modalSpacer} />
          </View>
          
          <FlatList
            data={availableDates}
            renderItem={renderDateItem}
            keyExtractor={(item) => item.id.toString()}
            style={styles.modalList}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </Modal>

      {/* Time Selection Modal */}
      <Modal
        visible={showTimeModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowTimeModal(false)}
            >
              <Ionicons name="close" size={24} color="#223527" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Time</Text>
            <View style={styles.modalSpacer} />
          </View>
          
          <FlatList
            data={timeSlots}
            renderItem={renderTimeItem}
            keyExtractor={(item) => item}
            numColumns={3}
            style={styles.modalList}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.timeGrid}
          />
        </View>
      </Modal>
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

  // Header Title - "New Booking", 20px, weight 600, #FFFFFF
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

  // Notes Input - Multiline
  notesInput: {
    height: 100, // Fixed height for multiline
    textAlignVertical: 'top',
  },

  // Select Input - White background, 16px radius
  selectInput: {
    backgroundColor: '#FFFFFF', // White background
    borderRadius: 16, // 16px radius
    paddingHorizontal: 20, // 20px internal padding
    paddingVertical: 16, // 16px internal padding
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#F0F0F0', // Light border
  },

  // Select Text - 16px, #223527
  selectText: {
    fontSize: 16, // 16px
    color: '#223527', // #223527
    flex: 1,
  },

  // Placeholder Text - 16px, #626463
  placeholderText: {
    color: '#626463', // #626463
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

  // Modal Container
  modalContainer: {
    flex: 1,
    backgroundColor: '#FAF6EC', // Cream background
  },

  // Modal Header
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 26,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  // Modal Close Button
  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F3E6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Modal Title - 20px, weight 600, #223527
  modalTitle: {
    fontSize: 20, // 20px
    fontWeight: '600', // Weight 600
    color: '#223527', // #223527
  },

  // Modal Spacer
  modalSpacer: {
    width: 40,
  },

  // Modal List
  modalList: {
    flex: 1,
    paddingHorizontal: 26,
    paddingTop: 20,
  },

  // Service Item
  serviceItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },

  // Service Info
  serviceInfo: {
    flex: 1,
  },

  // Service Name - 16px, weight 600, #223527
  serviceName: {
    fontSize: 16, // 16px
    fontWeight: '600', // Weight 600
    color: '#223527', // #223527
    marginBottom: 4,
  },

  // Service Details - 14px, #626463
  serviceDetails: {
    fontSize: 14, // 14px
    color: '#626463', // #626463
  },

  // Date Item
  dateItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },

  // Date Text - 16px, weight 500, #223527
  dateText: {
    fontSize: 16, // 16px
    fontWeight: '500', // Weight 500
    color: '#223527', // #223527
  },

  // Time Grid
  timeGrid: {
    paddingBottom: 20,
  },

  // Time Item
  timeItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginRight: 12,
    alignItems: 'center',
    flex: 1,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },

  // Time Text - 14px, weight 500, #223527
  timeText: {
    fontSize: 14, // 14px
    fontWeight: '500', // Weight 500
    color: '#223527', // #223527
  },
});
