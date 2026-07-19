import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useLang } from '@/i18n/context'

export interface SiteContent {
  section_key: string
  content: Record<string, unknown>
}

export function useSiteContent() {
  return useQuery({
    queryKey: ['site-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('section_key, content')
      if (error) throw error
      return data as SiteContent[]
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useSC() {
  const { data = [] } = useSiteContent()
  const { lang } = useLang()

  const get = (key: string): Record<string, unknown> => {
    const row = data.find((d) => d.section_key === key)
    return row?.content || {}
  }

  const tr = (key: string, field: string): string => {
    const section = get(key)
    const val = section[field]
    if (!val) return ''
    if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
      return (val as Record<string, string>)[lang] || (val as Record<string, string>)['ar'] || ''
    }
    return String(val)
  }

  const arr = (key: string): unknown[] => {
    const section = get(key)
    if (Array.isArray(section)) return section
    return (section.items as unknown[]) || []
  }

  return { get, tr, arr, data, isLoading: data.length === 0 }
}
