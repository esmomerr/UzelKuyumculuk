function Footer() {
  return (
    <footer id="contact" className="footer-section">
      <div className="container">
        <div className="row gy-5">
          <div className="col-lg-4">
            <h3 className="footer-title">Uzel Kuyumculuk</h3>

            <p className="footer-text">
              Güncel altın fiyatlarını canlı takip edebilir,
              mağazamız ile hızlıca iletişime geçebilirsiniz.
            </p>

            <div className="footer-note">
              Fiyatlar bilgilendirme amaçlıdır.
              İşlem öncesi mağazamız ile iletişime geçiniz.
            </div>
          </div>

          <div className="col-lg-4">
            <h4 className="footer-subtitle">İletişim</h4>

            <ul className="footer-list">
              <li>
                Tatlıkuyu Mahallesi Güney Yanyol Cad,
                Tatlıkuyu, Gebze Center No:310 D:231,
                41400 Gebze/Kocaeli
              </li>

              <li>
                <a href="tel:+902626450606">
                  +90 262 645 06 06
                </a>
              </li>
            </ul>

            <div className="footer-buttons">
              <a
                href="https://wa.me/905314343992"
                target="_blank"
                rel="noreferrer"
                className="footer-btn"
              >
                WhatsApp
              </a>

              <a
                href="tel:+902626450606"
                className="footer-btn"
              >
                Ara
              </a>
            </div>
          </div>

          <div className="col-lg-4">
            <h4 className="footer-subtitle">Konum</h4>

            <p className="footer-text">
              Gebze Center AVM içerisindeki mağazamıza
              haritadan kolayca ulaşabilirsiniz.
            </p>

            <a
              href="https://google.com/maps?um=1&ie=UTF-8&fb=1&gl=tr&sa=X&geocode=KTlZSz_yIMsUMfa9JbJQ31Iq&daddr=Tatlıkuyu+Mahallesi+Güney+Yanyol+Cad,+Tatlıkuyu,+Gebze+Center+No:310+D:231,+41400+Gebze/Kocaeli"
              target="_blank"
              rel="noreferrer"
              className="footer-map-btn"
            >
              Haritada Yol Tarifi Al
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          © 2026 Uzel Kuyumculuk - Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  )
}

export default Footer