function MarketCards({ marketState }) {
  const { marketData, getChangeStyles, refreshKey } = marketState

  const selectedMarkets = marketData.filter((item) =>
    [
      'Has Altın',
      'Ons Altın',
      'Gram Altın',
      '22 Ayar Gram',
      'Yeni Çeyrek',
      'Eski Çeyrek',
      'Yeni Yarım',
      'Eski Yarım',
      'Yeni Tam',
      'Eski Tam',
      'Yeni Ata',
      'Eski Ata',
    ].includes(item.name)
  )

  return (
    <section id="markets" className="py-5 market-section">
      <div className="container">
        <div className="section-head text-center mb-5">
          <h2>Canlı Piyasa Görünümü</h2>
          <p>Piyasadaki temel verileri sade kart yapısıyla sunan modern alan.</p>
        </div>

        <div className="row g-4" key={refreshKey}>
          {selectedMarkets.map((item) => {
            const changeStyles = getChangeStyles(item.changeValue)

            return (
              <div
                className="col-md-6 col-xl-3"
                key={`${item.name}-${item.buy}-${item.sell}-${refreshKey}`}
              >
                <div className="market-card">
                  <h5>{item.name}</h5>
                  <p>Alış: {item.buy}</p>
                  <p>Satış: {item.sell}</p>
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
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default MarketCards