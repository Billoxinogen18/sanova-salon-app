import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, globalStyles } from '../../theme/styles';
import Header from '../../components/Header';

const services = [
  {
    id: 1,
    name: "Women's Haircut",
    image: '👩',
    price: '$50',
    duration: '45 min',
  },
  {
    id: 2,
    name: "Men's Haircut",
    image: '👨',
    price: '$30',
    duration: '30 min',
  },
  {
    id: 3,
    name: 'Hair Coloring',
    image: '💇‍♀️',
    price: '$80',
    duration: '120 min',
  },
  {
    id: 4,
    name: 'Manicure',
    image: '💅',
    price: '$25',
    duration: '45 min',
  },
];

export default function ServicesScreen({ navigation }) {
  const renderService = ({ item }) => (
    <TouchableOpacity style={styles.serviceCard}>
      <View style={styles.serviceImage}>
        <Text style={styles.serviceImageText}>{item.image}</Text>
      </View>
      <Text style={styles.serviceName}>{item.name}</Text>
      <Text style={styles.servicePrice}>{item.price}</Text>
      <Text style={styles.serviceDuration}>{item.duration}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={globalStyles.container}>
      <Header title="Services" />
      
      <View style={styles.content}>
        <FlatList
          data={services}
          renderItem={renderService}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
        
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('NewService')}
        >
          <Ionicons name="add" size={32} color={colors.text.white} />
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listContainer: {
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
  },
  serviceCard: {
    backgroundColor: colors.background.white,
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceImageText: {
    fontSize: 30,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  serviceDuration: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    marginLeft: -40,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addButtonText: {
    color: colors.text.white,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});
