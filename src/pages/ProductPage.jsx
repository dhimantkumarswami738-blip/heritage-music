import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { api, formatPrice } from '../api.js'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import ProductCard from '../components/ProductCard.jsx'

export default function ProductPage() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [qty, setQty] = useState(1)
  const [wishlisted, setWishlisted] = useState(false)
  const { add } = useCart()
  const { user } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    setProduct(null)
    setQty(1)
    api.get(`/products/${slug}`).then(setProduct).catch(() => setProduct(null))
  }, [slug])

  useEffect(() => {
    if (!user || !product) { setWishlisted(false); return }
    api.get('/account/wishlist').then(list => setWishlisted(list.some(p => p.id === product.id))).catch(() => {})
  }, [user, product])

  const toggleWishlist = async () => {
    if (!user) { showToast('Log in to save to your wishlist'); navigate('/login'); return }
    if (wishlisted) { await api.del(`/account/wishlist/${product.id}`); setWishlisted(false); showToast('Removed from your wishlist') }
    else { await api.post('/account/wishlist', { productId: product.id }); setWishlisted(true); showToast('Added to your wishlist') }
  }

  if (!product) {
    return <section className="section page"><p className="empty-state">Loading instrument…</p></section>
  }

  return (
    <section className="section page">
      <nav className="breadcrumb"><Link to="/">Home</Link> <span>/</span> <Link to={`/category/${product.category}`}>{product.category.replace(/-/g, ' ')}</Link> <span>/</span> <span>{product.name}</span></nav>
      <div className="product-layout">
        <div className="product-gallery">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="product-info">
          {product.tag && <p className="eyebrow">{product.tag}</p>}
          <h1>{product.name}</h1>
          <p className="product-brand">{product.brand} · ★ {product.rating}</p>
          <p className="price product-price">{formatPrice(product.price)}</p>
          <p className="product-desc">{product.description}</p>

          <div className="specs">
            {Object.entries(product.specs).map(([k, v]) => (
              <div key={k}><span>{k.replace(/([A-Z])/g, ' $1').toLowerCase()}</span><b>{v}</b></div>
            ))}
          </div>

          <div className="buy-row">
            <div className="qty-stepper">
              <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(qty + 1)}>+</button>
            </div>
            <button className="button button-dark" onClick={() => add(product, qty)}>Add to bag</button>
            <button className="button button-rust" onClick={() => { add(product, qty); navigate('/checkout') }}>Buy now</button>
            <button className={`wishlist-heart${wishlisted ? ' saved' : ''}`} aria-label="Toggle wishlist" onClick={toggleWishlist}>{wishlisted ? '♥' : '♡'}</button>
          </div>

          <div className="assurance">
            <span>✓ Free shipping over ₹5,000</span>
            <span>✓ Hand set-up before dispatch</span>
            <span>✓ 1-year warranty</span>
          </div>
        </div>
      </div>

      {product.related.length > 0 && (
        <div className="related">
          <div className="section-heading"><div><p className="eyebrow">PAIRS WELL WITH</p><h2>You may also like</h2></div></div>
          <div className="product-grid">{product.related.map(p => <ProductCard key={p.slug} product={p} />)}</div>
        </div>
      )}
    </section>
  )
}