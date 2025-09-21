import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getAuth, getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyDroW9Vbik7MFfJ8IHQKaU_x9WiHK0uPAw",
  authDomain: "sanova-2ef88.firebaseapp.com",
  projectId: "sanova-2ef88",
  storageBucket: "sanova-2ef88.firebasestorage.app",
  messagingSenderId: "522962181074",
  appId: "1:522962181074:web:02aae46147f45cf294c60b",
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

// Initialize Firestore - always use cloud database
const db = getFirestore(app);
console.log('🔥 Using cloud Firestore for all environments');

console.log('🔥 Firestore initialized for project:', firebaseConfig.projectId);

const storage = getStorage(app);

export { analytics };
export { auth };
export { db };
export { storage };