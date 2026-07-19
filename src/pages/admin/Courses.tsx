import { useState } from 'react'
import { Save, Loader2, Package, Layers, type LucideIcon } from 'lucide-react'
import { useLang } from '@/i18n/context'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAllCourses } from '@/hooks/useCourses'
import { updateCourse } from '@/lib/functions'

const ICON_MAP: Record<string, LucideIcon> = { Package, Layers }

export default function AdminCourses() {
  const { t } = useLang()
  const queryClient = useQueryClient()
  const { data: courses = [], isLoading } = useAllCourses()
  const [edits, setEdits] = useState<Record<string, Record<string, unknown>>>({})

  const mutation = useMutation({
    mutationFn: ({ id, ...updates }: { id: string; [key: string]: unknown }) => updateCourse(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses-all'] })
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      setEdits({})
    },
  })

  const getEdit = (id: string, field: string, original: unknown) => {
    return edits[id]?.[field] ?? original
  }

  const updateEdit = (id: string, field: string, value: unknown) => {
    setEdits((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [field]: value },
    }))
  }

  const handleSave = (course: { id: string }) => {
    const courseEdits = edits[course.id]
    if (!courseEdits) return
    mutation.mutate({ id: course.id, ...courseEdits })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-olive-500" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-olive-800">{t('admin_manage_courses')}</h1>
        <p className="mt-1 text-olive-500">{t('admin_manage_courses_sub')}</p>
      </div>

      <div className="space-y-6">
        {courses.map((course) => {
          const CI = ICON_MAP[course.icon] || Package
          return (
            <div key={course.id} className="card p-6">
              <div className="mb-4 flex items-center gap-3">
                <CI className="h-6 w-6 text-olive-600" strokeWidth={2} />
                <div>
                  <h3 className="font-bold text-olive-800">{course.title}</h3>
                  <p className="text-sm text-olive-500">{course.slug}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-olive-500">{t('admin_title_field')}</label>
                  <input
                    value={getEdit(course.id, 'title', course.title) as string}
                    onChange={(e) => updateEdit(course.id, 'title', e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-olive-500">{t('admin_egypt_price')}</label>
                  <input
                    type="number"
                    value={getEdit(course.id, 'egypt_price', course.egypt_price) as number}
                    onChange={(e) => updateEdit(course.id, 'egypt_price', Number(e.target.value))}
                    className="input-field"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-olive-500">{t('admin_intl_price')}</label>
                  <input
                    type="number"
                    value={getEdit(course.id, 'international_price_usd', course.international_price_usd) as number}
                    onChange={(e) => updateEdit(course.id, 'international_price_usd', Number(e.target.value))}
                    className="input-field"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-olive-500">{t('admin_status')}</label>
                  <select
                    value={getEdit(course.id, 'is_active', course.is_active) ? 'active' : 'inactive'}
                    onChange={(e) => updateEdit(course.id, 'is_active', e.target.value === 'active')}
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
                  value={getEdit(course.id, 'description', course.description) as string}
                  onChange={(e) => updateEdit(course.id, 'description', e.target.value)}
                  className="input-field"
                  rows={2}
                />
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => handleSave(course)}
                  disabled={!edits[course.id] || mutation.isPending}
                  className="btn-primary !gap-1.5 disabled:opacity-50"
                >
                  {mutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>{t('admin_save')}</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
