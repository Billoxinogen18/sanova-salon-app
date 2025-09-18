import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { authService } from './src/services/firebaseService';

// Import app types
import CustomerApp from './src/CustomerApp';
import SalonOwnerApp from './src/SalonOwnerApp';
import WelcomeScreen from './src/screens/WelcomeScreenEnhanced';
import LoginScreen from './src/screens/LoginScreenPremium';
import SignUpScreen from './src/screens/SignUpScreenPremium';
import TestScreen from './src/screens/TestScreen';

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
        
        // Check if user is already logged in using Firebase auth state
        const currentUser = authService.getCurrentUser();
        console.log('🔐 Current user check:', currentUser ? currentUser.uid : 'No user');
        
        if (currentUser) {
          console.log('✅ User already logged in, navigating to app');
          setInitialRoute('CustomerApp'); // Default to customer app
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
          <Stack.Screen name="Test" component={TestScreen} />
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
