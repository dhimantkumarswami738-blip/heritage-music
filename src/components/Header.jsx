import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api.js'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import MegaMenu from './MegaMenu.jsx'
import SearchPanel from './SearchPanel.jsx'

export default function Header() {
  const [categories, setCategories] = useState([])
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [megaOpen, setMegaOpen] = useState(false)
  const { count, setOpen } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/categories').then(setCategories).catch(() => {})
  }, [])

  useEffect(() => {
    if (!user) { setWishlistCount(0); return }
    api.get('/account/wishlist').then(list => setWishlistCount(list.length)).catch(() => {})
  }, [user])

  return (
    <div className="header-shell">
      <div className="announcement">
        <span>FREE SHIPPING ON ORDERS OVER ₹5,000</span>
        <span>CURATED INSTRUMENTS. HONEST ADVICE.</span>
        <span>EST. 2012 · MUMBAI</span>
      </div>
      <header className="site-header">
        <button className="menu-toggle" aria-label="Open menu" onClick={() => setMenuOpen(o => !o)}>
          <span /><span />
        </button>
        <Link className="wordmark" to="/" aria-label="Heritage Music home">
          <span>HERITAGE</span><strong>MUSIC</strong>
        </Link>
        <nav className="main-nav" aria-label="Main navigation" data-open={String(menuOpen)} style={menuOpen ? { display: 'flex' } : undefined}>
          <div className="nav-item" onMouseEnter={() => setMegaOpen(true)} onMouseLeave={() => setMegaOpen(false)}>
            <Link to="/#shop" onClick={() => setMenuOpen(false)}>Shop</Link>
            {megaOpen && <MegaMenu categories={categories} onNavigate={() => { setMegaOpen(false); setMenuOpen(false) }} />}
          </div>
          <a href="/#collections" onClick={() => setMenuOpen(false)}>Collections</a>
          <a href="/#story" onClick={() => setMenuOpen(false)}>Our story</a>
          <a href="/#journal" onClick={() => setMenuOpen(false)}>Journal</a>
        </nav>
        <div className="header-tools">
          <button className="icon-button" aria-label="Search" onClick={() => setSearchOpen(true)}>⌕</button>
          <Link className="icon-button wishlist-link" to="/wishlist" aria-label="Wishlist">♡<b className="wishlist-count">{wishlistCount}</b></Link>
          {user ? (
            <Link className="icon-button account-chip" to="/account" aria-label="My account">{user.name.charAt(0).toUpperCase()}</Link>
          ) : (
            <button className="icon-button" aria-label="Account" onClick={() => navigate('/login')}>○</button>
          )}
          <button className="cart-button" aria-label="Shopping bag" onClick={() => setOpen(true)}>Bag <span className="cart-count">{count}</span></button>
        </div>
      </header>
      <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  )
}