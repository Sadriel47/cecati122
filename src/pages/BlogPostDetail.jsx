import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPostByIdOrSlug, getPosts } from '../services/postsService';

export default function BlogPostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchPostData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const fetchPostData = async () => {
    setLoading(true);
    try {
      const currentPost = await getPostByIdOrSlug(id);
      if (currentPost) {
        setPost(currentPost);
        document.title = `${currentPost.title} - CECATI 122`;
        
        // Cargar publicaciones relacionadas
        const allPosts = await getPosts('Todas');
        const related = allPosts.filter(p => p.id !== currentPost.id && p.slug !== currentPost.slug).slice(0, 3);
        setRelatedPosts(related);
      } else {
        setPost(null);
      }
    } catch (err) {
      console.error("Error al cargar la noticia:", err);
      setPost(null);
    } finally {
      setLoading(false);
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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`Noticia CECATI 122: ${post.title}\n\n${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleShareFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  // Renderizador básico de contenido con soporte para párrafos y títulos
  const renderFormattedContent = (content) => {
    if (!content) return null;
    const lines = content.split('\n');

    return lines.map((line, index) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={index} className="h-4"></div>;

      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={index} className="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-3">
            {trimmed.replace('### ', '')}
          </h3>
        );
      }

      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={index} className="text-2xl font-black text-slate-900 dark:text-white mt-8 mb-4">
            {trimmed.replace('## ', '')}
          </h2>
        );
      }

      return (
        <p key={index} className="text-slate-700 dark:text-slate-300 text-base leading-relaxed mb-4">
          {trimmed}
        </p>
      );
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-slate-50 dark:bg-[#0D0D0E] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#B41A47] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Cargando artículo...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-slate-50 dark:bg-[#0D0D0E] text-slate-800 dark:text-slate-200">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
            <i className="ri-error-warning-line"></i>
          </div>
          <h1 className="text-2xl font-bold mb-3">Noticia No Encontrada</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
            La publicación que buscas no existe o ha sido retirado por la administración.
          </p>
          <button
            onClick={() => navigate('/blog')}
            className="px-6 py-2.5 bg-[#B41A47] text-white text-xs font-bold rounded-full hover:bg-[#d62828] transition-colors"
          >
            Volver al Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="main overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      
      {/*==================== HERO NOTICIA DETALLE ====================*/}
      <section className="relative min-h-[45vh] flex items-center justify-center pt-28 pb-16 px-4 overflow-hidden bg-gradient-to-br from-[#5C0A22] via-[#12161F] to-[#8B1336]">
        {/* Background Image */}
        <img
          src={post.featuredImage || "/assets/img/home-img-2.jpg"}
          alt={post.title} 
          className="absolute inset-0 w-full h-full object-cover object-center"
          onError={(e) => { e.target.src = "/assets/img/home-img-2.jpg"; }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/75 to-gray-900 backdrop-blur-sm"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/25 text-xs sm:text-sm font-semibold text-white shadow-lg">
            <i className="ri-newspaper-line text-red-400 text-base"></i>
            <span>{post.category}</span>
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight max-w-3xl mx-auto">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-200 font-medium pt-2">
            <span className="flex items-center gap-1.5">
              <i className="ri-user-3-line text-red-400"></i>
              {post.author || 'Dirección CECATI 122'}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <i className="ri-calendar-line text-red-400"></i>
              {formatDate(post.publishedAt || post.createdAt)}
            </span>
          </div>
        </div>
      </section>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-slate-800 dark:text-slate-200">
        
        {/* Migas de Pan (Breadcrumb) */}
        <nav className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 mb-8">
          <Link to="/" className="hover:text-[#B41A47] transition-colors">Inicio</Link>
          <i className="ri-arrow-right-s-line"></i>
          <Link to="/blog" className="hover:text-[#B41A47] transition-colors">Noticias</Link>
          <i className="ri-arrow-right-s-line"></i>
          <span className="text-slate-600 dark:text-slate-300 font-medium truncate max-w-[200px] sm:max-w-xs">
            {post.title}
          </span>
        </nav>
        {/* Acciones de Compartir */}
        <div className="flex items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-400">¿Te resultó útil esta noticia?</span>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 mr-1 hidden sm:inline">Compartir:</span>
            <button
              onClick={handleShareWhatsApp}
              className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center cursor-pointer"
              title="Compartir en WhatsApp"
            >
              <i className="ri-whatsapp-line text-sm"></i>
            </button>
            <button
              onClick={handleShareFacebook}
              className="w-8 h-8 rounded-full bg-blue-600/10 text-blue-600 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center cursor-pointer"
              title="Compartir en Facebook"
            >
              <i className="ri-facebook-fill text-sm"></i>
            </button>
            <button
              onClick={handleCopyLink}
              className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-[#B41A47] hover:text-white transition-all flex items-center justify-center relative cursor-pointer"
              title="Copiar enlace"
            >
              <i className={`ri-${copied ? 'check-line' : 'link'} text-sm`}></i>
            </button>
            {copied && (
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 animate-pulse">
                ¡Copiado!
              </span>
            )}
          </div>
        </div>

        {/* Imagen Destacada */}
        {post.featuredImage && (
          <div className="relative rounded-2xl overflow-hidden mb-10 shadow-lg border border-slate-200 dark:border-[#2A2A2E]">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full max-h-[460px] object-cover"
            />
          </div>
        )}

        {/* Resumen / Excerpt destacado */}
        {post.excerpt && (
          <div className="p-4 sm:p-6 rounded-2xl bg-[#B41A47]/5 border-l-4 border-[#B41A47] text-slate-700 dark:text-slate-300 text-sm sm:text-base font-medium italic leading-relaxed mb-8">
            "{post.excerpt}"
          </div>
        )}

        {/* Cuerpo del Artículo */}
        <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 mb-12">
          {renderFormattedContent(post.content)}
        </div>

        {/* Etiquetas / Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-slate-200 dark:border-[#2A2A2E] mb-12">
            <span className="text-xs font-bold text-slate-400 mr-2">Etiquetas:</span>
            {post.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full text-[11px] font-medium bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Noticias Relacionadas */}
        {relatedPosts.length > 0 && (
          <section className="mt-16 pt-10 border-t border-slate-200 dark:border-[#2A2A2E]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Otras Noticias de Interés
              </h3>
              <Link
                to="/blog"
                className="text-xs font-bold text-[#B41A47] hover:underline flex items-center gap-1"
              >
                Ver todo el blog <i className="ri-arrow-right-line"></i>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((rel) => (
                <div
                  key={rel.id}
                  className="bg-white dark:bg-[#161618] rounded-xl overflow-hidden border border-slate-200 dark:border-[#2A2A2E] shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="h-36 overflow-hidden">
                    <img
                      src={rel.featuredImage}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-semibold text-[#B41A47] uppercase tracking-wider block mb-1">
                        {rel.category}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#B41A47] transition-colors line-clamp-2 mb-2">
                        <Link to={`/blog/${rel.slug || rel.id}`}>{rel.title}</Link>
                      </h4>
                    </div>
                    <Link
                      to={`/blog/${rel.slug || rel.id}`}
                      className="text-[11px] font-semibold text-slate-500 hover:text-[#B41A47] pt-2 border-t border-slate-100 dark:border-slate-800"
                    >
                      Leer noticia →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </article>
    </main>
  );
}
