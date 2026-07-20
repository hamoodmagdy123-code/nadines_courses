import { AlertTriangle, Trash2, Info, X } from '@/components/icons'
import { useEffect } from 'react'

interface ConfirmModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning' | 'info'
  loading?: boolean
}

const VARIANTS = {
  danger: {
    icon: Trash2,
    iconBg: 'bg-danger/10',
    iconColor: 'text-danger',
    btnBg: 'bg-danger hover:bg-danger/90',
  },
  warning: {
    icon: AlertTriangle,
    iconBg: 'bg-warning/10',
    iconColor: 'text-warning',
    btnBg: 'bg-warning hover:bg-warning/90',
  },
  info: {
    icon: Info,
    iconBg: 'bg-olive-100',
    iconColor: 'text-olive-600',
    btnBg: 'bg-olive-700 hover:bg-olive-800',
  },
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
}: ConfirmModalProps) {
  const v = VARIANTS[variant]
  const Icon = v.icon

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-olive-900/40 backdrop-blur-md" onClick={onClose} style={{ backdropFilter: 'blur(12px) saturate(120%)' }} />
      <div className="relative w-full max-w-sm animate-fade-in-scale rounded-2xl bg-white p-7"
        style={{ boxShadow: '0 25px 60px -15px rgba(42,44,20,0.3), 0 0 0 1px rgba(228,230,203,0.3)' }}>
        <button
          onClick={onClose}
          className="absolute left-3 top-3 rounded-xl p-1.5 text-olive-400 transition-all duration-200 hover:bg-olive-100 hover:text-olive-600 hover:scale-110"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${v.iconBg} transition-transform duration-300`}>
            <Icon className={`h-7 w-7 ${v.iconColor}`} />
          </div>
          <h3 className="text-lg font-bold text-olive-900">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-olive-500">{message}</p>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-xl border border-olive-200 bg-white px-4 py-2.5 text-sm font-medium text-olive-700 transition-all duration-200 hover:bg-olive-50 hover:border-olive-300 disabled:opacity-50 active:scale-[0.98]"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 active:scale-[0.97] disabled:opacity-50 hover:shadow-lg ${v.btnBg}`}
          >
            {loading ? '...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
