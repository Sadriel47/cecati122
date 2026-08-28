import {
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { db, storage } from '../firebase/config';

const COURSES_COLLECTION = 'courses';

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

  const timestamp = Date.now();
  const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const storagePath = `courses/${timestamp}_${cleanFileName}`;
  const storageRef = ref(storage, storagePath);

  const snapshot = await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(snapshot.ref);

  return {
    url: downloadUrl,
    path: storagePath,
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
 * Obtiene todos los cursos desde Firestore, opcionalmente filtrados por categoría.
 * @param {string} [category] - Filtro de categoría
 * @returns {Promise<Array<Object>>}
 */
export async function getCourses(category = 'todos') {
  try {
    const coursesRef = collection(db, COURSES_COLLECTION);
    let q;

    if (category && category !== 'todos') {
      q = query(coursesRef, where('category', '==', category));
    } else {
      q = query(coursesRef);
    }

    const querySnapshot = await getDocs(q);
    const courses = [];
    querySnapshot.forEach((docSnap) => {
      courses.push({ id: docSnap.id, ...docSnap.data() });
    });

    if (!category || category === 'todos') {
      localStorage.setItem('cecati_course_count', courses.length.toString());
    }

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
      category: courseData.category,
      duration: Number(courseData.duration) || 0,
      startDate: courseData.startDate || '',
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
      updatedAt: serverTimestamp(),
    };

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
    if (imageUrl) {
      await deleteCourseImage(imageUrl);
    }

    const docRef = doc(db, COURSES_COLLECTION, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error al eliminar curso de Firestore:", error);
    throw error;
  }
}
