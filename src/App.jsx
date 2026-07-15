import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'

import Header from './components/Header'
import Hero from './components/Hero'
import TickerBar from './components/TickerBar'
import MarketCards from './components/MarketCards'
import Footer from './components/Footer'

import AdminPanel from './components/admin/AdminPanel'
import AdminLogin from './components/admin/AdminLogin'

import InstallGuide from './components/InstallGuide'
import SplashScreen from './components/SplashScreen'
import OfflineBanner from './components/OfflineBanner'

import CarsiPage from './pages/CarsiPage'

import useMarketData from './hooks/useMarketData'

import { getMarketSettings } from './lib/marketSettings'
import { getSecondMarketSettings } from './lib/secondMarketSettings'
import { getCurrentUser } from './lib/auth'
import { supabase } from './lib/supabase'

const defaultAdminSettings = {
  gramAltin: {
    buyOffset: 0,
    sellOffset: 0,
  },
  ayar22: {
    buyOffset: 100,
    sellOffset: 100,
  },
  yeniCeyrek: {
    buyOffset: 100,
    sellOffset: 150,
  },
  eskiCeyrek: {
    buyOffset: 120,
    sellOffset: 170,
  },
  yeniYarim: {
    buyOffset: 150,
    sellOffset: 150,
  },
  eskiYarim: {
    buyOffset: 180,
    sellOffset: 180,
  },
  yeniTam: {
    buyOffset: 250,
    sellOffset: 300,
  },
  eskiTam: {
    buyOffset: 300,
    sellOffset: 350,
  },
  ataAltin: {
    buyOffset: 300,
    sellOffset: 350,
  },
  hurda8: {
    buyOffset: 0,
    sellOffset: 0,
  },
  hurda14: {
    buyOffset: 0,
    sellOffset: 0,
  },
  hurda18: {
    buyOffset: 0,
    sellOffset: 0,
  },
  hurda22: {
    buyOffset: 0,
    sellOffset: 0,
  },
}

const defaultSecondAdminSettings = {
  gramAltin: {
    buyOffset: 100,
    sellOffset: 100,
  },
  ayar22: {
    buyOffset: 100,
    sellOffset: 100,
  },
  yeniCeyrek: {
    buyOffset: 100,
    sellOffset: 100,
  },
  eskiCeyrek: {
    buyOffset: 100,
    sellOffset: 100,
  },
  yeniYarim: {
    buyOffset: 100,
    sellOffset: 100,
  },
  eskiYarim: {
    buyOffset: 100,
    sellOffset: 100,
  },
  yeniTam: {
    buyOffset: 100,
    sellOffset: 100,
  },
  eskiTam: {
    buyOffset: 100,
    sellOffset: 100,
  },
  ataAltin: {
    buyOffset: 100,
    sellOffset: 100,
  },
  hurda8: {
    buyOffset: 100,
    sellOffset: 0,
  },
  hurda14: {
    buyOffset: 100,
    sellOffset: 0,
  },
  hurda18: {
    buyOffset: 100,
    sellOffset: 0,
  },
  hurda22: {
    buyOffset: 100,
    sellOffset: 0,
  },
}

function HomePage({ marketState, theme, toggleTheme }) {
  return (
    <>
      <InstallGuide />
      <OfflineBanner />

      <Header
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <Hero marketState={marketState} />

      <TickerBar marketState={marketState} />

      <MarketCards marketState={marketState} />

      <Footer />
    </>
  )
}

function AdminPage({
  isAdminAuthenticated,
  setIsAdminAuthenticated,

  adminSettings,
  setAdminSettings,

  secondAdminSettings,
  setSecondAdminSettings,

  theme,
  toggleTheme,
}) {
  if (!isAdminAuthenticated) {
    return (
      <AdminLogin
        setIsAdminAuthenticated={setIsAdminAuthenticated}
      />
    )
  }

  return (
    <>
      <OfflineBanner />

      <Header
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <AdminPanel
        adminSettings={adminSettings}
        setAdminSettings={setAdminSettings}
        secondAdminSettings={secondAdminSettings}
        setSecondAdminSettings={setSecondAdminSettings}
        setIsAdminAuthenticated={setIsAdminAuthenticated}
      />

      <Footer />
    </>
  )
}

function App() {
  const [theme, setTheme] = useState('dark')

  const [isAdminAuthenticated, setIsAdminAuthenticated] =
    useState(false)

  const [adminSettings, setAdminSettings] = useState(
    defaultAdminSettings
  )

  const [secondAdminSettings, setSecondAdminSettings] = useState(
    defaultSecondAdminSettings
  )

  const [settingsLoading, setSettingsLoading] = useState(true)

  const [secondSettingsLoading, setSecondSettingsLoading] =
    useState(true)

  const [authLoading, setAuthLoading] = useState(true)

  const marketState = useMarketData(adminSettings)

  const secondMarketState = useMarketData(secondAdminSettings)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')

    if (savedTheme) {
      setTheme(savedTheme)

      document.documentElement.setAttribute(
        'data-theme',
        savedTheme
      )
    } else {
      document.documentElement.setAttribute(
        'data-theme',
        'dark'
      )
    }
  }, [])

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await getCurrentUser()

        setIsAdminAuthenticated(Boolean(user))
      } catch {
        setIsAdminAuthenticated(false)
      } finally {
        setAuthLoading(false)
      }
    }

    checkUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdminAuthenticated(Boolean(session))
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await getMarketSettings()

        const formattedSettings = settings.reduce(
          (accumulator, item) => {
            accumulator[item.product_key] = {
              buyOffset: Number(item.buy_offset) || 0,
              sellOffset: Number(item.sell_offset) || 0,
            }

            return accumulator
          },
          {}
        )

        setAdminSettings((previousSettings) => ({
          ...previousSettings,
          ...formattedSettings,
        }))
      } catch (error) {
        console.error(
          'Ana mağaza Supabase ayarları alınamadı:',
          error
        )
      } finally {
        setSettingsLoading(false)
      }
    }

    fetchSettings()
  }, [])

  useEffect(() => {
    const fetchSecondSettings = async () => {
      try {
        const settings = await getSecondMarketSettings()

        const formattedSettings = settings.reduce(
          (accumulator, item) => {
            accumulator[item.product_key] = {
              buyOffset: Number(item.buy_offset) || 0,
              sellOffset: Number(item.sell_offset) || 0,
            }

            return accumulator
          },
          {}
        )

        setSecondAdminSettings((previousSettings) => ({
          ...previousSettings,
          ...formattedSettings,
        }))
      } catch (error) {
        console.error(
          'Çarşı mağazası Supabase ayarları alınamadı:',
          error
        )
      } finally {
        setSecondSettingsLoading(false)
      }
    }

    fetchSecondSettings()
  }, [])

  useEffect(() => {
    const channel = supabase
      .channel('market-settings-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'market_settings',
        },
        (payload) => {
          const row = payload.new || payload.old

          if (!row?.product_key) return

          setAdminSettings((previousSettings) => ({
            ...previousSettings,
            [row.product_key]: {
              buyOffset: Number(row.buy_offset) || 0,
              sellOffset: Number(row.sell_offset) || 0,
            },
          }))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  useEffect(() => {
    const channel = supabase
      .channel('second-market-settings-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'second_market_settings',
        },
        (payload) => {
          const row = payload.new || payload.old

          if (!row?.product_key) return

          setSecondAdminSettings((previousSettings) => ({
            ...previousSettings,
            [row.product_key]: {
              buyOffset: Number(row.buy_offset) || 0,
              sellOffset: Number(row.sell_offset) || 0,
            },
          }))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'

    setTheme(newTheme)

    localStorage.setItem('theme', newTheme)

    document.documentElement.setAttribute(
      'data-theme',
      newTheme
    )
  }

  if (
    settingsLoading ||
    secondSettingsLoading ||
    authLoading
  ) {
    return (
      <>
        <SplashScreen />

        <div className="app-loading-screen">
          <div className="app-loading-card">
            <div className="app-loading-spinner"></div>

            <h2>Yükleniyor...</h2>

            <p>Uzel Kuyumculuk</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <SplashScreen />

      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              marketState={marketState}
              theme={theme}
              toggleTheme={toggleTheme}
            />
          }
        />

        <Route
          path="/carsi"
          element={
            <CarsiPage
              marketState={secondMarketState}
              theme={theme}
              toggleTheme={toggleTheme}
            />
          }
        />

        <Route
          path="/admin"
          element={
            <AdminPage
              isAdminAuthenticated={isAdminAuthenticated}
              setIsAdminAuthenticated={setIsAdminAuthenticated}

              adminSettings={adminSettings}
              setAdminSettings={setAdminSettings}

              secondAdminSettings={secondAdminSettings}
              setSecondAdminSettings={setSecondAdminSettings}

              theme={theme}
              toggleTheme={toggleTheme}
            />
          }
        />
      </Routes>
    </>
  )
}

export default App