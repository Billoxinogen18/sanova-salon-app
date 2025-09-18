import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { colors } from './theme/colors';

// Import Customer Screens
import MapScreen from './screens/customer/MapScreen';
import MarketplaceScreen from './screens/customer/MarketplaceScreen';
import UrgentScreen from './screens/customer/UrgentScreen';
import BookingsScreen from './screens/customer/BookingsScreen';
import ServiceDetailScreen from './screens/customer/ServiceDetailScreen';
import ProductDetailScreen from './screens/customer/ProductDetailScreen';
import SalonDetailScreen from './screens/customer/SalonDetailScreen';
import BookingFlowScreen from './screens/customer/BookingFlowScreen';
import PaymentMethodScreen from './screens/customer/PaymentMethodScreen';
import PaymentModelScreen from './screens/customer/PaymentModelScreen';
import ProfileScreen from './screens/customer/ProfileScreen';
import ReviewScreen from './screens/customer/ReviewScreen';
import PaymentSuccessScreen from './screens/customer/PaymentSuccessScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function CustomerTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Map') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Marketplace') {
            // 'bag' icons are not present in Ionicons set bundled with @expo/vector-icons.
            // Use cart icons which exist across versions.
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Urgent') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'Bookings') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: colors.text.white, // White for selected icons
        tabBarInactiveTintColor: 'rgba(255,255,255,0.6)', // Muted white for unselected icons
        tabBarStyle: {
          backgroundColor: colors.primary, // Deep green background
          borderTopWidth: 0,
          paddingTop: 8,
          paddingBottom: 20,
          height: 80,
          borderTopLeftRadius: 16, // 16dp radius as specified
          borderTopRightRadius: 16, // 16dp radius as specified
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Marketplace" component={MarketplaceScreen} />
      <Tab.Screen name="Urgent" component={UrgentScreen} />
      <Tab.Screen name="Bookings" component={BookingsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function CustomerApp() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="CustomerTabs" component={CustomerTabs} />
      <Stack.Screen name="ServiceDetail" component={ServiceDetailScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="SalonDetail" component={SalonDetailScreen} />
      <Stack.Screen name="BookingFlow" component={BookingFlowScreen} />
      <Stack.Screen name="PaymentMethod" component={PaymentMethodScreen} />
      <Stack.Screen name="PaymentModel" component={PaymentModelScreen} />
      <Stack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Review" component={ReviewScreen} />
    </Stack.Navigator>
  );
}
