import { DIAS_SEMANA, formatSchedulesToString } from '../../../utils/dateUtils';

export function ScheduleSelector({
  formSchedules,
  onAddRule,
  onRemoveRule,
  onToggleDay,
  onUpdateTime
}) {
  return (
    <div className="space-y-3 p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/40 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <label className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-2">
          <i className="ri-time-line text-cecati"></i>
          <span>Horarios del Curso *</span>
        </label>
        <button
          type="button"
          onClick={onAddRule}
          className="px-3.5 py-1.5 rounded-xl bg-cecati hover:bg-cecati-hover text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <i className="ri-add-line"></i>
          <span>+ Agregar Horario</span>
        </button>
      </div>

      <div className="space-y-2.5">
        {formSchedules.map((sched, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3"
          >
            {/* Selector de Días: Pills compactos */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {DIAS_SEMANA.map((dia) => {
                const selected = (sched.days || []).includes(dia.id);
                return (
                  <button
                    key={dia.id}
                    type="button"
                    onClick={() => onToggleDay(idx, dia.id)}
                    className={`rounded-lg text-xs py-1 px-2.5 font-bold transition-all cursor-pointer ${
                      selected
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-white hover:bg-gray-600'
                    }`}
                  >
                    {dia.label}
                  </button>
                );
              })}
            </div>

            {/* Inputs de Hora: Compactos y horizontales */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">De</span>
              <input
                type="time"
                value={sched.startTime || '08:00'}
                onChange={(e) => onUpdateTime(idx, 'startTime', e.target.value)}
                required
                className="px-2.5 py-1 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-cecati [color-scheme:dark]"
              />
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">A</span>
              <input
                type="time"
                value={sched.endTime || '13:00'}
                onChange={(e) => onUpdateTime(idx, 'endTime', e.target.value)}
                required
                className="px-2.5 py-1 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-cecati [color-scheme:dark]"
              />

              {formSchedules.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveRule(idx)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 transition-colors cursor-pointer ml-1"
                  title="Eliminar este horario"
                >
                  <i className="ri-delete-bin-line text-base"></i>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Previsualización del Resultado Oficial */}
      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 pt-1">
        <i className="ri-information-line text-cecati"></i>
        <span>Resultado Oficial: <strong>{formatSchedulesToString(formSchedules)}</strong></span>
      </div>
    </div>
  );
}
