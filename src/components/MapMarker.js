import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MapMarker = ({ size = 36, iconSize = 22 }) => {
  return (
    <View style={[styles.marker, { width: size, height: size }]}>
      <View style={[styles.markerInner, { width: size, height: size, borderRadius: size / 2 }]}>
        <Ionicons 
          name="cut" 
          size={iconSize} 
          color="#FFFFFF" 
          style={styles.scissorIcon}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  marker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerInner: {
    backgroundColor: '#C6AE78', // Gold color as specified
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1C3521',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  scissorIcon: {
    // Perfect antialiasing for the white scissor icon
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
});

export default MapMarker;