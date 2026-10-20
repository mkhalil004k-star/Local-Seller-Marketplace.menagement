import React, { useState } from 'react'
import { useLocation, useNavigate, Navigate } from 'react-router-dom'
import {
  Store, CheckCircle2, Check, Copy, MapPin, Phone, User, Home, Briefcase,
  Package, Banknote, ShieldCheck, ShoppingBag, UserCircle, ClipboardCheck,
  Truck, PackageCheck, CalendarDays, ClipboardList,
} from 'lucide-react'

function OrderSuccess() {
  const navigate = useNavigate()
  const { state } = useLocation()

  const [copied, setCopied] = useState(false)

  // Use navigate state first, fall back to sessionStorage (page refresh)
  let order = state
  if (!order) {
    try {
      order = JSON.parse(sessionStorage.getItem('lastOrder'))
    } catch (e) {
      order = null
    }
  }

  // Order ka asal waqt (agar backend se createdAt aaya ho), warna abhi ka waqt
  const [placedAt] = useState(() =>
    order?.createdAt ? new Date(order.createdAt) : new Date()
  )

  // No order data, send the user back to products
  if (!order) return <Navigate to='/products' />

  const qty = Number(order.qty) || 1
  const price = Number(order.price) || 0
  const itemsTotal = price * qty
  const deliveryFee = Number(order.deliveryFee) || 0
  const total = itemsTotal + deliveryFee

  const isOffice = order.label === 'Office'
  const LabelIcon = isOffice ? Briefcase : Home

  const dateText = placedAt.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
  const timeText = placedAt.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })

  function copyOrderId() {
    if (!order.orderId) return
    navigator.clipboard
      ?.writeText(order.orderId)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 1800)
      })
      .catch(() => {})
  }

  // What happens next (My Orders ke status: pending > accepted > delivered)
  const timeline = [
    { icon: ClipboardCheck, title: 'Order placed', text: 'Your order has been sent to the seller.', done: true },
    { icon: PackageCheck, title: 'Seller accepts', text: 'The seller reviews your order. If they cannot fulfil it, you will see their reason in My Orders.', done: false },
    { icon: Truck, title: 'Delivered', text: 'Your order is delivered to your address.', done: false },
    { icon: Banknote, title: 'Pay on delivery', text: 'Pay the total amount in cash when it arrives.', done: false },
  ]

  return (
    <div className='min-h-screen w-full bg-slate-50 text-slate-900'>

      {/* Top bar */}
      <header className='sticky top-3 z-50 mx-3 sm:mx-6'>
        <nav className='mx-auto flex max-w-6xl items-center justify-between rounded-2xl bg-white px-5 py-3 shadow-lg shadow-slate-900/10'>
          <button onClick={() => navigate('/')} className='flex cursor-pointer items-center gap-3'>
            <span className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-950 text-white'>
              <Store size={20} />
            </span>
            <span className='text-lg font-bold text-blue-950'>
              Local<span className='text-blue-600'>Mart</span>
            </span>
          </button>

          <span className='hidden items-center gap-2 text-sm font-medium text-slate-500 sm:flex'>
            <ShieldCheck size={16} className='text-green-600' />
            Order confirmed
          </span>

          <button
            onClick={() => navigate('/MyProfile')}
            className='flex cursor-pointer items-center gap-2 text-sm font-semibold text-blue-950 hover:text-blue-700'
          >
            <UserCircle size={18} />
            My Profile
          </button>
        </nav>
      </header>

      <div className='mx-auto max-w-6xl px-4 pb-16 pt-8 md:px-8'>

        {/* Steps (all completed) */}
        <ol className='mb-8 flex items-center justify-center gap-2 text-xs font-semibold'>
          {['Product', 'Delivery', 'Done'].map((step, i) => (
            <React.Fragment key={step}>
              {i > 0 && <span className='h-px w-6 bg-green-400 sm:w-10' />}
              <li className='flex items-center gap-2 text-green-700'>
                <span className='flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white'>
                  <Check size={14} />
                </span>
                {step}
              </li>
            </React.Fragment>
          ))}
        </ol>

        {/* Hero card */}
        <section className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 px-6 py-10 text-center shadow-xl md:py-14'>
          <div className='pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl' />
          <div className='pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl' />

          <div className='relative'>
            <span className='mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15 ring-8 ring-emerald-500/10'>
              <CheckCircle2 className='text-emerald-400' size={48} />
            </span>

            <h1 className='mt-6 text-3xl font-extrabold text-white md:text-5xl'>Order Placed!</h1>
            <p className='mx-auto mt-3 max-w-lg text-sm text-slate-300 md:text-base'>
              Thank you for shopping with LocalMart. The seller has received your order and will contact you soon.
            </p>

            <div className='mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row'>
              {order.orderId && (
                <button
                  onClick={copyOrderId}
                  title='Copy order ID'
                  className='flex max-w-full cursor-pointer items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/20'
                >
                  <span className='text-slate-300'>Order ID</span>
                  <span className='truncate font-mono'>{order.orderId}</span>
                  {copied ? <Check size={14} className='shrink-0 text-emerald-400' /> : <Copy size={14} className='shrink-0' />}
                </button>
              )}
              <span className='flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur'>
                <CalendarDays size={14} />
                {dateText}, {timeText}
              </span>
            </div>
          </div>
        </section>

        <div className='mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3'>

          {/* ============ Left column ============ */}
          <div className='space-y-6 lg:col-span-2'>

            {/* Order item */}
            <section className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8'>
              <div className='mb-5 flex items-center gap-3'>
                <span className='flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-800'>
                  <ShoppingBag size={20} />
                </span>
                <h2 className='text-lg font-bold text-blue-950'>Your Order</h2>
              </div>

              <div className='flex items-center gap-4 rounded-2xl bg-slate-50 p-4'>
                <div className='relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-slate-200'>
                  {order.image ? (
                    <img
                      src={order.image}
                      alt={order.title}
                      draggable={false}
                      className='h-full w-full object-cover'
                    />
                  ) : (
                    <div className='flex h-full items-center justify-center text-slate-400'>
                      <Package size={28} />
                    </div>
                  )}
                  <span className='absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-950 px-1 text-[10px] font-bold text-white'>
                    {qty}
                  </span>
                </div>

                <div className='min-w-0 flex-1'>
                  <p className='truncate text-base font-bold text-blue-950'>{order.title}</p>
                  <p className='mt-1 text-sm text-slate-500'>
                    Rs {price.toLocaleString()} × {qty}
                  </p>
                </div>

                <p className='text-lg font-extrabold text-blue-950'>
                  Rs {itemsTotal.toLocaleString()}
                </p>
              </div>
            </section>

            {/* Delivery information */}
            <section className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8'>
              <div className='mb-5 flex items-center gap-3'>
                <span className='flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-800'>
                  <MapPin size={20} />
                </span>
                <h2 className='text-lg font-bold text-blue-950'>Delivery Information</h2>
              </div>

              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <div className='flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4'>
                  <User size={18} className='mt-0.5 shrink-0 text-slate-400' />
                  <div className='min-w-0'>
                    <p className='text-xs font-semibold uppercase tracking-wide text-slate-500'>Name</p>
                    <p className='mt-0.5 truncate font-semibold text-blue-950'>{order.fullName}</p>
                  </div>
                </div>

                <div className='flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4'>
                  <Phone size={18} className='mt-0.5 shrink-0 text-slate-400' />
                  <div className='min-w-0'>
                    <p className='text-xs font-semibold uppercase tracking-wide text-slate-500'>Phone</p>
                    <p className='mt-0.5 truncate font-semibold text-blue-950'>{order.phone}</p>
                  </div>
                </div>

                <div className='flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:col-span-2'>
                  <MapPin size={18} className='mt-0.5 shrink-0 text-slate-400' />
                  <div className='min-w-0 flex-1'>
                    <p className='text-xs font-semibold uppercase tracking-wide text-slate-500'>Address</p>
                    <p className='mt-0.5 font-semibold text-blue-950'>
                      {order.address}, {order.city}
                    </p>
                  </div>
                  {order.label && (
                    <span className='flex shrink-0 items-center gap-1.5 rounded-full bg-blue-900 px-3 py-1 text-xs font-semibold text-white'>
                      <LabelIcon size={12} />
                      {order.label}
                    </span>
                  )}
                </div>
              </div>
            </section>

            {/* What happens next */}
            <section className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8'>
              <h2 className='mb-6 text-lg font-bold text-blue-950'>What happens next</h2>

              <ol>
                {timeline.map(({ icon: Icon, title, text, done }, i) => (
                  <li key={title} className='relative flex gap-4 pb-6 last:pb-0'>
                    {i < timeline.length - 1 && (
                      <span
                        className={
                          'absolute left-5 top-10 h-[calc(100%-2.5rem)] w-px ' +
                          (done ? 'bg-green-300' : 'bg-slate-200')
                        }
                      />
                    )}
                    <span
                      className={
                        'relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ' +
                        (done ? 'bg-green-600 text-white' : 'border border-slate-200 bg-white text-slate-400')
                      }
                    >
                      <Icon size={18} />
                    </span>
                    <div className='pt-1'>
                      <p className={'font-semibold ' + (done ? 'text-blue-950' : 'text-slate-600')}>{title}</p>
                      <p className='text-sm text-slate-500'>{text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          {/* ============ Right column: payment ============ */}
          <aside className='h-fit'>
            <div className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
              <h2 className='mb-5 text-lg font-bold text-blue-950'>Payment Summary</h2>

              <div className='space-y-3 text-sm'>
                <div className='flex justify-between text-slate-600'>
                  <span>Items total ({qty})</span>
                  <span className='font-medium text-slate-800'>Rs {itemsTotal.toLocaleString()}</span>
                </div>
                <div className='flex justify-between text-slate-600'>
                  <span>Delivery fee</span>
                  <span className='font-medium text-slate-800'>Rs {deliveryFee.toLocaleString()}</span>
                </div>
              </div>

              <div className='my-5 border-t border-dashed border-slate-200' />

              <div className='flex items-center justify-between'>
                <span className='font-bold text-blue-950'>Total to pay</span>
                <span className='text-2xl font-extrabold text-blue-950'>
                  Rs {total.toLocaleString()}
                </span>
              </div>

              <div className='mt-5 rounded-2xl border-2 border-blue-900 bg-blue-50/50 p-4'>
                <p className='flex items-center gap-2 text-sm font-semibold text-blue-950'>
                  <Banknote size={18} />
                  Cash on Delivery
                </p>
                <p className='mt-1 text-xs text-slate-500'>
                  Please pay Rs {total.toLocaleString()} in cash to the rider when your order arrives.
                </p>
              </div>

              <span className='mt-4 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-800'>
                <span className='h-1.5 w-1.5 rounded-full bg-amber-500' />
                Payment pending (on delivery)
              </span>

              <p className='mt-4 text-xs text-slate-500'>
                You can cancel this order until it is delivered. After delivery, you can request a return from My Orders.
              </p>

              <div className='mt-6 flex flex-col gap-3'>
                <button
                  onClick={() => navigate('/MyOrders')}
                  className='flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-900 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/25 transition hover:bg-blue-800'
                >
                  <ClipboardList size={18} />
                  Track My Order
                </button>
                <button
                  onClick={() => navigate('/products')}
                  className='flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3.5 text-sm font-semibold text-blue-950 transition hover:bg-slate-50'
                >
                  <ShoppingBag size={18} />
                  Continue Shopping
                </button>
                <button
                  onClick={() => navigate('/MyProfile')}
                  className='flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3.5 text-sm font-semibold text-blue-950 transition hover:bg-slate-50'
                >
                  <UserCircle size={18} />
                  My Profile
                </button>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  )
}

export default OrderSuccess