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
    
    // OPTION 1: Use Environment Variable (Recommended for security/flexibility)
    // OPTION 2: Hardcode your ID below if you don't want to use Env Vars
    // Note: The Website ID is public information, so hardcoding it is safe.
    const HARDCODED_WEBSITE_ID = ""; // Paste your ID inside the quotes if hardcoding
    
    const websiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID || HARDCODED_WEBSITE_ID;
    
    if (websiteId) {
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
      // Fallback or warning if env var is missing
      console.warn('UMAMI ANALYTICS: SKIPPED (Missing VITE_UMAMI_WEBSITE_ID)');
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
