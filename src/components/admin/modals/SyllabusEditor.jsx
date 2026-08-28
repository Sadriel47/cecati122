export function SyllabusEditor({
  formSyllabus,
  onAddModule,
  onRemoveModule,
  onChangeModule
}) {
  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between">
        <label className="font-bold text-gray-900 dark:text-white text-sm">Temario / Lista de Módulos</label>
        <button
          type="button"
          onClick={onAddModule}
          className="px-3.5 py-1.5 rounded-xl bg-cecati hover:bg-cecati-hover text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <i className="ri-add-line"></i>
          <span>+ Agregar Tema</span>
        </button>
      </div>

      <div className="space-y-2">
        {formSyllabus.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              type="text"
              placeholder={`Módulo ${idx + 1}...`}
              value={item}
              onChange={(e) => onChangeModule(idx, e.target.value)}
              className="flex-1 px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cecati"
            />
            {formSyllabus.length > 1 && (
              <button
                type="button"
                onClick={() => onRemoveModule(idx)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                title="Eliminar este módulo"
              >
                <i className="ri-delete-bin-line text-base"></i>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
