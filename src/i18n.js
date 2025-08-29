import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'nb-NO',      // fallback to Bokmål if nothing matches
    load: 'all',               // keep full codes (nb-NO, nn-NO, en-US, etc.)
    debug: import.meta.env.MODE === 'development',
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/react-app/locales/{{lng}}/{{ns}}.json',
    },
  });

export default i18n;
