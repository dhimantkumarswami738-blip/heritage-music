import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <Link className="wordmark footer-mark" to="/"><span>HERITAGE</span><strong>MUSIC</strong></Link>
        <p>Instruments with a story.<br />Music for the long way home.</p>
        <div className="socials">
          <a href="#">Instagram</a><a href="#">YouTube</a><a href="#">Spotify</a>
        </div>
      </div>
      <div className="footer-links">
        <div>
          <p className="eyebrow">EXPLORE</p>
          <Link to="/#shop">Shop all</Link>
          <Link to="/#collections">Collections</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/track">Track order</Link>
        </div>
        <div>
          <p className="eyebrow">ACCOUNT</p>
          <Link to="/account">My account</Link>
          <Link to="/account/orders">Order history</Link>
          <Link to="/login">Log in</Link>
          <Link to="/register">Register</Link>
        </div>
        <div>
          <p className="eyebrow">HELP</p>
          <a href="#">Contact us</a>
          <a href="#">Shipping &amp; returns</a>
          <a href="#">Care guide</a>
          <Link to="/track">Track your order</Link>
        </div>
        <div>
          <p className="eyebrow">VISIT</p>
          <p>42 Chapel Road<br />Bandra West, Mumbai<br />Mon–Sat · 11am–8pm</p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Heritage Music Co.</span>
        <span className="pay-badges">VISA · Mastercard · UPI · Netbanking · COD</span>
        <span>Made for the music.</span>
        <button className="back-top" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑ Back to top</button>
      </div>
    </footer>
  )
}