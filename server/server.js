import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Razorpay from 'razorpay'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { db, initSchema } from './db.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = process.env.PORT || 4000
const JWT_SECRET = process.env.JWT_SECRET || 'heritage-dev-secret-change-me'

const razorpayKeyId = process.env.RAZORPAY_KEY_ID
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET
const razorpayMock = !razorpayKeyId || !razorpayKeySecret
const razorpay = razorpayMock ? null : new Razorpay({ key_id: razorpayKeyId, key_secret: razorpayKeySecret })

initSchema()
if (db.prepare('SELECT COUNT(*) as c FROM products').get().c === 0) {
  const { seed } = await import('./seed.js')
  seed()
}

const app = express()
app.use(cors())
app.use(express.json())

const auth = (req, res, next) => {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Not authenticated' })
  try {
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Session expired, please log in again' })
  }
}

const publicProduct = (row) => ({
  id: row.id,
  slug: row.slug,
  name: row.name,
  brand: row.brand,
  category: row.category_slug,
  price: row.price,
  tag: row.tag,
  image: row.image,
  description: row.description,
  specs: row.specs ? JSON.parse(row.specs) : {},
  featured: !!row.featured,
  inStock: !!row.in_stock,
  rating: row.rating
})

// ---------- Auth ----------
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password are required' })
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' })
  const exists = db.prepare('SELECT id FROM users WHERE lower(email) = lower(?)').get(email)
  if (exists) return res.status(409).json({ error: 'An account with this email already exists' })
  const hash = bcrypt.hashSync(password, 10)
  const info = db.prepare('INSERT INTO users (name, email, password_hash) VALUES (?,?,?)').run(name, email.toLowerCase().trim(), hash)
  const user = { id: info.lastInsertRowid, name, email: email.toLowerCase().trim() }
  res.json({ token: jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' }), user })
})

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' })
  const row = db.prepare('SELECT * FROM users WHERE lower(email) = lower(?)').get(email)
  if (!row || !bcrypt.compareSync(password, row.password_hash)) return res.status(401).json({ error: 'Incorrect email or password' })
  const user = { id: row.id, name: row.name, email: row.email }
  res.json({ token: jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' }), user })
})

app.get('/api/auth/me', auth, (req, res) => {
  const row = db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(req.user.id)
  if (!row) return res.status(401).json({ error: 'Account not found' })
  res.json({ user: row })
})

// ---------- Categories ----------
app.get('/api/categories', (req, res) => {
  const rows = db.prepare(`
    SELECT c.*, p.slug AS parent_slug,
      (SELECT COUNT(*) FROM products pr WHERE pr.category_id = c.id) AS product_count
    FROM categories c LEFT JOIN categories p ON p.id = c.parent_id
    ORDER BY c.sort
  `).all()
  const tree = []
  const byId = {}
  for (const r of rows) {
    const node = { id: r.id, slug: r.slug, name: r.name, image: r.image, parent: r.parent_slug, productCount: r.product_count, children: [] }
    byId[r.id] = node
  }
  for (const r of rows) {
    const node = byId[r.id]
    if (r.parent_id && byId[r.parent_id]) byId[r.parent_id].children.push(node)
    else tree.push(node)
  }
  res.json(tree)
})

// ---------- Products ----------
app.get('/api/products', (req, res) => {
  const { category, search, collection, featured, limit } = req.query
  const params = []
  let where = '1=1'
  if (category) {
    where += ' AND c.slug = ?'
    params.push(category)
  }
  if (search) {
    where += ' AND (pr.name LIKE ? OR pr.brand LIKE ? OR pr.tag LIKE ?)'
    params.push(`%${search}%`, `%${search}%`, `%${search}%`)
  }
  if (featured === '1') where += ' AND pr.featured = 1'
  if (collection) {
    const map = {
      beginner: 'AND pr.price <= 15000',
      'under-10k': 'AND pr.price < 10000',
      'high-end-deals': 'AND pr.price >= 20000',
      travel: "AND (pr.tag LIKE '%TRAVEL%' OR pr.name LIKE '%Portable%' OR pr.name LIKE '%Travel%')",
      bestsellers: "AND pr.tag = 'BESTSELLER'",
      'new-arrivals': "AND pr.tag = 'NEW ARRIVAL'"
    }
    if (map[collection]) where += ' ' + map[collection]
  }
  const limitClause = limit ? ' LIMIT ' + parseInt(limit, 10) : ''
  const rows = db.prepare(`
    SELECT pr.*, c.slug AS category_slug
    FROM products pr JOIN categories c ON c.id = pr.category_id
    WHERE ${where} ORDER BY pr.featured DESC, pr.id${limitClause}
  `).all(...params)
  res.json(rows.map(publicProduct))
})

app.get('/api/products/search', (req, res) => {
  const q = (req.query.q || '').trim()
  if (q.length < 2) return res.json([])
  const rows = db.prepare(`
    SELECT pr.slug, pr.name, pr.price, pr.image, pr.tag, c.slug AS category_slug
    FROM products pr JOIN categories c ON c.id = pr.category_id
    WHERE pr.name LIKE ? OR pr.brand LIKE ? ORDER BY pr.featured DESC LIMIT 8
  `).all(`%${q}%`, `%${q}%`)
  res.json(rows)
})

app.get('/api/products/:slug', (req, res) => {
  const row = db.prepare(`
    SELECT pr.*, c.slug AS category_slug FROM products pr
    JOIN categories c ON c.id = pr.category_id WHERE pr.slug = ?
  `).get(req.params.slug)
  if (!row) return res.status(404).json({ error: 'Product not found' })
  const related = db.prepare(`
    SELECT pr.*, c.slug AS category_slug FROM products pr
    JOIN categories c ON c.id = pr.category_id
    WHERE pr.category_id = ? AND pr.id != ? ORDER BY pr.featured DESC LIMIT 4
  `).all(row.category_id, row.id).map(publicProduct)
  res.json({ ...publicProduct(row), related })
})

// ---------- Wishlist ----------
app.get('/api/account/wishlist', auth, (req, res) => {
  const rows = db.prepare(`
    SELECT pr.*, c.slug AS category_slug FROM wishlist w
    JOIN products pr ON pr.id = w.product_id
    JOIN categories c ON c.id = pr.category_id
    WHERE w.user_id = ? ORDER BY w.created_at DESC
  `).all(req.user.id)
  res.json(rows.map(publicProduct))
})

app.post('/api/account/wishlist', auth, (req, res) => {
  const { productId } = req.body
  if (!productId) return res.status(400).json({ error: 'productId required' })
  db.prepare('INSERT OR IGNORE INTO wishlist (user_id, product_id) VALUES (?,?)').run(req.user.id, productId)
  res.json({ ok: true })
})

app.delete('/api/account/wishlist/:productId', auth, (req, res) => {
  db.prepare('DELETE FROM wishlist WHERE user_id = ? AND product_id = ?').run(req.user.id, req.params.productId)
  res.json({ ok: true })
})

// ---------- Orders & payments ----------
app.post('/api/orders', (req, res) => {
  const { items, customer } = req.body
  if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'Your bag is empty' })
  if (!customer || !customer.name || !customer.email) return res.status(400).json({ error: 'Name and email are required' })

  const placeholders = items.map(() => '?').join(',')
  const rows = db.prepare(`SELECT * FROM products WHERE id IN (${placeholders})`).all(...items.map(i => i.productId))
  if (rows.length !== items.length) return res.status(400).json({ error: 'Some items are no longer available' })

  let total = 0
  const orderItems = []
  for (const item of items) {
    const product = rows.find(r => r.id === item.productId)
    const qty = Math.max(1, parseInt(item.qty, 10) || 1)
    if (!product.in_stock) return res.status(400).json({ error: `${product.name} is out of stock` })
    total += product.price * qty
    orderItems.push({ id: product.id, slug: product.slug, name: product.name, price: product.price, qty, image: product.image })
  }

  const orderNo = 'HM-' + Date.now().toString().slice(-6) + crypto.randomBytes(2).toString('hex').toUpperCase()
  const info = db.prepare(`
    INSERT INTO orders (order_no, user_id, customer_name, customer_email, customer_phone, address, items, total, status)
    VALUES (?,?,?,?,?,?,?,?,'pending')
  `).run(orderNo, req.user ? req.user.id : null, customer.name, customer.email.toLowerCase().trim(), customer.phone || '', JSON.stringify(customer.address || ''), JSON.stringify(orderItems), total)

  let razorpayOrder = null
  if (!razorpayMock) {
    razorpayOrder = razorpay.orders.create({ amount: total * 100, currency: 'INR', receipt: orderNo })
    db.prepare('UPDATE orders SET razorpay_order_id = ? WHERE id = ?').run(razorpayOrder.id, info.lastInsertRowid)
  }

  res.json({
    orderNo,
    amount: total,
    items: orderItems,
    mock: razorpayMock,
    keyId: razorpayKeyId || null,
    razorpayOrderId: razorpayOrder ? razorpayOrder.id : null
  })
})

app.post('/api/orders/:orderNo/verify', (req, res) => {
  const order = db.prepare('SELECT * FROM orders WHERE order_no = ?').get(req.params.orderNo)
  if (!order) return res.status(404).json({ error: 'Order not found' })
  const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body

  if (!razorpayMock) {
    const expected = crypto.createHmac('sha256', razorpayKeySecret).update(`${razorpayOrderId}|${razorpayPaymentId}`).digest('hex')
    if (expected !== razorpaySignature) return res.status(400).json({ error: 'Payment verification failed' })
    db.prepare('UPDATE orders SET status = ?, razorpay_payment_id = ? WHERE id = ?').run('paid', razorpayPaymentId, order.id)
  } else {
    db.prepare("UPDATE orders SET status = 'paid', razorpay_payment_id = ? WHERE id = ?").run(razorpayPaymentId || 'MOCK', order.id)
  }

  res.json({ ok: true, orderNo: order.order_no, status: 'paid' })
})

app.get('/api/orders/:orderNo', (req, res) => {
  const order = db.prepare('SELECT * FROM orders WHERE order_no = ?').get(req.params.orderNo)
  if (!order) return res.status(404).json({ error: 'Order not found' })
  const emailMatches = req.query.email && order.customer_email === req.query.email.toLowerCase().trim()
  const userMatches = req.user && order.user_id === req.user.id
  if (!emailMatches && !userMatches) return res.status(403).json({ error: 'Order not found for this email' })
  res.json({
    orderNo: order.order_no,
    customerName: order.customer_name,
    customerEmail: order.customer_email,
    address: order.address,
    items: JSON.parse(order.items),
    total: order.total,
    status: order.status,
    createdAt: order.created_at,
    razorpayPaymentId: order.razorpay_payment_id
  })
})

app.get('/api/account/orders', auth, (req, res) => {
  const rows = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC').all(req.user.id)
  res.json(rows.map(r => ({ orderNo: r.order_no, total: r.total, status: r.status, items: JSON.parse(r.items), createdAt: r.created_at })))
})

// ---------- Newsletter ----------
app.post('/api/newsletter', (req, res) => {
  const { email } = req.body
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: 'Enter a valid email address' })
  db.prepare('INSERT OR IGNORE INTO newsletter (email) VALUES (?)').run(email.toLowerCase().trim())
  res.json({ ok: true })
})

// ---------- Static (production) ----------
const distDir = path.join(__dirname, '..', 'dist')
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir))
  app.get(/^(?!\/api).*/, (req, res) => res.sendFile(path.join(distDir, 'index.html')))
}

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Something went wrong on our side' })
})

app.listen(PORT, () => {
  console.log(`Heritage Music API running at http://localhost:${PORT}`)
  console.log(`Payments: ${razorpayMock ? 'MOCK MODE (set RAZORPAY_KEY_ID/RAZORPAY_KEY_SECRET for live test keys)' : 'Razorpay test mode'}`)
})