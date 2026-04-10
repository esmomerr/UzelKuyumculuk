function TickerBar({ marketState }) {
  const { marketData, getChangeStyles } = marketState

  const selectedTickerData = marketData.filter((item) =>
    [
      'Ons Altın',
      'Has Altın',
      'Gram Altın',
      '22 Ayar',
      'Çeyrek Altın',
      'Yarım Altın',
      'Tam Altın',
      'Ata Altın',
    ].includes(item.name)
  )

  const tickerItems = [...selectedTickerData, ...selectedTickerData]

  return (
    <section className="ticker-section">
      <div className="ticker-wrapper">
        <div className="ticker-track">
          {tickerItems.map((item, index) => {
            const changeStyles = getChangeStyles(item.changeValue)

            return (
              <div className="ticker-item" key={index}>
                <span className="ticker-dot"></span>

                <span className="ticker-name">{item.name}</span>

                <span className="ticker-price">
                  Alış: {item.buy} | Satış: {item.sell}
                </span>

                <span
                  className="market-badge"
                  style={{
                    color: changeStyles.color,
                    background: changeStyles.background,
                  }}
                >
                  {item.change}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default TickerBar