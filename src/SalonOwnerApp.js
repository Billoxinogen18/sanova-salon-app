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

// Import Salon Owner Screens
import DashboardScreen from './screens/salon/DashboardScreen';
import BookingsScreen from './screens/salon/BookingsScreen';
import ServicesScreen from './screens/salon/ServicesScreen';
import ProductsScreen from './screens/salon/ProductsScreen';
import PaymentsScreen from './screens/salon/PaymentsScreen';
import NewBookingScreen from './screens/salon/NewBookingScreen';
import NewServiceScreen from './screens/salon/NewServiceScreen';
import NewProductScreen from './screens/salon/NewProductScreen';
import BookingDetailScreen from './screens/salon/BookingDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Premium Custom Tab Bar Component - Exact same as customer side
function CustomTabBar({ state, descriptors, navigation }) {
  const animatedValues = useRef(
    state.routes.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    // Animate the active tab
    animatedValues.forEach((value, index) => {
      Animated.timing(value, {
        toValue: index === state.index ? 1 : 0,
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
              navigation.navigate(route.name);
            }
          };

          let iconName;
          switch (route.name) {
            case 'Dashboard':
              iconName = isFocused ? 'grid' : 'grid-outline';
              break;
            case 'Bookings':
              iconName = isFocused ? 'calendar' : 'calendar-outline';
              break;
            case 'Services':
              iconName = isFocused ? 'cut' : 'cut-outline';
              break;
            case 'Products':
              iconName = isFocused ? 'pricetag' : 'pricetag-outline';
              break;
            case 'Payments':
              iconName = isFocused ? 'card' : 'card-outline';
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

function SalonOwnerTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
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
        ...pageTransitions.fadeScale,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <Stack.Screen 
        name="SalonOwnerTabs" 
        component={SalonOwnerTabs}
        options={{
          ...pageTransitions.fadeScale,
        }}
      />
      <Stack.Screen 
        name="NewBooking" 
        component={NewBookingScreen}
        options={{
          ...pageTransitions.slideFromRight,
        }}
      />
      <Stack.Screen 
        name="NewService" 
        component={NewServiceScreen}
        options={{
          ...pageTransitions.slideFromRight,
        }}
      />
      <Stack.Screen 
        name="NewProduct" 
        component={NewProductScreen}
        options={{
          ...pageTransitions.slideFromRight,
        }}
      />
      <Stack.Screen 
        name="BookingDetail" 
        component={BookingDetailScreen}
        options={{
          ...pageTransitions.slideFromRight,
        }}
      />
    </Stack.Navigator>
  );
}

// Premium Tab Bar Styles - Exact same as customer side
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
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 11, // 11px font size
    fontWeight: '500',
    marginTop: 4, // 4px margin top
    textAlign: 'center',
  },
};
