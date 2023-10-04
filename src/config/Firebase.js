import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCK0Y3NoDl8lLDGzMtLWLYIsmiZBIlu0Wc",
  authDomain: "coopets-app.firebaseapp.com",
  databaseURL: "https://coopets-app-default-rtdb.firebaseio.com",
  projectId: "coopets-app",
  storageBucket: "coopets-app.appspot.com",
  messagingSenderId: "484702316450",
  appId: "1:484702316450:web:b85d81c8554674a8b6f4fb"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
const db = getFirestore(app);
const storage = getStorage(app);
const database = getDatabase(app);

export { auth, db, storage, database };



