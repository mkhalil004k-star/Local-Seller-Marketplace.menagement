import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  ClipboardList, Phone, MapPin, Home, User, MessageCircle,
  Check, X, Package, AlertCircle, Clock, CheckCircle2, XCircle,
  Truck, Undo2,
} from 'lucide-react'

const DELIVERY_FEE = 100

const statusStyle = {
  pending: { badge: 'bg-amber-100 text-amber-700', icon: Clock },
  accepted: { badge: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
  delivered: { badge: 'bg-blue-100 text-blue-700', icon: Truck },
  rejected: { badge: 'bg-red-100 text-red-700', icon: XCircle },
  cancelled: { badge: 'bg-neutral-200 text-neutral-700', icon: XCircle },
  return_requested: { badge: 'bg-orange-100 text-orange-700', icon: Undo2 },
  returned: { badge: 'bg-neutral-200 text-neutral-700', icon: Undo2 },
  return_rejected: { badge: 'bg-red-100 text-red-700', icon: XCircle },
}

// kaun sa tab kin statuses ko dikhata hai
const tabMatch = {
  all: () => true,
  pending: (s) => s === 'pending',
  accepted: (s) => s === 'accepted',
  delivered: (s) => s === 'delivered',
  returns: (s) => ['return_requested', 'returned', 'return_rejected'].includes(s),
  rejected: (s) => ['rejected', 'cancelled'].includes(s),
}

// Card ke andar ek line: icon + label + value
function Detail({ icon: Icon, label, value }) {
  return (
    <div className='flex items-start gap-3'>
      <span className='mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500'>
        <Icon size={15} />
      </span>
      <div className='min-w-0'>
        <p className='text-xs text-neutral-400'>{label}</p>
        <p className='break-words text-sm font-medium text-neutral-800'>{value || 'Not added'}</p>
      </div>
    </div>
  )
}

function SellerOrders() {

  let [orders, setOrders] = useState([])
  let [loading, setLoading] = useState(true)
  let [filter, setFilter] = useState('all')
  let [busyId, setBusyId] = useState('')
  let [error, setError] = useState('')

  let authConfig = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token")
    },
    withCredentials: true
  }

  async function getOrders() {
    try {
      let response = await axios.get(
        import.meta.env.VITE_beckend_base_URL + "/orders/sellerOrders",
        authConfig
      )
      setOrders(Array.isArray(response.data?.data) ? response.data.data : [])
    } catch (error) {
      console.error("Failed to load orders", error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  // page khulte hi seller ke "naye" orders seen ho jayen (sidebar badge saaf)
  async function markSeen() {
    try {
      await axios.post(
        import.meta.env.VITE_beckend_base_URL + "/orders/markSeen",
        {},
        authConfig
      )
    } catch (error) {
      console.error("Failed to mark seen", error)
    }
  }

  // ek hi function: status badalna (accepted / rejected / delivered)
  async function changeStatus(id, status, sellerNote) {
    setError('')
    setBusyId(id)
    try {
      let response = await axios.post(
        import.meta.env.VITE_beckend_base_URL + "/orders/orderStatus",
        { id, status, sellerNote },
        authConfig
      )
      if (response.data.success == true) {
        await getOrders()
      } else {
        setError(response.data.message || "Failed to update order")
      }
    } catch (error) {
      console.error("Failed to update order", error)
      setError(error.response?.data?.message || "Failed to update order")
    } finally {
      setBusyId('')
    }
  }

  // return accept / reject
  async function decideReturn(id, accept, sellerNote) {
    setError('')
    setBusyId(id)
    try {
      let response = await axios.post(
        import.meta.env.VITE_beckend_base_URL + "/orders/returnDecision",
        { id, accept, sellerNote },
        authConfig
      )
      if (response.data.success == true) {
        await getOrders()
      } else {
        setError(response.data.message || "Failed to update return")
      }
    } catch (error) {
      console.error("Failed to update return", error)
      setError(error.response?.data?.message || "Failed to update return")
    } finally {
      setBusyId('')
    }
  }

  function rejectOrder(id) {
    let note = prompt("Reject karne ki wajah likhein (buyer ko dikhegi):")
    if (note === null) return
    changeStatus(id, "rejected", note)
  }

  function rejectReturn(id) {
    let note = prompt("Return reject karne ki wajah likhein (buyer ko dikhegi):")
    if (note === null) return
    decideReturn(id, false, note)
  }

  useEffect(() => {
    getOrders()
    markSeen()
  }, [])

  let tabs = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'accepted', label: 'Accepted' },
    { key: 'delivered', label: 'Delivered' },
    { key: 'returns', label: 'Returns' },
    { key: 'rejected', label: 'Rejected' },
  ]

  // Tabs ke liye ginti
  let counts = {}
  tabs.forEach((t) => {
    counts[t.key] = orders.filter((o) => tabMatch[t.key](o.status)).length
  })

  let visible = orders.filter((o) => tabMatch[filter](o.status))

  // jin par seller ka jawab chahiye: naye orders + return requests
  let waiting = orders.filter(
    (o) => o.status === 'pending' || o.status === 'return_requested'
  ).length

  return (
    <div className='min-h-screen w-full bg-neutral-50 p-6 md:p-10'>

      {/* ============ Heading ============ */}
      <div className='anim-fade-up flex flex-wrap items-end justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-extrabold tracking-tight text-neutral-900 md:text-4xl'>
            Orders
          </h1>
          <p className='mt-1 text-neutral-500'>Buyers who want your products</p>
        </div>

        {waiting > 0 && (
          <span className='flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700'>
            <span className='relative flex h-2.5 w-2.5'>
              <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500 opacity-75' />
              <span className='relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-500' />
            </span>
            {waiting} waiting for your reply
          </span>
        )}
      </div>

      {/* ============ Filter tabs ============ */}
      <div
        style={{ animationDelay: '100ms' }}
        className='anim-fade-up mt-8 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
      >
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={
              'flex shrink-0 cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 ' +
              (filter === t.key
                ? 'bg-neutral-900 text-white shadow'
                : 'bg-white text-neutral-600 ring-1 ring-neutral-200 hover:text-neutral-900')
            }
          >
            {t.label}
            <span
              className={
                'rounded-full px-2 py-0.5 text-xs ' +
                (filter === t.key ? 'bg-amber-500 text-neutral-900' : 'bg-neutral-100 text-neutral-500')
              }
            >
              {counts[t.key]}
            </span>
          </button>
        ))}
      </div>

      {/* ============ Error ============ */}
      {error && (
        <p
          role='alert'
          className='anim-fade-in mt-6 flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700'
        >
          <AlertCircle size={18} className='mt-0.5 shrink-0' />
          {error}
        </p>
      )}

      {/* ============ Loading ============ */}
      {loading && (
        <div className='mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3'>
          {[1, 2, 3].map((i) => (
            <div key={i} className='animate-pulse overflow-hidden rounded-3xl bg-white ring-1 ring-neutral-200'>
              <div className='h-44 bg-neutral-200' />
              <div className='space-y-3 p-5'>
                <div className='h-4 w-2/3 rounded bg-neutral-200' />
                <div className='h-4 w-1/3 rounded bg-neutral-200' />
                <div className='h-16 rounded bg-neutral-100' />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ============ Empty ============ */}
      {!loading && visible.length === 0 && (
        <div className='anim-zoom-in mt-8 rounded-3xl border border-dashed border-neutral-300 bg-white py-20 text-center'>
          <ClipboardList className='mx-auto mb-3 text-neutral-300' size={40} />
          <h3 className='text-lg font-semibold text-neutral-800'>
            {orders.length === 0 ? 'No orders yet' : 'No ' + filter + ' orders'}
          </h3>
          <p className='mt-1 text-sm text-neutral-500'>
            {orders.length === 0
              ? 'New buyer requests will show up here'
              : 'Try another tab to see your other orders'}
          </p>
          {orders.length > 0 && (
            <button
              onClick={() => setFilter('all')}
              className='mt-5 cursor-pointer rounded-xl bg-neutral-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 active:scale-95'
            >
              Show all orders
            </button>
          )}
        </div>
      )}

      {/* ============ Orders ============ */}
      {!loading && visible.length > 0 && (
        <div
          key={filter}
          className='mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3'
        >

          {visible.map((order, i) => {

            const buyerName = order.fullName || order.buyer?.name
            const phone = order.phone || order.buyer?.phoneNo
            const quantity = order.quantity || 1
            const itemsTotal = Number(order.product?.price || 0) * quantity
            const grandTotal = order.totalPrice ?? (itemsTotal + DELIVERY_FEE)

            const waNumber = phone
              ? String(phone).replace(/\s|-/g, '').replace(/^0/, '')
              : ''

            const st = statusStyle[order.status] || {
              badge: 'bg-neutral-100 text-neutral-700',
              icon: Clock,
            }
            const StatusIcon = st.icon
            const busy = busyId === order._id

            return (
              <div
                key={order._id}
                style={{ animationDelay: Math.min(i, 8) * 70 + 'ms' }}
                className='anim-fade-up group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-neutral-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl'
              >

                {/* Image */}
                <div className='relative h-44 overflow-hidden bg-neutral-100'>
                  {order.product?.imageUrl ? (
                    <img
                      src={order.product.imageUrl}
                      alt={order.product?.title || 'Product'}
                      className='h-full w-full object-cover transition-transform duration-700 group-hover:scale-105'
                    />
                  ) : (
                    <div className='flex h-full flex-col items-center justify-center gap-2 text-neutral-400'>
                      <Package size={32} />
                      <span className='text-sm'>No image</span>
                    </div>
                  )}

                  <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-900/50 via-transparent to-transparent' />

                  <span
                    className={'absolute right-4 top-4 flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold capitalize backdrop-blur ' + st.badge}
                  >
                    <StatusIcon size={12} />
                    {order.status.replace('_', ' ')}
                  </span>
                </div>

                <div className='flex flex-1 flex-col gap-4 p-5'>

                  {/* Title + price */}
                  <div>
                    <h2 className='truncate text-lg font-bold text-neutral-900'>
                      {order.product?.title || "Deleted product"}
                    </h2>
                    <div className='mt-1 flex items-baseline gap-2'>
                      <p className='text-2xl font-extrabold text-amber-600'>
                        Rs {Number(grandTotal).toLocaleString()}
                      </p>
                      <p className='text-xs text-neutral-400'>
                        Qty {quantity} + Rs {DELIVERY_FEE} delivery
                      </p>
                    </div>
                  </div>

                  {/* Return request: buyer ki wajah */}
                  {order.status === "return_requested" && (
                    <div className='rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-800'>
                      <p className='font-semibold'>Buyer wants to return this order</p>
                      <p className='mt-1 break-words'>Reason: {order.returnReason || 'Not added'}</p>
                    </div>
                  )}

                  {/* Seller ka apna note (reject / return reject) */}
                  {["rejected", "return_rejected"].includes(order.status) && order.sellerNote && (
                    <div className='rounded-2xl bg-red-50 p-4 text-sm text-red-700'>
                      Your note: {order.sellerNote}
                    </div>
                  )}

                  {/* Buyer details */}
                  <div className='space-y-3 rounded-2xl bg-neutral-50 p-4'>
                    <Detail icon={User} label='Buyer' value={buyerName} />
                    <Detail icon={Phone} label='Phone' value={phone} />
                    <Detail icon={MapPin} label='City' value={order.city} />
                    <Detail icon={Home} label='Address' value={order.address} />
                  </div>

                  {/* WhatsApp */}
                  {waNumber && (
                    <a
                      href={`https://wa.me/92${waNumber}`}
                      target='_blank'
                      rel='noreferrer'
                      className='flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500'
                    >
                      <MessageCircle size={16} />
                      WhatsApp Buyer
                    </a>
                  )}

                  {/* pending: Accept / Reject */}
                  {order.status === "pending" && (
                    <div className='mt-auto flex gap-3'>
                      <button
                        disabled={busy}
                        onClick={() => changeStatus(order._id, "accepted")}
                        className='flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-neutral-900 py-2.5 text-sm font-semibold text-white transition-all hover:bg-amber-500 hover:text-neutral-900 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500'
                      >
                        <Check size={16} />
                        {busy ? 'Please wait...' : 'Accept'}
                      </button>
                      <button
                        disabled={busy}
                        onClick={() => rejectOrder(order._id)}
                        className='flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-200 bg-white py-2.5 text-sm font-semibold text-red-600 transition-all hover:bg-red-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500'
                      >
                        <X size={16} />
                        Reject
                      </button>
                    </div>
                  )}

                  {/* accepted: delivered mark karein */}
                  {order.status === "accepted" && (
                    <div className='mt-auto'>
                      <button
                        disabled={busy}
                        onClick={() => changeStatus(order._id, "delivered")}
                        className='flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-neutral-900 py-2.5 text-sm font-semibold text-white transition-all hover:bg-amber-500 hover:text-neutral-900 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500'
                      >
                        <Truck size={16} />
                        {busy ? 'Please wait...' : 'Mark as delivered'}
                      </button>
                    </div>
                  )}

                  {/* return_requested: Accept / Reject return */}
                  {order.status === "return_requested" && (
                    <div className='mt-auto flex gap-3'>
                      <button
                        disabled={busy}
                        onClick={() => decideReturn(order._id, true)}
                        className='flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-neutral-900 py-2.5 text-sm font-semibold text-white transition-all hover:bg-amber-500 hover:text-neutral-900 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500'
                      >
                        <Check size={16} />
                        {busy ? 'Please wait...' : 'Accept return'}
                      </button>
                      <button
                        disabled={busy}
                        onClick={() => rejectReturn(order._id)}
                        className='flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-200 bg-white py-2.5 text-sm font-semibold text-red-600 transition-all hover:bg-red-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500'
                      >
                        <X size={16} />
                        Reject return
                      </button>
                    </div>
                  )}

                </div>
              </div>
            )
          })}

        </div>
      )}
    </div>
  )
}

export default SellerOrders