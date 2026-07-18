import { MOCK_COURSES } from '@/lib/data'
import { useState } from 'react'
import { useLang } from '@/i18n/context'
import {
  Search,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  Phone,
  User,
  Mail,
} from 'lucide-react'

interface MockOrder {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  course_slug: string
  amount: number
  currency: string
  status: 'pending' | 'paid' | 'failed'
  telegram_added: boolean
  created_at: string
}

const MOCK_ORDERS: MockOrder[] = [
  { id: '1', customer_name: 'Ahmed Mohamed', customer_email: 'ahmed@example.com', customer_phone: '01012345678', course_slug: 'digital-product', amount: 400, currency: 'EGP', status: 'paid', telegram_added: false, created_at: '2026-07-18' },
  { id: '2', customer_name: 'Sarah Johnson', customer_email: 'sarah@example.com', customer_phone: '+1234567890', course_slug: 'drop-service', amount: 100, currency: 'USD', status: 'paid', telegram_added: true, created_at: '2026-07-17' },
  { id: '3', customer_name: 'Fatma Ali', customer_email: 'fatma@example.com', customer_phone: '01234567890', course_slug: 'digital-product', amount: 400, currency: 'EGP', status: 'pending', telegram_added: false, created_at: '2026-07-18' },
  { id: '4', customer_name: 'Khalid Al-Omari', customer_email: 'khalid@example.com', customer_phone: '+966501234567', course_slug: 'drop-service', amount: 100, currency: 'USD', status: 'paid', telegram_added: false, created_at: '2026-07-16' },
]

export default function AdminOrders() {
  const [orders, setOrders] = useState(MOCK_ORDERS)
  const [filter, setFilter] = useState<string>('all')
  const [search, setSearch] = useState('')
  const { t } = useLang()

  const STATUS_CONFIG = {
    paid: { icon: CheckCircle, label: t('admin_paid'), color: 'bg-success/10 text-success' },
    pending: { icon: Clock, label: t('admin_pending'), color: 'bg-warning/10 text-warning' },
    failed: { icon: XCircle, label: t('admin_failed'), color: 'bg-danger/10 text-danger' },
  }

  const FILTER_OPTIONS = [
    { value: 'all', label: t('admin_all') },
    { value: 'paid', label: t('admin_paid') },
    { value: 'pending', label: t('admin_pending') },
    { value: 'failed', label: t('admin_failed') },
  ]

  const filtered = orders.filter((o) => {
    if (filter !== 'all' && o.status !== filter) return false
    if (search) {
      const q = search.toLowerCase()
      return o.customer_name.toLowerCase().includes(q) || o.customer_email.toLowerCase().includes(q) || o.customer_phone.includes(q)
    }
    return true
  })

  const markDelivered = (id: string) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, telegram_added: true } : o)))
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-olive-800">{t('admin_orders')}</h1>
        <p className="mt-1 text-olive-500">{t('admin_orders_sub')}</p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-olive-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('admin_search')}
            className="input-field !pr-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-olive-400" />
          {FILTER_OPTIONS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === f.value
                  ? 'bg-olive-100 text-olive-700'
                  : 'bg-paper-dim text-olive-600 hover:bg-olive-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-olive-100 text-left text-xs font-medium uppercase tracking-wider text-olive-500">
              <th className="px-4 py-3">{t('admin_customer')}</th>
              <th className="px-4 py-3">{t('admin_phone')}</th>
              <th className="px-4 py-3">{t('admin_course')}</th>
              <th className="px-4 py-3">{t('admin_amount')}</th>
              <th className="px-4 py-3">{t('admin_status')}</th>
              <th className="px-4 py-3">{t('admin_date')}</th>
              <th className="px-4 py-3">{t('admin_delivery')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-olive-50">
            {filtered.map((order) => {
              const course = MOCK_COURSES.find((c) => c.slug === order.course_slug)
              const statusConfig = STATUS_CONFIG[order.status]
              const StatusIcon = statusConfig.icon
              return (
                <tr key={order.id} className="transition-colors hover:bg-olive-50/50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-olive-800">{order.customer_name}</p>
                    <p className="text-xs text-olive-400">{order.customer_email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 font-mono text-sm text-olive-700">
                      <Phone className="h-3 w-3 text-olive-400" />
                      {order.customer_phone}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-olive-600">{course?.title}</td>
                  <td className="px-4 py-3 font-medium text-olive-800">{order.amount} {order.currency}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig.color}`}>
                      <StatusIcon className="h-3 w-3" />
                      {statusConfig.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-olive-500">{order.created_at}</td>
                  <td className="px-4 py-3">
                    {order.status === 'paid' && !order.telegram_added ? (
                      <button onClick={() => markDelivered(order.id)} className="rounded-lg bg-olive-50 px-3 py-1.5 text-xs font-medium text-olive-700 transition-colors hover:bg-olive-100">
                        {t('admin_mark_delivered')}
                      </button>
                    ) : order.telegram_added ? (
                      <span className="inline-flex items-center gap-1 text-xs text-success">
                        <CheckCircle className="h-3 w-3" />
                        {t('admin_delivered_done')}
                      </span>
                    ) : (
                      <span className="text-xs text-olive-400">—</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-4 lg:hidden">
        {filtered.map((order) => {
          const course = MOCK_COURSES.find((c) => c.slug === order.course_slug)
          const statusConfig = STATUS_CONFIG[order.status]
          const StatusIcon = statusConfig.icon
          return (
            <div key={order.id} className="card p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig.color}`}>
                  <StatusIcon className="h-3 w-3" />
                  {statusConfig.label}
                </span>
                <span className="text-xs text-olive-400">{order.created_at}</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-olive-700">
                  <User className="h-4 w-4 text-olive-400" />
                  <span className="font-medium">{order.customer_name}</span>
                </div>
                <div className="flex items-center gap-2 text-olive-600">
                  <Phone className="h-4 w-4 text-olive-400" />
                  <span className="font-mono">{order.customer_phone}</span>
                </div>
                <div className="flex items-center gap-2 text-olive-600">
                  <Mail className="h-4 w-4 text-olive-400" />
                  <span className="truncate">{order.customer_email}</span>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-olive-100 pt-3">
                <div>
                  <p className="text-xs text-olive-500">{course?.title}</p>
                  <p className="font-bold text-olive-800">{order.amount} {order.currency}</p>
                </div>
                {order.status === 'paid' && !order.telegram_added ? (
                  <button onClick={() => markDelivered(order.id)} className="rounded-lg bg-olive-50 px-3 py-2 text-xs font-medium text-olive-700 transition-colors hover:bg-olive-100">
                    {t('admin_mark_telegram')}
                  </button>
                ) : order.telegram_added ? (
                  <span className="inline-flex items-center gap-1 text-xs text-success">
                    <CheckCircle className="h-3 w-3" />
                    {t('admin_delivered_done')}
                  </span>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-4xl">📋</p>
          <p className="mt-3 text-olive-500">{t('admin_no_orders')}</p>
        </div>
      )}
    </div>
  )
}
