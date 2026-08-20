import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, formatPrice } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function AccountPage() {
  const { user, logout } = useAuth()
  const [orders, setOrders] = useState([])
  const [wishlist, setWishlist] = useState([])

  useEffect(() => {
    if (!user) return
    api.get('/account/orders').then(setOrders).catch(() => {})
    api.get('/account/wishlist').then(setWishlist).catch(() => {})
  }, [user])

  if (!user) {
    return (
      <section className="section page">
        <div className="page-heading"><p className="eyebrow">MY ACCOUNT</p><h1>Log in to view your account.</h1></div>
        <p className="empty-state">Your orders, wishlist and details live here.</p>
        <div className="auth-actions">
          <Link className="button button-dark" to="/login">Log in</Link>
          <Link className="button" to="/register">Create an account</Link>
        </div>
      </section>
    )
  }

  return (
    <section className="section page">
      <nav className="breadcrumb"><Link to="/">Home</Link> <span>/</span> <span>My account</span></nav>
      <div className="account-head">
        <div>
          <p className="eyebrow">MY ACCOUNT</p>
          <h1>Hello, {user.name.split(' ')[0]}.</h1>
          <p className="page-blurb">{user.email}</p>
        </div>
        <button className="button" onClick={logout}>Log out</button>
      </div>

      <h2 className="account-section-title">Order history</h2>
      {orders.length === 0 ? (
        <p className="empty-state">No orders yet. Your first instrument is waiting.</p>
      ) : (
        <div className="order-list">
          {orders.map(o => (
            <Link className="order-card" to={`/order/${o.orderNo}`} key={o.orderNo}>
              <div>
                <b>{o.orderNo}</b>
                <span>{new Date(o.createdAt + 'Z').toLocaleDateString('en-IN')} · {o.items.reduce((s, i) => s + i.qty, 0)} items</span>
              </div>
              <div>
                <span className="order-status">{o.status}</span>
                <b>{formatPrice(o.total)}</b>
              </div>
            </Link>
          ))}
        </div>
      )}

      <h2 className="account-section-title">Your wishlist</h2>
      {wishlist.length === 0 ? (
        <p className="empty-state">Nothing saved yet. Tap the ♡ on anything you love.</p>
      ) : (
        <ul className="wishlist-mini">
          {wishlist.slice(0, 4).map(p => (
            <li key={p.id}><Link to={`/product/${p.slug}`}><img src={p.image} alt={p.name} /><span>{p.name}</span></Link><b>{formatPrice(p.price)}</b></li>
          ))}
        </ul>
      )}
    </section>
  )
}