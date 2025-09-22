import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { globalStyles } from '../../theme/styles';

export default function FavoriteSalonsScreen({ navigation }) {
  const [favoriteSalons, setFavoriteSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadFavoriteSalons();
  }, []);

  const loadFavoriteSalons = async () => {
    try {
      setLoading(true);
      // Mock data for now - in real app, this would come from Firestore
      const mockFavorites = [
        {
          id: 'salon_1',
          name: 'Gustav Salon',
          address: 'Frederiks Allé 28',
          rating: 4.8,
          image: require('../../../assets/saloon.png'),
          services: ['Haircut', 'Styling', 'Coloring'],
        },
        {
          id: 'salon_2',
          name: 'Nail Spa Studio',
          address: 'Hovedgade 15',
          rating: 4.6,
          image: require('../../../assets/manicure.png'),
          services: ['Manicure', 'Pedicure', 'Nail Art'],
        },
      ];
      setFavoriteSalons(mockFavorites);
    } catch (error) {
      console.error('Error loading favorite salons:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFavoriteSalons();
    setRefreshing(false);
  };

  const removeFromFavorites = (salonId) => {
    setFavoriteSalons(prev => prev.filter(salon => salon.id !== salonId));
  };

  const renderSalonItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.salonCard}
      onPress={() => navigation.navigate('SalonDetail', { salon: item })}
    >
      <View style={styles.salonImageContainer}>
        <Text style={styles.salonEmoji}>🏪</Text>
      </View>
      
      <View style={styles.salonInfo}>
        <Text style={styles.salonName}>{item.name}</Text>
        <Text style={styles.salonAddress}>{item.address}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color={colors.warning} />
          <Text style={styles.rating}>{item.rating}</Text>
        </View>
        <Text style={styles.services}>
          {item.services.slice(0, 2).join(', ')}
          {item.services.length > 2 && '...'}
        </Text>
      </View>
      
      <TouchableOpacity 
        style={styles.favoriteButton}
        onPress={() => removeFromFavorites(item.id)}
      >
        <Ionicons name="heart" size={24} color={colors.error} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="heart-outline" size={64} color={colors.text.secondary} />
      <Text style={styles.emptyTitle}>No Favorite Salons</Text>
      <Text style={styles.emptySubtitle}>
        Start exploring salons and add them to your favorites to see them here.
      </Text>
      <TouchableOpacity 
        style={styles.exploreButton}
        onPress={() => navigation.navigate('Map')}
      >
        <Text style={styles.exploreButtonText}>Explore Salons</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={globalStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.background.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Favorite Salons</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Salons List */}
      <FlatList
        data={favoriteSalons}
        renderItem={renderSalonItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={!loading ? renderEmptyState : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.background.white,
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  listContainer: {
    padding: 20,
    flexGrow: 1,
  },
  salonCard: {
    backgroundColor: colors.background.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  salonImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  salonEmoji: {
    fontSize: 24,
  },
  salonInfo: {
    flex: 1,
  },
  salonName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  salonAddress: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    color: colors.text.primary,
    marginLeft: 4,
    fontWeight: '500',
  },
  services: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  favoriteButton: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  exploreButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.background.white,
  },
});

