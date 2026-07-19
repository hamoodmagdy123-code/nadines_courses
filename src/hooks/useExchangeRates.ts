import { useQuery } from '@tanstack/react-query'

const RATES_CACHE_KEY = 'exchange_rates_v1'
const RATES_CACHE_TTL = 60 * 60 * 1000 // 1 hour

interface RatesData {
  rates: Record<string, number>
  timestamp: number
}

async function fetchRates(): Promise<Record<string, number>> {
  // Check localStorage cache
  try {
    const cached = localStorage.getItem(RATES_CACHE_KEY)
    if (cached) {
      const parsed: RatesData = JSON.parse(cached)
      if (Date.now() - parsed.timestamp < RATES_CACHE_TTL) {
        return parsed.rates
      }
    }
  } catch {}

  const res = await fetch('https://open.er-api.com/v6/latest/USD', { signal: AbortSignal.timeout(5000) })
  if (!res.ok) throw new Error('Failed to fetch rates')
  const data = await res.json()

  const rates: Record<string, number> = data.rates

  // Cache in localStorage
  try {
    localStorage.setItem(RATES_CACHE_KEY, JSON.stringify({ rates, timestamp: Date.now() }))
  } catch {}

  return rates
}

export function useExchangeRates() {
  return useQuery({
    queryKey: ['exchange-rates'],
    queryFn: fetchRates,
    staleTime: RATES_CACHE_TTL,
    gcTime: RATES_CACHE_TTL,
    retry: 2,
  })
}

export function convertFromUSD(amountUSD: number, targetCurrency: string, rates: Record<string, number> | undefined): number {
  if (!rates) return amountUSD
  if (targetCurrency === 'USD') return amountUSD
  const rate = rates[targetCurrency]
  if (!rate) return amountUSD
  return Math.round(amountUSD * rate)
}
