import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serviceAccountPath = resolve(__dirname, '../serviceAccountKey.json');

if (!existsSync(serviceAccountPath)) {
  console.error("❌ Error: No se encontró el archivo serviceAccountKey.json en la raíz del proyecto.");
  process.exit(1);
}

const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

export const coursesData = [
  {
    id: "confeccion-lunes-miercoles",
    title: "Confección de Prendas de Vestir (Lunes a Miércoles)",
    category: "textil",
    shift: "Matutino",
    instructor: "Patricia Ramirez Olvera",
    startDate: "2026-08-31",
    endDate: "2026-12-18",
    formattedPeriod: "31 de Agosto - 18 de Diciembre de 2026",
    schedules: [
      { days: ["Lunes", "Martes", "Miércoles"], startTime: "08:00", endTime: "13:00" }
    ],
    schedule: "Lunes a Miércoles de 08:00 a 13:00 hrs",
    requirements: "CURP y acta de nacimiento",
    price: "$1,200 MXN",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80",
    profile: "A) Trazo de patrones. B) Abastecimiento y manejo de materiales textiles. C) Corte, ensamble y acabados de prendas a Mano, con máquina Recta y Overlock.",
    syllabus: [
      "Técnicas de acabados a mano y máquina recta y overlock.",
      "Patronaje sobre talla y sobre medida para niña y adulta.",
      "Transformación y preformado de prendas para dama. Base 1.",
      "Confección de prendas de niña."
    ],
    status: "active"
  },
  {
    id: "confeccion-jueves",
    title: "Confección de Prendas de Vestir (Jueves)",
    category: "textil",
    shift: "Matutino",
    instructor: "Patricia Ramirez Olvera",
    startDate: "2026-08-31",
    endDate: "2026-12-18",
    formattedPeriod: "31 de Agosto - 18 de Diciembre de 2026",
    schedules: [
      { days: ["Jueves"], startTime: "08:00", endTime: "13:00" }
    ],
    schedule: "Jueves de 08:00 a 13:00 hrs",
    requirements: "CURP y acta de nacimiento",
    price: "$1,200 MXN",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80",
    profile: "A) Bordado de prendas con puntadas decorativas. B) Confección de escotes, cuellos, canesús, mangas, faldas y solapas con claves y marcas.",
    syllabus: [
      "Técnicas avanzadas de bordado de smock.",
      "Trasformación y preformado de prendas para dama. Base 2."
    ],
    status: "active"
  },
  {
    id: "alimentos-y-bebidas-panaderia",
    title: "Alimentos y Bebidas (Panadería)",
    category: "gastronomia",
    shift: "Vespertino",
    instructor: "Uriel Adolfo Martinez Martinez",
    startDate: "2026-08-31",
    endDate: "2026-12-18",
    formattedPeriod: "31 de Agosto - 18 de Diciembre de 2026",
    schedules: [
      { days: ["Lunes", "Martes", "Miércoles", "Jueves"], startTime: "15:00", endTime: "20:00" }
    ],
    schedule: "Lunes a Jueves de 15:00 a 20:00 hrs",
    requirements: "CURP y acta de nacimiento",
    price: "$1,200 MXN",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80",
    profile: "A) Preparación y horneado de panadería (bolillo, telera, baguette, pan de caja, pan de ajo, bollos de salchicha, pan de agua, focaccia, pan pita, pizza). B) Preparación del \"Mise en place\". C) Requisición de insumos y manejo de materias primas para la panificación. D) Materialización de las ideas, datos y conceptos en un texto dentro de su contexto de panificación. E) Administración de los recursos disponibles para la panificación, en favor del logro de sus metas.",
    syllabus: [
      "Pan blanco esencial.",
      "Protocolo en seguridad e higiene en alimentos y bebidas.",
      "Fundamentos de la panadería.",
      "Panadería representativa mexicana I (Pan dulce).",
      "Elaboración de pan blanco con prefermentos y masa madre.",
      "Panadería representativa mexicana II (Pan dulce)."
    ],
    status: "active"
  },
  {
    id: "expresion-grafica-digital",
    title: "Expresión Gráfica Digital",
    category: "tecnologia",
    shift: "Matutino",
    instructor: "Manuel Alejandro Solis Rufino",
    startDate: "2026-08-31",
    endDate: "2026-12-18",
    formattedPeriod: "31 de Agosto - 18 de Diciembre de 2026",
    schedules: [
      { days: ["Martes", "Miércoles", "Jueves"], startTime: "08:00", endTime: "12:00" }
    ],
    schedule: "Martes a Jueves de 08:00 a 12:00 hrs",
    requirements: "CURP y acta de nacimiento",
    price: "$1,200 MXN",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80",
    profile: "A) Desarrollo de innovaciones y soluciones. B) Instalación de software. C) Uso de herramienta de formas básicas, degradados, buscatrazos, impresión y guardado de archivos vectoriales. D) Uso de herramienta de textos, formas básicas y software alterno de diseño vectorial. E) Manejo de software de procesador de documentos, texto, tablas, imágenes, formas y formatos. F) Desarrollo de hojas membretadas, imágenes, folletos, tarjetas de presentación, invitaciones.",
    syllabus: [
      "Software de vectores I.",
      "Software de vectores II.",
      "Uso de tecnologías para certificación de competencias laborales.",
      "Diseño publicitario I.",
      "Diseño publicitario II."
    ],
    status: "active"
  },
  {
    id: "mantenimiento-electromecanico-matutino",
    title: "Mantenimiento Electromecánico del Automóvil",
    category: "automotriz",
    shift: "Matutino",
    instructor: "Héctor Marcos Abreu Lara",
    startDate: "2026-08-31",
    endDate: "2026-12-18",
    formattedPeriod: "31 de Agosto - 18 de Diciembre de 2026",
    schedules: [
      { days: ["Miércoles", "Jueves", "Viernes"], startTime: "08:00", endTime: "12:00" }
    ],
    schedule: "Miércoles a Viernes de 08:00 a 12:00 hrs",
    requirements: "CURP y acta de nacimiento",
    price: "$1,200 MXN",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80",
    profile: "A) Identificación de tipos de mantenimiento automotriz. B) Descripción de procedimientos de forma sistemática. C) Descripción y corrección de los componentes durante el funcionamiento del sistema de carga del auto. D) Diagnóstico de los sistemas de inyección electrónica de combustible. E) Medición y prueba de actuadores y sensores del sistema de inyección electrónica de combustible. F) Diagnóstico y reparación de los componentes del sistema de arranque automotriz. G) Identificación de los componentes del sistema de accesorios eléctricos automotrices. H) Instalación, adaptación y reparación de accesorios eléctricos automotrices: luces, claxon, elevadores, sensores de proximidad, alarma, etc. I) Identificación y mantenimiento de los sistemas de ignición electrónica automotriz. J) Interpretación de la simbología utilizada en la electrónica automotriz.",
    syllabus: [
      "Mantenimiento preventivo del automóvil.",
      "Diagnóstico y reparación del sistema de carga.",
      "Sistemas de electromecánica automotriz I.",
      "Diagnóstico y reparación del sistema de arranque.",
      "Sistema de luces y accesorios automotrices.",
      "Sistema de luces y accesorios automotrices II.",
      "Fundamentos de la electrónica automotriz."
    ],
    status: "active"
  },
  {
    id: "cosmetologia-integral-matutino",
    title: "Cosmetología Integral (Masoterapia y Cuidado Facial)",
    category: "estilismo",
    shift: "Matutino",
    instructor: "Julia Cuautle Cielo",
    startDate: "2026-08-31",
    endDate: "2026-12-18",
    formattedPeriod: "31 de Agosto - 18 de Diciembre de 2026",
    schedules: [
      { days: ["Lunes", "Martes", "Miércoles", "Jueves"], startTime: "08:00", endTime: "11:00" }
    ],
    schedule: "Lunes a Jueves de 08:00 a 11:00 hrs",
    requirements: "CURP y acta de nacimiento",
    price: "$1,200 MXN",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80",
    profile: "A) Planificación y aplicación de las técnicas de masajes específicos mediante la identificación de las necesidades del cliente, la evaluación morfofisiológica básica y el dominio de las memorias clásicas, garantizando la seguridad, la higiene y la efectividad en la promoción del bienestar físico y la relajación. B) Reconocimiento de contraindicaciones, comunicación asertiva, acondicionamiento de la cabina y ergonomía, evaluación postratamiento ético profesional. C) Tratamiento de la anatomía y vascularización, evaluación del biotipo cutáneo, maniobras faciales específicas, ergonomía y presión adaptada.",
    syllabus: [
      "Masaje sueco.",
      "Cuidados faciales personales (Skin care).",
      "Masaje linfático en extremidades inferiores.",
      "Masaje básico relajante.",
      "Tratamiento facial de cabina con aparatología.",
      "Masaje descontracturante."
    ],
    status: "active"
  },
  {
    id: "administracion-negocios-sabatino",
    title: "Administración y Modelos de Negocios",
    category: "administracion",
    shift: "Sabatino",
    instructor: "Mariana Dominguez Cruz",
    startDate: "2026-08-31",
    endDate: "2026-12-18",
    formattedPeriod: "31 de Agosto - 18 de Diciembre de 2026",
    schedules: [
      { days: ["Sábado"], startTime: "10:00", endTime: "14:00" }
    ],
    schedule: "Sábados de 10:00 a 14:00 hrs",
    requirements: "CURP y acta de nacimiento",
    price: "$1,550 MXN",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80",
    profile: "A) Organización, estructura y planificación de la filosofía organizacional. B) Clarificación de objetivos y análisis de rentabilidad. C) Desarrollo de capacidades del emprendedor para posicionamiento del negocio. D) Toma de decisiones, control estadístico y análisis de datos.",
    syllabus: [
      "Estructura de la administración para negocios.",
      "Desarrollo de modelos de negocios.",
      "Administración estratégica para negocios."
    ],
    status: "active"
  },
  {
    id: "ofimatica-windows-office",
    title: "Ofimática",
    category: "tecnologia",
    shift: "Vespertino",
    instructor: "Andrés San Juan Reyes",
    startDate: "2026-08-31",
    endDate: "2026-12-18",
    formattedPeriod: "31 de Agosto - 18 de Diciembre de 2026",
    schedules: [
      { days: ["Lunes", "Martes", "Jueves", "Viernes"], startTime: "15:00", endTime: "19:00" }
    ],
    schedule: "Lunes, Martes, Jueves y Viernes de 15:00 a 19:00 hrs",
    requirements: "CURP y acta de nacimiento",
    price: "$1,200 MXN",
    image: "https://images.unsplash.com/photo-1484417894907-623942c8ee29?q=80",
    profile: "A) Configuración de dispositivos electrónicos de acuerdo a las necesidades propias. B) Protección de la información, así como el manejo del internet. C) Utilización del correo electrónico. D) Dominio de los programas de oficina para escribir textos, realizar presentaciones, gráficos y cálculos. E) Utilización del teclado para escribir documentos rápida y eficientemente.",
    syllabus: [
      "Manejo de Windows e Internet.",
      "Manejo de aplicaciones para teléfono inteligente.",
      "Manejo profesional del teclado.",
      "Elaboración de documentos con procesador de palabras.",
      "Elaboración de presentaciones con procesador gráfico.",
      "Elaboración de hoja de cálculo."
    ],
    status: "active"
  },
  {
    id: "estilismo-cortes-cabello-vespertino",
    title: "Estilismo y Diseño de Imagen (Cortes de Cabello)",
    category: "estilismo",
    shift: "Vespertino",
    instructor: "Eva Guadalupe Morales Gonzalez",
    startDate: "2026-08-31",
    endDate: "2026-12-18",
    formattedPeriod: "31 de Agosto - 18 de Diciembre de 2026",
    schedules: [
      { days: ["Lunes", "Martes", "Miércoles"], startTime: "15:00", endTime: "20:00" }
    ],
    schedule: "Lunes a Miércoles de 15:00 a 20:00 hrs",
    requirements: "CURP y acta de nacimiento",
    price: "$1,200 MXN",
    image: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?q=80",
    profile: "A) Reconocimiento de la estructura, ciclo, características y funciones del cabello. B) Utilización de herramientas e insumos conforme a procedimientos técnicos establecidos. C) Identificación de las zonas de cabeza para seccionar. D) Reconocimiento de grados de elevación y efectos. Ejecución de cortes básicos para dama y caballero con tijera. E) Realización de cortes básicos para dama con navaja. F) Ejecución de cortes básicos para caballero con navaja y máquina.",
    syllabus: [
      "Fundamentos del cabello.",
      "Uso de herramienta y productos capilares.",
      "Curso básico de cortes de cabello.",
      "Curso básico de corte dama y caballero."
    ],
    status: "active"
  },
  {
    id: "estilismo-cortes-y-peinados-matutino",
    title: "Estilismo y Diseño de Imagen (Cortes y Peinados)",
    category: "estilismo",
    shift: "Matutino",
    instructor: "Julia Cuautle Cielo",
    startDate: "2026-08-31",
    endDate: "2026-12-18",
    formattedPeriod: "31 de Agosto - 18 de Diciembre de 2026",
    schedules: [
      { days: ["Lunes", "Martes"], startTime: "11:30", endTime: "14:30" }
    ],
    schedule: "Lunes y Martes de 11:30 a 14:30 hrs",
    requirements: "CURP y acta de nacimiento",
    price: "$1,550 MXN",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80",
    profile: "A) Diagnóstico de la morfología del rostro. B) Sujeción y manejo de herramientas de corte. C) Ejecución de técnicas de separación, partición, seccionado y ángulos. D) Cortes a tijera sobre peine con contornos. E) Dominio de la bioseguridad y protocolos de desinfección. F) Aplicación de visagismo, tricología y salud capilar. G) Aplicación de técnicas de consultoría de imagen.",
    syllabus: [
      "Corte básico para caballero.",
      "Corte para dama en \"Mariposa\", \"Recto\" y \"V\".",
      "Trenzas con alto peinado para mujer."
    ],
    status: "active"
  },
  {
    id: "estilismo-corte-infantil-brushing",
    title: "Estilismo y Diseño de Imagen (Corte Infantil y Brushing)",
    category: "estilismo",
    shift: "Matutino",
    instructor: "Julia Cuautle Cielo",
    startDate: "2026-08-31",
    endDate: "2026-12-18",
    formattedPeriod: "31 de Agosto - 18 de Diciembre de 2026",
    schedules: [
      { days: ["Miércoles", "Jueves"], startTime: "11:30", endTime: "14:30" }
    ],
    schedule: "Miércoles y Jueves de 11:30 a 14:30 hrs",
    requirements: "CURP y acta de nacimiento",
    price: "$1,550 MXN",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80",
    profile: "A) Técnicas de contención y prevención en menores con base a la psicología infantil en la actividad del corte de cabello. B) Diseño sobre la geometría femenina.",
    syllabus: [
      "Corte de cabello para niño.",
      "Corte de cabello para niña.",
      "Brushing del cabello y herramientas calientes."
    ],
    status: "active"
  },
  {
    id: "cosmetologia-tecnicas-avanzadas-sabatino",
    title: "Cosmetología Integral (Técnicas Avanzadas de Masaje)",
    category: "estilismo",
    shift: "Sabatino",
    instructor: "Julia Cuautle Cielo",
    startDate: "2026-08-31",
    endDate: "2026-12-18",
    formattedPeriod: "31 de Agosto - 18 de Diciembre de 2026",
    schedules: [
      { days: ["Sábado"], startTime: "14:00", endTime: "19:00" }
    ],
    schedule: "Sábados de 14:00 a 19:00 hrs",
    requirements: "CURP y acta de nacimiento",
    price: "$1,200 MXN",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80",
    profile: "A) Fundamentos avanzados de física aplicada a la aparatología (ondas, corriente, calor) y anatomía muscular. B) Ejecución avanzada de maniobras de masaje en sinergias con cupping y ventosas. C) Evaluación, palpación y manipulación de puntos gatillo. D) Dominio conceptual de anatomía y fisiología músculo esquelético y fisiología del dolor.",
    syllabus: [
      "Técnicas avanzadas de masaje relajante.",
      "Técnicas avanzadas de masaje descontracturante.",
      "Técnicas avanzadas de masaje linfático."
    ],
    status: "active"
  },
  {
    id: "mantenimiento-electromecanico-fin-de-semana",
    title: "Mantenimiento Electromecánico del Automóvil (Suspensión y Alineación)",
    category: "automotriz",
    shift: "Mixto / Fin de Semana",
    instructor: "Eduardo Quijada Pacheco",
    startDate: "2026-08-31",
    endDate: "2026-12-18",
    formattedPeriod: "31 de Agosto - 18 de Diciembre de 2026",
    schedules: [
      { days: ["Sábado"], startTime: "14:00", endTime: "17:00" },
      { days: ["Domingo"], startTime: "08:00", endTime: "11:00" }
    ],
    schedule: "Sábados de 14:00 a 17:00 hrs / Domingos de 08:00 a 11:00 hrs",
    requirements: "CURP y acta de nacimiento",
    price: "$1,550 MXN",
    image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80",
    profile: "A) Revisión de cada componente de los diferentes tipos de suspensiones. B) Aplicación de técnicas de reparación y restablecimiento de las partes móviles de chasis del automóvil. C) Ejecución de técnicas de alineación y balanceo electrónico de los neumáticos.",
    syllabus: [
      "Diagnóstico y reparación del sistema de suspensión automotriz.",
      "Alineación de las llantas automotrices.",
      "Balanceo de los neumáticos automotrices."
    ],
    status: "active"
  },
  {
    id: "ingles-stories-and-traditions",
    title: "Inglés Práctico (Stories and Traditions)",
    category: "idiomas",
    shift: "Vespertino",
    instructor: "Lorena Trejo Mentado",
    startDate: "2026-08-31",
    endDate: "2026-12-18",
    formattedPeriod: "31 de Agosto - 18 de Diciembre de 2026",
    schedules: [
      { days: ["Lunes", "Miércoles"], startTime: "17:00", endTime: "19:00" }
    ],
    schedule: "Lunes y Miércoles de 17:00 a 19:00 hrs",
    requirements: "CURP y acta de nacimiento",
    price: "$1,550 MXN",
    image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80",
    profile: "A) Reconocimiento de los términos básicos de su entorno en el idioma inglés. B) Escritura y expresión oral de saludos y cortesía. C) Expresión verbal y escrita de las experiencias y costumbres. D) Explicación de forma oral y escrita de las instrucciones de orientación local.",
    syllabus: [
      "Basic English in real life.",
      "Basic English: Stories and traditions."
    ],
    status: "active"
  },
  {
    id: "sistema-electronico-automotriz-sabatino",
    title: "Mantenimiento al Sistema Electrónico Automotriz",
    category: "automotriz",
    shift: "Sabatino",
    instructor: "Eduardo Quijada Pacheco",
    startDate: "2026-08-31",
    endDate: "2026-12-18",
    formattedPeriod: "31 de Agosto - 18 de Diciembre de 2026",
    schedules: [
      { days: ["Sábado"], startTime: "08:00", endTime: "13:00" }
    ],
    schedule: "Sábados de 08:00 a 13:00 hrs",
    requirements: "CURP y acta de nacimiento",
    price: "$1,200 MXN",
    image: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80",
    profile: "A) Prueba de componentes electrónicos análogos y digitales. B) Lectura e interpretación de diagramas electrónicos. C) Diagnóstico y localización de fallas en circuitos eléctricos y electrónicos en el vehículo. D) Utilización de instrumentos como multímetro, osciloscopio y escáner.",
    syllabus: [
      "Fundamentos de electrónica automotriz análoga.",
      "Fundamentos de electrónica automotriz digital.",
      "Diagnóstico al sistema OBD II."
    ],
    status: "active"
  }
];

async function updateCoursesInFirestore() {
  console.log(`🚀 Sincronizando los ${coursesData.length} cursos oficiales en la colección 'courses' de Firestore...`);

  try {
    for (const course of coursesData) {
      const { id, ...data } = course;
      await db.collection('courses').doc(id).set({
        ...data,
        updatedAt: FieldValue.serverTimestamp(),
        createdAt: FieldValue.serverTimestamp()
      }, { merge: true });
      console.log(`  ✅ Curso guardado en Firestore: "${course.title}" [${course.shift} - Prof. ${course.instructor}]`);
    }
    console.log(`\n🎉 ¡TODOS LOS ${coursesData.length} CURSOS OFICIALES HAN SIDO GUARDADOS CON ÉXITO EN FIRESTORE!`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error al actualizar los cursos en Firestore:", error);
    process.exit(1);
  }
}

updateCoursesInFirestore();
