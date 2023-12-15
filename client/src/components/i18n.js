import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-xhr-backend';

let language = localStorage.getItem('language');
if (!language) {
  language = "en-US";
}

i18n
  .use(Backend)
  .use(initReactI18next)

  .init({
    lng: language,
    fallbackLng: 'en-US',
    whitelist: ['en-US', 'fr-FR'],
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'
    },
    debug: false,
    interpolation: {
      escapeValue: false, 
    }
  });


export default i18n;