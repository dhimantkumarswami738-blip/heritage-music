import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { formatPrice } from '../api.js'

export default function CartPage() {
  const { items, setQty, remove, subtotal, count } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <section className="section page">
        <nav className="breadcrumb"><Link to="/">Home</Link> <span>/</span> <span>Shopping bag</span></nav>
        <div className="page-heading"><p className="eyebrow">YOUR BAG</p><h1>Your bag is empty.</h1></div>
        <p className="empty-state">Find something good to play with in our shop.</p>
        <button className="button button-dark" onClick={() => navigate('/shop')}>Continue shopping</button>
      </section>
    )
  }

  return (
    <section className="section page">
      <nav className="breadcrumb"><Link to="/">Home</Link> <span>/</span> <span>Shopping bag</span></nav>
      <div className="page-heading"><p className="eyebrow">YOUR BAG</p><h1>Shopping bag <small>({count})</small></h1></div>
      <div className="cart-layout">
        <ul className="cart-items">
          {items.map(item => (
            <li key={item.id}>
              <Link to={`/product/${item.slug}`}><img src={item.image} alt={item.name} /></Link>
              <div className="cart-item-info">
                <strong><Link to={`/product/${item.slug}`}>{item.name}</Link></strong>
                <span className="price">{formatPrice(item.price)}</span>
                <div className="qty-row">
                  <button onClick={() => setQty(item.id, item.qty - 1)}>−</button>
                  <span>{item.qty}</span>
                  <button onClick={() => setQty(item.id, item.qty + 1)}>+</button>
                  <button className="drawer-remove" onClick={() => remove(item.id)}>Remove</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <aside className="cart-summary">
          <h3>Order summary</h3>
          <div className="summary-row"><span>Subtotal ({count} item{count === 1 ? '' : 's'})</span><b>{formatPrice(subtotal)}</b></div>
          <div className="summary-row"><span>Shipping</span><b>FREE</b></div>
          <div className="summary-row total"><span>Total</span><b>{formatPrice(subtotal)}</b></div>
          <button className="button button-dark button-block" onClick={() => navigate('/checkout')}>Checkout</button>
          <button className="button button-block" onClick={() => navigate('/shop')}>Continue shopping</button>
        </aside>
      </div>
    </section>
  )
}