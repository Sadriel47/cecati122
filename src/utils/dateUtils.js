/**
 * Utilidades para formatear, normalizar y estandarizar fechas y horarios de los cursos del CECATI 122.
 */

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const DIAS_SEMANA = [
  { id: 'Lunes', label: 'Lun' },
  { id: 'Martes', label: 'Mar' },
  { id: 'Miércoles', label: 'Mié' },
  { id: 'Jueves', label: 'Jue' },
  { id: 'Viernes', label: 'Vie' },
  { id: 'Sábado', label: 'Sáb' },
  { id: 'Domingo', label: 'Dom' }
];

/**
 * Convierte un arreglo de reglas de horario estructuradas en una cadena oficial CECATI 122.
 * Ej: [{ days: ['Lunes', 'Martes', 'Miércoles', 'Jueves'], startTime: '08:00', endTime: '13:00' }]
 *     -> "Lunes a Jueves de 08:00 a 13:00 hrs"
 * Ej: [{ days: ['Viernes'], startTime: '11:00', endTime: '15:00' }, { days: ['Sábado'], startTime: '09:00', endTime: '13:00' }]
 *     -> "Viernes de 11:00 a 15:00 hrs / Sábados de 09:00 a 13:00 hrs"
 * @param {Array<{ days: string[], startTime: string, endTime: string }>} schedules 
 * @returns {string} Cadena de horario formateada
 */
export function formatSchedulesToString(schedules) {
  if (!Array.isArray(schedules) || schedules.length === 0) {
    return 'Horario por definir';
  }

  const ORDERED_DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  const blocks = schedules.map(item => {
    const { days = [], startTime, endTime } = item;

    if ((!days || days.length === 0) && !startTime && !endTime) {
      return '';
    }

    // Ordenar días según la semana
    const sortedDays = [...days].sort((a, b) => ORDERED_DAYS.indexOf(a) - ORDERED_DAYS.indexOf(b));

    let daysText = '';
    if (sortedDays.length === 0) {
      daysText = '';
    } else if (sortedDays.length === 1) {
      daysText = sortedDays[0] === 'Sábado' || sortedDays[0] === 'Domingo' ? `${sortedDays[0]}s` : sortedDays[0];
    } else if (sortedDays.length === 7) {
      daysText = 'Todos los días';
    } else {
      // Verificar si son días consecutivos (ej. Lunes, Martes, Miércoles, Jueves)
      const indices = sortedDays.map(d => ORDERED_DAYS.indexOf(d));
      const isConsecutive = indices.every((val, idx) => idx === 0 || val === indices[idx - 1] + 1);

      if (isConsecutive && sortedDays.length >= 3) {
        daysText = `${sortedDays[0]} a ${sortedDays[sortedDays.length - 1]}`;
      } else if (sortedDays.length === 2) {
        daysText = `${sortedDays[0]} y ${sortedDays[1]}`;
      } else {
        daysText = sortedDays.join(', ');
      }
    }

    let timeText = '';
    if (startTime && endTime) {
      timeText = `de ${startTime} a ${endTime} hrs`;
    } else if (startTime) {
      timeText = `desde las ${startTime} hrs`;
    } else if (endTime) {
      timeText = `hasta las ${endTime} hrs`;
    }

    if (daysText && timeText) {
      return `${daysText} ${timeText}`;
    }
    return daysText || timeText;
  }).filter(Boolean);

  if (blocks.length === 0) return 'Horario por definir';

  return blocks.join(' / ');
}

/**
 * Formatea un rango de fechas (startDate, endDate) en formato ISO (YYYY-MM-DD) al español ('es-MX').
 */
export function formatDateRange(startDateISO, endDateISO) {
  if (!startDateISO) return 'Fecha por definir';

  const parseISO = (isoStr) => {
    if (!isoStr || typeof isoStr !== 'string') return null;
    const trimmed = isoStr.trim();
    const match = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return null;

    const year = parseInt(match[1], 10);
    const monthIndex = parseInt(match[2], 10) - 1;
    const day = parseInt(match[3], 10);

    const dateObj = new Date(`${trimmed}T00:00:00`);
    if (isNaN(dateObj.getTime())) return null;

    return { day, monthIndex, year, dateObj };
  };

  const start = parseISO(startDateISO);
  const end = parseISO(endDateISO);

  if (!start) {
    return formatCourseDate(startDateISO);
  }

  const startStr = `${start.day} de ${MESES[start.monthIndex]}`;

  if (!end) {
    return `${startStr} de ${start.year}`;
  }

  const endStr = `${end.day} de ${MESES[end.monthIndex]}`;

  if (start.year === end.year) {
    return `${startStr} - ${endStr} de ${end.year}`;
  }

  return `${startStr} de ${start.year} - ${endStr} de ${end.year}`;
}

/**
 * Normaliza cualquier formato de fecha de inicio ingresado por el usuario o fecha ISO a texto formateado.
 */
export function formatCourseDate(dateStr, endDateStr = '') {
  if (!dateStr || typeof dateStr !== 'string') return 'Fecha por definir';

  const trimmed = dateStr.trim();
  if (!trimmed) return 'Fecha por definir';

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return formatDateRange(trimmed, endDateStr);
  }

  const dmyMatch = trimmed.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (dmyMatch) {
    const day = parseInt(dmyMatch[1], 10);
    const monthIndex = parseInt(dmyMatch[2], 10) - 1;
    const year = parseInt(dmyMatch[3], 10);
    if (monthIndex >= 0 && monthIndex < 12 && day > 0 && day <= 31) {
      return `${day} de ${MESES[monthIndex]} de ${year}`;
    }
  }

  if (trimmed.includes('T')) {
    const parsed = new Date(trimmed);
    if (!isNaN(parsed.getTime())) {
      const day = parsed.getDate();
      const monthIndex = parsed.getMonth();
      const year = parsed.getFullYear();
      return `${day} de ${MESES[monthIndex]} de ${year}`;
    }
  }

  let capitalized = trimmed.replace(/\b([a-zÁéíóúñ]+)\b/gi, (word) => {
    const lower = word.toLowerCase();
    if (['de', 'a', 'al', 'del', 'en', 'y', '-'].includes(lower)) return lower;
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });

  return capitalized;
}

/**
 * Normaliza cualquier formato de horario escrito por el usuario a la nomenclatura oficial del CECATI 122.
 */
export function normalizeSchedule(scheduleStr) {
  if (!scheduleStr || typeof scheduleStr !== 'string') return 'Horario por definir';

  let cleaned = scheduleStr.trim();
  if (!cleaned) return 'Horario por definir';

  if (/^.+ de \d{2}:\d{2} a \d{2}:\d{2} hrs$/i.test(cleaned)) {
    return cleaned;
  }

  cleaned = cleaned
    .replace(/\blun(es)?\b/gi, 'Lunes')
    .replace(/\bmar(tes)?\b/gi, 'Martes')
    .replace(/\bmié(rcoles)?|mie(rcoles)?\b/gi, 'Miércoles')
    .replace(/\bjue(ves)?\b/gi, 'Jueves')
    .replace(/\bvie(rnes)?\b/gi, 'Viernes')
    .replace(/\bsáb(ado)?(s)?|sab(ado)?(s)?\b/gi, 'Sábados')
    .replace(/\bdom(ingo)?(s)?\b/gi, 'Domingos');

  cleaned = cleaned.replace(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/gi, (match, h, m, ampm) => {
    let hour = parseInt(h, 10);
    const min = m || '00';
    const isPM = ampm.toLowerCase() === 'pm';

    if (isPM && hour < 12) hour += 12;
    if (!isPM && hour === 12) hour = 0;

    return `${String(hour).padStart(2, '0')}:${min}`;
  });

  cleaned = cleaned.replace(/\b(\d{1,2})\s*([a\-–]|hasta)\s*(\d{1,2})\b/gi, (match, h1, sep, h2) => {
    let hour1 = parseInt(h1, 10);
    let hour2 = parseInt(h2, 10);

    if (hour2 < hour1 && hour2 < 12) hour2 += 12;

    const formatted1 = `${String(hour1).padStart(2, '0')}:00`;
    const formatted2 = `${String(hour2).padStart(2, '0')}:00`;

    return `de ${formatted1} a ${formatted2}`;
  });

  cleaned = cleaned.replace(/(\d{2}:\d{2})\s*[-–]\s*(\d{2}:\d{2})/g, '$1 a $2');
  cleaned = cleaned.replace(/(^|[^\w])(\d{2}:\d{2}\s+a\s+\d{2}:\d{2})/gi, '$1de $2');

  if (/\d{2}:\d{2}/.test(cleaned) && !/hrs$/i.test(cleaned)) {
    cleaned += ' hrs';
  }

  return cleaned;
}

/**
 * Calcula la insignia de estado del curso basado en la fecha de inicio.
 */
export function getCourseStatusBadge(dateStr, endDateStr = '') {
  if (!dateStr) {
    return {
      label: 'Próximamente',
      colorClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      icon: 'ri-time-line'
    };
  }

  const trimmed = dateStr.trim();
  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  
  if (isoMatch) {
    const courseDate = new Date(`${trimmed}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil((courseDate - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      if (endDateStr && /^\d{4}-\d{2}-\d{2}$/.test(endDateStr)) {
        const endDateObj = new Date(`${endDateStr}T00:00:00`);
        if (today > endDateObj) {
          return {
            label: 'Concluido',
            colorClass: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-700',
            icon: 'ri-checkbox-circle-fill'
          };
        }
      }
      return {
        label: 'En Curso',
        colorClass: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
        icon: 'ri-play-circle-line'
      };
    } else if (diffDays <= 15) {
      return {
        label: '¡Últimos Lugares!',
        colorClass: 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border-red-200 dark:border-red-800 animate-pulse',
        icon: 'ri-fire-line'
      };
    } else {
      return {
        label: 'Inscripciones Abiertas',
        colorClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
        icon: 'ri-checkbox-circle-line'
      };
    }
  }

  return {
    label: 'Inscripciones Abiertas',
    colorClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    icon: 'ri-checkbox-circle-line'
  };
}

/**
 * Retorna la configuración visual (colores llamativos, ícono, etiqueta) para cada turno.
 * @param {string} shift - Nombre del turno
 * @returns {{ label: string, colorClass: string, badgeBg: string, icon: string, dotColor: string, iconColor: string }}
 */
export function getShiftBadge(shift = 'Matutino') {
  const s = (shift || 'Matutino').toLowerCase();

  if (s.includes('vespert')) {
    return {
      label: shift || 'Vespertino',
      colorClass: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800',
      badgeBg: 'bg-indigo-600 text-white',
      dotColor: 'bg-indigo-500',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      icon: 'ri-moon-fill'
    };
  }

  if (s.includes('sabat')) {
    return {
      label: shift || 'Sabatino',
      colorClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
      badgeBg: 'bg-emerald-600 text-white',
      dotColor: 'bg-emerald-500',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      icon: 'ri-calendar-check-fill'
    };
  }

  if (s.includes('domin')) {
    return {
      label: shift || 'Dominical',
      colorClass: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800',
      badgeBg: 'bg-sky-600 text-white',
      dotColor: 'bg-sky-500',
      iconColor: 'text-sky-600 dark:text-sky-400',
      icon: 'ri-calendar-2-fill'
    };
  }

  if (s.includes('mixto') || s.includes('fin de semana')) {
    return {
      label: shift || 'Mixto / Fin de Semana',
      colorClass: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200 dark:bg-fuchsia-950/60 dark:text-fuchsia-300 dark:border-fuchsia-800',
      badgeBg: 'bg-fuchsia-600 text-white',
      dotColor: 'bg-fuchsia-500',
      iconColor: 'text-fuchsia-600 dark:text-fuchsia-400',
      icon: 'ri-calendar-todo-fill'
    };
  }

  if (s.includes('especial') || s.includes('flexible')) {
    return {
      label: shift || 'Especial / Flexible',
      colorClass: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800',
      badgeBg: 'bg-teal-600 text-white',
      dotColor: 'bg-teal-500',
      iconColor: 'text-teal-600 dark:text-teal-400',
      icon: 'ri-time-fill'
    };
  }

  // Por defecto: Matutino
  return {
    label: shift || 'Matutino',
    colorClass: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
    badgeBg: 'bg-amber-600 text-white',
    dotColor: 'bg-amber-500',
    iconColor: 'text-amber-500 dark:text-amber-400',
    icon: 'ri-sun-fill'
  };
}
