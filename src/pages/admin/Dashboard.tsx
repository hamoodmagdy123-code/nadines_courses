import { useLang } from '@/i18n/context'
import { useQuery } from '@tanstack/react-query'
import { fetchAdminStats } from '@/lib/functions'
import {
  ShoppingCart,
  DollarSign,
  Users,
  TrendingUp,
  CheckCircle,
  Clock,
  Loader2,
} from 'lucide-react'

export default function Dashboard() {
  const { t } = useLang()
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: fetchAdminStats,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-olive-500" />
      </div>
    )
  }

  const totalOrders = stats?.total_orders || 0
  const egyptPct = totalOrders > 0 ? 70 : 0
  const intlPct = totalOrders > 0 ? 30 : 0

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-olive-800">{t('admin_welcome')}</h1>
        <p className="mt-1 text-olive-500">{t('admin_overview')}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            icon: DollarSign,
            label: t('admin_total_sales'),
            value: `${(stats?.total_revenue_egp || 0).toLocaleString()} EGP`,
            color: 'bg-success/10 text-success',
          },
          {
            icon: ShoppingCart,
            label: t('admin_orders_count'),
            value: totalOrders,
            color: 'bg-olive-100 text-olive-600',
          },
          {
            icon: Clock,
            label: t('admin_pending'),
            value: stats?.pending_orders || 0,
            color: 'bg-warning/10 text-warning',
          },
          {
            icon: CheckCircle,
            label: t('admin_delivered'),
            value: stats?.paid_orders || 0,
            color: 'bg-success/10 text-success',
          },
        ].map(({ icon: Icon, label, value, color }, i) => (
          <div key={i} className="card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-olive-500">{label}</p>
                <p className="mt-1 text-2xl font-bold text-olive-800">{value}</p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <div className="mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-olive-600" />
            <h3 className="font-semibold text-olive-800">{t('admin_order_distribution')}</h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-olive-600">{t('admin_egypt')}</span>
                <span className="font-medium text-olive-800">—</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-olive-100">
                <div className="h-full rounded-full bg-olive-500" style={{ width: `${egyptPct}%` }} />
              </div>
            </div>
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-olive-600">{t('admin_international')}</span>
                <span className="font-medium text-olive-800">—</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-olive-100">
                <div className="h-full rounded-full bg-sticky-yellow" style={{ width: `${intlPct}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-olive-600" />
            <h3 className="font-semibold text-olive-800">{t('admin_courses_sales')}</h3>
          </div>
          <div className="space-y-4">
            {Object.entries(stats?.course_stats || {}).map(([name, count]) => (
              <div key={name}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-olive-600">{name}</span>
                  <span className="font-medium text-olive-800">{count as number}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-olive-100">
                  <div
                    className="h-full rounded-full bg-olive-400"
                    style={{ width: `${totalOrders > 0 ? ((count as number) / totalOrders) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
            {Object.keys(stats?.course_stats || {}).length === 0 && (
              <p className="text-sm text-olive-400">No sales yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
