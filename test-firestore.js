// Simple test script to verify Firestore connection
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDroW9Vbik7MFfJ8IHQKaU_x9WiHK0uPAw",
  authDomain: "sanova-2ef88.firebaseapp.com",
  projectId: "sanova-2ef88",
  storageBucket: "sanova-2ef88.firebasestorage.app",
  messagingSenderId: "522962181074",
  appId: "1:522962181074:web:02aae46147f45cf294c60b",
  databaseURL: "https://sanova-2ef88-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testFirestoreConnection() {
  try {
    console.log('🔥 Testing Firestore connection...');
    console.log('📍 Project ID:', firebaseConfig.projectId);
    
    // Test write operation
    const testDoc = doc(db, 'test', 'connection-test');
    await setDoc(testDoc, {
      message: 'Hello from test script!',
      timestamp: new Date(),
      test: 'connection_test'
    });
    console.log('✅ Write operation successful');
    
    // Test read operation
    const docSnap = await getDoc(testDoc);
    if (docSnap.exists()) {
      console.log('✅ Read operation successful');
      console.log('📄 Document data:', docSnap.data());
    } else {
      console.log('❌ Document not found');
    }
    
    // Clean up
    await deleteDoc(testDoc);
    console.log('🧹 Test document cleaned up');
    console.log('🎉 Firestore connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ Firestore connection test failed:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
  }
}

testFirestoreConnection();
