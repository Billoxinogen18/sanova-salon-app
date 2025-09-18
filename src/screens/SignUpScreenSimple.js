import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { colors } from '../theme/colors';
import { globalStyles } from '../theme/styles';

export default function SignUpScreenSimple({ navigation }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignUp = () => {
    // Basic validation
    if (!formData.firstName.trim() || !formData.lastName.trim() || 
        !formData.email.trim() || !formData.password.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    // Navigate to CustomerApp for now
    Alert.alert(
      'Success', 
      'Account created successfully!',
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('CustomerApp')
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Create Account</Text>
        
        <View style={styles.nameRow}>
          <View style={[styles.inputContainer, styles.halfInput]}>
            <Text style={styles.label}>First Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="First name"
              placeholderTextColor={colors.text.secondary}
              value={formData.firstName}
              onChangeText={(value) => handleInputChange('firstName', value)}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>
          <View style={[styles.inputContainer, styles.halfInput]}>
            <Text style={styles.label}>Last Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Last name"
              placeholderTextColor={colors.text.secondary}
              value={formData.lastName}
              onChangeText={(value) => handleInputChange('lastName', value)}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor={colors.text.secondary}
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password *</Text>
          <TextInput
            style={styles.input}
            placeholder="Create a password"
            placeholderTextColor={colors.text.secondary}
            value={formData.password}
            onChangeText={(value) => handleInputChange('password', value)}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm Password *</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirm your password"
            placeholderTextColor={colors.text.secondary}
            value={formData.confirmPassword}
            onChangeText={(value) => handleInputChange('confirmPassword', value)}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <TouchableOpacity
          style={[globalStyles.button, styles.signupButton]}
          onPress={handleSignUp}
        >
          <Text style={globalStyles.buttonText}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>Already have an account? Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 40,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.light,
    textAlign: 'center',
    marginBottom: 30,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputContainer: {
    marginBottom: 18,
  },
  halfInput: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.light,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  signupButton: {
    backgroundColor: colors.background.primary,
    marginTop: 10,
    marginBottom: 25,
  },
  loginLink: {
    fontSize: 16,
    color: colors.text.light,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
