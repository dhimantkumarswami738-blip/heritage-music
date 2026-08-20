import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api, formatPrice } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'

const STEPS = ['placed', 'paid', 'shipped', 'delivered']

function currentStep(status) {
  const order = ['pending', 'paid', 'shipped', 'delivered', 'cancelled']
  const idx = order.indexOf(status)
  if (status === 'cancelled') return 0
  return idx < 0 ? 0 : idx
}

export default function OrderConfirmationPage() {
  const { orderNo } = useParams()
  const { user } = useAuth()
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const email = sessionStorage.getItem('heritage_last_order_email') || user?.email
    api.get(`/orders/${orderNo}${email ? `?email=${encodeURIComponent(email)}` : ''}`)
      .then(setOrder)
      .catch(err => setError(err.message))
  }, [orderNo, user])

  if (error) {
    return (
      <section className="section page">
        <nav className="breadcrumb"><Link to="/">Home</Link> <span>/</span> <span>Order {orderNo}</span></nav>
        <div className="page-heading"><p className="eyebrow">ORDER</p><h1>{error}</h1></div>
        <Link className="button button-dark" to="/track">Track an order</Link>
      </section>
    )
  }
  if (!order) {
    return <section className="section page"><p className="empty-state">Loading your order…</p></section>
  }

  const step = currentStep(order.status)
  const labels = { pending: 'Payment pending', paid: 'Payment received', shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled' }

  return (
    <section className="section page confirmation">
      <nav className="breadcrumb"><Link to="/">Home</Link> <span>/</span> <span>Order {order.orderNo}</span></nav>
      <div className="confirmation-hero">
        <p className="eyebrow">{order.status === 'cancelled' ? 'ORDER CANCELLED' : 'ORDER PLACED'}</p>
        <h1>{order.status === 'cancelled' ? 'That one got cancelled.' : 'Thank you. It’s on its way.'}</h1>
        <p>Order number <b>{order.orderNo}</b> · {labels[order.status] || order.status} · {formatPrice(order.total)}</p>
      </div>

      <ol className="track-timeline">
        {STEPS.map((s, i) => (
          <li key={s} className={i <= step && order.status !== 'cancelled' ? 'done' : ''}>
            <span>{i + 1}</span>
            <b>{s.charAt(0).toUpperCase() + s.slice(1)}</b>
          </li>
        ))}
      </ol>

      <ul className="order-items">
        {order.items.map(item => (
          <li key={item.id}>
            <img src={item.image} alt={item.name} />
            <div><strong>{item.name}</strong><span>Qty {item.qty}</span></div>
            <b>{formatPrice(item.price * item.qty)}</b>
          </li>
        ))}
      </ul>
      <div className="order-foot">
        <span>Shipping to</span>
        <p>{order.customerName}<br />{order.address}<br />{order.customerEmail}</p>
        <div className="summary-row total"><span>Total paid</span><b>{formatPrice(order.total)}</b></div>
      </div>
      <Link className="button button-dark" to="/shop">Keep shopping <span>↗</span></Link>
    </section>
  )
}