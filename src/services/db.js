import { auth, db } from '../firebase/config';
import { 
  getCourses as fetchCoursesFromFirestore, 
  getCourseCount as fetchCountFromFirestore,
  getCourseById as fetchCourseByIdFromFirestore,
  saveCourse as saveCourseToFirestore, 
  deleteCourse as removeCourseFromFirestore
} from './coursesService';

export const checkFirebaseStatus = () => !!db;
export const getFirebaseAuth = () => auth;

export const getCourses = async (category = 'todos', publicOnly = false) => {
  try {
    return await fetchCoursesFromFirestore(category, publicOnly);
  } catch (err) {
    console.warn("Error al obtener cursos:", err);
    return [];
  }
};

export const getCourseById = async (id) => {
  try {
    return await fetchCourseByIdFromFirestore(id);
  } catch (err) {
    console.warn("Error al obtener detalle del curso:", err);
    return null;
  }
};

export const getCourseCount = async () => {
  try {
    return await fetchCountFromFirestore();
  } catch {
    const cached = localStorage.getItem('cecati_course_count');
    return cached ? parseInt(cached, 10) : 0;
  }
};

export const saveCourse = async (course, imageFile = null) => {
  return await saveCourseToFirestore(course, imageFile);
};

export const deleteCourse = async (id, imageUrl = null) => {
  return await removeCourseFromFirestore(id, imageUrl);
};

// Re-exportación de Servicios de Blog y Noticias
export { 
  getPosts, 
  getAllPostsAdmin, 
  getPostByIdOrSlug, 
  savePost, 
  deletePost, 
  deleteNews,
  togglePostStatus
} from './postsService';

// Re-exportación de Servicios de Testimonios
export {
  getTestimonials,
  getAllTestimonialsAdmin,
  saveTestimonial,
  deleteTestimonial,
  toggleTestimonialStatus
} from './testimonialsService';

// Re-exportación de Servicio de Monitoreo de Almacenamiento
export { calculateStorageUsage } from './storageUsageService';
