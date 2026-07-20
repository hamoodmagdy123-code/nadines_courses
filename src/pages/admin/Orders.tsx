import { useState } from 'react'
import { useLang } from '@/i18n/context'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchAdminOrders, markTelegramAdded, adminUpdateOrder } from '@/lib/functions'
import { ConfirmModal } from '@/components/ConfirmModal'
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
  Archive,
  RotateCcw,
  Package,
} from 'lucide-react'

export default function AdminOrders() {
  const [filter, setFilter] = useState<string>('all')
  const [showArchived, setShowArchived] = useState(false)
  const [search, setSearch] = useState('')
  const { t } = useLang()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', filter, showArchived],
    queryFn: () =>
      fetchAdminOrders({
        ...(filter !== 'all' ? { status: filter } : {}),
        archived: showArchived,
      }),
  })

  const archiveMutation = useMutation({
    mutationFn: ({ orderId }: { orderId: string }) =>
      adminUpdateOrder(orderId, 'archive'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
    },
  })

  const restoreMutation = useMutation({
    mutationFn: ({ orderId }: { orderId: string }) =>
      adminUpdateOrder(orderId, 'restore'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
    },
  })

  const permanentDeleteMutation = useMutation({
    mutationFn: ({ orderId }: { orderId: string }) =>
      adminUpdateOrder(orderId, 'permanent-delete'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
    },
  })

  const telegramMutation = useMutation({
    mutationFn: markTelegramAdded,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
    },
  })

  const orders = data?.orders || []

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null)
  const [confirmTitle, setConfirmTitle] = useState('')
  const [confirmMessage, setConfirmMessage] = useState('')
  const [confirmVariant, setConfirmVariant] = useState<'danger' | 'warning' | 'info'>('warning')

  const openConfirm = (title: string, message: string, variant: 'danger' | 'warning' | 'info', action: () => void) => {
    setConfirmTitle(title)
    setConfirmMessage(message)
    setConfirmVariant(variant)
    setConfirmAction(() => action)
    setConfirmOpen(true)
  }

  const STATUS_CONFIG = {
    paid: { icon: CheckCircle, label: t('admin_paid'), color: 'bg-success/10 text-success', dotColor: 'bg-success' },
    pending: { icon: Clock, label: t('admin_pending'), color: 'bg-warning/10 text-warning', dotColor: 'bg-warning' },
    failed: { icon: XCircle, label: t('admin_failed'), color: 'bg-danger/10 text-danger', dotColor: 'bg-danger' },
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

  const handleArchive = (orderId: string) => {
    openConfirm(
      t('admin_archive_order'),
      t('admin_confirm_archive'),
      'warning',
      () => archiveMutation.mutate({ orderId })
    )
  }

  const handleRestore = (orderId: string) => {
    openConfirm(
      t('admin_restore_order'),
      t('admin_confirm_restore'),
      'info',
      () => restoreMutation.mutate({ orderId })
    )
  }

  const handlePermanentDelete = (orderId: string) => {
    openConfirm(
      t('admin_permanent_delete'),
      t('admin_confirm_permanent_delete'),
      'danger',
      () => permanentDeleteMutation.mutate({ orderId })
    )
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
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-olive-800 tracking-tight">{t('admin_orders')}</h1>
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
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-4 w-4 text-olive-400" />
          {!showArchived &&
            FILTER_OPTIONS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  filter === f.value
                    ? 'bg-olive-100 text-olive-800 shadow-sm'
                    : 'bg-paper-dim/80 text-olive-600 hover:bg-olive-100'
                }`}
              >
                {f.label}
              </button>
            ))}
          <button
            onClick={() => {
              setShowArchived(!showArchived)
              setFilter('all')
            }}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
              showArchived
                ? 'bg-olive-700 text-white shadow-sm'
                : 'bg-paper-dim/80 text-olive-600 hover:bg-olive-100'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Archive className="h-3 w-3" />
              {t('admin_archived')}
            </span>
          </button>
        </div>
      </div>

      <div className="hidden overflow-x-auto lg:block">
        <div className="admin-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-olive-100/60 text-left text-xs font-semibold uppercase tracking-wider text-olive-500">
                <th className="px-5 py-3.5">{t('admin_customer')}</th>
                <th className="px-5 py-3.5">{t('admin_phone')}</th>
                <th className="px-5 py-3.5">{t('admin_course')}</th>
                <th className="px-5 py-3.5">{t('admin_amount')}</th>
                <th className="px-5 py-3.5">{t('admin_status')}</th>
                <th className="px-5 py-3.5">{t('admin_date')}</th>
                <th className="px-5 py-3.5">{t('admin_delivery')}</th>
                <th className="px-5 py-3.5">{t('admin_actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-olive-50/80">
              {filtered.map((order: Record<string, unknown>) => {
                const status = order.status as string
                const statusConfig = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending
                const StatusIcon = statusConfig.icon
                const course = order.courses as Record<string, string> | null
                return (
                  <tr key={order.id as string} className="transition-colors duration-200 hover:bg-olive-50/40">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-olive-800">{order.customer_name as string}</p>
                      <p className="text-xs text-olive-400">{order.customer_email as string}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="flex items-center gap-1.5 font-mono text-sm text-olive-700">
                        <Phone className="h-3 w-3 text-olive-400" />
                        {order.customer_phone as string}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-olive-600">{course?.title || '—'}</td>
                    <td className="px-5 py-3.5 font-bold text-olive-800">{order.amount as number} {order.currency as string}</td>
                    <td className="px-5 py-3.5">
                      <span className={`admin-badge ${statusConfig.color}`}>
                        <StatusIcon className="h-3 w-3" />
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-olive-500">{new Date(order.created_at as string).toLocaleDateString()}</td>
                    <td className="px-5 py-3.5">
                      {!showArchived && status === 'paid' ? (
                        <button
                          onClick={() => telegramMutation.mutate(order.id as string)}
                          disabled={telegramMutation.isPending}
                          className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all duration-200 disabled:opacity-50 ${
                            order.telegram_added
                              ? 'bg-success/10 text-success hover:bg-success/20'
                              : 'bg-olive-50 text-olive-700 hover:bg-olive-100 hover:shadow-sm'
                          }`}
                        >
                          {telegramMutation.isPending ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : order.telegram_added ? (
                            <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3" /> {t('admin_delivered_done')}</span>
                          ) : (
                            t('admin_mark_telegram')
                          )}
                        </button>
                      ) : (
                        <span className="text-xs text-olive-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        {showArchived ? (
                          <>
                            <button
                              onClick={() => handleRestore(order.id as string)}
                              disabled={restoreMutation.isPending}
                              title={t('admin_restore_order')}
                              className="rounded-xl p-1.5 text-olive-400 transition-all duration-200 hover:bg-success/10 hover:text-success disabled:opacity-50 hover:scale-110"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handlePermanentDelete(order.id as string)}
                              disabled={permanentDeleteMutation.isPending}
                              title={t('admin_permanent_delete')}
                              className="rounded-xl p-1.5 text-olive-400 transition-all duration-200 hover:bg-danger/10 hover:text-danger disabled:opacity-50 hover:scale-110"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleArchive(order.id as string)}
                            disabled={archiveMutation.isPending}
                            title={t('admin_archive_order')}
                            className="rounded-xl p-1.5 text-olive-400 transition-all duration-200 hover:bg-warning/10 hover:text-warning disabled:opacity-50 hover:scale-110"
                          >
                            <Archive className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3 lg:hidden">
        {filtered.map((order: Record<string, unknown>) => {
          const status = order.status as string
          const statusConfig = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending
          const StatusIcon = statusConfig.icon
          const course = order.courses as Record<string, string> | null
          return (
            <div key={order.id as string} className="admin-card p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className={`admin-badge ${statusConfig.color}`}>
                  <StatusIcon className="h-3 w-3" />
                  {statusConfig.label}
                </span>
                <span className="text-xs text-olive-400">{new Date(order.created_at as string).toLocaleDateString()}</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-olive-700">
                  <User className="h-4 w-4 text-olive-400" />
                  <span className="font-semibold">{order.customer_name as string}</span>
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
              <div className="mt-3 flex items-center justify-between border-t border-olive-100/60 pt-3">
                <div>
                  <p className="text-xs text-olive-500">{course?.title || '—'}</p>
                  <p className="font-bold text-olive-800">{order.amount as number} {order.currency as string}</p>
                </div>
                <div className="flex items-center gap-1">
                  {!showArchived && status === 'paid' && (
                    <button
                      onClick={() => telegramMutation.mutate(order.id as string)}
                      disabled={telegramMutation.isPending}
                      className={`rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-200 disabled:opacity-50 ${
                        order.telegram_added
                          ? 'bg-success/10 text-success hover:bg-success/20'
                          : 'bg-olive-50 text-olive-700 hover:bg-olive-100'
                      }`}
                    >
                      {telegramMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : order.telegram_added ? t('admin_delivered_done') : t('admin_mark_telegram')}
                    </button>
                  )}
                  {showArchived ? (
                    <>
                      <button onClick={() => handleRestore(order.id as string)} disabled={restoreMutation.isPending} title={t('admin_restore_order')} className="rounded-xl p-2 text-olive-400 transition-all duration-200 hover:bg-success/10 hover:text-success disabled:opacity-50">
                        <RotateCcw className="h-4 w-4" />
                      </button>
                      <button onClick={() => handlePermanentDelete(order.id as string)} disabled={permanentDeleteMutation.isPending} title={t('admin_permanent_delete')} className="rounded-xl p-2 text-olive-400 transition-all duration-200 hover:bg-danger/10 hover:text-danger disabled:opacity-50">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <button onClick={() => handleArchive(order.id as string)} disabled={archiveMutation.isPending} title={t('admin_archive_order')} className="rounded-xl p-2 text-olive-400 transition-all duration-200 hover:bg-warning/10 hover:text-warning disabled:opacity-50">
                      <Archive className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-olive-100/60">
            <Package className="h-8 w-8 text-olive-400" />
          </div>
          <p className="text-olive-500 font-medium">{showArchived ? t('admin_no_orders') : t('admin_no_orders')}</p>
        </div>
      )}

      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => { confirmAction?.(); setConfirmOpen(false) }}
        title={confirmTitle}
        message={confirmMessage}
        variant={confirmVariant}
        confirmLabel={confirmVariant === 'danger' ? 'Delete' : 'Confirm'}
        loading={archiveMutation.isPending || restoreMutation.isPending || permanentDeleteMutation.isPending}
      />
    </div>
  )
}
