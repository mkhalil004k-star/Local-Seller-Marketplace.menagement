import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import {
  Store, ArrowLeft, User, Phone, MapPin, Building2, Home, Briefcase,
  Banknote, ShieldCheck, Truck, Loader2, AlertCircle, Check,
} from 'lucide-react'

const DELIVERY_FEE = 100

function Checkout() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const base = import.meta.env.VITE_beckend_base_URL
  const token = localStorage.getItem('token')

  const stateQty = Math.floor(Number(location.state?.quantity))
  const quantity = stateQty >= 1 ? stateQty : 1

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    city: '',
    address: '',
    label: 'home'
  })

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get(base + '/product/public')

        const list = Array.isArray(res.data?.products)
          ? res.data.products
          : []

        setProduct(list.find((p) => p._id === id) || null)

        if (token) {
          const me = await axios.get(base + '/auth/buyer/profile', {
            headers: { Authorization: 'Bearer ' + token },
            withCredentials: true
          })

          if (me.data.success === true) {
            const u = me.data.user

            setForm((f) => ({
              ...f,
              fullName: (u.name || '').trim(),
              phone: (u.phoneNo || '').trim(),
              city: (u.location || '').trim()
            }))
          }
        }
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id])

  function change(e) {
    setError('')
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const itemsTotal = product ? Number(product.price) * quantity : 0
  const grandTotal = itemsTotal + DELIVERY_FEE

  async function placeOrder() {
    if (placing) return

    const fullName = form.fullName.trim()
    const phone = form.phone.replace(/[\s-]/g, '')
    const city = form.city.trim()
    const address = form.address.trim()
    const label = form.label === 'office' ? 'Office' : 'Home'

    if (!fullName || !phone || !city || !address) {
      setError('Please fill in all delivery details.')
      return
    }

    if (!/^03\d{9}$/.test(phone)) {
      setError('Enter an 11-digit phone number like 03XXXXXXXXX.')
      return
    }

    if (!token) {
      navigate('/login')
      return
    }

    if (!product) {
      setError('Product not found.')
      return
    }

    try {
      setPlacing(true)
      setError('')

      const res = await axios.post(
        base + '/orders/orderCreate',
        {
          productId: product._id,
          quantity,
          fullName,
          phone,
          city,
          address,
          label
        },
        {
          headers: { Authorization: 'Bearer ' + token },
          withCredentials: true
        }
      )

      if (res.data.success === true) {
        const orderData = {
          orderId: res.data.order?._id,
          title: product.title,
          image: product.imageUrl,
          price: product.price,
          qty: quantity,
          deliveryFee: DELIVERY_FEE,
          fullName,
          phone,
          city,
          address,
          label
        }

        sessionStorage.setItem('lastOrder', JSON.stringify(orderData))
        navigate('/order-success', { state: orderData })
      } else {
        setError(res.data.message || 'Could not place the order.')
      }
    } catch (err) {
      console.log(err)
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setPlacing(false)
    }
  }

  // Input with an icon on the left
  const inputClass =
    'w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10'
  const labelClass = 'mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500'
  const iconClass = 'pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400'

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-slate-50'>
        <Loader2 className='animate-spin text-blue-900' size={32} />
      </div>
    )
  }

  if (!product) {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50'>
        <p className='text-slate-500'>Product not found.</p>
        <button
          onClick={() => navigate('/products')}
          className='cursor-pointer rounded-xl bg-blue-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-800'
        >
          Back to products
        </button>
      </div>
    )
  }

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
            Secure checkout
          </span>

          <button
            onClick={() => navigate('/product/' + id)}
            className='flex cursor-pointer items-center gap-2 text-sm font-semibold text-blue-950 hover:text-blue-700'
          >
            <ArrowLeft size={16} />
            Back to product
          </button>
        </nav>
      </header>

      <div className='mx-auto max-w-6xl px-4 pb-16 pt-8 md:px-8'>

        {/* Page title + steps */}
        <div className='mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-widest text-slate-500'>Almost there</p>
            <h1 className='mt-1 text-3xl font-extrabold text-blue-950 md:text-4xl'>Checkout</h1>
          </div>

          <ol className='flex items-center gap-2 text-xs font-semibold'>
            <li className='flex items-center gap-2 text-green-700'>
              <span className='flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white'>
                <Check size={14} />
              </span>
              Product
            </li>
            <span className='h-px w-6 bg-slate-300' />
            <li className='flex items-center gap-2 text-blue-950'>
              <span className='flex h-6 w-6 items-center justify-center rounded-full bg-blue-900 text-white'>2</span>
              Delivery
            </li>
            <span className='h-px w-6 bg-slate-300' />
            <li className='flex items-center gap-2 text-slate-400'>
              <span className='flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-slate-500'>3</span>
              Done
            </li>
          </ol>
        </div>

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>

          {/* ============ Left column ============ */}
          <div className='space-y-6 lg:col-span-2'>

            {/* Delivery information */}
            <section className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8'>
              <div className='mb-6 flex items-center gap-3'>
                <span className='flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-800'>
                  <Truck size={20} />
                </span>
                <div>
                  <h2 className='text-lg font-bold text-blue-950'>Delivery Information</h2>
                  <p className='text-sm text-slate-500'>Where should the seller deliver your order?</p>
                </div>
              </div>

              <div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>

                <div>
                  <label className={labelClass}>Full name</label>
                  <div className='relative'>
                    <User size={18} className={iconClass} />
                    <input
                      name='fullName'
                      value={form.fullName}
                      onChange={change}
                      placeholder='Your full name'
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Phone number</label>
                  <div className='relative'>
                    <Phone size={18} className={iconClass} />
                    <input
                      name='phone'
                      value={form.phone}
                      onChange={change}
                      inputMode='numeric'
                      maxLength={11}
                      placeholder='03XXXXXXXXX'
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>City</label>
                  <div className='relative'>
                    <Building2 size={18} className={iconClass} />
                    <input
                      name='city'
                      value={form.city}
                      onChange={change}
                      placeholder='e.g. Bannu'
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Full address</label>
                  <div className='relative'>
                    <MapPin size={18} className={iconClass} />
                    <input
                      name='address'
                      value={form.address}
                      onChange={change}
                      placeholder='House no, street, area'
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* Address label */}
              <p className={labelClass + ' mt-6'}>Address type</p>
              <div className='flex gap-3'>
                {[
                  { key: 'home', text: 'Home', Icon: Home },
                  { key: 'office', text: 'Office', Icon: Briefcase },
                ].map(({ key, text, Icon }) => {
                  const active = form.label === key
                  return (
                    <button
                      key={key}
                      type='button'
                      onClick={() => setForm({ ...form, label: key })}
                      className={
                        'flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition sm:flex-none sm:px-8 ' +
                        (active
                          ? 'border-blue-900 bg-blue-900 text-white shadow-md shadow-blue-900/20'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50')
                      }
                    >
                      <Icon size={16} />
                      {text}
                    </button>
                  )
                })}
              </div>
            </section>

            {/* Payment method */}
            <section className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8'>
              <div className='mb-5 flex items-center gap-3'>
                <span className='flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-800'>
                  <Banknote size={20} />
                </span>
                <div>
                  <h2 className='text-lg font-bold text-blue-950'>Payment Method</h2>
                  <p className='text-sm text-slate-500'>Pay when your order arrives.</p>
                </div>
              </div>

              <div className='flex items-center justify-between rounded-2xl border-2 border-blue-900 bg-blue-50/50 p-4'>
                <div className='flex items-center gap-3'>
                  <span className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-900 text-white'>
                    <Banknote size={18} />
                  </span>
                  <div>
                    <p className='font-semibold text-blue-950'>Cash on Delivery</p>
                    <p className='text-xs text-slate-500'>No online payment needed</p>
                  </div>
                </div>
                <span className='flex h-6 w-6 items-center justify-center rounded-full bg-blue-900 text-white'>
                  <Check size={14} />
                </span>
              </div>
            </section>
          </div>

          {/* ============ Right column: summary ============ */}
        <aside className='h-fit  lg:top-28'>
  <div className='select-none rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
    <h2 className='mb-5 text-lg font-bold text-blue-950'>Order Summary</h2>

    {/* Product */}
    <div className='flex items-center gap-4'>
      <div className='relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-slate-100'>
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.title}
            draggable={false}
            className='h-full w-full object-cover'
          />
        )}
        <span className='absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-950 px-1 text-[10px] font-bold text-white'>
          {quantity}
        </span>
      </div>
      <div className='min-w-0 flex-1'>
        <p className='truncate font-bold text-blue-950'>{product.title}</p>
        {product.category && (
          <span className='mt-1 inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600'>
            {product.category}
          </span>
        )}
        {product.seller?.name && (
          <p className='mt-1 text-xs text-slate-500'>Sold by {product.seller.name}</p>
        )}
      </div>
    </div>

    <div className='my-5 border-t border-dashed border-slate-200' />

    {/* Price breakdown */}
    <div className='space-y-3 text-sm'>
      <div className='flex justify-between text-slate-600'>
        <span>Price × {quantity}</span>
        <span className='font-medium text-slate-800'>Rs {itemsTotal.toLocaleString()}</span>
      </div>
      <div className='flex justify-between text-slate-600'>
        <span>Delivery fee</span>
        <span className='font-medium text-slate-800'>Rs {DELIVERY_FEE.toLocaleString()}</span>
      </div>
    </div>

    <div className='my-5 border-t border-slate-200' />

    <div className='flex items-center justify-between'>
      <span className='font-bold text-blue-950'>Total</span>
      <span className='text-2xl font-extrabold text-blue-950'>
        Rs {grandTotal.toLocaleString()}
      </span>
    </div>

    {/* Error message */}
    {error && (
      <div className='mt-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700'>
        <AlertCircle size={18} className='mt-0.5 shrink-0' />
        <span>{error}</span>
      </div>
    )}

    <button
      type='button'
      onClick={placeOrder}
      disabled={placing}
      className='mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-900 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/25 transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60'
    >
      {placing ? (
        <>
          <Loader2 size={18} className='animate-spin' />
          Placing order...
        </>
      ) : (
        'Place Order'
      )}
    </button>

    <p className='mt-4 flex items-center justify-center gap-2 text-xs text-slate-500'>
      <ShieldCheck size={14} className='text-green-600' />
      Pay in cash when you receive your order
    </p>
  </div>
</aside>

        </div>
      </div>
    </div>
  )
}

export default Checkout