import type { Course } from './data'

export interface PriceDisplay {
  amount: number
  currency: string
  isEgypt: boolean
}

export function getDisplayPrice(course: Course, countryCode: string): PriceDisplay {
  if (countryCode === 'EG') {
    return { amount: course.egypt_price, currency: 'EGP', isEgypt: true }
  }
  return { amount: course.international_price_usd, currency: 'USD', isEgypt: false }
}

export function formatPrice(amount: number, currency: string): string {
  const formatters: Record<string, Intl.NumberFormat> = {
    EGP: new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP', maximumFractionDigits: 0 }),
    USD: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
    SAR: new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', maximumFractionDigits: 0 }),
    AED: new Intl.NumberFormat('ar-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 }),
  }
  return (formatters[currency] || formatters.USD).format(amount)
}
