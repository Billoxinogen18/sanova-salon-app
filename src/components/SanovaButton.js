import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  View,
} from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

export default function SanovaButton({
  title,
  onPress,
  variant = 'primary',
  size = 'large',
  disabled = false,
  style,
  textStyle,
  ...props
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.95,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[`${variant}Button`], styles[`${size}Button`]];
    if (disabled) baseStyle.push(styles.disabledButton);
    if (style) baseStyle.push(style);
    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle = [styles.buttonText, styles[`${variant}Text`], styles[`${size}Text`]];
    if (disabled) baseStyle.push(styles.disabledText);
    if (textStyle) baseStyle.push(textStyle);
    return baseStyle;
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={getButtonStyle()}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.9}
        {...props}
      >
        <Text style={getTextStyle()}>{title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.deepForestGreen,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  
  // Variants
  primaryButton: {
    backgroundColor: colors.deepForestGreen,
  },
  
  secondaryButton: {
    backgroundColor: colors.paleIvory,
  },
  
  goldButton: {
    backgroundColor: colors.paleGold,
  },
  
  // Sizes
  largeButton: {
    height: 51,
    paddingHorizontal: 24,
  },
  
  mediumButton: {
    height: 50,
    paddingHorizontal: 20,
  },
  
  smallButton: {
    height: 44,
    paddingHorizontal: 16,
  },
  
  // Text styles
  buttonText: {
    fontFamily: 'Inter',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
  primaryText: {
    color: colors.white,
    fontSize: 19,
    letterSpacing: 1.2,
  },
  
  secondaryText: {
    color: colors.darkGreen,
    fontSize: 18,
  },
  
  goldText: {
    color: colors.darkGreen,
    fontSize: 18,
  },
  
  // Size text
  largeText: {
    fontSize: 19,
  },
  
  mediumText: {
    fontSize: 18,
  },
  
  smallText: {
    fontSize: 16,
  },
  
  // Disabled state
  disabledButton: {
    backgroundColor: colors.lightGray,
    shadowOpacity: 0.05,
  },
  
  disabledText: {
    color: colors.gray,
  },
});
