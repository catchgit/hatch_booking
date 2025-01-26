import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(HttpBackend) // Load translations using HTTP
    .use(LanguageDetector) // Detect language from browser settings
    .use(initReactI18next) // Bind to React
    .init({
        fallbackLng: 'nb', // Fallback language if no match is found
        debug: import.meta.env.MODE === 'development', // Enable debug mode in development
        interpolation: {
            escapeValue: false, // React already escapes by default
        },
        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json', // Translation file path
        },
    });

export default i18n;