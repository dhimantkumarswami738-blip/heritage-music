# Heritage Music — Full E-commerce Store

A full-stack e-commerce site for Heritage Music, built to match the structure and features of procraftindia.com: mega-menu catalog, product pages, search, wishlist, accounts, cart, Razorpay checkout and order tracking.

## Stack
- **Frontend:** React 18 + Vite + React Router
- **Backend:** Node.js + Express + SQLite (better-sqlite3)
- **Payments:** Razorpay (test mode, with automatic mock fallback when no keys are set)

## Quick start

```bash
# install dependencies (frontend + backend)
npm install
cd server && npm install && cd ..

# run both dev servers (API on :4000, Vite on :5173)
npm run dev:all
```

Open http://localhost:5173

### Production build
```bash
npm run build        # builds frontend into dist/
npm start            # Express serves dist/ + API on :4000
```
Open http://localhost:4000

## Razorpay test keys (optional)
Create a test app at https://dashboard.razorpay.com → Keys, then:

```bash
# server/.env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxx
```

Without keys the server runs in **mock payment mode** — checkout skips the Razorpay modal and marks orders as paid so you can test the full flow locally.

## Commands
| Command | What it does |
| --- | --- |
| `npm run dev` | Frontend dev server only |
| `npm run dev:server` | API server only |
| `npm run dev:all` | Both together |
| `npm run build` | Production frontend build |
| `npm start` | Serve built frontend + API |
| `cd server && npm run seed` | Reset & reseed database |

## Project structure
```
├── index.html            # Vite entry
├── src/
│   ├── components/       # Header, MegaMenu, Search, CartDrawer, Footer, ProductCard
│   ├── context/          # Auth, Cart, Toast providers
│   ├── pages/            # Home, Category, Product, Cart, Checkout, Order, Track, Account, Wishlist, Login/Register
│   └── api.js            # API client + auth token handling
├── server/
│   ├── server.js         # Express API (auth, products, orders, razorpay, newsletter)
│   ├── db.js             # SQLite schema
│   └── seed.js           # Seed data (19 categories, 26 products)
```

## Features implemented
- Mega-menu navigation over 8 top-level categories with subcategories
- Live search with autocomplete suggestions
- Product catalog with category + curated collection pages (Beginner, Under ₹10,000, High-end deals, Travel, Bestsellers, New arrivals)
- Product detail pages with specs, related items, wishlist
- Account registration/login (JWT), personal wishlist, order history
- Cart (drawer + full page) persisted in localStorage
- Checkout with Razorpay test payments + mock fallback
- Order confirmation with status timeline + public order tracking by email + order number
- Newsletter signup
- Responsive layout with the original Heritage design language (paper/ink/rust/brass)