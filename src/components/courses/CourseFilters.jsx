import { useState, useRef, useEffect, useMemo } from 'react';
import { getSearchSuggestions, getCategoryLabel, getCategoryIcon } from '../../utils/searchUtils';
import { getShiftBadge } from '../../utils/dateUtils';

export function CategoryBar({ category, setCategory }) {
  const scrollRef = useRef(null);

  const categories = [
    { id: 'todos', label: 'Todos los Cursos', icon: 'ri-apps-2-line' },
    { id: 'tecnologia', label: 'Tecnología', icon: 'ri-computer-line' },
    { id: 'textil', label: 'Textil y Confección', icon: 'ri-shirt-line' },
    { id: 'gastronomia', label: 'Gastronomía', icon: 'ri-cake-3-line' },
    { id: 'administracion', label: 'Administración', icon: 'ri-briefcase-line' },
    { id: 'automotriz', label: 'Automotriz', icon: 'ri-tools-line' },
    { id: 'estilismo', label: 'Estilismo y Belleza', icon: 'ri-scissors-line' },
    { id: 'idiomas', label: 'Idiomas', icon: 'ri-global-line' },
  ];

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -250 : 250;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative flex items-center group/cat">
      <button
        type="button"
        onClick={() => handleScroll('left')}
        aria-label="Desplazar a la izquierda"
        className="absolute -left-3 z-30 w-8 h-8 rounded-full bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 shadow-md hover:bg-cecati hover:text-white dark:hover:bg-cecati dark:hover:text-white transition-all flex items-center justify-center cursor-pointer opacity-0 group-hover/cat:opacity-100 focus:opacity-100"
      >
        <i className="ri-arrow-left-s-line text-lg"></i>
      </button>

      <div
        ref={scrollRef}
        className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800 shadow-sm rounded-full p-1.5 flex items-center gap-1 sm:gap-2 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden w-full"
      >
        {categories.map((cat) => {
          const isActive = category === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={`px-4 py-2 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer ${isActive
                ? 'bg-rose-700 text-white shadow-sm'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/70 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-800/70'
                }`}
            >
              <i className={`${cat.icon} text-base`}></i>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => handleScroll('right')}
        aria-label="Desplazar a la derecha"
        className="absolute -right-3 z-30 w-8 h-8 rounded-full bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 shadow-md hover:bg-cecati hover:text-white dark:hover:bg-cecati dark:hover:text-white transition-all flex items-center justify-center cursor-pointer opacity-0 group-hover/cat:opacity-100 focus:opacity-100"
      >
        <i className="ri-arrow-right-s-line text-lg"></i>
      </button>
    </div>
  );
}

export function CourseFilters({
  category,
  setCategory,
  searchTerm,
  setSearchTerm,
  courses = [],
  onSelectCourse
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchContainerRef = useRef(null);

  // Obtener sugerencias simplificadas
  const suggestions = useMemo(() => {
    return getSearchSuggestions(courses, searchTerm, 5);
  }, [courses, searchTerm]);

  const hasQuery = Boolean(searchTerm && searchTerm.trim().length >= 2);
  const hasResults = suggestions.specialty || suggestions.courses.length > 0;
  const showDropdown = isFocused && hasQuery;

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsFocused(false);
        setSelectedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Seleccionar curso directamente
  const handleSelectCourse = (course) => {
    setIsFocused(false);
    setSelectedIndex(-1);
    if (onSelectCourse) {
      onSelectCourse(course);
    }
  };

  // Filtrar por la especialidad sugerida
  const handleSelectSpecialty = (spec) => {
    setSearchTerm(spec.shortLabel || spec.label);
    if (setCategory) {
      setCategory(spec.id);
    }
    setIsFocused(false);
    setSelectedIndex(-1);
  };

  // Navegación con teclado
  const handleKeyDown = (e) => {
    const totalItems = (suggestions.specialty ? 1 : 0) + suggestions.courses.length;
    if (!showDropdown || totalItems === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0) {
        e.preventDefault();
        if (suggestions.specialty && selectedIndex === 0) {
          handleSelectSpecialty(suggestions.specialty);
        } else {
          const courseIdx = suggestions.specialty ? selectedIndex - 1 : selectedIndex;
          if (suggestions.courses[courseIdx]) {
            handleSelectCourse(suggestions.courses[courseIdx]);
          }
        }
      }
    } else if (e.key === 'Escape') {
      setIsFocused(false);
    }
  };

  return (
    <>
      <section className="relative min-h-[48vh] flex items-center justify-center pt-32 pb-14 px-4 border-b border-zinc-200/80 dark:border-transparent z-30 overflow-visible" id="cursos-hero">
        {/* Contenedor de fondo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img
            src="/assets/img/home-img-1.jpg"
            alt="Cursos CECATI 122"
            className="w-full h-full object-cover object-center"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/75 to-black/90 backdrop-blur-xs"></div>
          <div className="hidden dark:block absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent backdrop-blur-sm pointer-events-none"></div>
        </div>

        <div className="relative z-20 max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/25 text-xs sm:text-sm font-semibold text-white shadow-lg">
            <i className="ri-award-fill text-red-400 text-base"></i>
            <span>Catálogo Oficial DGCFT • SEP</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
            Oferta Educativa y <span className="bg-gradient-to-r from-white via-red-200 to-red-400 bg-clip-text text-transparent">Cursos Prácticos</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-200 max-w-2xl mx-auto font-light leading-relaxed">
            Capacitación técnica de alto impacto para el trabajo y el emprendimiento. Diplomas con validez oficial SEP.
          </p>

          <div className="max-w-xl mx-auto pt-3 relative" ref={searchContainerRef}>
            <div className="relative flex items-center">
              <i className="ri-search-line absolute left-4 text-gray-300 text-lg"></i>
              <input
                type="text"
                placeholder="Buscar curso o especialidad (ej. estilismo, mecánica)..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSelectedIndex(-1);
                }}
                onFocus={() => setIsFocused(true)}
                onKeyDown={handleKeyDown}
                className="w-full pl-11 pr-12 py-3.5 rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-white placeholder-gray-300 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-400 focus:bg-zinc-900/95 transition-all shadow-xl"
                autoComplete="off"
                aria-label="Buscar curso o especialidad"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setIsFocused(false);
                  }}
                  aria-label="Limpiar búsqueda"
                  className="absolute right-4 text-gray-300 hover:text-white text-lg transition-colors cursor-pointer"
                >
                  <i className="ri-close-circle-fill"></i>
                </button>
              )}
            </div>

            {/* PANEL DE SUGERENCIAS SIMPLIFICADO */}
            {showDropdown && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-750 text-left overflow-hidden z-50 animate-fade-in divide-y divide-zinc-100 dark:divide-zinc-800">
                {/* 1. Opción rápida si coincide con Especialidad */}
                {suggestions.specialty && (
                  <button
                    type="button"
                    onClick={() => handleSelectSpecialty(suggestions.specialty)}
                    className={`w-full text-left px-4 py-2.5 flex items-center justify-between text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                      selectedIndex === 0
                        ? 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400'
                        : 'bg-zinc-50/80 dark:bg-zinc-800/60 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <i className={`${suggestions.specialty.icon} text-red-500 text-base`}></i>
                      <span>Ver cursos de la especialidad: <strong>{suggestions.specialty.label}</strong></span>
                    </span>
                    <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-700 px-2 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-600 shrink-0 ml-2">
                      {suggestions.specialty.courseCount} {suggestions.specialty.courseCount === 1 ? 'curso' : 'cursos'}
                    </span>
                  </button>
                )}

                {/* 2. Lista limpia de Cursos sugeridos */}
                <div className="p-1.5 sm:p-2 max-h-[320px] overflow-y-auto custom-scrollbar">
                  {!hasResults ? (
                    <div className="py-5 px-4 text-center space-y-1">
                      <p className="text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-300">
                        No se encontraron cursos con "{searchTerm.trim()}"
                      </p>
                    </div>
                  ) : (
                    <ul className="space-y-1">
                      {suggestions.courses.map((course, cIdx) => {
                        const itemIndex = suggestions.specialty ? cIdx + 1 : cIdx;
                        const isSelected = selectedIndex === itemIndex;
                        const shiftBadge = getShiftBadge(course.shift);

                        return (
                          <li key={course.id}>
                            <button
                              type="button"
                              onClick={() => handleSelectCourse(course)}
                              className={`w-full text-left p-2 sm:p-2.5 rounded-xl flex items-center gap-3 transition-colors cursor-pointer group/item ${
                                isSelected
                                  ? 'bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800'
                                  : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/80 border border-transparent'
                              }`}
                            >
                              {/* Miniatura */}
                              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg overflow-hidden shrink-0 bg-zinc-200 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                                <img
                                  src={course.image || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80'}
                                  alt={course.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.src = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80';
                                  }}
                                />
                              </div>

                              {/* Título y datos breves */}
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate group-hover/item:text-red-600 dark:group-hover/item:text-red-400">
                                  {course.title}
                                </h4>
                                <div className="flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400 pt-0.5">
                                  <span>{getCategoryLabel(course.category)}</span>
                                  <span>•</span>
                                  <span className={shiftBadge.colorClass + " font-semibold px-1 rounded text-[10px]"}>
                                    {course.shift || 'Matutino'}
                                  </span>
                                  {course.price && (
                                    <>
                                      <span>•</span>
                                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                        {course.price}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>

                              {/* Flecha simple */}
                              <i className="ri-arrow-right-s-line text-zinc-400 group-hover/item:text-red-600 dark:group-hover/item:text-red-400 text-lg shrink-0"></i>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CATEGORY BAR */}
      {/* Oculto temporalmente a petición del usuario porque hay pocos cursos */}
      {false && (
        <section className="max-w-6xl mx-auto px-4 -mt-6 relative z-20">
          <CategoryBar category={category} setCategory={setCategory} />
        </section>
      )}
    </>
  );
}
