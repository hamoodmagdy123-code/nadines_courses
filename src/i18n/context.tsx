import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import t, { type Lang, type TranslationKey } from './translations'

interface LangCtx {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: TranslationKey) => string
  dir: 'rtl' | 'ltr'
}

const Ctx = createContext<LangCtx>(null!)

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'))
  return match ? decodeURIComponent(match[1]) : null
}

function setCookie(name: string, value: string, days = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Lax`
}

function detectLang(): Lang {
  const saved = getCookie('lang')
  if (saved === 'ar' || saved === 'en') return saved
  const browserLang = navigator.language.toLowerCase()
  return browserLang.startsWith('ar') ? 'ar' : 'en'
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(detectLang)

  useEffect(() => {
    setCookie('lang', lang)
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }, [lang])

  const translate = (key: TranslationKey) => t[lang][key] || t.ar[key]

  return (
    <Ctx.Provider value={{ lang, setLang, t: translate, dir: lang === 'ar' ? 'rtl' : 'ltr' }}>
      {children}
    </Ctx.Provider>
  )
}

export function useLang() {
  return useContext(Ctx)
}
