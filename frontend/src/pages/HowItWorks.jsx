import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Store, ArrowLeft, Search, ShoppingBag, Truck, Banknote, ShieldCheck, Zap,
  UserPlus, BadgeCheck, PackagePlus, Bell,
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

const paths = {
  buyer: {
    label: 'I want to buy',
    title: 'Order from a shop in your city',
    intro: 'Find what you need nearby and pay only when it reaches your door.',
    cta: { text: 'Browse products', to: '/shop' },
    steps: [
      { icon: Search, title: 'Search', text: 'Browse sellers and their products in your city, or filter by category and city.' },
      { icon: ShoppingBag, title: 'Place an order', text: 'Log in as a buyer and order the item you like.' },
      { icon: Truck, title: 'Get your items', text: 'The seller is notified directly and delivers to you.' },
    ],
  },
  seller: {
    label: 'I want to sell',
    title: 'Put your shop in front of local buyers',
    intro: 'Register once, list your products, and receive orders from your own city.',
    cta: { text: 'Become a seller', to: '/seller-register' },
    steps: [
      { icon: UserPlus, title: 'Register your shop', text: 'Fill in your shop details on the seller registration page.' },
      { icon: BadgeCheck, title: 'Get approved', text: 'Your shop goes public only after the admin approves it.' },
      { icon: PackagePlus, title: 'Add products', text: 'List your products with image, price and category.' },
      { icon: Bell, title: 'Receive orders', text: 'Every new order shows up in your orders page right away.' },
    ],
  },
}

const benefits = [
  { icon: Banknote, title: 'Cash on Delivery', text: 'Pay when you receive your order.' },
  { icon: ShieldCheck, title: 'Verified sellers', text: 'Sellers are listed only after admin approval.' },
  { icon: Zap, title: 'Local and fast', text: 'From your own city, with quick delivery.' },
]

function HowItWorks() {
  const navigate = useNavigate()
  const [active, setActive] = useState('buyer')
  const path = paths[active]

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const navLinkClass =
    'text-sm font-semibold text-slate-700 hover:text-blue-700 transition-colors cursor-pointer'

  return (
    <div className='min-h-screen w-full bg-slate-50 text-slate-900'>

      {/* Top bar */}
      <header className='anim-fade-down sticky top-3 z-50 mx-3 sm:mx-6'>
        <nav className='mx-auto flex max-w-7xl items-center justify-between rounded-2xl bg-white/90 px-5 py-3 shadow-lg shadow-slate-900/10 backdrop-blur'>
          <button onClick={() => navigate('/')} className='flex cursor-pointer items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600'>
            <span className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-950 text-white'>
              <Store size={20} />
            </span>
            <span className='text-lg font-bold text-blue-950'>
              Local<span className='text-blue-600'>Mart</span>
            </span>
          </button>

          <div className='hidden items-center gap-8 md:flex'>
            <button onClick={() => navigate('/')} className={navLinkClass}>Home</button>
            <button onClick={() => navigate('/shop')} className={navLinkClass}>Products</button>
            <button onClick={() => navigate('/sellers')} className={navLinkClass}>Sellers</button>
            <button onClick={() => navigate('/how-it-works')} className={navLinkClass + ' !text-blue-700'}>How it works</button>
          </div>

          <button
            onClick={() => navigate('/')}
            className='flex cursor-pointer items-center gap-2 rounded-lg text-sm font-semibold text-blue-950 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600'
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>
        </nav>
      </header>

      {/* Hero */}
      <section className='mx-auto grid max-w-7xl items-center gap-12 px-6 pb-16 pt-16 md:px-10 lg:grid-cols-[1.15fr_1fr]'>
        <div>
          <h1 className='anim-fade-up text-4xl font-extrabold leading-[1.1] tracking-tight text-blue-950 md:text-6xl'>
            Shop on your street, now online.
          </h1>
          <p
            style={{ animationDelay: '150ms' }}
            className='anim-fade-up mt-5 max-w-lg text-lg leading-relaxed text-slate-600'
          >
            LocalMart connects neighborhood shops with buyers in the same city. No couriers from far away, no online payment needed.
          </p>
        </div>

        {/* Sample order notification (animation bahar, rotate andar, taake rotate na hate) */}
        <div style={{ animationDelay: '300ms' }} className='anim-zoom-in mx-auto w-full max-w-sm'>
          <div className='rotate-1 rounded-3xl bg-white p-5 shadow-xl shadow-blue-950/10 ring-1 ring-slate-200 transition-transform duration-300 hover:rotate-0'>
            <div className='flex items-center gap-3'>
              <span className='relative flex h-10 w-10 items-center justify-center rounded-full bg-blue-950 text-white'>
                <Bell size={18} />
                <span className='absolute -right-0.5 -top-0.5 h-3 w-3 animate-ping rounded-full bg-sky-400' />
                <span className='absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-sky-500' />
              </span>
              <div>
                <p className='text-sm font-bold text-blue-950'>New order received</p>
                <p className='text-xs text-slate-500'>Just now</p>
              </div>
            </div>
            <div className='mt-4 flex items-center justify-between rounded-2xl bg-slate-50 p-4'>
              <div>
                <p className='text-sm font-semibold text-slate-800'>2 items</p>
                <p className='text-xs text-slate-500'>Deliver to buyer in your city</p>
              </div>
              <p className='text-lg font-extrabold text-blue-950'>Rs 1,450</p>
            </div>
            <p className='mt-3 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800'>
              <Banknote size={14} /> Cash on Delivery
            </p>
          </div>
        </div>
      </section>

      {/* Buyer / seller flow */}
      <section className='mx-auto max-w-7xl px-6 md:px-10'>
        <div
          role='tablist'
          aria-label='Choose your role'
          className='inline-flex rounded-full bg-slate-200/70 p-1'
        >
          {Object.entries(paths).map(([key, p]) => (
            <button
              key={key}
              role='tab'
              aria-selected={active === key}
              onClick={() => setActive(key)}
              className={`cursor-pointer rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                active === key ? 'bg-blue-950 text-white shadow' : 'text-slate-600 hover:text-blue-950'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className='mt-10 grid gap-10 lg:grid-cols-[1fr_340px]'>
          {/* Timeline: key badalne par steps dobara animate hote hain */}
          <ol
            key={active}
            role='tabpanel'
            className='rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-10'
          >
            {path.steps.map(({ icon: Icon, title, text }, i) => (
              <li
                key={title}
                style={{ animationDelay: i * 120 + 'ms' }}
                className='anim-fade-up relative flex gap-5 pb-10 last:pb-0'
              >
                {i < path.steps.length - 1 && (
                  <span aria-hidden className='absolute left-6 top-14 bottom-0 w-px -translate-x-1/2 bg-blue-200' />
                )}
                <span className='z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-800 ring-4 ring-white'>
                  <Icon size={22} />
                </span>
                <div className='pt-1'>
                  <p className='text-sm font-semibold text-blue-600'>Step {i + 1}</p>
                  <h3 className='text-xl font-bold text-blue-950'>{title}</h3>
                  <p className='mt-1 max-w-md leading-relaxed text-slate-600'>{text}</p>
                </div>
              </li>
            ))}
          </ol>

          {/* Side panel */}
          <aside
            key={active + '-side'}
            className='anim-fade-in h-fit rounded-3xl bg-blue-950 p-8 text-white lg:sticky lg:top-28'
          >
            <h2 className='text-2xl font-extrabold leading-snug'>{path.title}</h2>
            <p className='mt-3 leading-relaxed text-blue-100/80'>{path.intro}</p>
            <button
              onClick={() => navigate(path.cta.to)}
              className='mt-8 w-full cursor-pointer rounded-xl bg-white px-6 py-3 text-sm font-bold text-blue-950 transition hover:-translate-y-0.5 hover:bg-sky-100 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'
            >
              {path.cta.text}
            </button>
          </aside>
        </div>
      </section>

      {/* Benefits */}
      <section className='mx-auto mt-20 max-w-7xl px-6 pb-20 md:px-10'>
        <Reveal>
          <h2 className='text-2xl font-extrabold text-blue-950 md:text-3xl'>Why people use LocalMart</h2>
        </Reveal>
        <div className='mt-8 grid gap-8 border-t border-slate-200 pt-8 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-slate-200'>
          {benefits.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 120} className='sm:px-8 sm:first:pl-0 sm:last:pr-0'>
              <Icon size={24} className='text-blue-600' />
              <p className='mt-3 text-lg font-bold text-blue-950'>{title}</p>
              <p className='mt-1 text-slate-600'>{text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default HowItWorks