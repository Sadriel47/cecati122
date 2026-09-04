import { CourseRow } from './CourseRow';

export function CoursesTable({
  courses,
  loading,
  searchTerm,
  setSearchTerm,
  onEditCourse,
  onDeleteCourse,
  onCreateCourse,
  onQuickUpdate
}) {
  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-xl space-y-6 animate-fade-in">
      {/* Table Header Filter Row */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">
            Listado de Cursos del Catálogo
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Visualiza, crea, edita o elimina cursos en tiempo real sincronizados con la nube.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Buscar por título o categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-cecati"
            />
            <i className="ri-search-line absolute left-3.5 top-3 text-gray-400 text-base"></i>
          </div>
        </div>
      </div>

      {/* Courses Table Content */}
      {loading ? (
        <div className="text-center py-12 space-y-3">
          <i className="ri-loader-4-line ri-spin text-3xl text-cecati block"></i>
          <p className="text-sm text-gray-500">Actualizando lista de cursos...</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-12 space-y-3 text-gray-500 dark:text-gray-400">
          <i className="ri-folder-open-line text-4xl block"></i>
          <p className="text-sm font-medium">No se encontraron cursos registrados.</p>
          <button
            onClick={onCreateCourse}
            className="px-5 py-2.5 rounded-full bg-cecati text-white text-xs font-bold hover:bg-cecati-hover transition-colors inline-flex items-center gap-1.5"
          >
            <i className="ri-add-line"></i> Crear Primer Curso
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-2">Portada</th>
                <th className="py-3 px-2">Título y Profesor</th>
                <th className="py-3 px-2">Categoría</th>
                <th className="py-3 px-2">Turno</th>
                <th className="py-3 px-2">Inversión</th>
                <th className="py-3 px-2">Inicio</th>
                <th className="py-3 px-2 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60 text-gray-700 dark:text-gray-300">
              {courses.map((course) => (
                <CourseRow
                  key={course.id}
                  course={course}
                  onEdit={onEditCourse}
                  onDelete={onDeleteCourse}
                  onQuickUpdate={onQuickUpdate}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
