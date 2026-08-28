import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../services/postsService';

const CATEGORIES = [
  'Todas',
  'Avisos Importantes',
  'Noticias Generales',
  'Eventos y Actividades',
  'Logros y Reconocimientos'
];

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    document.title = "Noticias y Avisos - CECATI 122";
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await getPosts();
      setPosts(data);
    } catch (err) {
      console.error("Error al cargar publicaciones:", err);
    } finally {
      setLoading(false);
    }
  };

  const matchesCategory = (post) => {
    if (!selectedCategory || selectedCategory === 'Todas' || selectedCategory.toLowerCase() === 'all') {
      return true;
    }
    return (post.category?.toLowerCase() || '') === selectedCategory.toLowerCase();
  };

  const matchesSearch = (post) => {
    const query = (searchTerm || '').trim().toLowerCase();
    if (!query) return true;
    return (
      (post.title?.toLowerCase() || '').includes(query) ||
      (post.content?.toLowerCase() || post.summary?.toLowerCase() || post.excerpt?.toLowerCase() || '').includes(query)
    );
  };

  const filteredPosts = posts.filter(post => matchesCategory(post) && matchesSearch(post));

  const hasSearch = Boolean(searchTerm && searchTerm.trim().length > 0);

  const pinnedPost = (!hasSearch && (selectedCategory === 'Todas' || selectedCategory.toLowerCase() === 'all'))
    ? filteredPosts.find(p => p.pinned)
    : null;

  const regularPosts = pinnedPost
    ? filteredPosts.filter(p => p.id !== pinnedPost.id)
    : filteredPosts;

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'Avisos Importantes':
        return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
      case 'Eventos y Actividades':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
      case 'Logros y Reconocimientos':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'Noticias Generales':
      default:
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return new Intl.DateTimeFormat('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  return (
    <main className="main overflow-hidden bg-white dark:bg-zinc-950 transition-colors duration-300">

      <section className="relative min-h-[50vh] flex items-center justify-center pt-28 pb-16 px-4 overflow-hidden border-b border-zinc-200/80 dark:border-transparent" id="blog-hero">
        {/* Background Image */}
        <img
          src="/assets/img/home-img-3.jpg"
          alt="Noticias CECATI 122"
          className="absolute inset-0 w-full h-full object-cover object-center"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/85 backdrop-blur-sm"></div>
        <div className="hidden dark:block absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent backdrop-blur-sm pointer-events-none z-10"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/25 text-xs sm:text-sm font-semibold text-white shadow-lg">
            <i className="ri-newspaper-line text-red-400 text-base"></i>
            <span>Portal de Comunicación Institucional</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
            Noticias y Avisos <span className="bg-gradient-to-r from-white via-red-200 to-red-400 bg-clip-text text-transparent">CECATI 122</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-200 max-w-2xl mx-auto font-light leading-relaxed">
            Mantente al día con comunicados oficiales, períodos de inscripciones, eventos laborales y la vida académica de nuestro plantel.
          </p>

          <div className="max-w-xl mx-auto pt-4">
            <div className="relative flex items-center">
              <i className="ri-search-line absolute left-4 text-gray-400 text-lg"></i>
              <input
                type="text"
                placeholder="Buscar aviso o noticia..."
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
      <section className="max-w-6xl mx-auto px-4 -mt-6 relative z-20 flex justify-center">
        <div className="bg-white dark:bg-zinc-950 shadow-md border border-zinc-100 dark:border-zinc-800 rounded-full p-1.5 flex items-center gap-2 overflow-x-auto scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden w-full max-w-fit">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 whitespace-nowrap cursor-pointer shrink-0 ${selectedCategory === cat
                  ? 'bg-rose-700 text-white shadow-md'
                  : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Cargando */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#B41A47] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Cargando publicaciones...</p>
          </div>
        ) : (
          <>
            {/* Aviso Destacado / Fijado (Banner Grande) */}
            {pinnedPost && (
              <div className="mb-12">
                <div className="group relative rounded-3xl overflow-hidden bg-white dark:bg-[#161618] border border-slate-200 dark:border-[#2A2A2E] shadow-xl hover:shadow-2xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12">
                  <div className="lg:col-span-7 relative min-h-[280px] lg:min-h-[380px] overflow-hidden">
                    <img
                      src={pinnedPost.featuredImage}
                      alt={pinnedPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent lg:hidden"></div>
                    <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-bold shadow-lg">
                      <i className="ri-pushpin-fill"></i> Aviso Destacado
                    </span>
                  </div>
                  <div className="lg:col-span-5 p-6 lg:p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-3 text-xs text-slate-500 dark:text-slate-400">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryBadgeClass(pinnedPost.category)}`}>
                          {pinnedPost.category}
                        </span>
                        <span>•</span>
                        <span>{formatDate(pinnedPost.publishedAt)}</span>
                      </div>

                      <h2 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-[#B41A47] transition-colors leading-snug">
                        <Link to={`/blog/${pinnedPost.slug || pinnedPost.id}`}>
                          {pinnedPost.title}
                        </Link>
                      </h2>

                      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6 line-clamp-4">
                        {pinnedPost.excerpt}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Por: <strong className="text-slate-700 dark:text-slate-200">{pinnedPost.author}</strong>
                      </span>
                      <Link
                        to={`/blog/${pinnedPost.slug || pinnedPost.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B41A47] hover:text-[#d62828] transition-colors"
                      >
                        Leer noticia completa
                        <i className="ri-arrow-right-line"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Rejilla de Publicaciones */}
            {regularPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularPosts.map((post) => (
                  <article
                    key={post.id}
                    className="group flex flex-col bg-white dark:bg-[#161618] rounded-2xl overflow-hidden border border-slate-200 dark:border-[#2A2A2E] shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Imagen de Portada */}
                    <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md shadow-sm ${getCategoryBadgeClass(post.category)}`}>
                          {post.category}
                        </span>
                      </div>
                    </div>

                    {/* Contenido de la Tarjeta */}
                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div>
                        <div className="text-xs text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-2">
                          <i className="ri-calendar-event-line"></i>
                          <span>{formatDate(post.publishedAt)}</span>
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-[#B41A47] transition-colors leading-snug line-clamp-2">
                          <Link to={`/blog/${post.slug || post.id}`}>
                            {post.title}
                          </Link>
                        </h3>

                        <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed line-clamp-3 mb-4">
                          {post.excerpt}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                          {post.author}
                        </span>
                        <Link
                          to={`/blog/${post.slug || post.id}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#B41A47] hover:text-[#d62828] transition-colors"
                        >
                          Leer más
                          <i className="ri-arrow-right-s-line"></i>
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              /* Estado Sin Resultados */
              <div className="bg-white dark:bg-[#161618] rounded-2xl p-12 text-center border border-slate-200 dark:border-[#2A2A2E] max-w-lg mx-auto my-8">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-[#B41A47] text-2xl">
                  <i className="ri-newspaper-line"></i>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  No se encontraron noticias
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs mb-6">
                  {hasSearch
                    ? `No hay publicaciones que coincidan con "${searchTerm.trim()}".`
                    : selectedCategory !== 'Todas'
                      ? 'No hay publicaciones en la categoría seleccionada.'
                      : 'No hay publicaciones disponibles por el momento.'}
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('Todas');
                    setSearchTerm('');
                  }}
                  className="px-5 py-2.5 rounded-full bg-[#B41A47] text-white text-xs font-bold hover:bg-[#d62828] transition-colors shadow-md cursor-pointer"
                >
                  Ver todas las publicaciones
                </button>
              </div>
            )}

          </>
        )}

      </div>
    </main>
  );
}
