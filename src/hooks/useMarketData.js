import { useEffect, useState } from 'react'
import { getGoldPrice } from '../services/goldApi'
import { getUsdToTry } from '../services/usdApi'

function useMarketData() {
  const [goldData, setGoldData] = useState(null)
  const [usdTryData, setUsdTryData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dailyBasePrice, setDailyBasePrice] = useState(null)

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setError(null)

        const [goldResponse, usdResponse] = await Promise.all([
          getGoldPrice('XAU'),
          getUsdToTry(),
        ])

        console.log('Güncel altın verisi:', goldResponse)
        console.log('USD/TRY verisi:', usdResponse)

        const currentPrice = Number(goldResponse?.price)
        const todayKey = new Date().toISOString().split('T')[0]

        const savedDate = localStorage.getItem('goldBaseDate')
        const savedPrice = localStorage.getItem('goldBasePrice')

        if (savedDate !== todayKey || !savedPrice) {
          localStorage.setItem('goldBaseDate', todayKey)
          localStorage.setItem('goldBasePrice', String(currentPrice))
          setDailyBasePrice(currentPrice)
        } else {
          setDailyBasePrice(Number(savedPrice))
        }

        setGoldData(goldResponse)
        setUsdTryData(usdResponse)
      } catch (err) {
        console.error('Veriler alınamadı:', err)
        setError('Veriler alınamadı')
      } finally {
        setLoading(false)
      }
    }

    fetchMarketData()

    const interval = setInterval(() => {
      fetchMarketData()
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatPrice = (value) => {
    if (value === null || value === undefined || Number.isNaN(value)) {
      return 'Yükleniyor...'
    }

    return new Intl.NumberFormat('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
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
        background: 'rgba(0, 0, 0, 0.15)',
      }
    }

    if (value > 0) {
      return {
        color: '#07d051',
        background: 'rgba(34,197,94,0.15)',
      }
    }

    if (value < 0) {
      return {
        color: '#ff0000',
        background: 'rgba(248,113,113,0.15)',
      }
    }

    return {
      color: '#cbd5e1',
      background: 'rgba(203,213,225,0.15)',
    }
  }

  const createDisplayPair = (basePrice, buyCoef, sellCoef, buyOffset = 0, sellOffset = 0) => {
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
      buy: formatPrice(finalBuy),
      sell: formatPrice(finalSell),
    }
  }

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
    ceyrek: {
      buy: 1.6283094709220012 * safetyBuffer,
      sell: 1.6654422660467652 * safetyBuffer,
    },
    yarim: {
      buy: 3.26666663934835 * safetyBuffer,
      sell: 3.320836834589182 * safetyBuffer,
    },
    tam: {
      buy: 6.5532830549009855 * safetyBuffer,
      sell: 6.6316259716740165 * safetyBuffer,
    },
    ata: {
      buy: 6.652449460704767 * safetyBuffer,
      sell: 6.761226707599663 * safetyBuffer,
    },
  }

  const marketData = [
    {
      name: 'Ons Altın',
      ...createDisplayPair(ouncePrice, 0.9985, 1.0015, 0, 0),
      change: formatChange(dailyChangePercent),
      changeValue: dailyChangePercent,
    },
    {
      name: 'Has Altın',
      ...createDisplayPair(hasAltinGramTl, 0.998, 1.0025, 150, 100),
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
      name: '22 Ayar',
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
      name: 'Çeyrek Altın',
      ...createDisplayPair(
        hasAltinGramTl,
        PRODUCT_COEFFICIENTS.ceyrek.buy,
        PRODUCT_COEFFICIENTS.ceyrek.sell,
        150,
        150
      ),
      change: formatChange(dailyChangePercent),
      changeValue: dailyChangePercent,
    },
    {
      name: 'Yarım Altın',
      ...createDisplayPair(
        hasAltinGramTl,
        PRODUCT_COEFFICIENTS.yarim.buy,
        PRODUCT_COEFFICIENTS.yarim.sell,
        150,
        150
      ),
      change: formatChange(dailyChangePercent),
      changeValue: dailyChangePercent,
    },
    {
      name: 'Tam Altın',
      ...createDisplayPair(
        hasAltinGramTl,
        PRODUCT_COEFFICIENTS.tam.buy,
        PRODUCT_COEFFICIENTS.tam.sell,
        330,
        500
      ),
      change: formatChange(dailyChangePercent),
      changeValue: dailyChangePercent,
    },
    {
      name: 'Ata Altın',
      ...createDisplayPair(
        hasAltinGramTl,
        PRODUCT_COEFFICIENTS.ata.buy,
        PRODUCT_COEFFICIENTS.ata.sell,
        400,
        550
      ),
      change: formatChange(dailyChangePercent),
      changeValue: dailyChangePercent,
    },
  ]

  return {
    marketData,
    goldData,
    usdTryData,
    loading,
    error,
    dailyBasePrice,
    formatPrice,
    getChangeStyles,
  }
}

export default useMarketData