import { ScheduleSelector } from './ScheduleSelector';
import { SyllabusEditor } from './SyllabusEditor';

export function CourseModal({
  isOpen,
  currentCourse,
  savingCourse,
  onClose,
  onSubmit,

  // Form states
  formTitle,
  setFormTitle,
  formCategory,
  setFormCategory,
  formDuration,
  setFormDuration,
  formStartDate,
  setFormStartDate,
  formEndDate,
  setFormEndDate,
  formSchedules,
  handleAddScheduleRule,
  handleRemoveScheduleRule,
  handleToggleScheduleDay,
  handleUpdateScheduleTime,
  formRequirements,
  setFormRequirements,
  formPrice,
  setFormPrice,
  formImage,
  setFormImage,
  setFormImageFile,
  formProfile,
  setFormProfile,
  formSyllabus,
  handleAddSyllabusField,
  handleRemoveSyllabusField,
  handleSyllabusChange
}) {
  if (!isOpen) return null;

  return (
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
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-red-600 hover:text-white text-gray-700 dark:text-gray-300 transition-colors flex items-center justify-center text-lg cursor-pointer"
          >
            <i className="ri-close-line"></i>
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={onSubmit} className="p-6 sm:p-8 overflow-y-auto space-y-6 text-gray-700 dark:text-gray-300 text-xs sm:text-sm">

          {/* Fila 1: Título, Categoría, Costo */}
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

          {/* Fila 2: Duración, Fecha Inicio, Fecha Término */}
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
                type="date"
                value={formStartDate}
                onChange={(e) => setFormStartDate(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-cecati [color-scheme:dark]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-900 dark:text-white">Fecha de Término</label>
              <input
                type="date"
                value={formEndDate}
                min={formStartDate}
                onChange={(e) => setFormEndDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-cecati [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Selector Estructurado de Horarios (Full-Width Minimalista) */}
          <ScheduleSelector
            formSchedules={formSchedules}
            onAddRule={handleAddScheduleRule}
            onRemoveRule={handleRemoveScheduleRule}
            onToggleDay={handleToggleScheduleDay}
            onUpdateTime={handleUpdateScheduleTime}
          />

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
          <SyllabusEditor
            formSchedules={formSyllabus}
            formSyllabus={formSyllabus}
            onAddModule={handleAddSyllabusField}
            onRemoveModule={handleRemoveSyllabusField}
            onChangeModule={handleSyllabusChange}
          />

          {/* Modal Footer Actions */}
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
  );
}
