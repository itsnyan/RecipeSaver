import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getReactNativePersistence } from 'firebase/auth/react-native';

interface FirebaseConfig {
  apiKey: string | undefined;
  authDomain: string | undefined;
  projectId: string | undefined;
  storageBucket: string | undefined;
  messagingSenderId: string | undefined;
  appId: string | undefined;
}

const firebaseConfig: FirebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const validateConfig = (config: FirebaseConfig) => {
  const requiredFields: (keyof FirebaseConfig)[] = [
    'apiKey',
    'authDomain',
    'projectId',
    'appId'
  ];
  
  requiredFields.forEach(field => {
    if (!config[field]) {
      throw new Error(`Firebase ${field} is missing`);
    }
  });
};

const initializeFirebase = () => {
  validateConfig(firebaseConfig);
  
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  const auth: Auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
  const db: Firestore = getFirestore(app);
  
  return { app, auth, db };
};

export const { app, auth, db } = initializeFirebase();