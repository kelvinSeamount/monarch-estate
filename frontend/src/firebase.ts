// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

const firebaseConfig: FirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "monarch-estate.firebaseapp.com",
  projectId: "monarch-estate",
  storageBucket: "monarch-estate.firebasestorage.app",
  messagingSenderId: "705923876484",
  appId: "1:705923876484:web:38729b7f8c6b1a2b0ea4d1",
};

export const app = initializeApp(firebaseConfig);
