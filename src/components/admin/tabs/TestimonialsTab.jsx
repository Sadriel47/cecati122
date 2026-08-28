export function TestimonialsTab({
  testimonials,
  loadingTestimonials,
  onOpenTestimonialModal,
  onToggleTestimonialStatus,
  onDeleteTestimonial
}) {
  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-xl space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">
            Testimonios de Alumnos y Egresados
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Gestiona las opiniones y experiencias que se despliegan en la página principal.
          </p>
        </div>

        <button
          onClick={() => onOpenTestimonialModal()}
          className="px-6 py-2.5 rounded-full bg-cecati hover:bg-cecati-hover text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-red-900/30 hover:shadow-red-900/50 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 cursor-pointer"
        >
          <i className="ri-add-line text-lg"></i>
          <span>+ Nuevo Testimonio</span>
        </button>
      </div>

      {loadingTestimonials ? (
        <div className="text-center py-12 space-y-3">
          <i className="ri-loader-4-line ri-spin text-3xl text-cecati block"></i>
          <p className="text-sm text-gray-500">Cargando testimonios de alumnos...</p>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-12 space-y-3 text-gray-500 dark:text-gray-400">
          <i className="ri-chat-quote-line text-4xl block"></i>
          <p className="text-sm font-medium">No hay testimonios registrados aún.</p>
          <button
            onClick={() => onOpenTestimonialModal()}
            className="px-5 py-2.5 rounded-full bg-cecati text-white text-xs font-bold hover:bg-cecati-hover transition-colors inline-flex items-center gap-1.5"
          >
            <i className="ri-add-line"></i> Agregar Primer Testimonio
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-2">Alumno</th>
                <th className="py-3 px-2">Especialidad</th>
                <th className="py-3 px-2">Título</th>
                <th className="py-3 px-2">Estrellas</th>
                <th className="py-3 px-2">Estado</th>
                <th className="py-3 px-2 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60 text-gray-700 dark:text-gray-300">
              {testimonials.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                  <td className="py-3 px-2 font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <img
                      src={item.avatar || '/assets/img/testimonial-profile-1.png'}
                      alt={item.studentName}
                      className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700"
                    />
                    <span>{item.studentName}</span>
                  </td>
                  <td className="py-3 px-2 text-gray-500 font-medium">{item.roleOrCourse}</td>
                  <td className="py-3 px-2 font-semibold text-gray-800 dark:text-gray-200">{item.title}</td>
                  <td className="py-3 px-2 text-amber-500">
                    {'★'.repeat(item.rating || 5)}
                  </td>
                  <td className="py-3 px-2">
                    <button
                      onClick={() => onToggleTestimonialStatus(item.id, item.status)}
                      className={`px-2.5 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${item.status === 'published' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
                    >
                      {item.status === 'published' ? 'Publicado' : 'Borrador'}
                    </button>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onOpenTestimonialModal(item)}
                        className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition-colors font-bold text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <i className="ri-edit-line"></i> Editar
                      </button>
                      <button
                        onClick={() => onDeleteTestimonial(item.id, item.studentName)}
                        className="p-2 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white transition-colors font-bold text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <i className="ri-delete-bin-line"></i> Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
