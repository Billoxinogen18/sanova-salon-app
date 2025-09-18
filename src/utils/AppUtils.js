import { Alert, Linking, Platform } from 'react-native';
import { colors } from '../theme/colors';

export const AppUtils = {
  // Format Danish currency
  formatPrice: (price) => {
    if (typeof price === 'string' && price.includes('kr')) {
      return price;
    }
    return `${price} kr`;
  },

  // Format Danish dates
  formatDate: (date) => {
    const today = new Date();
    const targetDate = new Date(date);
    
    if (targetDate.toDateString() === today.toDateString()) {
      return 'I dag';
    }
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (targetDate.toDateString() === tomorrow.toDateString()) {
      return 'I morgen';
    }
    
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return targetDate.toLocaleDateString('da-DK', options);
  },

  // Format time for Danish locale
  formatTime: (time) => {
    if (typeof time === 'string') return time;
    const options = { hour: '2-digit', minute: '2-digit' };
    return time.toLocaleTimeString('da-DK', options);
  },

  // Show success toast
  showSuccess: (message) => {
    Alert.alert('Succes', message, [{ text: 'OK', style: 'default' }]);
  },

  // Show error toast
  showError: (message) => {
    Alert.alert('Fejl', message, [{ text: 'OK', style: 'destructive' }]);
  },

  // Show confirmation dialog
  showConfirm: (title, message, onConfirm, onCancel) => {
    Alert.alert(
      title,
      message,
      [
        { text: 'Annuller', onPress: onCancel, style: 'cancel' },
        { text: 'Bekræft', onPress: onConfirm, style: 'default' },
      ]
    );
  },

  // Open external links
  openURL: async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        AppUtils.showError('Kan ikke åbne link');
      }
    } catch (error) {
      AppUtils.showError('Fejl ved åbning af link');
    }
  },

  // Make phone call
  makePhoneCall: (phoneNumber) => {
    const url = `tel:${phoneNumber}`;
    AppUtils.openURL(url);
  },

  // Open maps for directions
  openMaps: (address) => {
    const encodedAddress = encodeURIComponent(address);
    const url = Platform.select({
      ios: `maps://app?daddr=${encodedAddress}`,
      android: `geo:0,0?q=${encodedAddress}`,
    });
    AppUtils.openURL(url);
  },

  // Generate unique ID
  generateId: () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  // Validate email
  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate phone number (Danish format)
  validatePhone: (phone) => {
    const phoneRegex = /^(\+45\s?)?(\d{2}\s?\d{2}\s?\d{2}\s?\d{2})$/;
    return phoneRegex.test(phone);
  },

  // Calculate distance between two points (simple approximation)
  calculateDistance: (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    if (distance < 1) {
      return `${Math.round(distance * 1000)} m`;
    }
    return `${distance.toFixed(1)} km`;
  },

  // Debounce function for search
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Get greeting based on time of day
  getGreeting: () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'God morgen';
    if (hour < 17) return 'God dag';
    return 'God aften';
  },

  // Generate random salon data for demo
  generateMockSalons: (count = 10) => {
    const salonNames = [
      'Gustav Salon', 'Beauty Studio', 'Trendy Salon', 'Wellness Center',
      'Hair & Nails', 'Spa Oase', 'Style Studio', 'Elegance Salon',
      'Modern Beauty', 'Luxury Spa'
    ];
    
    const addresses = [
      'Frederiks Alle 28', 'Vesterbrogade 45', 'Nørrebrogade 12',
      'Østerbrogade 78', 'Strøget 15', 'Købmagergade 32',
      'Amagertorv 9', 'Kongens Nytorv 4', 'Rådhuspladsen 1'
    ];

    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: salonNames[i % salonNames.length],
      address: addresses[i % addresses.length] + ', København',
      rating: (4.0 + Math.random() * 1.0).toFixed(1),
      distance: AppUtils.calculateDistance(55.6761, 12.5683, 55.6761 + (Math.random() - 0.5) * 0.1, 12.5683 + (Math.random() - 0.5) * 0.1),
      services: ['Haircut', 'Coloring', 'Manicure', 'Pedicure'].slice(0, Math.floor(Math.random() * 3) + 2),
      image: ['🏪', '💇‍♀️', '💅', '✨'][Math.floor(Math.random() * 4)],
    }));
  },
};
