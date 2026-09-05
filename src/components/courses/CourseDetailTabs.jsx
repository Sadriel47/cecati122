import { useState } from 'react';
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
  const [copiedBank, setCopiedBank] = useState(false);

  const handleCopyAccount = () => {
    navigator.clipboard.writeText('1056897860');
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2500);
  };

  const tabs = [
    { id: 'overview', label: 'Visión General', icon: 'ri-briefcase-line' },
    { id: 'syllabi', label: 'Temario', icon: 'ri-book-open-line' },
    { id: 'requirements', label: 'Requisitos', icon: 'ri-file-list-3-line' },
    { id: 'payments', label: 'Pagos y Banco', icon: 'ri-bank-card-line' },
    { id: 'register', label: 'Pre-Registro', icon: 'ri-user-add-line', isHighlight: true },
  ];

  return (
    <div className="lg:col-span-7 space-y-6">
      {/* Navegación por pestañas móvil-friendly con scrollbar estilizada */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-3 custom-scrollbar border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                tab.isHighlight
                  ? isActive
                    ? 'bg-cecati text-white shadow-lg scale-105'
                    : 'bg-red-50 dark:bg-red-950/50 text-cecati dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-cecati hover:text-white'
                  : isActive
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700/60 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <i className={`${tab.icon} text-sm sm:text-base`}></i>
              <span>{tab.label}</span>
            </button>
          );
        })}
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

            {/* Requisitos rápidos en visión general */}
            <div className="p-4 rounded-2xl bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 space-y-2">
              <div className="flex items-center justify-between">
                <h5 className="font-extrabold text-gray-900 dark:text-white text-xs flex items-center gap-1.5">
                  <i className="ri-checkbox-circle-line text-cecati dark:text-red-400 text-base"></i>
                  Documentación Básica Requerida
                </h5>
                <button
                  onClick={() => setActiveTab('requirements')}
                  className="text-[11px] font-bold text-cecati dark:text-red-400 hover:underline"
                >
                  Ver detalles →
                </button>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Copia simple de: Acta de nacimiento, CURP, Comprobante de estudios, Comprobante de domicilio, 2 Fotos infantil a color y Comprobante de pago Banorte.
              </p>
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
                <p className="text-xs text-gray-500 dark:text-gray-400 italic">Temario oficial disponible en servicios escolares del plantel.</p>
              )}
            </div>
          </div>
        )}

        {/* PESTAÑA: REQUISITOS OFICIALES DE INSCRIPCIÓN */}
        {activeTab === 'requirements' && (
          <div className="space-y-5 animate-fade-in">
            <div className="p-5 rounded-3xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700 space-y-4">
              <div className="border-b border-gray-200 dark:border-gray-600 pb-3">
                <h4 className="font-black text-lg text-gray-900 dark:text-white flex items-center gap-2">
                  <i className="ri-file-copy-2-line text-cecati dark:text-red-400"></i>
                  Requisitos de Inscripción
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-semibold">
                  Copia simple de los siguientes documentos:
                </p>
              </div>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm font-medium">
                {[
                  { title: 'Acta de nacimiento', icon: 'ri-emotion-happy-line' },
                  { title: 'CURP (Actualizada)', icon: 'ri-id-card-line' },
                  { title: 'Comprobante de estudios', icon: 'ri-article-line' },
                  { title: 'Comprobante de domicilio', icon: 'ri-home-4-line' },
                  { title: '2 Fotografías tamaño infantil a color', icon: 'ri-image-line' },
                  { title: 'Comprobante de pago BANORTE', icon: 'ri-ticket-2-line' },
                ].map((req, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 shadow-2xs">
                    <i className={`${req.icon} text-cecati dark:text-red-400 text-lg shrink-0`}></i>
                    <span className="text-gray-900 dark:text-white font-bold">{req.title}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* BANORTE CARD */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-red-600 to-rose-700 text-white shadow-xl space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs uppercase font-extrabold tracking-widest text-red-200 block">Depósito Bancario</span>
                  <h5 className="text-xl font-black">BANORTE</h5>
                </div>
                <i className="ri-bank-line text-3xl text-red-200"></i>
              </div>

              <div className="p-3 bg-black/20 backdrop-blur-md rounded-2xl flex items-center justify-between border border-white/20">
                <div>
                  <span className="text-[10px] text-red-100 uppercase tracking-wider block font-bold">Número de Cuenta BANORTE</span>
                  <strong className="text-2xl font-mono tracking-wider font-extrabold text-white">1056897860</strong>
                </div>
                <button
                  onClick={handleCopyAccount}
                  className="px-3 py-2 rounded-xl bg-white text-rose-700 font-extrabold text-xs shadow-md hover:bg-rose-50 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <i className={copiedBank ? "ri-check-line text-emerald-600" : "ri-file-copy-line"}></i>
                  <span>{copiedBank ? "¡Copiado!" : "Copiar"}</span>
                </button>
              </div>

              <p className="text-xs text-red-100 font-medium">
                * Realiza tu depósito por esta cantidad exacta en cualquier sucursal BANORTE o transferencia y entrega el ticket original junto con tus copias.
              </p>
            </div>
          </div>
        )}

        {/* PESTAÑA: PAGOS Y BANCO */}
        {activeTab === 'payments' && (
          <div className="space-y-5 animate-fade-in">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Inversión Única del Curso</span>
                <h4 className="text-2xl font-black text-emerald-800 dark:text-emerald-300">{selectedCourse.price}</h4>
              </div>
              <span className="text-xs bg-emerald-600 text-white px-3 py-1 rounded-full font-bold">Sin mensualidades</span>
            </div>

            {/* BANORTE DEPOSIT INFO */}
            <div className="p-5 rounded-3xl bg-gray-50 dark:bg-gray-700/40 border border-gray-200 dark:border-gray-600 space-y-3">
              <div className="flex items-center gap-2">
                <i className="ri-bank-card-fill text-2xl text-red-600 dark:text-red-400"></i>
                <div>
                  <h5 className="font-extrabold text-gray-900 dark:text-white text-sm">Cuenta de Depósito Oficial</h5>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Banco BANORTE - CECATI 122</p>
                </div>
              </div>

              <div className="p-3.5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-600 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 block font-semibold">Número de Cuenta BANORTE:</span>
                  <strong className="text-xl font-mono font-extrabold text-gray-900 dark:text-white">1056897860</strong>
                </div>
                <button
                  onClick={handleCopyAccount}
                  className="px-3.5 py-2 rounded-xl bg-cecati hover:bg-cecati-hover text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <i className={copiedBank ? "ri-check-line text-emerald-300" : "ri-file-copy-line"}></i>
                  <span>{copiedBank ? "¡Copiado!" : "Copiar Cuenta"}</span>
                </button>
              </div>

              <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                <p><strong>Nota importante:</strong></p>
                <p>Presenta tu comprobante impreso de depósito junto con tus documentos (Acta, CURP, Comprobante de estudios, Comprobante de domicilio y 2 fotos infantil a color).</p>
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA: PRE-REGISTRO */}
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

