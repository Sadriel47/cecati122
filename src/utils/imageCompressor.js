/**
 * Comprime una imagen (PNG/JPEG) a formato WebP usando el API Canvas del navegador.
 * Mantiene la relación de aspecto y limita el ancho máximo.
 * 
 * @param {File} file - El archivo de imagen original.
 * @param {Object} options - Opciones de compresión.
 * @param {number} options.maxWidth - Ancho máximo de la imagen.
 * @param {number} options.quality - Calidad de compresión (0.0 a 1.0).
 * @returns {Promise<File>} El archivo comprimido en formato WebP.
 */
export async function compressImage(file, { maxWidth = 1200, quality = 0.8 } = {}) {
  // Si no es un archivo de imagen compatible, o no estamos en el navegador, retornar el archivo original
  if (!file || typeof window === 'undefined' || !file.type.startsWith('image/')) {
    return file;
  }

  // Solo procesar imágenes JPEG o PNG según los requerimientos
  if (!['image/jpeg', 'image/png'].includes(file.type)) {
    return file;
  }

  try {
    return await new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file); // Fallback al archivo original si no se puede obtener el contexto 2D
          return;
        }
        
        // Limpiar lienzo y dibujar imagen
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            
            // Reemplazar la extensión por .webp
            const originalName = file.name || 'image';
            const nameWithoutExtension = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
            const newName = `${nameWithoutExtension}.webp`;
            
            const compressedFile = new File([blob], newName, {
              type: 'image/webp',
              lastModified: Date.now(),
            });
            
            // Si el archivo comprimido es más pesado que el original, devolver el original
            if (compressedFile.size >= file.size) {
              resolve(file);
            } else {
              resolve(compressedFile);
            }
          },
          'image/webp',
          quality
        );
      };
      
      img.onerror = (err) => {
        console.error("Error al cargar la imagen para compresión:", err);
        resolve(file); // Fallback en caso de error
      };
    });
  } catch (error) {
    console.error("Error durante la compresión de imagen:", error);
    return file;
  }
}
