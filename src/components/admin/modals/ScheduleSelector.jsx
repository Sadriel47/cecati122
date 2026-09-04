import { DIAS_SEMANA, formatSchedulesToString } from '../../../utils/dateUtils';

export function ScheduleSelector({
  formSchedules,
  setFormSchedules,
  onAddRule,
  onRemoveRule,
  onToggleDay,
  onUpdateTime
}) {
  const applyPreset = (presetType) => {
    if (!setFormSchedules) return;
    if (presetType === 'lun_jue') {
      setFormSchedules([{ days: ['Lunes', 'Martes', 'Miércoles', 'Jueves'], startTime: '08:00', endTime: '13:00' }]);
    } else if (presetType === 'lun_vie') {
      setFormSchedules([{ days: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'], startTime: '08:00', endTime: '13:00' }]);
    } else if (presetType === 'sabatino') {
      setFormSchedules([{ days: ['Sábado'], startTime: '08:00', endTime: '14:00' }]);
    } else if (presetType === 'sab_dom_distintos') {
      // Caso especial: Sábado y Domingo con distintos horarios
      setFormSchedules([
        { days: ['Sábado'], startTime: '08:00', endTime: '14:00' },
        { days: ['Domingo'], startTime: '09:00', endTime: '13:00' }
      ]);
    }
  };

  return (
    <div className="space-y-3.5 p-4 sm:p-5 rounded-2xl bg-gray-50 dark:bg-gray-700/40 border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <label className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-2">
            <i className="ri-time-line text-cecati"></i>
            <span>Horarios y Días de Clase *</span>
          </label>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
            Puedes agregar múltiples bloques si los días tienen horas diferentes (ej. Sábados y Domingos).
          </p>
        </div>

        <button
          type="button"
          onClick={onAddRule}
          className="px-3.5 py-1.5 rounded-xl bg-cecati hover:bg-cecati-hover text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto"
        >
          <i className="ri-add-line"></i>
          <span>+ Agregar Bloque de Horario</span>
        </button>
      </div>

      {/* Atajos Rápidos (Presets) */}
      {setFormSchedules && (
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <span className="text-[11px] font-bold text-gray-400 dark:text-gray-400 mr-1 flex items-center gap-1">
            <i className="ri-flashlight-line text-amber-500"></i> Atajos:
          </span>
          <button
            type="button"
            onClick={() => applyPreset('lun_jue')}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:border-cecati text-gray-700 dark:text-gray-300 text-[11px] font-medium transition-colors cursor-pointer"
          >
            Lun-Jue (8-13h)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('lun_vie')}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:border-cecati text-gray-700 dark:text-gray-300 text-[11px] font-medium transition-colors cursor-pointer"
          >
            Lun-Vie (8-13h)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('sabatino')}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:border-cecati text-gray-700 dark:text-gray-300 text-[11px] font-medium transition-colors cursor-pointer"
          >
            Solo Sábados (8-14h)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('sab_dom_distintos')}
            className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 hover:bg-amber-100 text-amber-800 dark:text-amber-300 text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
            title="Sábados de 08:00 a 14:00 y Domingos de 09:00 a 13:00"
          >
            <i className="ri-calendar-todo-line"></i>
            <span>Sáb y Dom (Horarios Distintos)</span>
          </button>
        </div>
      )}

      {/* Listado de Reglas de Horarios */}
      <div className="space-y-2.5">
        {formSchedules.map((sched, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3.5 space-y-3"
          >
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700/60 pb-2">
              <span className="text-xs font-black text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-700 text-cecati font-bold text-[11px] flex items-center justify-center">
                  {idx + 1}
                </span>
                <span>Horario #{idx + 1}</span>
                {formSchedules.length > 1 && (
                  <span className="text-[10px] text-gray-400 font-normal hidden sm:inline">
                    (Selecciona los días para esta hora específica)
                  </span>
                )}
              </span>

              {formSchedules.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveRule(idx)}
                  className="px-2 py-1 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                  title="Eliminar este bloque de horario"
                >
                  <i className="ri-delete-bin-line"></i>
                  <span>Eliminar Horario #{idx + 1}</span>
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Selector de Días: Pills compactos */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {DIAS_SEMANA.map((dia) => {
                  const selected = (sched.days || []).includes(dia.id);
                  return (
                    <button
                      key={dia.id}
                      type="button"
                      onClick={() => onToggleDay(idx, dia.id)}
                      className={`rounded-lg text-xs py-1.5 px-3 font-bold transition-all cursor-pointer ${
                        selected
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-white hover:bg-gray-600'
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
                  className="px-2.5 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-cecati [color-scheme:light] dark:[color-scheme:dark]"
                />
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">A</span>
                <input
                  type="time"
                  value={sched.endTime || '13:00'}
                  onChange={(e) => onUpdateTime(idx, 'endTime', e.target.value)}
                  required
                  className="px-2.5 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-cecati [color-scheme:light] dark:[color-scheme:dark]"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Previsualización del Resultado Oficial */}
      <div className="text-xs text-gray-600 dark:text-gray-300 flex items-start gap-2 pt-1 bg-white dark:bg-gray-800/80 p-3 rounded-xl border border-gray-200 dark:border-gray-700">
        <i className="ri-information-line text-cecati text-base shrink-0 mt-0.5"></i>
        <div>
          <span className="text-gray-400 block text-[11px] uppercase tracking-wider font-bold">Resumen que verán los alumnos:</span>
          <strong className="text-gray-900 dark:text-white font-extrabold text-xs sm:text-sm">
            {formatSchedulesToString(formSchedules)}
          </strong>
        </div>
      </div>
    </div>
  );
}
