function Hero({ marketState }) {
  const {
    marketData,
    loading,
    error,
    getChangeStyles,
    refreshKey,
  } = marketState

  return (
    <section id="home" className="hero-section">
      <div className="container">
        <div className="row align-items-center min-vh-75">
          <div className="col-lg-5">
            <span className="hero-badge">Canlı Piyasa Takibi</span>
            <h1 className="hero-title mt-3">
              Altın ve döviz piyasalarını anlık takip edin
            </h1>

            <p className="hero-text mt-3">
              Güçlü arayüz, sade tasarım ve yatırım odaklı panel yapısıyla
              kullanıcıların piyasayı hızlıca takip edebileceği modern bir deneyim.
            </p>
          </div>

          <div className="col-lg-7 mt-5 mt-lg-0">
            <div className="hero-panel p-0 overflow-hidden">
              <div className="px-4 pt-4 pb-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
                <span
                  className="fw-semibold"
                  style={{ color: 'var(--text-main)' }}
                >
                  Öne Çıkan Piyasalar
                </span>
                <span className="text-success">Canlı</span>
              </div>

              <div className="px-4 pb-2">
                {loading && <p className="text-warning mb-2">Veriler yükleniyor...</p>}
                {error && <p className="text-danger mb-2">{error}</p>}
              </div>

              <div className="table-responsive custom-table-scroll">
                <table className="table custom-market-table align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Ürün</th>
                      <th>Alış</th>
                      <th>Satış</th>
                      <th>Fark</th>
                    </tr>
                  </thead>

                  <tbody key={refreshKey}>
                    {marketData.map((item) => {
                      const changeStyles = getChangeStyles(item.changeValue)

                      return (
                        <tr key={`${item.name}-${item.buy}-${item.sell}-${refreshKey}`}>
                          <td>{item.name}</td>
                          <td>{item.buy}</td>
                          <td>{item.sell}</td>
                          <td>
                            <span
                              className="market-badge"
                              style={{
                                color: changeStyles.color,
                                background: changeStyles.background,
                              }}
                            >
                              {item.change}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero