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
        return await getSalons(req, res);
      case 'POST':
        return await createSalon(req, res);
      case 'PUT':
        return await updateSalon(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Salons API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

async function getSalons(req, res) {
  const { lat, lng, radius = 10 } = req.query;
  
  let query = db.collection('salons').where('isActive', '==', true);
  
  const snapshot = await query.get();
  let salons = [];
  
  snapshot.forEach(doc => {
    const salonData = { id: doc.id, ...doc.data() };
    
    // If location filtering is requested
    if (lat && lng) {
      const distance = calculateDistance(
        parseFloat(lat),
        parseFloat(lng),
        salonData.latitude,
        salonData.longitude
      );
      
      if (distance <= parseFloat(radius)) {
        salonData.distance = distance;
        salons.push(salonData);
      }
    } else {
      salons.push(salonData);
    }
  });
  
  // Sort by distance if location filtering is applied
  if (lat && lng) {
    salons.sort((a, b) => a.distance - b.distance);
  }
  
  res.status(200).json({ salons });
}

async function createSalon(req, res) {
  const {
    name,
    description,
    address,
    latitude,
    longitude,
    phone,
    email,
    website,
    openingHours,
    services,
    images,
    ownerId
  } = req.body;
  
  const salonData = {
    name,
    description,
    address,
    latitude,
    longitude,
    phone,
    email,
    website,
    openingHours,
    services: services || [],
    images: images || [],
    ownerId,
    isActive: true,
    rating: 0,
    reviewCount: 0,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };
  
  const docRef = await db.collection('salons').add(salonData);
  
  res.status(201).json({
    success: true,
    salonId: docRef.id,
    salon: { id: docRef.id, ...salonData }
  });
}

async function updateSalon(req, res) {
  const { salonId } = req.query;
  const updateData = {
    ...req.body,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };
  
  await db.collection('salons').doc(salonId).update(updateData);
  
  res.status(200).json({
    success: true,
    message: 'Salon updated successfully'
  });
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  return distance;
}

