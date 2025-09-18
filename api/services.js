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
        return await getServices(req, res);
      case 'POST':
        return await createService(req, res);
      case 'PUT':
        return await updateService(req, res);
      case 'DELETE':
        return await deleteService(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Services API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

async function getServices(req, res) {
  const { salonId, category } = req.query;
  
  let query = db.collection('services');
  
  if (salonId) {
    query = query.where('salonId', '==', salonId);
  }
  if (category) {
    query = query.where('category', '==', category);
  }
  
  const snapshot = await query.get();
  const services = [];
  
  snapshot.forEach(doc => {
    services.push({
      id: doc.id,
      ...doc.data()
    });
  });
  
  res.status(200).json({ services });
}

async function createService(req, res) {
  const {
    salonId,
    name,
    description,
    price,
    duration,
    category,
    imageUrl,
    isActive
  } = req.body;
  
  const serviceData = {
    salonId,
    name,
    description,
    price,
    duration,
    category,
    imageUrl,
    isActive: isActive !== false,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };
  
  const docRef = await db.collection('services').add(serviceData);
  
  res.status(201).json({
    success: true,
    serviceId: docRef.id,
    service: { id: docRef.id, ...serviceData }
  });
}

async function updateService(req, res) {
  const { serviceId } = req.query;
  const updateData = {
    ...req.body,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };
  
  await db.collection('services').doc(serviceId).update(updateData);
  
  res.status(200).json({
    success: true,
    message: 'Service updated successfully'
  });
}

async function deleteService(req, res) {
  const { serviceId } = req.query;
  
  await db.collection('services').doc(serviceId).delete();
  
  res.status(200).json({
    success: true,
    message: 'Service deleted successfully'
  });
}

