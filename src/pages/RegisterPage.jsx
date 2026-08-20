import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { register } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault(); setError('')
    try { await register(name, email, password); showToast('Account created — welcome'); navigate('/account') }
    catch (err) { setError(err.message) }
  }

  return (
    <section className="section page auth-page">
      <nav className="breadcrumb"><Link to="/">Home</Link> <span>/</span> <span>Register</span></nav>
      <div className="page-heading"><p className="eyebrow">JOIN THE ROOM</p><h1>Create an account.</h1></div>
      <form className="auth-form" onSubmit={submit}>
        <label>Full name<input required value={name} onChange={e => setName(e.target.value)} placeholder="Rhea Menon" /></label>
        <label>Email<input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" /></label>
        <label>Password<input required type="password" minLength={6} value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters" /></label>
        {error && <p className="form-message error">{error}</p>}
        <button className="button button-dark button-block">Create account</button>
      </form>
      <p className="auth-switch">Already have an account? <Link to="/login">Log in</Link></p>
    </section>
  )
}