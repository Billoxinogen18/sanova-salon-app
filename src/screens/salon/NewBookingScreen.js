import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { colors, globalStyles } from '../../theme/styles';
import Header from '../../components/Header';

export default function NewBookingScreen({ navigation }) {
  const [formData, setFormData] = useState({
    client: 'Emily Carter',
    phone: '+45 12345678',
    service: "Women's Haircut",
    dateTime: 'May 7, 2024 at 2:00 PM',
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddBooking = () => {
    // Here you would save the booking
    navigation.goBack();
  };

  return (
    <View style={globalStyles.container}>
      <Header 
        title="New Booking" 
        showBack 
        onBackPress={() => navigation.goBack()}
        rightIcon="close"
        onRightPress={() => navigation.goBack()}
      />
      
      <ScrollView style={styles.content}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Client</Text>
            <TextInput
              style={styles.input}
              value={formData.client}
              onChangeText={(value) => handleInputChange('client', value)}
              placeholder="Enter client name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone number</Text>
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Service</Text>
            <TextInput
              style={styles.input}
              value={formData.service}
              onChangeText={(value) => handleInputChange('service', value)}
              placeholder="Select service"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date & Time</Text>
            <TextInput
              style={styles.input}
              value={formData.dateTime}
              onChangeText={(value) => handleInputChange('dateTime', value)}
              placeholder="Select date and time"
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.addButtonContainer}>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddBooking}
        >
          <Text style={styles.addButtonText}>Add Booking</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  form: {
    paddingTop: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background.white,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text.primary,
  },
  addButtonContainer: {
    padding: 20,
    backgroundColor: colors.background.primary,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: colors.text.white,
    fontSize: 18,
    fontWeight: '600',
  },
});
