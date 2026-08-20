import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, formatPrice } from '../api.js'

export default function SearchPanel({ open, onClose }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (open) { setQuery(''); setResults([]); setTimeout(() => inputRef.current?.focus(), 50) }
  }, [open])

  useEffect(() => {
    if (!open || query.trim().length < 2) { setResults([]); return }
    const t = setTimeout(() => {
      api.get(`/products/search?q=${encodeURIComponent(query.trim())}`).then(setResults).catch(() => setResults([]))
    }, 250)
    return () => clearTimeout(t)
  }, [query, open])

  const go = (slug) => { onClose(); navigate(`/product/${slug}`) }

  return (
    <div className="search-panel" style={open ? { transform: 'translateY(0)' } : undefined} aria-hidden={String(!open)}>
      <div className="search-panel-inner">
        <input
          ref={inputRef}
          id="searchInput"
          type="search"
          placeholder="Search guitars, keys, strings..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && results[0]) go(results[0].slug) }}
        />
        <button className="close-search" aria-label="Close search" onClick={onClose}>×</button>
      </div>
      <p className="search-hint">Try “acoustic”, “ukulele”, or “under ₹10,000”</p>
      {results.length > 0 && (
        <ul className="search-results">
          {results.map(r => (
            <li key={r.slug} onClick={() => go(r.slug)}>
              <img src={r.image} alt={r.name} />
              <div>
                <strong>{r.name}</strong>
                <span>{r.tag}</span>
              </div>
              <b>{formatPrice(r.price)}</b>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}