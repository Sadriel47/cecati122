import { useState, useCallback } from 'react';
import { useAdminData } from '../hooks/useAdminData';
import { useCourses } from '../hooks/useCourses';
import { AdminHeaderStats } from '../components/admin/AdminHeaderStats';
import { FirebaseQuotaMonitor } from '../components/admin/FirebaseQuotaMonitor';
import { CoursesTab } from '../components/admin/tabs/CoursesTab';
import { PreRegistrationsTab } from '../components/admin/tabs/PreRegistrationsTab';
import { NewsTab } from '../components/admin/tabs/NewsTab';
import { TestimonialsTab } from '../components/admin/tabs/TestimonialsTab';
import { CourseModal } from '../components/admin/modals/CourseModal';
import { PostModal } from '../components/admin/modals/PostModal';
import { TestimonialModal } from '../components/admin/modals/TestimonialModal';
import { ConfirmModal } from '../components/admin/modals/ConfirmModal';

export default function Admin() {
  const adminData = useAdminData();
  const {
    toastMessage, toastType, showToast, storageInfo, fetchStorageInfo,
    isLoggedIn, loginEmail, setLoginEmail, loginPassword, setLoginPassword,
    authError, isFirebase, authChecking, adminTab, setAdminTab, confirmModal,
    setConfirmModal, handleLoginSubmit, handleLogout, registrations, setRegistrations, loadingRegs,
    handleRegistrationStatusChange, exportRegistrationsToCSV, posts, loadingPosts,
    isPostModalOpen, currentPost, savingPost, openPostModal, closePostModal, handleSavePost,
    handleTogglePostStatus, handleDeletePost, postTitle, setPostTitle, postExcerpt, setPostExcerpt,
    postContent, setPostContent, postCategory, setPostCategory, postImage, setPostImage,
    setPostImageFile, postAuthor, setPostAuthor, postStatus, setPostStatus, postPinned, setPostPinned,
    postPublishedAt, setPostPublishedAt, postTags, setPostTags, testimonials, loadingTestimonials,
    isTestimonialModalOpen, currentTestimonial, savingTestimonial, openTestimonialModal,
    closeTestimonialModal, handleSaveTestimonial, handleToggleTestimonialStatus,
    handleDeleteTestimonial, tStudentName, setTStudentName, tRoleOrCourse, setTRoleOrCourse,
    tTitle, setTTitle, tComment, setTComment, tRating, setTRating, tStatus, setTStatus,
    tAvatar, setTAvatar, setTAvatarFile
  } = adminData;

  // Custom hook para Cursos
  const {
    loading: loadingCourses, savingCourse, searchTerm, setSearchTerm, filteredCourses,
    totalCourses, morningShiftsCount, avgCost, handleSaveCourse, handleDeleteCourse, handleQuickUpdateCourse
  } = useCourses({ showToast, onCourseMutated: fetchStorageInfo });

  // Estado Local del Modal de Curso
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('tecnologia');
  const [formShift, setFormShift] = useState('Matutino');
  const [formInstructor, setFormInstructor] = useState('');
  const [formStartDate, setFormStartDate] = useState('');
  const [formEndDate, setFormEndDate] = useState('');
  const [formSchedules, setFormSchedules] = useState([{ days: ['Lunes', 'Martes', 'Miércoles', 'Jueves'], startTime: '08:00', endTime: '13:00' }]);
  const [formRequirements, setFormRequirements] = useState('CURP y acta de nacimiento');
  const [formPrice, setFormPrice] = useState('$1,200 MXN');
  const [formImage, setFormImage] = useState('');
  const [formImageFile, setFormImageFile] = useState(null);
  const [formProfile, setFormProfile] = useState('');
  const [formSyllabus, setFormSyllabus] = useState(['']);
  const [formPayments, setFormPayments] = useState([{ date: '', title: '', desc: '' }]);

  const handleToggleScheduleDay = (idx, dayId) => {
    const updated = [...formSchedules];
    const curr = updated[idx].days || [];
    updated[idx].days = curr.includes(dayId) ? curr.filter(d => d !== dayId) : [...curr, dayId];
    setFormSchedules(updated);
  };
  const handleUpdateScheduleTime = (idx, field, val) => {
    const updated = [...formSchedules];
    updated[idx] = { ...updated[idx], [field]: val };
    setFormSchedules(updated);
  };
  const handleAddScheduleRule = () => setFormSchedules([...formSchedules, { days: [], startTime: '08:00', endTime: '13:00' }]);
  const handleRemoveScheduleRule = (idx) => {
    const updated = formSchedules.filter((_, i) => i !== idx);
    setFormSchedules(updated.length ? updated : [{ days: [], startTime: '08:00', endTime: '13:00' }]);
  };
  const handleAddSyllabusField = () => setFormSyllabus([...formSyllabus, '']);
  const handleRemoveSyllabusField = (idx) => setFormSyllabus(formSyllabus.filter((_, i) => i !== idx).concat(formSyllabus.length === 1 ? [''] : []));
  const handleSyllabusChange = (idx, val) => {
    const updated = [...formSyllabus];
    updated[idx] = val;
    setFormSyllabus(updated);
  };

  const openCourseModal = useCallback((course = null) => {
    setCurrentCourse(course);
    setFormImageFile(null);
    if (course) {
      setFormTitle(course.title || '');
      setFormCategory(course.category || 'tecnologia');
      setFormShift(course.shift || 'Matutino');
      setFormInstructor(course.instructor || '');
      setFormStartDate(course.startDate || '');
      setFormEndDate(course.endDate || '');
      setFormSchedules(course.schedules?.length ? course.schedules : [{ days: ['Lunes', 'Martes', 'Miércoles', 'Jueves'], startTime: '08:00', endTime: '13:00' }]);
      setFormRequirements(course.requirements || 'CURP y acta de nacimiento');
      setFormPrice(course.price || '$1,200 MXN');
      setFormImage(course.image || '');
      setFormProfile(course.profile || '');
      setFormSyllabus(course.syllabus?.length ? [...course.syllabus] : ['']);
      setFormPayments(course.payments?.length ? [...course.payments] : [{ date: '', title: '', desc: '' }]);
    } else {
      setFormTitle(''); setFormCategory('tecnologia'); setFormShift('Matutino'); setFormInstructor(''); setFormStartDate(''); setFormEndDate('');
      setFormSchedules([{ days: ['Lunes', 'Martes', 'Miércoles', 'Jueves'], startTime: '08:00', endTime: '13:00' }]);
      setFormRequirements('CURP y acta de nacimiento'); setFormPrice('$1,200 MXN'); setFormImage(''); setFormProfile('');
      setFormSyllabus(['']); setFormPayments([{ date: '', title: '', desc: '' }]);
    }
    setIsModalOpen(true);
  }, []);

  const closeCourseModal = () => { setIsModalOpen(false); setCurrentCourse(null); setFormImageFile(null); };

  const handleSaveCourseSubmit = async (e) => {
    e.preventDefault();
    const success = await handleSaveCourse({
      currentCourse, formTitle, formCategory, formShift, formInstructor, formStartDate, formEndDate,
      formSchedules, formRequirements, formPrice, formImage, formImageFile, formProfile, formSyllabus, formPayments
    });
    if (success) closeCourseModal();
  };

  const handleDeleteCourseClick = useCallback((id, title) => {
    setConfirmModal({
      open: true,
      title: '¿Eliminar Curso?',
      message: `¿Estás seguro de eliminar el curso "${title}"?`,
      actionText: 'Eliminar Curso',
      onConfirm: async () => { await handleDeleteCourse(id); }
    });
  }, [handleDeleteCourse, setConfirmModal]);

  if (authChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <i className="ri-loader-4-line ri-spin text-4xl text-cecati"></i>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <main className="main pt-32 pb-20 bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-gray-700 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-cecati text-white flex items-center justify-center font-black text-2xl mx-auto shadow-lg shadow-red-900/30">
              <i className="ri-shield-keyhole-line"></i>
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">Acceso Administrativo</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Ingresa tus credenciales para administrar el CECATI 122.</p>
          </div>

          {authError && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-xs font-bold text-red-600 dark:text-red-300 flex items-center gap-2">
              <i className="ri-error-warning-line text-lg"></i>
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">Correo Electrónico</label>
              <input
                type="email"
                required
                placeholder="admin@cecati122.edu.mx"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-cecati"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">Contraseña</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-cecati"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-cecati hover:bg-cecati-hover text-white font-extrabold text-sm shadow-xl shadow-red-900/30 hover:shadow-red-900/50 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <i className="ri-login-box-line text-lg"></i>
              <span>Iniciar Sesión</span>
            </button>
          </form>
        </div>
      </main>
    );
  }

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
        {/* Header Superior */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Panel de Administración</h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
              <span>Gestiona el catálogo escolar en tiempo real.</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${isFirebase ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                {isFirebase ? 'Firebase Cloud Active' : 'Local Offline Mode'}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => openCourseModal()} className="px-6 py-3 rounded-full bg-cecati hover:bg-cecati-hover text-white font-extrabold text-sm shadow-xl flex items-center gap-2 cursor-pointer">
              <i className="ri-add-circle-fill text-lg"></i>
              <span>+ Agregar Nuevo Curso</span>
            </button>
            <button onClick={handleLogout} className="px-4 py-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-red-600 hover:text-white text-gray-700 dark:text-gray-300 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer">
              <span>Salir</span>
              <i className="ri-logout-box-r-line"></i>
            </button>
          </div>
        </div>

        {/* KPIs */}
        <AdminHeaderStats totalCourses={totalCourses} morningShiftsCount={morningShiftsCount} avgCost={avgCost} />

        {/* Monitor de Cuotas */}
        <FirebaseQuotaMonitor storageInfo={storageInfo} onRefresh={fetchStorageInfo} />

        {/* NAVEGACIÓN DE PESTAÑAS */}
        <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2 overflow-x-auto">
          <button onClick={() => setAdminTab('courses')} className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${adminTab === 'courses' ? 'bg-cecati text-white shadow-lg' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
            <i className="ri-book-open-line"></i>
            <span>Catálogo de Cursos ({totalCourses})</span>
          </button>

          <button onClick={() => setAdminTab('registrations')} className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${adminTab === 'registrations' ? 'bg-cecati text-white shadow-lg' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
            <i className="ri-user-add-line"></i>
            <span>Solicitudes de Pre-registro ({registrations.length})</span>
          </button>

          <button onClick={() => setAdminTab('posts')} className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${adminTab === 'posts' ? 'bg-cecati text-white shadow-lg' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
            <i className="ri-newspaper-line"></i>
            <span>Noticias / Blog ({posts.length})</span>
          </button>

          <button onClick={() => setAdminTab('testimonials')} className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${adminTab === 'testimonials' ? 'bg-cecati text-white shadow-lg' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
            <i className="ri-chat-quote-line"></i>
            <span>Testimonios ({testimonials.length})</span>
          </button>
        </div>

        {/* VISTAS DE PESTAÑAS */}
        {adminTab === 'courses' && (
          <CoursesTab
            courses={filteredCourses}
            loading={loadingCourses}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onEditCourse={openCourseModal}
            onDeleteCourse={handleDeleteCourseClick}
            onCreateCourse={() => openCourseModal()}
            onQuickUpdate={handleQuickUpdateCourse}
          />
        )}

        {adminTab === 'registrations' && (
          <PreRegistrationsTab
            registrations={registrations}
            setRegistrations={setRegistrations}
            loadingRegs={loadingRegs}
            onStatusChange={handleRegistrationStatusChange}
            showToast={showToast}
          />
        )}

        {adminTab === 'posts' && (
          <NewsTab
            posts={posts}
            loadingPosts={loadingPosts}
            onOpenPostModal={openPostModal}
            onTogglePostStatus={handleTogglePostStatus}
            onDeletePost={handleDeletePost}
          />
        )}

        {adminTab === 'testimonials' && (
          <TestimonialsTab
            testimonials={testimonials}
            loadingTestimonials={loadingTestimonials}
            onOpenTestimonialModal={openTestimonialModal}
            onToggleTestimonialStatus={handleToggleTestimonialStatus}
            onDeleteTestimonial={handleDeleteTestimonial}
          />
        )}
      </div>

      {/* MODALES INDEPENDIENTES */}
      <CourseModal
        isOpen={isModalOpen}
        currentCourse={currentCourse}
        savingCourse={savingCourse}
        onClose={closeCourseModal}
        onSubmit={handleSaveCourseSubmit}
        formTitle={formTitle} setFormTitle={setFormTitle}
        formCategory={formCategory} setFormCategory={setFormCategory}
        formShift={formShift} setFormShift={setFormShift}
        formInstructor={formInstructor} setFormInstructor={setFormInstructor}
        formStartDate={formStartDate} setFormStartDate={setFormStartDate}
        formEndDate={formEndDate} setFormEndDate={setFormEndDate}
        formSchedules={formSchedules}
        setFormSchedules={setFormSchedules}
        handleAddScheduleRule={handleAddScheduleRule}
        handleRemoveScheduleRule={handleRemoveScheduleRule}
        handleToggleScheduleDay={handleToggleScheduleDay}
        handleUpdateScheduleTime={handleUpdateScheduleTime}
        formRequirements={formRequirements} setFormRequirements={setFormRequirements}
        formPrice={formPrice} setFormPrice={setFormPrice}
        formImage={formImage} setFormImage={setFormImage} setFormImageFile={setFormImageFile}
        formProfile={formProfile} setFormProfile={setFormProfile}
        formSyllabus={formSyllabus}
        handleAddSyllabusField={handleAddSyllabusField}
        handleRemoveSyllabusField={handleRemoveSyllabusField}
        handleSyllabusChange={handleSyllabusChange}
      />

      <TestimonialModal
        isOpen={isTestimonialModalOpen}
        currentTestimonial={currentTestimonial}
        savingTestimonial={savingTestimonial}
        onClose={closeTestimonialModal}
        onSubmit={handleSaveTestimonial}
        tStudentName={tStudentName} setTStudentName={setTStudentName}
        tRoleOrCourse={tRoleOrCourse} setTRoleOrCourse={setTRoleOrCourse}
        tTitle={tTitle} setTTitle={setTTitle}
        tComment={tComment} setTComment={setTComment}
        tRating={tRating} setTRating={setTRating}
        tStatus={tStatus} setTStatus={setTStatus}
        tAvatar={tAvatar} setTAvatar={setTAvatar}
        setTAvatarFile={setTAvatarFile}
      />

      <PostModal
        isOpen={isPostModalOpen}
        currentPost={currentPost}
        savingPost={savingPost}
        onClose={closePostModal}
        onSubmit={handleSavePost}
        postTitle={postTitle} setPostTitle={setPostTitle}
        postCategory={postCategory} setPostCategory={setPostCategory}
        postAuthor={postAuthor} setPostAuthor={setPostAuthor}
        postStatus={postStatus} setPostStatus={setPostStatus}
        postPublishedAt={postPublishedAt} setPostPublishedAt={setPostPublishedAt}
        postPinned={postPinned} setPostPinned={setPostPinned}
        postExcerpt={postExcerpt} setPostExcerpt={setPostExcerpt}
        postImage={postImage} setPostImage={setPostImage} setPostImageFile={setPostImageFile}
        postContent={postContent} setPostContent={setPostContent}
        postTags={postTags} setPostTags={setPostTags}
      />

      <ConfirmModal confirmModal={confirmModal} setConfirmModal={setConfirmModal} />
    </main>
  );
}
