import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react'

const CartContext = createContext(null)
const KEY = 'heritage_cart'

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(load)
  const [open, setOpen] = useState(false)

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(items)) }, [items])

  const add = useCallback((product, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i)
      return [...prev, { id: product.id, slug: product.slug, name: product.name, price: product.price, image: product.image, tag: product.tag, qty }]
    })
    setOpen(true)
  }, [])

  const remove = useCallback((id) => setItems(prev => prev.filter(i => i.id !== id)), [])
  const setQty = useCallback((id, qty) => {
    setItems(prev => qty <= 0 ? prev.filter(i => i.id !== id) : prev.map(i => i.id === id ? { ...i, qty } : i))
  }, [])
  const clear = useCallback(() => setItems([]), [])

  const count = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items])
  const subtotal = useMemo(() => items.reduce((s, i) => s + i.price * i.qty, 0), [items])

  return (
    <CartContext.Provider value={{ items, add, remove, setQty, clear, count, subtotal, open, setOpen }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)