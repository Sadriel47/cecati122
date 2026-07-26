import { useState, useEffect } from 'react';
import { 
  getCourses, 
  saveCourse, 
  deleteCourse, 
  checkFirebaseStatus, 
  getFirebaseAuth,
  calculateStorageUsage
} from '../services/db';
import { 
  getPreRegistrations, 
  updateRegistrationStatus
} from '../services/registrationService';
import { 
  getAllPostsAdmin, 
  savePost as savePostToDb, 
  deletePost as deletePostFromDb, 
  togglePostStatus
} from '../services/db';
import { 
  getAllTestimonialsAdmin, 
  saveTestimonial as saveTestimonialToDb, 
  deleteTestimonial as deleteTestimonialFromDb, 
  toggleTestimonialStatus
} from '../services/db';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';

export default function Admin() {
  const { user: authUser, logout: authLogout, setUser } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [storageInfo, setStorageInfo] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isFirebase, setIsFirebase] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [savingCourse, setSavingCourse] = useState(false);

  // Tab & Leads & Posts & Testimonials state
  const [adminTab, setAdminTab] = useState('courses'); // 'courses' | 'registrations' | 'posts' | 'testimonials'
  const [registrations, setRegistrations] = useState([]);
  const [loadingRegs, setLoadingRegs] = useState(false);

  // Posts / Blog State
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [savingPost, setSavingPost] = useState(false);

  // Post Form State
  const [postTitle, setPostTitle] = useState('');
  const [postExcerpt, setPostExcerpt] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postCategory, setPostCategory] = useState('Noticias Generales');
  const [postImage, setPostImage] = useState('');
  const [postImageFile, setPostImageFile] = useState(null);
  const [postAuthor, setPostAuthor] = useState('Dirección CECATI 122');
  const [postStatus, setPostStatus] = useState('published');
  const [postPinned, setPostPinned] = useState(false);
  const [postPublishedAt, setPostPublishedAt] = useState('');
  const [postTags, setPostTags] = useState('');

  // Testimonials State
  const [testimonials, setTestimonials] = useState([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(false);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(null);
  const [savingTestimonial, setSavingTestimonial] = useState(false);

  // Testimonial Form State
  const [tStudentName, setTStudentName] = useState('');
  const [tRoleOrCourse, setTRoleOrCourse] = useState('');
  const [tTitle, setTTitle] = useState('');
  const [tComment, setTComment] = useState('');
  const [tRating, setTRating] = useState(5);
  const [tStatus, setTStatus] = useState('published');
  const [tAvatar, setTAvatar] = useState('');
  const [tAvatarFile, setTAvatarFile] = useState(null);

  // Search and Filter State
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  
  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('tecnologia');
  const [formDuration, setFormDuration] = useState('');
  const [formStartDate, setFormStartDate] = useState('');
  const [formSchedule, setFormSchedule] = useState('');
  const [formRequirements, setFormRequirements] = useState('CURP y acta de nacimiento');
  const [formPrice, setFormPrice] = useState('$1,200 MXN');
  const [formImage, setFormImage] = useState('');
  const [formImageFile, setFormImageFile] = useState(null);
  const [formProfile, setFormProfile] = useState('');
  const [formSyllabus, setFormSyllabus] = useState(['']);
  const [formPayments, setFormPayments] = useState([{ date: '', title: '', desc: '' }]);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  useEffect(() => {
    document.title = "Administración - CECATI 122";
    const connected = checkFirebaseStatus();
    setIsFirebase(connected);

    if (authUser || localStorage.getItem("cecati_admin_logged") === "true") {
      setIsLoggedIn(true);
      fetchCourses();
      fetchRegistrations();
      fetchPosts();
      fetchTestimonials();
      fetchStorageInfo();
    } else {
      setIsLoggedIn(false);
    }
    setAuthChecking(false);
  }, [authUser]);

  const fetchStorageInfo = async () => {
    try {
      const info = await calculateStorageUsage();
      setStorageInfo(info);
    } catch (err) {
      console.warn("Error al calcular cuotas de almacenamiento:", err);
    }
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = await getCourses();
      setCourses(data);
      fetchStorageInfo();
    } catch (err) {
      showToast("Error cargando la lista de cursos.", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchTestimonials = async () => {
    setLoadingTestimonials(true);
    try {
      const data = await getAllTestimonialsAdmin();
      setTestimonials(data);
    } catch (err) {
      showToast("Error cargando lista de testimonios", "error");
    } finally {
      setLoadingTestimonials(false);
    }
  };

  const openTestimonialModal = (item = null) => {
    setCurrentTestimonial(item);
    setTAvatarFile(null);
    if (item) {
      setTStudentName(item.studentName || '');
      setTRoleOrCourse(item.roleOrCourse || '');
      setTTitle(item.title || '');
      setTComment(item.comment || '');
      setTRating(item.rating || 5);
      setTStatus(item.status || 'published');
      setTAvatar(item.avatar || '');
    } else {
      setTStudentName('');
      setTRoleOrCourse('Alumno de Informática');
      setTTitle('');
      setTComment('');
      setTRating(5);
      setTStatus('published');
      setTAvatar('/assets/img/testimonial-profile-1.png');
    }
    setIsTestimonialModalOpen(true);
  };

  const closeTestimonialModal = () => {
    setIsTestimonialModalOpen(false);
    setCurrentTestimonial(null);
    setTAvatarFile(null);
  };

  const handleSaveTestimonial = async (e) => {
    e.preventDefault();
    setSavingTestimonial(true);

    const testimonialData = {
      studentName: tStudentName,
      roleOrCourse: tRoleOrCourse,
      title: tTitle,
      comment: tComment,
      rating: tRating,
      status: tStatus,
      avatar: tAvatar,
    };

    if (currentTestimonial) {
      testimonialData.id = currentTestimonial.id;
    }

    try {
      await saveTestimonialToDb(testimonialData, tAvatarFile);
      showToast(currentTestimonial ? "Testimonio actualizado con éxito" : "Testimonio creado con éxito");
      closeTestimonialModal();
      fetchTestimonials();
    } catch (err) {
      console.error("Error al guardar testimonio:", err);
      showToast("Error al guardar testimonio", "error");
    } finally {
      setSavingTestimonial(false);
    }
  };

  const handleToggleTestimonialStatus = async (item) => {
    try {
      const newStatus = await toggleTestimonialStatus(item.id, item.status);
      showToast(`Estado cambiado a ${newStatus === 'published' ? 'Publicado' : 'Borrador'}`);
      fetchTestimonials();
    } catch (err) {
      showToast("Error al cambiar estado de testimonio", "error");
    }
  };

  const handleDeleteTestimonial = async (id, name) => {
    if (window.confirm(`¿Estás seguro de eliminar el testimonio de "${name}"?`)) {
      try {
        await deleteTestimonialFromDb(id);
        showToast("Testimonio eliminado con éxito");
        fetchTestimonials();
      } catch (err) {
        showToast("Error al eliminar testimonio", "error");
      }
    }
  };

  const fetchRegistrations = async () => {
    setLoadingRegs(true);
    try {
      const data = await getPreRegistrations();
      setRegistrations(data);
    } catch (err) {
      showToast("Error cargando solicitudes de pre-registro", "error");
    } finally {
      setLoadingRegs(false);
    }
  };

  const fetchPosts = async () => {
    setLoadingPosts(true);
    try {
      const data = await getAllPostsAdmin();
      setPosts(data);
    } catch (err) {
      showToast("Error cargando la lista de noticias", "error");
    } finally {
      setLoadingPosts(false);
    }
  };

  const openPostModal = (post = null) => {
    setCurrentPost(post);
    setPostImageFile(null);
    if (post) {
      setPostTitle(post.title || '');
      setPostExcerpt(post.excerpt || '');
      setPostContent(post.content || '');
      setPostCategory(post.category || 'Noticias Generales');
      setPostImage(post.featuredImage || '');
      setPostAuthor(post.author || 'Dirección CECATI 122');
      setPostStatus(post.status || 'published');
      setPostPinned(Boolean(post.pinned));
      setPostPublishedAt(post.publishedAt || new Date().toISOString().split('T')[0]);
      setPostTags(Array.isArray(post.tags) ? post.tags.join(', ') : post.tags || '');
    } else {
      setPostTitle('');
      setPostExcerpt('');
      setPostContent('');
      setPostCategory('Avisos Importantes');
      setPostImage('');
      setPostAuthor('Dirección CECATI 122');
      setPostStatus('published');
      setPostPinned(false);
      setPostPublishedAt(new Date().toISOString().split('T')[0]);
      setPostTags('Inscripciones, Cursos, CECATI 122');
    }
    setIsPostModalOpen(true);
  };

  const closePostModal = () => {
    setIsPostModalOpen(false);
    setCurrentPost(null);
    setPostImageFile(null);
  };

  const handleSavePost = async (e) => {
    e.preventDefault();
    setSavingPost(true);

    const postData = {
      title: postTitle,
      excerpt: postExcerpt,
      content: postContent,
      category: postCategory,
      featuredImage: postImage,
      author: postAuthor,
      status: postStatus,
      pinned: postPinned,
      publishedAt: postPublishedAt,
      tags: postTags,
    };

    if (currentPost) {
      postData.id = currentPost.id;
    }

    try {
      await savePostToDb(postData, postImageFile);
      showToast(currentPost ? "Noticia actualizada con éxito" : "Noticia publicada con éxito");
      closePostModal();
      fetchPosts();
    } catch (err) {
      console.error("Error al guardar noticia:", err);
      showToast("Error al guardar la noticia", "error");
    } finally {
      setSavingPost(false);
    }
  };

  const handleToggleStatus = async (post) => {
    try {
      const newStatus = await togglePostStatus(post.id, post.status);
      showToast(`Estado cambiado a ${newStatus === 'published' ? 'Publicado' : 'Borrador'}`);
      fetchPosts();
    } catch (err) {
      showToast("Error al cambiar estado de la noticia", "error");
    }
  };

  const handleDeletePost = async (id, title) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar la noticia "${title}"?`)) {
      try {
        await deletePostFromDb(id);
        showToast("Noticia eliminada con éxito");
        fetchPosts();
      } catch (err) {
        showToast("Error al eliminar noticia", "error");
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateRegistrationStatus(id, newStatus);
      showToast(`Estado de solicitud actualizado a ${newStatus}`);
      fetchRegistrations();
    } catch (err) {
      showToast("Error actualizando estado", "error");
    }
  };

  const showToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage('');
    }, 4000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');

    // Acceso Maestro / Emergencia Directo
    if (loginPassword === 'admin122') {
      localStorage.setItem("cecati_admin_logged", "true");
      setUser({
        uid: 'local-admin',
        email: loginEmail || 'admin@cecati122.edu.mx',
        role: 'ADMIN',
      });
      setIsLoggedIn(true);
      fetchCourses();
      showToast("Sesión iniciada con clave maestra");
      return;
    }

    if (isFirebase) {
      const auth = getFirebaseAuth();
      try {
        const cred = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
        setUser({
          uid: cred.user.uid,
          email: cred.user.email,
          role: 'ADMIN',
        });
        setIsLoggedIn(true);
        fetchCourses();
        showToast("Sesión iniciada con Firebase Auth");
      } catch (err) {
        console.error("Error en Firebase Auth:", err);
        const errorDesc = err.code ? `Error Firebase (${err.code}): ${err.message}` : err.message;
        setAuthError(errorDesc || 'Credenciales incorrectas de Firebase. (Puedes usar "admin122")');
      }
    } else {
      setAuthError('Contraseña incorrecta. (Prueba con "admin122")');
    }
  };

  const handleLogout = async () => {
    if (isFirebase) {
      const auth = getFirebaseAuth();
      if (auth) {
        await signOut(auth);
      }
    }
    localStorage.removeItem("cecati_admin_logged");
    authLogout();
    setIsLoggedIn(false);
    showToast("Sesión cerrada");
  };

  // Syllabus list helpers
  const handleAddSyllabusField = () => {
    setFormSyllabus([...formSyllabus, '']);
  };

  const handleRemoveSyllabusField = (index) => {
    const updated = formSyllabus.filter((_, i) => i !== index);
    setFormSyllabus(updated.length > 0 ? updated : ['']);
  };

  const handleSyllabusChange = (index, value) => {
    const updated = [...formSyllabus];
    updated[index] = value;
    setFormSyllabus(updated);
  };

  // Payments helpers
  const handleAddPaymentField = () => {
    setFormPayments([...formPayments, { date: '', title: '', desc: '' }]);
  };

  const handleRemovePaymentField = (index) => {
    const updated = formPayments.filter((_, i) => i !== index);
    setFormPayments(updated.length > 0 ? updated : [{ date: '', title: '', desc: '' }]);
  };

  const handlePaymentChange = (index, field, value) => {
    const updated = [...formPayments];
    updated[index] = { ...updated[index], [field]: value };
    setFormPayments(updated);
  };

  // Open Modal for New/Edit
  const openModal = (course = null) => {
    setCurrentCourse(course);
    setFormImageFile(null);
    if (course) {
      setFormTitle(course.title || '');
      setFormCategory(course.category || 'tecnologia');
      setFormDuration(course.duration || '');
      setFormStartDate(course.startDate || '');
      setFormSchedule(course.schedule || '');
      setFormRequirements(course.requirements || 'CURP y acta de nacimiento');
      setFormPrice(course.price || '$1,200 MXN');
      setFormImage(course.image || '');
      setFormProfile(course.profile || '');
      setFormSyllabus(course.syllabus && course.syllabus.length > 0 ? [...course.syllabus] : ['']);
      setFormPayments(course.payments && course.payments.length > 0 ? [...course.payments] : [{ date: '', title: '', desc: '' }]);
    } else {
      setFormTitle('');
      setFormCategory('tecnologia');
      setFormDuration('');
      setFormStartDate('');
      setFormSchedule('');
      setFormRequirements('CURP y acta de nacimiento');
      setFormPrice('$1,200 MXN');
      setFormImage('');
      setFormProfile('');
      setFormSyllabus(['']);
      setFormPayments([{ date: '', title: '', desc: '' }]);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentCourse(null);
    setFormImageFile(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSavingCourse(true);

    const defaultImg = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80";

    const courseData = {
      title: formTitle,
      category: formCategory,
      duration: parseInt(formDuration) || 0,
      startDate: formStartDate,
      schedule: formSchedule,
      requirements: formRequirements,
      price: formPrice,
      image: formImage || defaultImg,
      profile: formProfile,
      syllabus: formSyllabus.filter(s => s.trim() !== ''),
      payments: formPayments.filter(p => p.date.trim() !== '' && p.title.trim() !== '')
    };

    if (currentCourse) {
      courseData.id = currentCourse.id;
    }

    try {
      await saveCourse(courseData, formImageFile);
      showToast(currentCourse ? "Curso actualizado con éxito" : "Curso creado con éxito");
      closeModal();
      fetchCourses();
    } catch (err) {
      console.error("Error guardando el curso:", err);
      showToast("Error al guardar el curso", "error");
    } finally {
      setSavingCourse(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el curso "${title}"?`)) {
      try {
        await deleteCourse(id);
        showToast("Curso eliminado con éxito");
        fetchCourses();
      } catch (err) {
        showToast("Error al eliminar el curso", "error");
      }
    }
  };

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCourses = courses.length;
  const totalHours = courses.reduce((sum, c) => sum + (c.duration || 0), 0);
  const avgCost = totalCourses > 0 
    ? Math.round(courses.reduce((sum, c) => {
        const val = parseInt(c.price.replace(/[^0-9]/g, '')) || 0;
        return sum + val;
      }, 0) / totalCourses)
    : 0;

  if (authChecking) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
        <div className="text-center space-y-3">
          <i className="ri-loader-4-line ri-spin text-4xl text-cecati block"></i>
          <p className="font-bold text-sm">Verificando credenciales del sistema...</p>
        </div>
      </div>
    );
  }

  // ---------------- LOGIN SCREEN ----------------
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen pt-28 pb-16 px-4 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 space-y-6">
          <div className="text-center space-y-3">
            <img src="/assets/img/logo-cecati.webp" alt="Logo CECATI 122" className="h-16 mx-auto" />
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">Panel Administrativo</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Ingresa tus credenciales para administrar la oferta educativa</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {authError && (
              <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-bold flex items-center gap-2">
                <i className="ri-error-warning-line text-lg shrink-0"></i>
                <span>{authError}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Correo Electrónico</label>
              <input 
                type="email" 
                placeholder="admin@cecati122.edu.mx"
                value={loginEmail} 
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-cecati"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Contraseña</label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={loginPassword} 
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-cecati"
              />
            </div>

            <button 
              type="submit"
              className="w-full py-3.5 rounded-xl bg-cecati hover:bg-cecati-hover text-white font-extrabold text-sm shadow-xl shadow-red-900/30 hover:shadow-red-900/50 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
            >
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ---------------- ADMIN DASHBOARD ----------------
  return (
    <main className="main pt-28 pb-16 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      {/* Toast Alert */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-2xl text-white font-bold text-sm flex items-center gap-2 animate-fade-in ${toastType === 'error' ? 'bg-red-600' : 'bg-emerald-600'}`}>
          <i className={toastType === 'error' ? 'ri-error-warning-line text-lg' : 'ri-checkbox-circle-line text-lg'}></i>
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 space-y-8">
        
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              Panel de Administración de Cursos
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
              <span>Gestiona el catálogo escolar en tiempo real.</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${isFirebase ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400'}`}>
                {isFirebase ? 'Firebase Cloud Active' : 'Local Offline Mode'}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Botón Principal: AGREGAR NUEVO CURSO */}
            <button 
              onClick={() => openModal()}
              className="px-6 py-3 rounded-full bg-cecati hover:bg-cecati-hover text-white font-extrabold text-sm shadow-xl shadow-red-900/30 hover:shadow-red-900/50 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 cursor-pointer"
            >
              <i className="ri-add-circle-fill text-lg"></i>
              <span>+ Agregar Nuevo Curso</span>
            </button>

            <button 
              onClick={handleLogout}
              className="px-4 py-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-red-600 hover:text-white text-gray-700 dark:text-gray-300 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Salir</span>
              <i className="ri-logout-box-r-line"></i>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-md flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-2xl font-bold">
              <i className="ri-book-open-line"></i>
            </div>
            <div>
              <span className="block text-2xl font-black text-gray-900 dark:text-white">{totalCourses}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Cursos Activos</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-md flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl font-bold">
              <i className="ri-time-line"></i>
            </div>
            <div>
              <span className="block text-2xl font-black text-gray-900 dark:text-white">{totalHours} hrs</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Horas de Capacitación</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-md flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center text-2xl font-bold">
              <i className="ri-money-dollar-circle-line"></i>
            </div>
            <div>
              <span className="block text-2xl font-black text-gray-900 dark:text-white">${avgCost} MXN</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Costo Promedio</span>
            </div>
          </div>
        </div>

        {/* Firebase Quota & Storage Monitor Card */}
        {storageInfo && (
          <div className="p-6 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-lg">
                  <i className="ri-database-2-line"></i>
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    Monitor de Almacenamiento y Cuotas de Firebase
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Plan: <strong className="text-gray-800 dark:text-gray-200">{storageInfo.plan.name}</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={fetchStorageInfo}
                className="text-xs font-bold text-cecati hover:underline flex items-center gap-1 cursor-pointer"
              >
                <i className="ri-refresh-line"></i> Actualizar Cuotas
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Meter 1: Firestore Database */}
              <div className="space-y-2 p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700/60">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                    <i className="ri-hard-drive-2-line text-blue-500"></i>
                    Firestore (Base de Datos)
                  </span>
                  <span className="font-mono text-gray-600 dark:text-gray-300">
                    {storageInfo.firestore.formatted} / {storageInfo.firestore.limitFormatted}
                  </span>
                </div>

                <div className="w-full bg-gray-200 dark:bg-gray-600 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.max(1, parseFloat(storageInfo.firestore.usedPercentage))}%` }}
                  ></div>
                </div>

                <div className="flex justify-between items-center text-[11px] text-gray-500 dark:text-gray-400">
                  <span>{storageInfo.firestore.usedPercentage}% utilizado</span>
                  <span>Libre: {storageInfo.firestore.remainingFormatted}</span>
                </div>

                <p className="text-[11px] text-gray-500 dark:text-gray-400 pt-1">
                  Documentos guardados: {storageInfo.firestore.counts.totalDocs} ({storageInfo.firestore.counts.courses} cursos, {storageInfo.firestore.counts.posts} noticias, {storageInfo.firestore.counts.registrations} solicitudes, {storageInfo.firestore.counts.testimonials} testimonios).
                </p>
              </div>

              {/* Meter 2: Firebase Storage (Images) */}
              <div className="space-y-2 p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700/60">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                    <i className="ri-image-line text-emerald-500"></i>
                    Firebase Storage (Imágenes Subidas)
                  </span>
                  <span className="font-mono text-gray-600 dark:text-gray-300">
                    {storageInfo.storage.formatted} / {storageInfo.storage.limitFormatted}
                  </span>
                </div>

                <div className="w-full bg-gray-200 dark:bg-gray-600 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-600 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.max(1, parseFloat(storageInfo.storage.usedPercentage))}%` }}
                  ></div>
                </div>

                <div className="flex justify-between items-center text-[11px] text-gray-500 dark:text-gray-400">
                  <span>{storageInfo.storage.usedPercentage}% utilizado</span>
                  <span>Libre: {storageInfo.storage.remainingFormatted}</span>
                </div>

                <p className="text-[11px] text-gray-500 dark:text-gray-400 pt-1">
                  Imágenes almacenadas en la nube: {storageInfo.storage.imageCount} archivos.
                </p>
              </div>
            </div>

            {/* Spark Plan Daily Operations Summary */}
            <div className="p-3.5 rounded-2xl bg-blue-500/5 border border-blue-500/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <i className="ri-information-line text-blue-500 text-base shrink-0"></i>
                <span>
                  <strong>Cuotas Diarias del Plan Spark:</strong> {storageInfo.plan.dailyReads} | {storageInfo.plan.dailyWrites} | {storageInfo.plan.dailyDownloads}
                </span>
              </div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full whitespace-nowrap">
                Estado del Servidor: Óptimo
              </span>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2 overflow-x-auto">
          <button
            onClick={() => setAdminTab('courses')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${adminTab === 'courses' ? 'bg-cecati text-white shadow-lg' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300'}`}
          >
            <i className="ri-book-open-line"></i>
            <span>Catálogo de Cursos ({totalCourses})</span>
          </button>

          <button
            onClick={() => setAdminTab('registrations')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${adminTab === 'registrations' ? 'bg-cecati text-white shadow-lg' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300'}`}
          >
            <i className="ri-user-add-line"></i>
            <span>Solicitudes de Pre-registro ({registrations.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('posts')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${adminTab === 'posts' ? 'bg-cecati text-white shadow-lg' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300'}`}
          >
            <i className="ri-newspaper-line"></i>
            <span>Noticias / Blog ({posts.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('testimonials')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${adminTab === 'testimonials' ? 'bg-cecati text-white shadow-lg' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300'}`}
          >
            <i className="ri-chat-quote-line"></i>
            <span>Testimonios ({testimonials.length})</span>
          </button>
        </div>

        {/* TAB 1: CATÁLOGO DE CURSOS */}
        {adminTab === 'courses' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-xl space-y-6 animate-fade-in">
            {/* Table Header Filter Row */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">
                  Listado de Cursos del Catálogo
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Visualiza, crea, edita o elimina cursos en tiempo real sincronizados con la nube.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <div className="relative w-full sm:w-64">
                  <input 
                    type="text" 
                    placeholder="Buscar por título o categoría..."
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-cecati"
                  />
                  <i className="ri-search-line absolute left-3.5 top-3 text-gray-400 text-base"></i>
                </div>
              </div>
            </div>

            {/* Courses Table */}
            {loading ? (
              <div className="text-center py-12 space-y-3">
                <i className="ri-loader-4-line ri-spin text-3xl text-cecati block"></i>
                <p className="text-sm text-gray-500">Actualizando lista de cursos...</p>
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="text-center py-12 space-y-3 text-gray-500 dark:text-gray-400">
                <i className="ri-folder-open-line text-4xl block"></i>
                <p className="text-sm font-medium">No se encontraron cursos registrados.</p>
                <button 
                  onClick={() => openModal()}
                  className="px-5 py-2.5 rounded-full bg-cecati text-white text-xs font-bold hover:bg-cecati-hover transition-colors inline-flex items-center gap-1.5"
                >
                  <i className="ri-add-line"></i> Crear Primer Curso
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">
                      <th className="py-3 px-2">Portada</th>
                      <th className="py-3 px-2">Título del Curso</th>
                      <th className="py-3 px-2">Categoría</th>
                      <th className="py-3 px-2">Duración</th>
                      <th className="py-3 px-2">Inversión</th>
                      <th className="py-3 px-2">Inicio</th>
                      <th className="py-3 px-2 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60 text-gray-700 dark:text-gray-300">
                    {filteredCourses.map((course) => (
                      <tr key={course.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                        <td className="py-3 px-2">
                          <img src={course.image} alt={course.title} className="w-14 h-10 object-cover rounded-lg border border-gray-200 dark:border-gray-700" />
                        </td>
                        <td className="py-3 px-2 font-bold text-gray-900 dark:text-white">{course.title}</td>
                        <td className="py-3 px-2 capitalize">{course.category}</td>
                        <td className="py-3 px-2">{course.duration} hrs</td>
                        <td className="py-3 px-2 font-extrabold text-emerald-600 dark:text-emerald-400">{course.price}</td>
                        <td className="py-3 px-2">{course.startDate}</td>
                        <td className="py-3 px-2 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => openModal(course)}
                              className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition-colors font-bold text-xs flex items-center gap-1 cursor-pointer"
                            >
                              <i className="ri-edit-line"></i> Editar
                            </button>
                            <button 
                              onClick={() => handleDelete(course.id, course.title)}
                              className="p-2 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white transition-colors font-bold text-xs flex items-center gap-1 cursor-pointer"
                            >
                              <i className="ri-delete-bin-line"></i> Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SOLICITUDES DE PRE-REGISTRO */}
        {adminTab === 'registrations' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-xl space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">
                  Aspirantes y Solicitudes de Pre-registro
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Gestiona el estatus de las solicitudes enviadas por los alumnos desde la página web.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={fetchRegistrations}
                  className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-refresh-line text-sm"></i> Actualizar
                </button>
              </div>
            </div>

            {loadingRegs ? (
              <div className="text-center py-12 space-y-3">
                <i className="ri-loader-4-line ri-spin text-3xl text-cecati block"></i>
                <p className="text-sm text-gray-500">Cargando solicitudes de prospectos...</p>
              </div>
            ) : registrations.length === 0 ? (
              <div className="text-center py-12 space-y-3 text-gray-500 dark:text-gray-400">
                <i className="ri-inbox-line text-4xl block"></i>
                <p className="text-sm font-medium">Aún no hay solicitudes de pre-registro recibidas.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">
                      <th className="py-3 px-2">Nombre del Aspirante</th>
                      <th className="py-3 px-2">Curso Solicitado</th>
                      <th className="py-3 px-2">Teléfono / WhatsApp</th>
                      <th className="py-3 px-2">Correo</th>
                      <th className="py-3 px-2">Estado</th>
                      <th className="py-3 px-2 text-right">Contacto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60 text-gray-700 dark:text-gray-300">
                    {registrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                        <td className="py-3 px-2 font-bold text-gray-900 dark:text-white">{reg.fullName}</td>
                        <td className="py-3 px-2 text-cecati font-bold">{reg.courseTitle}</td>
                        <td className="py-3 px-2 font-mono">{reg.phone}</td>
                        <td className="py-3 px-2">{reg.email || 'N/A'}</td>
                        <td className="py-3 px-2">
                          <select 
                            value={reg.status || 'PENDIENTE'}
                            onChange={(e) => handleStatusChange(reg.id, e.target.value)}
                            className={`px-2.5 py-1 rounded-full text-xs font-extrabold border-0 cursor-pointer ${
                              reg.status === 'INSCRITO' 
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' 
                                : reg.status === 'CONTACTADO' 
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' 
                                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                            }`}
                          >
                            <option value="PENDIENTE">Pendiente</option>
                            <option value="CONTACTADO">Contactado</option>
                            <option value="INSCRITO">Inscrito</option>
                          </select>
                        </td>
                        <td className="py-3 px-2 text-right">
                          <a 
                            href={`https://wa.me/52${reg.phone.replace(/[^0-9]/g, '')}?text=Hola%20${encodeURIComponent(reg.fullName)},%20te%20contactamos%20del%20CECATI%20122%20con%20relación%20a%20tu%20pre-registro%20para%20el%20curso%20de%20${encodeURIComponent(reg.courseTitle)}.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE57] text-white font-bold text-xs shadow transition-colors"
                          >
                            <i className="ri-whatsapp-line text-sm"></i>
                            <span>WhatsApp</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: GESTIÓN DE NOTICIAS Y BLOG */}
        {adminTab === 'posts' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-xl space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">
                  Noticias y Avisos Institucionales
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Publica comunicados, convocatorias, eventos y noticias del CECATI 122.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openPostModal()}
                  className="px-5 py-2.5 rounded-full bg-cecati hover:bg-cecati-hover text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-add-line text-base"></i> Redactar Nueva Noticia
                </button>
              </div>
            </div>

            {loadingPosts ? (
              <div className="text-center py-12 space-y-3">
                <i className="ri-loader-4-line ri-spin text-3xl text-cecati block"></i>
                <p className="text-sm text-gray-500">Cargando publicaciones del blog...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12 space-y-3 text-gray-500 dark:text-gray-400">
                <i className="ri-newspaper-line text-4xl block"></i>
                <p className="text-sm font-medium">Aún no hay noticias creadas en el sistema.</p>
                <button
                  onClick={() => openPostModal()}
                  className="px-5 py-2.5 rounded-full bg-cecati text-white text-xs font-bold hover:bg-cecati-hover transition-colors inline-flex items-center gap-1.5"
                >
                  <i className="ri-add-line"></i> Crear Primera Noticia
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">
                      <th className="py-3 px-2">Imagen</th>
                      <th className="py-3 px-2">Título de la Noticia</th>
                      <th className="py-3 px-2">Categoría</th>
                      <th className="py-3 px-2">Autor</th>
                      <th className="py-3 px-2">Fecha</th>
                      <th className="py-3 px-2">Estado</th>
                      <th className="py-3 px-2 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60 text-gray-700 dark:text-gray-300">
                    {posts.map((post) => (
                      <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                        <td className="py-3 px-2">
                          <img src={post.featuredImage} alt={post.title} className="w-14 h-10 object-cover rounded-lg border border-gray-200 dark:border-gray-700" />
                        </td>
                        <td className="py-3 px-2">
                          <div className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            {post.pinned && (
                              <span className="text-amber-500 text-xs" title="Noticia Destacada / Fijada">
                                <i className="ri-pushpin-fill"></i>
                              </span>
                            )}
                            <span className="line-clamp-1">{post.title}</span>
                          </div>
                          <span className="text-[11px] text-gray-400 line-clamp-1">{post.excerpt}</span>
                        </td>
                        <td className="py-3 px-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                            {post.category}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-xs">{post.author}</td>
                        <td className="py-3 px-2 text-xs font-mono">{post.publishedAt}</td>
                        <td className="py-3 px-2">
                          <button
                            onClick={() => handleToggleStatus(post)}
                            className={`px-3 py-1 rounded-full text-[11px] font-extrabold cursor-pointer transition-all ${
                              post.status === 'published'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 hover:bg-emerald-200'
                                : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-300'
                            }`}
                            title="Haz clic para cambiar estado"
                          >
                            {post.status === 'published' ? 'Publicado' : 'Borrador'}
                          </button>
                        </td>
                        <td className="py-3 px-2 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => openPostModal(post)}
                              className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition-colors font-bold text-xs flex items-center gap-1 cursor-pointer"
                            >
                              <i className="ri-edit-line"></i> Editar
                            </button>
                            <button 
                              onClick={() => handleDeletePost(post.id, post.title)}
                              className="p-2 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white transition-colors font-bold text-xs flex items-center gap-1 cursor-pointer"
                            >
                              <i className="ri-delete-bin-line"></i> Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: GESTIÓN DE TESTIMONIOS */}
        {adminTab === 'testimonials' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-xl space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">
                  Testimonios Reales de Estudiantes
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Administra las opiniones, casos de éxito y experiencias de egresados que se muestran en el sitio principal.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openTestimonialModal()}
                  className="px-5 py-2.5 rounded-full bg-cecati hover:bg-cecati-hover text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-add-line text-base"></i> Agregar Testimonio
                </button>
              </div>
            </div>

            {loadingTestimonials ? (
              <div className="text-center py-12 space-y-3">
                <i className="ri-loader-4-line ri-spin text-3xl text-cecati block"></i>
                <p className="text-sm text-gray-500">Cargando testimonios de alumnos...</p>
              </div>
            ) : testimonials.length === 0 ? (
              <div className="text-center py-12 space-y-3 text-gray-500 dark:text-gray-400">
                <i className="ri-chat-quote-line text-4xl block"></i>
                <p className="text-sm font-medium">Aún no hay testimonios registrados en el sistema.</p>
                <button
                  onClick={() => openTestimonialModal()}
                  className="px-5 py-2.5 rounded-full bg-cecati text-white text-xs font-bold hover:bg-cecati-hover transition-colors inline-flex items-center gap-1.5"
                >
                  <i className="ri-add-line"></i> Crear Primer Testimonio
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">
                      <th className="py-3 px-2">Avatar</th>
                      <th className="py-3 px-2">Estudiante</th>
                      <th className="py-3 px-2">Especialidad / Rol</th>
                      <th className="py-3 px-2">Calificación</th>
                      <th className="py-3 px-2">Testimonio</th>
                      <th className="py-3 px-2">Estado</th>
                      <th className="py-3 px-2 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60 text-gray-700 dark:text-gray-300">
                    {testimonials.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                        <td className="py-3 px-2">
                          <img 
                            src={item.avatar || "/assets/img/testimonial-profile-1.png"} 
                            alt={item.studentName} 
                            className="w-10 h-10 object-cover rounded-full ring-2 ring-cecati/30" 
                          />
                        </td>
                        <td className="py-3 px-2 font-bold text-gray-900 dark:text-white">
                          {item.studentName}
                        </td>
                        <td className="py-3 px-2 text-xs text-gray-500 dark:text-gray-400">
                          {item.roleOrCourse}
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex text-amber-400 gap-0.5 text-xs">
                            {Array.from({ length: item.rating || 5 }).map((_, i) => (
                              <i key={i} className="ri-star-fill"></i>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-2 max-w-xs">
                          {item.title && <div className="font-bold text-xs text-gray-800 dark:text-gray-200">"{item.title}"</div>}
                          <div className="text-[11px] text-gray-500 line-clamp-2">{item.comment}</div>
                        </td>
                        <td className="py-3 px-2">
                          <button
                            onClick={() => handleToggleTestimonialStatus(item)}
                            className={`px-3 py-1 rounded-full text-[11px] font-extrabold cursor-pointer transition-all ${
                              item.status === 'published'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 hover:bg-emerald-200'
                                : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-300'
                            }`}
                            title="Haz clic para cambiar visibilidad"
                          >
                            {item.status === 'published' ? 'Publicado' : 'Borrador'}
                          </button>
                        </td>
                        <td className="py-3 px-2 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => openTestimonialModal(item)}
                              className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition-colors font-bold text-xs flex items-center gap-1 cursor-pointer"
                            >
                              <i className="ri-edit-line"></i> Editar
                            </button>
                            <button 
                              onClick={() => handleDeleteTestimonial(item.id, item.studentName)}
                              className="p-2 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white transition-colors font-bold text-xs flex items-center gap-1 cursor-pointer"
                            >
                              <i className="ri-delete-bin-line"></i> Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ---------------- TESTIMONIAL EDITOR MODAL ---------------- */}
      {isTestimonialModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col max-h-[92vh] my-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cecati text-white flex items-center justify-center font-bold">
                  <i className={currentTestimonial ? 'ri-edit-line' : 'ri-chat-quote-line'}></i>
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">
                  {currentTestimonial ? `Editar Testimonio: ${currentTestimonial.studentName}` : 'Agregar Nuevo Testimonio de Alumno'}
                </h3>
              </div>

              <button 
                onClick={closeTestimonialModal}
                className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 text-gray-700 dark:text-gray-300 flex items-center justify-center transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-lg"></i>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveTestimonial} className="p-6 overflow-y-auto space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nombre del Estudiante */}
                <div className="space-y-1">
                  <label className="font-bold text-gray-900 dark:text-white text-xs">Nombre Completo del Estudiante</label>
                  <input 
                    type="text" 
                    placeholder="Ej. María Hernández"
                    value={tStudentName}
                    onChange={(e) => setTStudentName(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-cecati"
                  />
                </div>

                {/* Rol o Curso */}
                <div className="space-y-1">
                  <label className="font-bold text-gray-900 dark:text-white text-xs">Curso / Estatus (Ej. Egresada de Confección)</label>
                  <input 
                    type="text" 
                    placeholder="Ej. Egresada de Confección / Alumno de Informática"
                    value={tRoleOrCourse}
                    onChange={(e) => setTRoleOrCourse(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-cecati"
                  />
                </div>

                {/* Título Resumen */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-gray-900 dark:text-white text-xs">Título / Frase Destacada</label>
                  <input 
                    type="text" 
                    placeholder="Ej. 'Abrí mi propio taller de costura' o 'Conseguí empleo formal'"
                    value={tTitle}
                    onChange={(e) => setTTitle(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-cecati"
                  />
                </div>

                {/* Calificación (Estrellas) */}
                <div className="space-y-1">
                  <label className="font-bold text-gray-900 dark:text-white text-xs">Calificación (Estrellas)</label>
                  <select
                    value={tRating}
                    onChange={(e) => setTRating(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-cecati"
                  >
                    <option value={5}>5 Estrellas (Excelente)</option>
                    <option value={4}>4 Estrellas (Bueno)</option>
                    <option value={3}>3 Estrellas (Regular)</option>
                  </select>
                </div>

                {/* Estado */}
                <div className="space-y-1">
                  <label className="font-bold text-gray-900 dark:text-white text-xs">Estado de Publicación</label>
                  <select
                    value={tStatus}
                    onChange={(e) => setTStatus(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-cecati"
                  >
                    <option value="published">Publicado (Visible en Inicio)</option>
                    <option value="draft">Borrador (Privado)</option>
                  </select>
                </div>
              </div>

              {/* Foto de Perfil / Avatar */}
              <div className="space-y-1">
                <label className="font-bold text-gray-900 dark:text-white text-xs flex items-center gap-1.5">
                  <i className="ri-user-smile-line text-cecati"></i>
                  <span>Foto de Perfil del Alumno (Subir imagen o URL)</span>
                </label>
                <div className="flex items-center gap-2">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setTAvatarFile(e.target.files[0] || null)}
                    className="text-xs file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-cecati file:text-white hover:file:bg-cecati-hover cursor-pointer"
                  />
                </div>
                <input 
                  type="text" 
                  placeholder="O usa ruta local / URL (ej. /assets/img/testimonial-profile-1.png)"
                  value={tAvatar}
                  onChange={(e) => setTAvatar(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-xs mt-1"
                />
              </div>

              {/* Comentario / Testimonio Completo */}
              <div className="space-y-1">
                <label className="font-bold text-gray-900 dark:text-white text-xs">Testimonio / Opinión Completa</label>
                <textarea 
                  placeholder="Escribe la experiencia del alumno con sus propias palabras..."
                  value={tComment}
                  onChange={(e) => setTComment(e.target.value)}
                  rows="4"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-cecati"
                />
              </div>

              {/* Modal Actions Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button 
                  type="button" 
                  onClick={closeTestimonialModal} 
                  className="px-5 py-2.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                
                <button 
                  type="submit"
                  disabled={savingTestimonial}
                  className="px-7 py-2.5 rounded-full bg-cecati hover:bg-cecati-hover text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-red-900/30 hover:shadow-red-900/50 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex items-center gap-2"
                >
                  {savingTestimonial ? (
                    <>
                      <i className="ri-loader-4-line ri-spin"></i>
                      <span>Guardando Testimonio...</span>
                    </>
                  ) : (
                    <>
                      <i className="ri-save-line"></i>
                      <span>{currentTestimonial ? 'Guardar Cambios' : 'Publicar Testimonio'}</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ---------------- POST / NEWS EDITOR MODAL ---------------- */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-3xl bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col max-h-[92vh] my-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cecati text-white flex items-center justify-center font-bold">
                  <i className={currentPost ? 'ri-edit-line' : 'ri-newspaper-line'}></i>
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">
                  {currentPost ? `Editar Noticia: ${currentPost.title}` : 'Redactar Nueva Noticia / Aviso'}
                </h3>
              </div>

              <button 
                onClick={closePostModal}
                className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 text-gray-700 dark:text-gray-300 flex items-center justify-center transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-lg"></i>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSavePost} className="p-6 overflow-y-auto space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Título */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-gray-900 dark:text-white text-xs">Título de la Noticia / Aviso</label>
                  <input 
                    type="text" 
                    placeholder="Ej. Inicio de Inscripciones para el Próximo Trimestre 2026..."
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-cecati"
                  />
                </div>

                {/* Categoría */}
                <div className="space-y-1">
                  <label className="font-bold text-gray-900 dark:text-white text-xs">Categoría</label>
                  <select
                    value={postCategory}
                    onChange={(e) => setPostCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-cecati"
                  >
                    <option value="Avisos Importantes">Avisos Importantes</option>
                    <option value="Noticias Generales">Noticias Generales</option>
                    <option value="Eventos y Actividades">Eventos y Actividades</option>
                    <option value="Logros y Reconocimientos">Logros y Reconocimientos</option>
                  </select>
                </div>

                {/* Autor */}
                <div className="space-y-1">
                  <label className="font-bold text-gray-900 dark:text-white text-xs">Autor / Departamento</label>
                  <input 
                    type="text" 
                    placeholder="Ej. Dirección CECATI 122 / Servicios Escolares"
                    value={postAuthor}
                    onChange={(e) => setPostAuthor(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-cecati"
                  />
                </div>

                {/* Estado */}
                <div className="space-y-1">
                  <label className="font-bold text-gray-900 dark:text-white text-xs">Estado de Publicación</label>
                  <select
                    value={postStatus}
                    onChange={(e) => setPostStatus(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-cecati"
                  >
                    <option value="published">Publicado (Visible en la web)</option>
                    <option value="draft">Borrador (Privado)</option>
                  </select>
                </div>

                {/* Fecha */}
                <div className="space-y-1">
                  <label className="font-bold text-gray-900 dark:text-white text-xs">Fecha de Publicación</label>
                  <input 
                    type="date"
                    value={postPublishedAt}
                    onChange={(e) => setPostPublishedAt(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-cecati"
                  />
                </div>
              </div>

              {/* Fijar Aviso Checkbox */}
              <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <i className="ri-pushpin-fill text-amber-500 text-lg"></i>
                  <div>
                    <p className="text-xs font-bold text-gray-900 dark:text-white">Fijar al Inicio como Aviso Principal</p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">Aparecerá destacado en la parte superior del Blog</p>
                  </div>
                </div>
                <input 
                  type="checkbox"
                  checked={postPinned}
                  onChange={(e) => setPostPinned(e.target.checked)}
                  className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                />
              </div>

              {/* Resumen / Excerpt */}
              <div className="space-y-1">
                <label className="font-bold text-gray-900 dark:text-white text-xs">Resumen Corto (Aparece en la tarjeta)</label>
                <textarea 
                  placeholder="Breve resumen de 2 o 3 líneas que invite a leer el artículo..."
                  value={postExcerpt}
                  onChange={(e) => setPostExcerpt(e.target.value)}
                  rows="2"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-cecati"
                />
              </div>

              {/* Subida de Imagen de Portada */}
              <div className="space-y-1">
                <label className="font-bold text-gray-900 dark:text-white text-xs flex items-center gap-1.5">
                  <i className="ri-image-line text-cecati"></i>
                  <span>Imagen de Portada (Subir archivo o URL)</span>
                </label>
                <div className="flex items-center gap-2">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setPostImageFile(e.target.files[0] || null)}
                    className="text-xs file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-cecati file:text-white hover:file:bg-cecati-hover cursor-pointer"
                  />
                </div>
                <input 
                  type="text" 
                  placeholder="O pega una URL de imagen externa (https://...)"
                  value={postImage}
                  onChange={(e) => setPostImage(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-xs mt-1"
                />
              </div>

              {/* Contenido Extenso */}
              <div className="space-y-1">
                <label className="font-bold text-gray-900 dark:text-white text-xs">Cuerpo de la Noticia / Contenido Completo</label>
                <textarea 
                  placeholder="Escribe el contenido completo de la noticia. Puedes usar párrafos y subtítulos con '### Subtítulo'..."
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  rows="6"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-cecati"
                />
              </div>

              {/* Tags */}
              <div className="space-y-1">
                <label className="font-bold text-gray-900 dark:text-white text-xs">Etiquetas (Separadas por coma)</label>
                <input 
                  type="text" 
                  placeholder="Ej. Inscripciones, SEP, Cursos, CECATI 122"
                  value={postTags}
                  onChange={(e) => setPostTags(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-xs"
                />
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button 
                  type="button" 
                  onClick={closePostModal} 
                  className="px-5 py-2.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                
                <button 
                  type="submit"
                  disabled={savingPost}
                  className="px-7 py-2.5 rounded-full bg-cecati hover:bg-cecati-hover text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-red-900/30 hover:shadow-red-900/50 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex items-center gap-2"
                >
                  {savingPost ? (
                    <>
                      <i className="ri-loader-4-line ri-spin"></i>
                      <span>Guardando Noticia...</span>
                    </>
                  ) : (
                    <>
                      <i className="ri-save-line"></i>
                      <span>{currentPost ? 'Guardar Cambios' : 'Publicar Noticia'}</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ---------------- COURSE EDITOR MODAL (Cloud Storage Image Upload Support) ---------------- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col max-h-[92vh] my-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cecati text-white flex items-center justify-center font-bold">
                  <i className={currentCourse ? 'ri-edit-line' : 'ri-add-line'}></i>
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">
                  {currentCourse ? `Editar Curso: ${currentCourse.title}` : 'Agregar Nuevo Curso al Catálogo'}
                </h3>
              </div>

              <button 
                onClick={closeModal} 
                className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-red-600 hover:text-white text-gray-700 dark:text-gray-300 transition-colors flex items-center justify-center text-lg cursor-pointer"
              >
                <i className="ri-close-line"></i>
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSave} className="p-6 sm:p-8 overflow-y-auto space-y-6 text-gray-700 dark:text-gray-300 text-xs sm:text-sm">
              
              {/* General Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-900 dark:text-white">Título del Curso *</label>
                  <input 
                    type="text" 
                    placeholder="Ej. Informática Avanzada"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-cecati"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-900 dark:text-white">Categoría *</label>
                  <select 
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-cecati"
                  >
                    <option value="tecnologia">Tecnología</option>
                    <option value="textil">Textil</option>
                    <option value="gastronomia">Gastronomía</option>
                    <option value="administracion">Administración</option>
                    <option value="automotriz">Automotriz</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-900 dark:text-white">Costo de Inversión *</label>
                  <input 
                    type="text" 
                    placeholder="Ej. $1,200 MXN"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-cecati"
                  />
                </div>
              </div>

              {/* Duration / Schedule / Start */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-900 dark:text-white">Duración (Horas) *</label>
                  <input 
                    type="number" 
                    placeholder="Ej. 240"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-cecati"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-900 dark:text-white">Fecha de Inicio *</label>
                  <input 
                    type="text" 
                    placeholder="Ej. 15/ENE/2026"
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-cecati"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-900 dark:text-white">Horario *</label>
                  <input 
                    type="text" 
                    placeholder="Ej. 8:00 AM - 2:00 PM"
                    value={formSchedule}
                    onChange={(e) => setFormSchedule(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-cecati"
                  />
                </div>
              </div>

              {/* Requirements & Image (Cloud Storage Upload + URL Option) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-900 dark:text-white">Requisitos de Ingreso</label>
                  <input 
                    type="text" 
                    placeholder="Ej. CURP y acta de nacimiento"
                    value={formRequirements}
                    onChange={(e) => setFormRequirements(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-cecati"
                  />
                </div>

                {/* Subida de Imagen a Firebase Storage */}
                <div className="space-y-1">
                  <label className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                    <i className="ri-upload-cloud-2-line text-cecati"></i>
                    <span>Imagen de Portada (Firebase Storage / URL)</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setFormImageFile(e.target.files[0] || null)}
                      className="text-xs file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-cecati file:text-white hover:file:bg-cecati-hover cursor-pointer"
                    />
                  </div>
                  <input 
                    type="text" 
                    placeholder="O pega una URL externa (https://...)"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-xs mt-1"
                  />
                </div>
              </div>

              {/* Perfil de Egreso */}
              <div className="space-y-1">
                <label className="font-bold text-gray-900 dark:text-white">Perfil de Egreso / ¿Qué aprenderá el alumno?</label>
                <textarea 
                  placeholder="Describe las competencias profesionales obtenidas al finalizar el curso..."
                  value={formProfile}
                  onChange={(e) => setFormProfile(e.target.value)}
                  rows="3"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-cecati"
                />
              </div>

              {/* Temario (Syllabus) Builder */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-gray-900 dark:text-white">Temario / Lista de Módulos</label>
                  <button 
                    type="button" 
                    onClick={handleAddSyllabusField}
                    className="px-3 py-1 rounded-full bg-cecati text-white text-xs font-bold hover:bg-cecati-hover transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <i className="ri-add-line"></i> Agregar Tema
                  </button>
                </div>

                <div className="space-y-2">
                  {formSyllabus.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input 
                        type="text" 
                        placeholder={`Módulo ${idx + 1}...`}
                        value={item}
                        onChange={(e) => handleSyllabusChange(idx, e.target.value)}
                        className="flex-1 px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-xs"
                      />
                      {formSyllabus.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => handleRemoveSyllabusField(idx)}
                          className="p-2 text-red-500 hover:text-red-700 transition-colors"
                        >
                          <i className="ri-delete-bin-line text-base"></i>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button 
                  type="button" 
                  onClick={closeModal} 
                  className="px-5 py-2.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                
                <button 
                  type="submit"
                  disabled={savingCourse}
                  className="px-7 py-2.5 rounded-full bg-cecati hover:bg-cecati-hover text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-red-900/30 hover:shadow-red-900/50 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex items-center gap-2"
                >
                  {savingCourse ? (
                    <>
                      <i className="ri-loader-4-line ri-spin"></i>
                      <span>Guardando en Firebase...</span>
                    </>
                  ) : (
                    <>
                      <i className="ri-save-line"></i>
                      <span>{currentCourse ? 'Guardar Cambios' : 'Guardar y Publicar Curso'}</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </main>
  );
}
