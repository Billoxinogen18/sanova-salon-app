# Sanova Salon App

A modern React Native application for beauty and wellness salon booking and management. The app provides separate interfaces for customers and salon owners, enabling seamless booking experiences and comprehensive business management.

## Features

### Customer App
- **Map View**: Discover nearby salons with location markers
- **Marketplace**: Browse services and beauty products
- **Urgent Bookings**: Find the soonest available appointments
- **Booking Management**: View and manage upcoming appointments
- **Complete Booking Flow**: 
  - Date and time selection
  - Payment method selection (Card, Apple Pay, MobilePay)
  - Payment model (Full payment or 50/50 split)
- **Service & Product Details**: Detailed information with reviews
- **Profile Management**: Account settings and preferences
- **Review System**: Rate and review completed services

### Salon Owner App
- **Dashboard**: Overview of bookings, revenue, and key metrics
- **Booking Management**: View and create new appointments
- **Service Management**: Add and manage salon services
- **Product Management**: Manage retail products with click & collect
- **Financial Dashboard**: 
  - Revenue tracking and analytics
  - Payment method breakdown
  - Tax calculations and reporting
  - Export options (PDF, Excel)
- **Business Insights**: Charts and trends

## Design System

The app uses a consistent design language with:
- **Primary Color**: Dark Green (#2D5A3D)
- **Secondary Color**: Light Beige (#F5F5DC)
- **Clean Typography**: Sans-serif fonts with clear hierarchy
- **Modern UI**: Card-based layouts with subtle shadows
- **Intuitive Navigation**: Bottom tab navigation for easy access

## Technology Stack

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **React Navigation**: Navigation library for screen transitions
- **Vector Icons**: Icon library for consistent iconography
- **Custom Components**: Reusable UI components

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (for testing)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sanova-salon-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your preferred platform:
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.js       # App header with logo and navigation
│   └── StatusBar.js    # Custom status bar component
├── screens/            # Screen components
│   ├── customer/       # Customer app screens
│   └── salon/          # Salon owner app screens
├── theme/              # Design system
│   ├── colors.js       # Color palette
│   └── styles.js       # Global styles and components
├── CustomerApp.js      # Customer app navigation
├── SalonOwnerApp.js    # Salon owner app navigation
└── WelcomeScreen.js    # App entry point
```

## Key Features Implementation

### Navigation
- Stack navigation for screen transitions
- Bottom tab navigation for main app sections
- Consistent header design across all screens

### State Management
- Local state management with React hooks
- Form handling for booking and service creation
- Mock data for demonstration purposes

### UI Components
- Custom header with logo and navigation
- Reusable card components
- Form inputs with consistent styling
- Button components with proper states

## Future Enhancements

- Backend integration with real APIs
- Push notifications for booking reminders
- Real-time chat between customers and salons
- Advanced analytics and reporting
- Multi-language support
- Offline functionality
- Payment gateway integration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact the development team or create an issue in the repository.
