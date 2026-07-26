import { auth, db } from '../firebase/config';
import { 
  getCourses as fetchCoursesFromFirestore, 
  getCourseCount as fetchCountFromFirestore,
  saveCourse as saveCourseToFirestore, 
  deleteCourse as removeCourseFromFirestore
} from './coursesService';

export const checkFirebaseStatus = () => !!db;
export const getFirebaseAuth = () => auth;

export const getCourses = async (category = 'todos') => {
  try {
    return await fetchCoursesFromFirestore(category);
  } catch (err) {
    console.warn("Error al obtener cursos:", err);
    return [];
  }
};

export const getCourseCount = async () => {
  try {
    return await fetchCountFromFirestore();
  } catch (err) {
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
  togglePostStatus,
  seedDefaultPostsToFirestore
} from './postsService';

// Re-exportación de Servicios de Testimonios
export {
  getTestimonials,
  getAllTestimonialsAdmin,
  saveTestimonial,
  deleteTestimonial,
  toggleTestimonialStatus,
  seedDefaultTestimonialsToFirestore
} from './testimonialsService';

// Re-exportación de Servicio de Monitoreo de Almacenamiento
export { calculateStorageUsage } from './storageUsageService';
export { seedDefaultCoursesToFirestore } from './coursesService';




