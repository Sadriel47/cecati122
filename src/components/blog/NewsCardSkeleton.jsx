import React from 'react';

/**
 * Skeleton Loader para tarjeta de noticia/aviso.
 * Mantiene la misma estructura, bordes redondeados y dimensiones que las tarjetas de Blog.jsx.
 */
export function NewsCardSkeleton() {
  return (
    <div className="bg-white dark:bg-[#161618] rounded-2xl overflow-hidden border border-slate-200 dark:border-[#2A2A2E] shadow-md flex flex-col justify-between h-full animate-pulse select-none">
      <div>
        {/* Simulación de Imagen de Portada */}
        <div className="relative h-48 bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
          <i className="ri-image-2-line text-4xl text-zinc-300 dark:text-zinc-650"></i>
          {/* Badge de Categoría Simulado */}
          <div className="absolute top-3 left-3 h-6 w-28 bg-zinc-300 dark:bg-zinc-600 rounded-full"></div>
        </div>

        {/* Simulación del Contenido */}
        <div className="p-6 space-y-4">
          {/* Fecha */}
          <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded-md w-1/4"></div>

          {/* Título */}
          <div className="space-y-2">
            <div className="h-5 bg-zinc-200 dark:bg-zinc-700 rounded-lg w-11/12"></div>
            <div className="h-5 bg-zinc-200 dark:bg-zinc-700 rounded-lg w-3/4"></div>
          </div>

          {/* Extracto (Párrafos) */}
          <div className="space-y-2 pt-2">
            <div className="h-3.5 bg-zinc-100 dark:bg-zinc-800 rounded-md w-full"></div>
            <div className="h-3.5 bg-zinc-100 dark:bg-zinc-800 rounded-md w-11/12"></div>
            <div className="h-3.5 bg-zinc-100 dark:bg-zinc-800 rounded-md w-5/6"></div>
          </div>
        </div>
      </div>

      {/* Simulación de Footer de la tarjeta */}
      <div className="p-6 pt-0">
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          {/* Autor */}
          <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded-md w-1/4"></div>
          {/* Leer más */}
          <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded-md w-1/6"></div>
        </div>
      </div>
    </div>
  );
}
