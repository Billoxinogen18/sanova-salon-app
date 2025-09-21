# SANOVA - Beauty & Hair Services App

A pixel-perfect React Native mobile application for beauty and hair services, featuring a map-based interface with salon locations, marketplace, urgent services, and booking management.

## Features

- **Map Page**: Interactive map with custom gold markers showing salon locations
- **Marketplace**: 2-column grid of beauty products with search functionality
- **Urgent Services**: Emergency beauty services with centered content blocks
- **Bookings**: Manage upcoming and past appointments with detailed cards

## Design Specifications

The app follows exact pixel-perfect specifications with:
- **Color Palette**: Forest green (#1C3521), cream (#F8F6EC), gold (#C6AE78)
- **Typography**: Inter font family with specific weights and sizes
- **Components**: 13-18px border radius, subtle shadows, proper spacing
- **Navigation**: 62px height bottom tab bar with active state indicators

## Installation

1. Install dependencies:
```bash
npm install
```

2. For iOS:
```bash
cd ios && pod install && cd ..
npm run ios
```

3. For Android:
```bash
npm run android
```

## Project Structure

```
src/
├── components/
│   ├── Header.tsx           # App header with logo
│   ├── SearchBar.tsx        # Reusable search component
│   ├── ProductCard.tsx      # Horizontal product cards
│   ├── GridProductCard.tsx  # Grid product cards
│   ├── CustomMarker.tsx     # Map marker component
│   ├── UrgentCard.tsx       # Urgent service cards
│   └── BookingCard.tsx      # Booking management cards
├── pages/
│   ├── MapPage.tsx          # Map with salon locations
│   ├── MarketplacePage.tsx  # Product marketplace
│   ├── UrgentPage.tsx       # Emergency services
│   └── BookingsPage.tsx     # Booking management
└── App.tsx                  # Main app with navigation
```

## Key Components

### Map Page
- 60% screen height map with custom styling
- Gold circular markers (36px) with white scissor icons
- Filter button (44px) in top-right corner
- Horizontal scrolling beauty products below

### Marketplace Page
- 2-column product grid (92px cards)
- Consistent search bar and header
- Product cards with images, names, and prices

### Urgent Page
- Centered urgent icon (80px circle)
- Main urgent services card
- Vertical list of emergency services

### Bookings Page
- "Mine Bookinger" main title
- Upcoming and past booking sections
- Detailed booking cards with action buttons

## Styling Guidelines

- All cards use 13-18px border radius
- Shadows use #1C3521 color at 10-20% opacity
- Text uses Inter font family with specific weights
- Touch targets minimum 48x48px for accessibility
- Proper color contrast for WCAG AA compliance

## Dependencies

- React Native 0.72.6
- React Navigation 6.x
- React Native Maps
- React Native Vector Icons
- React Native SVG
- React Native Gesture Handler
- React Native Safe Area Context