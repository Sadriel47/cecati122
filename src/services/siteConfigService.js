import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

export const DEFAULT_SITE_CONFIG = {
  whatsapp: '4426617408',
  facebook: 'https://www.facebook.com/cecati122',
  phone: '+52 442 661 7408',
  email: 'cecati122.dir@dgcft.sems.gob.mx',
  instagram: 'https://www.instagram.com/cecati122tx/',
  youtube: 'https://www.youtube.com/@cecati122onlinetx4',
  tiktok: 'https://www.tiktok.com/search?q=cecati%20122',
  address: 'Av. Venustiano Carranza 22, Tequisquiapan, Qro.',
  schedule: 'Lun - Vie: 7:00 am - 9:00 pm | Sáb: 7:00 am - 1:00 pm',
  // Información Bancaria para Pagos de Cursos
  bankName: 'BANORTE',
  bankAccountHolder: 'CECATI 122',
  bankAccountNumber: '1056897860',
  bankClabe: '',
};

const SETTINGS_COLLECTION = 'settings';
const CONTACT_DOC_ID = 'contact';
const LOCAL_STORAGE_KEY = 'cecati_site_config';

/**
 * Sanitiza cualquier número telefónico para generar un enlace válido de WhatsApp me.
 * Ej: "4426617408" -> "524426617408"
 * Ej: "+52 442 661 7408" -> "524426617408"
 * @param {string} rawNumber 
 * @returns {string} Digitos limpios con lada internacional
 */
export function getCleanWhatsAppNumber(rawNumber) {
  if (!rawNumber) return '524426617408';
  const cleanDigits = String(rawNumber).replace(/\D/g, '');
  if (cleanDigits.length === 10) {
    return `52${cleanDigits}`;
  }
  return cleanDigits || '524426617408';
}

/**
 * Genera la URL completa de WhatsApp con mensaje codificado.
 * @param {string} rawNumber 
 * @param {string} text 
 * @returns {string} URL wa.me
 */
export function getWhatsAppUrl(rawNumber, text = '') {
  const number = getCleanWhatsAppNumber(rawNumber);
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${number}${encodedText ? `?text=${encodedText}` : ''}`;
}

/**
 * Obtiene la configuración de contacto desde Firestore o caché local.
 * @returns {Promise<Object>}
 */
export async function getSiteConfig() {
  try {
    if (db) {
      const docRef = doc(db, SETTINGS_COLLECTION, CONTACT_DOC_ID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const merged = { ...DEFAULT_SITE_CONFIG, ...data };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
        return merged;
      }
    }
  } catch (err) {
    console.warn("No se pudo obtener la configuración de contacto de Firestore:", err.message);
  }

  // Fallback a localStorage
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (cached) {
    try {
      return { ...DEFAULT_SITE_CONFIG, ...JSON.parse(cached) };
    } catch {
      // Ignorar error de parsing
    }
  }

  return DEFAULT_SITE_CONFIG;
}

/**
 * Guarda la configuración de contacto en Firestore y en la caché local.
 * @param {Object} newConfig 
 * @returns {Promise<Object>}
 */
export async function saveSiteConfig(newConfig) {
  const payload = {
    whatsapp: newConfig.whatsapp !== undefined ? newConfig.whatsapp : DEFAULT_SITE_CONFIG.whatsapp,
    facebook: newConfig.facebook !== undefined ? newConfig.facebook : DEFAULT_SITE_CONFIG.facebook,
    phone: newConfig.phone !== undefined ? newConfig.phone : DEFAULT_SITE_CONFIG.phone,
    email: newConfig.email !== undefined ? newConfig.email : DEFAULT_SITE_CONFIG.email,
    instagram: newConfig.instagram !== undefined ? newConfig.instagram : DEFAULT_SITE_CONFIG.instagram,
    youtube: newConfig.youtube !== undefined ? newConfig.youtube : DEFAULT_SITE_CONFIG.youtube,
    tiktok: newConfig.tiktok !== undefined ? newConfig.tiktok : DEFAULT_SITE_CONFIG.tiktok,
    address: newConfig.address !== undefined ? newConfig.address : DEFAULT_SITE_CONFIG.address,
    schedule: newConfig.schedule !== undefined ? newConfig.schedule : DEFAULT_SITE_CONFIG.schedule,
    // Campos Bancarios
    bankName: newConfig.bankName !== undefined ? newConfig.bankName : DEFAULT_SITE_CONFIG.bankName,
    bankAccountHolder: newConfig.bankAccountHolder !== undefined ? newConfig.bankAccountHolder : DEFAULT_SITE_CONFIG.bankAccountHolder,
    bankAccountNumber: newConfig.bankAccountNumber !== undefined ? newConfig.bankAccountNumber : DEFAULT_SITE_CONFIG.bankAccountNumber,
    bankClabe: newConfig.bankClabe !== undefined ? newConfig.bankClabe : DEFAULT_SITE_CONFIG.bankClabe,
    updatedAt: serverTimestamp(),
  };

  if (db) {
    try {
      const docRef = doc(db, SETTINGS_COLLECTION, CONTACT_DOC_ID);
      await setDoc(docRef, payload, { merge: true });
    } catch (err) {
      console.error("Error al guardar la configuración en Firestore:", err);
      throw err;
    }
  }

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
  return payload;
}

