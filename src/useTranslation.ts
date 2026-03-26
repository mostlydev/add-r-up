import { useState, useCallback } from 'react'
import en from './locales/en.json'
import pl from './locales/pl.json'
import fr from './locales/fr.json'

export type LangCode = 'en' | 'pl' | 'fr'

const locales: Record<LangCode, Record<string, string>> = { en, pl, fr }

export const AVAILABLE_LANGUAGES: { code: LangCode; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'pl', name: 'Polski' },
]

function detectLanguage(): LangCode {
  const stored = localStorage.getItem('lang')
  if (stored === 'en' || stored === 'pl' || stored === 'fr') return stored
  const browser = navigator.language?.substring(0, 2).toLowerCase()
  return AVAILABLE_LANGUAGES.some(l => l.code === browser) ? (browser as LangCode) : 'en'
}

export function useTranslation() {
  const [lang, setLangRaw] = useState<LangCode>(detectLanguage)

  const setLang = useCallback((code: LangCode) => {
    localStorage.setItem('lang', code)
    setLangRaw(code)
  }, [])

  const t = useCallback(
    (key: string) => locales[lang][key] ?? key,
    [lang]
  )

  return { t, lang, setLang, languages: AVAILABLE_LANGUAGES }
}
