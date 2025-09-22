
import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ImageBackground, 
  SafeAreaView,
  ScrollView,
  Dimensions,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
  const features = [
    { 
      icon: 'location-outline', 
      text: 'Discover salons nearby' 
    },
    { 
      icon: 'flash-outline', 
      text: 'Fast easy booking' 
    },
    { 
      icon: 'star-outline', 
      text: 'Reliable ratings' 
    }
  ];

  return (
    <ImageBackground 
      source={require('../../assets/onboarding.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      {/* Semi-transparent overlay as specified */}
      <View style={styles.overlay} />
      
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Logo Section - Exact positioning */}
          <View style={styles.headerLogo}>
            {/* Logo - 52dp x 33dp */}
            <Image 
              source={require('../../assets/logo.png')}
              style={styles.logoIcon}
              resizeMode="contain"
            />
            {/* SANOVA Text - Playfair Display Bold, 22sp */}
            <Text style={styles.sanovaText}>SANOVA</Text>
          </View>

          {/* Title Text Section - 42dp below header */}
          <View style={styles.titleContainer}>
            <Text style={styles.titleLine1}>Welcome to</Text>
            <Text style={styles.titleLine2}>SANOVA</Text>
          </View>

          {/* Features List - 54dp below title */}
          <View style={styles.featuresContainer}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureRow}>
                {/* Circular glass icon container */}
                <View style={styles.iconContainer}>
                  <Ionicons 
                    name={feature.icon} 
                    size={21} 
                    color="#FFFFFF" 
                  />
                </View>
                {/* Feature label */}
                <Text style={styles.featureText}>{feature.text}</Text>
              </View>
            ))}
          </View>

          {/* Action Buttons - Near bottom */}
          <View style={styles.actionButtons}>
            {/* Sign In Button */}
            <TouchableOpacity 
              style={styles.signInButton}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.signInButtonText}>Sign In</Text>
            </TouchableOpacity>

            {/* Create Account Button */}
            <TouchableOpacity 
              style={styles.createAccountButton}
              onPress={() => navigation.navigate('SignUp')}
            >
              <Text style={styles.createAccountButtonText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(22, 22, 22, 0.17)', // Exact overlay color
  },
  safeArea: {
    flex: 1,
    paddingTop: 44, // Status bar padding
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24, // Global padding
  },
  
  // Header Logo Section
  headerLogo: {
    alignItems: 'center',
    marginTop: 40, // 40dp from status bar
  },
  logoIcon: {
    width: 52,
    height: 33,
  },
  sanovaText: {
    fontFamily: 'System', // Playfair Display equivalent
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 8, // 8dp below leaf icon
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  // Title Text Section
  titleContainer: {
    alignItems: 'center',
    marginTop: 42, // 42dp below header logo
  },
  titleLine1: {
    fontFamily: 'System',
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 36,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  titleLine2: {
    fontFamily: 'System',
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 36,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  // Features List Section
  featuresContainer: {
    alignItems: 'center',
    marginTop: 54, // 54dp below title
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18, // 18dp vertical spacing
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(34, 31, 31, 0.28)', // Glass effect background
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)', // Frosted outline
  },
  featureText: {
    fontFamily: 'System',
    fontSize: 18,
    fontWeight: '500', // Medium weight
    color: '#FFFFFF',
    marginLeft: 12, // 12dp spacing
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  // Action Buttons Section
  actionButtons: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 64, // 64dp from bottom
    gap: 22, // 22dp vertical gap
  },
  signInButton: {
    width: '84%',
    maxWidth: 352, // Max 352dp
    height: 53,
    borderRadius: 26.5, // Pill shape
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  signInButtonText: {
    fontFamily: 'System',
    fontSize: 19,
    fontWeight: '600', // SemiBold
    color: '#212121',
    textAlign: 'center',
  },
  createAccountButton: {
    width: '84%',
    maxWidth: 352,
    height: 53,
    borderRadius: 26.5,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  createAccountButtonText: {
    fontFamily: 'System',
    fontSize: 19,
    fontWeight: '600',
    color: '#212121',
    textAlign: 'center',
  },
});
