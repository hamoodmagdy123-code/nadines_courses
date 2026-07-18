import { MOCK_SITE_CONTENT } from '@/lib/data'
import { useState } from 'react'
import { Save, Loader2, Plus, Trash2 } from 'lucide-react'
import { useLang } from '@/i18n/context'

export default function AdminContent() {
  const { faq: initialFaqs } = MOCK_SITE_CONTENT
  const [faqs, setFaqs] = useState(initialFaqs)
  const [saving, setSaving] = useState(false)
  const { t } = useLang()

  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 1000))
    setSaving(false)
  }

  const addFaq = () => setFaqs([...faqs, { question: '', answer: '', question_en: '', answer_en: '' }])
  const removeFaq = (i: number) => setFaqs(faqs.filter((_, idx) => idx !== i))

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-olive-800">{t('admin_content')}</h1>
          <p className="mt-1 text-olive-500">{t('admin_content_sub')}</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary !gap-1.5">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          <span>{t('admin_save_all')}</span>
        </button>
      </div>

      <div className="card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-olive-800">{t('admin_faq')}</h2>
          <button onClick={addFaq} className="btn-ghost !text-olive-600">
            <Plus className="h-4 w-4" /><span>{t('admin_add_faq')}</span>
          </button>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-xl bg-olive-50 p-4">
              <div className="flex gap-3">
                <div className="flex-1 space-y-3">
                  <input
                    value={faq.question}
                    onChange={(e) => { const next = [...faqs]; next[i] = { ...next[i], question: e.target.value }; setFaqs(next) }}
                    placeholder={`${t('admin_question')} (AR)`}
                    className="input-field"
                  />
                  <input
                    value={faq.answer}
                    onChange={(e) => { const next = [...faqs]; next[i] = { ...next[i], answer: e.target.value }; setFaqs(next) }}
                    placeholder={`${t('admin_answer')} (AR)`}
                    className="input-field"
                  />
                  <input
                    value={faq.question_en}
                    onChange={(e) => { const next = [...faqs]; next[i] = { ...next[i], question_en: e.target.value }; setFaqs(next) }}
                    placeholder={`${t('admin_question')} (EN)`}
                    className="input-field"
                  />
                  <input
                    value={faq.answer_en}
                    onChange={(e) => { const next = [...faqs]; next[i] = { ...next[i], answer_en: e.target.value }; setFaqs(next) }}
                    placeholder={`${t('admin_answer')} (EN)`}
                    className="input-field"
                  />
                </div>
                <button onClick={() => removeFaq(i)} className="self-start rounded-lg p-2 text-olive-400 transition-colors hover:bg-danger/10 hover:text-danger">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
