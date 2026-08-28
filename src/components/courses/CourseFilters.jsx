import { useRef } from 'react';

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
        className="w-full p-2 sm:p-3 rounded-2xl sm:rounded-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-xl border border-gray-100 dark:border-gray-700 flex items-center gap-2 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [mask-image:linear-gradient(to_right,transparent_0%,black_4%,black_96%,transparent_100%)]"
      >
        {categories.map((cat) => {
          const isActive = category === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-300 flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer ${isActive
                ? 'bg-cecati text-white shadow-md shadow-red-900/30 dark:bg-cecati dark:text-white dark:shadow-red-950/60 scale-105'
                : 'bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/70 hover:text-gray-900 dark:hover:text-white'
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
  setSearchTerm
}) {
  return (
    <>
      {/* HERO HERO BARS & SEARCH */}
      <section className="relative min-h-[50vh] flex items-center justify-center pt-28 pb-16 px-4 overflow-hidden bg-gradient-to-br from-[#5C0A22] via-[#12161F] to-[#8B1336]" id="home">
        <img
          src="/assets/img/home-img-1.jpg"
          alt="Cursos CECATI 122"
          className="absolute inset-0 w-full h-full object-cover object-center"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-gray-900 backdrop-blur-sm"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/25 text-xs sm:text-sm font-semibold text-white shadow-lg">
            <i className="ri-award-fill text-red-400 text-base"></i>
            <span>Catálogo Oficial DGCFT • SEP</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
            Oferta Educativa y <span className="bg-gradient-to-r from-white via-red-200 to-red-400 bg-clip-text text-transparent">Cursos Prácticos</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-200 max-w-2xl mx-auto font-light leading-relaxed">
            Capacitación técnica de alto impacto para el trabajo y el emprendimiento. Diplomas con validez oficial otorgada por la SEP.
          </p>

          <div className="max-w-xl mx-auto pt-4">
            <div className="relative flex items-center">
              <i className="ri-search-line absolute left-4 text-gray-400 text-lg"></i>
              <input
                type="text"
                placeholder="Buscar curso por nombre, clave o contenido..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-10 py-3.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:bg-black/40 transition-all shadow-xl"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 text-gray-300 hover:text-white text-base cursor-pointer"
                >
                  <i className="ri-close-circle-fill"></i>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY BAR */}
      <section className="max-w-6xl mx-auto px-4 -mt-6 relative z-20">
        <CategoryBar category={category} setCategory={setCategory} />
      </section>
    </>
  );
}
