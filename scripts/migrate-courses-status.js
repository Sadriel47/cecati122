import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar credenciales del Service Account
const serviceAccountPath = resolve(__dirname, '../serviceAccountKey.json');

if (!existsSync(serviceAccountPath)) {
  console.error("❌ Error Crítico: No se encontró el archivo serviceAccountKey.json en la raíz del proyecto.");
  process.exit(1);
}

const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

// Inicializar Admin SDK
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function migrateCoursesStatus() {
  console.log("🚀 Iniciando migración de estado de cursos en Firestore...");
  
  try {
    const coursesSnapshot = await db.collection('courses').get();
    
    if (coursesSnapshot.empty) {
      console.log("ℹ️ No se encontraron cursos en la colección.");
      return;
    }

    let updatedCount = 0;
    const batch = db.batch();

    coursesSnapshot.forEach((doc) => {
      const data = doc.data();
      // Si el curso no tiene configurado el campo status, le asignamos 'active'
      if (!data.status) {
        batch.update(doc.ref, { status: 'active' });
        updatedCount++;
      }
    });

    if (updatedCount > 0) {
      await batch.commit();
      console.log(`✅ Migración completada exitosamente. Se actualizaron ${updatedCount} cursos a 'active'.`);
    } else {
      console.log("ℹ️ Todos los cursos ya cuentan con el campo 'status'. No se requirieron modificaciones.");
    }
  } catch (error) {
    console.error("❌ Error durante la migración:", error);
    process.exit(1);
  }
}

migrateCoursesStatus();
