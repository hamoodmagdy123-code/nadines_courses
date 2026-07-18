import { useState, useEffect } from 'react'
import { getVisitorCountry } from '@/lib/geo'

export function useGeo() {
  const [countryCode, setCountryCode] = useState<string>('EG')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getVisitorCountry()
      .then((geo) => setCountryCode(geo.country_code))
      .finally(() => setLoading(false))
  }, [])

  return { countryCode, loading }
}
