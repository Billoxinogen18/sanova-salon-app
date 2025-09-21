// Script to create a test user in Firestore using Admin SDK
const admin = require('firebase-admin');
const serviceAccount = require('./sanova-2ef88-firebase-adminsdk-fbsvc-4af02ffd06.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sanova-2ef88-default-rtdb.firebaseio.com"
});

const db = admin.firestore();

async function createTestUser() {
  try {
    console.log('🔥 Creating test user in Firestore...');
    
    // Create a test user document
    const testUserRef = db.collection('users').doc('test-user-123');
    await testUserRef.set({
      email: 'test@sanova.com',
      name: 'Test User',
      role: 'customer',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastLogin: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log('✅ Test user created successfully!');
    
    // Read the user back to verify
    const userDoc = await testUserRef.get();
    if (userDoc.exists) {
      console.log('✅ User document verified:', userDoc.data());
    }
    
    // Create a test salon document
    const testSalonRef = db.collection('salons').doc('test-salon-123');
    await testSalonRef.set({
      name: 'Test Salon',
      address: '123 Test Street',
      phone: '+45 12345678',
      services: ['Haircut', 'Manicure'],
      ownerId: 'test-user-123',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log('✅ Test salon created successfully!');
    
    // Read the salon back to verify
    const salonDoc = await testSalonRef.get();
    if (salonDoc.exists) {
      console.log('✅ Salon document verified:', salonDoc.data());
    }
    
    console.log('🎉 Firestore connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error creating test user:', error);
  }
}

createTestUser();
