import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Footer() {
  const { isAdmin } = useAuth();

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 border-t border-gray-800 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-gray-800">
          
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-block">
              <img 
                src="/assets/img/logo.svg" 
                alt="Logo CECATI 122" 
                className="h-12 w-auto invert brightness-200" 
              />
            </Link>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-light">
              Centro de Capacitación para el Trabajo Industrial No. 122. Impulsando la educación técnica y el desarrollo laboral con respaldo oficial de la SEP.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800 text-xs text-gray-300 border border-gray-700">
              <i className="ri-award-line text-red-400"></i>
              <span>Reconocimiento Oficial DGCFT - SEP</span>
            </div>
          </div>

          {/* Quick Links Col */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-white font-bold text-base tracking-wide">Navegación Rápida</h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-1.5">
                  <i className="ri-arrow-right-s-line text-red-400"></i>
                  <span>Inicio</span>
                </Link>
              </li>
              <li>
                <Link to="/nosotros" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-1.5">
                  <i className="ri-arrow-right-s-line text-red-400"></i>
                  <span>Acerca de Nosotros</span>
                </Link>
              </li>
              <li>
                <Link to="/cursos" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-1.5">
                  <i className="ri-arrow-right-s-line text-red-400"></i>
                  <span>Catálogo de Cursos</span>
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-1.5">
                  <i className="ri-arrow-right-s-line text-red-400"></i>
                  <span>Noticias y Avisos</span>
                </Link>
              </li>

              {/* RENDERIZADO CONDICIONAL POR ROL (DEFAULT-DENY) */}
              {isAdmin && (
                <li>
                  <Link to="/admin" className="text-red-400 font-bold hover:text-red-300 hover:translate-x-1 transition-all inline-flex items-center gap-1.5">
                    <i className="ri-shield-user-line text-red-400"></i>
                    <span>Panel de Administración</span>
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Contact Col */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-white font-bold text-base tracking-wide">Atención y Contacto</h3>
            <ul className="space-y-3 text-xs sm:text-sm text-gray-400">
              <li className="flex items-start gap-2.5">
                <i className="ri-map-pin-2-fill text-red-500 text-base shrink-0 mt-0.5"></i>
                <span>Av. Venustiano Carranza 22, Tequisquiapan, Qro.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <i className="ri-phone-fill text-blue-400 text-base shrink-0"></i>
                <span>+52 414 273 1601</span>
              </li>
              <li className="flex items-center gap-2.5">
                <i className="ri-time-line text-amber-400 text-base shrink-0"></i>
                <span>Lun - Vie: 7:00 am - 9:00 pm</span>
              </li>
              <li className="flex items-center gap-2.5">
                <i className="ri-mail-fill text-emerald-400 text-base shrink-0"></i>
                <span className="break-all">cecati122.dir@dgcft.sems.gob.mx</span>
              </li>
            </ul>
          </div>

          {/* Social Links Col */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-white font-bold text-base tracking-wide">Redes Sociales</h3>
            <p className="text-xs text-gray-400">Síguenos en nuestras comunidades oficiales:</p>
            <div className="flex flex-wrap gap-2.5">
              <a 
                href="https://www.facebook.com/cecati122" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Facebook"
                className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 text-gray-300 hover:bg-[#1877f2] hover:text-white hover:-translate-y-1 transition-all flex items-center justify-center text-lg"
              >
                <i className="ri-facebook-fill"></i>
              </a>
              <a 
                href="https://www.instagram.com/cecati122tx/" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-500 hover:to-purple-600 hover:text-white hover:-translate-y-1 transition-all flex items-center justify-center text-lg"
              >
                <i className="ri-instagram-fill"></i>
              </a>
              <a 
                href="https://www.tiktok.com/search?q=cecati%20122&t=1755982982608" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="TikTok"
                className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 text-gray-300 hover:bg-black hover:text-white hover:-translate-y-1 transition-all flex items-center justify-center text-lg"
              >
                <i className="ri-tiktok-fill"></i>
              </a>
              <a 
                href="https://www.youtube.com/@cecati122onlinetx4" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="YouTube"
                className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 text-gray-300 hover:bg-red-600 hover:text-white hover:-translate-y-1 transition-all flex items-center justify-center text-lg"
              >
                <i className="ri-youtube-fill"></i>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Ribbon */}
        <div className="pt-8 text-center text-xs text-gray-500 space-y-2">
          <p>© {new Date().getFullYear()} CECATI 122 • Dirección General de Centros de Formación para el Trabajo (DGCFT - SEP).</p>
          <p className="font-medium text-gray-400">
            Desarrollado por <span className="text-gray-300">Gerardo Cruz Gudiño</span> & <span className="text-gray-300">Carlos Enrique Villarreal Barrón</span>.
          </p>
        </div>
      </div>
    </footer>
  );
}
