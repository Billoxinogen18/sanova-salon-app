import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function TestScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Test Screen - App is working!</Text>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Welcome')}
      >
        <Text style={styles.buttonText}>Go to Welcome</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D5A3D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#F5F5DC',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#F5F5DC',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#2D5A3D',
    fontSize: 16,
    fontWeight: '600',
  },
});
