import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../api.js'
import ProductCard from '../components/ProductCard.jsx'

const COLLECTION_META = {
  beginner: { name: 'Beginner', eyebrow: 'FOR FIRST SONGS', blurb: 'Everything you need to start. Comfortable instruments and gear selected for students, learners and first-time players.' },
  'under-10k': { name: 'Guitars under ₹10,000', eyebrow: 'BUDGET HEROES', blurb: 'Affordable acoustic and electric guitars for Indian buyers — quality sound, durable build, honest prices.' },
  'high-end-deals': { name: 'High-end deals', eyebrow: 'LUXURY AT SPECIAL PRICES', blurb: 'Exclusive all-solid acoustics, premium pickups and luxury cases at never-before-seen prices.' },
  travel: { name: 'Travel ready', eyebrow: 'FOR THE ROAD', blurb: 'Portable amps, travel guitars and featherlight cases for musicians who are always on the move.' },
  bestsellers: { name: 'Bestsellers', eyebrow: 'THE GOOD STUFF', blurb: 'The instruments and gear our community keeps coming back for.' },
  'new-arrivals': { name: 'New arrivals', eyebrow: 'FRESH OFF THE BENCH', blurb: 'The latest additions to the Heritage floor — new instruments, new sounds, new reasons to play.' }
}

export default function CategoryPage() {
  const { slug } = useParams()
  const [products, setProducts] = useState([])
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    window.scrollTo(0, 0)
    const collection = COLLECTION_META[slug]
    if (collection) {
      setCategory({ slug, name: collection.name, eyebrow: collection.eyebrow, description: collection.blurb })
      api.get(`/products?collection=${slug}`).then(setProducts).catch(() => setProducts([])).finally(() => setLoading(false))
    } else {
      api.get(`/categories`).then(cats => {
        const found = cats.flatMap(c => [c, ...(c.children || [])]).find(c => c.slug === slug)
        setCategory(found || null)
        return found ? api.get(`/products?category=${slug}`) : []
      }).then(setProducts).catch(() => setProducts([])).finally(() => setLoading(false))
    }
  }, [slug])

  return (
    <section className="section page">
      <nav className="breadcrumb"><Link to="/">Home</Link> <span>/</span> <span>{category ? category.name : 'Loading…'}</span></nav>
      <div className="page-heading">
        <p className="eyebrow">{category ? (category.eyebrow || 'COLLECTION') : '…'}</p>
        <h1>{category ? category.name : 'Loading…'}</h1>
        {category?.description && <p className="page-blurb">{category.description}</p>}
      </div>
      <p className="results-count">{loading ? 'Loading instruments…' : `${products.length} instrument${products.length === 1 ? '' : 's'}`}</p>
      <div className="product-grid">
        {products.map(p => <ProductCard key={p.slug} product={p} />)}
      </div>
      {!loading && products.length === 0 && <p className="empty-state">Nothing here yet — check back soon.</p>}
    </section>
  )
}