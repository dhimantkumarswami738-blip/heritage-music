import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault(); setError('')
    try { await login(email, password); showToast('Welcome back'); navigate('/account') }
    catch (err) { setError(err.message) }
  }

  return (
    <section className="section page auth-page">
      <nav className="breadcrumb"><Link to="/">Home</Link> <span>/</span> <span>Log in</span></nav>
      <div className="page-heading"><p className="eyebrow">WELCOME BACK</p><h1>Log in.</h1></div>
      <form className="auth-form" onSubmit={submit}>
        <label>Email<input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" /></label>
        <label>Password<input required type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" /></label>
        {error && <p className="form-message error">{error}</p>}
        <button className="button button-dark button-block">Log in</button>
      </form>
      <p className="auth-switch">New to Heritage? <Link to="/register">Create an account</Link></p>
    </section>
  )
}