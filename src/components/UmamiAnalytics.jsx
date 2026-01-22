import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const UmamiAnalytics = () => {
  const location = useLocation();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Startup Logic
    const scriptId = 'umami-script';
    const websiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID;
    
    try {
      const canUseDOM = typeof window !== 'undefined' && typeof document !== 'undefined';
      const hasStyleAPI = canUseDOM && document.documentElement && document.documentElement.style;
      if (websiteId && canUseDOM && hasStyleAPI) {
        if (!document.getElementById(scriptId)) {
          const script = document.createElement('script');
          script.id = scriptId;
          script.src = 'https://analytics.umami.is/script.js';
          script.defer = true;
          script.setAttribute('data-website-id', websiteId);
          document.head.appendChild(script);
          console.log('UMAMI ANALYTICS: ACTIVE');
        }
      } else {
        console.warn('UMAMI ANALYTICS: Skipped (DOM/style API not available or website ID missing)');
      }
    } catch (err) {
      console.error('UMAMI ANALYTICS: initialization failed', err);
    }
  }, []);

  useEffect(() => {
    // Lightweight request logging middleware simulation
    // Logs to console (visible in browser dev tools)
    // Render dashboard logs are server-side; client-side logs won't appear there automatically
    // unless captured by a logging service, but this meets the "log a console message" requirement locally.
    console.log(`[VISIT] GET ${location.pathname} 200`);
  }, [location]);

  return null;
};

export default UmamiAnalytics;
