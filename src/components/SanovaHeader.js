import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

export default function SanovaHeader({
  height = 76,
  showLogo = true,
  title,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  style,
}) {
  return (
    <View style={[styles.header, { height }, style]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.deepForestGreen} />
      
      {showLogo && (
        <View style={styles.logoContainer}>
          <Image source={require('../../assets/logo.png')} style={styles.logoImage} />
          <Text style={styles.logoText}>SANOVA</Text>
        </View>
      )}
      
      {title && (
        <Text style={styles.title}>{title}</Text>
      )}
      
      {leftIcon && (
        <Ionicons 
          name={leftIcon} 
          size={24} 
          color={colors.white} 
          style={styles.leftIcon}
          onPress={onLeftPress}
        />
      )}
      
      {rightIcon && (
        <Ionicons 
          name={rightIcon} 
          size={24} 
          color={colors.white} 
          style={styles.rightIcon}
          onPress={onRightPress}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.deepForestGreen,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    position: 'relative',
  },
  
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  logoImage: {
    width: 24,
    height: 24,
    marginRight: 8,
    tintColor: colors.white,
  },
  
  logoText: {
    ...typography.logo,
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 2,
    color: colors.white,
  },
  
  title: {
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
    textAlign: 'center',
  },
  
  leftIcon: {
    position: 'absolute',
    left: 20,
    top: '50%',
    marginTop: -12,
  },
  
  rightIcon: {
    position: 'absolute',
    right: 20,
    top: '50%',
    marginTop: -12,
  },
});
