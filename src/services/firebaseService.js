import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile,
  onAuthStateChanged 
} from 'firebase/auth';
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

// Authentication Services
export const authService = {
  // Sign in with email and password
  signIn: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Create new user account
  signUp: async (email, password, userData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update user profile
      await updateProfile(user, {
        displayName: userData.name || userData.displayName
      });

      // Save additional user data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        name: userData.name || userData.displayName,
        phone: userData.phone || '',
        role: userData.role || 'customer',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Sign out current user
  signOut: async () => {
    try {
      await signOut(auth);
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
  }
};

// Firestore Services
export const firestoreService = {
  // User operations
  users: {
    create: async (userId, userData) => {
      try {
        await setDoc(doc(db, 'users', userId), {
          ...userData,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    get: async (userId) => {
      try {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return { success: true, data: docSnap.data() };
        } else {
          return { success: false, error: 'User not found' };
        }
      } catch (error) {
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
