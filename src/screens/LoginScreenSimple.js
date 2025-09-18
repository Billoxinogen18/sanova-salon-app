import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { authService, firestoreService } from '../services/firebaseService';
import { colors } from '../theme/colors';
import { globalStyles } from '../theme/styles';

export default function LoginScreenSimple({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('customer');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      // Sign in with Firebase Auth
      const signInResult = await authService.signIn(email, password);
      
      if (!signInResult.success) {
        Alert.alert('Login Failed', signInResult.error);
        return;
      }

      const user = signInResult.user;
      
      // Get user data from Firestore to check role
      const userDataResult = await firestoreService.users.get(user.uid);
      
      if (userDataResult.success) {
        const userData = userDataResult.data;
        
        // Check if user role matches selected type
        if (userData.role !== userType) {
          Alert.alert(
            'Account Type Mismatch', 
            `This account is registered as a ${userData.role}. Please select the correct account type.`
          );
          return;
        }
        
        // Navigate to appropriate app
        if (userType === 'customer') {
          navigation.navigate('CustomerApp');
        } else {
          navigation.navigate('SalonOwnerApp');
        }
      } else {
        // User doesn't exist in Firestore, create basic record
        const newUserData = {
          uid: user.uid,
          email: user.email,
          name: user.displayName || email.split('@')[0],
          role: userType,
          phone: '',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        await firestoreService.users.create(user.uid, newUserData);
        
        // Navigate to appropriate app
        if (userType === 'customer') {
          navigation.navigate('CustomerApp');
        } else {
          navigation.navigate('SalonOwnerApp');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Failed', error.message || 'An unexpected error occurred');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Sign In</Text>
        
        <View style={styles.userTypeContainer}>
          <TouchableOpacity
            style={[styles.userTypeButton, userType === 'customer' && styles.activeUserType]}
            onPress={() => setUserType('customer')}
          >
            <Text style={[styles.userTypeText, userType === 'customer' && styles.activeUserTypeText]}>
              Customer
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.userTypeButton, userType === 'salon' && styles.activeUserType]}
            onPress={() => setUserType('salon')}
          >
            <Text style={[styles.userTypeText, userType === 'salon' && styles.activeUserTypeText]}>
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

        <TouchableOpacity
          style={[globalStyles.button, styles.loginButton]}
          onPress={handleLogin}
        >
          <Text style={globalStyles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signupLink}>Don't have an account? Sign Up</Text>
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
    paddingTop: 60,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.light,
    textAlign: 'center',
    marginBottom: 40,
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
  loginButton: {
    backgroundColor: colors.background.primary,
    marginTop: 20,
    marginBottom: 20,
  },
  signupLink: {
    fontSize: 16,
    color: colors.text.light,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  userTypeContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    backgroundColor: colors.background.primary,
    borderRadius: 12,
    padding: 4,
  },
  userTypeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeUserType: {
    backgroundColor: colors.primary,
  },
  userTypeText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  activeUserTypeText: {
    color: colors.text.light,
  },
});
