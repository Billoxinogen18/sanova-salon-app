import { firestoreService } from './firebaseService';
import notificationService from './notificationService';

export class RealtimeService {
  constructor() {
    this.listeners = new Map();
    this.isInitialized = false;
  }

  // Initialize real-time service
  async initialize() {
    try {
      if (this.isInitialized) return { success: true };
      
      // Initialize notification service
      await notificationService.initialize();
      
      this.isInitialized = true;
      console.log('Real-time service initialized successfully');
      return { success: true };
    } catch (error) {
      console.error('Error initializing real-time service:', error);
      return { success: false, error: error.message };
    }
  }

  // Start listening to booking updates for a salon
  startListeningToSalonBookings(salonId, callback) {
    try {
      if (this.listeners.has(`salon_bookings_${salonId}`)) {
        // Already listening, update callback
        this.listeners.get(`salon_bookings_${salonId}`)();
      }

      const unsubscribe = firestoreService.realtime.listenToBookings(salonId, (bookings) => {
        console.log(`Real-time update: ${bookings.length} bookings for salon ${salonId}`);
        
        // Check for new bookings and send notifications
        this.handleBookingUpdates(salonId, bookings);
        
        // Call the provided callback
        if (callback) callback(bookings);
      });

      this.listeners.set(`salon_bookings_${salonId}`, unsubscribe);
      
      return { success: true, unsubscribe };
    } catch (error) {
      console.error('Error starting booking listener:', error);
      return { success: false, error: error.message };
    }
  }

  // Start listening to review updates for a salon
  startListeningToSalonReviews(salonId, callback) {
    try {
      if (this.listeners.has(`salon_reviews_${salonId}`)) {
        // Already listening, update callback
        this.listeners.get(`salon_reviews_${salonId}`)();
      }

      const unsubscribe = firestoreService.realtime.listenToReviews(salonId, (reviews) => {
        console.log(`Real-time update: ${reviews.length} reviews for salon ${salonId}`);
        
        // Check for new reviews and send notifications
        this.handleReviewUpdates(salonId, reviews);
        
        // Call the provided callback
        if (callback) callback(reviews);
      });

      this.listeners.set(`salon_reviews_${salonId}`, unsubscribe);
      
      return { success: true, unsubscribe };
    } catch (error) {
      console.error('Error starting review listener:', error);
      return { success: false, error: error.message };
    }
  }

  // Handle booking updates and send notifications
  async handleBookingUpdates(salonId, bookings) {
    try {
      // Get the latest booking
      const latestBooking = bookings[0];
      
      if (!latestBooking) return;

      // Check if this is a new booking (created in the last minute)
      const now = new Date();
      const bookingTime = new Date(latestBooking.createdAt?.seconds ? 
        latestBooking.createdAt.seconds * 1000 : latestBooking.createdAt);
      const timeDiff = now - bookingTime;
      
      if (timeDiff < 60000) { // Less than 1 minute old
        // This is a new booking, send notification to salon owner
        await this.sendBookingNotificationToSalon(salonId, latestBooking);
        
        // Schedule reminder for customer
        await notificationService.scheduleBookingReminder(latestBooking);
        
        // Schedule review request for after the appointment
        await notificationService.scheduleReviewRequest(latestBooking);
      }

      // Check for status changes
      const statusChangedBookings = bookings.filter(booking => {
        const updatedTime = new Date(booking.updatedAt?.seconds ? 
          booking.updatedAt.seconds * 1000 : booking.updatedAt);
        const timeDiff = now - updatedTime;
        return timeDiff < 60000 && booking.updatedAt !== booking.createdAt;
      });

      for (const booking of statusChangedBookings) {
        await this.sendBookingStatusUpdateNotification(booking);
      }

    } catch (error) {
      console.error('Error handling booking updates:', error);
    }
  }

  // Handle review updates and send notifications
  async handleReviewUpdates(salonId, reviews) {
    try {
      // Get the latest review
      const latestReview = reviews[0];
      
      if (!latestReview) return;

      // Check if this is a new review (created in the last minute)
      const now = new Date();
      const reviewTime = new Date(latestReview.createdAt?.seconds ? 
        latestReview.createdAt.seconds * 1000 : latestReview.createdAt);
      const timeDiff = now - reviewTime;
      
      if (timeDiff < 60000) { // Less than 1 minute old
        // This is a new review, send notification to salon owner
        await this.sendReviewNotificationToSalon(salonId, latestReview);
      }

    } catch (error) {
      console.error('Error handling review updates:', error);
    }
  }

  // Send booking notification to salon owner
  async sendBookingNotificationToSalon(salonId, booking) {
    try {
      // In a real app, you'd get the salon owner's FCM token from the database
      const salonOwnerToken = 'SALON_OWNER_FCM_TOKEN'; // This would come from user preferences/database
      
      const title = 'New Booking Received!';
      const body = `${booking.customerName || 'A customer'} booked ${booking.serviceName} for ${booking.date} at ${booking.time}`;
      
      const notificationData = {
        type: 'new_booking',
        bookingId: booking.id,
        salonId: salonId,
        customerId: booking.userId
      };

      await notificationService.sendPushNotification(salonOwnerToken, title, body, notificationData);
      
      // Also send local notification if the salon owner is using the app
      await notificationService.sendLocalNotification(title, body, notificationData);
      
      console.log('Booking notification sent to salon owner');
    } catch (error) {
      console.error('Error sending booking notification:', error);
    }
  }

  // Send review notification to salon owner
  async sendReviewNotificationToSalon(salonId, review) {
    try {
      const salonOwnerToken = 'SALON_OWNER_FCM_TOKEN';
      
      const title = 'New Review Received!';
      const body = `${review.rating} star review: "${review.reviewText?.substring(0, 50)}${review.reviewText?.length > 50 ? '...' : ''}"`;
      
      const notificationData = {
        type: 'new_review',
        reviewId: review.id,
        salonId: salonId,
        rating: review.rating
      };

      await notificationService.sendPushNotification(salonOwnerToken, title, body, notificationData);
      await notificationService.sendLocalNotification(title, body, notificationData);
      
      console.log('Review notification sent to salon owner');
    } catch (error) {
      console.error('Error sending review notification:', error);
    }
  }

  // Send booking status update notification
  async sendBookingStatusUpdateNotification(booking) {
    try {
      const customerToken = 'CUSTOMER_FCM_TOKEN'; // This would come from user preferences/database
      
      let title, body;
      
      switch (booking.status) {
        case 'confirmed':
          title = 'Booking Confirmed!';
          body = `Your ${booking.serviceName} appointment is confirmed for ${booking.date} at ${booking.time}`;
          break;
        case 'cancelled':
          title = 'Booking Cancelled';
          body = `Your ${booking.serviceName} appointment has been cancelled. Please contact the salon for more details.`;
          break;
        case 'completed':
          title = 'Service Completed';
          body = `Hope you enjoyed your ${booking.serviceName}! Please consider leaving a review.`;
          break;
        default:
          title = 'Booking Update';
          body = `Your ${booking.serviceName} appointment status has been updated to ${booking.status}`;
      }
      
      const notificationData = {
        type: 'booking_status_update',
        bookingId: booking.id,
        status: booking.status,
        salonId: booking.salonId
      };

      await notificationService.sendPushNotification(customerToken, title, body, notificationData);
      
      console.log(`Booking status update notification sent for ${booking.status}`);
    } catch (error) {
      console.error('Error sending booking status notification:', error);
    }
  }

  // Stop listening to a specific real-time update
  stopListening(listenerKey) {
    try {
      if (this.listeners.has(listenerKey)) {
        const unsubscribe = this.listeners.get(listenerKey);
        unsubscribe();
        this.listeners.delete(listenerKey);
        console.log(`Stopped listening to ${listenerKey}`);
        return { success: true };
      }
      return { success: false, error: 'Listener not found' };
    } catch (error) {
      console.error('Error stopping listener:', error);
      return { success: false, error: error.message };
    }
  }

  // Stop all listeners
  stopAllListeners() {
    try {
      for (const [key, unsubscribe] of this.listeners) {
        unsubscribe();
        console.log(`Stopped listening to ${key}`);
      }
      this.listeners.clear();
      console.log('All real-time listeners stopped');
      return { success: true };
    } catch (error) {
      console.error('Error stopping all listeners:', error);
      return { success: false, error: error.message };
    }
  }

  // Get active listeners count
  getActiveListenersCount() {
    return this.listeners.size;
  }

  // Start comprehensive real-time monitoring for a salon
  async startSalonMonitoring(salonId, callbacks = {}) {
    try {
      const results = [];
      
      // Start booking monitoring
      if (callbacks.onBookingsUpdate) {
        const bookingResult = this.startListeningToSalonBookings(salonId, callbacks.onBookingsUpdate);
        results.push({ type: 'bookings', ...bookingResult });
      }
      
      // Start review monitoring
      if (callbacks.onReviewsUpdate) {
        const reviewResult = this.startListeningToSalonReviews(salonId, callbacks.onReviewsUpdate);
        results.push({ type: 'reviews', ...reviewResult });
      }
      
      console.log(`Started comprehensive monitoring for salon ${salonId}`);
      return { success: true, results };
    } catch (error) {
      console.error('Error starting salon monitoring:', error);
      return { success: false, error: error.message };
    }
  }

  // Stop comprehensive monitoring for a salon
  stopSalonMonitoring(salonId) {
    try {
      const bookingKey = `salon_bookings_${salonId}`;
      const reviewKey = `salon_reviews_${salonId}`;
      
      this.stopListening(bookingKey);
      this.stopListening(reviewKey);
      
      console.log(`Stopped comprehensive monitoring for salon ${salonId}`);
      return { success: true };
    } catch (error) {
      console.error('Error stopping salon monitoring:', error);
      return { success: false, error: error.message };
    }
  }

  // Cleanup when app is destroyed
  cleanup() {
    this.stopAllListeners();
    notificationService.cleanup();
    this.isInitialized = false;
    console.log('Real-time service cleaned up');
  }
}

// Create singleton instance
const realtimeServiceInstance = new RealtimeService();

export default realtimeServiceInstance;
