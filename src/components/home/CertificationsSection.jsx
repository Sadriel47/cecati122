export function CertificationsSection() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300" id="certificaciones">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-cecati dark:text-red-400 mb-2 block">
            Respaldo Institucional
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Nuestras Certificaciones
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <article className="rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300 p-6 space-y-4 border border-gray-100 dark:border-gray-700">
            <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 text-cecati dark:text-red-400 flex items-center justify-center text-2xl font-bold">
              <i className="ri-government-line"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Validez Oficial SEP
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Todos nuestros cursos otorgan diplomas y constancias con validez oficial de la Secretaría de Educación Pública a nivel nacional.
            </p>
          </article>

          <article className="rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300 p-6 space-y-4 border border-gray-100 dark:border-gray-700">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-2xl font-bold">
              <i className="ri-verified-badge-line"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Evaluación CONOCER
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Certifica tus competencias laborales mediante el Consejo Nacional de Normalización y Certificación de Competencias Laborales.
            </p>
          </article>

          <article className="rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300 p-6 space-y-4 border border-gray-100 dark:border-gray-700">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl font-bold">
              <i className="ri-briefcase-line"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Reconocimiento Laboral
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Acredita tus conocimientos prácticos con documentos oficiales que potencian tu empleabilidad ante el sector productivo.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
