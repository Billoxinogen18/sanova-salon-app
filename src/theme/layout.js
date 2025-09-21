import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions for design (iPhone 12/13/14)
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

// Responsive scaling functions
export const scale = (size) => {
  return (SCREEN_WIDTH / BASE_WIDTH) * size;
};

export const verticalScale = (size) => {
  return (SCREEN_HEIGHT / BASE_HEIGHT) * size;
};

export const moderateScale = (size, factor = 0.5) => {
  return size + (scale(size) - size) * factor;
};

// Font scaling
export const fontScale = (size) => {
  const newSize = scale(size);
  return Math.max(12, PixelRatio.roundToNearestPixel(newSize));
};

// Layout constants
export const layout = {
  // Screen dimensions
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,
  
  // Responsive breakpoints
  breakpoints: {
    small: 320,
    medium: 375,
    large: 414,
    xlarge: 768,
  },
  
  // Spacing system (responsive)
  spacing: {
    xs: moderateScale(4),
    sm: moderateScale(8),
    md: moderateScale(12),
    lg: moderateScale(16),
    xl: moderateScale(20),
    xxl: moderateScale(24),
    xxxl: moderateScale(32),
  },
  
  // Border radius (responsive)
  borderRadius: {
    xs: moderateScale(4),
    sm: moderateScale(8),
    md: moderateScale(12),
    lg: moderateScale(16),
    xl: moderateScale(20),
    xxl: moderateScale(24),
    xxxl: moderateScale(30),
  },
  
  // Component heights (responsive)
  heights: {
    button: {
      small: moderateScale(44),
      medium: moderateScale(50),
      large: moderateScale(51),
    },
    input: {
      small: moderateScale(38),
      medium: moderateScale(48),
      large: moderateScale(56),
    },
    card: {
      small: moderateScale(44),
      medium: moderateScale(52),
      large: moderateScale(74),
    },
    header: {
      small: moderateScale(72),
      medium: moderateScale(74),
      large: moderateScale(76),
    },
    navigation: moderateScale(63),
  },
  
  // Component widths (responsive)
  widths: {
    button: {
      small: moderateScale(82),
      medium: moderateScale(100),
      large: '94%',
    },
    card: {
      small: '92%',
      medium: '94%',
      large: '96%',
      full: '100%',
    },
    input: {
      small: '90%',
      medium: '95%',
      large: '100%',
    },
  },
  
  // Padding system (responsive)
  padding: {
    xs: moderateScale(4),
    sm: moderateScale(8),
    md: moderateScale(12),
    lg: moderateScale(16),
    xl: moderateScale(20),
    xxl: moderateScale(24),
    xxxl: moderateScale(32),
  },
  
  // Margin system (responsive)
  margin: {
    xs: moderateScale(4),
    sm: moderateScale(8),
    md: moderateScale(12),
    lg: moderateScale(16),
    xl: moderateScale(20),
    xxl: moderateScale(24),
    xxxl: moderateScale(32),
  },
};

// Responsive font sizes
export const responsiveFontSizes = {
  micro: fontScale(12),
  tiny: fontScale(13),
  smaller: fontScale(14),
  small: fontScale(15),
  regular: fontScale(16),
  medium: fontScale(17),
  large: fontScale(18),
  body: fontScale(19),
  subtitle: fontScale(20),
  title: fontScale(24),
  pageTitle: fontScale(24),
  cardTitle: fontScale(25),
  sectionTitle: fontScale(26),
  header: fontScale(28),
  logo: fontScale(28),
};

// Device type detection
export const deviceType = {
  isSmall: SCREEN_WIDTH < layout.breakpoints.medium,
  isMedium: SCREEN_WIDTH >= layout.breakpoints.medium && SCREEN_WIDTH < layout.breakpoints.large,
  isLarge: SCREEN_WIDTH >= layout.breakpoints.large,
  isTablet: SCREEN_WIDTH >= layout.breakpoints.xlarge,
};

// Responsive grid system
export const grid = {
  columns: deviceType.isTablet ? 3 : 2,
  gutter: layout.spacing.md,
  margin: layout.spacing.lg,
};

// Safe area helpers
export const safeArea = {
  top: 44, // Status bar height
  bottom: 34, // Home indicator height (iPhone X+)
  left: 0,
  right: 0,
};

// Layout helpers
export const layoutHelpers = {
  // Center content horizontally
  centerHorizontal: {
    alignSelf: 'center',
  },
  
  // Center content vertically
  centerVertical: {
    justifyContent: 'center',
  },
  
  // Center content both ways
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Full width
  fullWidth: {
    width: '100%',
  },
  
  // Full height
  fullHeight: {
    height: '100%',
  },
  
  // Flex row
  row: {
    flexDirection: 'row',
  },
  
  // Flex column
  column: {
    flexDirection: 'column',
  },
  
  // Space between
  spaceBetween: {
    justifyContent: 'space-between',
  },
  
  // Space around
  spaceAround: {
    justifyContent: 'space-around',
  },
  
  // Space evenly
  spaceEvenly: {
    justifyContent: 'space-evenly',
  },
  
  // Align items start
  alignStart: {
    alignItems: 'flex-start',
  },
  
  // Align items end
  alignEnd: {
    alignItems: 'flex-end',
  },
  
  // Align items center
  alignCenter: {
    alignItems: 'center',
  },
  
  // Justify content start
  justifyStart: {
    justifyContent: 'flex-start',
  },
  
  // Justify content end
  justifyEnd: {
    justifyContent: 'flex-end',
  },
  
  // Justify content center
  justifyCenter: {
    justifyContent: 'center',
  },
};

// Responsive shadow system
export const responsiveShadows = {
  light: {
    shadowColor: '#1C3521',
    shadowOffset: { width: 0, height: moderateScale(1) },
    shadowOpacity: 0.08,
    shadowRadius: moderateScale(6),
    elevation: 2,
  },
  
  medium: {
    shadowColor: '#1C3521',
    shadowOffset: { width: 0, height: moderateScale(2) },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(8),
    elevation: 3,
  },
  
  heavy: {
    shadowColor: '#1C3521',
    shadowOffset: { width: 0, height: moderateScale(4) },
    shadowOpacity: 0.15,
    shadowRadius: moderateScale(12),
    elevation: 5,
  },
};

export default {
  scale,
  verticalScale,
  moderateScale,
  fontScale,
  layout,
  responsiveFontSizes,
  deviceType,
  grid,
  safeArea,
  layoutHelpers,
  responsiveShadows,
};
