export interface GeoInfo {
  country_code: string
  country_name: string
}

let cachedGeo: GeoInfo | null = null

export async function getVisitorCountry(): Promise<GeoInfo> {
  if (cachedGeo) return cachedGeo

  try {
    const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) })
    if (!res.ok) throw new Error('Geo failed')
    const data = await res.json()
    cachedGeo = { country_code: data.country_code, country_name: data.country_name }
    return cachedGeo
  } catch {
    cachedGeo = { country_code: 'EG', country_name: 'Egypt' }
    return cachedGeo
  }
}

const CURRENCY_MAP: Record<string, string> = {
  EG: 'EGP',
  SA: 'SAR',
  AE: 'AED',
  KW: 'KWD',
  QA: 'QAR',
  BH: 'BHD',
  OM: 'OMR',
  JO: 'JOD',
  LB: 'LBP',
  IQ: 'IQD',
  LY: 'LYD',
  MA: 'MAD',
  TN: 'TND',
  DZ: 'DZD',
  US: 'USD',
  GB: 'GBP',
  EU: 'EUR',
  TR: 'TRY',
}

export function getCurrencyForCountry(countryCode: string): string {
  return CURRENCY_MAP[countryCode] || 'USD'
}
