import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../theme/colors';

export default function SanovaCard({
  children,
  variant = 'default',
  size = 'medium',
  onPress,
  style,
  ...props
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (onPress) {
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  };

  const getCardStyle = () => {
    const baseStyle = [styles.card, styles[`${variant}Card`], styles[`${size}Card`]];
    if (style) baseStyle.push(style);
    return baseStyle;
  };

  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <CardComponent
        style={getCardStyle()}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        {...props}
      >
        {children}
      </CardComponent>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    shadowColor: colors.deepForestGreen,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  
  // Variants
  defaultCard: {
    backgroundColor: colors.white,
  },
  
  lightCard: {
    backgroundColor: colors.lightCream,
  },
  
  paymentCard: {
    backgroundColor: colors.paymentCardBg,
  },
  
  termsCard: {
    backgroundColor: colors.offWhite,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  
  // Sizes
  smallCard: {
    padding: 12,
  },
  
  mediumCard: {
    padding: 16,
  },
  
  largeCard: {
    padding: 20,
  },
  
  // Special card types
  timeCard: {
    height: 74,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  paymentOptionCard: {
    height: 52,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  serviceCard: {
    paddingVertical: 6,
    paddingHorizontal: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
});
