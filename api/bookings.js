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

const db = admin.firestore();

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    switch (req.method) {
      case 'GET':
        return await getBookings(req, res);
      case 'POST':
        return await createBooking(req, res);
      case 'PUT':
        return await updateBooking(req, res);
      case 'DELETE':
        return await deleteBooking(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Bookings API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

async function getBookings(req, res) {
  const { salonId, customerId, status } = req.query;
  
  let query = db.collection('bookings');
  
  if (salonId) {
    query = query.where('salonId', '==', salonId);
  }
  if (customerId) {
    query = query.where('customerId', '==', customerId);
  }
  if (status) {
    query = query.where('status', '==', status);
  }
  
  const snapshot = await query.orderBy('dateTime', 'desc').get();
  const bookings = [];
  
  snapshot.forEach(doc => {
    bookings.push({
      id: doc.id,
      ...doc.data()
    });
  });
  
  res.status(200).json({ bookings });
}

async function createBooking(req, res) {
  const {
    customerId,
    salonId,
    serviceId,
    serviceName,
    dateTime,
    duration,
    price,
    paymentMethod,
    paymentStatus,
    notes
  } = req.body;
  
  const bookingData = {
    customerId,
    salonId,
    serviceId,
    serviceName,
    dateTime,
    duration,
    price,
    paymentMethod,
    paymentStatus: paymentStatus || 'pending',
    status: 'confirmed',
    notes,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };
  
  const docRef = await db.collection('bookings').add(bookingData);
  
  // Send notification to salon
  await sendNotificationToSalon(salonId, {
    type: 'new_booking',
    bookingId: docRef.id,
    customerId,
    serviceName,
    dateTime
  });
  
  res.status(201).json({
    success: true,
    bookingId: docRef.id,
    booking: { id: docRef.id, ...bookingData }
  });
}

async function updateBooking(req, res) {
  const { bookingId } = req.query;
  const updateData = {
    ...req.body,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };
  
  await db.collection('bookings').doc(bookingId).update(updateData);
  
  res.status(200).json({
    success: true,
    message: 'Booking updated successfully'
  });
}

async function deleteBooking(req, res) {
  const { bookingId } = req.query;
  
  await db.collection('bookings').doc(bookingId).delete();
  
  res.status(200).json({
    success: true,
    message: 'Booking deleted successfully'
  });
}

async function sendNotificationToSalon(salonId, notificationData) {
  try {
    // Get salon's FCM tokens
    const salonDoc = await db.collection('salons').doc(salonId).get();
    const salonData = salonDoc.data();
    
    if (salonData && salonData.fcmTokens) {
      // Send notification via FCM
      const message = {
        notification: {
          title: 'New Booking!',
          body: `${notificationData.customerId} booked ${notificationData.serviceName}`
        },
        data: notificationData,
        tokens: salonData.fcmTokens
      };
      
      await admin.messaging().sendMulticast(message);
    }
  } catch (error) {
    console.error('Error sending notification to salon:', error);
  }
}

