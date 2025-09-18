import { StyleSheet, Dimensions } from 'react-native';
import { colors } from './colors';

const { width, height } = Dimensions.get('window');

// Premium spacing system
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// Premium typography system
export const typography = {
  // Display text (for hero sections)
  display: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
    lineHeight: 38,
  },
  
  // Large titles
  title1: {
    fontSize: 28,
    fontWeight: '600',
    letterSpacing: -0.3,
    lineHeight: 34,
  },
  
  // Medium titles
  title2: {
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: -0.2,
    lineHeight: 30,
  },
  
  // Small titles
  title3: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 26,
  },
  
  // Headings
  heading: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 24,
  },
  
  // Body text
  body: {
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 22,
  },
  
  // Body text medium
  bodyMedium: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0,
    lineHeight: 22,
  },
  
  // Caption text
  caption: {
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0.1,
    lineHeight: 18,
  },
  
  // Caption medium
  captionMedium: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.1,
    lineHeight: 18,
  },
  
  // Small text
  small: {
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0.2,
    lineHeight: 16,
  },
  
  // Button text
  button: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
    lineHeight: 20,
  },
};

// Premium shadows
export const shadows = {
  // Subtle shadow for cards
  card: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  
  // Medium shadow for elevated elements
  elevated: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  
  // Strong shadow for floating elements
  floating: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  
  // Dramatic shadow for hero elements
  hero: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.2,
    shadowRadius: 32,
    elevation: 16,
  },
};

// Premium border radius system
export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  round: 1000,
};

// Premium gradients
export const gradients = {
  primary: [colors.primary, '#1a2b1e'],
  secondary: [colors.secondary, '#f0ede3'],
  accent: [colors.accent, '#c9a876'],
  dark: ['#000000', '#1a1a1a'],
  light: ['#ffffff', '#f8f9fa'],
  overlay: ['rgba(38, 52, 40, 0)', 'rgba(38, 52, 40, 0.7)'],
  shimmer: ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0)'],
};

// Premium component styles
export const premiumComponents = StyleSheet.create({
  // Enhanced containers
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  
  contentContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  
  // Premium cards
  premiumCard: {
    backgroundColor: colors.background.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.card,
  },
  
  elevatedCard: {
    backgroundColor: colors.background.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.elevated,
  },
  
  floatingCard: {
    backgroundColor: colors.background.white,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    ...shadows.floating,
  },
  
  // Premium buttons
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.elevated,
  },
  
  secondaryButton: {
    backgroundColor: colors.background.white,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    ...shadows.card,
  },
  
  ghostButton: {
    backgroundColor: 'transparent',
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  
  // Premium inputs
  premiumInput: {
    backgroundColor: colors.background.white,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    fontSize: 16,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border.primary,
    ...shadows.card,
  },
  
  focusedInput: {
    borderColor: colors.primary,
    borderWidth: 2,
    ...shadows.elevated,
  },
  
  // Premium headers
  heroHeader: {
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  
  elegantHeader: {
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
  
  // Premium separators
  elegantSeparator: {
    height: 1,
    backgroundColor: colors.border.light,
    marginVertical: spacing.lg,
    opacity: 0.6,
  },
  
  // Premium overlays
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(38, 52, 40, 0.8)',
  },
  
  // Premium loading states
  skeletonBox: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.sm,
  },
  
  // Premium layouts
  centerLayout: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  spaceBetweenLayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  // Premium list items
  premiumListItem: {
    backgroundColor: colors.background.white,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginVertical: spacing.xs,
    ...shadows.card,
  },
  
  // Premium badges
  premiumBadge: {
    backgroundColor: colors.accent,
    borderRadius: borderRadius.round,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    alignSelf: 'flex-start',
  },
  
  // Premium dividers
  premiumDivider: {
    height: 1,
    backgroundColor: colors.border.light,
    marginVertical: spacing.md,
    opacity: 0.3,
  },
});

// Premium animations styles
export const animatedStyles = {
  // Fade in styles
  fadeContainer: {
    opacity: 0,
  },
  
  // Slide up styles
  slideUpContainer: {
    transform: [{ translateY: 50 }],
    opacity: 0,
  },
  
  // Scale styles
  scaleContainer: {
    transform: [{ scale: 0.8 }],
    opacity: 0,
  },
  
  // Floating styles
  floatingElement: {
    transform: [{ translateY: 0 }],
  },
};

// Screen-specific premium styles
export const screenStyles = {
  // Auth screens
  authScreen: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  
  authContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  
  // Dashboard screens
  dashboardScreen: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  
  // Modal screens
  modalScreen: {
    backgroundColor: colors.background.white,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingTop: spacing.lg,
  },
};

export default {
  spacing,
  typography,
  shadows,
  borderRadius,
  gradients,
  premiumComponents,
  animatedStyles,
  screenStyles,
};
