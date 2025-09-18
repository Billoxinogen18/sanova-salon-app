import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';

// Import app types
import CustomerApp from './src/CustomerApp';
import SalonOwnerApp from './src/SalonOwnerApp';
import WelcomeScreen from './src/screens/WelcomeScreenBasic';
import LoginScreen from './src/screens/LoginScreenSimple';
import SignUpScreen from './src/screens/SignUpScreenSimple';
import TestScreen from './src/screens/TestScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#2D5A3D" />
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Welcome"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Test" component={TestScreen} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="CustomerApp" component={CustomerApp} />
          <Stack.Screen name="SalonOwnerApp" component={SalonOwnerApp} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D5A3D',
  },
});
