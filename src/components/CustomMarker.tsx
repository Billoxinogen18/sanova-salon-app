import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

const CustomMarker = () => {
  return (
    <View style={styles.container}>
      <Svg width={36} height={36} viewBox="0 0 36 36">
        {/* Gold circle background with gradient effect */}
        <Circle
          cx={18}
          cy={18}
          r={18}
          fill="#C6AE78"
          stroke="#B89A5F"
          strokeWidth={0.5}
        />
        {/* White scissor icon - more accurate representation */}
        <Path
          d="M10 12 L14 16 L12 18 L8 14 Z M22 12 L26 16 L24 18 L20 14 Z M18 14 L18 20 M18 20 L14 24 M18 20 L22 24 M14 24 C14 26 16 28 18 28 C20 28 22 26 22 24"
          fill="#FFFFFF"
          stroke="#FFFFFF"
          strokeWidth={1.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Pivot point */}
        <Circle cx={18} cy={20} r={1} fill="#FFFFFF" />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CustomMarker;