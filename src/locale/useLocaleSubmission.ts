import { useLocale } from './LocaleContext'

/** Country + language metadata for lead/demo submissions */
export function useLocaleSubmission() {
  const { country, lang, countryCode } = useLocale()
  return {
    localeCountry: country,
    localeLang: lang,
    countryCode,
  }
}
