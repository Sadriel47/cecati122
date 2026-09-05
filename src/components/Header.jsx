import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const [theme, setTheme] = useState('light');
  const location = useLocation();
  const { user, isAdmin, logout } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);

  // Initialize theme from localStorage or system preferences
  useEffect(() => {
    const selectedTheme = localStorage.getItem('selected-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (selectedTheme === 'dark' || (!selectedTheme && systemPrefersDark)) {
      document.body.classList.add('dark-theme');
      setTheme('dark');
    } else {
      document.body.classList.remove('dark-theme');
      setTheme('light');
    }
  }, []);

  // Listen to system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleThemeChange = (e) => {
      const selectedTheme = localStorage.getItem('selected-theme');
      if (!selectedTheme) {
        if (e.matches) {
          document.body.classList.add('dark-theme');
          setTheme('dark');
        } else {
          document.body.classList.remove('dark-theme');
          setTheme('light');
        }
      }
    };

    mediaQuery.addEventListener('change', handleThemeChange);
    return () => mediaQuery.removeEventListener('change', handleThemeChange);
  }, []);

  // Add scroll listener for header background coloring
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    if (theme === 'light') {
      document.body.classList.add('dark-theme');
      localStorage.setItem('selected-theme', 'dark');
      setTheme('dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('selected-theme', 'light');
      setTheme('light');
    }
  };

  const closeMenu = () => {
    setShowMenu(false);
  };

  return (
    <header className={`header ${isScrolled ? 'bg-header shadow-md' : ''} fixed top-0 w-full z-50 transition-all duration-300`} id="header">
      <nav className="nav flex items-center justify-between w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5">
        <Link to="/" className="nav__logo flex items-center py-1 group" onClick={closeMenu}>
          <img
            src="/assets/img/logo-cecati.webp"
            alt="Logo CECATI 122"
            className="h-10 sm:h-12 md:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        <div className={`nav__menu ${showMenu ? 'absolute top-full left-4 right-4 mt-2 p-5 rounded-2xl bg-zinc-950/95 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col gap-4 z-50 md:hidden' : 'max-md:hidden'}`} id="nav-menu">
          <ul className="nav__list md:flex md:items-center md:gap-6">
            <li>
              <Link
                to="/"
                className={`nav__link ${location.pathname === '/' ? 'active-link' : ''}`}
                onClick={closeMenu}
              >
                Inicio
              </Link>
            </li>
            <li>
              <Link
                to="/nosotros"
                className={`nav__link ${location.pathname === '/nosotros' ? 'active-link' : ''}`}
                onClick={closeMenu}
              >
                Nosotros
              </Link>
            </li>
            <li>
              <Link
                to="/cursos"
                className={`nav__link ${location.pathname === '/cursos' ? 'active-link' : ''}`}
                onClick={closeMenu}
              >
                Cursos
              </Link>
            </li>
            <li>
              <Link
                to="/blog"
                className={`nav__link ${location.pathname.startsWith('/blog') ? 'active-link' : ''}`}
                onClick={closeMenu}
              >
                Noticias
              </Link>
            </li>

            {/* RENDERIZADO CONDICIONAL POR ROL (DEFAULT-DENY) */}
            {isAdmin && (
              <li>
                <Link
                  to="/admin"
                  className={`nav__link ${location.pathname === '/admin' ? 'active-link' : ''} py-1.5 px-3.5 rounded-full bg-cecati text-white font-bold ml-2.5 hover:bg-cecati-hover transition-all duration-300 inline-flex items-center gap-1.5 text-xs shadow-md`}
                  onClick={closeMenu}
                >
                  <i className="ri-shield-user-line"></i>
                  <span>Panel Admin</span>
                </Link>
              </li>
            )}
          </ul>

          {/* Close button (Hidden as dropdown auto-closes) */}
          <div className="nav__close hidden" id="nav-close" onClick={closeMenu}>
            <i className="ri-close-large-line"></i>
          </div>
        </div>

        <div className="nav__buttons flex items-center gap-2 shrink-0">
          {/* User Session Action / Logout */}
          {user && (
            <button
              onClick={logout}
              className="text-xs font-bold text-red-500 hover:text-red-600 dark:text-red-400 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all flex items-center gap-1 cursor-pointer"
              title="Cerrar Sesión"
            >
              <i className="ri-logout-box-r-line text-lg"></i>
              <span className="hidden sm:inline">Salir</span>
            </button>
          )}

          {/* Theme button */}
          <button
            type="button"
            className="w-9 h-9 rounded-xl bg-white/10 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200/20 dark:border-gray-700/60 text-white flex items-center justify-center text-lg hover:scale-105 transition-all cursor-pointer"
            id="theme-button"
            onClick={toggleTheme}
            aria-label="Cambiar tema de color"
            title="Cambiar Tema"
          >
            <i className={`ri-${theme === 'dark' ? 'sun' : 'moon'}-fill nav__theme`}></i>
          </button>

          {/* Toggle button (Menú Móvil) */}
          <button
            type="button"
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-rose-700 text-white hover:bg-rose-800 transition-colors shrink-0 md:hidden"
            id="nav-toggle"
            onClick={() => setShowMenu(!showMenu)}
            aria-label="Alternar menú de navegación"
            title="Alternar Menú"
          >
            <i className={`ri-${showMenu ? 'close-line' : 'menu-line'} text-xl`}></i>
          </button>
        </div>
      </nav>
    </header>
  );
}
