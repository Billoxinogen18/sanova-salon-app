import { Platform } from 'react-native';

// Font families with fallbacks
export const fonts = {
  // Primary font - Inter for most text
  primary: Platform.select({
    ios: 'Inter',
    android: 'Inter',
    default: 'Inter',
  }),
  
  // Serif font for SANOVA branding - Playfair Display
  serif: Platform.select({
    ios: 'Playfair Display',
    android: 'Playfair Display',
    default: 'Playfair Display',
  }),
  
  // Fallback fonts
  fallback: Platform.select({
    ios: 'SF Pro Display',
    android: 'Roboto',
    default: 'System',
  }),
};

// Font weights
export const fontWeights = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

// Font sizes with exact specifications from design documents
export const fontSizes = {
  // Headers and titles
  header: 28,        // SANOVA logo
  title: 32,         // Section headers like "Book"
  subtitle: 27,      // Payment title
  sectionTitle: 26,  // Payment Method title
  cardTitle: 25,     // My Account title
  pageTitle: 24,     // Available Times, Hvordan var din oplevelse
  
  // Body text
  large: 19,         // Service names, button text
  body: 18,          // Payment option labels, button text
  medium: 17,        // Service titles, navigation labels
  regular: 16,       // General body text, input placeholders
  small: 15,         // Addresses, descriptions
  smaller: 14,       // Distance text, day labels
  tiny: 13,          // Star rating labels, small text
  micro: 12,         // Navigation labels
};

// Line heights for proper text spacing
export const lineHeights = {
  header: 34,
  title: 38,
  subtitle: 32,
  sectionTitle: 31,
  cardTitle: 30,
  pageTitle: 29,
  large: 23,
  body: 22,
  medium: 21,
  regular: 20,
  small: 19,
  smaller: 18,
  tiny: 17,
  micro: 16,
};

// Letter spacing for specific elements
export const letterSpacing = {
  logo: 2,           // SANOVA logo letter spacing
  button: 1.2,       // Button text letter spacing
  normal: 0,         // Normal text
  tight: -0.5,       // Tight spacing for small text
};

// Typography styles for common elements
export const typography = {
  // SANOVA logo styling
  logo: {
    fontFamily: fonts.serif,
    fontSize: fontSizes.header,
    fontWeight: fontWeights.bold,
    letterSpacing: letterSpacing.logo,
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  
  // Page titles
  pageTitle: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.pageTitle,
    fontWeight: fontWeights.bold,
    color: '#232D1E',
    lineHeight: lineHeights.pageTitle,
  },
  
  // Section headers
  sectionHeader: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.sectionTitle,
    fontWeight: fontWeights.bold,
    color: '#232D1E',
    lineHeight: lineHeights.sectionTitle,
  },
  
  // Card titles
  cardTitle: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.cardTitle,
    fontWeight: fontWeights.bold,
    color: '#232D1E',
    lineHeight: lineHeights.cardTitle,
  },
  
  // Service names
  serviceName: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.large,
    fontWeight: fontWeights.bold,
    color: '#232D1E',
    lineHeight: lineHeights.large,
  },
  
  // Body text
  body: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.regular,
    fontWeight: fontWeights.regular,
    color: '#232D1E',
    lineHeight: lineHeights.regular,
  },
  
  // Secondary text
  secondary: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.small,
    fontWeight: fontWeights.regular,
    color: '#7B857B',
    lineHeight: lineHeights.small,
  },
  
  // Button text
  button: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.bold,
    letterSpacing: letterSpacing.button,
    color: '#FFFFFF',
    lineHeight: lineHeights.body,
  },
  
  // Input placeholder
  placeholder: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.regular,
    fontWeight: fontWeights.regular,
    color: '#7B857B',
    lineHeight: lineHeights.regular,
  },
  
  // Navigation labels
  navLabel: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.micro,
    fontWeight: fontWeights.regular,
    color: '#FFFFFF',
    lineHeight: lineHeights.micro,
  },
  
  // Star rating labels
  ratingLabel: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.tiny,
    fontWeight: fontWeights.regular,
    color: '#78857B',
    lineHeight: lineHeights.tiny,
  },
};

export default typography;
