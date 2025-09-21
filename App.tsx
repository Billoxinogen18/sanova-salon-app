import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import MapPage from './src/pages/MapPage';
import MarketplacePage from './src/pages/MarketplacePage';
import UrgentPage from './src/pages/UrgentPage';
import BookingsPage from './src/pages/BookingsPage';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#1C3521" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: string;
              let iconSize = focused ? 24 : 20;

              if (route.name === 'Map') {
                iconName = 'location-on';
              } else if (route.name === 'Marketplace') {
                iconName = 'shopping-bag';
              } else if (route.name === 'Urgent') {
                iconName = 'flash-on';
              } else if (route.name === 'Bookings') {
                iconName = 'phone';
              } else {
                iconName = 'circle';
              }

              return (
                <View style={styles.iconContainer}>
                  <Icon 
                    name={iconName} 
                    size={iconSize} 
                    color={color}
                    style={focused ? styles.activeIcon : styles.inactiveIcon}
                  />
                  {focused && <View style={styles.activeIndicator} />}
                </View>
              );
            },
            tabBarActiveTintColor: '#FFFFFF',
            tabBarInactiveTintColor: '#FFFFFF',
            tabBarStyle: styles.tabBar,
            tabBarLabelStyle: styles.tabBarLabel,
            headerShown: false,
          })}
        >
          <Tab.Screen name="Map" component={MapPage} />
          <Tab.Screen name="Marketplace" component={MarketplacePage} />
          <Tab.Screen name="Urgent" component={UrgentPage} />
          <Tab.Screen name="Bookings" component={BookingsPage} />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: 62,
    backgroundColor: '#1C3521',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingTop: 8,
    paddingBottom: 8,
  },
  tabBarLabel: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: '#FFFFFF',
    marginTop: 2,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIcon: {
    marginBottom: 2,
  },
  inactiveIcon: {
    marginBottom: 2,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
    opacity: 0.8,
  },
});

export default App;