import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getSiteConfig, saveSiteConfig, DEFAULT_SITE_CONFIG, getWhatsAppUrl, getCleanWhatsAppNumber } from '../services/siteConfigService';

const SiteConfigContext = createContext(null);

export function SiteConfigProvider({ children }) {
  const [config, setConfig] = useState(DEFAULT_SITE_CONFIG);
  const [loading, setLoading] = useState(true);

  const refreshConfig = useCallback(async () => {
    try {
      const data = await getSiteConfig();
      setConfig(data);
    } catch (err) {
      console.warn("Error al cargar configuración de sitio:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshConfig();
  }, [refreshConfig]);

  const updateConfig = useCallback(async (newConfigData) => {
    const updated = await saveSiteConfig(newConfigData);
    setConfig((prev) => ({ ...prev, ...updated }));
    return updated;
  }, []);

  const getWhatsAppLink = useCallback((text = '') => {
    return getWhatsAppUrl(config.whatsapp, text);
  }, [config.whatsapp]);

  return (
    <SiteConfigContext.Provider
      value={{
        config,
        loading,
        updateConfig,
        refreshConfig,
        getWhatsAppLink,
        cleanWhatsAppNumber: getCleanWhatsAppNumber(config.whatsapp),
      }}
    >
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig() {
  const context = useContext(SiteConfigContext);
  if (!context) {
    throw new Error('useSiteConfig debe ser usado dentro de un SiteConfigProvider');
  }
  return context;
}
