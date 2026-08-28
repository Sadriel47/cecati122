import { useRef } from 'react';

export function CategoryFilterBar({ category, setCategory }) {
  const scrollRef = useRef(null);

  const categories = [
    { id: 'todos', label: 'Todos los Cursos', icon: 'ri-apps-line' },
    { id: 'tecnologia', label: 'Tecnología', icon: 'ri-computer-line' },
    { id: 'textil', label: 'Confección Textil', icon: 'ri-shirt-line' },
    { id: 'gastronomia', label: 'Gastronomía', icon: 'ri-cake-3-line' },
    { id: 'administracion', label: 'Administración', icon: 'ri-briefcase-line' },
    { id: 'automotriz', label: 'Mecánica Automotriz', icon: 'ri-car-line' }
  ];

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative flex items-center group/cat">
      <button
        onClick={() => handleScroll('left')}
        className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-cecati hover:text-white transition-all flex items-center justify-center text-lg z-10 shrink-0 cursor-pointer mr-1"
        aria-label="Scroll Izquierda"
      >
        ‹
      </button>

      <div
        ref={scrollRef}
        className="flex items-center gap-2 overflow-x-auto scroll-smooth py-1 px-1 scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden w-full [mask-image:linear-gradient(to_right,transparent,black_16px,black_calc(100%-16px),transparent)]"
      >
        {categories.map((cat) => {
          const isActive = category === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`whitespace-nowrap shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-cecati text-white shadow-lg shadow-red-900/30 scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-cecati hover:text-cecati dark:hover:text-red-400'
              }`}
            >
              <i className={`${cat.icon} text-sm`}></i>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      <button
        onClick={() => handleScroll('right')}
        className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-cecati hover:text-white transition-all flex items-center justify-center text-lg z-10 shrink-0 cursor-pointer ml-1"
        aria-label="Scroll Derecha"
      >
        ›
      </button>
    </div>
  );
}
