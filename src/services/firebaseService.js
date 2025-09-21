import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithCredential
} from 'firebase/auth';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit,
  onSnapshot 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { auth, db, storage } from '../../firebaseconfig';

// Configure WebBrowser for Google Sign-In
WebBrowser.maybeCompleteAuthSession();

// Authentication Services
export const authService = {
  // Sign in with email and password
  signIn: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Store login state
      await AsyncStorage.setItem('userLoggedIn', 'true');
      await AsyncStorage.setItem('userEmail', email);
      await AsyncStorage.setItem('userUid', userCredential.user.uid);
      
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Create new user account
  signUp: async (email, password, userData) => {
    try {
      console.log('🚀 Starting sign up process...');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('✅ User created successfully:', user.uid);
      
      // Update user profile
      try {
        await updateProfile(user, {
          displayName: userData.name || userData.displayName
        });
        console.log('✅ Profile updated successfully');
      } catch (profileError) {
        console.warn('⚠️ Profile update failed:', profileError.message);
        // Continue anyway, this is not critical
      }

      // Store login state for new user
      await AsyncStorage.setItem('userLoggedIn', 'true');
      await AsyncStorage.setItem('userEmail', email);
      await AsyncStorage.setItem('userUid', user.uid);

      // Save additional user data to Firestore with retry logic
      let firestoreSuccess = false;
      let retryCount = 0;
      const maxRetries = 3;
      
      while (!firestoreSuccess && retryCount < maxRetries) {
        try {
          console.log(`📝 Attempting to save user data to Firestore (attempt ${retryCount + 1}/${maxRetries})...`);
          await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            email: user.email,
            name: userData.name || userData.displayName,
            phone: userData.phone || '',
            role: userData.role || 'customer',
            createdAt: new Date(),
            updatedAt: new Date()
          });
          console.log('✅ Firestore data saved successfully');
          firestoreSuccess = true;
        } catch (firestoreError) {
          retryCount++;
          console.warn(`⚠️ Firestore save attempt ${retryCount} failed:`, firestoreError.message);
          if (retryCount < maxRetries) {
            console.log(`🔄 Retrying in 2 seconds... (${retryCount}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, 2000));
          } else {
            console.warn('⚠️ Firestore save failed after all retries, but user was created successfully');
            // User is still created, just Firestore data failed
          }
        }
      }

      return { success: true, user };
    } catch (error) {
      console.error('❌ Sign up failed:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Sign out current user
  signOut: async () => {
    try {
      await signOut(auth);
      
      // Clear stored login state
      await AsyncStorage.removeItem('userLoggedIn');
      await AsyncStorage.removeItem('userEmail');
      await AsyncStorage.removeItem('userUid');
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get current user
  getCurrentUser: () => {
    return auth.currentUser;
  },

  // Listen to auth state changes
  onAuthStateChanged: (callback) => {
    return onAuthStateChanged(auth, callback);
  },

  // Check if user is logged in from storage
  checkLoginState: async () => {
    try {
      const isLoggedIn = await AsyncStorage.getItem('userLoggedIn');
      const userEmail = await AsyncStorage.getItem('userEmail');
      const userUid = await AsyncStorage.getItem('userUid');
      
      return {
        isLoggedIn: isLoggedIn === 'true',
        email: userEmail,
        uid: userUid
      };
    } catch (error) {
      return { isLoggedIn: false, email: null, uid: null };
    }
  },

  // Google Sign-In - Optimized for better native experience
  signInWithGoogle: async () => {
    try {
      console.log('🚀 Starting Google Sign-In...');
      
      // Configure the request for better native experience
      const request = new AuthSession.AuthRequest({
        clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
        scopes: ['openid', 'profile', 'email'],
        additionalParameters: {
          prompt: 'select_account', // Shows account picker
          access_type: 'offline',
        },
        redirectUri: AuthSession.makeRedirectUri({
          scheme: 'com.sanova.salonapp',
          useProxy: true,
        }),
      });

      console.log('📱 Prompting Google Sign-In...');
      const result = await request.promptAsync({
        authorizationEndpoint: 'https://accounts.google.com/oauth/authorize',
        showInRecents: true,
        preferEphemeralSession: false, // This allows account selection
      });

      if (result.type === 'success') {
        console.log('✅ Google authorization successful, exchanging tokens...');
        
        // Exchange the authorization code for an access token
        const tokenResult = await AuthSession.exchangeCodeAsync(
          {
            clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
            code: result.params.code,
            extraParams: {
              code_verifier: request.codeVerifier,
            },
            redirectUri: AuthSession.makeRedirectUri({
              scheme: 'com.sanova.salonapp',
              useProxy: true,
            }),
          },
          {
            tokenEndpoint: 'https://oauth2.googleapis.com/token',
          }
        );

        console.log('✅ Tokens exchanged, creating Firebase credential...');
        
        // Create a Google credential
        const credential = GoogleAuthProvider.credential(
          tokenResult.idToken,
          tokenResult.accessToken
        );

        // Sign in with Firebase
        const userCredential = await signInWithCredential(auth, credential);
        const user = userCredential.user;
        
        console.log('✅ Firebase sign-in successful:', user.uid);

        // Store login state for Google sign-in
        await AsyncStorage.setItem('userLoggedIn', 'true');
        await AsyncStorage.setItem('userEmail', user.email);
        await AsyncStorage.setItem('userUid', user.uid);

        // Check if user exists in Firestore, create if not
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (!userDoc.exists()) {
            console.log('📝 Creating new user document in Firestore...');
            await setDoc(doc(db, 'users', user.uid), {
              uid: user.uid,
              email: user.email,
              name: user.displayName,
              photoURL: user.photoURL,
              role: 'customer', // Default role
              provider: 'google',
              createdAt: new Date(),
              updatedAt: new Date()
            });
            console.log('✅ User document created successfully');
          } else {
            console.log('✅ User document already exists');
          }
        } catch (firestoreError) {
          console.warn('⚠️ Firestore error during Google sign-in:', firestoreError);
          // Continue anyway, user is still signed in
        }

        return { success: true, user };
      } else if (result.type === 'cancel') {
        console.log('❌ Google Sign-In was cancelled by user');
        return { success: false, error: 'Sign-in was cancelled' };
      } else {
        console.log('❌ Google Sign-In failed:', result);
        return { success: false, error: 'Google Sign-In failed' };
      }
    } catch (error) {
      console.error('❌ Google Sign-In error:', error);
      return { success: false, error: error.message };
    }
  }
};

// Firestore Services
export const firestoreService = {
  // User operations
  users: {
    create: async (userId, userData) => {
      try {
        // Enhanced retry logic with exponential backoff for Firestore connection issues
        let retries = 5;
        let delay = 1000;
        
        while (retries > 0) {
          try {
            await setDoc(doc(db, 'users', userId), {
              ...userData,
              createdAt: new Date(),
              updatedAt: new Date()
            });
            console.log('✅ User created successfully in Firestore');
            return { success: true };
          } catch (retryError) {
            retries--;
            if (retries === 0) {
              console.error('❌ All retries failed for user creation:', retryError);
              throw retryError;
            }
            
            console.log(`🔄 Firestore retry ${5 - retries}/5 for user creation (${retryError.message})`);
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2; // Exponential backoff
          }
        }
      } catch (error) {
        console.error('Firestore user creation error:', error);
        return { success: false, error: error.message };
      }
    },

    get: async (userId) => {
      try {
        // Enhanced retry logic with exponential backoff for Firestore connection issues
        let retries = 5;
        let delay = 1000;
        
        while (retries > 0) {
          try {
            const docRef = doc(db, 'users', userId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              console.log('✅ User retrieved successfully from Firestore');
              return { success: true, data: docSnap.data() };
            } else {
              console.log('⚠️ User not found in Firestore');
              return { success: false, error: 'User not found' };
            }
          } catch (retryError) {
            retries--;
            if (retries === 0) {
              console.error('❌ All retries failed for user retrieval:', retryError);
              throw retryError;
            }
            
            console.log(`🔄 Firestore retry ${5 - retries}/5 for user get (${retryError.message})`);
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2; // Exponential backoff
          }
        }
      } catch (error) {
        console.error('Firestore user get error:', error);
        return { success: false, error: error.message };
      }
    },

    update: async (userId, userData) => {
      try {
        const docRef = doc(db, 'users', userId);
        await updateDoc(docRef, {
          ...userData,
          updatedAt: new Date()
        });
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    }
  },

  // Salon operations
  salons: {
    create: async (salonData) => {
      try {
        const docRef = await addDoc(collection(db, 'salons'), {
          ...salonData,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        return { success: true, id: docRef.id };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    getAll: async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'salons'));
        const salons = [];
        querySnapshot.forEach((doc) => {
          salons.push({ id: doc.id, ...doc.data() });
        });
        return { success: true, data: salons };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    getById: async (salonId) => {
      try {
        const docRef = doc(db, 'salons', salonId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
        } else {
          return { success: false, error: 'Salon not found' };
        }
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    update: async (salonId, salonData) => {
      try {
        const docRef = doc(db, 'salons', salonId);
        await updateDoc(docRef, {
          ...salonData,
          updatedAt: new Date()
        });
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    }
  },

  // Booking operations
  bookings: {
    create: async (bookingData) => {
      try {
        const docRef = await addDoc(collection(db, 'bookings'), {
          ...bookingData,
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date()
        });
        return { success: true, id: docRef.id };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    getByUser: async (userId) => {
      try {
        const q = query(
          collection(db, 'bookings'),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const bookings = [];
        querySnapshot.forEach((doc) => {
          bookings.push({ id: doc.id, ...doc.data() });
        });
        return { success: true, data: bookings };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    getBySalon: async (salonId) => {
      try {
        const q = query(
          collection(db, 'bookings'),
          where('salonId', '==', salonId),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const bookings = [];
        querySnapshot.forEach((doc) => {
          bookings.push({ id: doc.id, ...doc.data() });
        });
        return { success: true, data: bookings };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    update: async (bookingId, bookingData) => {
      try {
        const docRef = doc(db, 'bookings', bookingId);
        await updateDoc(docRef, {
          ...bookingData,
          updatedAt: new Date()
        });
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    cancel: async (bookingId) => {
      try {
        const docRef = doc(db, 'bookings', bookingId);
        await updateDoc(docRef, {
          status: 'cancelled',
          updatedAt: new Date()
        });
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    }
  },

  // Review operations
  reviews: {
    create: async (reviewData) => {
      try {
        const docRef = await addDoc(collection(db, 'reviews'), {
          ...reviewData,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        return { success: true, id: docRef.id };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    getBySalon: async (salonId) => {
      try {
        const q = query(
          collection(db, 'reviews'),
          where('salonId', '==', salonId),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const reviews = [];
        querySnapshot.forEach((doc) => {
          reviews.push({ id: doc.id, ...doc.data() });
        });
        return { success: true, data: reviews };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    getByUser: async (userId) => {
      try {
        const q = query(
          collection(db, 'reviews'),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const reviews = [];
        querySnapshot.forEach((doc) => {
          reviews.push({ id: doc.id, ...doc.data() });
        });
        return { success: true, data: reviews };
      } catch (error) {
        return { success: false, error: error.message };
      }
    }
  },

  // Real-time listeners
  realtime: {
    listenToBookings: (salonId, callback) => {
      const q = query(
        collection(db, 'bookings'),
        where('salonId', '==', salonId),
        orderBy('createdAt', 'desc')
      );
      return onSnapshot(q, (querySnapshot) => {
        const bookings = [];
        querySnapshot.forEach((doc) => {
          bookings.push({ id: doc.id, ...doc.data() });
        });
        callback(bookings);
      });
    },

    listenToReviews: (salonId, callback) => {
      const q = query(
        collection(db, 'reviews'),
        where('salonId', '==', salonId),
        orderBy('createdAt', 'desc')
      );
      return onSnapshot(q, (querySnapshot) => {
        const reviews = [];
        querySnapshot.forEach((doc) => {
          reviews.push({ id: doc.id, ...doc.data() });
        });
        callback(reviews);
      });
    }
  }
};

// Storage Services
export const storageService = {
  // Upload image
  uploadImage: async (file, path) => {
    try {
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return { success: true, url: downloadURL };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Upload review photo
  uploadReviewPhoto: async (file, reviewId) => {
    try {
      const path = `reviews/${reviewId}/${Date.now()}.jpg`;
      return await storageService.uploadImage(file, path);
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Upload salon photo
  uploadSalonPhoto: async (file, salonId) => {
    try {
      const path = `salons/${salonId}/${Date.now()}.jpg`;
      return await storageService.uploadImage(file, path);
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Delete image
  deleteImage: async (url) => {
    try {
      const imageRef = ref(storage, url);
      await deleteObject(imageRef);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// Notification Service (for FCM)
export const notificationService = {
  // Send notification via our Vercel API
  sendNotification: async (token, title, body, data = {}) => {
    try {
      const response = await fetch('https://sanova-salon-app.vercel.app/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          title,
          body,
          data
        })
      });

      const result = await response.json();
      return { success: response.ok, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

export default {
  authService,
  firestoreService,
  storageService,
  notificationService
};
