import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

export default function SanovaNavigationBar({
  activeTab = 'Map',
  onTabPress,
  style,
}) {
  const animatedValues = useRef({
    map: new Animated.Value(activeTab === 'Map' ? 1 : 0),
    marketplace: new Animated.Value(activeTab === 'Marketplace' ? 1 : 0),
    urgent: new Animated.Value(activeTab === 'Urgent' ? 1 : 0),
    bookings: new Animated.Value(activeTab === 'Bookings' ? 1 : 0),
  }).current;

  useEffect(() => {
    // Animate active tab
    Object.keys(animatedValues).forEach(tab => {
      Animated.timing(animatedValues[tab], {
        toValue: activeTab === tab ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  }, [activeTab]);

  const tabs = [
    { key: 'Map', icon: 'map', label: 'Map' },
    { key: 'Marketplace', icon: 'storefront', label: 'Marketplace' },
    { key: 'Urgent', icon: 'flash', label: 'Urgent' },
    { key: 'Bookings', icon: 'calendar', label: 'Bookings' },
  ];

  return (
    <View style={[styles.navigationBar, style]}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        const animatedValue = animatedValues[tab.key.toLowerCase()];
        
        const iconSize = animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [24, 30],
        });

        const iconOpacity = animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.6, 1],
        });

        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.navItem}
            onPress={() => onTabPress && onTabPress(tab.key)}
            activeOpacity={0.8}
          >
            <Animated.View style={styles.navContent}>
              <Animated.View style={{ opacity: iconOpacity }}>
                <Ionicons 
                  name={tab.icon} 
                  size={isActive ? 30 : 24} 
                  color={colors.white} 
                />
              </Animated.View>
              <Text style={[
                styles.navLabel,
                { color: isActive ? colors.white : 'rgba(255,255,255,0.6)' }
              ]}>
                {tab.label}
              </Text>
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  navigationBar: {
    height: 63,
    backgroundColor: colors.deepForestGreen,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 8,
  },
  
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 48,
    minHeight: 48,
    flex: 1,
  },
  
  navContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  navLabel: {
    fontFamily: 'Inter',
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
});
