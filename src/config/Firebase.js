import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Configuração do Firebase com as credenciais do seu projeto
const firebaseConfig = {
  apiKey: "AIzaSyCK0Y3NoDl8lLDGzMtLWLYIsmiZBIlu0Wc",
  authDomain: "coopets-app.firebaseapp.com",
  databaseURL: "https://coopets-app-default-rtdb.firebaseio.com",
  projectId: "coopets-app",
  storageBucket: "coopets-app.appspot.com",
  messagingSenderId: "484702316450",
  appId: "1:484702316450:web:b85d81c8554674a8b6f4fb"
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



