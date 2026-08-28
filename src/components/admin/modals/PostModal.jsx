export function PostModal({
  isOpen,
  currentPost,
  savingPost,
  onClose,
  onSubmit,
  postTitle,
  setPostTitle,
  postCategory,
  setPostCategory,
  postAuthor,
  setPostAuthor,
  postStatus,
  setPostStatus,
  postPublishedAt,
  setPostPublishedAt,
  postPinned,
  setPostPinned,
  postExcerpt,
  setPostExcerpt,
  postImage,
  setPostImage,
  setPostImageFile,
  postContent,
  setPostContent,
  postTags,
  setPostTags
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col max-h-[92vh] my-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cecati text-white flex items-center justify-center font-bold">
              <i className={currentPost ? 'ri-edit-line' : 'ri-newspaper-line'}></i>
            </div>
            <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">
              {currentPost ? `Editar Noticia: ${currentPost.title}` : 'Redactar Nueva Noticia / Aviso'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 text-gray-700 dark:text-gray-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-gray-900 dark:text-white text-xs">Título de la Noticia / Aviso</label>
              <input
                type="text"
                placeholder="Ej. Inicio de Inscripciones para el Próximo Trimestre 2026..."
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-cecati"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-900 dark:text-white text-xs">Categoría</label>
              <select
                value={postCategory}
                onChange={(e) => setPostCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-cecati"
              >
                <option value="Avisos Importantes">Avisos Importantes</option>
                <option value="Noticias Generales">Noticias Generales</option>
                <option value="Eventos y Actividades">Eventos y Actividades</option>
                <option value="Logros y Reconocimientos">Logros y Reconocimientos</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-900 dark:text-white text-xs">Autor / Departamento</label>
              <input
                type="text"
                placeholder="Ej. Dirección CECATI 122 / Servicios Escolares"
                value={postAuthor}
                onChange={(e) => setPostAuthor(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-cecati"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-900 dark:text-white text-xs">Estado de Publicación</label>
              <select
                value={postStatus}
                onChange={(e) => setPostStatus(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-cecati"
              >
                <option value="published">Publicado (Visible en la web)</option>
                <option value="draft">Borrador (Privado)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-900 dark:text-white text-xs">Fecha de Publicación</label>
              <input
                type="date"
                value={postPublishedAt}
                onChange={(e) => setPostPublishedAt(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-cecati"
              />
            </div>
          </div>

          <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <i className="ri-pushpin-fill text-amber-500 text-lg"></i>
              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-white">Fijar al Inicio como Aviso Principal</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">Aparecerá destacado en la parte superior del Blog</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={postPinned}
              onChange={(e) => setPostPinned(e.target.checked)}
              className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-gray-900 dark:text-white text-xs">Resumen Corto (Aparece en la tarjeta)</label>
            <textarea
              placeholder="Breve resumen de 2 o 3 líneas que invite a leer el artículo..."
              value={postExcerpt}
              onChange={(e) => setPostExcerpt(e.target.value)}
              rows="2"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-cecati"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-gray-900 dark:text-white text-xs flex items-center gap-1.5">
              <i className="ri-image-line text-cecati"></i>
              <span>Imagen de Portada (Subir archivo o URL)</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPostImageFile(e.target.files[0] || null)}
                className="text-xs file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-cecati file:text-white hover:file:bg-cecati-hover cursor-pointer"
              />
            </div>
            <input
              type="text"
              placeholder="O pega una URL de imagen externa (https://...)"
              value={postImage}
              onChange={(e) => setPostImage(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-xs mt-1"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-gray-900 dark:text-white text-xs">Cuerpo de la Noticia / Contenido Completo</label>
            <textarea
              placeholder="Escribe el contenido completo de la noticia..."
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              rows="6"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-cecati"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-gray-900 dark:text-white text-xs">Etiquetas (Separadas por coma)</label>
            <input
              type="text"
              placeholder="Ej. Inscripciones, SEP, Cursos, CECATI 122"
              value={postTags}
              onChange={(e) => setPostTags(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs hover:bg-gray-200 transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={savingPost}
              className="px-7 py-2.5 rounded-full bg-cecati hover:bg-cecati-hover text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-red-900/30 hover:shadow-red-900/50 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex items-center gap-2"
            >
              {savingPost ? (
                <>
                  <i className="ri-loader-4-line ri-spin"></i>
                  <span>Guardando Noticia...</span>
                </>
              ) : (
                <>
                  <i className="ri-save-line"></i>
                  <span>{currentPost ? 'Guardar Cambios' : 'Publicar Noticia'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
