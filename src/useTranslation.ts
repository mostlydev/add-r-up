import { useState, useCallback } from 'react'
import en from './locales/en.json'
import pl from './locales/pl.json'

export type LangCode = 'en' | 'pl'

const locales: Record<LangCode, Record<string, string>> = { en, pl }

export const AVAILABLE_LANGUAGES: { code: LangCode; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'pl', name: 'Polski' },
]

function detectLanguage(): LangCode {
  const browser = navigator.language?.substring(0, 2).toLowerCase()
  return AVAILABLE_LANGUAGES.some(l => l.code === browser) ? (browser as LangCode) : 'en'
}

export function useTranslation() {
  const [lang, setLang] = useState<LangCode>(detectLanguage)

  const t = useCallback(
    (key: string) => locales[lang][key] ?? key,
    [lang]
  )

  return { t, lang, setLang, languages: AVAILABLE_LANGUAGES }
}
