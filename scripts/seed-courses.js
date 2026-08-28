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

const coursesData = [
  {
    id: "confeccion",
    title: "Confección de Prendas de Vestir",
    category: "textil",
    duration: 250,
    startDate: "31 de Agosto - 18 de Diciembre",
    schedule: "Lunes a Jueves de 8:00 a 13:00 hrs",
    requirements: "CURP y acta de nacimiento",
    price: "$1,200 MXN",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80",
    profile: "Capacitación práctica en trazo de patrones, confección a mano y máquina (recta y overlock), bordado decorativo y confección de prendas.",
    syllabus: [
      "Técnicas de acabados a mano y máquina recta y overlock",
      "Patronaje sobre talla y sobre medida para niña y adulta",
      "Técnicas de bordado de smock",
      "Transformación y preformado de prendas para dama. Base 1",
      "Confección de prendas de niña",
      "Transformación y preformado de prendas para dama. Base 2"
    ]
  },
  {
    id: "alimentos-bebidas",
    title: "Alimentos y Bebidas",
    category: "gastronomia",
    duration: 240,
    startDate: "31 de Agosto - 18 de Diciembre",
    schedule: "Lunes a Miércoles de 15:00 a 20:00 hrs",
    requirements: "CURP y acta de nacimiento",
    price: "$1,200 MXN",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80",
    profile: "Aprende el arte de la panadería artesanal y comercial mexicana e internacional, aplicando normas de higiene y mise en place.",
    syllabus: [
      "Pan blanco esencial",
      "Protocolo en seguridad e higiene en alimentos y bebidas",
      "Fundamentos de la panadería",
      "Panadería representativa mexicana I (Pan dulce)",
      "Elaboración de pan blanco con prefermentos y masa madre",
      "Panadería representativa mexicana II (Pan dulce)"
    ]
  },
  {
    id: "expresion-grafica",
    title: "Expresión Gráfica Digital",
    category: "tecnologia",
    duration: 220,
    startDate: "31 de Agosto - 18 de Diciembre",
    schedule: "Martes, Miércoles y Jueves de 7:00 a 11:00 hrs",
    requirements: "CURP y acta de nacimiento",
    price: "$1,200 MXN",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80",
    profile: "Domina el diseño publicitario vectorial y editorial para crear piezas gráficas, folletos e impresos de calidad profesional.",
    syllabus: [
      "Software de vectores I",
      "Software de vectores II",
      "Uso de tecnologías para certificación de competencias laborales",
      "Diseño publicitario I",
      "Diseño publicitario II"
    ]
  },
  {
    id: "administracion",
    title: "Administración",
    category: "administracion",
    duration: 200,
    startDate: "31 de Agosto - 18 de Diciembre",
    schedule: "Viernes de 11:00 a 15:00 hrs / Sábado de 9:00 a 13:00 hrs",
    requirements: "CURP y acta de nacimiento",
    price: "$1,200 MXN",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80",
    profile: "Capacítate en gestión contable, emisión de facturación electrónica CFDI, trámites del SAT y modelos de negocios.",
    syllabus: [
      "Administración de trámites ante el SAT",
      "Liderazgo emprendedores y creación de modelos de negocios",
      "Introducción a la contabilidad para no contadores",
      "Administración de la facturación electrónica",
      "Administración de costos para emprendedores",
      "Contabilidad para no contadores 1"
    ]
  },
  {
    id: "ofimatica",
    title: "Ofimática",
    category: "tecnologia",
    duration: 240,
    startDate: "31 de Agosto - 18 de Diciembre",
    schedule: "Lunes, Martes, Jueves y Viernes de 15:00 a 19:00 hrs",
    requirements: "CURP y acta de nacimiento",
    price: "$1,200 MXN",
    image: "https://images.unsplash.com/photo-1484417894907-623942c8ee29?q=80",
    profile: "Adquiere el dominio completo de herramientas de oficina (Word, Excel, PowerPoint), mecanografía e internet.",
    syllabus: [
      "Manejo de Windows e Internet",
      "Manejo de aplicaciones para teléfono inteligente",
      "Manejo profesional del teclado",
      "Elaboración de documentos con procesador de palabras",
      "Elaboración de presentaciones con procesador gráfico",
      "Elaboración de hoja de cálculo"
    ]
  },
  {
    id: "estilismo",
    title: "Estilismo y Diseño de Imagen",
    category: "estilismo",
    duration: 180,
    startDate: "31 de Agosto - 18 de Diciembre",
    schedule: "Lunes a Miércoles de 15:00 a 20:00 hrs",
    requirements: "CURP y acta de nacimiento",
    price: "$1,200 MXN",
    image: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?q=80",
    profile: "Aprende técnicas de corte de cabello para dama y caballero con tijera, navaja y máquina, diagnóstico capilar e imagen.",
    syllabus: [
      "Fundamentos del cabello",
      "Uso de herramienta y productos capilares",
      "Cursos básicos de cortes de cabello",
      "Curso básico de corte dama y caballero"
    ]
  },
  {
    id: "mecanica",
    title: "Mantenimiento Electromecánico Automotriz",
    category: "automotriz",
    duration: 260,
    startDate: "31 de Agosto - 18 de Diciembre",
    schedule: "Miércoles a Viernes de 8:00 a 12:00 hrs",
    requirements: "CURP y acta de nacimiento",
    price: "$1,200 MXN",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80",
    profile: "Diagnóstico y mantenimiento del sistema eléctrico automotriz, marcha, alternador, luces e inyección electrónica.",
    syllabus: [
      "Mantenimiento preventivo del automóvil",
      "Diagnóstico y reparación del sistema de carga",
      "Sistemas de electromecánica automotriz I",
      "Diagnóstico y reparación del sistema de arranque",
      "Sistema de luces y accesorios automotrices",
      "Sistema de luces y accesorios automotrices II",
      "Fundamentos de la electrónica automotriz"
    ]
  },
  {
    id: "cosmetologia",
    title: "Cosmetología",
    category: "estilismo",
    duration: 200,
    startDate: "31 de Agosto - 18 de Diciembre",
    schedule: "Lunes a Jueves de 8:00 a 11:00 am",
    requirements: "CURP y acta de nacimiento",
    price: "$1,200 MXN",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80",
    profile: "Aprende masoterapia estética (sueco, relajante, linfático), cuidado facial profundo, skin care y aparatología corporal.",
    syllabus: [
      "Masaje sueco",
      "Masaje básico relajante",
      "Skin care",
      "Tratamientos faciales",
      "Masaje linfático",
      "Masaje descontracturante"
    ]
  },
  {
    id: "ingles",
    title: "Inglés",
    category: "idiomas",
    duration: 120,
    startDate: "31 de Agosto - 18 de Diciembre",
    schedule: "Lunes y Miércoles de 17:00 a 19:00 hrs",
    requirements: "CURP y acta de nacimiento",
    price: "$1,200 MXN",
    image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80",
    profile: "Desarrolla habilidades comunicativas esenciales en idioma inglés para expresiones cotidianas, números y orientación.",
    syllabus: [
      "Viviendo la vida"
    ]
  }
];

async function updateCoursesInFirestore() {
  console.log(`🚀 Sincronizando los 9 cursos esenciales directamente en la colección 'courses' de Firestore...`);

  try {
    for (const course of coursesData) {
      const { id, ...data } = course;
      await db.collection('courses').doc(id).set({
        ...data,
        updatedAt: FieldValue.serverTimestamp()
      }, { merge: true });
      console.log(`  ✅ Curso actualizado en Firestore: "${course.title}" (${id})`);
    }
    console.log(`\n🎉 ¡TODOS LOS CURSOS HAN SIDO ACTUALIZADOS CON ÉXITO EN LA BASE DE DATOS FIRESTORE!`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error al actualizar los cursos en Firestore:", error);
    process.exit(1);
  }
}

updateCoursesInFirestore();
