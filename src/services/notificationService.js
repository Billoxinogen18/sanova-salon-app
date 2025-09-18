import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
// Note: For Expo managed workflow, we use Expo's push notification service
// Firebase Cloud Messaging is handled via Expo's backend

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export class NotificationService {
  constructor() {
    this.expoPushToken = null;
    this.notificationListener = null;
    this.responseListener = null;
  }

  // Initialize notification service
  async initialize() {
    try {
      // Register for push notifications
      await this.registerForPushNotificationsAsync();
      
      // Set up notification listeners
      this.setupNotificationListeners();
      
      return { success: true };
    } catch (error) {
      console.error('Error initializing notifications:', error);
      return { success: false, error: error.message };
    }
  }

  // Register for push notifications
  async registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        throw new Error('Failed to get push token for push notification!');
      }
      
      token = (await Notifications.getExpoPushTokenAsync()).data;
      this.expoPushToken = token;
      console.log('Expo push token:', token);
    } else {
      throw new Error('Must use physical device for Push Notifications');
    }

    return token;
  }

  // Set up notification listeners
  setupNotificationListeners() {
    // Listener for notifications received while app is foregrounded
    this.notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
      // Handle notification received
      this.handleNotificationReceived(notification);
    });

    // Listener for when a user taps on or interacts with a notification
    this.responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
      // Handle notification response
      this.handleNotificationResponse(response);
    });
  }

  // Handle notification received
  handleNotificationReceived(notification) {
    const { title, body, data } = notification.request.content;
    console.log('Received notification:', { title, body, data });
    
    // You can show custom UI or update app state here
    // For example, update a notification badge or show an in-app message
  }

  // Handle notification response (when user taps notification)
  handleNotificationResponse(response) {
    const { notification } = response;
    const { data } = notification.request.content;
    
    console.log('User tapped notification:', data);
    
    // Navigate to specific screen based on notification data
    if (data?.type === 'booking') {
      // Navigate to booking details
      console.log('Navigate to booking:', data.bookingId);
    } else if (data?.type === 'review') {
      // Navigate to review screen
      console.log('Navigate to review:', data.reviewId);
    }
    // Add more navigation logic as needed
  }

  // Send local notification
  async sendLocalNotification(title, body, data = {}) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
        },
        trigger: null, // Show immediately
      });
      return { success: true };
    } catch (error) {
      console.error('Error sending local notification:', error);
      return { success: false, error: error.message };
    }
  }

  // Send push notification via Expo's service
  async sendPushNotification(token, title, body, data = {}) {
    try {
      const message = {
        to: token,
        sound: 'default',
        title: title,
        body: body,
        data: data,
      };

      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      const result = await response.json();
      return { success: response.ok, data: result };
    } catch (error) {
      console.error('Error sending push notification:', error);
      return { success: false, error: error.message };
    }
  }

  // Schedule notification for booking reminders
  async scheduleBookingReminder(bookingData) {
    try {
      const { date, time, salonName, serviceName } = bookingData;
      
      // Parse the date and time to create a trigger
      const bookingDateTime = new Date(`${date} ${time}`);
      const reminderTime = new Date(bookingDateTime.getTime() - (24 * 60 * 60 * 1000)); // 24 hours before
      
      if (reminderTime > new Date()) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Booking Reminder',
            body: `Your ${serviceName} at ${salonName} is tomorrow!`,
            data: {
              type: 'booking_reminder',
              bookingId: bookingData.id,
              salonId: bookingData.salonId
            },
          },
          trigger: reminderTime,
        });
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error scheduling booking reminder:', error);
      return { success: false, error: error.message };
    }
  }

  // Schedule notification for review requests
  async scheduleReviewRequest(bookingData) {
    try {
      const { date, time, salonName, serviceName } = bookingData;
      
      // Parse the date and time to create a trigger
      const bookingDateTime = new Date(`${date} ${time}`);
      const reviewTime = new Date(bookingDateTime.getTime() + (2 * 60 * 60 * 1000)); // 2 hours after booking
      
      if (reviewTime > new Date()) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'How was your experience?',
            body: `Rate your ${serviceName} at ${salonName}`,
            data: {
              type: 'review_request',
              bookingId: bookingData.id,
              salonId: bookingData.salonId,
              serviceId: bookingData.serviceId
            },
          },
          trigger: reviewTime,
        });
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error scheduling review request:', error);
      return { success: false, error: error.message };
    }
  }

  // Get expo push token
  getExpoPushToken() {
    return this.expoPushToken;
  }

  // Clean up listeners
  cleanup() {
    if (this.notificationListener) {
      Notifications.removeNotificationSubscription(this.notificationListener);
    }
    if (this.responseListener) {
      Notifications.removeNotificationSubscription(this.responseListener);
    }
  }

  // Cancel all scheduled notifications
  async cancelAllScheduledNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      return { success: true };
    } catch (error) {
      console.error('Error canceling notifications:', error);
      return { success: false, error: error.message };
    }
  }

  // Cancel specific notification
  async cancelNotification(notificationId) {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      return { success: true };
    } catch (error) {
      console.error('Error canceling notification:', error);
      return { success: false, error: error.message };
    }
  }
}

// Create singleton instance
const notificationServiceInstance = new NotificationService();

export default notificationServiceInstance;
