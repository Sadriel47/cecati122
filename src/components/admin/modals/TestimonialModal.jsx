export function TestimonialModal({
  isOpen,
  currentTestimonial,
  savingTestimonial,
  onClose,
  onSubmit,
  tStudentName,
  setTStudentName,
  tRoleOrCourse,
  setTRoleOrCourse,
  tTitle,
  setTTitle,
  tComment,
  setTComment,
  tRating,
  setTRating,
  tStatus,
  setTStatus,
  tAvatar,
  setTAvatar,
  setTAvatarFile
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col max-h-[92vh] my-auto">
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
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 text-gray-700 dark:text-gray-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
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
  );
}
