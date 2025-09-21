import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface UrgentCardProps {
  title: string;
  description: string;
  isMain?: boolean;
}

const UrgentCard: React.FC<UrgentCardProps> = ({
  title,
  description,
  isMain = false,
}) => {
  return (
    <View style={[styles.container, isMain && styles.mainCard]}>
      <Text style={[styles.title, isMain && styles.mainTitle]}>
        {title}
      </Text>
      <Text style={[styles.description, isMain && styles.mainDescription]}>
        {description}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '92%',
    height: 84,
    backgroundColor: '#FFFFFF',
    borderRadius: 13,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#1C3521',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  mainCard: {
    backgroundColor: '#F8F6EC',
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#232D1E',
    fontFamily: 'Inter',
    marginBottom: 4,
  },
  mainTitle: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#667A6E',
    fontFamily: 'Inter',
    lineHeight: 18,
  },
  mainDescription: {
    fontSize: 16,
    textAlign: 'center',
    color: '#1C3521',
  },
});

export default UrgentCard;