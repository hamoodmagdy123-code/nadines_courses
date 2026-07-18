import { MOCK_COURSES } from '@/lib/data'
import { useLang } from '@/i18n/context'
import {
  ShoppingCart,
  DollarSign,
  Users,
  TrendingUp,
  CheckCircle,
  Clock,
} from 'lucide-react'

const MOCK_STATS = {
  totalRevenue: 12500,
  totalOrders: 45,
  pendingOrders: 3,
  completedDeliveries: 42,
  egyptOrders: 30,
  internationalOrders: 15,
}

export default function Dashboard() {
  const { t } = useLang()

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
            value: `${MOCK_STATS.totalRevenue.toLocaleString()} EGP`,
            color: 'bg-success/10 text-success',
          },
          {
            icon: ShoppingCart,
            label: t('admin_orders_count'),
            value: MOCK_STATS.totalOrders,
            color: 'bg-olive-100 text-olive-600',
          },
          {
            icon: Clock,
            label: t('admin_pending'),
            value: MOCK_STATS.pendingOrders,
            color: 'bg-warning/10 text-warning',
          },
          {
            icon: CheckCircle,
            label: t('admin_delivered'),
            value: MOCK_STATS.completedDeliveries,
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
                <span className="font-medium text-olive-800">{MOCK_STATS.egyptOrders}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-olive-100">
                <div
                  className="h-full rounded-full bg-olive-500"
                  style={{
                    width: `${(MOCK_STATS.egyptOrders / MOCK_STATS.totalOrders) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-olive-600">{t('admin_international')}</span>
                <span className="font-medium text-olive-800">
                  {MOCK_STATS.internationalOrders}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-olive-100">
                <div
                  className="h-full rounded-full bg-sticky-yellow"
                  style={{
                    width: `${(MOCK_STATS.internationalOrders / MOCK_STATS.totalOrders) * 100}%`,
                  }}
                />
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
            {MOCK_COURSES.map((course) => {
              const orders = course.slug === 'digital-product' ? 28 : 17
              return (
                <div key={course.id}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-olive-600">{course.title}</span>
                    <span className="font-medium text-olive-800">{orders}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-olive-100">
                    <div
                      className="h-full rounded-full bg-olive-400"
                      style={{ width: `${(orders / MOCK_STATS.totalOrders) * 100}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
