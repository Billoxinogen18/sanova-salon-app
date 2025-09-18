import React, { useState } from 'react';
import { TouchableOpacity, Animated, Text } from 'react-native';
import { colors } from '../theme/colors';

export default function AnimatedButton({ 
  style, 
  textStyle, 
  children, 
  onPress, 
  disabled = false,
  variant = 'primary',
  size = 'medium',
  ...props 
}) {
  const [scaleAnim] = useState(new Animated.Value(1));
  const [opacityAnim] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    if (disabled) return;
    
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const getButtonStyle = () => {
    const baseStyle = {
      borderRadius: 25,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.shadow.medium,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 4,
      elevation: 3,
    };

    const sizeStyles = {
      small: { paddingVertical: 12, paddingHorizontal: 20 },
      medium: { paddingVertical: 16, paddingHorizontal: 24 },
      large: { paddingVertical: 20, paddingHorizontal: 32 },
    };

    const variantStyles = {
      primary: {
        backgroundColor: disabled ? colors.lightGray : colors.primary,
      },
      secondary: {
        backgroundColor: disabled ? colors.lightGray : colors.background.white,
        borderWidth: 2,
        borderColor: disabled ? colors.lightGray : colors.primary,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: disabled ? colors.lightGray : colors.primary,
      },
    };

    return [baseStyle, sizeStyles[size], variantStyles[variant], style];
  };

  const getTextStyle = () => {
    const baseTextStyle = {
      fontWeight: '600',
      fontSize: size === 'small' ? 14 : size === 'large' ? 18 : 16,
    };

    const variantTextStyles = {
      primary: {
        color: disabled ? colors.text.muted : colors.text.white,
      },
      secondary: {
        color: disabled ? colors.text.muted : colors.primary,
      },
      outline: {
        color: disabled ? colors.text.muted : colors.primary,
      },
    };

    return [baseTextStyle, variantTextStyles[variant], textStyle];
  };

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
        opacity: opacityAnim,
      }}
    >
      <TouchableOpacity
        style={getButtonStyle()}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={1}
        {...props}
      >
        {typeof children === 'string' ? (
          <Text style={getTextStyle()}>{children}</Text>
        ) : (
          children
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}
