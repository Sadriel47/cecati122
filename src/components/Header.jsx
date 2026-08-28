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
    <header className={`header ${isScrolled ? 'bg-header' : ''}`} id="header">
      <nav className="nav container">
        <Link to="/" className="nav__logo" onClick={closeMenu}>
          <img src="/assets/img/logo-cecati.webp" alt="Logo CECATI 122" />
        </Link>

        <div className={`nav__menu ${showMenu ? 'show-menu' : ''}`} id="nav-menu">
          <ul className="nav__list">
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

          {/* Close button */}
          <div className="nav__close" id="nav-close" onClick={closeMenu}>
            <i className="ri-close-large-line"></i>
          </div>
        </div>

        <div className="nav__buttons flex items-center gap-2 sm:gap-3 shrink-0">
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

          {/* Toggle button (Menú Móvil Garantizado en Vertical y Horizontal) */}
          <button
            type="button"
            className="nav__toggle"
            id="nav-toggle"
            onClick={() => setShowMenu(true)}
            aria-label="Abrir menú de navegación"
            title="Abrir Menú"
          >
            <i className="ri-menu-line text-xl"></i>
          </button>
        </div>
      </nav>
    </header>
  );
}
