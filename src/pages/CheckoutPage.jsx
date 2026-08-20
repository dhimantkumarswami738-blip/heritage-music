import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { api, formatPrice } from '../api.js'

function loadRazorpay() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve(window.Razorpay)
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(window.Razorpay)
    script.onerror = () => reject(new Error('Could not load payment gateway'))
    document.body.appendChild(script)
  })
}

export default function CheckoutPage() {
  const { items, subtotal, count, clear } = useCart()
  const { user } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: ''
  })
  const [busy, setBusy] = useState(false)
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const placeOrder = async () => {
    setBusy(true)
    try {
      const data = await api.post('/orders', {
        items: items.map(i => ({ productId: i.id, qty: i.qty })),
        customer: form
      })
      sessionStorage.setItem('heritage_last_order_email', form.email)
      if (data.mock) {
        clear()
        showToast('Order placed!')
        navigate(`/order/${data.orderNo}`)
        return
      }
      const Razorpay = await loadRazorpay()
      new Razorpay({
        key: data.keyId,
        amount: data.amount * 100,
        currency: 'INR',
        name: 'Heritage Music',
        description: `Order ${data.orderNo}`,
        order_id: data.razorpayOrderId,
        prefill: { name: form.name, email: form.email, contact: form.phone },
        handler: async (response) => {
          await api.post(`/orders/${data.orderNo}/verify`, {
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature
          })
          clear()
          navigate(`/order/${data.orderNo}`)
        },
        modal: { ondismiss: () => setBusy(false) }
      }).open()
    } catch (err) {
      showToast(err.message)
      setBusy(false)
    }
  }

  if (items.length === 0) {
    return (
      <section className="section page">
        <nav className="breadcrumb"><Link to="/">Home</Link> <span>/</span> <span>Checkout</span></nav>
        <div className="page-heading"><p className="eyebrow">CHECKOUT</p><h1>Your bag is empty.</h1></div>
        <button className="button button-dark" onClick={() => navigate('/shop')}>Continue shopping</button>
      </section>
    )
  }

  return (
    <section className="section page">
      <nav className="breadcrumb"><Link to="/">Home</Link> <span>/</span> <span>Checkout</span></nav>
      <div className="page-heading"><p className="eyebrow">SECURE CHECKOUT</p><h1>Almost yours.</h1></div>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={e => { e.preventDefault(); placeOrder() }}>
          <fieldset>
            <legend>Contact</legend>
            <label>Full name<input required value={form.name} onChange={set('name')} placeholder="Rhea Menon" /></label>
            <label>Email<input required type="email" value={form.email} onChange={set('email')} placeholder="you@email.com" /></label>
            <label>Phone<input type="tel" value={form.phone} onChange={set('phone')} placeholder="+91" /></label>
          </fieldset>
          <fieldset>
            <legend>Delivery address</legend>
            <label>Address<textarea required value={form.address} onChange={set('address')} rows={3} placeholder="House, street, city, PIN" /></label>
          </fieldset>
          <button className="button button-dark button-block" disabled={busy}>{busy ? 'Placing order…' : `Pay ${formatPrice(subtotal)}`}</button>
          <p className="checkout-note">Payments handled securely by Razorpay. UPI, cards and netbanking accepted.</p>
        </form>
        <aside className="cart-summary">
          <h3>Order summary</h3>
          <ul className="summary-items">
            {items.map(i => (
              <li key={i.id}><span>{i.name} × {i.qty}</span><b>{formatPrice(i.price * i.qty)}</b></li>
            ))}
          </ul>
          <div className="summary-row"><span>Subtotal ({count} item{count === 1 ? '' : 's'})</span><b>{formatPrice(subtotal)}</b></div>
          <div className="summary-row"><span>Shipping</span><b>FREE</b></div>
          <div className="summary-row total"><span>Total</span><b>{formatPrice(subtotal)}</b></div>
        </aside>
      </div>
    </section>
  )
}