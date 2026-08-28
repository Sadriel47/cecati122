import { CourseDetailTabs } from './CourseDetailTabs';
import { CourseSidebarInfo } from './CourseSidebarInfo';

function getCategoryLabel(cat) {
  switch (cat) {
    case 'tecnologia': return 'Tecnología';
    case 'textil': return 'Textil';
    case 'gastronomia': return 'Gastronomía';
    case 'administracion': return 'Administración';
    case 'automotriz': return 'Automotriz';
    case 'estilismo': return 'Estilismo y Belleza';
    case 'idiomas': return 'Idiomas';
    default: return 'General';
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
  if (!selectedCourse) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col max-h-[92vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con Imagen */}
        <div className="relative h-44 sm:h-52 overflow-hidden shrink-0">
          <img
            src={selectedCourse.image || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80'}
            alt={selectedCourse.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30"></div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/60 hover:bg-red-600 text-white backdrop-blur-md transition-colors flex items-center justify-center text-xl cursor-pointer shadow-xl border border-white/20"
            aria-label="Cerrar modal"
          >
            <i className="ri-close-line"></i>
          </button>

          <div className="absolute bottom-5 left-6 right-6 z-10 space-y-2 text-white">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-cecati text-white shadow-sm">
                {getCategoryLabel(selectedCourse.category)}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md border border-white/20 text-gray-200">
                Validez Oficial SEP
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
              {selectedCourse.title}
            </h2>
          </div>
        </div>

        {/* Cuerpo del Modal */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
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
