export function RegistrationSuccessState({ lastRegistered, selectedCourse, onReset }) {
  return (
    <div className="text-center space-y-4 py-3">
      <i className="ri-checkbox-circle-fill text-6xl text-emerald-500"></i>
      <h4 className="font-black text-lg text-gray-900 dark:text-white">¡Pre-registro Reservado con Éxito!</h4>
      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
        Hola <strong>{lastRegistered?.fullName}</strong>, tu lugar para el curso de <strong>{selectedCourse.title}</strong> ha sido reservado correctamente en nuestro sistema.
      </p>

      <a
        href={`https://wa.me/524142731601?text=Hola,%20acabo%20de%20realizar%20mi%20pre-registro%20a%20nombre%20de%20${encodeURIComponent(lastRegistered?.fullName || '')}%20para%20el%20curso%20de%20${encodeURIComponent(selectedCourse.title)}.%20Quisiera%20confirmar%20mi%20ficha%20de%20inscripción.`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full py-3.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE57] text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-2"
      >
        <i className="ri-whatsapp-line text-xl"></i>
        <span>Enviar Confirmación por WhatsApp</span>
      </a>

      <button
        onClick={onReset}
        className="text-xs text-gray-400 hover:underline block mx-auto pt-2 cursor-pointer"
      >
        Registrar a otra persona
      </button>
    </div>
  );
}
