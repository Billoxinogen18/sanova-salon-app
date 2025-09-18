import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { colors } from './theme/colors';

// Import Salon Owner Screens
import DashboardScreen from './screens/salon/DashboardScreen';
import BookingsScreen from './screens/salon/BookingsScreen';
import ServicesScreen from './screens/salon/ServicesScreen';
import ProductsScreen from './screens/salon/ProductsScreen';
import PaymentsScreen from './screens/salon/PaymentsScreen';
import NewBookingScreen from './screens/salon/NewBookingScreen';
import NewServiceScreen from './screens/salon/NewServiceScreen';
import NewProductScreen from './screens/salon/NewProductScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function SalonOwnerTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Bookings') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Services') {
            iconName = focused ? 'cut' : 'cut-outline';
          } else if (route.name === 'Products') {
            iconName = focused ? 'pricetag' : 'pricetag-outline';
          } else if (route.name === 'Payments') {
            iconName = focused ? 'card' : 'card-outline';
          }

          return <Ionicons name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: colors.text.light,
        tabBarInactiveTintColor: colors.text.light,
        tabBarStyle: {
          backgroundColor: colors.primary,
          paddingTop: 8,
          paddingBottom: 20,
          height: 80,
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Bookings" component={BookingsScreen} />
      <Tab.Screen name="Services" component={ServicesScreen} />
      <Tab.Screen name="Products" component={ProductsScreen} />
      <Tab.Screen name="Payments" component={PaymentsScreen} />
    </Tab.Navigator>
  );
}

export default function SalonOwnerApp() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="SalonOwnerTabs" component={SalonOwnerTabs} />
      <Stack.Screen name="NewBooking" component={NewBookingScreen} />
      <Stack.Screen name="NewService" component={NewServiceScreen} />
      <Stack.Screen name="NewProduct" component={NewProductScreen} />
    </Stack.Navigator>
  );
}
