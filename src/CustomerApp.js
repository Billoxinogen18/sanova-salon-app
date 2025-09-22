import React, { useRef, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Animated, View, Text, TouchableOpacity } from 'react-native';
import { colors } from './theme/colors';
import { 
  typography, 
  spacing, 
  shadows, 
  borderRadius 
} from './theme/premiumStyles';
import { pageTransitions } from './theme/animations';

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
import BookingHistoryScreen from './screens/customer/BookingHistoryScreen';
import PaymentHistoryScreen from './screens/customer/PaymentHistoryScreen';
import FavoriteSalonsScreen from './screens/customer/FavoriteSalonsScreen';
import EditPhoneScreen from './screens/customer/EditPhoneScreen';

// Import New Booking Flow Screens
import DateTimeSelectionScreen from './screens/customer/DateTimeSelectionScreen';
import PaymentTermsScreen from './screens/customer/PaymentTermsScreen';
import AvailableTimesScreen from './screens/customer/AvailableTimesScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Premium Custom Tab Bar Component
function CustomTabBar({ state, descriptors, navigation }) {
  const animatedValues = useRef(
    state.routes.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    // Animate the active tab
    animatedValues.forEach((value, index) => {
      Animated.timing(value, {
        toValue: state.index === index ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  }, [state.index]);

  return (
    <View style={premiumTabBarStyles.container}>
      <View style={premiumTabBarStyles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              // Animate tab press
              Animated.sequence([
                Animated.timing(animatedValues[index], {
                  toValue: 0.8,
                  duration: 100,
                  useNativeDriver: true,
                }),
                Animated.timing(animatedValues[index], {
                  toValue: 1,
                  duration: 100,
                  useNativeDriver: true,
                }),
              ]).start();

              navigation.navigate(route.name);
            }
          };

          let iconName;
          switch (route.name) {
            case 'Map':
              iconName = isFocused ? 'map' : 'map-outline';
              break;
            case 'Marketplace':
              iconName = isFocused ? 'grid' : 'grid-outline';
              break;
            case 'Urgent':
              iconName = isFocused ? 'flash' : 'flash-outline';
              break;
            case 'Bookings':
              iconName = isFocused ? 'calendar' : 'calendar-outline';
              break;
            case 'Profile':
              iconName = isFocused ? 'person' : 'person-outline';
              break;
          }

          const animatedStyle = {
            transform: [{
              scale: animatedValues[index].interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.1],
              }),
            }],
          };

          const backgroundStyle = {
            opacity: animatedValues[index].interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            }),
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={premiumTabBarStyles.tabItem}
              activeOpacity={0.8}
            >
              <Animated.View style={[premiumTabBarStyles.tabBackground, backgroundStyle]} />
              <Animated.View style={[premiumTabBarStyles.tabContent, animatedStyle]}>
                <Ionicons 
                  name={iconName} 
                  size={22} // 22px icon size
                  color={isFocused ? '#FFFFFF' : 'rgba(255,255,255,0.7)'} 
                />
                <Text style={[
                  premiumTabBarStyles.tabLabel,
                  { color: isFocused ? '#FFFFFF' : 'rgba(255,255,255,0.7)' }
                ]}>
                  {label}
                </Text>
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function CustomerTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
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
        ...pageTransitions.fadeScale,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <Stack.Screen 
        name="CustomerTabs" 
        component={CustomerTabs}
        options={{
          ...pageTransitions.fadeScale,
        }}
      />
      <Stack.Screen 
        name="ServiceDetail" 
        component={ServiceDetailScreen}
        options={{
          ...pageTransitions.slideFromRight,
        }}
      />
      <Stack.Screen 
        name="ProductDetail" 
        component={ProductDetailScreen}
        options={{
          ...pageTransitions.slideFromRight,
        }}
      />
      <Stack.Screen 
        name="SalonDetail" 
        component={SalonDetailScreen}
        options={{
          ...pageTransitions.slideFromRight,
        }}
      />
      <Stack.Screen 
        name="BookingFlow" 
        component={BookingFlowScreen}
        options={{
          ...pageTransitions.slideFromRight,
        }}
      />
      <Stack.Screen 
        name="PaymentMethod" 
        component={PaymentMethodScreen}
        options={{
          ...pageTransitions.slideFromRight,
        }}
      />
      <Stack.Screen 
        name="PaymentModel" 
        component={PaymentModelScreen}
        options={{
          ...pageTransitions.modalSlideUp,
        }}
      />
      <Stack.Screen 
        name="PaymentSuccess" 
        component={PaymentSuccessScreen}
        options={{
          ...pageTransitions.fadeScale,
        }}
      />
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          ...pageTransitions.slideFromRight,
        }}
      />
      <Stack.Screen 
        name="Review" 
        component={ReviewScreen}
        options={{
          ...pageTransitions.slideFromRight,
        }}
      />
      <Stack.Screen 
        name="DateTimeSelection" 
        component={DateTimeSelectionScreen}
        options={{
          ...pageTransitions.slideFromRight,
        }}
      />
      <Stack.Screen 
        name="PaymentTerms" 
        component={PaymentTermsScreen}
        options={{
          ...pageTransitions.slideFromRight,
        }}
      />
      <Stack.Screen 
        name="AvailableTimes" 
        component={AvailableTimesScreen}
        options={{
          ...pageTransitions.slideFromRight,
        }}
      />
      <Stack.Screen 
        name="BookingHistory" 
        component={BookingHistoryScreen}
        options={{
          ...pageTransitions.slideFromRight,
        }}
      />
      <Stack.Screen 
        name="PaymentHistory" 
        component={PaymentHistoryScreen}
        options={{
          ...pageTransitions.slideFromRight,
        }}
      />
      <Stack.Screen 
        name="FavoriteSalons" 
        component={FavoriteSalonsScreen}
        options={{
          ...pageTransitions.slideFromRight,
        }}
      />
      <Stack.Screen 
        name="EditPhone" 
        component={EditPhoneScreen}
        options={{
          ...pageTransitions.slideFromRight,
        }}
      />
    </Stack.Navigator>
  );
}

// Premium Tab Bar Styles - Exact design specifications
const premiumTabBarStyles = {
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    paddingBottom: 0, // Remove padding to touch bottom
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#213527', // Exact deep green color
    height: 70, // 70px height for tab bar
    borderTopLeftRadius: 24, // Top corners only
    borderTopRightRadius: 24,
    paddingTop: 12, // 12px top padding
    paddingHorizontal: 20, // 20px horizontal padding
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingVertical: 8,
    borderRadius: 12,
  },
  tabBackground: {
    position: 'absolute',
    top: 0,
    left: 4,
    right: 4,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Active background
    borderRadius: 12,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 11, // 11px font size
    marginTop: 4, // 4px margin top
    fontWeight: '500',
    textAlign: 'center',
  },
};
