export function CourseSidebarInfo({ selectedCourse, activeTab, setActiveTab }) {
  return (
    <div className="lg:col-span-5 space-y-5">
      <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700 space-y-5">
        <div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Costo de Inversión</span>
          <div className="text-3xl font-black text-gray-900 dark:text-white">{selectedCourse.price}</div>
        </div>

        <div className="space-y-2.5 text-xs text-gray-600 dark:text-gray-300 border-t border-b border-gray-200 dark:border-gray-600/60 py-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 dark:text-gray-400">Duración:</span>
            <strong className="text-gray-900 dark:text-white font-bold">{selectedCourse.duration} horas</strong>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 dark:text-gray-400">Fecha de Inicio:</span>
            <strong className="text-gray-900 dark:text-white font-bold">{selectedCourse.startDate}</strong>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 dark:text-gray-400">Horario:</span>
            <strong className="text-gray-900 dark:text-white font-bold">{selectedCourse.schedule}</strong>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 dark:text-gray-400">Requisitos:</span>
            <strong className="text-gray-900 dark:text-white font-bold">{selectedCourse.requirements}</strong>
          </div>
        </div>

        <div className="space-y-2.5 pt-1">
          <a
            href={`https://wa.me/524142731601?text=Hola,%20quisiera%20recibir%20informes%20e%20inscribirme%20al%20curso%20de%20${encodeURIComponent(selectedCourse.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE57] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <i className="ri-whatsapp-line text-lg"></i>
            <span>Consultar por WhatsApp</span>
          </a>

          <button
            onClick={() => setActiveTab('register')}
            className={`w-full py-3.5 rounded-xl font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'register'
                ? 'bg-emerald-600 text-white'
                : 'bg-cecati hover:bg-cecati-hover text-white'
            }`}
          >
            <i className="ri-user-add-line text-lg"></i>
            <span>{activeTab === 'register' ? 'Llenando Pre-Registro...' : 'Apartar Lugar Ahora'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
