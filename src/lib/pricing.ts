import type { Course } from './data'
import { convertFromUSD } from '@/hooks/useExchangeRates'

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

function getCurrencyForCountry(countryCode: string): string {
  const map: Record<string, string> = {
    EG: 'EGP', SA: 'SAR', AE: 'AED', KW: 'KWD', QA: 'QAR', BH: 'BHD',
    OM: 'OMR', JO: 'JOD', LB: 'LBP', IQ: 'IQD', LY: 'LYD', MA: 'MAD',
    TN: 'TND', DZ: 'DZD', US: 'USD', GB: 'GBP', EU: 'EUR', TR: 'TRY',
  }
  return map[countryCode] || 'USD'
}

const formatters: Record<string, Intl.NumberFormat> = {
  EGP: new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP', maximumFractionDigits: 0 }),
  USD: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
  SAR: new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', maximumFractionDigits: 0 }),
  AED: new Intl.NumberFormat('ar-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 }),
  KWD: new Intl.NumberFormat('ar-KW', { style: 'currency', currency: 'KWD', maximumFractionDigits: 3 }),
  QAR: new Intl.NumberFormat('ar-QA', { style: 'currency', currency: 'QAR', maximumFractionDigits: 0 }),
  BHD: new Intl.NumberFormat('ar-BH', { style: 'currency', currency: 'BHD', maximumFractionDigits: 3 }),
  OMR: new Intl.NumberFormat('ar-OM', { style: 'currency', currency: 'OMR', maximumFractionDigits: 3 }),
  JOD: new Intl.NumberFormat('ar-JO', { style: 'currency', currency: 'JOD', maximumFractionDigits: 3 }),
  LBP: new Intl.NumberFormat('ar-LB', { style: 'currency', currency: 'LBP', maximumFractionDigits: 0 }),
  IQD: new Intl.NumberFormat('ar-IQ', { style: 'currency', currency: 'IQD', maximumFractionDigits: 0 }),
  LYD: new Intl.NumberFormat('ar-LY', { style: 'currency', currency: 'LYD', maximumFractionDigits: 3 }),
  MAD: new Intl.NumberFormat('ar-MA', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }),
  TND: new Intl.NumberFormat('ar-TN', { style: 'currency', currency: 'TND', maximumFractionDigits: 3 }),
  DZD: new Intl.NumberFormat('ar-DZ', { style: 'currency', currency: 'DZD', maximumFractionDigits: 0 }),
  GBP: new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }),
  EUR: new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }),
  TRY: new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }),
}

export function formatPrice(amount: number, currency: string): string {
  return (formatters[currency] || formatters.USD).format(amount)
}
