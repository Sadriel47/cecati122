import { useState } from 'react';
import { createPreRegistration } from '../services/registrationService';
import { checkRegistrationCooldown } from '../utils/securityUtils';

export function useCourseRegistration() {
  const [formData, setFormData] = useState({ fullName: '', phone: '', email: '', preferredSchedule: '' });
  const [honeypot, setHoneypot] = useState('');
  const [regError, setRegError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [submittingReg, setSubmittingReg] = useState(false);
  const [lastRegistered, setLastRegistered] = useState(null);

  const handleRegisterSubmit = async (e, selectedCourse) => {
    e.preventDefault();
    setRegError('');

    if (honeypot.trim() !== '') {
      setRegisterSuccess(true);
      setFormData({ fullName: '', phone: '', email: '', preferredSchedule: '' });
      setHoneypot('');
      return;
    }

    const cooldown = checkRegistrationCooldown(45);
    if (!cooldown.allowed) {
      setRegError(`Por favor espera ${cooldown.remaining} segundos antes de enviar otro pre-registro.`);
      return;
    }

    setSubmittingReg(true);

    try {
      const payload = {
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        courseId: selectedCourse.id,
        courseTitle: selectedCourse.title,
      };

      await createPreRegistration(payload);
      setLastRegistered(payload);
      setRegisterSuccess(true);
      setFormData({ fullName: '', phone: '', email: '', preferredSchedule: '' });
    } catch (err) {
      console.error("Error guardando pre-registro:", err);
      setRegError(err.message || "Ocurrió un error al procesar tu solicitud.");
    } finally {
      setSubmittingReg(false);
    }
  };

  return {
    formData,
    setFormData,
    honeypot,
    setHoneypot,
    regError,
    registerSuccess,
    setRegisterSuccess,
    submittingReg,
    lastRegistered,
    handleRegisterSubmit
  };
}
