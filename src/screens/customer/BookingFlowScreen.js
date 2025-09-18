import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, globalStyles } from '../../theme/styles';
import Header from '../../components/Header';

export default function BookingFlowScreen({ navigation, route }) {
  const { service } = route.params || {
    service: {
      name: 'Classic Manicure',
      price: '200 kr',
      salon: 'Gustav Salon',
      duration: '45 min',
    }
  };

  const [selectedDate, setSelectedDate] = useState('25. april');
  const [selectedTime, setSelectedTime] = useState('11:00');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [buttonScale] = useState(new Animated.Value(1));

  React.useEffect(() => {
    // Fade in animation when screen loads
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  // Available dates exactly as shown in design
  const availableDates = [
    { id: 1, date: '24. april', day: 'I dag' },
    { id: 2, date: '25. april', day: 'I morgen' },
    { id: 3, date: '26. april', day: 'Fredag' },
    { id: 4, date: '27. april', day: 'Lørdag' },
  ];

  // Available times exactly as shown in design
  const availableTimes = [
    { id: 1, time: '09:00' },
    { id: 2, time: '10:00' },
    { id: 3, time: '11:00' },
    { id: 4, time: '12:00' },
    { id: 5, time: '14:00' },
    { id: 6, time: '15:00' },
    { id: 7, time: '16:00' },
    { id: 8, time: '17:00' },
  ];

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleContinue = () => {
    // Animate button press
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.navigate('PaymentMethod', { 
        service, 
        selectedDateTime: `${selectedDate} kl. ${selectedTime}` 
      });
    });
  };

  return (
    <View style={styles.container}>
      {/* Header with dark green background exactly as in design */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book</Text>
        <View style={styles.placeholder} />
      </View>
      
      <Animated.ScrollView 
        style={[styles.content, { opacity: fadeAnim }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Service Info Card - exactly as shown in design */}
        <View style={styles.serviceCard}>
          <Text style={styles.serviceTitle}>Book</Text>
          <View style={styles.serviceInfo}>
            <Text style={styles.serviceName}>{service.name}</Text>
            <Text style={styles.serviceDetails}>
              Dato og tid: {selectedDate} kl. {selectedTime}
            </Text>
            <Text style={styles.serviceDuration}>Varighed: {service.duration || '45 min'}</Text>
            <Text style={styles.servicePrice}>{service.price}</Text>
          </View>
        </View>

        {/* Date Selection - exactly as shown in design */}
        <View style={styles.selectionSection}>
          <Text style={styles.sectionTitle}>Vælg dato</Text>
          <View style={styles.dateGrid}>
            {availableDates.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.dateCard,
                  selectedDate === item.date && styles.selectedCard
                ]}
                onPress={() => handleDateSelect(item.date)}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.dateText,
                  selectedDate === item.date && styles.selectedText
                ]}>
                  {item.date}
                </Text>
                <Text style={[
                  styles.dayText,
                  selectedDate === item.date && styles.selectedText
                ]}>
                  {item.day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Time Selection - exactly as shown in design */}
        <View style={styles.selectionSection}>
          <Text style={styles.sectionTitle}>Vælg tid</Text>
          <View style={styles.timeGrid}>
            {availableTimes.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.timeCard,
                  selectedTime === item.time && styles.selectedCard
                ]}
                onPress={() => handleTimeSelect(item.time)}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.timeText,
                  selectedTime === item.time && styles.selectedText
                ]}>
                  {item.time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Animated.ScrollView>

      {/* Continue Button - exactly as shown in design */}
      <View style={styles.continueButtonContainer}>
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.9}
          >
            <Text style={styles.continueButtonText}>Fortsæt</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 16, // 16dp radius as specified
    borderBottomRightRadius: 16, // 16dp radius as specified
    overflow: 'hidden', // Make corner radius visible
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.white,
    flex: 1,
    textAlign: 'center',
    fontFamily: 'serif',
    letterSpacing: 2, // +2 letter spacing as specified
    textTransform: 'uppercase',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: colors.background.primary,
    borderTopLeftRadius: 16, // 16dp radius as specified
    borderTopRightRadius: 16, // 16dp radius as specified
    marginTop: -16, // Overlap with header to create seamless curve
    overflow: 'hidden', // Make corner radius visible
  },
  serviceCard: {
    backgroundColor: colors.background.card, // Lighter cream shade for cards
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    marginBottom: 24,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  serviceInfo: {
    gap: 8,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  serviceDetails: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  serviceDuration: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  selectionSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  dateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  dateCard: {
    backgroundColor: colors.background.card, // Lighter cream shade for cards
    borderRadius: 12,
    padding: 16,
    width: '47%',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  dayText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  selectedText: {
    color: colors.text.white,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeCard: {
    backgroundColor: colors.background.card, // Lighter cream shade for cards
    borderRadius: 12,
    padding: 16,
    width: '22%',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  continueButtonContainer: {
    padding: 20,
    backgroundColor: colors.background.primary,
  },
  continueButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  continueButtonText: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: '600',
  },
});