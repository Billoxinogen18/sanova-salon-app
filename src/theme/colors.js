export const colors = {
  // PRODUCTION colors - NO YELLOWS, only greens and creamy tints
  primary: '#263428',      // Deep Green - headers and primary buttons
  secondary: '#F8F6ED',    // Soft Beige - main background
  accent: '#4A6741',       // Muted Green - accents and highlights (NO YELLOW)
  white: '#FFFFFF',        // Pure white - cards and clean backgrounds
  black: '#000000',        // Pure black - for shadows
  gray: '#9BA39B',         // Medium gray - secondary text
  lightGray: '#E5E5E5',    // Light gray - borders and dividers
  success: '#4CAF50',      // Green for success states
  warning: '#FF9800',      // Orange for warnings
  error: '#F44336',        // Red for errors
  cream: '#F5F1E8',        // Cream tint for subtle highlights

  // Text colors with perfect contrast ratios
  text: {
    primary: '#263428',    // Deep green for main text
    secondary: '#9BA39B',  // Gray for secondary text (from design specs)
    light: '#F8F6ED',      // Soft beige for text on dark backgrounds
    white: '#FFFFFF',      // White text for dark backgrounds
    muted: '#9BA39B',      // Muted gray for less important text
  },

  // Background colors matching design exactly
  background: {
    primary: '#F8F6ED',    // Main app background - soft beige
    secondary: '#263428',  // Header background - deep green
    white: '#FFFFFF',      // Card backgrounds - pure white
    card: '#F8F6ED',       // Soft beige for grid items/list items
    overlay: 'rgba(38, 52, 40, 0.08)', // Subtle green overlay (from design specs)
  },

  // Border colors for clean separation
  border: {
    primary: '#E5E5E5',    // Light borders
    secondary: '#263428',  // Deep green borders for emphasis
    accent: '#4A6741',     // Muted green borders for subtle separation
  },

  // Shadow colors for depth
  shadow: {
    light: 'rgba(38, 52, 40, 0.08)', // From design specs
    medium: 'rgba(0, 0, 0, 0.15)',
    dark: 'rgba(0, 0, 0, 0.25)',
  }
};
