import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { colors } from '../theme/colors';
import { globalStyles } from '../theme/styles';

export default function SignUpScreen({ navigation }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    userType: 'customer', // 'customer' or 'salon'
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignUp = () => {
    // Basic validation
    if (!formData.firstName.trim() || !formData.lastName.trim() || 
        !formData.email.trim() || !formData.password.trim() || 
        !formData.phone.trim()) {
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

    // For now, allow entry regardless of credentials
    Alert.alert(
      'Success', 
      'Account created successfully!',
      [
        {
          text: 'OK',
          onPress: () => {
            // Navigate to appropriate app based on user type
            if (formData.userType === 'customer') {
              navigation.navigate('CustomerApp');
            } else {
              navigation.navigate('SalonOwnerApp');
            }
          }
        }
      ]
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logoIcon}>
                <Text style={styles.logoText}>🌿</Text>
              </View>
              <Text style={styles.logoTitle}>SANOVA</Text>
              <Text style={styles.subtitle}>Create Your Account</Text>
            </View>
          </View>

          <View style={styles.form}>
            <View style={styles.userTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.userTypeButton,
                  formData.userType === 'customer' && styles.userTypeButtonActive
                ]}
                onPress={() => handleInputChange('userType', 'customer')}
              >
                <Text style={[
                  styles.userTypeText,
                  formData.userType === 'customer' && styles.userTypeTextActive
                ]}>
                  Customer
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.userTypeButton,
                  formData.userType === 'salon' && styles.userTypeButtonActive
                ]}
                onPress={() => handleInputChange('userType', 'salon')}
              >
                <Text style={[
                  styles.userTypeText,
                  formData.userType === 'salon' && styles.userTypeTextActive
                ]}>
                  Salon Owner
                </Text>
              </TouchableOpacity>
            </View>

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
              <Text style={styles.label}>Phone Number *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                placeholderTextColor={colors.text.secondary}
                value={formData.phone}
                onChangeText={(value) => handleInputChange('phone', value)}
                keyboardType="phone-pad"
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

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  logoText: {
    fontSize: 30,
  },
  logoTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.light,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.light,
    opacity: 0.8,
  },
  form: {
    flex: 1,
  },
  userTypeContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 4,
    marginBottom: 25,
  },
  userTypeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  userTypeButtonActive: {
    backgroundColor: colors.background.primary,
  },
  userTypeText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  userTypeTextActive: {
    color: colors.text.primary,
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 16,
    color: colors.text.light,
    opacity: 0.8,
  },
  loginLink: {
    fontSize: 16,
    color: colors.text.light,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
