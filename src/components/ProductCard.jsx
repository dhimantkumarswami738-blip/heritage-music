import { Link } from 'react-router-dom'
import { formatPrice } from '../api.js'
import { useCart } from '../context/CartContext.jsx'

export default function ProductCard({ product }) {
  const { add } = useCart()
  return (
    <article className="product-card">
      <div className="product-image">
        <Link to={`/product/${product.slug}`}><img src={product.image} alt={product.name} loading="lazy" /></Link>
        {product.tag && <span className="product-tag">{product.tag}</span>}
        <button className="quick-add" aria-label={`Add ${product.name} to bag`} onClick={() => add(product)}>Add to bag +</button>
      </div>
      <div className="product-meta">
        <p>{product.brand} · {product.category}</p>
        <h3><Link to={`/product/${product.slug}`}>{product.name}</Link></h3>
        <div className="product-price-row"><span className="price">{formatPrice(product.price)}</span><span className="rating">★ {product.rating}</span></div>
      </div>
    </article>
  )
}