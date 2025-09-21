import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import AnimatedButton from '../components/AnimatedButton';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreenEnhanced({ navigation }) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  useEffect(() => {
    // Clean entrance animations - NO ROTATING LOGO
    const startAnimations = () => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    };

    const timer = setTimeout(startAnimations, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      {/* Onboarding Background Image */}
      <Image 
        source={require('../../assets/onboardingscreen.png')} 
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />

      {/* Floating Elements */}
      <Animated.View style={[styles.floatingElement, styles.element1, { opacity: fadeAnim }]} />
      <Animated.View style={[styles.floatingElement, styles.element2, { opacity: fadeAnim }]} />
      <Animated.View style={[styles.floatingElement, styles.element3, { opacity: fadeAnim }]} />

      {/* Main Content */}
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim }
            ]
          }
        ]}
      >
        {/* Clean Logo - NO ROTATION */}
        <Animated.View 
          style={styles.logoContainer}
        >
          <View style={styles.logoCircle}>
            <Image source={require('../../assets/logo.png')} style={styles.logoImage} />
          </View>
        </Animated.View>

        {/* App Title with Animated Text */}
        <Animated.View style={styles.titleContainer}>
          <Text style={styles.title}>SANOVA</Text>
          <Text style={styles.subtitle}>Modern Beauty & Wellness</Text>
          <Text style={styles.tagline}>Din skønhed, vores passion</Text>
        </Animated.View>

        {/* Feature Highlights */}
        <Animated.View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Ionicons name="location" size={24} color={colors.accent} />
            <Text style={styles.featureText}>Find saloner i nærheden</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="calendar" size={24} color={colors.accent} />
            <Text style={styles.featureText}>Book hurtigt og nemt</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="star" size={24} color={colors.accent} />
            <Text style={styles.featureText}>Bedøm og anmeld</Text>
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View style={styles.buttonsContainer}>
          <AnimatedButton
            variant="primary"
            size="large"
            style={styles.primaryButton}
            onPress={() => {
              console.log('Login button pressed');
              navigation.navigate('Login');
            }}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="log-in" size={20} color={colors.text.white} />
              <Text style={styles.buttonText}>Log ind</Text>
            </View>
          </AnimatedButton>
          
          <AnimatedButton
            variant="outline"
            size="large"
            style={styles.secondaryButton}
            onPress={() => {
              console.log('SignUp button pressed');
              navigation.navigate('SignUp');
            }}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="person-add" size={20} color={colors.primary} />
              <Text style={[styles.buttonText, { color: colors.primary }]}>Opret konto</Text>
            </View>
          </AnimatedButton>
        </Animated.View>

        {/* Bottom Info */}
        <Animated.View style={styles.bottomInfo}>
          <Text style={styles.infoText}>
            Mere end 100+ saloner • 5000+ tilfredse kunder
          </Text>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 50,
  },
  floatingElement: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 50,
  },
  element1: {
    width: 80,
    height: 80,
    top: height * 0.1,
    left: width * 0.1,
  },
  element2: {
    width: 60,
    height: 60,
    top: height * 0.2,
    right: width * 0.15,
  },
  element3: {
    width: 100,
    height: 100,
    bottom: height * 0.15,
    left: width * 0.05,
  },
  logoContainer: {
    marginBottom: 20,
    marginTop: -20, // Move logo higher
  },
  logoCircle: {
    width: 80, // Smaller logo
    height: 80, // Smaller logo
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoImage: {
    width: 40,
    height: 40,
    tintColor: colors.text.white,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30, // Reduced spacing
  },
  title: {
    fontSize: 32, // Smaller title
    fontWeight: 'bold',
    color: colors.text.white,
    marginBottom: 6,
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: colors.text.light,
    marginBottom: 8,
    fontWeight: '300',
  },
  tagline: {
    fontSize: 14,
    color: colors.accent,
    fontStyle: 'italic',
    fontWeight: '300',
  },
  featuresContainer: {
    alignItems: 'center',
    marginBottom: 30, // Reduced spacing
    gap: 12, // Reduced gap
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    color: colors.text.white,
    fontWeight: '300',
  },
  buttonsContainer: {
    width: '100%',
    gap: 16,
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    shadowColor: colors.shadow.dark,
  },
  secondaryButton: {
    borderColor: colors.primary,
    backgroundColor: 'transparent',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.white,
  },
  bottomInfo: {
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    color: colors.text.light,
    textAlign: 'center',
    opacity: 0.8,
  },
});
