/**
 * Utilidades de búsqueda, normalización de texto y catálogo de especialidades del CECATI 122.
 */

/**
 * Normaliza una cadena de texto eliminando acentos, diacríticos y convirtiendo a minúsculas.
 * @param {string} str 
 * @returns {string}
 */
export function normalizeText(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Catálogo enriquecido de especialidades y sinónimos para el buscador.
 */
export const SPECIALTIES = [
  {
    id: 'automotriz',
    label: 'Mecánica Automotriz',
    shortLabel: 'Mecánica',
    icon: 'ri-tools-line',
    keywords: [
      'automotriz', 'mecanica', 'mecanico', 'mecánica', 'mecanica automotriz',
      'autos', 'auto', 'carro', 'carros', 'automovil', 'motores', 'motor',
      'frenos', 'afinacion', 'afinación', 'suspension', 'suspensión',
      'electricidad automotriz', 'transmisiones', 'diagnostico'
    ]
  },
  {
    id: 'estilismo',
    label: 'Estilismo y Belleza',
    shortLabel: 'Estilismo',
    icon: 'ri-scissors-line',
    keywords: [
      'estilismo', 'belleza', 'estilista', 'corte', 'corte de cabello', 'peinado',
      'peinados', 'maquillaje', 'cosmetologia', 'cosmetología', 'unas', 'uñas',
      'manicura', 'pedicura', 'barberia', 'barbería', 'barber', 'colorimetria',
      'colorimetría', 'tintes', 'pestañas', 'cejas'
    ]
  },
  {
    id: 'tecnologia',
    label: 'Tecnología e Informática',
    shortLabel: 'Tecnología',
    icon: 'ri-computer-line',
    keywords: [
      'tecnologia', 'tecnología', 'informatica', 'informática', 'computacion', 'computación',
      'sistemas', 'computadora', 'computadoras', 'pc', 'laptop', 'programacion', 'programación',
      'ofimatica', 'ofimática', 'excel', 'word', 'office', 'software', 'redes', 'soporte tecnico'
    ]
  },
  {
    id: 'gastronomia',
    label: 'Gastronomía y Alimentos',
    shortLabel: 'Gastronomía',
    icon: 'ri-cake-3-line',
    keywords: [
      'gastronomia', 'gastronomía', 'cocina', 'cocinero', 'chef', 'reposteria', 'repostería',
      'panaderia', 'panadería', 'pasteleria', 'pastelería', 'alimentos', 'bebidas', 'platillos',
      'postres', 'repostero', 'panadero'
    ]
  },
  {
    id: 'textil',
    label: 'Textil y Confección',
    shortLabel: 'Textil',
    icon: 'ri-shirt-line',
    keywords: [
      'textil', 'confeccion', 'confección', 'costura', 'corte y confeccion', 'corte y confección',
      'diseño de modas', 'patronaje', 'modista', 'sastre', 'ropa', 'prendas', 'costurera', 'telas'
    ]
  },
  {
    id: 'administracion',
    label: 'Administración y Contabilidad',
    shortLabel: 'Administración',
    icon: 'ri-briefcase-line',
    keywords: [
      'administracion', 'administración', 'administrador', 'contabilidad', 'contable', 'finanzas',
      'recursos humanos', 'rh', 'negocios', 'gestion', 'gestión', 'auxiliar contable'
    ]
  },
  {
    id: 'idiomas',
    label: 'Idiomas (Inglés)',
    shortLabel: 'Idiomas',
    icon: 'ri-global-line',
    keywords: [
      'idiomas', 'idioma', 'ingles', 'inglés', 'english', 'conversacion', 'conversación',
      'gramatica', 'frances', 'francés'
    ]
  },
  {
    id: 'electricidad',
    label: 'Electricidad y Electrónica',
    shortLabel: 'Electricidad',
    icon: 'ri-flashlight-line',
    keywords: [
      'electricidad', 'electrico', 'eléctrico', 'electronica', 'electrónica',
      'instalaciones electricas', 'circuitos', 'electricista'
    ]
  },
  {
    id: 'soldadura',
    label: 'Soldadura y Pailería',
    shortLabel: 'Soldadura',
    icon: 'ri-fire-line',
    keywords: [
      'soldadura', 'soldar', 'herreria', 'herrería', 'paileria', 'pailería', 'soldador'
    ]
  },
  {
    id: 'refrigeracion',
    label: 'Refrigeración y Climas',
    shortLabel: 'Refrigeración',
    icon: 'ri-temp-cold-line',
    keywords: [
      'refrigeracion', 'refrigeración', 'climas', 'aire acondicionado', 'refrigerador'
    ]
  }
];

/**
 * Obtiene el objeto de especialidad correspondiente a una clave de categoría o texto.
 * @param {string} categoryKey 
 * @returns {object|null}
 */
export function getSpecialtyInfo(categoryKey) {
  if (!categoryKey) return null;
  const keyNorm = normalizeText(categoryKey);
  return SPECIALTIES.find(s => normalizeText(s.id) === keyNorm || normalizeText(s.shortLabel) === keyNorm) || null;
}

/**
 * Obtiene la etiqueta visible amigable de una categoría.
 * @param {string} categoryKey 
 * @returns {string}
 */
export function getCategoryLabel(categoryKey) {
  if (!categoryKey) return 'General';
  const found = getSpecialtyInfo(categoryKey);
  if (found) return found.label;
  return categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1);
}

/**
 * Obtiene el icono de RemixIcon para una categoría.
 * @param {string} categoryKey 
 * @returns {string}
 */
export function getCategoryIcon(categoryKey) {
  if (!categoryKey) return 'ri-book-open-line';
  const found = getSpecialtyInfo(categoryKey);
  return found ? found.icon : 'ri-book-open-line';
}

/**
 * Evalúa si un término coincide con una especialidad de forma relevante y precisa.
 */
function isSpecialtyMatch(spec, termNorm) {
  if (!termNorm || termNorm.length < 2) return false;

  const sIdNorm = normalizeText(spec.id);
  const sLabelNorm = normalizeText(spec.label);
  const sShortNorm = normalizeText(spec.shortLabel);

  if (sIdNorm.startsWith(termNorm) || sLabelNorm.startsWith(termNorm) || sShortNorm.startsWith(termNorm)) {
    return true;
  }

  if (termNorm.length >= 3 && (sIdNorm.includes(termNorm) || sLabelNorm.includes(termNorm) || sShortNorm.includes(termNorm))) {
    return true;
  }

  // Verificar palabras clave con coincidencia precisa
  return spec.keywords.some(k => {
    const kNorm = normalizeText(k);
    if (kNorm.startsWith(termNorm)) return true;
    if (termNorm.length >= 4 && kNorm.includes(termNorm)) return true;
    return false;
  });
}

/**
 * Evalúa si un curso coincide con un término de búsqueda ignorando acentos y mayúsculas/minúsculas.
 * @param {object} course 
 * @param {string} searchTerm 
 * @returns {boolean}
 */
export function courseMatchesSearch(course, searchTerm) {
  if (!searchTerm || !searchTerm.trim()) return true;
  if (!course) return false;

  const termNorm = normalizeText(searchTerm);
  if (!termNorm) return true;

  // 1. Coincidencia en título del curso
  if (normalizeText(course.title).includes(termNorm)) return true;

  // 2. Coincidencia directa en categoría
  const catNorm = normalizeText(course.category);
  if (catNorm.includes(termNorm)) return true;

  // 3. Diccionario de especialidades
  const matchedSpecialties = SPECIALTIES.filter(s => isSpecialtyMatch(s, termNorm));
  const isCourseInMatchedSpecialty = matchedSpecialties.some(s => normalizeText(s.id) === catNorm);
  if (isCourseInMatchedSpecialty) return true;

  // 4. Perfil de egreso / descripción
  if (course.profile && normalizeText(course.profile).includes(termNorm)) return true;

  // 5. Temario (syllabus)
  if (Array.isArray(course.syllabus) && course.syllabus.some(mod => normalizeText(mod).includes(termNorm))) {
    return true;
  }

  // 6. Instructor / Profesor
  if (course.instructor && normalizeText(course.instructor).includes(termNorm)) return true;

  // 7. Horario o Turno
  if (course.schedule && normalizeText(course.schedule).includes(termNorm)) return true;
  if (course.shift && normalizeText(course.shift).includes(termNorm)) return true;

  return false;
}

/**
 * Obtiene sugerencias simplificadas y limpias para el buscador.
 * @param {Array} courses 
 * @param {string} query 
 * @param {number} maxCourses 
 * @returns {{ specialty: Object|null, courses: Array }}
 */
export function getSearchSuggestions(courses = [], query = '', maxCourses = 5) {
  if (!query || !query.trim()) {
    return { specialty: null, courses: [] };
  }

  const termNorm = normalizeText(query);
  if (!termNorm || termNorm.length < 2) return { specialty: null, courses: [] };

  // Buscar si coincide con una especialidad específica relevante
  const matchedSpec = SPECIALTIES.find(s => isSpecialtyMatch(s, termNorm));
  let specialtyInfo = null;

  if (matchedSpec) {
    const count = courses.filter(c => normalizeText(c.category) === normalizeText(matchedSpec.id)).length;
    specialtyInfo = {
      ...matchedSpec,
      courseCount: count
    };
  }

  // Buscar cursos coincidentes (ordenando por prioridad: primero los del título, luego categoría)
  const matchingCourses = courses
    .filter(c => courseMatchesSearch(c, query))
    .slice(0, maxCourses);

  return {
    specialty: specialtyInfo,
    courses: matchingCourses
  };
}
