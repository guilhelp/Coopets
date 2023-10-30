import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Configuração do Firebase com as credenciais do seu projeto
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
  databaseURL: process.env.EXPO_PUBLIC_DATABASE_URL,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_APP_ID,
};


// Inicializa o Firebase com a configuração
const app = initializeApp(firebaseConfig); 

// Inicializa a autenticação Firebase com persistência de autenticação no React Native Async Storage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage), 
});

// Inicializa o Firestore (banco de dados) do Firebase
const db = getFirestore(app);

// Inicializa o Firebase Storage para armazenar arquivos
const storage = getStorage(app);

// Inicializa o Firebase Realtime Database (banco de dados em tempo real)
const database = getDatabase(app);

// Exporta os objetos e configurações do Firebase para uso em outras partes do aplicativo
export { auth, db, storage, database };



