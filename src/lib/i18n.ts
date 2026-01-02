import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import translations
import esES from '../../public/locales/es-ES/translation.json'
import ptBR from '../../public/locales/pt-BR/translation.json'
import en from '../../public/locales/en/translation.json'

const resources = {
  'es-ES': { translation: esES },
  'pt-BR': { translation: ptBR },
  'en': { translation: en },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es-ES',
    supportedLngs: ['es-ES', 'pt-BR', 'en'],

    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false,
    },
  })

export default i18n

export const languages = [
  { code: 'es-ES', name: 'Español', flag: '🇪🇸' },
  { code: 'pt-BR', name: 'Português', flag: '🇧🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
]
