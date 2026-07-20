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
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-olive-500" />
          <p className="text-sm text-olive-400">...</p>
        </div>
      </div>
    )
  }

  const totalOrders = stats?.total_orders || 0
  const egyptPct = totalOrders > 0 ? 70 : 0
  const intlPct = totalOrders > 0 ? 30 : 0

  const statCards = [
    {
      icon: DollarSign,
      label: t('admin_total_sales'),
      value: `${(stats?.total_revenue_egp || 0).toLocaleString()} EGP`,
      color: 'from-success/15 to-success/5',
      iconColor: 'text-success',
      iconBg: 'bg-success/10',
    },
    {
      icon: ShoppingCart,
      label: t('admin_orders_count'),
      value: totalOrders,
      color: 'from-olive-100/60 to-olive-50',
      iconColor: 'text-olive-600',
      iconBg: 'bg-olive-100',
    },
    {
      icon: Clock,
      label: t('admin_pending'),
      value: stats?.pending_orders || 0,
      color: 'from-warning/15 to-warning/5',
      iconColor: 'text-warning',
      iconBg: 'bg-warning/10',
    },
    {
      icon: CheckCircle,
      label: t('admin_delivered'),
      value: stats?.paid_orders || 0,
      color: 'from-success/15 to-success/5',
      iconColor: 'text-success',
      iconBg: 'bg-success/10',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-olive-800 tracking-tight">{t('admin_welcome')}</h1>
        <p className="mt-1 text-olive-500">{t('admin_overview')}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(({ icon: Icon, label, value, color, iconColor, iconBg }, i) => (
          <div key={i} className="admin-stat-card group">
            <div className={`absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br ${color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
            <div className="absolute -right-5 -top-5 h-20 w-20 rounded-full bg-gradient-to-br opacity-[0.06]" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-olive-500">{label}</p>
                <p className="mt-1.5 text-2xl font-extrabold text-olive-900 tracking-tight">{value}</p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconBg} transition-all duration-300 group-hover:scale-110`}>
                <Icon className={`h-6 w-6 ${iconColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="admin-card p-6">
          <div className="mb-5 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-olive-100">
              <Users className="h-4.5 w-4.5 text-olive-600" />
            </div>
            <h3 className="font-bold text-olive-800">{t('admin_order_distribution')}</h3>
          </div>
          <div className="space-y-5">
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-medium text-olive-600">{t('admin_egypt')}</span>
                <span className="font-bold text-olive-800">—</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-olive-100/80">
                <div className="h-full rounded-full bg-gradient-to-r from-olive-500 to-olive-600 transition-all duration-700" style={{ width: `${egyptPct}%` }} />
              </div>
            </div>
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-medium text-olive-600">{t('admin_international')}</span>
                <span className="font-bold text-olive-800">—</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-olive-100/80">
                <div className="h-full rounded-full bg-gradient-to-r from-sticky-yellow to-sticky-yellowDark transition-all duration-700" style={{ width: `${intlPct}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="admin-card p-6">
          <div className="mb-5 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-olive-100">
              <TrendingUp className="h-4.5 w-4.5 text-olive-600" />
            </div>
            <h3 className="font-bold text-olive-800">{t('admin_courses_sales')}</h3>
          </div>
          <div className="space-y-5">
            {Object.entries(stats?.course_stats || {}).map(([name, count]) => (
              <div key={name}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium text-olive-600">{name}</span>
                  <span className="font-bold text-olive-800">{count as number}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-olive-100/80">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-olive-400 to-olive-500 transition-all duration-700"
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
