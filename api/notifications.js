const admin = require('firebase-admin');

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, tokens, data } = req.body;

    let message = {};

    switch (type) {
      case 'booking_confirmation':
        message = {
          notification: {
            title: 'Booking Confirmed!',
            body: `Your appointment for ${data.serviceName} is confirmed for ${data.dateTime}`
          },
          data: {
            type: 'booking_confirmation',
            bookingId: data.bookingId,
            salonId: data.salonId
          }
        };
        break;

      case 'booking_reminder':
        message = {
          notification: {
            title: 'Appointment Reminder',
            body: `Don't forget your appointment tomorrow at ${data.time}`
          },
          data: {
            type: 'booking_reminder',
            bookingId: data.bookingId
          }
        };
        break;

      case 'payment_success':
        message = {
          notification: {
            title: 'Payment Successful',
            body: `Payment of DKK ${data.amount} has been processed`
          },
          data: {
            type: 'payment_success',
            bookingId: data.bookingId
          }
        };
        break;

      case 'new_booking_salon':
        message = {
          notification: {
            title: 'New Booking!',
            body: `${data.customerName} booked ${data.serviceName} for ${data.dateTime}`
          },
          data: {
            type: 'new_booking',
            bookingId: data.bookingId,
            customerId: data.customerId
          }
        };
        break;

      default:
        return res.status(400).json({ error: 'Invalid notification type' });
    }

    // Send to multiple tokens
    const response = await admin.messaging().sendMulticast({
      tokens,
      ...message
    });

    res.status(200).json({
      success: true,
      successCount: response.successCount,
      failureCount: response.failureCount,
      responses: response.responses
    });

  } catch (error) {
    console.error('Notification error:', error);
    res.status(500).json({ error: 'Notification failed' });
  }
}
