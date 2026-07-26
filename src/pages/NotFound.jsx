import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function NotFound() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = '404 - Página No Encontrada | CECATI 122';
  }, []);

  return (
    <section className="min-h-[calc(100vh-140px)] flex items-center justify-center py-16 px-4 bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-[#0D0D0E] dark:via-[#161618] dark:to-[#0D0D0E] transition-colors duration-300">
      <div className="max-w-3xl w-full text-center space-y-8">
        {/* Animated Badge & Glowing 404 Number */}
        <div className="relative inline-block">
          <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-red-500/20 via-cecati-light/20 to-amber-500/20 blur-xl animate-pulse"></div>
          
          <div className="relative flex flex-col items-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/50 shadow-sm mb-4">
              <i className="ri-error-warning-fill text-red-500"></i>
              Error 404 - Ruta Inexistente
            </span>

            <h1 className="text-8xl sm:text-9xl font-extrabold tracking-tight bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 dark:from-red-400 dark:via-rose-400 dark:to-amber-400 bg-clip-text text-transparent drop-shadow-sm select-none">
              404
            </h1>
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-3 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            ¡Ups! Página no encontrada
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed">
            La página que estás intentando consultar no existe o fue trasladada.
          </p>

          {/* Requested Path Callout */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gray-100 dark:bg-[#1E222D] border border-gray-200 dark:border-gray-800 text-xs sm:text-sm font-mono text-gray-700 dark:text-gray-300 max-w-full overflow-hidden text-ellipsis">
            <i className="ri-compass-3-line text-cecati"></i>
            <span className="truncate">{location.pathname}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#161618] hover:bg-gray-50 dark:hover:bg-[#222225] text-gray-700 dark:text-gray-300 font-semibold text-sm transition-all duration-200 inline-flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <i className="ri-arrow-left-line"></i>
            Regresar
          </button>

          <Link
            to="/"
            className="px-6 py-2.5 rounded-xl bg-cecati hover:bg-cecati-hover text-white font-semibold text-sm transition-all duration-200 inline-flex items-center gap-2 shadow-md hover:shadow-lg shadow-cecati/20"
          >
            <i className="ri-home-4-line"></i>
            Ir al Inicio
          </Link>
        </div>

        {/* Quick Links suggestions */}
        <div className="pt-8 border-t border-gray-200/80 dark:border-gray-800/80 max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500 mb-4">
            Enlaces recomendados
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              to="/"
              className="p-4 rounded-xl border border-gray-200/60 dark:border-gray-800/60 bg-white/70 dark:bg-[#161618]/70 hover:bg-white dark:hover:bg-[#161618] hover:border-cecati/40 dark:hover:border-cecati/40 transition-all duration-200 group text-left shadow-xs"
            >
              <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950/40 text-cecati flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <i className="ri-home-line text-lg"></i>
              </div>
              <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-200 group-hover:text-cecati transition-colors">
                Inicio
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Página principal del plantel
              </p>
            </Link>

            <Link
              to="/cursos"
              className="p-4 rounded-xl border border-gray-200/60 dark:border-gray-800/60 bg-white/70 dark:bg-[#161618]/70 hover:bg-white dark:hover:bg-[#161618] hover:border-cecati/40 dark:hover:border-cecati/40 transition-all duration-200 group text-left shadow-xs"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <i className="ri-book-open-line text-lg"></i>
              </div>
              <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-200 group-hover:text-cecati transition-colors">
                Cursos
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Explora la oferta educativa
              </p>
            </Link>

            <Link
              to="/nosotros"
              className="p-4 rounded-xl border border-gray-200/60 dark:border-gray-800/60 bg-white/70 dark:bg-[#161618]/70 hover:bg-white dark:hover:bg-[#161618] hover:border-cecati/40 dark:hover:border-cecati/40 transition-all duration-200 group text-left shadow-xs"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <i className="ri-building-4-line text-lg"></i>
              </div>
              <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-200 group-hover:text-cecati transition-colors">
                Nosotros
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Conoce sobre nuestra institución
              </p>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
