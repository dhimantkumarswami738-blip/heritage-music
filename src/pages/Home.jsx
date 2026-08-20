import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, formatPrice } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'
import ProductCard from '../components/ProductCard.jsx'

const HERO_SLIDES = [
  { eyebrow: 'THE SOUND OF HOME · 01 / 03', title: <>Find the<br /><em>instrument</em><br />that finds you.</>, desc: 'Hand-picked guitars, keys, strings and stories for the curious musician.' },
  { eyebrow: 'FESTIVE SAVINGS · 02 / 03', title: <>Guitars under<br /><em>₹10,000</em><br />are in season.</>, desc: 'Curated beginner and student guitars that punch far above their price.' },
  { eyebrow: 'THE LIVE ROOM · 03 / 03', title: <>Stage ready,<br /><em>studio</em><br />humble.</>, desc: 'Amps, drum kits and recording gear tested by people who actually play.' }
]

const FILTERS = [
  { label: 'All', test: () => true },
  { label: 'Acoustic', test: c => /acoustic|classical/.test(c) },
  { label: 'Electric', test: c => /electric|bass|amplifier|pickup/.test(c) },
  { label: 'Studio', test: c => /keyboard|headphone|saxophone|electronic-drum/.test(c) },
  { label: 'Accessories', test: c => /string|accessor|harmonica|flute/.test(c) }
]

const COLLECTIONS = [
  { slug: 'beginner', name: "The beginner's shelf", tag: 'For first songs' },
  { slug: 'under-10k', name: 'Guitars under ₹10,000', tag: 'Budget heroes' },
  { slug: 'high-end-deals', name: 'High-end deals', tag: 'Luxury at special prices' },
  { slug: 'travel', name: 'Travel ready', tag: 'For the road' },
  { slug: 'bestsellers', name: 'Bestsellers', tag: 'The good stuff' },
  { slug: 'new-arrivals', name: 'New arrivals', tag: 'Fresh off the bench' }
]

const TESTIMONIALS = [
  { text: 'The guitar arrived beautifully set up, and the team answered every question with genuine patience. It feels like buying from people who actually play.', author: 'Rhea Menon, Bengaluru' },
  { text: 'I found exactly the sound I had been looking for. The care in the packaging and the follow-up made the whole experience memorable.', author: 'Arjun Nair, Kochi' },
  { text: 'A rare music shop that makes the details feel human. My keyboard was tuned, packed, and on my desk in two days.', author: 'Maya Shah, Pune' },
  { text: 'Heritage helped me choose my first instrument without making me feel like I needed to know everything already.', author: 'Kabir Verma, Delhi' }
]

export default function Home() {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [heroIndex, setHeroIndex] = useState(0)
  const [filter, setFilter] = useState('All')
  const [quoteIndex, setQuoteIndex] = useState(0)
  const { user } = useAuth()

  useEffect(() => {
    api.get('/categories').then(setCategories).catch(() => {})
    api.get('/products').then(setProducts).catch(() => {})
  }, [])

  const topLevel = useMemo(() => categories.filter(c => !c.parent), [categories])
  const filtered = useMemo(() => products.filter(p => FILTERS.find(f => f.label === filter).test(p.category)), [products, filter])
  const featured = useMemo(() => products.filter(p => p.featured).slice(0, 6), [products])
  const hero = HERO_SLIDES[heroIndex]

  return (
    <>
      <section className="hero" aria-label="Featured promotion">
        <div className="hero-image" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1550291652-6ea9114a47b1?auto=format&fit=crop&w=1600&q=85)' }} />
        <div className="hero-shade" />
        <div className="hero-copy">
          <p className="eyebrow">{hero.eyebrow}</p>
          <h1>{hero.title}</h1>
          <p className="hero-description">{hero.desc}</p>
          <Link className="button button-light" to="/shop">Explore the collection <span>↗</span></Link>
        </div>
        <div className="hero-bottom">
          <span>Scroll to explore</span><span className="hero-line"></span><span>Instrument shop / 2026</span>
        </div>
        <button className="hero-arrow hero-prev" aria-label="Previous slide" onClick={() => setHeroIndex((heroIndex + 2) % 3)}>←</button>
        <button className="hero-arrow hero-next" aria-label="Next slide" onClick={() => setHeroIndex((heroIndex + 1) % 3)}>→</button>
      </section>

      <section className="intro-band">
        <p className="eyebrow">THE HERITAGE EDIT</p>
        <h2>Made to be played.<br /><span>Built to be remembered.</span></h2>
        <p>From first chords to encore nights, we bring together dependable gear and the small details that make making music feel magical.</p>
      </section>

      <section className="section" id="shop">
        <div className="section-heading">
          <div><p className="eyebrow">START HERE</p><h2>Shop by category</h2></div>
          <Link className="text-link" to="/shop">View all categories <span>↗</span></Link>
        </div>
        <div className="category-grid">
          {topLevel.slice(0, 6).map((cat, i) => (
            <Link className={`category-card${i === 0 ? ' category-card-tall' : ''}`} key={cat.slug} to={`/category/${cat.slug}`}>
              <img src={cat.image} alt={cat.name} />
              <div><span>{String(i + 1).padStart(2, '0')}</span><h3>{cat.name}</h3></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section collections" id="collections">
        <div className="section-heading">
          <div><p className="eyebrow">CURATED FOR YOUR NEXT CHAPTER</p><h2>Featured collections</h2></div>
        </div>
        <div className="collection-rail">
          {COLLECTIONS.map(c => (
            <Link className="collection-card" key={c.slug} to={`/category/${c.slug}`}>
              <div><p>{c.tag}</p><h3>{c.name}</h3><span>Shop now ↗</span></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section" id="videos">
        <div className="section-heading">
          <div><p className="eyebrow">SHOP BY VIDEO</p><h2>Watch before you play</h2></div>
        </div>
        <div className="video-rail">
          {featured.map(p => (
            <Link className="video-card" key={p.slug} to={`/product/${p.slug}`}>
              <div className="video-thumb"><img src={p.image} alt={p.name} /><span className="play-badge">▶</span></div>
              <p>{p.tag}</p><h3>{p.name}</h3><span>{formatPrice(p.price)}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="products section" id="products">
        <div className="section-heading">
          <div><p className="eyebrow">THE GOOD STUFF</p><h2>Popular right now</h2></div>
          <div className="filter-tabs">
            {FILTERS.map(f => (
              <button key={f.label} className={filter === f.label ? 'active' : ''} onClick={() => setFilter(f.label)}>{f.label}</button>
            ))}
          </div>
        </div>
        <div className="product-grid">{filtered.map(p => <ProductCard key={p.slug} product={p} />)}</div>
      </section>

      <section className="manifesto">
        <div className="manifesto-image">
          <img src="https://images.unsplash.com/photo-1525201548942-d8732f6617a0?auto=format&fit=crop&w=1400&q=85" alt="Musician holding an acoustic guitar" />
        </div>
        <div className="manifesto-copy">
          <p className="eyebrow">CURATING THE BEST IN MUSIC GEAR</p>
          <h2>Good music starts with a good feeling.</h2>
          <p>Every product at Heritage is tested, refined, and approved by musicians. We look for the pieces that disappear in your hands and leave only the music behind.</p>
          <button className="button button-dark" onClick={() => window.open('https://www.youtube.com/watch?v=p91fgmbe_PI', '_blank')}>Play our story <span>▶</span></button>
        </div>
      </section>

      <section className="section testimonials">
        <div className="section-heading">
          <div><p className="eyebrow">FROM THE LISTENERS</p><h2>Words from the room</h2></div>
          <div className="rail-controls">
            <button aria-label="Previous testimonial" onClick={() => setQuoteIndex((quoteIndex + 3) % 4)}>←</button>
            <button aria-label="Next testimonial" onClick={() => setQuoteIndex((quoteIndex + 1) % 4)}>→</button>
          </div>
        </div>
        <div className="testimonial-stage">
          <p className="quote-mark">“</p>
          <blockquote>{TESTIMONIALS[quoteIndex].text}</blockquote>
          <div className="quote-footer">
            <span>— {TESTIMONIALS[quoteIndex].author}</span>
            <span>{String(quoteIndex + 1).padStart(2, '0')} / 04</span>
          </div>
        </div>
      </section>

      <section className="story section" id="story">
        <div className="story-copy">
          <p className="eyebrow">A LITTLE ABOUT US</p>
          <h2>For the love of<br /><em>the long way round.</em></h2>
          <p>What began with a tiny room, two guitars and a stubborn belief in better gear has grown into a home for musicians across India.</p>
          <a className="text-link" href="#newsletter">Read our story <span>↗</span></a>
        </div>
        <div className="story-image">
          <img src="https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=1200&q=85" alt="Classical musician playing piano" />
          <span>HERITAGE<br />MUSIC<br /><small>EST. 2012</small></span>
        </div>
      </section>

      <Newsletter />
    </>
  )
}

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  return (
    <section className="newsletter" id="newsletter">
      <div><p className="eyebrow">THE MONTHLY LISTEN</p><h2>Good things,<br /><em>occasionally.</em></h2></div>
      <form id="newsletterForm" onSubmit={async e => {
        e.preventDefault()
        try {
          await api.post('/newsletter', { email })
          setMessage('You’re on the list. See you in your inbox.')
          setEmail('')
        } catch (err) { setMessage(err.message) }
      }}>
        <label htmlFor="email">New gear, old records, and notes from the road.</label>
        <div className="email-row">
          <input id="email" type="email" placeholder="Your email address" required value={email} onChange={e => setEmail(e.target.value)} />
          <button type="submit" aria-label="Subscribe">↗</button>
        </div>
        <p className="form-message" aria-live="polite">{message}</p>
      </form>
    </section>
  )
}