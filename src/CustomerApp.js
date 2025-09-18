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
                  size={20} 
                  color={isFocused ? colors.background.white : 'rgba(255,255,255,0.6)'} 
                />
                <Text style={[
                  premiumTabBarStyles.tabLabel,
                  { color: isFocused ? colors.background.white : 'rgba(255,255,255,0.6)' }
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
    </Stack.Navigator>
  );
}

// Premium Tab Bar Styles
const premiumTabBarStyles = {
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    paddingBottom: 0, // Remove bottom padding to prevent content overlap
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    marginHorizontal: spacing.md, // Reduce horizontal margin
    marginBottom: spacing.sm, // Reduce bottom margin
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.xs, // Reduce vertical padding
    paddingHorizontal: spacing.xs,
    ...shadows.floating,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingVertical: spacing.xs, // Reduce padding
    borderRadius: borderRadius.lg,
  },
  tabBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: borderRadius.lg,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 10, // Smaller font size
    marginTop: 2, // Reduce margin
    fontWeight: '600',
  },
};
