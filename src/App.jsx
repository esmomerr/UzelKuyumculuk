import { useEffect, useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import TickerBar from './components/TickerBar'
import MarketCards from './components/MarketCards'
import Footer from './components/Footer'
import useMarketData from './hooks/useMarketData'

function App() {
  const marketState = useMarketData()
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')

    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.setAttribute('data-theme', savedTheme)
    } else {
      document.documentElement.setAttribute('data-theme', 'dark')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

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

export default App