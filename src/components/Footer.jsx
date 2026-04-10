function Footer() {
  return (
    <footer id="contact" className="footer-section">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4">
            <h4 className="footer-logo">Uzel Kuyumculuk</h4>
            <p>
              Altın ve döviz piyasalarını takip edebileceğiniz modern ve güven veren arayüz tasarımı.
            </p>
          </div>

          <div className="col-lg-2 col-md-4">
            <h6>Menü</h6>
            <ul className="footer-list">
              <li>Anasayfa</li>
              <li>İletişim</li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-4">
            <h6>İletişim</h6>
            <ul className="footer-list">
              <li>Kocaeli / Türkiye</li>
              <li>kocaeli.gebzecenter@atasay.com</li>
              <li>+90 262 645 06 06</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="mb-0">© 2026 Uzel Kuyumculuk. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer