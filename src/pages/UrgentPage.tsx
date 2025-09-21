import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import UrgentCard from '../components/UrgentCard';

const UrgentPage = () => {
  const [searchText, setSearchText] = useState('');

  const urgentServices = [
    {
      id: 1,
      title: 'Emergency Hair Repair',
      description: 'Same-day hair repair services for damaged hair',
    },
    {
      id: 2,
      title: 'Quick Color Touch-up',
      description: 'Express color correction and touch-up services',
    },
    {
      id: 3,
      title: 'Last-minute Styling',
      description: 'Emergency styling for special events',
    },
    {
      id: 4,
      title: 'Hair Extension Repair',
      description: 'Urgent hair extension maintenance and repair',
    },
  ];

  return (
    <View style={styles.container}>
      <Header />
      <SearchBar value={searchText} onChangeText={setSearchText} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Main Urgent Icon/Content */}
        <View style={styles.urgentIconContainer}>
          <View style={styles.urgentIcon}>
            <Icon name="flash-on" size={48} color="#1C3521" />
          </View>
        </View>

        {/* Main Urgent Card */}
        <View style={styles.mainCardContainer}>
          <UrgentCard
            title="Urgent Services Available"
            description="Get immediate help with your hair and beauty needs. Our emergency services are available 24/7."
            isMain={true}
          />
        </View>

        {/* Urgent Services List */}
        {urgentServices.map((service) => (
          <View key={service.id} style={styles.cardContainer}>
            <UrgentCard
              title={service.title}
              description={service.description}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  urgentIconContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  urgentIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F8F6EC',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1C3521',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  mainCardContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  cardContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
});

export default UrgentPage;