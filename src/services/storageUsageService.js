import { getCourses } from './coursesService';
import { getAllPostsAdmin } from './postsService';
import { getPreRegistrations } from './registrationService';
import { getAllTestimonialsAdmin } from './testimonialsService';

// Límites oficiales del Plan Gratuito Spark de Firebase
const FIREBASE_SPARK_LIMITS = {
  firestoreMaxBytes: 1 * 1024 * 1024 * 1024, // 1 GB en Bytes (1,073,741,824 bytes)
  storageMaxBytes: 5 * 1024 * 1024 * 1024,   // 5 GB en Bytes (5,368,709,120 bytes)
  dailyReads: 50000,                         // 50,000 lecturas por día
  dailyWrites: 20000,                        // 20,000 escrituras por día
  dailyDeletes: 20000                        // 20,000 eliminaciones por día
};

/**
 * Calcula el tamaño aproximado en bytes de un objeto o cadena JSON.
 */
function getByteSize(data) {
  try {
    const jsonString = JSON.stringify(data);
    return new Blob([jsonString]).size;
  } catch (e) {
    return 0;
  }
}

/**
 * Convierte bytes a formato legible (KB, MB, GB).
 */
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Calcula y retorna el uso estimado de almacenamiento en Firestore y Storage,
 * comparado contra las cuotas del plan Spark gratuito.
 */
export async function calculateStorageUsage() {
  try {
    // 1. Obtener colecciones
    const [courses, posts, registrations, testimonials] = await Promise.all([
      getCourses('todos').catch(() => []),
      getAllPostsAdmin().catch(() => []),
      getPreRegistrations().catch(() => []),
      getAllTestimonialsAdmin().catch(() => [])
    ]);

    // 2. Calcular tamaño total de Firestore (documentos en texto JSON)
    const coursesBytes = getByteSize(courses);
    const postsBytes = getByteSize(posts);
    const registrationsBytes = getByteSize(registrations);
    const testimonialsBytes = getByteSize(testimonials);

    const totalFirestoreBytes = coursesBytes + postsBytes + registrationsBytes + testimonialsBytes;

    // 3. Estimar almacenamiento en Firebase Storage de imágenes subidas
    // Contamos las imágenes que están almacenadas en Firebase Storage (que contienen firebasestorage.googleapis.com)
    let uploadedImagesCount = 0;
    const allItems = [...courses, ...posts, ...testimonials];
    allItems.forEach(item => {
      const img = item.image || item.featuredImage || item.avatar || '';
      if (img.includes('firebasestorage.googleapis.com')) {
        uploadedImagesCount++;
      }
    });

    // Estimación promedio de 850 KB por imagen optimizada subida
    const estimatedImageBytes = uploadedImagesCount * (850 * 1024);

    // 4. Porcentajes de uso contra los límites del plan Spark
    const firestoreUsedPercent = (totalFirestoreBytes / FIREBASE_SPARK_LIMITS.firestoreMaxBytes) * 100;
    const storageUsedPercent = (estimatedImageBytes / FIREBASE_SPARK_LIMITS.storageMaxBytes) * 100;

    const remainingFirestoreBytes = Math.max(0, FIREBASE_SPARK_LIMITS.firestoreMaxBytes - totalFirestoreBytes);
    const remainingStorageBytes = Math.max(0, FIREBASE_SPARK_LIMITS.storageMaxBytes - estimatedImageBytes);

    return {
      firestore: {
        bytes: totalFirestoreBytes,
        formatted: formatBytes(totalFirestoreBytes),
        limitFormatted: '1 GB',
        usedPercentage: firestoreUsedPercent.toFixed(4),
        remainingFormatted: formatBytes(remainingFirestoreBytes),
        counts: {
          courses: courses.length,
          posts: posts.length,
          registrations: registrations.length,
          testimonials: testimonials.length,
          totalDocs: courses.length + posts.length + registrations.length + testimonials.length
        }
      },
      storage: {
        bytes: estimatedImageBytes,
        formatted: formatBytes(estimatedImageBytes),
        limitFormatted: '5 GB',
        usedPercentage: storageUsedPercent.toFixed(2),
        remainingFormatted: formatBytes(remainingStorageBytes),
        imageCount: uploadedImagesCount
      },
      plan: {
        name: 'Spark (Plan Gratuito Oficial)',
        maxFirestore: '1 GB (1,024 MB)',
        maxStorage: '5 GB (5,120 MB)',
        dailyReads: '50,000 lecturas / día',
        dailyWrites: '20,000 escrituras / día',
        dailyDownloads: '1 GB transferencia / día'
      }
    };
  } catch (error) {
    console.error("Error al calcular el almacenamiento:", error);
    return null;
  }
}
