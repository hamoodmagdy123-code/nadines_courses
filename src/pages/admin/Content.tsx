import { useState, useEffect } from 'react'
import { Save, Loader2, Plus, Trash2, ChevronDown, Check } from 'lucide-react'
import { useLang } from '@/i18n/context'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

interface FAQ {
  question: string
  answer: string
  question_en: string
  answer_en: string
}

function TrInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={label} className="input-field" />
}

function SectionEditor({
  title,
  children,
  isDirty,
  defaultOpen = false,
}: {
  title: string
  children: React.ReactNode
  isDirty: boolean
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="admin-card overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-5 text-left transition-colors duration-200 hover:bg-olive-50/30"
      >
        <div className="flex items-center gap-2.5">
          <h2 className="text-base font-bold text-olive-800">{title}</h2>
          {isDirty && (
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" title="Unsaved changes" />
          )}
        </div>
        <ChevronDown className={`h-4 w-4 text-olive-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="border-t border-olive-100/60 p-5">
          {children}
        </div>
      )}
    </div>
  )
}

export default function AdminContent() {
  const { t } = useLang()
  const queryClient = useQueryClient()

  const { data: allContent = [], isLoading } = useQuery({
    queryKey: ['admin-site-content'],
    queryFn: async () => {
      const { data, error } = await supabase.from('site_content').select('section_key, content')
      if (error) throw error
      return data as Array<{ section_key: string; content: unknown }>
    },
  })

  const [local, setLocal] = useState<Record<string, unknown>>({})
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [dirtyKeys, setDirtyKeys] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (allContent.length > 0 && Object.keys(local).length === 0) {
      const map: Record<string, unknown> = {}
      for (const row of allContent) map[row.section_key] = row.content
      setLocal(map)
      if (map.faq && Array.isArray(map.faq)) {
        setFaqs(map.faq as FAQ[])
      }
    }
  }, [allContent])

  const markDirty = (key: string) => {
    setDirtyKeys((prev) => {
      if (prev.has(key)) return prev
      const next = new Set(prev)
      next.add(key)
      return next
    })
  }

  const saveAll = useMutation({
    mutationFn: async () => {
      const promises = Array.from(dirtyKeys).map(async (key) => {
        const content = key === 'faq' ? faqs : local[key]
        const { error } = await supabase
          .from('site_content')
          .update({ content, updated_at: new Date().toISOString() })
          .eq('section_key', key)
        if (error) throw error
      })
      await Promise.all(promises)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-site-content'] })
      queryClient.invalidateQueries({ queryKey: ['site-content'] })
      setDirtyKeys(new Set())
    },
  })

  const updateField = (key: string, field: string, value: unknown) => {
    markDirty(key)
    setLocal((prev) => ({ ...prev, [key]: { ...((prev[key] || {}) as Record<string, unknown>), [field]: value } }))
  }
  const updateTrField = (key: string, field: string, lang: 'ar' | 'en', value: string) => {
    const section = (local[key] || {}) as Record<string, unknown>
    const fieldVal = ((section[field] || {}) as Record<string, string>)
    updateField(key, field, { ...fieldVal, [lang]: value })
  }
  const updateArrayItem = (key: string, index: number, field: string, lang: 'ar' | 'en', value: string) => {
    const section = (local[key] || {}) as Record<string, unknown>
    const arr = (section.items || section) as unknown[]
    if (!Array.isArray(arr)) return
    const next = [...arr]
    const item = { ...((next[index] || {}) as Record<string, unknown>) }
    const fieldVal = ((item[field] || {}) as Record<string, string>)
    item[field] = { ...fieldVal, [lang]: value }
    next[index] = item
    markDirty(key)
    if (section.items !== undefined) {
      setLocal((prev) => ({ ...prev, [key]: { ...((prev[key] || {}) as Record<string, unknown>), items: next } }))
    } else {
      setLocal((prev) => ({ ...prev, [key]: next }))
    }
  }
  const addArrayItem = (key: string, template: Record<string, unknown>) => {
    const section = (local[key] || {}) as Record<string, unknown>
    const arr = ((section.items || section) || []) as unknown[]
    const next = Array.isArray(arr) ? [...arr, template] : [template]
    markDirty(key)
    if (section.items !== undefined) {
      setLocal((prev) => ({ ...prev, [key]: { ...((prev[key] || {}) as Record<string, unknown>), items: next } }))
    } else {
      setLocal((prev) => ({ ...prev, [key]: next }))
    }
  }
  const removeArrayItem = (key: string, index: number) => {
    const section = (local[key] || {}) as Record<string, unknown>
    const arr = ((section.items || section) || []) as unknown[]
    if (!Array.isArray(arr)) return
    const next = arr.filter((_, i) => i !== index)
    markDirty(key)
    if (section.items !== undefined) {
      setLocal((prev) => ({ ...prev, [key]: { ...((prev[key] || {}) as Record<string, unknown>), items: next } }))
    } else {
      setLocal((prev) => ({ ...prev, [key]: next }))
    }
  }

  const updateFaq = (index: number, field: keyof FAQ, value: string) => {
    markDirty('faq')
    const next = [...faqs]
    next[index] = { ...next[index], [field]: value }
    setFaqs(next)
  }
  const addFaq = () => {
    markDirty('faq')
    setFaqs([...faqs, { question: '', answer: '', question_en: '', answer_en: '' }])
  }
  const removeFaq = (index: number) => {
    markDirty('faq')
    setFaqs(faqs.filter((_, i) => i !== index))
  }

  const hasChanges = dirtyKeys.size > 0

  if (isLoading || Object.keys(local).length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-olive-500" />
          <p className="text-sm text-olive-400">...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-olive-800 tracking-tight">{t('admin_content')}</h1>
          <p className="mt-1 text-olive-500">{t('admin_content_sub')}</p>
        </div>
        <button
          onClick={() => saveAll.mutate()}
          disabled={!hasChanges || saveAll.isPending}
          className="btn-primary !gap-1.5 disabled:opacity-40"
        >
          {saveAll.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          <span>{t('admin_save_all')}</span>
          {hasChanges && !saveAll.isPending && (
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-white/30 text-[10px] font-bold">
              {dirtyKeys.size}
            </span>
          )}
        </button>
      </div>

      <div className="space-y-4">
        <SectionEditor title="Hero Section" isDirty={dirtyKeys.has('hero')} defaultOpen>
          <div className="grid gap-4 sm:grid-cols-2">
            {['badge', 'title', 'subtitle', 'cta', 'instructor_name', 'instructor_label'].map((field) => (
              <div key={field} className="space-y-1.5">
                <label className="text-xs font-semibold text-olive-500 uppercase tracking-wider">{field.replace(/_/g, ' ')}</label>
                <div className="grid grid-cols-2 gap-2">
                  <TrInput label="AR" value={((local.hero as Record<string, Record<string, string>>)?.[field])?.ar || ''} onChange={(v) => updateTrField('hero', field, 'ar', v)} />
                  <TrInput label="EN" value={((local.hero as Record<string, Record<string, string>>)?.[field])?.en || ''} onChange={(v) => updateTrField('hero', field, 'en', v)} />
                </div>
              </div>
            ))}
          </div>
        </SectionEditor>

        <SectionEditor title="Stats Section" isDirty={dirtyKeys.has('stats')}>
          <div className="space-y-3">
            {(Array.isArray(local.stats) ? local.stats : []).map((s: unknown, i: number) => {
              const stat = s as Record<string, unknown>
              const label = (stat.label || {}) as Record<string, string>
              return (
              <div key={i} className="flex items-center gap-3 rounded-xl bg-olive-50/60 p-3 border border-olive-100/40">
                <input value={stat.value as string} onChange={(e) => {
                  const next = [...((Array.isArray(local.stats) ? local.stats : []) as Record<string, unknown>[])]
                  next[i] = { ...next[i], value: e.target.value }
                  markDirty('stats')
                  setLocal((prev) => ({ ...prev, stats: next }))
                }} placeholder="Value" className="input-field !w-24" />
                <div className="grid flex-1 grid-cols-2 gap-2">
                  <TrInput label="AR" value={label.ar || ''} onChange={(v) => updateArrayItem('stats', i, 'label', 'ar', v)} />
                  <TrInput label="EN" value={label.en || ''} onChange={(v) => updateArrayItem('stats', i, 'label', 'en', v)} />
                </div>
                <button onClick={() => removeArrayItem('stats', i)} className="self-start rounded-xl p-1.5 text-olive-400 transition-all duration-200 hover:bg-danger/10 hover:text-danger hover:scale-110"><Trash2 className="h-4 w-4" /></button>
              </div>
              )
            })}
            <button onClick={() => addArrayItem('stats', { value: '', label: { ar: '', en: '' } })} className="btn-ghost !text-olive-600"><Plus className="h-4 w-4" /><span>Add Stat</span></button>
          </div>
        </SectionEditor>

        <SectionEditor title="Courses Header" isDirty={dirtyKeys.has('courses_header')}>
          <div className="grid gap-4 sm:grid-cols-2">
            {['badge', 'title', 'subtitle', 'lessons_label', 'details_label', 'pay_usd_label'].map((field) => (
              <div key={field} className="space-y-1.5">
                <label className="text-xs font-semibold text-olive-500 uppercase tracking-wider">{field.replace(/_/g, ' ')}</label>
                <div className="grid grid-cols-2 gap-2">
                  <TrInput label="AR" value={((local.courses_header as Record<string, Record<string, string>>)?.[field])?.ar || ''} onChange={(v) => updateTrField('courses_header', field, 'ar', v)} />
                  <TrInput label="EN" value={((local.courses_header as Record<string, Record<string, string>>)?.[field])?.en || ''} onChange={(v) => updateTrField('courses_header', field, 'en', v)} />
                </div>
              </div>
            ))}
          </div>
        </SectionEditor>

        <SectionEditor title="Trust Section" isDirty={dirtyKeys.has('trust')}>
          <div className="space-y-3">
            {(Array.isArray(local.trust) ? local.trust : []).map((item: Record<string, unknown>, i: number) => (
              <div key={i} className="flex items-center gap-3 rounded-xl bg-olive-50/60 p-3 border border-olive-100/40">
                <div className="grid flex-1 grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <TrInput label="Label AR" value={(item.label as Record<string, string>)?.ar || ''} onChange={(v) => updateArrayItem('trust', i, 'label', 'ar', v)} />
                    <TrInput label="Sub AR" value={(item.sub as Record<string, string>)?.ar || ''} onChange={(v) => updateArrayItem('trust', i, 'sub', 'ar', v)} />
                  </div>
                  <div className="space-y-1.5">
                    <TrInput label="Label EN" value={(item.label as Record<string, string>)?.en || ''} onChange={(v) => updateArrayItem('trust', i, 'label', 'en', v)} />
                    <TrInput label="Sub EN" value={(item.sub as Record<string, string>)?.en || ''} onChange={(v) => updateArrayItem('trust', i, 'sub', 'en', v)} />
                  </div>
                </div>
                <button onClick={() => removeArrayItem('trust', i)} className="self-start rounded-xl p-1.5 text-olive-400 transition-all duration-200 hover:bg-danger/10 hover:text-danger hover:scale-110"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
            <button onClick={() => addArrayItem('trust', { label: { ar: '', en: '' }, sub: { ar: '', en: '' } })} className="btn-ghost !text-olive-600"><Plus className="h-4 w-4" /><span>Add Trust Item</span></button>
          </div>
        </SectionEditor>

        <SectionEditor title="Testimonials" isDirty={dirtyKeys.has('testimonials')}>
          <div className="grid gap-4 sm:grid-cols-2 mb-4">
            {['title', 'subtitle'].map((field) => (
              <div key={field} className="space-y-1.5">
                <label className="text-xs font-semibold text-olive-500 uppercase tracking-wider">{field}</label>
                <div className="grid grid-cols-2 gap-2">
                  <TrInput label="AR" value={((local.testimonials as Record<string, Record<string, string>>)?.[field])?.ar || ''} onChange={(v) => updateTrField('testimonials', field, 'ar', v)} />
                  <TrInput label="EN" value={((local.testimonials as Record<string, Record<string, string>>)?.[field])?.en || ''} onChange={(v) => updateTrField('testimonials', field, 'en', v)} />
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            {((local.testimonials as Record<string, unknown>)?.items as Array<Record<string, unknown>> || []).map((item: Record<string, unknown>, i: number) => (
              <div key={i} className="rounded-xl bg-olive-50/60 p-4 border border-olive-100/40">
                <div className="flex gap-3">
                  <div className="flex-1 space-y-2">
                    <input value={item.name as string || ''} onChange={(e) => {
                      const testimonials = local.testimonials as Record<string, unknown>
                      const items = [...(testimonials.items as Array<Record<string, unknown>> || [])]
                      items[i] = { ...items[i], name: e.target.value }
                      markDirty('testimonials')
                      updateField('testimonials', 'items', items)
                    }} placeholder="Name" className="input-field" />
                    <div className="grid grid-cols-2 gap-2">
                      <TrInput label="Text AR" value={(item.text as Record<string, string>)?.ar || ''} onChange={(v) => updateArrayItem('testimonials', i, 'text', 'ar', v)} />
                      <TrInput label="Text EN" value={(item.text as Record<string, string>)?.en || ''} onChange={(v) => updateArrayItem('testimonials', i, 'text', 'en', v)} />
                    </div>
                  </div>
                  <button onClick={() => removeArrayItem('testimonials', i)} className="self-start rounded-xl p-1.5 text-olive-400 transition-all duration-200 hover:bg-danger/10 hover:text-danger hover:scale-110"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
            <button onClick={() => {
              const testimonials = local.testimonials as Record<string, unknown>
              const items = [...(testimonials.items as Array<Record<string, unknown>> || []), { name: '', text: { ar: '', en: '' } }]
              markDirty('testimonials')
              updateField('testimonials', 'items', items)
            }} className="btn-ghost !text-olive-600"><Plus className="h-4 w-4" /><span>Add Testimonial</span></button>
          </div>
        </SectionEditor>

        <div className="admin-card overflow-hidden">
          <div className="flex items-center justify-between p-5">
            <div className="flex items-center gap-2.5">
              <h2 className="text-base font-bold text-olive-800">{t('admin_faq')}</h2>
              {dirtyKeys.has('faq') && (
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              )}
            </div>
            <button onClick={addFaq} className="btn-ghost !text-olive-600">
              <Plus className="h-4 w-4" /><span>{t('admin_add_faq')}</span>
            </button>
          </div>
          <div className="border-t border-olive-100/60 p-5 space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-xl bg-olive-50/60 p-4 border border-olive-100/40">
                <div className="flex gap-3">
                  <div className="flex-1 space-y-2">
                    <input value={faq.question} onChange={(e) => updateFaq(i, 'question', e.target.value)} placeholder={`${t('admin_question')} (AR)`} className="input-field" />
                    <input value={faq.answer} onChange={(e) => updateFaq(i, 'answer', e.target.value)} placeholder={`${t('admin_answer')} (AR)`} className="input-field" />
                    <input value={faq.question_en} onChange={(e) => updateFaq(i, 'question_en', e.target.value)} placeholder={`${t('admin_question')} (EN)`} className="input-field" />
                    <input value={faq.answer_en} onChange={(e) => updateFaq(i, 'answer_en', e.target.value)} placeholder={`${t('admin_answer')} (EN)`} className="input-field" />
                  </div>
                  <button onClick={() => removeFaq(i)} className="self-start rounded-xl p-2 text-olive-400 transition-all duration-200 hover:bg-danger/10 hover:text-danger hover:scale-110">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <SectionEditor title="CTA Section" isDirty={dirtyKeys.has('cta')}>
          <div className="grid gap-4 sm:grid-cols-3">
            {['title', 'subtitle', 'btn'].map((field) => (
              <div key={field} className="space-y-1.5">
                <label className="text-xs font-semibold text-olive-500 uppercase tracking-wider">{field}</label>
                <div className="grid grid-cols-2 gap-2">
                  <TrInput label="AR" value={((local.cta as Record<string, Record<string, string>>)?.[field])?.ar || ''} onChange={(v) => updateTrField('cta', field, 'ar', v)} />
                  <TrInput label="EN" value={((local.cta as Record<string, Record<string, string>>)?.[field])?.en || ''} onChange={(v) => updateTrField('cta', field, 'en', v)} />
                </div>
              </div>
            ))}
          </div>
        </SectionEditor>

        <SectionEditor title="Footer" isDirty={dirtyKeys.has('footer')}>
          <div className="grid gap-4 sm:grid-cols-2">
            {['home', 'courses', 'faq', 'rights'].map((field) => (
              <div key={field} className="space-y-1.5">
                <label className="text-xs font-semibold text-olive-500 uppercase tracking-wider">{field}</label>
                <div className="grid grid-cols-2 gap-2">
                  <TrInput label="AR" value={((local.footer as Record<string, Record<string, string>>)?.[field])?.ar || ''} onChange={(v) => updateTrField('footer', field, 'ar', v)} />
                  <TrInput label="EN" value={((local.footer as Record<string, Record<string, string>>)?.[field])?.en || ''} onChange={(v) => updateTrField('footer', field, 'en', v)} />
                </div>
              </div>
            ))}
          </div>
        </SectionEditor>

        <SectionEditor title="Checkout Success" isDirty={dirtyKeys.has('success')}>
          <div className="grid gap-4 sm:grid-cols-2">
            {['title', 'message', 'next', 'next_text', 'contact'].map((field) => (
              <div key={field} className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-olive-500 uppercase tracking-wider">{field.replace(/_/g, ' ')}</label>
                <div className="grid grid-cols-2 gap-2">
                  <TrInput label="AR" value={((local.success as Record<string, Record<string, string>>)?.[field])?.ar || ''} onChange={(v) => updateTrField('success', field, 'ar', v)} />
                  <TrInput label="EN" value={((local.success as Record<string, Record<string, string>>)?.[field])?.en || ''} onChange={(v) => updateTrField('success', field, 'en', v)} />
                </div>
              </div>
            ))}
          </div>
        </SectionEditor>

        <SectionEditor title="Checkout Failed" isDirty={dirtyKeys.has('fail')}>
          <div className="grid gap-4 sm:grid-cols-2">
            {['title', 'message', 'retry'].map((field) => (
              <div key={field} className="space-y-1.5">
                <label className="text-xs font-semibold text-olive-500 uppercase tracking-wider">{field}</label>
                <div className="grid grid-cols-2 gap-2">
                  <TrInput label="AR" value={((local.fail as Record<string, Record<string, string>>)?.[field])?.ar || ''} onChange={(v) => updateTrField('fail', field, 'ar', v)} />
                  <TrInput label="EN" value={((local.fail as Record<string, Record<string, string>>)?.[field])?.en || ''} onChange={(v) => updateTrField('fail', field, 'en', v)} />
                </div>
              </div>
            ))}
          </div>
        </SectionEditor>
      </div>

      {hasChanges && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <button
            onClick={() => saveAll.mutate()}
            disabled={saveAll.isPending}
            className="btn-primary !gap-2 !rounded-2xl !px-6 !py-3 !text-sm shadow-lg shadow-olive-900/20"
          >
            {saveAll.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span>{saveAll.isPending ? 'Saving...' : t('admin_save_all')}</span>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/30 text-[10px] font-bold">
              {dirtyKeys.size}
            </span>
          </button>
        </div>
      )}

      {saveAll.isSuccess && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white shadow-lg">
          <Check className="h-4 w-4" />
          Saved successfully
        </div>
      )}
    </div>
  )
}
