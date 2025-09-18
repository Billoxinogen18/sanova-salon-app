import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, globalStyles } from '../../theme/styles';
import Header from '../../components/Header';

export default function UrgentScreen({ navigation }) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [searchText, setSearchText] = useState('');

  React.useEffect(() => {
    // Fade in animation when screen loads
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  // Available appointment times exactly as shown in design
  const availableTimes = [
    {
      id: 1,
      service: 'Classic Manicure',
      salon: 'Nail Spa Studio',
      time: '10:00 AM',
      distance: '0.5 km away',
    },
    {
      id: 2,
      service: "Men's Haircut",
      salon: 'Trendy Salon',
      time: '11:30 AM',
      distance: '1.2 km away',
    },
    {
      id: 3,
      service: 'Swedish Massage',
      salon: 'Wellness Center',
      time: '12:00 PM',
      distance: '1.3 km away',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header with dark green background exactly as in design */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SANOVA</Text>
      </View>

      {/* Search Bar - exactly as shown in design */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={colors.text.secondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor={colors.text.secondary}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>
      
      <Animated.ScrollView 
        style={[styles.content, { opacity: fadeAnim }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Available Times Title */}
        <Text style={styles.sectionTitle}>Available Times</Text>
        
        {/* Available appointments list - exactly as shown in design */}
        {availableTimes.map((item) => (
          <TouchableOpacity 
            key={item.id}
            style={styles.appointmentCard}
            onPress={() => navigation.navigate('ServiceDetail', { service: item })}
            activeOpacity={0.8}
          >
            <View style={styles.appointmentInfo}>
              <Text style={styles.serviceName}>{item.service}</Text>
              <Text style={styles.salonName}>{item.salon}</Text>
              <Text style={styles.distance}>{item.distance}</Text>
            </View>
            <View style={styles.timeInfo}>
              <Text style={styles.timeText}>{item.time}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </Animated.ScrollView>
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
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.white,
    textAlign: 'center',
  },
  searchContainer: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: colors.text.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 20,
    marginTop: 20,
  },
  appointmentCard: {
    backgroundColor: colors.background.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appointmentInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  salonName: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  distance: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  timeInfo: {
    alignItems: 'flex-end',
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
});