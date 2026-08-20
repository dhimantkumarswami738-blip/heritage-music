import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { formatPrice } from '../api.js'

export default function CartDrawer() {
  const { items, open, setOpen, setQty, remove, subtotal } = useCart()
  const navigate = useNavigate()

  const go = (path) => { setOpen(false); navigate(path) }

  return (
    <div className={`drawer-layer${open ? ' open' : ''}`}>
      <div className="drawer-backdrop" onClick={() => setOpen(false)} />
      <aside className="cart-drawer" aria-hidden={String(!open)}>
        <div className="drawer-head">
          <h3>Your Shopping Bag</h3>
          <button className="close-search" aria-label="Close bag" onClick={() => setOpen(false)}>×</button>
        </div>
        {items.length === 0 ? (
          <div className="drawer-empty">
            <p>Your bag is empty.</p>
            <button className="button button-dark" onClick={() => go('/shop')}>Continue shopping</button>
          </div>
        ) : (
          <>
            <ul className="drawer-items">
              {items.map(item => (
                <li key={item.id}>
                  <img src={item.image} alt={item.name} />
                  <div className="drawer-item-info">
                    <strong onClick={() => go(`/product/${item.slug}`)}>{item.name}</strong>
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
            <div className="drawer-foot">
              <div className="drawer-subtotal"><span>Subtotal</span><b>{formatPrice(subtotal)}</b></div>
              <button className="button button-dark button-block" onClick={() => go('/checkout')}>Checkout</button>
              <button className="button button-block" onClick={() => go('/cart')}>View full bag</button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}