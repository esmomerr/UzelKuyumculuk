import { useEffect, useMemo, useState } from 'react'
import { getGoldPrice } from '../services/goldApi'
import { getUsdToTry } from '../services/usdApi'

function useMarketData(adminSettings) {
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

  const createHurdaPair = (basePrice, milyem, buyOffset = 0) => {
    if (!basePrice) {
      return {
        buy: 'Yükleniyor...',
        sell: '-',
      }
    }

    const rawBuy = basePrice * milyem
    const finalBuy = rawBuy - buyOffset

    return {
      buy: roundBuyToTen(finalBuy),
      sell: '-',
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
        buy: 0.9935112088190092 * safetyBuffer,
        sell: 1.0057828561271857 * safetyBuffer,
      },
      ayar22: {
        buy: 0.9092588818799928 * safetyBuffer,
        sell: 0.9500408842432925 * safetyBuffer,
      },
      yeniCeyrek: {
        buy: 1.6293094709220012 * safetyBuffer,
        sell: 1.6454422660467652 * safetyBuffer,
      },
      eskiCeyrek: {
        buy: 1.6253094709220012 * safetyBuffer,
        sell: 1.635422660467652 * safetyBuffer,
      },
      yeniYarim: {
        buy: 3.2566666663934835 * safetyBuffer,
        sell: 3.288836834589182 * safetyBuffer,
      },
      eskiYarim: {
        buy: 3.22766663934835 * safetyBuffer,
        sell: 3.260836834589182 * safetyBuffer,
      },
      yeniTam: {
        buy: 6.4902830549009855 * safetyBuffer,
        sell: 6.5556259716740165 * safetyBuffer,
      },
      eskiTam: {
        buy: 6.4232830549009855 * safetyBuffer,
        sell: 6.4726259716740165 * safetyBuffer,
      },
      ataAltin: {
        buy: 6.689449460704767 * safetyBuffer,
        sell: 6.665226707599663 * safetyBuffer,
      },
    }

    const gram24Base = hasAltinGramTl

    return [
      {
        name: '24 Ayar Gram',
        ...createDisplayPair(
          gram24Base,
          PRODUCT_COEFFICIENTS.gram.buy,
          PRODUCT_COEFFICIENTS.gram.sell,
          Number(adminSettings?.gramAltin?.buyOffset) || 0,
          Number(adminSettings?.gramAltin?.sellOffset) || 0
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
          Number(adminSettings?.ayar22?.buyOffset) || 0,
          Number(adminSettings?.ayar22?.sellOffset) || 0
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
          Number(adminSettings?.yeniCeyrek?.buyOffset) || 0,
          Number(adminSettings?.yeniCeyrek?.sellOffset) || 0
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
          Number(adminSettings?.eskiCeyrek?.buyOffset) || 0,
          Number(adminSettings?.eskiCeyrek?.sellOffset) || 0
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
          Number(adminSettings?.yeniYarim?.buyOffset) || 0,
          Number(adminSettings?.yeniYarim?.sellOffset) || 0
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
          Number(adminSettings?.eskiYarim?.buyOffset) || 0,
          Number(adminSettings?.eskiYarim?.sellOffset) || 0
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
          Number(adminSettings?.yeniTam?.buyOffset) || 0,
          Number(adminSettings?.yeniTam?.sellOffset) || 0
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
          Number(adminSettings?.eskiTam?.buyOffset) || 0,
          Number(adminSettings?.eskiTam?.sellOffset) || 0
        ),
        change: formatChange(dailyChangePercent),
        changeValue: dailyChangePercent,
      },
      {
        name: 'Ata Altın',
        ...createDisplayPair(
          hasAltinGramTl,
          PRODUCT_COEFFICIENTS.ataAltin.buy,
          PRODUCT_COEFFICIENTS.ataAltin.sell,
          Number(adminSettings?.ataAltin?.buyOffset) || 0,
          Number(adminSettings?.ataAltin?.sellOffset) || 0
        ),
        change: formatChange(dailyChangePercent),
        changeValue: dailyChangePercent,
      },
      {
        name: '8 Ayar Hurda',
        ...createHurdaPair(
          gram24Base,
          0.25,
          Number(adminSettings?.hurda8?.buyOffset) || 0
        ),
        change: formatChange(dailyChangePercent),
        changeValue: dailyChangePercent,
      },
      {
        name: '14 Ayar Hurda',
        ...createHurdaPair(
          gram24Base,
          0.475,
          Number(adminSettings?.hurda14?.buyOffset) || 0
        ),
        change: formatChange(dailyChangePercent),
        changeValue: dailyChangePercent,
      },
      {
        name: '18 Ayar Hurda',
        ...createHurdaPair(
          gram24Base,
          0.675,
          Number(adminSettings?.hurda18?.buyOffset) || 0
        ),
        change: formatChange(dailyChangePercent),
        changeValue: dailyChangePercent,
      },
      {
        name: '22 Ayar Hurda',
        ...createHurdaPair(
          gram24Base,
          0.875,
          Number(adminSettings?.hurda22?.buyOffset) || 0
        ),
        change: formatChange(dailyChangePercent),
        changeValue: dailyChangePercent,
      },
    ]
  }, [goldData, usdTryData, dailyBasePrice, refreshKey, adminSettings])

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