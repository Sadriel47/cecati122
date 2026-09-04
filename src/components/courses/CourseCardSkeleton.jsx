import React from 'react';

/**
 * Skeleton Loader para tarjeta de curso.
 * Mantiene la misma estructura, bordes redondeados y dimensiones que CourseCard.jsx.
 */
export function CourseCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-700/80 shadow-md flex flex-col justify-between h-full animate-pulse select-none">
      <div>
        {/* Simulación de Imagen de Portada */}
        <div className="relative h-48 bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
          <i className="ri-image-2-line text-4xl text-zinc-300 dark:text-zinc-650"></i>
          {/* Badge de Categoría Simulado */}
          <div className="absolute top-3 left-3 h-6 w-24 bg-zinc-300 dark:bg-zinc-600 rounded-full"></div>
          {/* Badge de Estatus Simulado */}
          <div className="absolute top-3 right-3 h-5 w-20 bg-zinc-300 dark:bg-zinc-600 rounded-full"></div>
          {/* Precio Simulado */}
          <div className="absolute bottom-3 left-4 h-6 w-20 bg-zinc-300 dark:bg-zinc-600 rounded-full"></div>
        </div>

        {/* Simulación del Contenido */}
        <div className="p-5 space-y-4">
          {/* Título */}
          <div className="space-y-2">
            <div className="h-5 bg-zinc-200 dark:bg-zinc-700 rounded-lg w-11/12"></div>
            <div className="h-5 bg-zinc-200 dark:bg-zinc-700 rounded-lg w-2/3"></div>
          </div>

          {/* Fila de detalles: Horas e Inicio */}
          <div className="flex items-center justify-between pt-2">
            <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded-md w-1/4"></div>
            <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded-md w-2/5"></div>
          </div>
        </div>
      </div>

      {/* Simulación de Botón */}
      <div className="p-5 pt-0">
        <div className="h-11 bg-zinc-200 dark:bg-zinc-700 rounded-xl w-full"></div>
      </div>
    </div>
  );
}
