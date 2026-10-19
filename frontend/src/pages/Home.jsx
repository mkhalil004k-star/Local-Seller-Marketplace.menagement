import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import {
  Store, Menu, X, ArrowRight, MapPin, Package, Users, ChevronLeft, ChevronRight,
  Search, ShoppingBag, Truck, LogIn, BadgeCheck, Banknote, ShieldCheck, Zap, ArrowLeftRight,
} from 'lucide-react'
import Footer from '../component/Footer'

// Scroll karne par element halka sa upar aa kar nazar aata hai
function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true)
          io.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{ '--d': delay + 'ms' }}
      className={'reveal ' + (show ? 'show ' : '') + className}
    >
      {children}
    </div>
  )
}

// Number 0 se value tak ginta hai
function CountUp({ value }) {
  const ref = useRef(null)
  const [n, setN] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      io.disconnect()
      const start = performance.now()
      const tick = (t) => {
        const p = Math.min((t - start) / 1200, 1)
        setN(Math.round(value * p))
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    })
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [value])

  return <span ref={ref}>{n}</span>
}

function Home() {

  const navigate = useNavigate()
  const base = import.meta.env.VITE_beckend_base_URL

  const [products, setProducts] = useState([])
  const [sellers, setSellers] = useState([])
  const [menuOpen, setMenuOpen] = useState(false)
  const [loadError, setLoadError] = useState(false)

  // Search bar values
  const [category, setCategory] = useState('')
  const [city, setCity] = useState('')

  const productRail = useRef(null)
  const sellerRail = useRef(null)

  async function getData() {
    try {
      const productRes = await axios.get(base + '/product/public')
      setProducts(Array.isArray(productRes.data?.products) ? productRes.data.products : [])
    } catch (error) {
      console.error('Failed to load products', error)
      setLoadError(true)
    }

    try {
      const sellerRes = await axios.get(base + '/sellers/public')
      setSellers(Array.isArray(sellerRes.data?.data) ? sellerRes.data.data : [])
    } catch (error) {
      console.error('Failed to load sellers', error)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  function scrollTo(id) {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  // Doosre page par jane ke liye (mobile menu bhi band ho jata hai)
  function goTo(path) {
    navigate(path)
    setMenuOpen(false)
  }

  function slide(ref, dir) {
    if (ref.current) ref.current.scrollBy({ left: dir * 320, behavior: 'smooth' })
  }

  // Search dabane par category aur city ke saath /shop page khulta hai
  function handleSearch(e) {
    e.preventDefault()
    navigate('/shop?category=' + encodeURIComponent(category) + '&city=' + encodeURIComponent(city))
  }

  // Lists built from real data
  const totalCities = new Set(sellers.map((s) => s.city).filter(Boolean)).size
  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))]
  const cities = [...new Set(sellers.map((s) => s.city).filter(Boolean))]

  // Each category tile uses the image of its first product
  const categoryTiles = categories.map((c) => ({
    name: c,
    img: products.find((p) => p.category === c && p.imageUrl)?.imageUrl || '',
  }))

  const navLinkClass =
    'text-sm font-semibold text-slate-700 hover:text-blue-700 transition-colors cursor-pointer'

  const hideScroll = '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden'

  return (
    <div className='min-h-screen w-full bg-slate-50 text-slate-900'>

      {/* ================= Navbar (floating white) ================= */}
      <header className='anim-fade-down sticky top-3 z-50 mx-3 sm:mx-6'>
        <nav className='mx-auto max-w-7xl rounded-2xl bg-white px-5 py-3 shadow-lg shadow-slate-900/10'>
          <div className='flex items-center justify-between'>

            <button onClick={() => scrollTo('home')} className='flex cursor-pointer items-center gap-3'>
              <span className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-950 text-white'>
                <Store size={20} />
              </span>
              <span className='text-lg font-bold text-blue-950'>
                Local<span className='text-blue-600'>Mart</span>
              </span>
            </button>

            <div className='hidden items-center gap-8 md:flex'>
              <button onClick={() => scrollTo('home')} className={navLinkClass}>Home</button>
              <button onClick={() => navigate('/shop')} className={navLinkClass}>Products</button>
              <button onClick={() => navigate('/sellers')} className={navLinkClass}>Sellers</button>
              <button onClick={() => navigate('/how-it-works')} className={navLinkClass}>How it works</button>
            </div>

            <div className='hidden items-center gap-3 md:flex'>
              <button
                onClick={() => navigate('/login')}
                className='flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-blue-950 hover:bg-slate-100'
              >
                <LogIn size={16} />
                Login
              </button>
              <button
                onClick={() => navigate('/seller-register')}
                className='flex cursor-pointer items-center gap-2 rounded-xl bg-blue-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800'
              >
                <ArrowLeftRight size={16} />
                Switch to Seller
              </button>
            </div>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className='cursor-pointer text-blue-950 md:hidden'
              aria-label='Menu'
            >
              {menuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>

          {menuOpen && (
            <div className='anim-fade-in mt-4 flex flex-col gap-4 border-t border-slate-100 pt-4 md:hidden'>
              <button onClick={() => scrollTo('home')} className={navLinkClass + ' text-left'}>Home</button>
              <button onClick={() => goTo('/shop')} className={navLinkClass + ' text-left'}>Products</button>
              <button onClick={() => goTo('/sellers')} className={navLinkClass + ' text-left'}>Sellers</button>
              <button onClick={() => goTo('/how-it-works')} className={navLinkClass + ' text-left'}>How it works</button>
              <div className='flex gap-3 pt-1'>
                <button
                  onClick={() => navigate('/login')}
                  className='flex-1 cursor-pointer rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-blue-950'
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/seller-register')}
                  className='flex-1 cursor-pointer rounded-xl bg-blue-900 py-2.5 text-sm font-semibold text-white'
                >
                  Switch to Seller
                </button>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* ================= Hero ================= */}
      <section
        id='home'
        className='relative -mt-24 scroll-mt-0 overflow-hidden bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 pb-10 pt-40'
      >
        <div className='blob-float pointer-events-none absolute -right-24 top-10 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl' />
        <div
          style={{ animationDelay: '-4s' }}
          className='blob-float pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-sky-400/10 blur-3xl'
        />

        <div className='relative mx-auto max-w-7xl px-6 md:px-10'>
          <h1 className='anim-fade-up max-w-3xl text-4xl font-extrabold leading-tight text-white md:text-6xl'>
            Shop from sellers in your city
          </h1>
          <p
            style={{ animationDelay: '150ms' }}
            className='anim-fade-up mt-5 max-w-xl text-base text-slate-300 md:text-lg'
          >
            Browse products from neighborhood shops, order what you like, and the seller is notified right away.
          </p>

          <button
            style={{ animationDelay: '300ms' }}
            onClick={() => navigate('/shop')}
            className='anim-fade-up mt-7 flex cursor-pointer items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-blue-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-100 active:scale-95'
          >
            Browse products
            <ArrowRight size={16} />
          </button>

          {/* Search bar */}
          <form
            style={{ animationDelay: '450ms' }}
            onSubmit={handleSearch}
            className='anim-fade-up mt-10 flex max-w-3xl flex-col gap-2 rounded-3xl bg-white p-2 shadow-2xl md:flex-row md:items-center'
          >
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className='flex-1 cursor-pointer rounded-2xl bg-transparent px-5 py-4 text-base font-medium text-slate-800 outline-none'
            >
              <option value=''>All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <div className='hidden h-8 w-px bg-slate-200 md:block' />

            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className='flex-1 cursor-pointer rounded-2xl bg-transparent px-5 py-4 text-base font-medium text-slate-800 outline-none'
            >
              <option value=''>All cities</option>
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <button
              type='submit'
              className='flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-blue-900 px-8 py-4 text-base font-semibold text-white transition hover:bg-blue-800 active:scale-95'
            >
              <Search size={18} />
              Search
            </button>
          </form>

          {/* Category tiles */}
          {categoryTiles.length > 0 && (
            <div
              style={{ animationDelay: '600ms' }}
              className={'anim-fade-up mt-10 flex gap-4 overflow-x-auto pb-2 ' + hideScroll}
            >
              {categoryTiles.map((c) => (
                <button
                  key={c.name}
                  onClick={() => navigate('/shop?category=' + encodeURIComponent(c.name))}
                  className='group relative h-40 w-48 shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-white/30 bg-blue-800 text-left'
                >
                  {c.img && (
                    <img src={c.img} alt={c.name} className='absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110' />
                  )}
                  <div className='absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-950/40 to-transparent' />
                  <div className='absolute bottom-3 left-4 right-4'>
                    <p className='truncate text-base font-bold text-white'>{c.name}</p>
                    <p className='flex items-center gap-1 text-xs text-slate-200'>View <ArrowRight size={12} /></p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className='mx-auto max-w-7xl px-6 md:px-10'>

        {/* ================= Products (carousel) ================= */}
        <section id='products' className='scroll-mt-28 pt-16'>
          <Reveal>
            <div className='mb-6 flex items-end justify-between gap-4'>
              <div>
                <p className='text-xs font-semibold uppercase tracking-widest text-slate-500'>Fresh on the market</p>
                <h2 className='mt-1 text-3xl font-extrabold text-blue-950 md:text-4xl'>Newly Listed</h2>
              </div>
              <div className='flex items-center gap-3'>
                <button
                  onClick={() => navigate('/shop')}
                  className='mr-2 hidden cursor-pointer text-sm font-semibold text-blue-700 hover:underline sm:block'
                >
                  View all
                </button>
                <button onClick={() => slide(productRail, -1)} className='flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white transition hover:bg-slate-100 active:scale-90' aria-label='Previous'>
                  <ChevronLeft size={20} />
                </button>
                <button onClick={() => slide(productRail, 1)} className='flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white transition hover:bg-slate-100 active:scale-90' aria-label='Next'>
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </Reveal>

          {products.length === 0 && (
            <div className='rounded-2xl border border-dashed border-slate-300 bg-white py-14 text-center'>
              <Package className='mx-auto mb-2 text-slate-300' size={32} />
              <p className='text-slate-500'>
                {loadError
                  ? "Products couldn't be loaded. Try again later."
                  : 'No products yet'}
              </p>
            </div>
          )}

          <div ref={productRail} className={'flex snap-x gap-5 overflow-x-auto pb-4 ' + hideScroll}>
            {products.map((p, i) => (
              <Reveal key={p._id} delay={Math.min(i, 5) * 80} className='shrink-0 snap-start'>
                <div className='group relative h-[26rem] w-72 overflow-hidden rounded-3xl bg-blue-950 shadow-lg transition-transform duration-300 hover:-translate-y-2'>
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.title} className='absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105' />
                  ) : (
                    <div className='absolute inset-0 flex items-center justify-center text-sm text-blue-300'>No image</div>
                  )}
                  <div className='absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-950/60 to-transparent' />

                  <div className='absolute left-4 top-4 flex gap-2'>
                    <span className='rounded-full bg-white px-3 py-1 text-xs font-bold text-blue-950'>NEW</span>
                    {p.category && (
                      <span className='rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur'>{p.category}</span>
                    )}
                  </div>

                  <div className='absolute inset-x-0 bottom-0 p-5 text-white'>
                    <div className='flex items-center gap-2 text-sm font-semibold'>
                      <span className='flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-bold text-blue-950'>
                        {(p.seller?.name || 'U')[0].toUpperCase()}
                      </span>
                      {p.seller?.name || 'Unknown'}
                      <BadgeCheck size={16} className='text-sky-400' />
                    </div>
                    <h3 className='mt-3 truncate text-lg font-bold'>{p.title}</h3>
                    <p className='text-2xl font-extrabold'>Rs {p.price}</p>
                    {p.seller?.city && (
                      <p className='mt-1 flex items-center gap-1 text-sm text-slate-300'>
                        <MapPin size={14} /> {p.seller.city}
                      </p>
                    )}
                    <button
                      onClick={() => navigate('/product/' + p._id)}
                      className='mt-4 w-full cursor-pointer rounded-xl bg-blue-900 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 active:scale-95'
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ================= Sellers (carousel) ================= */}
        <section id='sellers' className='scroll-mt-28 pt-16'>
          <Reveal>
            <div className='mb-6 flex items-end justify-between gap-4'>
              <div>
                <p className='text-xs font-semibold uppercase tracking-widest text-slate-500'>Shops in your city</p>
                <h2 className='mt-1 text-3xl font-extrabold text-blue-950 md:text-4xl'>Sellers</h2>
              </div>
              <div className='flex items-center gap-3'>
                <button
                  onClick={() => navigate('/sellers')}
                  className='mr-2 hidden cursor-pointer text-sm font-semibold text-blue-700 hover:underline sm:block'
                >
                  View all
                </button>
                <button onClick={() => slide(sellerRail, -1)} className='flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white transition hover:bg-slate-100 active:scale-90' aria-label='Previous'>
                  <ChevronLeft size={20} />
                </button>
                <button onClick={() => slide(sellerRail, 1)} className='flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white transition hover:bg-slate-100 active:scale-90' aria-label='Next'>
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </Reveal>

          {sellers.length === 0 && (
            <div className='rounded-2xl border border-dashed border-slate-300 bg-white py-14 text-center'>
              <Users className='mx-auto mb-2 text-slate-300' size={32} />
              <p className='text-slate-500'>No sellers yet</p>
            </div>
          )}

          <div ref={sellerRail} className={'flex snap-x gap-5 overflow-x-auto pb-4 ' + hideScroll}>
            {sellers.map((s, i) => (
              <Reveal key={s._id} delay={Math.min(i, 5) * 80} className='shrink-0 snap-start'>
                <div
                  onClick={() => navigate('/sellers/' + s._id)}
                  className='w-72 cursor-pointer overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg'
                >
                  <div className='relative h-40 bg-slate-200'>
                    {s.imageUrl ? (
                      <img src={s.imageUrl} alt={s.shopName} className='h-full w-full object-cover' />
                    ) : (
                      <div className='flex h-full items-center justify-center text-slate-400'>No image</div>
                    )}
                    {s.city && (
                      <span className='absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-700'>
                        <MapPin size={12} /> {s.city}
                      </span>
                    )}
                  </div>
                  <div className='p-5'>
                    <h3 className='truncate text-lg font-bold text-blue-950'>{s.shopName}</h3>
                    <p className='mt-1 text-sm text-slate-600'><span className='text-slate-400'>Owner:</span> {s.ownerName}</p>
                    <span className='mt-3 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800'>
                      {s.products?.length || 0} products
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ================= Stats ================= */}
        <section className='grid grid-cols-1 items-center gap-10 pt-20 md:grid-cols-2'>
          <Reveal>
            <div>
              <p className='text-xs font-semibold uppercase tracking-widest text-slate-500'>About us</p>
              <h2 className='mt-2 text-3xl font-extrabold leading-tight text-blue-950 md:text-4xl'>
                A platform that connects local sellers and buyers
              </h2>
              <p className='mt-4 max-w-md leading-relaxed text-slate-600'>
                Our goal is to bring small shops online, so you can easily find what you need in your own city.
              </p>
            </div>
          </Reveal>
          <div className='grid grid-cols-3 gap-4'>
            {[
              { label: 'Sellers', value: sellers.length },
              { label: 'Products', value: products.length },
              { label: 'Cities', value: totalCities },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 120}>
                <div className='rounded-2xl bg-white p-5 shadow-md transition hover:-translate-y-1 hover:shadow-lg'>
                  <p className='text-3xl font-extrabold text-blue-950'><CountUp value={s.value} /></p>
                  <p className='mt-1 text-sm text-slate-500'>{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </div>

      {/* ================= Why choose us / How it works ================= */}
      <section id='how' className='mt-20 scroll-mt-24 bg-blue-950 py-16'>
        <div className='mx-auto max-w-7xl px-6 md:px-10'>
          <Reveal>
            <h2 className='text-center text-3xl font-extrabold text-white md:text-4xl'>Why Choose Us</h2>
            <p className='mb-10 mt-2 text-center text-sm text-slate-300'>Just 3 easy steps, and these benefits</p>
          </Reveal>

          <div className='grid grid-cols-1 gap-5 md:grid-cols-3'>
            {[
              { icon: Search, title: 'Search', text: 'Browse sellers and their products in your city.' },
              { icon: ShoppingBag, title: 'Place an order', text: 'Log in and order the item you like.' },
              { icon: Truck, title: 'Get your items', text: 'The seller is notified directly and delivers to you.' },
            ].map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 120}>
                <div className='h-full rounded-2xl bg-white/10 p-6 backdrop-blur transition hover:-translate-y-1 hover:bg-white/15'>
                  <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-sky-300'>
                    <Icon size={24} />
                  </div>
                  <p className='text-xs font-semibold text-sky-300'>Step {i + 1}</p>
                  <h3 className='mt-1 text-lg font-bold text-white'>{title}</h3>
                  <p className='mt-2 text-sm text-slate-300'>{text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className='mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3'>
            {[
              { icon: Banknote, title: 'Cash on Delivery', text: 'Pay when you receive your order.' },
              { icon: ShieldCheck, title: 'Verified sellers', text: 'Sellers are listed only after admin approval.' },
              { icon: Zap, title: 'Local and fast', text: 'From your own city, with quick delivery.' },
            ].map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 120}>
                <div className='flex h-full items-start gap-3 rounded-2xl border border-white/15 p-5 transition hover:-translate-y-1 hover:border-white/30'>
                  <Icon size={22} className='mt-0.5 shrink-0 text-sky-300' />
                  <div>
                    <p className='font-bold text-white'>{title}</p>
                    <p className='mt-1 text-sm text-slate-300'>{text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <div className='mx-auto max-w-7xl px-6 pt-16 md:px-10'>
        <Reveal>
          <div className='rounded-3xl bg-gradient-to-r from-blue-900 to-blue-700 p-8 text-center md:p-12'>
            <h2 className='text-2xl font-extrabold text-white md:text-3xl'>Bring your shop online</h2>
            <p className='mx-auto mt-3 max-w-md text-sm text-blue-100'>
              Become a seller and reach buyers in your city.
            </p>
            <button
              onClick={() => navigate('/seller-register')}
              className='mt-6 cursor-pointer rounded-xl bg-white px-8 py-3 text-sm font-semibold text-blue-950 transition hover:-translate-y-0.5 hover:bg-slate-100 active:scale-95'
            >
              Register now
            </button>
          </div>
        </Reveal>
      </div>

      {/* ================= Footer ================= */}
      <Footer />

    </div>
  )
}

export default Home