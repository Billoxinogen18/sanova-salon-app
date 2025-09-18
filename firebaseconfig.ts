import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getAuth, getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY || "AIzaSyAGPMDcxLw1jVtB6tPVbVPnY2BJewBHpGQ",
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN || "sanova-2ef88.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID || "sanova-2ef88",
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET || "sanova-2ef88.firebasestorage.app",
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID || "522962181074",
  appId: process.env.EXPO_PUBLIC_APP_ID || "1:522962181074:android:2e84d84377c6805194c60b",
  databaseURL: "https://sanova-2ef88-default-rtdb.firebaseio.com"
};
console.log("🔥 API KEY:", firebaseConfig.apiKey);
const app = initializeApp(firebaseConfig);

let auth;
try {
  if (Platform.OS === 'web') {
    auth = getAuth(app);
  } else {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
  }
} catch (error) {
  console.warn("Firebase auth initialization error:", error);
  auth = getAuth(app); // Fallback to default auth
}
let analytics=null

// Initialize Firestore with better connection settings
const db = getFirestore(app);

// Configure Firestore settings for better reliability
import { connectFirestoreEmulator, enableNetwork, disableNetwork } from 'firebase/firestore';

// Add connection error handling
try {
  // Enable offline persistence
  enableNetwork(db);
} catch (error) {
  console.warn('Firestore network configuration warning:', error);
}

const storage = getStorage(app);

export { analytics };
export { auth };
export { db };
export { storage };