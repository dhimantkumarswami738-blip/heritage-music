import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, formatPrice } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

export default function WishlistPage() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const { add } = useCart()
  const { showToast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) { setItems([]); return }
    api.get('/account/wishlist').then(setItems).catch(() => {})
  }, [user])

  if (!user) {
    return (
      <section className="section page">
        <nav className="breadcrumb"><Link to="/">Home</Link> <span>/</span> <span>Wishlist</span></nav>
        <div className="page-heading"><p className="eyebrow">YOUR WISHLIST</p><h1>Log in to see your wishlist.</h1></div>
        <p className="empty-state">We’ll keep it safe until you’re back.</p>
        <button className="button button-dark" onClick={() => navigate('/login')}>Log in</button>
      </section>
    )
  }

  const remove = async (id) => {
    await api.del(`/account/wishlist/${id}`)
    setItems(items.filter(i => i.id !== id))
    showToast('Removed from your wishlist')
  }

  return (
    <section className="section page">
      <nav className="breadcrumb"><Link to="/">Home</Link> <span>/</span> <span>Wishlist</span></nav>
      <div className="page-heading">
        <p className="eyebrow">YOUR WISHLIST</p><h1>Saved for later.</h1>
      </div>
      {items.length === 0 ? (
        <p className="empty-state">Nothing saved yet. Tap the ♡ on anything you love.</p>
      ) : (
        <div className="product-grid">
          {items.map(p => (
            <article className="product-card" key={p.id}>
              <div className="product-image">
                <Link to={`/product/${p.slug}`}><img src={p.image} alt={p.name} loading="lazy" /></Link>
                <button className="heart saved" aria-label="Remove from wishlist" onClick={() => remove(p.id)}>♥</button>
              </div>
              <div className="product-meta">
                <p>{p.tag}</p>
                <h3><Link to={`/product/${p.slug}`}>{p.name}</Link></h3>
                <div className="product-price-row">
                  <span className="price">{formatPrice(p.price)}</span>
                  <button className="button button-dark button-small" onClick={() => { add(p); remove(p.id) }}>Add to bag</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}