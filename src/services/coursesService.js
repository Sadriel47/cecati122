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
  orderBy, 
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

// Cursos iniciales semilla para sincronización directa en Firestore
export const defaultCourses = [
  {
    id: "informatica",
    title: "Informática",
    category: "tecnologia",
    duration: 240,
    startDate: "15/ENE/2025",
    schedule: "8:00 AM - 2:00 PM",
    requirements: "CURP y acta de nacimiento",
    price: "$1,200 MXN",
    image: "/assets/img/curso-img-1.jpg",
    syllabus: [
      "Sistemas operativos y hardware",
      "Procesadores de texto avanzados",
      "Hojas de cálculo y análisis de datos",
      "Presentaciones profesionales",
      "Bases de datos básicas",
      "Internet y redes sociales",
      "Seguridad informática"
    ],
    profile: "Al finalizar el curso, el alumno será capaz de utilizar eficientemente las herramientas informáticas básicas, crear documentos profesionales, manejar hojas de cálculo, realizar presentaciones y navegar de forma segura en internet para actividades laborales y personales.",
    payments: [
      { date: "01/ENE/2025", title: "Inscripción", desc: "Registro de alumnos y entrega de documentación" },
      { date: "15/ENE/2025", title: "1er Pago ($1,200 MXN)", desc: "Inicio de clases y entrega de accesos" },
      { date: "15/MAR/2025", title: "2do Pago ($1,200 MXN)", desc: "Continuación y desarrollo de proyectos intermedios" },
      { date: "15/MAY/2025", title: "3er Pago ($1,100 MXN)", desc: "Finalización, evaluación práctica y certificación" }
    ]
  },
  {
    id: "confeccion",
    title: "Confección y Preformado de Prendas",
    category: "textil",
    duration: 280,
    startDate: "01/SEP/2025",
    schedule: "3:00 PM - 6:00 PM",
    requirements: "CURP y acta de nacimiento",
    price: "$3,800 MXN",
    image: "/assets/img/curso-img-2.jpg",
    syllabus: [
      "Técnicas de acabados a mano",
      "Máquina recta y overlock",
      "Patronaje sobre medida y sobre talla",
      "Transformación y preformado de prendas para dama",
      "Confección de ropa para niña",
      "Confección de falda y blusa para dama",
      "Confección de pantalón de dama"
    ],
    profile: "El egresado será capaz de confeccionar prendas de vestir siguiendo patrones técnicos, aplicando diversas técnicas de costura y acabados de calidad profesional.",
    payments: [
      { date: "01/SEP/2025", title: "Inscripción", desc: "Registro de alumnos y documentación básica" },
      { date: "24/OCT/2025", title: "1er Pago ($1,300 MXN)", desc: "Inicio de clases presenciales" }
    ]
  }
];

/**
 * Inserta los cursos semilla por defecto en la colección Firestore.
 * @returns {Promise<Array<Object>>}
 */
export async function seedDefaultCoursesToFirestore() {
  if (!db) return defaultCourses;
  try {
    const seeded = [];
    for (const course of defaultCourses) {
      const docRef = doc(db, COURSES_COLLECTION, course.id);
      const payload = {
        ...course,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      await setDoc(docRef, payload, { merge: true });
      seeded.push(payload);
    }
    console.log("Cursos iniciales insertados con éxito en Firestore.");
    return seeded;
  } catch (err) {
    console.error("Error sembrando cursos en Firestore:", err);
    return defaultCourses;
  }
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
 * Deletes a course image from Firebase Storage using its download URL or Storage path.
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
 * Obteins all courses from Firestore, optionally filtered by category.
 * If empty in Firestore, automatically seeds default courses.
 * @param {string} [category] - Optional category filter
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

    // Si la base de datos en Firestore está vacía, sembrar automáticamente los cursos iniciales
    if (courses.length === 0 && (!category || category === 'todos')) {
      return await seedDefaultCoursesToFirestore();
    }

    // Actualizar caché de conteo total si consultó todos
    if (!category || category === 'todos') {
      localStorage.setItem('cecati_course_count', courses.length.toString());
    }

    return courses;
  } catch (error) {
    console.error("Error al obtener cursos desde Firestore:", error);
    throw error;
  }
}

/**
 * Obtiene el total de cursos optimizado con caché local en localStorage.
 * Retorna inmediatamente el conteo guardado y actualiza en segundo plano.
 * @returns {Promise<number>}
 */
export async function getCourseCount() {
  const cachedCount = localStorage.getItem('cecati_course_count');
  
  try {
    const courses = await getCourses('todos');
    const total = courses.length;
    localStorage.setItem('cecati_course_count', total.toString());
    return total;
  } catch (err) {
    if (cachedCount) {
      return parseInt(cachedCount, 10);
    }
    return 35; // Valor por defecto fallback
  }
}

/**
 * Obteins a single course by its Firestore Document ID.
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
    console.error(`Error al obtener el curso ${id}:`, error);
    throw error;
  }
}

/**
 * Saves (Creates or Updates) a course document in Firestore.
 * Optionally uploads a new cover image file to Firebase Storage.
 * @param {Object} courseData 
 * @param {File} [imageFile] - Optional cover image file
 * @returns {Promise<Object>}
 */
export async function saveCourse(courseData, imageFile = null) {
  try {
    let finalImageUrl = courseData.image || '';

    if (imageFile) {
      const uploadRes = await uploadCourseImage(imageFile);
      finalImageUrl = uploadRes.url;
    }

    const payload = {
      title: courseData.title,
      category: courseData.category,
      duration: Number(courseData.duration) || 0,
      startDate: courseData.startDate,
      schedule: courseData.schedule,
      requirements: courseData.requirements || 'CURP y acta de nacimiento',
      price: courseData.price || '$1,200 MXN',
      image: finalImageUrl || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80',
      profile: courseData.profile || '',
      syllabus: courseData.syllabus || [],
      payments: courseData.payments || [],
      updatedAt: serverTimestamp(),
    };

    if (courseData.id) {
      const docRef = doc(db, COURSES_COLLECTION, courseData.id);
      await updateDoc(docRef, payload);
      
      // Actualizar conteo de cursos
      getCourses('todos').catch(() => {});
      return { id: courseData.id, ...payload };
    } else {
      payload.createdAt = serverTimestamp();
      const customId = courseData.title.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      const customDocRef = doc(db, COURSES_COLLECTION, customId || `course_${Date.now()}`);
      await setDoc(customDocRef, payload);

      // Actualizar conteo de cursos en caché
      getCourses('todos').catch(() => {});
      return { id: customDocRef.id, ...payload };
    }
  } catch (error) {
    console.error("Error al guardar el curso en Firestore:", error);
    throw error;
  }
}

/**
 * Deletes a course document from Firestore.
 * @param {string} id 
 * @returns {Promise<boolean>}
 */
export async function deleteCourse(id) {
  try {
    const docRef = doc(db, COURSES_COLLECTION, id);
    await deleteDoc(docRef);

    // Refrescar caché de conteo
    getCourses('todos').catch(() => {});
    return true;
  } catch (error) {
    console.error(`Error al eliminar el curso ${id}:`, error);
    throw error;
  }
}
