import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api, formatPrice } from '../api.js'

export default function TrackOrderPage() {
  const [email, setEmail] = useState('')
  const [orderNo, setOrderNo] = useState('')
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const track = async (e) => {
    e.preventDefault()
    setBusy(true); setError(''); setOrder(null)
    try {
      const data = await api.get(`/orders/${orderNo.trim()}?email=${encodeURIComponent(email.trim())}`)
      setOrder(data)
    } catch (err) { setError(err.message) } finally { setBusy(false) }
  }

  const labels = { pending: 'Payment pending', paid: 'Payment received', shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled' }

  return (
    <section className="section page">
      <nav className="breadcrumb"><Link to="/">Home</Link> <span>/</span> <span>Track order</span></nav>
      <div className="page-heading"><p className="eyebrow">WHERE’S MY ORDER</p><h1>Track your order.</h1></div>

      <form className="track-form" onSubmit={track}>
        <label>Email / Mobile used at checkout<input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" /></label>
        <label>Order number<input required value={orderNo} onChange={e => setOrderNo(e.target.value)} placeholder="HM-123456AB" /></label>
        <button className="button button-dark" disabled={busy}>{busy ? 'Looking…' : 'Track order'}</button>
      </form>
      {error && <p className="form-message error">{error}</p>}

      {order && (
        <div className="track-result">
          <div className="confirmation-hero">
            <p className="eyebrow">ORDER {order.orderNo}</p>
            <h1>{labels[order.status] || order.status}</h1>
            <p>Placed {new Date(order.createdAt + 'Z').toLocaleDateString('en-IN')} · {formatPrice(order.total)}</p>
          </div>
          <ul className="order-items">
            {order.items.map(item => (
              <li key={item.id}>
                <img src={item.image} alt={item.name} />
                <div><strong>{item.name}</strong><span>Qty {item.qty}</span></div>
                <b>{formatPrice(item.price * item.qty)}</b>
              </li>
            ))}
          </ul>
          <div className="summary-row total"><span>Total</span><b>{formatPrice(order.total)}</b></div>
        </div>
      )}
    </section>
  )
}