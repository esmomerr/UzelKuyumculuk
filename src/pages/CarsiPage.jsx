import CarsiHeader from '../components/CarsiHeader'
import CarsiHero from '../components/CarsiHero'
import TickerBar from '../components/TickerBar'
import MarketCards from '../components/MarketCards'
import Footer from '../components/Footer'
import OfflineBanner from '../components/OfflineBanner'

function CarsiPage({ marketState, theme, toggleTheme }) {
  return (
    <>
      <OfflineBanner />

      <CarsiHeader
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <CarsiHero marketState={marketState} />

      <TickerBar marketState={marketState} />

      <div id="carsi-markets">
        <MarketCards marketState={marketState} />
      </div>

      <div id="carsi-contact">
        <Footer />
      </div>
    </>
  )
}

export default CarsiPage