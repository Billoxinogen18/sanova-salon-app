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

// Custom Tab Bar Component matching exact specifications
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
          let iconSize = 20; // Default size
          switch (route.name) {
            case 'Map':
              iconName = 'location';
              iconSize = isFocused ? 24 : 20; // 24px for active, 20px for inactive
              break;
            case 'Marketplace':
              iconName = 'briefcase';
              iconSize = isFocused ? 24 : 20;
              break;
            case 'Urgent':
              iconName = 'compass';
              iconSize = isFocused ? 24 : 20;
              break;
            case 'Bookings':
              iconName = 'call';
              iconSize = isFocused ? 24 : 20;
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
                  size={iconSize} 
                  color={colors.background.white} 
                />
                {isFocused && (
                  <View style={premiumTabBarStyles.activeIndicator} />
                )}
                <Text style={premiumTabBarStyles.tabLabel}>
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

// Tab Bar Styles matching exact specifications
const premiumTabBarStyles = {
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.primary, // Deep forest green (#1C3521)
    height: 62, // 62px height as specified
    borderTopLeftRadius: 0, // Full-radius top corners as specified
    borderTopRightRadius: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingVertical: 8,
  },
  tabBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.background.white, // Brighter white accent underneath
  },
  tabLabel: {
    fontSize: 12, // 12px as specified
    marginTop: 4,
    fontWeight: '400',
    color: colors.background.white, // #FFFFFF as specified
    fontFamily: 'Inter',
  },
};
