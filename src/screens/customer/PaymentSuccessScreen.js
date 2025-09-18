import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/styles';

export default function PaymentSuccessScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Payment Successful</Text>
        <Text style={styles.subtitle}>Your booking is confirmed.</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('CustomerTabs', { screen: 'Bookings' })}
          activeOpacity={0.9}
        >
          <Text style={styles.buttonText}>Go to Bookings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: colors.background.white,
    borderRadius: 12,
    padding: 24,
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 24,
  },
  buttonText: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
