import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import SearchBar from '../../components/SearchBar';

export default function UrgentScreen({ navigation }) {
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
  }, []);

  const urgentOffers = [
    {
      id: 1,
      title: 'Emergency Hair Repair',
      description: 'Same-day hair treatment for damaged hair',
      price: '299 kr',
      timeLeft: '2 hours left',
      icon: 'cut'
    },
    {
      id: 2,
      title: 'Express Manicure',
      description: 'Quick 30-minute manicure service',
      price: '199 kr',
      timeLeft: '1 hour left',
      icon: 'hand-left'
    },
    {
      id: 3,
      title: 'Last-Minute Facial',
      description: 'Deep cleansing facial treatment',
      price: '399 kr',
      timeLeft: '3 hours left',
      icon: 'sparkles'
    },
    {
      id: 4,
      title: 'Urgent Eyebrow Shaping',
      description: 'Professional eyebrow shaping and tinting',
      price: '149 kr',
      timeLeft: '45 min left',
      icon: 'eye'
    }
  ];

  const handleOfferPress = (offer) => {
    // Navigate to booking or offer details
    console.log('Offer pressed:', offer);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      {/* Header Bar - Forest Green with Logo */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="leaf" size={20} color={colors.background.white} />
          <Ionicons name="leaf" size={20} color={colors.background.white} style={{ marginLeft: -8 }} />
        </View>
        <Text style={styles.headerTitle}>SANOVA</Text>
      </View>
      
      <View style={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <SearchBar
            placeholder="Search"
            value={searchText}
            onChangeText={setSearchText}
            containerStyle={styles.searchBarContainer}
          />
        </View>

        {/* Urgent Icon/Content Block */}
        <View style={styles.urgentBlock}>
          <View style={styles.urgentIconContainer}>
            <Ionicons name="flash" size={32} color={colors.accent} />
          </View>
          <Text style={styles.urgentTitle}>Urgent Services</Text>
          <Text style={styles.urgentSubtitle}>Available now for immediate booking</Text>
        </View>

        {/* Urgent Offers List */}
        <ScrollView 
          style={styles.offersContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.offersContent}
        >
          {urgentOffers.map((offer) => (
            <TouchableOpacity 
              key={offer.id}
              style={styles.offerCard}
              onPress={() => handleOfferPress(offer)}
              activeOpacity={0.9}
            >
              <View style={styles.offerIconContainer}>
                <Ionicons name={offer.icon} size={28} color={colors.text.primary} />
              </View>
              <View style={styles.offerInfo}>
                <Text style={styles.offerTitle}>{offer.title}</Text>
                <Text style={styles.offerDescription}>{offer.description}</Text>
                <View style={styles.offerFooter}>
                  <Text style={styles.offerPrice}>{offer.price}</Text>
                  <Text style={styles.offerTime}>{offer.timeLeft}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.background.white,
    fontFamily: 'serif',
    letterSpacing: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: colors.background.primary,
    paddingTop: 20,
  },
  searchContainer: {
    marginBottom: 18,
  },
  searchBarContainer: {
    backgroundColor: colors.background.white,
    borderRadius: 18,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  urgentBlock: {
    backgroundColor: colors.background.white,
    borderRadius: 13, // 13px radius as specified
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  urgentIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  urgentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  urgentSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  offersContainer: {
    flex: 1,
  },
  offersContent: {
    paddingBottom: 100, // Extra padding for bottom navigation
  },
  offerCard: {
    backgroundColor: colors.background.white,
    borderRadius: 13, // 13px radius as specified
    padding: 16,
    marginBottom: 18, // 18px vertical gap as specified
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4, // Y4px as specified
    },
    shadowOpacity: 0.2, // 20% opacity as specified
    shadowRadius: 12, // blur=12px as specified
    elevation: 4,
  },
  offerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  offerInfo: {
    flex: 1,
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  offerDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  offerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  offerPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.accent,
  },
  offerTime: {
    fontSize: 12,
    color: colors.text.muted,
    fontStyle: 'italic',
  },
});