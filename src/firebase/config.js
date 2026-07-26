import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager 
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { env } from '../config/env';

const firebaseConfig = {
  apiKey: env.apiKey,
  authDomain: env.authDomain,
  projectId: env.projectId,
  storageBucket: env.storageBucket,
  messagingSenderId: env.messagingSenderId,
  appId: env.appId,
};

// Inicialización Singleton de App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Inicializar Firestore con Persistencia Offline de Múltiples Pestañas
let db;
try {
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    }),
  });
} catch (e) {
  // Fallback si la persistencia ya fue configurada o no se soporta en el entorno
  db = getFirestore(app);
}

// Inicializar Servicios
export const auth = getAuth(app);
export const storage = getStorage(app);

export { db, app };
