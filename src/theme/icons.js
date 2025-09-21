// Icon system for SANOVA app
// All icons are vector-based and use Ionicons for consistency

export const iconSizes = {
  // Navigation icons
  nav: 24,
  navActive: 30,
  
  // UI icons
  small: 14,
  medium: 16,
  large: 20,
  xlarge: 24,
  xxlarge: 32,
  
  // Special sizes
  logo: 24,
  star: 32,
  starSmall: 14,
  camera: 25,
  chevron: 16,
  chevronSmall: 17,
};

export const iconColors = {
  // Primary colors
  white: '#FFFFFF',
  black: '#232D1E',
  green: '#1C3521',
  gold: '#CFAC4A',
  
  // Secondary colors
  gray: '#7B857B',
  lightGray: '#A0AEA8',
  mutedGreen: '#4A6148',
  lightGreen: '#294C3B',
  
  // State colors
  success: '#3D7645',
  warning: '#FF9800',
  error: '#F44336',
};

// Icon definitions with exact specifications
export const icons = {
  // Navigation icons
  navigation: {
    map: 'map',
    mapOutline: 'map-outline',
    marketplace: 'storefront',
    marketplaceOutline: 'storefront-outline',
    urgent: 'flash',
    urgentOutline: 'flash-outline',
    bookings: 'calendar',
    bookingsOutline: 'calendar-outline',
    profile: 'person',
    profileOutline: 'person-outline',
  },
  
  // UI icons
  ui: {
    search: 'search',
    location: 'location',
    call: 'call',
    chevronForward: 'chevron-forward',
    chevronBack: 'chevron-back',
    close: 'close',
    checkmark: 'checkmark',
    star: 'star',
    starOutline: 'star-outline',
    heart: 'heart',
    heartOutline: 'heart-outline',
    camera: 'camera',
    eye: 'eye',
    eyeOff: 'eye-off',
    time: 'time',
    create: 'create',
    notifications: 'notifications',
    help: 'help-circle',
    leaf: 'leaf',
  },
  
  // Payment icons
  payment: {
    card: 'card',
    apple: 'logo-apple',
    mobile: 'phone-portrait',
  },
  
  // Service icons
  services: {
    scissors: 'cut',
    hair: 'person',
    nail: 'hand-left',
    spa: 'flower',
  },
};

// Icon component configurations
export const iconConfigs = {
  // Search icon - 20px, black
  search: {
    name: icons.ui.search,
    size: iconSizes.large,
    color: iconColors.black,
  },
  
  // Location pin - 14px, light gray
  location: {
    name: icons.ui.location,
    size: iconSizes.small,
    color: iconColors.lightGray,
  },
  
  // Call icon - 16px, black
  call: {
    name: icons.ui.call,
    size: iconSizes.medium,
    color: iconColors.black,
  },
  
  // Star rating - 32px, gold
  star: {
    name: icons.ui.star,
    size: iconSizes.star,
    color: iconColors.gold,
  },
  
  // Star rating small - 14px, gold
  starSmall: {
    name: icons.ui.star,
    size: iconSizes.starSmall,
    color: iconColors.gold,
  },
  
  // Camera icon - 25px, medium green
  camera: {
    name: icons.ui.camera,
    size: iconSizes.camera,
    color: iconColors.lightGreen,
  },
  
  // Chevron forward - 16px, black
  chevronForward: {
    name: icons.ui.chevronForward,
    size: iconSizes.chevron,
    color: iconColors.black,
  },
  
  // Chevron small - 17px, black
  chevronSmall: {
    name: icons.ui.chevronForward,
    size: iconSizes.chevronSmall,
    color: iconColors.black,
  },
  
  // Checkmark - 16px, white
  checkmark: {
    name: icons.ui.checkmark,
    size: iconSizes.medium,
    color: iconColors.white,
  },
  
  // Leaf logo - 24px, white
  leaf: {
    name: icons.ui.leaf,
    size: iconSizes.logo,
    color: iconColors.white,
  },
  
  // Navigation icons
  navMap: {
    name: icons.navigation.map,
    size: iconSizes.nav,
    color: iconColors.white,
  },
  
  navMapActive: {
    name: icons.navigation.map,
    size: iconSizes.navActive,
    color: iconColors.white,
  },
  
  navMarketplace: {
    name: icons.navigation.marketplace,
    size: iconSizes.nav,
    color: iconColors.white,
  },
  
  navUrgent: {
    name: icons.navigation.urgent,
    size: iconSizes.nav,
    color: iconColors.white,
  },
  
  navBookings: {
    name: icons.navigation.bookings,
    size: iconSizes.nav,
    color: iconColors.white,
  },
  
  // Profile icons
  profileTime: {
    name: icons.ui.time,
    size: iconSizes.xlarge,
    color: iconColors.black,
  },
  
  profileEdit: {
    name: icons.ui.create,
    size: iconSizes.xlarge,
    color: iconColors.black,
  },
  
  profileNotifications: {
    name: icons.ui.notifications,
    size: iconSizes.xlarge,
    color: iconColors.black,
  },
  
  profileFavorites: {
    name: icons.ui.heart,
    size: iconSizes.xlarge,
    color: iconColors.black,
  },
  
  profileSupport: {
    name: icons.ui.help,
    size: iconSizes.xlarge,
    color: iconColors.black,
  },
};

// Helper function to get icon configuration
export const getIconConfig = (iconKey) => {
  return iconConfigs[iconKey] || iconConfigs.search;
};

// Helper function to get icon with custom color
export const getIconWithColor = (iconKey, color) => {
  const config = getIconConfig(iconKey);
  return {
    ...config,
    color: color || config.color,
  };
};

// Helper function to get icon with custom size
export const getIconWithSize = (iconKey, size) => {
  const config = getIconConfig(iconKey);
  return {
    ...config,
    size: size || config.size,
  };
};

export default {
  iconSizes,
  iconColors,
  icons,
  iconConfigs,
  getIconConfig,
  getIconWithColor,
  getIconWithSize,
};
