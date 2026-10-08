import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSiteConfig } from '../../context/SiteConfigContext';

/**
 * Genera la lista de enlaces a redes sociales accesibles y normalizados
 * siguiendo los principios de accesibilidad WCAG 2.1 (A11y).
 */
function getHeroSocialLinks(config = {}, getWhatsAppLink) {
  const providers = [
    {
      id: 'facebook',
      name: 'Facebook',
      label: 'Facebook oficial de CECATI 122 (abre en pestaña nueva)',
      url: config.facebook || 'https://www.facebook.com/cecati122',
      icon: 'ri-facebook-fill',
      colorHover: 'hover:text-[#1877f2] hover:border-[#1877f2]/50 hover:bg-[#1877f2]/10',
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      label: 'WhatsApp directo de CECATI 122 (abre en pestaña nueva)',
      url: config.whatsapp ? getWhatsAppLink('Hola, quisiera recibir información sobre los cursos') : 'https://wa.me/524426617408',
      icon: 'ri-whatsapp-line',
      colorHover: 'hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-500/10',
    },
    {
      id: 'instagram',
      name: 'Instagram',
      label: 'Instagram oficial de CECATI 122 (abre en pestaña nueva)',
      url: config.instagram || 'https://www.instagram.com/cecati122tx/',
      icon: 'ri-instagram-line',
      colorHover: 'hover:text-pink-400 hover:border-pink-500/50 hover:bg-pink-500/10',
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      label: 'TikTok oficial de CECATI 122 (abre en pestaña nueva)',
      url: config.tiktok || 'https://www.tiktok.com/search?q=cecati%20122',
      icon: 'ri-tiktok-fill',
      colorHover: 'hover:text-white hover:border-white/50 hover:bg-white/10',
    },
    {
      id: 'youtube',
      name: 'YouTube',
      label: 'Canal de YouTube oficial de CECATI 122 (abre en pestaña nueva)',
      url: config.youtube || 'https://www.youtube.com/@cecati122onlinetx4',
      icon: 'ri-youtube-fill',
      colorHover: 'hover:text-red-400 hover:border-red-500/50 hover:bg-red-500/10',
    },
  ];

  return providers.filter((p) => typeof p.url === 'string' && p.url.trim() !== '');
}

/**
 * Elemento Visual Secundario del Hero
 * Muestra una vista previa limpia y sobria de la noticia o aviso institucional
 * sin competir con el titular principal.
 */
function HeroNewsPreview({ featuredPosts = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const posts = useMemo(() => {
    if (featuredPosts && featuredPosts.length > 0) {
      return featuredPosts;
    }
    return [
      {
        id: 'default',
        title: 'Inscripciones Abiertas: Nuevos Ciclos y Talleres Prácticos',
        category: 'Aviso Oficial',
        featuredImage: '/assets/img/home-img-2.jpg',
        slug: '',
      },
    ];
  }, [featuredPosts]);

  const currentPost = posts[currentIndex] || posts[0];
  const postUrl = currentPost.slug || currentPost.id ? `/blog/${currentPost.slug || currentPost.id}` : '/blog';
  const postImg =
    currentPost.featuredImage ||
    currentPost.imageUrl ||
    currentPost.image ||
    currentPost.coverImage ||
    currentPost.photoUrl ||
    currentPost.url ||
    '/assets/img/home-img-2.jpg';

  const handleNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % posts.length);
  };

  const handlePrev = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + posts.length) % posts.length);
  };

  return (
    <div className="w-full max-w-md mx-auto lg:max-w-none">
      <Link
        to={postUrl}
        className="group block relative rounded-2xl overflow-hidden border border-white/15 bg-zinc-900/60 backdrop-blur-md shadow-xl hover:border-white/30 focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:outline-none transition-all duration-300"
        aria-label={`Ver aviso: ${currentPost.title}`}
      >
        {/* Marco de Imagen Nítida */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-950">
          <img
            key={postImg}
            src={postImg}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/assets/img/home-img-2.jpg';
            }}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />

          {/* Badge Discreto de Categoría */}
          <div className="absolute top-3 left-3 z-10">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/70 text-white backdrop-blur-md border border-white/20">
              {currentPost.pinned ? 'Noticia Destacada' : currentPost.category || 'Aviso Oficial'}
            </span>
          </div>

          {/* Paginación si hay más de una noticia */}
          {posts.length > 1 && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1 z-10 bg-black/70 backdrop-blur-md px-2 py-1 rounded-full border border-white/20">
              <button
                type="button"
                onClick={handlePrev}
                className="w-5 h-5 rounded-full hover:bg-white/25 text-white flex items-center justify-center text-xs transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                title="Aviso anterior"
                aria-label="Aviso anterior"
              >
                <i className="ri-arrow-left-s-line" aria-hidden="true"></i>
              </button>
              <span className="text-[10px] font-mono text-zinc-300 px-1" aria-hidden="true">
                {currentIndex + 1}/{posts.length}
              </span>
              <button
                type="button"
                onClick={handleNext}
                className="w-5 h-5 rounded-full hover:bg-white/25 text-white flex items-center justify-center text-xs transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                title="Siguiente aviso"
                aria-label="Siguiente aviso"
              >
                <i className="ri-arrow-right-s-line" aria-hidden="true"></i>
              </button>
            </div>
          )}
        </div>

        {/* Pie Informativo Discreto */}
        <div className="p-3.5 flex items-center justify-between gap-3">
          <p className="text-xs sm:text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors line-clamp-1 flex-1">
            {currentPost.title}
          </p>
          <span className="text-xs font-bold text-red-400 group-hover:text-red-300 transition-colors flex items-center gap-0.5 shrink-0" aria-hidden="true">
            <span>Ver aviso</span>
            <i className="ri-arrow-right-s-line"></i>
          </span>
        </div>
      </Link>
    </div>
  );
}

/**
 * Hero Section Minimalista, Institucional y Accesible
 * Prioridad visual clara:
 * 1. Inscripciones abiertas / CECATI 122
 * 2. CTA principal
 * 3. Redes sociales accesibles
 * 4. Elemento visual secundario
 */
export function HeroSection({ featuredPosts = [] }) {
  const { config, getWhatsAppLink } = useSiteConfig();

  const socialLinks = useMemo(
    () => getHeroSocialLinks(config, getWhatsAppLink),
    [config, getWhatsAppLink]
  );

  return (
    <section
      className="relative min-h-[82vh] flex items-center justify-center pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
      id="home"
      aria-label="Sección de bienvenida e inscripciones"
    >
      {/* Imagen de Fondo Institucional con Overlay Sobrio */}
      <img
        src="/assets/img/home.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-zinc-950/80 to-zinc-950 backdrop-blur-sm pointer-events-none"></div>

      {/* Acento de luz rojo muy sutil detrás del contenido */}
      <div className="absolute -left-20 top-1/3 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Contenedor Principal */}
      <div className="relative z-10 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* 1. Columna Principal: Mensaje Central, CTA y Redes Sociales */}
        <div className="lg:col-span-7 text-center lg:text-left space-y-6">
          {/* Badge Institucional SEP */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/25 text-xs md:text-sm font-semibold text-white shadow-lg shadow-black/20">
              <i className="ri-award-line text-red-400 text-lg" aria-hidden="true"></i>
              <span>Educación Técnica Oficial | DGCFT - SEP</span>
            </div>
          </div>

          {/* Titular Protagonista */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Inscripciones abiertas <span className="block mt-1">CECATI <span className="text-[#B41A47] dark:text-red-400">122</span></span>
          </h1>

          {/* Texto Descriptivo Conciso */}
          <p className="text-base sm:text-lg text-zinc-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
            Capacitación técnica de alta calidad con certificaciones oficiales de la SEP para potenciar tu perfil profesional y emprendimiento.
          </p>

          {/* Fila de Acción Principal y Redes Sociales Accesibles */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6">
            {/* CTA Principal */}
            <Link
              to="/cursos"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-cecati text-white font-extrabold text-sm sm:text-base shadow-xl shadow-red-950/40 hover:bg-cecati-hover hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 focus-visible:outline-none transition-all duration-300 cursor-pointer"
            >
              <span>Explorar Catálogo de Cursos</span>
              <i className="ri-arrow-right-line text-lg" aria-hidden="true"></i>
            </Link>

            {/* Redes Sociales Accesibles (Secundarias) */}
            {socialLinks.length > 0 && (
              <nav
                aria-label="Redes sociales oficiales de CECATI 122"
                className="flex items-center gap-2 pt-1 sm:pt-0"
              >
                <span className="text-xs font-semibold text-zinc-400 mr-1 hidden sm:inline" aria-hidden="true">
                  Síguenos:
                </span>
                {socialLinks.map((social) => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    title={social.name}
                    className={`w-10 h-10 rounded-full bg-white/5 border border-white/15 text-zinc-300 ${social.colorHover} focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 focus-visible:outline-none transition-all duration-200 flex items-center justify-center text-base`}
                  >
                    <i className={social.icon} aria-hidden="true"></i>
                  </a>
                ))}
              </nav>
            )}
          </div>
        </div>

        {/* 2. Columna Secundaria: Elemento Visual de Noticia/Aviso */}
        <div className="lg:col-span-5 w-full">
          <HeroNewsPreview featuredPosts={featuredPosts} />
        </div>
      </div>
    </section>
  );
}
