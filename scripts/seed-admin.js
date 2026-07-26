import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ruta hacia la clave de servicio descargada desde la Consola de Firebase
const serviceAccountPath = resolve(__dirname, '../serviceAccountKey.json');

if (!existsSync(serviceAccountPath)) {
  console.error("❌ Error Crítico: No se encontró el archivo serviceAccountKey.json en la raíz del proyecto.");
  process.exit(1);
}

const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

// Inicializar Firebase Admin SDK con Privilegios Administrativos
initializeApp({
  credential: cert(serviceAccount)
});

const auth = getAuth();
const db = getFirestore();

async function createFirstAdmin() {
  const adminEmail = "admin@cecati122.edu.mx";
  const adminPassword = "UnaContraseñaSegura123!";
  const adminDisplayName = "Administrador CECATI 122";

  console.log(`🚀 Iniciando creación del Administrador con Admin SDK (${adminEmail})...`);

  try {
    let user;
    try {
      user = await auth.getUserByEmail(adminEmail);
      console.log(`ℹ️ El usuario ya existe en Firebase Auth con UID: ${user.uid}`);
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        user = await auth.createUser({
          email: adminEmail,
          password: adminPassword,
          displayName: adminDisplayName,
          emailVerified: true,
        });
        console.log(`✅ Usuario creado exitosamente en Firebase Auth con UID: ${user.uid}`);
      } else {
        throw err;
      }
    }

    // 1. Asignar Custom Claim de rol ADMIN
    await auth.setCustomUserClaims(user.uid, { role: "ADMIN" });
    console.log(`🔒 Custom Claim { role: "ADMIN" } asignado exitosamente.`);

    // 2. Crear documento de usuario en la colección 'users' de Firestore
    await db.collection("users").doc(user.uid).set({
      nombre: adminDisplayName,
      email: adminEmail,
      role: "ADMIN",
      creadoEn: FieldValue.serverTimestamp(),
      actualizadoEn: FieldValue.serverTimestamp(),
    }, { merge: true });

    console.log(`📄 Documento creado/actualizado en Firestore ('users/${user.uid}').`);
    console.log(`\n🎉 ¡ADMINISTRADOR CREADO CON ÉXITO!`);
    console.log(`   Proyecto ID: ${serviceAccount.project_id}`);
    console.log(`   Correo: ${adminEmail}`);
    console.log(`   Contraseña: ${adminPassword}`);
  } catch (error) {
    console.error("❌ Error al crear o configurar el administrador:", error);
    process.exit(1);
  }
}

createFirstAdmin();
