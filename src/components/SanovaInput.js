import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

export default function SanovaInput({
  placeholder,
  value,
  onChangeText,
  variant = 'default',
  size = 'medium',
  icon,
  secureTextEntry = false,
  multiline = false,
  numberOfLines = 1,
  style,
  inputStyle,
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const borderAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1.02,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(borderAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(borderAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const getInputStyle = () => {
    const baseStyle = [styles.input, styles[`${variant}Input`], styles[`${size}Input`]];
    if (style) baseStyle.push(style);
    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle = [styles.inputText, styles[`${size}Text`]];
    if (inputStyle) baseStyle.push(inputStyle);
    return baseStyle;
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.borderLight, colors.deepForestGreen],
  });

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
      <View style={getInputStyle()}>
        {icon && (
          <Ionicons 
            name={icon} 
            size={20} 
            color={isFocused ? colors.deepForestGreen : colors.gray} 
            style={styles.inputIcon}
          />
        )}
        
        <TextInput
          style={getTextStyle()}
          placeholder={placeholder}
          placeholderTextColor={colors.gray}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={secureTextEntry && !showPassword}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical={multiline ? 'top' : 'center'}
          {...props}
        />
        
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Ionicons 
              name={showPassword ? 'eye-off' : 'eye'} 
              size={20} 
              color={colors.gray} 
            />
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  
  // Variants
  defaultInput: {
    backgroundColor: colors.white,
  },
  
  searchInput: {
    backgroundColor: colors.searchBarBg,
    borderRadius: 26,
  },
  
  feedbackInput: {
    backgroundColor: colors.searchBarBg,
    borderWidth: 0,
  },
  
  // Sizes
  smallInput: {
    height: 38,
    paddingHorizontal: 16,
  },
  
  mediumInput: {
    height: 48,
    paddingHorizontal: 16,
  },
  
  largeInput: {
    height: 56,
    paddingHorizontal: 20,
  },
  
  // Text styles
  inputText: {
    flex: 1,
    fontFamily: 'Inter',
    fontSize: 16,
    color: colors.darkGreen,
  },
  
  smallText: {
    fontSize: 14,
  },
  
  mediumText: {
    fontSize: 16,
  },
  
  largeText: {
    fontSize: 18,
  },
  
  // Icons
  inputIcon: {
    marginRight: 12,
  },
  
  eyeIcon: {
    marginLeft: 12,
    padding: 4,
  },
});
