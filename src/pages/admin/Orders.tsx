import { useState } from 'react'
import { useLang } from '@/i18n/context'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchAdminOrders, markTelegramAdded, adminUpdateOrder } from '@/lib/functions'
import {
  Search,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  Phone,
  User,
  Mail,
  Loader2,
  Trash2,
} from 'lucide-react'

export default function AdminOrders() {
  const [filter, setFilter] = useState<string>('all')
  const [search, setSearch] = useState('')
  const { t } = useLang()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', filter],
    queryFn: () => fetchAdminOrders(filter !== 'all' ? { status: filter } : undefined),
  })

  const orderMutation = useMutation({
    mutationFn: ({ orderId, action }: { orderId: string; action: 'mark_paid' | 'mark_failed' | 'delete' }) =>
      adminUpdateOrder(orderId, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
    },
  })

  const telegramMutation = useMutation({
    mutationFn: markTelegramAdded,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
    },
  })

  const orders = data?.orders || []

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

  const filtered = orders.filter((o: Record<string, unknown>) => {
    if (search) {
      const q = search.toLowerCase()
      return (
        (o.customer_name as string)?.toLowerCase().includes(q) ||
        (o.customer_email as string)?.toLowerCase().includes(q) ||
        (o.customer_phone as string)?.includes(q)
      )
    }
    return true
  })

  const handleAction = (orderId: string, action: 'delete') => {
    if (action === 'delete' && !confirm(t('admin_confirm_delete'))) return
    orderMutation.mutate({ orderId, action })
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
              <th className="px-4 py-3">{t('admin_actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-olive-50">
            {filtered.map((order: Record<string, unknown>) => {
              const status = order.status as string
              const statusConfig = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending
              const StatusIcon = statusConfig.icon
              const course = order.courses as Record<string, string> | null
              return (
                <tr key={order.id as string} className="transition-colors hover:bg-olive-50/50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-olive-800">{order.customer_name as string}</p>
                    <p className="text-xs text-olive-400">{order.customer_email as string}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 font-mono text-sm text-olive-700">
                      <Phone className="h-3 w-3 text-olive-400" />
                      {order.customer_phone as string}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-olive-600">{course?.title || '—'}</td>
                  <td className="px-4 py-3 font-medium text-olive-800">{order.amount as number} {order.currency as string}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig.color}`}>
                      <StatusIcon className="h-3 w-3" />
                      {statusConfig.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-olive-500">{new Date(order.created_at as string).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    {status === 'paid' && !order.telegram_added ? (
                      <button
                        onClick={() => telegramMutation.mutate(order.id as string)}
                        disabled={telegramMutation.isPending}
                        className="rounded-lg bg-olive-50 px-3 py-1.5 text-xs font-medium text-olive-700 transition-colors hover:bg-olive-100 disabled:opacity-50"
                      >
                        {telegramMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : t('admin_mark_delivered')}
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
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleAction(order.id as string, 'delete')}
                      disabled={orderMutation.isPending}
                      title={t('admin_delete_order')}
                      className="rounded-lg p-1.5 text-olive-400 transition-colors hover:bg-danger/10 hover:text-danger disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-4 lg:hidden">
        {filtered.map((order: Record<string, unknown>) => {
          const status = order.status as string
          const statusConfig = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending
          const StatusIcon = statusConfig.icon
          const course = order.courses as Record<string, string> | null
          return (
            <div key={order.id as string} className="card p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig.color}`}>
                  <StatusIcon className="h-3 w-3" />
                  {statusConfig.label}
                </span>
                <span className="text-xs text-olive-400">{new Date(order.created_at as string).toLocaleDateString()}</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-olive-700">
                  <User className="h-4 w-4 text-olive-400" />
                  <span className="font-medium">{order.customer_name as string}</span>
                </div>
                <div className="flex items-center gap-2 text-olive-600">
                  <Phone className="h-4 w-4 text-olive-400" />
                  <span className="font-mono">{order.customer_phone as string}</span>
                </div>
                <div className="flex items-center gap-2 text-olive-600">
                  <Mail className="h-4 w-4 text-olive-400" />
                  <span className="truncate">{order.customer_email as string}</span>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-olive-100 pt-3">
                <div>
                  <p className="text-xs text-olive-500">{course?.title || '—'}</p>
                  <p className="font-bold text-olive-800">{order.amount as number} {order.currency as string}</p>
                </div>
                <div className="flex items-center gap-1">
                  {status === 'paid' && !order.telegram_added && (
                    <button
                      onClick={() => telegramMutation.mutate(order.id as string)}
                      disabled={telegramMutation.isPending}
                      className="rounded-lg bg-olive-50 px-3 py-2 text-xs font-medium text-olive-700 transition-colors hover:bg-olive-100 disabled:opacity-50"
                    >
                      {telegramMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : t('admin_mark_telegram')}
                    </button>
                  )}
                  {!!order.telegram_added && (
                    <span className="inline-flex items-center gap-1 text-xs text-success">
                      <CheckCircle className="h-3 w-3" />
                      {t('admin_delivered_done')}
                    </span>
                  )}
                  <button onClick={() => handleAction(order.id as string, 'delete')} disabled={orderMutation.isPending} title={t('admin_delete_order')} className="rounded-lg p-2 text-olive-400 hover:bg-danger/10 hover:text-danger disabled:opacity-50">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
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
