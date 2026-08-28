import { Link } from 'react-router-dom';

export function RecentPostsSection({ recentPosts }) {
  if (!recentPosts || recentPosts.length === 0) return null;

  return (
    <section className="py-20 bg-slate-50 dark:bg-[#0D0D0E] transition-colors duration-300 border-t border-slate-100 dark:border-slate-800/60" id="noticias">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#B41A47] dark:text-red-400 mb-2 block">
              Información Institucional
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Avisos y Noticias Recientes
            </h2>
          </div>
          <Link
            to="/blog"
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 text-xs font-bold text-[#B41A47] hover:text-[#d62828] transition-colors group"
          >
            <span>Ver todas las publicaciones</span>
            <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform"></i>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recentPosts.map((post) => (
            <article
              key={post.id}
              className="group flex flex-col bg-white dark:bg-[#161618] rounded-2xl overflow-hidden border border-slate-200 dark:border-[#2A2A2E] shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  loading="lazy"
                  decoding="async"
                  width="400"
                  height="225"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold bg-black/60 text-white backdrop-blur-md">
                  {post.category}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-medium text-slate-400 mb-2 flex items-center gap-1.5">
                    <i className="ri-calendar-line"></i>
                    <span>{post.publishedAt}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#B41A47] transition-colors line-clamp-2 mb-3">
                    <Link to={`/blog/${post.slug || post.id}`}>{post.title}</Link>
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <Link
                  to={`/blog/${post.slug || post.id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#B41A47] hover:underline pt-3 border-t border-slate-100 dark:border-slate-800"
                >
                  <span>Leer aviso completo</span>
                  <i className="ri-arrow-right-s-line"></i>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
