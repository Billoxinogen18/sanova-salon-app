import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { authService, firestoreService } from './src/services/firebaseService';

// Import app types
import CustomerApp from './src/CustomerApp';
import SalonOwnerApp from './src/SalonOwnerApp';
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreenPremium';
import SignUpScreen from './src/screens/SignUpScreenPremium';

// Import services
import notificationServiceInstance from './src/services/notificationService';
import realtimeServiceInstance from './src/services/realtimeService';

// Import premium animations
import { pageTransitions } from './src/theme/animations';

const Stack = createStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Welcome');

  // Initialize services and check login state on app startup
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🚀 Initializing Sanova app...');
        
        // Wait for Firebase auth to initialize, then check login state
        const checkAuthState = () => {
          return new Promise((resolve) => {
            const unsubscribe = authService.onAuthStateChanged((user) => {
              unsubscribe();
              console.log('🔐 Firebase auth state:', user ? user.uid : 'No user');
              resolve(user);
            });
            
            // Fallback timeout
            setTimeout(() => {
              unsubscribe();
              const currentUser = authService.getCurrentUser();
              console.log('🔐 Fallback user check:', currentUser ? currentUser.uid : 'No user');
              resolve(currentUser);
            }, 2000);
          });
        };
        
        const user = await checkAuthState();
        
        if (user) {
          console.log('✅ User already logged in, checking user role');
          // Get user data from Firestore to determine navigation
          try {
            const userDoc = await firestoreService.users.get(user.uid);
            if (userDoc.success && userDoc.data.role === 'salon') {
              console.log('🏢 Salonist user, navigating to SalonOwnerApp');
              setInitialRoute('SalonOwnerApp');
            } else {
              console.log('👤 Customer user, navigating to CustomerApp');
              setInitialRoute('CustomerApp');
            }
          } catch (error) {
            console.log('⚠️ Error checking user role, defaulting to CustomerApp');
            setInitialRoute('CustomerApp');
          }
        } else {
          console.log('👤 No user logged in, showing welcome screen');
          setInitialRoute('Welcome');
        }
        
        // Initialize notification service
        const notificationResult = await notificationServiceInstance.initialize();
        if (notificationResult.success) {
          console.log('✅ Notification service initialized');
        } else {
          console.warn('⚠️ Notification service failed to initialize:', notificationResult.error);
        }
        
        // Initialize real-time service
        const realtimeResult = await realtimeServiceInstance.initialize();
        if (realtimeResult.success) {
          console.log('✅ Real-time service initialized');
        } else {
          console.warn('⚠️ Real-time service failed to initialize:', realtimeResult.error);
        }
        
        console.log('🎉 Sanova app initialization complete');
      } catch (error) {
        console.error('❌ Error initializing app:', error);
        setInitialRoute('Welcome'); // Fallback to welcome screen
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();

    // Cleanup on app unmount
    return () => {
      notificationServiceInstance.cleanup();
      realtimeServiceInstance.cleanup();
    };
  }, []);

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar style="light" backgroundColor="#263428" />
        {/* Simple loading indicator */}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#263428" />
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName={initialRoute}
          screenOptions={{
            headerShown: false,
            ...pageTransitions.fadeScale,
            gestureEnabled: true,
            gestureDirection: 'horizontal',
          }}
        >
          <Stack.Screen 
            name="Welcome" 
            component={WelcomeScreen}
            options={{
              ...pageTransitions.fadeScale,
            }}
          />
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{
              ...pageTransitions.slideFromRight,
            }}
          />
          <Stack.Screen 
            name="SignUp" 
            component={SignUpScreen}
            options={{
              ...pageTransitions.slideFromRight,
            }}
          />
          <Stack.Screen 
            name="CustomerApp" 
            component={CustomerApp}
            options={{
              ...pageTransitions.fadeScale,
            }}
          />
          <Stack.Screen 
            name="SalonOwnerApp" 
            component={SalonOwnerApp}
            options={{
              ...pageTransitions.fadeScale,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#263428', // Updated to use primary color from design system
  },
});
