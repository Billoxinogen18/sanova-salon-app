import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getAuth, getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyAGPMDcxLw1jVtB6tPVbVPnY2BJewBHpGQ",
  authDomain: "sanova-2ef88.firebaseapp.com",
  projectId: "sanova-2ef88",
  storageBucket: "sanova-2ef88.firebasestorage.app",
  messagingSenderId: "522962181074",
  appId: "1:522962181074:android:2e84d84377c6805194c60b",
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
const db = getFirestore(app);
const storage = getStorage(app);

export { analytics };
export { auth };
export { db };
export { storage };