import { useEffect, useMemo, useState } from 'react'
import { getGoldPrice } from '../services/goldApi'
import { getUsdToTry } from '../services/usdApi'

function useMarketData() {
  const [goldData, setGoldData] = useState(null)
  const [usdTryData, setUsdTryData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dailyBasePrice, setDailyBasePrice] = useState(null)
  const [refreshKey, setRefreshKey] = useState(Date.now())

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setError(null)

        const [goldResponse, usdResponse] = await Promise.all([
          getGoldPrice(),
          getUsdToTry(),
        ])

        console.log('Güncel altın verisi:', goldResponse)
        console.log('USD/TRY verisi:', usdResponse)

        const ouncePrice = Number(goldResponse?.price) || 0
        const usdTry = Number(usdResponse?.rates?.TRY) || 0

        const todayKey = new Date().toISOString().split('T')[0]
        const savedDate = localStorage.getItem('goldBaseDate')
        const savedPrice = localStorage.getItem('goldBasePrice')

        let basePrice = savedPrice ? Number(savedPrice) : ouncePrice

        if (savedDate !== todayKey || !savedPrice) {
          localStorage.setItem('goldBaseDate', todayKey)
          localStorage.setItem('goldBasePrice', String(ouncePrice))
          basePrice = ouncePrice
        }

        setDailyBasePrice(basePrice)

        setGoldData({
          ...goldResponse,
          price: ouncePrice,
          clientFetchedAt: Date.now(),
        })

        setUsdTryData({
          ...usdResponse,
          rates: {
            ...usdResponse?.rates,
            TRY: usdTry,
          },
          clientFetchedAt: Date.now(),
        })

        setRefreshKey(Date.now())
      } catch (err) {
        console.error('Veriler alınamadı:', err)
        setError('Veriler alınamadı')
      } finally {
        setLoading(false)
      }
    }

    fetchMarketData()
    const interval = setInterval(fetchMarketData, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatNumber = (value) => {
    if (value === null || value === undefined || Number.isNaN(value)) {
      return 'Yükleniyor...'
    }

    return new Intl.NumberFormat('tr-TR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const roundBuyToTen = (value) => {
    if (value === null || value === undefined || Number.isNaN(value)) {
      return 'Yükleniyor...'
    }

    const roundedValue = Math.floor(value / 10) * 10
    return formatNumber(roundedValue)
  }

  const roundSellToTen = (value) => {
    if (value === null || value === undefined || Number.isNaN(value)) {
      return 'Yükleniyor...'
    }

    const roundedValue = Math.ceil(value / 10) * 10
    return formatNumber(roundedValue)
  }

  const formatChange = (value) => {
    if (value === null || value === undefined || Number.isNaN(value)) {
      return '-'
    }

    const sign = value > 0 ? '+' : ''
    return `${sign}${value.toFixed(2)}%`
  }

  const getChangeStyles = (value) => {
    if (value === null || value === undefined || Number.isNaN(value)) {
      return {
        color: '#facc15',
        background: 'rgba(250,204,21,0.15)',
      }
    }

    if (value > 0) {
      return {
        color: '#4ade80',
        background: 'rgba(34,197,94,0.15)',
      }
    }

    if (value < 0) {
      return {
        color: '#f87171',
        background: 'rgba(248,113,113,0.15)',
      }
    }

    return {
      color: '#cbd5e1',
      background: 'rgba(203,213,225,0.15)',
    }
  }

  const createDisplayPair = (
    basePrice,
    buyCoef,
    sellCoef,
    buyOffset = 0,
    sellOffset = 0
  ) => {
    if (!basePrice) {
      return {
        buy: 'Yükleniyor...',
        sell: 'Yükleniyor...',
      }
    }

    const rawBuy = basePrice * buyCoef
    const rawSell = basePrice * sellCoef

    const finalBuy = rawBuy - buyOffset
    const finalSell = rawSell + sellOffset

    return {
      buy: roundBuyToTen(finalBuy),
      sell: roundSellToTen(finalSell),
    }
  }

  const marketData = useMemo(() => {
    const ouncePrice = Number(goldData?.price) || 0
    const usdTry = Number(usdTryData?.rates?.TRY) || 0

    const dailyChangePercent =
      ouncePrice && dailyBasePrice
        ? ((ouncePrice - dailyBasePrice) / dailyBasePrice) * 100
        : null

    const hasAltinGramTl =
      ouncePrice && usdTry ? (ouncePrice / 31.1035) * usdTry : 0

    const safetyBuffer = 1.001

    const PRODUCT_COEFFICIENTS = {
      gram: {
        buy: 0.9909112088190092 * safetyBuffer,
        sell: 1.0047828561271857 * safetyBuffer,
      },
      ayar22: {
        buy: 0.9032588818799928 * safetyBuffer,
        sell: 0.9440408842432925 * safetyBuffer,
      },

      yeniCeyrek: {
        buy: 1.6283094709220012 * safetyBuffer,
        sell: 1.6654422660467652 * safetyBuffer,
      },
      eskiCeyrek: {
        buy: 1.6153094709220012 * safetyBuffer,
        sell: 1.6514422660467652 * safetyBuffer,
      },

      yeniYarim: {
        buy: 3.26666663934835 * safetyBuffer,
        sell: 3.320836834589182 * safetyBuffer,
      },
      eskiYarim: {
        buy: 3.23666663934835 * safetyBuffer,
        sell: 3.286836834589182 * safetyBuffer,
      },

      yeniTam: {
        buy: 6.5532830549009855 * safetyBuffer,
        sell: 6.6316259716740165 * safetyBuffer,
      },
      eskiTam: {
        buy: 6.4932830549009855 * safetyBuffer,
        sell: 6.5616259716740165 * safetyBuffer,
      },

      yeniAta: {
        buy: 6.652449460704767 * safetyBuffer,
        sell: 6.761226707599663 * safetyBuffer,
      },
      eskiAta: {
        buy: 6.582449460704767 * safetyBuffer,
        sell: 6.681226707599663 * safetyBuffer,
      },
    }

    return [
      {
        name: 'Has Altın',
        ...createDisplayPair(hasAltinGramTl, 0.998, 1.0025, 150, 100),
        change: formatChange(dailyChangePercent),
        changeValue: dailyChangePercent,
      },
      {
        name: 'Ons Altın',
        ...createDisplayPair(ouncePrice, 0.9985, 1.0015, 0, 0),
        change: formatChange(dailyChangePercent),
        changeValue: dailyChangePercent,
      },
      {
        name: 'Gram Altın',
        ...createDisplayPair(
          hasAltinGramTl,
          PRODUCT_COEFFICIENTS.gram.buy,
          PRODUCT_COEFFICIENTS.gram.sell,
          0,
          0
        ),
        change: formatChange(dailyChangePercent),
        changeValue: dailyChangePercent,
      },
      {
        name: '22 Ayar Gram',
        ...createDisplayPair(
          hasAltinGramTl,
          PRODUCT_COEFFICIENTS.ayar22.buy,
          PRODUCT_COEFFICIENTS.ayar22.sell,
          100,
          100
        ),
        change: formatChange(dailyChangePercent),
        changeValue: dailyChangePercent,
      },
      {
        name: 'Yeni Çeyrek',
        ...createDisplayPair(
          hasAltinGramTl,
          PRODUCT_COEFFICIENTS.yeniCeyrek.buy,
          PRODUCT_COEFFICIENTS.yeniCeyrek.sell,
          100,
          150
        ),
        change: formatChange(dailyChangePercent),
        changeValue: dailyChangePercent,
      },
      {
        name: 'Eski Çeyrek',
        ...createDisplayPair(
          hasAltinGramTl,
          PRODUCT_COEFFICIENTS.eskiCeyrek.buy,
          PRODUCT_COEFFICIENTS.eskiCeyrek.sell,
          120,
          170
        ),
        change: formatChange(dailyChangePercent),
        changeValue: dailyChangePercent,
      },
      {
        name: 'Yeni Yarım',
        ...createDisplayPair(
          hasAltinGramTl,
          PRODUCT_COEFFICIENTS.yeniYarim.buy,
          PRODUCT_COEFFICIENTS.yeniYarim.sell,
          150,
          150
        ),
        change: formatChange(dailyChangePercent),
        changeValue: dailyChangePercent,
      },
      {
        name: 'Eski Yarım',
        ...createDisplayPair(
          hasAltinGramTl,
          PRODUCT_COEFFICIENTS.eskiYarim.buy,
          PRODUCT_COEFFICIENTS.eskiYarim.sell,
          180,
          180
        ),
        change: formatChange(dailyChangePercent),
        changeValue: dailyChangePercent,
      },
      {
        name: 'Yeni Tam',
        ...createDisplayPair(
          hasAltinGramTl,
          PRODUCT_COEFFICIENTS.yeniTam.buy,
          PRODUCT_COEFFICIENTS.yeniTam.sell,
          250,
          300
        ),
        change: formatChange(dailyChangePercent),
        changeValue: dailyChangePercent,
      },
      {
        name: 'Eski Tam',
        ...createDisplayPair(
          hasAltinGramTl,
          PRODUCT_COEFFICIENTS.eskiTam.buy,
          PRODUCT_COEFFICIENTS.eskiTam.sell,
          300,
          350
        ),
        change: formatChange(dailyChangePercent),
        changeValue: dailyChangePercent,
      },
      {
        name: 'Yeni Ata',
        ...createDisplayPair(
          hasAltinGramTl,
          PRODUCT_COEFFICIENTS.yeniAta.buy,
          PRODUCT_COEFFICIENTS.yeniAta.sell,
          300,
          350
        ),
        change: formatChange(dailyChangePercent),
        changeValue: dailyChangePercent,
      },
      {
        name: 'Eski Ata',
        ...createDisplayPair(
          hasAltinGramTl,
          PRODUCT_COEFFICIENTS.eskiAta.buy,
          PRODUCT_COEFFICIENTS.eskiAta.sell,
          350,
          400
        ),
        change: formatChange(dailyChangePercent),
        changeValue: dailyChangePercent,
      },
    ]
  }, [goldData, usdTryData, dailyBasePrice, refreshKey])

  return {
    marketData,
    goldData,
    usdTryData,
    loading,
    error,
    dailyBasePrice,
    formatNumber,
    getChangeStyles,
    refreshKey,
  }
}

export default useMarketData