import { useState } from 'react'
import { Save, Loader2, Package, Layers, Plus, Trash2, X } from 'lucide-react'
import { useLang } from '@/i18n/context'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAllCourses } from '@/hooks/useCourses'
import { updateCourse, createCourse, deleteCourse } from '@/lib/functions'
import { ConfirmModal } from '@/components/ConfirmModal'

const ICON_MAP: Record<string, typeof Package> = { Package, Layers }

interface CourseForm {
  title: string
  title_en: string
  description: string
  description_en: string
  slug: string
  egypt_price: number
  international_price_usd: number
  image_url: string
  icon: string
  sort_order: number
  curriculum: string
  curriculum_en: string
}

const EMPTY_FORM: CourseForm = {
  title: '', title_en: '', description: '', description_en: '',
  slug: '', egypt_price: 0, international_price_usd: 0,
  image_url: '/nadines.webp', icon: 'Package', sort_order: 0,
  curriculum: '', curriculum_en: '',
}

export default function AdminCourses() {
  const { t } = useLang()
  const queryClient = useQueryClient()
  const { data: courses = [], isLoading } = useAllCourses()
  const [edits, setEdits] = useState<Record<string, Record<string, unknown>>>({})
  const [showCreate, setShowCreate] = useState(false)
  const [newCourse, setNewCourse] = useState<CourseForm>(EMPTY_FORM)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const updateMutation = useMutation({
    mutationFn: ({ id, ...updates }: { id: string; [key: string]: unknown }) => updateCourse(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses-all'] })
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      setEdits({})
    },
  })

  const createMutation = useMutation({
    mutationFn: (course: Record<string, unknown>) => createCourse(course),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses-all'] })
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      setShowCreate(false)
      setNewCourse(EMPTY_FORM)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (course_id: string) => deleteCourse(course_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses-all'] })
      queryClient.invalidateQueries({ queryKey: ['courses'] })
    },
  })

  const getEdit = (id: string, field: string, original: unknown) => edits[id]?.[field] ?? original
  const updateEdit = (id: string, field: string, value: unknown) => {
    setEdits((prev) => ({ ...prev, [id]: { ...(prev[id] || {}), [field]: value } }))
  }
  const handleSave = (course: { id: string }) => {
    const courseEdits = edits[course.id]
    if (!courseEdits) return
    updateMutation.mutate({ id: course.id, ...courseEdits })
  }
  const handleDelete = (id: string) => {
    setDeleteId(id)
  }
  const handleCreate = () => {
    createMutation.mutate({
      ...newCourse,
      curriculum: newCourse.curriculum ? newCourse.curriculum.split('\n').filter(Boolean) : [],
      curriculum_en: newCourse.curriculum_en ? newCourse.curriculum_en.split('\n').filter(Boolean) : [],
    })
  }

  if (isLoading) {
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
          <h1 className="text-2xl font-extrabold text-olive-800 tracking-tight">{t('admin_manage_courses')}</h1>
          <p className="mt-1 text-olive-500">{t('admin_manage_courses_sub')}</p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)} className="btn-primary !gap-1.5">
          <Plus className="h-4 w-4" />
          <span>{t('admin_add')}</span>
        </button>
      </div>

      {showCreate && (
        <div className="mb-6 overflow-hidden rounded-2xl border-2 border-dashed border-olive-200 bg-white/80 p-6" style={{ boxShadow: '0 4px 20px -6px rgba(63,66,31,0.08)' }}>
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-bold text-olive-800">New Course</h3>
            <button onClick={() => setShowCreate(false)} className="rounded-xl p-1.5 text-olive-400 transition-all duration-200 hover:bg-olive-100 hover:text-olive-600">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-olive-500 uppercase tracking-wider">Title (AR)</label>
              <input value={newCourse.title} onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-olive-500 uppercase tracking-wider">Title (EN)</label>
              <input value={newCourse.title_en} onChange={(e) => setNewCourse({ ...newCourse, title_en: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-olive-500 uppercase tracking-wider">Slug</label>
              <input value={newCourse.slug} onChange={(e) => setNewCourse({ ...newCourse, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })} className="input-field" dir="ltr" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-olive-500 uppercase tracking-wider">Icon</label>
              <select value={newCourse.icon} onChange={(e) => setNewCourse({ ...newCourse, icon: e.target.value })} className="input-field">
                <option value="Package">Package</option>
                <option value="Layers">Layers</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-olive-500 uppercase tracking-wider">{t('admin_egypt_price')}</label>
              <input type="number" value={newCourse.egypt_price || ''} onChange={(e) => setNewCourse({ ...newCourse, egypt_price: Number(e.target.value) })} className="input-field" dir="ltr" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-olive-500 uppercase tracking-wider">{t('admin_intl_price')}</label>
              <input type="number" value={newCourse.international_price_usd || ''} onChange={(e) => setNewCourse({ ...newCourse, international_price_usd: Number(e.target.value) })} className="input-field" dir="ltr" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-olive-500 uppercase tracking-wider">Image URL</label>
              <input value={newCourse.image_url} onChange={(e) => setNewCourse({ ...newCourse, image_url: e.target.value })} className="input-field" dir="ltr" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-olive-500 uppercase tracking-wider">Sort Order</label>
              <input type="number" value={newCourse.sort_order} onChange={(e) => setNewCourse({ ...newCourse, sort_order: Number(e.target.value) })} className="input-field" dir="ltr" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-olive-500 uppercase tracking-wider">Description (AR)</label>
              <textarea value={newCourse.description} onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })} className="input-field" rows={2} />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-olive-500 uppercase tracking-wider">Description (EN)</label>
              <textarea value={newCourse.description_en} onChange={(e) => setNewCourse({ ...newCourse, description_en: e.target.value })} className="input-field" rows={2} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-olive-500 uppercase tracking-wider">Curriculum (AR) — one per line</label>
              <textarea value={newCourse.curriculum} onChange={(e) => setNewCourse({ ...newCourse, curriculum: e.target.value })} className="input-field" rows={4} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-olive-500 uppercase tracking-wider">Curriculum (EN) — one per line</label>
              <textarea value={newCourse.curriculum_en} onChange={(e) => setNewCourse({ ...newCourse, curriculum_en: e.target.value })} className="input-field" rows={4} />
            </div>
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <button onClick={() => setShowCreate(false)} className="rounded-xl px-4 py-2.5 text-sm font-medium text-olive-600 transition-all duration-200 hover:bg-olive-100">Cancel</button>
            <button onClick={handleCreate} disabled={!newCourse.title || !newCourse.slug || createMutation.isPending}
              className="btn-primary !gap-1.5 disabled:opacity-50">
              {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              <span>Create Course</span>
            </button>
          </div>
        </div>
      )}

      <div className="space-y-5">
        {courses.map((course) => {
          const CI = ICON_MAP[course.icon] || Package
          return (
            <div key={course.id} className="admin-card p-6">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-olive-100 transition-all duration-200 group-hover:bg-olive-200">
                    <CI className="h-5 w-5 text-olive-600" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="font-bold text-olive-800">{course.title}</h3>
                    <p className="text-sm text-olive-500">/{course.slug}</p>
                  </div>
                </div>
                <button onClick={() => handleDelete(course.id)} disabled={deleteMutation.isPending}
                  title="Delete" className="rounded-xl p-2 text-olive-400 transition-all duration-200 hover:bg-danger/10 hover:text-danger disabled:opacity-50 hover:scale-105">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-olive-500 uppercase tracking-wider">{t('admin_title_field')} (AR)</label>
                  <input value={getEdit(course.id, 'title', course.title) as string}
                    onChange={(e) => updateEdit(course.id, 'title', e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-olive-500 uppercase tracking-wider">{t('admin_title_field')} (EN)</label>
                  <input value={getEdit(course.id, 'title_en', course.title_en) as string}
                    onChange={(e) => updateEdit(course.id, 'title_en', e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-olive-500 uppercase tracking-wider">{t('admin_egypt_price')}</label>
                  <input type="number" value={getEdit(course.id, 'egypt_price', course.egypt_price) as number}
                    onChange={(e) => updateEdit(course.id, 'egypt_price', Number(e.target.value))} className="input-field" dir="ltr" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-olive-500 uppercase tracking-wider">{t('admin_intl_price')}</label>
                  <input type="number" value={getEdit(course.id, 'international_price_usd', course.international_price_usd) as number}
                    onChange={(e) => updateEdit(course.id, 'international_price_usd', Number(e.target.value))} className="input-field" dir="ltr" />
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-olive-500 uppercase tracking-wider">{t('admin_desc')} (AR)</label>
                  <textarea value={getEdit(course.id, 'description', course.description) as string}
                    onChange={(e) => updateEdit(course.id, 'description', e.target.value)} className="input-field" rows={2} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-olive-500 uppercase tracking-wider">{t('admin_desc')} (EN)</label>
                  <textarea value={getEdit(course.id, 'description_en', course.description_en) as string}
                    onChange={(e) => updateEdit(course.id, 'description_en', e.target.value)} className="input-field" rows={2} />
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-olive-500 uppercase tracking-wider">Curriculum (AR) — one per line</label>
                  <textarea
                    value={getEdit(course.id, 'curriculum', (course.curriculum || []).join('\n')) as string}
                    onChange={(e) => updateEdit(course.id, 'curriculum', e.target.value.split('\n').filter(Boolean))}
                    className="input-field" rows={4}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-olive-500 uppercase tracking-wider">Curriculum (EN) — one per line</label>
                  <textarea
                    value={getEdit(course.id, 'curriculum_en', (course.curriculum_en || []).join('\n')) as string}
                    onChange={(e) => updateEdit(course.id, 'curriculum_en', e.target.value.split('\n').filter(Boolean))}
                    className="input-field" rows={4}
                  />
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-olive-500 uppercase tracking-wider">{t('admin_status')}</label>
                  <select value={getEdit(course.id, 'is_active', course.is_active) ? 'active' : 'inactive'}
                    onChange={(e) => updateEdit(course.id, 'is_active', e.target.value === 'active')} className="input-field">
                    <option value="active">{t('admin_active')}</option>
                    <option value="inactive">{t('admin_inactive')}</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-olive-500 uppercase tracking-wider">Image URL</label>
                  <input value={getEdit(course.id, 'image_url', course.image_url) as string}
                    onChange={(e) => updateEdit(course.id, 'image_url', e.target.value)} className="input-field" dir="ltr" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-olive-500 uppercase tracking-wider">Sort Order</label>
                  <input type="number" value={getEdit(course.id, 'sort_order', course.sort_order) as number}
                    onChange={(e) => updateEdit(course.id, 'sort_order', Number(e.target.value))} className="input-field" dir="ltr" />
                </div>
              </div>

              <div className="mt-5 flex justify-end">
                <button onClick={() => handleSave(course)} disabled={!edits[course.id] || updateMutation.isPending}
                  className="btn-primary !gap-1.5 disabled:opacity-50">
                  {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  <span>{t('admin_save')}</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) { deleteMutation.mutate(deleteId); setDeleteId(null) } }}
        title="Delete Course"
        message="This course will be permanently deleted. This cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        loading={deleteMutation.isPending}
      />
    </div>
  )
}
