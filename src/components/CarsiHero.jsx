function CarsiHero({ marketState }) {
  const {
    marketData,
    loading,
    error,
    refreshKey,
    statusText,
    statusType,
    lastUpdateTime,
  } = marketState

  return (
    <section id="carsi-home" className="hero-section carsi-hero-section">
      <div className="container">
        <div className="row align-items-center min-vh-75">
          <div className="col-lg-5">
            <span className="hero-badge">
              Canlı Piyasa Takibi
            </span>

            <h1 className="hero-title mt-3">
              Uzel Kuyumculuk Çarşı canlı altın fiyatları
            </h1>

            <p className="hero-text mt-3">
              Çarşı mağazamıza özel alış ve satış fiyatlarını canlı olarak
              takip edebilirsiniz.
            </p>

            <div className="d-flex gap-3 mt-4 flex-wrap">
              <button
                type="button"
                className="btn btn-gold"
                onClick={() => {
                  document
                    .getElementById('carsi-markets')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Tüm Fiyatları Gör
              </button>
            </div>
          </div>

          <div className="col-lg-7 mt-5 mt-lg-0">
            <div className="hero-panel p-0 overflow-hidden">
              <div className="px-4 pt-4 pb-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
                <span
                  className="fw-semibold"
                  style={{ color: 'var(--text-main)' }}
                >
                  Çarşı Mağazası Fiyatları
                </span>

                <div className={`live-status ${statusType}`}>
                  <span className="live-dot"></span>

                  <div className="live-info">
                    <span className="live-text">
                      {statusText}
                    </span>

                    {statusType !== 'offline' && (
                      <small className="live-time">
                        Son Güncelleme: {lastUpdateTime}
                      </small>
                    )}
                  </div>
                </div>
              </div>

              <div className="px-4 pb-2">
                {loading && (
                  <p className="text-warning mb-2">
                    Çarşı fiyatları yükleniyor...
                  </p>
                )}

                {error && (
                  <p className="text-danger mb-2">
                    {error}
                  </p>
                )}
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
                    {marketData.map((item) => (
                      <tr
                        key={`${item.name}-${item.buy}-${item.sell}-${refreshKey}`}
                      >
                        <td>{item.name}</td>
                        <td>{item.buy}</td>
                        <td>{item.sell}</td>
                        <td>
                          <span
                            className="market-badge"
                            style={{
                              color:
                                item.changeValue > 0
                                  ? '#4ade80'
                                  : item.changeValue < 0
                                    ? '#f87171'
                                    : 'var(--text-soft)',
                              background:
                                item.changeValue > 0
                                  ? 'rgba(34, 197, 94, 0.15)'
                                  : item.changeValue < 0
                                    ? 'rgba(239, 68, 68, 0.15)'
                                    : 'rgba(148, 163, 184, 0.12)',
                            }}
                          >
                            {item.change}
                          </span>
                        </td>
                      </tr>
                    ))}
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

export default CarsiHero