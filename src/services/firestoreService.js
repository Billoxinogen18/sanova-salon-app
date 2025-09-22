import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebaseconfig';

// Users Service
export const usersService = {
  // Get user by ID
  async getById(userId) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return { id: userDoc.id, ...userDoc.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw error;
    }
  },

  // Create or update user
  async createOrUpdate(userId, userData) {
    try {
      const userRef = doc(db, 'users', userId);
      const data = {
        ...userData,
        updatedAt: serverTimestamp()
      };
      await setDoc(userRef, data, { merge: true });
      return { id: userId, ...data };
    } catch (error) {
      console.error('Error creating/updating user:', error);
      throw error;
    }
  },

  // Update user profile
  async updateProfile(userId, profileData) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...profileData,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }
};

// Bookings Service
export const bookingsService = {
  // Get all bookings for a user (customer or salon)
  async getBookings(userId, userType) {
    try {
      const field = userType === 'customer' ? 'customerId' : 'salonId';
      const q = query(
        collection(db, 'bookings'),
        where(field, '==', userId),
        orderBy('dateTime', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting bookings:', error);
      throw error;
    }
  },

  // Create a new booking
  async createBooking(bookingData) {
    try {
      const docRef = doc(collection(db, 'bookings'));
      const data = {
        ...bookingData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      await setDoc(docRef, data);
      return { id: docRef.id, ...data };
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  // Update a booking
  async updateBooking(bookingId, updateData) {
    try {
      const docRef = doc(db, 'bookings', bookingId);
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  },

  // Delete a booking
  async deleteBooking(bookingId) {
    try {
      await deleteDoc(doc(db, 'bookings', bookingId));
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  },

  // Listen to real-time booking updates
  subscribeToBookings(userId, userType, callback) {
    const field = userType === 'customer' ? 'customerId' : 'salonId';
    const q = query(
      collection(db, 'bookings'),
      where(field, '==', userId),
      orderBy('dateTime', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(bookings);
    });
  }
};

// Services Service
export const servicesService = {
  // Get all services for a salon
  async getServices(salonId) {
    try {
      const q = query(
        collection(db, 'services'),
        where('salonId', '==', salonId),
        where('isActive', '==', true)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting services:', error);
      throw error;
    }
  },

  // Create a new service
  async createService(serviceData) {
    try {
      const docRef = doc(collection(db, 'services'));
      const data = {
        ...serviceData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      await setDoc(docRef, data);
      return { id: docRef.id, ...data };
    } catch (error) {
      console.error('Error creating service:', error);
      throw error;
    }
  },

  // Update a service
  async updateService(serviceId, updateData) {
    try {
      const docRef = doc(db, 'services', serviceId);
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating service:', error);
      throw error;
    }
  }
};

// Salons Service
export const salonsService = {
  // Get all active salons
  async getSalons() {
    try {
      const q = query(
        collection(db, 'salons'),
        where('isActive', '==', true)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting salons:', error);
      throw error;
    }
  },

  // Get salon by ID
  async getSalon(salonId) {
    try {
      const docRef = doc(db, 'salons', salonId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting salon:', error);
      throw error;
    }
  },

  // Create a new salon
  async createSalon(salonData) {
    try {
      const docRef = doc(collection(db, 'salons'));
      const data = {
        ...salonData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      await setDoc(docRef, data);
      return { id: docRef.id, ...data };
    } catch (error) {
      console.error('Error creating salon:', error);
      throw error;
    }
  }
};

// Reviews Service
export const reviewsService = {
  // Get reviews for a service or salon
  async getReviews(serviceId, salonId) {
    try {
      let q;
      if (serviceId) {
        q = query(
          collection(db, 'reviews'),
          where('serviceId', '==', serviceId),
          orderBy('createdAt', 'desc')
        );
      } else if (salonId) {
        q = query(
          collection(db, 'reviews'),
          where('salonId', '==', salonId),
          orderBy('createdAt', 'desc')
        );
      } else {
        throw new Error('Either serviceId or salonId must be provided');
      }
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting reviews:', error);
      throw error;
    }
  },

  // Create a new review
  async createReview(reviewData) {
    try {
      const docRef = doc(collection(db, 'reviews'));
      const data = {
        ...reviewData,
        createdAt: serverTimestamp()
      };
      await setDoc(docRef, data);
      return { id: docRef.id, ...data };
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  }
};

// Products Service
export const productsService = {
  // Get all products for a salon
  async getProducts(salonId) {
    try {
      const q = query(
        collection(db, 'products'),
        where('salonId', '==', salonId),
        where('isActive', '==', true)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting products:', error);
      throw error;
    }
  },

  // Create a new product
  async createProduct(productData) {
    try {
      const docRef = doc(collection(db, 'products'));
      const data = {
        ...productData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      await setDoc(docRef, data);
      return { id: docRef.id, ...data };
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }
};

