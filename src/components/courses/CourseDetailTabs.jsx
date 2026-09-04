import { PreRegisterForm } from './PreRegisterForm';

export function CourseDetailTabs({
  activeTab,
  setActiveTab,
  selectedCourse,
  registerSuccess,
  setRegisterSuccess,
  lastRegistered,
  formData,
  setFormData,
  honeypot,
  setHoneypot,
  regError,
  submittingReg,
  handleRegisterSubmit
}) {
  return (
    <div className="lg:col-span-7 space-y-6">
      <div className="flex border-b border-gray-200 dark:border-gray-700 space-x-4 sm:space-x-6 overflow-x-auto pb-1">
        {[
          { id: 'overview', label: 'Visión General', icon: 'ri-briefcase-line' },
          { id: 'syllabi', label: 'Temario', icon: 'ri-book-open-line' },
          { id: 'payments', label: 'Pagos', icon: 'ri-calendar-check-line' },
          { id: 'register', label: 'Pre-Registro', icon: 'ri-user-add-line' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'border-cecati text-cecati dark:text-red-400 dark:border-red-400'
                : 'border-transparent text-gray-400 hover:text-gray-700 dark:hover:text-white'
            }`}
          >
            <i className={`${tab.icon} text-base`}></i>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="space-y-6 text-gray-700 dark:text-gray-300 text-sm">
        {selectedCourse.isLoadingDetails ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <i className="ri-loader-4-line ri-spin text-4xl text-cecati dark:text-red-400"></i>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold">Cargando temario y detalles del curso...</p>
          </div>
        ) : activeTab === 'overview' && (
          <div className="space-y-5 animate-fade-in">
            <div className="space-y-2">
              <h4 className="font-extrabold text-base text-gray-900 dark:text-white flex items-center gap-2">
                <i className="ri-rocket-line text-cecati dark:text-red-400"></i>
                ¿En qué te capacitará este curso?
              </h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {selectedCourse.profile || 'Este programa te brindará competencias técnicas de nivel industrial para integrarte de forma directa al mercado laboral o emprender tu propio negocio.'}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700 space-y-1">
                <h5 className="font-bold text-gray-900 dark:text-white text-xs flex items-center gap-1.5">
                  <i className="ri-award-line text-emerald-500 text-sm"></i> Validez Nacional SEP
                </h5>
                <p className="text-xs text-gray-500 dark:text-gray-400">Diploma oficial con registro en el sistema DGCFT.</p>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700 space-y-1">
                <h5 className="font-bold text-gray-900 dark:text-white text-xs flex items-center gap-1.5">
                  <i className="ri-tools-line text-blue-500 text-sm"></i> Talleres Prácticos
                </h5>
                <p className="text-xs text-gray-500 dark:text-gray-400">Equipamiento industrial para aprendizaje real.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'syllabi' && (
          <div className="space-y-3 animate-fade-in">
            <h4 className="font-extrabold text-base text-gray-900 dark:text-white flex items-center gap-2">
              <i className="ri-list-check-3 text-cecati dark:text-red-400"></i>
              Contenido Temático
            </h4>
            <div className="space-y-2">
              {selectedCourse.syllabus?.length > 0 ? (
                selectedCourse.syllabus.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700 flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-cecati text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{idx + 1}</span>
                    <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 leading-relaxed">{item}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500 dark:text-gray-400 italic">Temario oficial disponible en servicios escolares.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Inversión Única</span>
                <h4 className="text-xl font-black text-emerald-700 dark:text-emerald-400">{selectedCourse.price}</h4>
              </div>
              <span className="text-xs bg-emerald-600 text-white px-3 py-1 rounded-full font-bold">Sin costos ocultos</span>
            </div>
            <div className="space-y-3">
              <h5 className="font-bold text-xs text-gray-900 dark:text-white uppercase tracking-wider">Fechas de Parcialidades</h5>
              <div className="space-y-2">
                {selectedCourse.payments?.length > 0 ? (
                  selectedCourse.payments.map((event, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700 flex justify-between items-center text-xs">
                      <span className="font-bold text-cecati dark:text-red-400">{event.date}</span>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{event.title}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 dark:text-gray-400">Pago único directo en la caja del plantel antes del inicio.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'register' && (
          <PreRegisterForm
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
        )}
      </div>
    </div>
  );
}
