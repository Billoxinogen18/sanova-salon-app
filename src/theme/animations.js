import { Animated, Easing } from 'react-native';

// Animation configuration presets
export const animationConfigs = {
  // Gentle spring for elegant interactions
  gentleSpring: {
    tension: 100,
    friction: 8,
    useNativeDriver: true,
  },
  
  // Bouncy spring for playful interactions
  bouncySpring: {
    tension: 120,
    friction: 6,
    useNativeDriver: true,
  },
  
  // Smooth timing for page transitions
  smoothTiming: {
    duration: 300,
    easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
    useNativeDriver: true,
  },
  
  // Fast timing for quick feedback
  quickTiming: {
    duration: 150,
    easing: Easing.bezier(0.4, 0, 0.2, 1),
    useNativeDriver: true,
  },
  
  // Slow timing for dramatic effects
  dramaticTiming: {
    duration: 600,
    easing: Easing.bezier(0.19, 1, 0.22, 1),
    useNativeDriver: true,
  },
};

// Predefined animation sequences
export const animationSequences = {
  // Fade in from bottom with scale
  fadeInUp: (animatedValue, delay = 0) => {
    return Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(animatedValue.opacity, {
          toValue: 1,
          ...animationConfigs.smoothTiming,
        }),
        Animated.timing(animatedValue.translateY, {
          toValue: 0,
          ...animationConfigs.smoothTiming,
        }),
        Animated.timing(animatedValue.scale, {
          toValue: 1,
          ...animationConfigs.smoothTiming,
        }),
      ]),
    ]);
  },
  
  // Stagger animation for multiple elements
  staggerFadeIn: (animatedValues, staggerDelay = 100) => {
    return Animated.stagger(
      staggerDelay,
      animatedValues.map(value =>
        Animated.parallel([
          Animated.timing(value.opacity, {
            toValue: 1,
            ...animationConfigs.smoothTiming,
          }),
          Animated.timing(value.translateY, {
            toValue: 0,
            ...animationConfigs.smoothTiming,
          }),
        ])
      )
    );
  },
  
  // Button press animation
  buttonPress: (scaleValue) => {
    return Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]);
  },
  
  // Floating animation for elements
  floating: (translateY) => {
    return Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -10,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
  },
  
  // Shimmer loading effect
  shimmer: (animatedValue) => {
    return Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    );
  },
};

// Animation hooks and utilities
export class AnimationController {
  constructor() {
    this.animations = new Map();
  }
  
  // Create animated value set for common animations
  createAnimatedValueSet(initialValues = {}) {
    return {
      opacity: new Animated.Value(initialValues.opacity || 0),
      translateY: new Animated.Value(initialValues.translateY || 50),
      translateX: new Animated.Value(initialValues.translateX || 0),
      scale: new Animated.Value(initialValues.scale || 0.8),
      rotate: new Animated.Value(initialValues.rotate || 0),
    };
  }
  
  // Register animation for cleanup
  registerAnimation(key, animation) {
    this.animations.set(key, animation);
    return animation;
  }
  
  // Stop specific animation
  stopAnimation(key) {
    const animation = this.animations.get(key);
    if (animation) {
      animation.stop();
      this.animations.delete(key);
    }
  }
  
  // Stop all animations
  stopAllAnimations() {
    this.animations.forEach((animation) => animation.stop());
    this.animations.clear();
  }
}

// Page transition animations
export const pageTransitions = {
  slideFromRight: {
    cardStyleInterpolator: ({ current, next, layouts }) => {
      return {
        cardStyle: {
          transform: [
            {
              translateX: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [layouts.screen.width, 0],
              }),
            },
          ],
        },
        overlayStyle: {
          opacity: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 0.5],
          }),
        },
      };
    },
  },
  
  fadeScale: {
    cardStyleInterpolator: ({ current, next, layouts }) => {
      return {
        cardStyle: {
          opacity: current.progress,
          transform: [
            {
              scale: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0.85, 1],
              }),
            },
          ],
        },
      };
    },
  },
  
  modalSlideUp: {
    cardStyleInterpolator: ({ current, layouts }) => {
      return {
        cardStyle: {
          transform: [
            {
              translateY: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [layouts.screen.height, 0],
              }),
            },
          ],
        },
      };
    },
  },
};

// Micro-interaction animations
export const microAnimations = {
  // Input focus animation
  inputFocus: (borderColor, scale) => {
    return Animated.parallel([
      Animated.timing(borderColor, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.spring(scale, {
        toValue: 1.02,
        ...animationConfigs.gentleSpring,
      }),
    ]);
  },
  
  // Input blur animation
  inputBlur: (borderColor, scale) => {
    return Animated.parallel([
      Animated.timing(borderColor, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.spring(scale, {
        toValue: 1,
        ...animationConfigs.gentleSpring,
      }),
    ]);
  },
  
  // Ripple effect
  ripple: (scale, opacity) => {
    return Animated.parallel([
      Animated.timing(scale, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]);
  },
};

export default {
  animationConfigs,
  animationSequences,
  AnimationController,
  pageTransitions,
  microAnimations,
};
