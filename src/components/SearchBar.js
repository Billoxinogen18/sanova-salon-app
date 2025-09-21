import React, { useRef } from 'react';
import { View, TextInput, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const SearchBar = ({ 
  placeholder = "Search", 
  value, 
  onChangeText, 
  onFocus, 
  onBlur,
  style,
  containerStyle 
}) => {
  const searchBorderAnimation = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    Animated.timing(searchBorderAnimation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
    onFocus && onFocus();
  };

  const handleBlur = () => {
    Animated.timing(searchBorderAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    onBlur && onBlur();
  };

  const searchBorderColor = searchBorderAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border.primary, colors.primary],
  });

  return (
    <View style={[styles.container, containerStyle]}>
      <Animated.View
        style={[
          styles.searchBar,
          { borderColor: searchBorderColor },
          style
        ]}
      >
        <Ionicons 
          name="search" 
          size={20} 
          color={colors.text.secondary} 
        />
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          placeholderTextColor={colors.text.secondary}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {value && value.length > 0 && (
          <TouchableOpacity
            onPress={() => onChangeText('')}
            style={styles.clearButton}
            activeOpacity={0.7}
          >
            <Ionicons name="close-circle" size={20} color={colors.text.secondary} />
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.white, // #F8F6EC as specified
    height: 28, // Exact height as specified
    borderRadius: 18, // Exact radius as specified
    paddingHorizontal: 16, // 16px left/right internal padding as specified
    borderWidth: 1,
    borderColor: colors.border.primary,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16, // Inter font, 16px as specified
    color: colors.text.primary,
    fontFamily: 'Inter',
  },
  clearButton: {
    padding: 4,
  },
});

export default SearchBar;