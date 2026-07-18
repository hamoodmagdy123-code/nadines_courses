import { MOCK_COURSES } from '@/lib/data'
import { useState } from 'react'
import { Save, Loader2, Package, Layers, type LucideIcon } from 'lucide-react'
import { useLang } from '@/i18n/context'

const ICON_MAP: Record<string, LucideIcon> = { Package, Layers }

export default function AdminCourses() {
  const [courses, setCourses] = useState(MOCK_COURSES)
  const [saving, setSaving] = useState<string | null>(null)
  const { t } = useLang()

  const updateField = (id: string, field: string, value: string | number | boolean) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    )
  }

  const handleSave = async (id: string) => {
    setSaving(id)
    await new Promise((r) => setTimeout(r, 1000))
    setSaving(null)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-olive-800">{t('admin_manage_courses')}</h1>
        <p className="mt-1 text-olive-500">{t('admin_manage_courses_sub')}</p>
      </div>

      <div className="space-y-6">
        {courses.map((course) => (
          <div key={course.id} className="card p-6">
            <div className="mb-4 flex items-center gap-3">
              {(() => { const CI = ICON_MAP[course.icon] || Package; return <CI className="h-6 w-6 text-olive-600" strokeWidth={2} />; })()}
              <div>
                <h3 className="font-bold text-olive-800">{course.title}</h3>
                <p className="text-sm text-olive-500">{course.slug}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-olive-500">{t('admin_title_field')}</label>
                <input
                  value={course.title}
                  onChange={(e) => updateField(course.id, 'title', e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-olive-500">{t('admin_egypt_price')}</label>
                <input
                  type="number"
                  value={course.egypt_price}
                  onChange={(e) => updateField(course.id, 'egypt_price', Number(e.target.value))}
                  className="input-field"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-olive-500">{t('admin_intl_price')}</label>
                <input
                  type="number"
                  value={course.international_price_usd}
                  onChange={(e) => updateField(course.id, 'international_price_usd', Number(e.target.value))}
                  className="input-field"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-olive-500">{t('admin_status')}</label>
                <select
                  value={course.is_active ? 'active' : 'inactive'}
                  onChange={(e) => updateField(course.id, 'is_active', e.target.value === 'active')}
                  className="input-field"
                >
                  <option value="active">{t('admin_active')}</option>
                  <option value="inactive">{t('admin_inactive')}</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-1 block text-xs font-medium text-olive-500">{t('admin_desc')}</label>
              <textarea
                value={course.description}
                onChange={(e) => updateField(course.id, 'description', e.target.value)}
                className="input-field"
                rows={2}
              />
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => handleSave(course.id)}
                disabled={saving === course.id}
                className="btn-primary !gap-1.5"
              >
                {saving === course.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>{t('admin_save')}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
