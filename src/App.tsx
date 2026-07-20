import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { lazy, Suspense } from 'react'
import { LangProvider } from '@/i18n/context'
import { Analytics } from '@vercel/analytics/react'

import { PublicLayout } from '@/pages/PublicLayout'
import { AdminLayout } from '@/pages/admin/AdminLayout'

const Home = lazy(() => import('@/pages/Home'))
const CourseDetails = lazy(() => import('@/pages/CourseDetails'))
const CheckoutSuccess = lazy(() => import('@/pages/CheckoutSuccess'))
const CheckoutFailed = lazy(() => import('@/pages/CheckoutFailed'))
const AdminLogin = lazy(() => import('@/pages/admin/Login'))
const Dashboard = lazy(() => import('@/pages/admin/Dashboard'))
const AdminCourses = lazy(() => import('@/pages/admin/Courses'))
const AdminOrders = lazy(() => import('@/pages/admin/Orders'))
const AdminContent = lazy(() => import('@/pages/admin/Content'))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function Loader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-olive-200 border-t-olive-600" />
        <p className="text-sm text-olive-400">...</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LangProvider>
        <BrowserRouter>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/course/:slug" element={<CourseDetails />} />
              </Route>
              <Route path="/checkout/success" element={<CheckoutSuccess />} />
              <Route path="/checkout/failed" element={<CheckoutFailed />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<Dashboard />} />
                <Route path="/admin/courses" element={<AdminCourses />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/content" element={<AdminContent />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </LangProvider>
      <Analytics />
    </QueryClientProvider>
  )
}
