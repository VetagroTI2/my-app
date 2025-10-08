// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore, initializeFirestore, persistentLocalCache } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAldK-7ZvC0w10Hqyi04xESQlDUlziRCnA",
  authDomain: "app-mapa-6b2bc.firebaseapp.com",
  projectId: "app-mapa-6b2bc",
  storageBucket: "app-mapa-6b2bc.firebasestorage.app",
  messagingSenderId: "400028079016",
  appId: "1:400028079016:web:c02457c8333cbf04b0039d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Serviços
// 🔑 Inicializa o Auth com persistência no AsyncStorage
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache()
})
