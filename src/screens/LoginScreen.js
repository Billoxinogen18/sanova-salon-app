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

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('customer'); // 'customer' or 'salon'

  const handleLogin = () => {
    // For now, allow entry regardless of credentials
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Navigate to appropriate app based on user type
    if (userType === 'customer') {
      navigation.navigate('CustomerApp');
    } else {
      navigation.navigate('SalonOwnerApp');
    }
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
              <Text style={styles.subtitle}>Welcome Back</Text>
            </View>
          </View>

          <View style={styles.form}>
            <View style={styles.userTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.userTypeButton,
                  userType === 'customer' && styles.userTypeButtonActive
                ]}
                onPress={() => setUserType('customer')}
              >
                <Text style={[
                  styles.userTypeText,
                  userType === 'customer' && styles.userTypeTextActive
                ]}>
                  Customer
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.userTypeButton,
                  userType === 'salon' && styles.userTypeButtonActive
                ]}
                onPress={() => setUserType('salon')}
              >
                <Text style={[
                  styles.userTypeText,
                  userType === 'salon' && styles.userTypeTextActive
                ]}>
                  Salon Owner
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={colors.text.secondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor={colors.text.secondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[globalStyles.button, styles.loginButton]}
              onPress={handleLogin}
            >
              <Text style={globalStyles.buttonText}>Sign In</Text>
            </TouchableOpacity>

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.signupLink}>Sign Up</Text>
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
    paddingTop: 60,
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
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
    marginBottom: 30,
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
  inputContainer: {
    marginBottom: 20,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 30,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: colors.text.light,
    opacity: 0.8,
  },
  loginButton: {
    backgroundColor: colors.background.primary,
    marginBottom: 30,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontSize: 16,
    color: colors.text.light,
    opacity: 0.8,
  },
  signupLink: {
    fontSize: 16,
    color: colors.text.light,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
