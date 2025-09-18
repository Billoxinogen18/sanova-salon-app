import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, globalStyles } from '../../theme/styles';
import Header from '../../components/Header';

export default function NewServiceScreen({ navigation }) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration: '0 min',
    description: '',
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddService = () => {
    // Here you would save the service
    navigation.goBack();
  };

  return (
    <View style={globalStyles.container}>
      <Header 
        title="New Service" 
        showBack 
        onBackPress={() => navigation.goBack()}
      />
      
      <ScrollView style={styles.content}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              placeholder="Enter service name"
            />
          </View>

          <View style={styles.imageUpload}>
            <TouchableOpacity style={styles.imageUploadButton}>
              <Ionicons name="camera" size={32} color={colors.text.secondary} />
              <Text style={styles.imageUploadText}>Upload Image</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Price</Text>
            <TextInput
              style={styles.input}
              value={formData.price}
              onChangeText={(value) => handleInputChange('price', value)}
              placeholder="$0"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Duration</Text>
            <TextInput
              style={styles.input}
              value={formData.duration}
              onChangeText={(value) => handleInputChange('duration', value)}
              placeholder="0 min"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(value) => handleInputChange('description', value)}
              placeholder="Enter service description"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.addButtonContainer}>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddService}
        >
          <Text style={styles.addButtonText}>Add Service</Text>
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imageUpload: {
    marginBottom: 24,
  },
  imageUploadButton: {
    backgroundColor: colors.background.white,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
  },
  imageUploadText: {
    fontSize: 16,
    color: colors.text.secondary,
    marginTop: 8,
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
