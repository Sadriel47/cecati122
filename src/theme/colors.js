/**
 * ARCHIVO CENTRALIZADO DE COLORES DEL PROYECTO CECATI 122
 * Este archivo actúa como la única fuente de verdad para todos los colores
 * utilizados en Tailwind CSS, variables CSS y componentes React.
 */

export const colors = {
  // Color Corporativo CECATI
  cecati: {
    DEFAULT: 'hsl(343.36, 77.4%, 34.71%)', // #b41a47
    primary: '#B41A47',
    hover: '#D62828',
    light: '#FF6B6B',
    accent: '#FF8E8E',
  },

  // Modos Oscuro (Fondos neutros basados en #12161F sin matiz azul)
  dark: {
    bg: '#0D0D0E',      // Fondo principal (Casi negro puro)
    card: '#161618',    // Tarjetas e ítems elevados
    hover: '#222225',   // Estado hover de tarjetas
    border: '#2A2A2E',
    title: '#E2E6EE',      // Texto de títulos
    text: '#94A0B8',       // Texto secundario / cuerpo
  },

  // Modos Claro
  light: {
    bg: '#F8F9FC',         // Fondo principal claro
    card: '#FFFFFF',       // Tarjetas e ítems elevados
    hover: '#F1F4F9',      // Estado hover
    border: '#E4E8F1',     // Bordes y divisores
    title: '#0D0D0E',      // Texto de títulos
    text: '#6C778F',       // Texto secundario
  },

  // Redes Sociales
  social: {
    facebook: '#1877F2',
    facebookHover: '#145DBF',
    instagram: '#E4405F',
    youtube: '#FF0000',
    tiktok: '#000000',
  }
};

export default colors;
