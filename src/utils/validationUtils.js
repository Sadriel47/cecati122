import { sanitizeInput, validateRegistrationSchema, isValidEmail } from './securityUtils';

export { sanitizeInput, validateRegistrationSchema, isValidEmail };

export function formatPhoneNumber(phone) {
  if (!phone) return '';
  const cleaned = String(phone).replace(/\D/g, '');
  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 6) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
  return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 10)}`;
}
