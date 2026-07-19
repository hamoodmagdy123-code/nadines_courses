import { useState, useEffect } from 'react'
import { Save, Loader2, Plus, Trash2 } from 'lucide-react'
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
  onSave,
  isPending,
}: {
  title: string
  children: React.ReactNode
  onSave: () => void
  isPending: boolean
}) {
  return (
    <div className="card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-olive-800">{title}</h2>
        <button onClick={onSave} disabled={isPending} className="btn-primary !gap-1.5 !text-xs">
          {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
          <span>Save</span>
        </button>
      </div>
      {children}
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

  useEffect(() => {
    if (allContent.length > 0 && Object.keys(local).length === 0) {
      const map: Record<string, unknown> = {}
      for (const row of allContent) map[row.section_key] = row.content
      setLocal(map)
      if (map.faq && Array.isArray(map.faq)) setFaqs(map.faq as FAQ[])
    }
  }, [allContent])

  const saveSection = useMutation({
    mutationFn: async ({ key, content }: { key: string; content: unknown }) => {
      const { error } = await supabase
        .from('site_content')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('section_key', key)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-site-content'] })
      queryClient.invalidateQueries({ queryKey: ['site-content'] })
    },
  })

  const updateField = (key: string, field: string, value: unknown) => {
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
    if (section.items !== undefined) {
      updateField(key, 'items', next)
    } else {
      setLocal((prev) => ({ ...prev, [key]: next }))
    }
  }
  const addArrayItem = (key: string, template: Record<string, unknown>) => {
    const section = (local[key] || {}) as Record<string, unknown>
    const arr = ((section.items || section) || []) as unknown[]
    const next = Array.isArray(arr) ? [...arr, template] : [template]
    if (section.items !== undefined) {
      updateField(key, 'items', next)
    } else {
      setLocal((prev) => ({ ...prev, [key]: next }))
    }
  }
  const removeArrayItem = (key: string, index: number) => {
    const section = (local[key] || {}) as Record<string, unknown>
    const arr = ((section.items || section) || []) as unknown[]
    if (!Array.isArray(arr)) return
    const next = arr.filter((_, i) => i !== index)
    if (section.items !== undefined) {
      updateField(key, 'items', next)
    } else {
      setLocal((prev) => ({ ...prev, [key]: next }))
    }
  }

  const handleSaveFaqs = () => {
    saveSection.mutate({ key: 'faq', content: faqs })
  }

  if (isLoading || Object.keys(local).length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-olive-500" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-olive-800">{t('admin_content')}</h1>
        <p className="mt-1 text-olive-500">{t('admin_content_sub')}</p>
      </div>

      <div className="space-y-6">
        {/* Hero Section */}
        <SectionEditor title="Hero Section" onSave={() => saveSection.mutate({ key: 'hero', content: local.hero || {} })} isPending={saveSection.isPending}>
          <div className="grid gap-4 sm:grid-cols-2">
            {['badge', 'title', 'subtitle', 'cta', 'instructor_name', 'instructor_label'].map((field) => (
              <div key={field} className="space-y-1">
                <label className="text-xs font-medium text-olive-500 capitalize">{field.replace(/_/g, ' ')}</label>
                <div className="grid grid-cols-2 gap-2">
                  <TrInput label="AR" value={((local.hero as Record<string, Record<string, string>>)?.[field])?.ar || ''} onChange={(v) => updateTrField('hero', field, 'ar', v)} />
                  <TrInput label="EN" value={((local.hero as Record<string, Record<string, string>>)?.[field])?.en || ''} onChange={(v) => updateTrField('hero', field, 'en', v)} />
                </div>
              </div>
            ))}
          </div>
        </SectionEditor>

        {/* Stats Section */}
        <SectionEditor title="Stats Section" onSave={() => saveSection.mutate({ key: 'stats', content: local.stats || [] })} isPending={saveSection.isPending}>
          <div className="space-y-3">
            {(Array.isArray(local.stats) ? local.stats : []).map((s: unknown, i: number) => {
              const stat = s as Record<string, unknown>
              const label = (stat.label || {}) as Record<string, string>
              return (
              <div key={i} className="flex items-center gap-3 rounded-xl bg-olive-50 p-3">
                <input value={stat.value as string} onChange={(e) => {
                  const next = [...((Array.isArray(local.stats) ? local.stats : []) as Record<string, unknown>[])]
                  next[i] = { ...next[i], value: e.target.value }
                  setLocal((prev) => ({ ...prev, stats: next }))
                }} placeholder="Value" className="input-field !w-24" />
                <div className="grid flex-1 grid-cols-2 gap-2">
                  <TrInput label="AR" value={label.ar || ''} onChange={(v) => updateArrayItem('stats', i, 'label', 'ar', v)} />
                  <TrInput label="EN" value={label.en || ''} onChange={(v) => updateArrayItem('stats', i, 'label', 'en', v)} />
                </div>
                <button onClick={() => removeArrayItem('stats', i)} className="self-start rounded-lg p-1.5 text-olive-400 hover:bg-danger/10 hover:text-danger"><Trash2 className="h-4 w-4" /></button>
              </div>
              )
            })}
            <button onClick={() => addArrayItem('stats', { value: '', label: { ar: '', en: '' } })} className="btn-ghost !text-olive-600"><Plus className="h-4 w-4" /><span>Add Stat</span></button>
          </div>
        </SectionEditor>

        {/* Courses Header */}
        <SectionEditor title="Courses Header" onSave={() => saveSection.mutate({ key: 'courses_header', content: local.courses_header || {} })} isPending={saveSection.isPending}>
          <div className="grid gap-4 sm:grid-cols-2">
            {['badge', 'title', 'subtitle', 'lessons_label', 'details_label', 'pay_usd_label'].map((field) => (
              <div key={field} className="space-y-1">
                <label className="text-xs font-medium text-olive-500 capitalize">{field.replace(/_/g, ' ')}</label>
                <div className="grid grid-cols-2 gap-2">
                  <TrInput label="AR" value={((local.courses_header as Record<string, Record<string, string>>)?.[field])?.ar || ''} onChange={(v) => updateTrField('courses_header', field, 'ar', v)} />
                  <TrInput label="EN" value={((local.courses_header as Record<string, Record<string, string>>)?.[field])?.en || ''} onChange={(v) => updateTrField('courses_header', field, 'en', v)} />
                </div>
              </div>
            ))}
          </div>
        </SectionEditor>

        {/* Trust Section */}
        <SectionEditor title="Trust Section" onSave={() => saveSection.mutate({ key: 'trust', content: local.trust || [] })} isPending={saveSection.isPending}>
          <div className="space-y-3">
            {(Array.isArray(local.trust) ? local.trust : []).map((item: Record<string, unknown>, i: number) => (
              <div key={i} className="flex items-center gap-3 rounded-xl bg-olive-50 p-3">
                <div className="grid flex-1 grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <TrInput label="Label AR" value={(item.label as Record<string, string>)?.ar || ''} onChange={(v) => updateArrayItem('trust', i, 'label', 'ar', v)} />
                    <TrInput label="Sub AR" value={(item.sub as Record<string, string>)?.ar || ''} onChange={(v) => updateArrayItem('trust', i, 'sub', 'ar', v)} />
                  </div>
                  <div className="space-y-1">
                    <TrInput label="Label EN" value={(item.label as Record<string, string>)?.en || ''} onChange={(v) => updateArrayItem('trust', i, 'label', 'en', v)} />
                    <TrInput label="Sub EN" value={(item.sub as Record<string, string>)?.en || ''} onChange={(v) => updateArrayItem('trust', i, 'sub', 'en', v)} />
                  </div>
                </div>
                <button onClick={() => removeArrayItem('trust', i)} className="self-start rounded-lg p-1.5 text-olive-400 hover:bg-danger/10 hover:text-danger"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
            <button onClick={() => addArrayItem('trust', { label: { ar: '', en: '' }, sub: { ar: '', en: '' } })} className="btn-ghost !text-olive-600"><Plus className="h-4 w-4" /><span>Add Trust Item</span></button>
          </div>
        </SectionEditor>

        {/* Testimonials */}
        <SectionEditor title="Testimonials" onSave={() => saveSection.mutate({ key: 'testimonials', content: local.testimonials || {} })} isPending={saveSection.isPending}>
          <div className="grid gap-4 sm:grid-cols-2 mb-4">
            {['title', 'subtitle'].map((field) => (
              <div key={field} className="space-y-1">
                <label className="text-xs font-medium text-olive-500 capitalize">{field}</label>
                <div className="grid grid-cols-2 gap-2">
                  <TrInput label="AR" value={((local.testimonials as Record<string, Record<string, string>>)?.[field])?.ar || ''} onChange={(v) => updateTrField('testimonials', field, 'ar', v)} />
                  <TrInput label="EN" value={((local.testimonials as Record<string, Record<string, string>>)?.[field])?.en || ''} onChange={(v) => updateTrField('testimonials', field, 'en', v)} />
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            {((local.testimonials as Record<string, unknown>)?.items as Array<Record<string, unknown>> || []).map((item: Record<string, unknown>, i: number) => (
              <div key={i} className="rounded-xl bg-olive-50 p-4">
                <div className="flex gap-3">
                  <div className="flex-1 space-y-2">
                    <input value={item.name as string || ''} onChange={(e) => {
                      const testimonials = local.testimonials as Record<string, unknown>
                      const items = [...(testimonials.items as Array<Record<string, unknown>> || [])]
                      items[i] = { ...items[i], name: e.target.value }
                      updateField('testimonials', 'items', items)
                    }} placeholder="Name" className="input-field" />
                    <div className="grid grid-cols-2 gap-2">
                      <TrInput label="Text AR" value={(item.text as Record<string, string>)?.ar || ''} onChange={(v) => updateArrayItem('testimonials', i, 'text', 'ar', v)} />
                      <TrInput label="Text EN" value={(item.text as Record<string, string>)?.en || ''} onChange={(v) => updateArrayItem('testimonials', i, 'text', 'en', v)} />
                    </div>
                  </div>
                  <button onClick={() => removeArrayItem('testimonials', i)} className="self-start rounded-lg p-1.5 text-olive-400 hover:bg-danger/10 hover:text-danger"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
            <button onClick={() => {
              const testimonials = local.testimonials as Record<string, unknown>
              const items = [...(testimonials.items as Array<Record<string, unknown>> || []), { name: '', text: { ar: '', en: '' } }]
              updateField('testimonials', 'items', items)
            }} className="btn-ghost !text-olive-600"><Plus className="h-4 w-4" /><span>Add Testimonial</span></button>
          </div>
        </SectionEditor>

        {/* FAQ Section */}
        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-olive-800">{t('admin_faq')}</h2>
            <div className="flex items-center gap-2">
              <button onClick={() => setFaqs([...faqs, { question: '', answer: '', question_en: '', answer_en: '' }])} className="btn-ghost !text-olive-600">
                <Plus className="h-4 w-4" /><span>{t('admin_add_faq')}</span>
              </button>
              <button onClick={handleSaveFaqs} disabled={saveSection.isPending} className="btn-primary !gap-1.5 !text-xs">
                {saveSection.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                <span>Save</span>
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-xl bg-olive-50 p-4">
                <div className="flex gap-3">
                  <div className="flex-1 space-y-3">
                    <input value={faq.question} onChange={(e) => { const next = [...faqs]; next[i] = { ...next[i], question: e.target.value }; setFaqs(next) }} placeholder={`${t('admin_question')} (AR)`} className="input-field" />
                    <input value={faq.answer} onChange={(e) => { const next = [...faqs]; next[i] = { ...next[i], answer: e.target.value }; setFaqs(next) }} placeholder={`${t('admin_answer')} (AR)`} className="input-field" />
                    <input value={faq.question_en} onChange={(e) => { const next = [...faqs]; next[i] = { ...next[i], question_en: e.target.value }; setFaqs(next) }} placeholder={`${t('admin_question')} (EN)`} className="input-field" />
                    <input value={faq.answer_en} onChange={(e) => { const next = [...faqs]; next[i] = { ...next[i], answer_en: e.target.value }; setFaqs(next) }} placeholder={`${t('admin_answer')} (EN)`} className="input-field" />
                  </div>
                  <button onClick={() => setFaqs(faqs.filter((_, idx) => idx !== i))} className="self-start rounded-lg p-2 text-olive-400 transition-colors hover:bg-danger/10 hover:text-danger">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <SectionEditor title="CTA Section" onSave={() => saveSection.mutate({ key: 'cta', content: local.cta || {} })} isPending={saveSection.isPending}>
          <div className="grid gap-4 sm:grid-cols-3">
            {['title', 'subtitle', 'btn'].map((field) => (
              <div key={field} className="space-y-1">
                <label className="text-xs font-medium text-olive-500 capitalize">{field}</label>
                <div className="grid grid-cols-2 gap-2">
                  <TrInput label="AR" value={((local.cta as Record<string, Record<string, string>>)?.[field])?.ar || ''} onChange={(v) => updateTrField('cta', field, 'ar', v)} />
                  <TrInput label="EN" value={((local.cta as Record<string, Record<string, string>>)?.[field])?.en || ''} onChange={(v) => updateTrField('cta', field, 'en', v)} />
                </div>
              </div>
            ))}
          </div>
        </SectionEditor>

        {/* Footer */}
        <SectionEditor title="Footer" onSave={() => saveSection.mutate({ key: 'footer', content: local.footer || {} })} isPending={saveSection.isPending}>
          <div className="grid gap-4 sm:grid-cols-2">
            {['home', 'courses', 'faq', 'rights'].map((field) => (
              <div key={field} className="space-y-1">
                <label className="text-xs font-medium text-olive-500 capitalize">{field}</label>
                <div className="grid grid-cols-2 gap-2">
                  <TrInput label="AR" value={((local.footer as Record<string, Record<string, string>>)?.[field])?.ar || ''} onChange={(v) => updateTrField('footer', field, 'ar', v)} />
                  <TrInput label="EN" value={((local.footer as Record<string, Record<string, string>>)?.[field])?.en || ''} onChange={(v) => updateTrField('footer', field, 'en', v)} />
                </div>
              </div>
            ))}
          </div>
        </SectionEditor>

        {/* Success Page */}
        <SectionEditor title="Checkout Success" onSave={() => saveSection.mutate({ key: 'success', content: local.success || {} })} isPending={saveSection.isPending}>
          <div className="grid gap-4 sm:grid-cols-2">
            {['title', 'message', 'next', 'next_text', 'contact'].map((field) => (
              <div key={field} className="space-y-1 sm:col-span-2">
                <label className="text-xs font-medium text-olive-500 capitalize">{field.replace(/_/g, ' ')}</label>
                <div className="grid grid-cols-2 gap-2">
                  <TrInput label="AR" value={((local.success as Record<string, Record<string, string>>)?.[field])?.ar || ''} onChange={(v) => updateTrField('success', field, 'ar', v)} />
                  <TrInput label="EN" value={((local.success as Record<string, Record<string, string>>)?.[field])?.en || ''} onChange={(v) => updateTrField('success', field, 'en', v)} />
                </div>
              </div>
            ))}
          </div>
        </SectionEditor>

        {/* Fail Page */}
        <SectionEditor title="Checkout Failed" onSave={() => saveSection.mutate({ key: 'fail', content: local.fail || {} })} isPending={saveSection.isPending}>
          <div className="grid gap-4 sm:grid-cols-2">
            {['title', 'message', 'retry'].map((field) => (
              <div key={field} className="space-y-1">
                <label className="text-xs font-medium text-olive-500 capitalize">{field}</label>
                <div className="grid grid-cols-2 gap-2">
                  <TrInput label="AR" value={((local.fail as Record<string, Record<string, string>>)?.[field])?.ar || ''} onChange={(v) => updateTrField('fail', field, 'ar', v)} />
                  <TrInput label="EN" value={((local.fail as Record<string, Record<string, string>>)?.[field])?.en || ''} onChange={(v) => updateTrField('fail', field, 'en', v)} />
                </div>
              </div>
            ))}
          </div>
        </SectionEditor>
      </div>
    </div>
  )
}
