import { useEffect, useRef } from 'react';
import { CourseDetailTabs } from './CourseDetailTabs';
import { CourseSidebarInfo } from './CourseSidebarInfo';

function getCategoryLabel(cat) {
  if (!cat) return 'General';
  switch (cat.toLowerCase()) {
    case 'tecnologia': return 'Tecnología';
    case 'textil': return 'Textil';
    case 'gastronomia': return 'Gastronomía';
    case 'administracion': return 'Administración';
    case 'automotriz': return 'Automotriz';
    case 'estilismo': return 'Estilismo y Belleza';
    case 'idiomas': return 'Idiomas';
    default: return cat.charAt(0).toUpperCase() + cat.slice(1);
  }
}

export function PreRegisterModal({
  selectedCourse,
  activeTab,
  setActiveTab,
  onClose,
  formData,
  setFormData,
  honeypot,
  setHoneypot,
  regError,
  registerSuccess,
  setRegisterSuccess,
  submittingReg,
  lastRegistered,
  handleRegisterSubmit
}) {
  const contentRef = useRef(null);

  // Auto-scroll al inicio del contenedor cuando cambia la pestaña (especialmente en móviles)
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeTab]);

  if (!selectedCourse) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full h-[100dvh] sm:h-auto sm:max-h-[92vh] max-w-5xl bg-white dark:bg-gray-800 rounded-none sm:rounded-3xl overflow-hidden shadow-2xl border-0 sm:border border-gray-200 dark:border-gray-700 flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con Imagen */}
        <div className="relative h-36 sm:h-52 overflow-hidden shrink-0">
          <img
            src={selectedCourse.image || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80'}
            alt={selectedCourse.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30"></div>

          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-red-600 text-white backdrop-blur-md transition-colors flex items-center justify-center text-xl cursor-pointer shadow-xl border border-white/20"
            aria-label="Cerrar modal"
          >
            <i className="ri-close-line"></i>
          </button>

          <div className="absolute bottom-3 left-4 right-4 sm:bottom-5 sm:left-6 sm:right-6 z-10 space-y-1 sm:space-y-2 text-white">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold bg-cecati text-white shadow-sm capitalize">
                {getCategoryLabel(selectedCourse.category)}
              </span>
              <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-white/20 backdrop-blur-md border border-white/20 text-gray-200">
                Validez Oficial SEP
              </span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black tracking-tight leading-snug line-clamp-2">
              {selectedCourse.title}
            </h2>
          </div>
        </div>

        {/* Cuerpo del Modal con scroll suave */}
        <div ref={contentRef} className="p-4 sm:p-8 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          <CourseDetailTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            selectedCourse={selectedCourse}
            registerSuccess={registerSuccess}
            setRegisterSuccess={setRegisterSuccess}
            lastRegistered={lastRegistered}
            formData={formData}
            setFormData={setFormData}
            honeypot={honeypot}
            setHoneypot={setHoneypot}
            regError={regError}
            submittingReg={submittingReg}
            handleRegisterSubmit={handleRegisterSubmit}
          />

          <CourseSidebarInfo
            selectedCourse={selectedCourse}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>
      </div>
    </div>
  );
}

