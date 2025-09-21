import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder = "Search", 
  value, 
  onChangeText 
}) => {
  return (
    <View style={styles.container}>
      <Icon name="search" size={20} color="#000000" style={styles.searchIcon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#666A65"
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F6EC',
    height: 28,
    borderRadius: 18,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 18,
    shadowColor: '#1C3521',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#000000',
    paddingVertical: 0,
  },
});

export default SearchBar;