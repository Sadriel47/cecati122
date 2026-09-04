import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { compressImage } from '../utils/imageCompressor';

const COURSES_COLLECTION = 'courses';

// Memoria caché para cursos en cliente
let coursesCache = {};
let cacheTimestamps = {};
const CACHE_TTL_MS = 12 * 60 * 1000; // 12 minutos de tiempo de vida (TTL)

export function clearCoursesCache() {
  coursesCache = {};
  cacheTimestamps = {};
}

export const defaultCourses = [];

export async function seedDefaultCoursesToFirestore() {
  return [];
}

/**
 * Uploads a course image file to Firebase Storage.
 * @param {File} file - Image file to upload
 * @returns {Promise<{ url: string, path: string }>}
 */
export async function uploadCourseImage(file) {
  if (!file) return { url: '', path: '' };

  // Optimizar imagen antes de subir
  const optimizedFile = await compressImage(file);
  const timestamp = Date.now();
  const cleanFileName = optimizedFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const storagePath = `courses/${timestamp}_${cleanFileName}`;
  const storageRef = ref(storage, storagePath);

  try {
    const snapshot = await Promise.race([
      uploadBytes(storageRef, optimizedFile),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout de subida de imagen: el servidor tardó demasiado en responder')), 15000))
    ]);
    const downloadUrl = await getDownloadURL(snapshot.ref);

    return {
      url: downloadUrl,
      path: storagePath,
    };
  } catch (error) {
    console.error("Error subiendo imagen:", error);
    throw error;
  }
}

if (typeof window !== 'undefined') {
  window.testUpload = async () => {
    try {
      const fakeFile = new File(['hello'], 'test.png', { type: 'image/png' });
      await uploadCourseImage(fakeFile);
      document.body.setAttribute('data-test-error', 'success');
    } catch (e) {
      document.body.setAttribute('data-test-error', e.toString());
    }
  };
}

/**
 * Deletes a course image from Firebase Storage.
 * @param {string} storagePathOrUrl 
 */
export async function deleteCourseImage(storagePathOrUrl) {
  if (!storagePathOrUrl) return;

  try {
    let imageRef;
    if (storagePathOrUrl.startsWith('gs://') || storagePathOrUrl.startsWith('courses/')) {
      imageRef = ref(storage, storagePathOrUrl);
    } else {
      imageRef = ref(storage, storagePathOrUrl);
    }
    await deleteObject(imageRef);
  } catch (err) {
    console.warn("No se pudo eliminar la imagen de Storage:", err.message);
  }
}

/**
 * Obtiene todos los cursos desde Firestore, opcionalmente filtrados por categoría y/o vista pública.
 * @param {string} [category] - Filtro de categoría
 * @param {boolean} [publicOnly] - Si es true, solo trae cursos activos y limita el resultado
 * @returns {Promise<Array<Object>>}
 */
export async function getCourses(category = 'todos', publicOnly = false) {
  const cacheKey = `${category}_${publicOnly}`;
  const now = Date.now();

  // Retornar desde la caché si el TTL sigue siendo válido
  if (coursesCache[cacheKey] && cacheTimestamps[cacheKey] && (now - cacheTimestamps[cacheKey] < CACHE_TTL_MS)) {
    return coursesCache[cacheKey];
  }

  try {
    const coursesRef = collection(db, COURSES_COLLECTION);
    const constraints = [];

    // Vista pública: Solo activos y limitar la carga inicial para cuidar cuotas
    if (publicOnly) {
      constraints.push(where('status', '==', 'active'));
      constraints.push(limit(24));
    }

    if (category && category !== 'todos') {
      constraints.push(where('category', '==', category));
    }

    const q = query(coursesRef, ...constraints);
    let querySnapshot = await getDocs(q);

    // Fallback de seguridad: si la consulta filtrada pública retorna vacío, reintentar sin status para migración
    if (publicOnly && querySnapshot.empty) {
      const fallbackConstraints = [limit(24)];
      if (category && category !== 'todos') {
        fallbackConstraints.push(where('category', '==', category));
      }
      const fallbackQ = query(coursesRef, ...fallbackConstraints);
      querySnapshot = await getDocs(fallbackQ);
    }

    const courses = [];
    
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      // Migración on-the-fly: si el curso no tiene status, lo actualizamos a 'active'
      if (data.status === undefined) {
        const docRef = doc(db, COURSES_COLLECTION, docSnap.id);
        updateDoc(docRef, { status: 'active' }).catch(err => 
          console.warn(`Error al migrar status para curso ${docSnap.id}:`, err.message)
        );
        data.status = 'active';
      }
      courses.push({ id: docSnap.id, ...data });
    });

    if (!category || category === 'todos') {
      localStorage.setItem('cecati_course_count', courses.length.toString());
    }

    // Almacenar en la caché local
    coursesCache[cacheKey] = courses;
    cacheTimestamps[cacheKey] = now;

    return courses;
  } catch (error) {
    console.error("Error al obtener cursos desde Firestore:", error);
    return [];
  }
}

/**
 * Obtiene el total de cursos desde la base de datos o caché.
 * @returns {Promise<number>}
 */
export async function getCourseCount() {
  const cachedCount = localStorage.getItem('cecati_course_count');

  try {
    const courses = await getCourses('todos');
    const total = courses.length;
    localStorage.setItem('cecati_course_count', total.toString());
    return total;
  } catch {
    if (cachedCount) {
      return parseInt(cachedCount, 10);
    }
    return 0;
  }
}

/**
 * Obtiene un curso específico por su ID.
 * @param {string} id 
 * @returns {Promise<Object|null>}
 */
export async function getCourseById(id) {
  try {
    const docRef = doc(db, COURSES_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error("Error al obtener curso:", error);
    return null;
  }
}

/**
 * Guarda (crea o actualiza) un curso en Firestore.
 * @param {Object} courseData 
 * @param {File|null} [imageFile] 
 * @returns {Promise<Object>}
 */
export async function saveCourse(courseData, imageFile = null) {
  try {
    let imageUrl = courseData.image || '';

    if (imageFile) {
      const uploadResult = await uploadCourseImage(imageFile);
      imageUrl = uploadResult.url;
    }

    const payload = {
      title: courseData.title,
      category: String(courseData.category || 'tecnologia'),
      shift: String(courseData.shift || 'Matutino'),
      instructor: String(courseData.instructor || ''),
      startDate: String(courseData.startDate || ''),
      endDate: courseData.endDate || '',
      formattedPeriod: courseData.formattedPeriod || '',
      schedules: courseData.schedules || [],
      schedule: courseData.schedule || '',
      requirements: courseData.requirements || '',
      price: courseData.price || '$0 MXN',
      image: imageUrl,
      profile: courseData.profile || '',
      syllabus: courseData.syllabus || [],
      payments: courseData.payments || [],
      status: courseData.status || 'active', // Guardar estado por defecto activo
      updatedAt: serverTimestamp(),
    };

    // Invalidar caché
    clearCoursesCache();

    if (courseData.id) {
      const docRef = doc(db, COURSES_COLLECTION, courseData.id);
      await updateDoc(docRef, payload);
      return { id: courseData.id, ...payload };
    } else {
      payload.createdAt = serverTimestamp();
      const docRef = await addDoc(collection(db, COURSES_COLLECTION), payload);
      return { id: docRef.id, ...payload };
    }
  } catch (error) {
    console.error("Error al guardar curso en Firestore:", error);
    throw error;
  }
}

/**
 * Elimina un curso de Firestore.
 * @param {string} id 
 * @param {string} [imageUrl] 
 */
export async function deleteCourse(id, imageUrl = null) {
  try {
    const docRef = doc(db, COURSES_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    let urlToDelete = imageUrl;

    if (docSnap.exists()) {
      const data = docSnap.data();
      // Verificar si contiene imageUrl, storagePath, o image
      urlToDelete = data.image || data.imageUrl || data.storagePath || urlToDelete;
    }

    if (urlToDelete && (urlToDelete.includes('firebasestorage.googleapis.com') || urlToDelete.startsWith('gs://') || urlToDelete.startsWith('courses/'))) {
      try {
        const imageRef = ref(storage, urlToDelete);
        await deleteObject(imageRef);
      } catch (err) {
        console.warn("No se pudo eliminar la imagen de Storage:", err.message);
      }
    }

    // Invalidar caché
    clearCoursesCache();

    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error al eliminar curso de Firestore:", error);
    throw error;
  }
}
