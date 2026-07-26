/**
 * Módulo de Validación de Variables de Entorno para Vite y Firebase.
 * Valida la presencia de las llaves VITE_FIREBASE_* al arrancar la aplicación.
 */

const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
];

export function validateEnv() {
  const missing = requiredEnvVars.filter((varName) => !import.meta.env[varName]);

  if (missing.length > 0) {
    const errorMsg = `❌ Error Crítico de Configuración: Faltan las siguientes variables de entorno en el archivo .env:\n - ${missing.join('\n - ')}\n\nPor favor, copia el archivo .env.example a .env.local y configura tus credenciales de Firebase.`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };
}

export const env = validateEnv();
