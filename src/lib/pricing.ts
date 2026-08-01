import type { Course } from './data'
import { convertFromUSD } from '@/hooks/useExchangeRates'
import { getCurrencyForCountry } from './currencyMap'

export interface PriceDisplay {
  amount: number
  currency: string
  isEgypt: boolean
}

export function getDisplayPrice(course: Course, countryCode: string, rates?: Record<string, number> | undefined): PriceDisplay {
  if (countryCode === 'EG') {
    return { amount: course.egypt_price, currency: 'EGP', isEgypt: true }
  }

  const targetCurrency = getCurrencyForCountry(countryCode)
  const converted = convertFromUSD(course.international_price_usd, targetCurrency, rates)
  return { amount: converted, currency: targetCurrency, isEgypt: false }
}

export function getOriginalDisplayPrice(
  course: Course,
  countryCode: string,
  rates?: Record<string, number> | undefined,
): PriceDisplay | null {
  if (countryCode === 'EG') {
    if (!course.original_egypt_price || course.original_egypt_price <= course.egypt_price) return null
    return { amount: course.original_egypt_price, currency: 'EGP', isEgypt: true }
  }

  if (!course.original_international_price_usd || course.original_international_price_usd <= course.international_price_usd) return null
  const targetCurrency = getCurrencyForCountry(countryCode)
  const converted = convertFromUSD(course.original_international_price_usd, targetCurrency, rates)
  return { amount: converted, currency: targetCurrency, isEgypt: false }
}

export function getDiscountPercent(currentAmount: number, originalAmount: number): number {
  return Math.round((1 - currentAmount / originalAmount) * 100)
}

const MAX_FRACTION: Record<string, number> = {
  BHD: 3, KWD: 3, OMR: 3, JOD: 3, LYD: 3, TND: 3, IQD: 0, LBP: 0,
}

const fmtCache = new Map<string, Intl.NumberFormat>()

export function formatPrice(amount: number, currency: string): string {
  let fmt = fmtCache.get(currency)
  if (!fmt) {
    const fractionDigits = MAX_FRACTION[currency] ?? 0
    // Use locale based on currency: Arabic for MENA currencies, English for rest
    const locale = ['EGP', 'SAR', 'AED', 'KWD', 'QAR', 'BHD', 'OMR', 'JOD',
      'LBP', 'IQD', 'LYD', 'MAD', 'TND', 'DZD', 'EG', 'SA', 'AE', 'KW',
      'QA', 'BH', 'OM', 'JO', 'LB', 'IQ', 'LY', 'MA', 'TN', 'DZ'
    ].includes(currency) ? 'ar-EG' : 'en-US'
    fmt = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: fractionDigits,
    })
    fmtCache.set(currency, fmt)
  }
  return fmt.format(amount)
}
