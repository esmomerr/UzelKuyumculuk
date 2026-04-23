import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Hero from './components/Hero'
import TickerBar from './components/TickerBar'
import MarketCards from './components/MarketCards'
import Footer from './components/Footer'
import AdminPanel from './components/admin/AdminPanel'
import AdminLogin from './components/admin/AdminLogin'
import useMarketData from './hooks/useMarketData'
import { getMarketSettings } from './lib/marketSettings'
import { supabase } from './lib/supabase'
import { getCurrentUser } from './lib/auth'

const defaultAdminSettings = {
  gramAltin: { buyOffset: 0, sellOffset: 0 },
  ayar22: { buyOffset: 100, sellOffset: 100 },
  yeniCeyrek: { buyOffset: 100, sellOffset: 150 },
  eskiCeyrek: { buyOffset: 120, sellOffset: 170 },
  yeniYarim: { buyOffset: 150, sellOffset: 150 },
  eskiYarim: { buyOffset: 180, sellOffset: 180 },
  yeniTam: { buyOffset: 250, sellOffset: 300 },
  eskiTam: { buyOffset: 300, sellOffset: 350 },
  ataAltin: { buyOffset: 300, sellOffset: 350 },
  hurda8: { buyOffset: 0, sellOffset: 0 },
  hurda14: { buyOffset: 0, sellOffset: 0 },
  hurda18: { buyOffset: 0, sellOffset: 0 },
  hurda22: { buyOffset: 0, sellOffset: 0 },
}

function HomePage({ marketState, theme, toggleTheme }) {
  return (
    <>
      <Header theme={theme} toggleTheme={toggleTheme} />
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
  theme,
  toggleTheme,
}) {
  if (!isAdminAuthenticated) {
    return (
      <AdminLogin setIsAdminAuthenticated={setIsAdminAuthenticated} />
    )
  }

  return (
    <>
      <Header theme={theme} toggleTheme={toggleTheme} />
      <AdminPanel
        adminSettings={adminSettings}
        setAdminSettings={setAdminSettings}
        setIsAdminAuthenticated={setIsAdminAuthenticated}
      />
      <Footer />
    </>
  )
}

function App() {
  const [theme, setTheme] = useState('dark')
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
  const [adminSettings, setAdminSettings] = useState(defaultAdminSettings)
  const [settingsLoading, setSettingsLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(true)

  const marketState = useMarketData(adminSettings)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')

    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.setAttribute('data-theme', savedTheme)
    } else {
      document.documentElement.setAttribute('data-theme', 'dark')
    }
  }, [])

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await getCurrentUser()
        setIsAdminAuthenticated(!!user)
      } catch (error) {
        console.error('Kullanıcı kontrol hatası:', error)
        setIsAdminAuthenticated(false)
      } finally {
        setAuthLoading(false)
      }
    }

    checkUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdminAuthenticated(!!session)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await getMarketSettings()

        const formattedSettings = settings.reduce((acc, item) => {
          acc[item.product_key] = {
            buyOffset: item.buy_offset,
            sellOffset: item.sell_offset,
          }
          return acc
        }, {})

        setAdminSettings((prev) => ({
          ...prev,
          ...formattedSettings,
        }))
      } catch (error) {
        console.error('Supabase ayarları alınamadı:', error)
      } finally {
        setSettingsLoading(false)
      }
    }

    fetchSettings()
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

          setAdminSettings((prev) => ({
            ...prev,
            [row.product_key]: {
              buyOffset: row.buy_offset,
              sellOffset: row.sell_offset,
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
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  if (settingsLoading || authLoading) {
    return <div style={{ padding: '40px' }}>Yükleniyor...</div>
  }

  return (
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
        path="/admin"
        element={
          <AdminPage
            isAdminAuthenticated={isAdminAuthenticated}
            setIsAdminAuthenticated={setIsAdminAuthenticated}
            adminSettings={adminSettings}
            setAdminSettings={setAdminSettings}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        }
      />
    </Routes>
  )
}

export default App