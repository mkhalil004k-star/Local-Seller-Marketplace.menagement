import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Mail, Phone, Contact, MapPin, User, Pencil, Store, ShieldCheck } from 'lucide-react'

// Ek line: icon + label + value
function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className='flex items-center gap-4 rounded-xl p-3 transition-colors hover:bg-neutral-50'>
      <span className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600'>
        <Icon size={20} />
      </span>
      <div className='min-w-0'>
        <p className='text-xs font-medium text-neutral-500'>{label}</p>
        <p className='truncate font-semibold text-neutral-900'>{value}</p>
      </div>
    </div>
  )
}

function MyProfile() {
  const navigate = useNavigate()
  const role = localStorage.getItem('role')
  const base = import.meta.env.VITE_beckend_base_URL
  const token = localStorage.getItem('token')

  const [user, setUser] = useState(null)
  const [shop, setShop] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getMyProfile() {
      try {
        // account ki info
        const response = await axios.get(base + '/auth/' + role + '/profile', {
          headers: { Authorization: 'Bearer ' + token },
        })
        if (response.data.success === true) {
          setUser(response.data.user)
          localStorage.setItem('name', response.data.user.name)
          // sidebar ko batao ke naam aa gaya
          window.dispatchEvent(new Event('name-updated'))
        }

        // dukaan ki info (sirf seller ke liye)
        if (role === 'seller') {
          try {
            const shopRes = await axios.get(base + '/sellers/myProfile', {
              headers: { Authorization: 'Bearer ' + token },
              withCredentials: true,
            })
            setShop(shopRes.data.data || null)
          } catch (error) {
            console.log('Shop load failed', error)
          }
        }
      } catch (error) {
        console.log(error)
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('role')
          localStorage.removeItem('name')
          navigate('/login')
        }
      } finally {
        setLoading(false)
      }
    }
    getMyProfile()
  }, [])

  // ============ Loading (skeleton) ============
  if (loading) {
    return (
      <div className='min-h-screen flex-1 bg-neutral-50 p-6 md:p-10'>
        <div className='mb-8 h-9 w-48 animate-pulse rounded-lg bg-neutral-200' />
        <div className='grid max-w-5xl gap-6 lg:grid-cols-2'>
          <div className='h-96 animate-pulse rounded-3xl bg-neutral-200' />
          <div className='h-96 animate-pulse rounded-3xl bg-neutral-200' />
        </div>
      </div>
    )
  }

  // ============ Profile nahi mila ============
  if (!user) {
    return (
      <div className='flex min-h-screen flex-1 items-center justify-center bg-neutral-50 p-10'>
        <div className='anim-zoom-in rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-neutral-200'>
          <User className='mx-auto mb-3 text-neutral-300' size={40} />
          <p className='font-semibold text-neutral-800'>Profile not found</p>
          <p className='mt-1 text-sm text-neutral-500'>Please log in again.</p>
          <button
            onClick={() => navigate('/login')}
            className='mt-5 cursor-pointer rounded-xl bg-neutral-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 active:scale-95'
          >
            Go to login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen flex-1 bg-neutral-50 p-6 md:p-10'>

      {/* ============ Heading ============ */}
      <div className='anim-fade-up mb-8'>
        <h1 className='text-3xl font-extrabold tracking-tight text-neutral-900 md:text-4xl'>
          My Profile
        </h1>
        <p className='mt-1 text-neutral-500'>
          {role === 'seller'
            ? 'Your account and shop details in one place.'
            : 'Your account details in one place.'}
        </p>
      </div>

      <div className='grid max-w-5xl items-start gap-6 lg:grid-cols-2'>

        {/* ============ Account card ============ */}
        <div
          style={{ animationDelay: '100ms' }}
          className='anim-fade-up overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-neutral-200 transition-shadow duration-300 hover:shadow-lg'
        >
          {/* upar ki kali patti (sidebar jaisi) */}
          <div className='relative h-28 bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900'>
            <div className='pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-amber-500/20 blur-2xl' />
          </div>

          <div className='px-6 pb-6'>
            <div className='-mt-10 flex items-end gap-4'>
              <div className='flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-amber-100 text-3xl font-extrabold text-amber-700 ring-4 ring-white'>
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div className='min-w-0 pb-1'>
                <h2 className='truncate text-xl font-bold text-neutral-900'>{user.name}</h2>
                <span className='mt-1 inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold capitalize text-amber-700'>
                  <ShieldCheck size={12} />
                  {user.role}
                </span>
              </div>
            </div>

            <div className='mt-6 space-y-1'>
              <InfoRow icon={Mail} label='Email' value={user.email} />
              <InfoRow icon={Phone} label='Phone' value={user.phoneNo || shop?.phone || 'Not added'} />

              {/* CNIC sirf seller ke liye */}
              {role === 'seller' && (
                <InfoRow icon={Contact} label='CNIC' value={user.cnicNo || 'Not added'} />
              )}

              {/* Location sirf buyer ke liye */}
              {role === 'buyer' && (
                <InfoRow icon={MapPin} label='Location' value={user.location || 'Not added'} />
              )}
            </div>
          </div>
        </div>

        {/* ============ Dukaan card ============ */}
        {role === 'seller' && shop && (
          <div
            style={{ animationDelay: '220ms' }}
            className='anim-fade-up group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-neutral-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl'
          >
            <div className='relative h-56 overflow-hidden bg-neutral-100'>
              {shop.imageUrl ? (
                <img
                  src={shop.imageUrl}
                  alt={shop.shopName}
                  className='h-full w-full object-cover transition-transform duration-700 group-hover:scale-105'
                />
              ) : (
                <div className='flex h-full w-full flex-col items-center justify-center gap-2 text-neutral-400'>
                  <Store size={36} />
                  <span className='text-sm'>No image</span>
                </div>
              )}

              <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-transparent to-transparent' />

              {shop.city && (
                <span className='absolute left-4 top-4 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold capitalize text-neutral-800 backdrop-blur'>
                  <MapPin size={12} className='text-amber-600' />
                  {shop.city}
                </span>
              )}
            </div>

            <div className='p-6'>
              <h2 className='text-2xl font-extrabold capitalize text-neutral-900'>{shop.shopName}</h2>

              <div className='mt-4 grid grid-cols-2 gap-3'>
                <div className='rounded-xl bg-neutral-50 p-3'>
                  <p className='text-xs font-medium text-neutral-500'>Owner</p>
                  <p className='truncate font-semibold text-neutral-900'>{shop.ownerName}</p>
                </div>
                <div className='rounded-xl bg-neutral-50 p-3'>
                  <p className='text-xs font-medium text-neutral-500'>Phone</p>
                  <p className='truncate font-semibold text-neutral-900'>{shop.phone}</p>
                </div>
              </div>

              {shop.notes && (
                <p className='mt-4 rounded-xl border-l-4 border-amber-400 bg-amber-50/60 px-4 py-3 text-sm leading-relaxed text-neutral-700'>
                  {shop.notes}
                </p>
              )}

              <button
                onClick={() => navigate('/UpdateSeller/' + shop._id)}
                className='mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-neutral-900 py-3 text-sm font-semibold text-white transition-all hover:bg-amber-500 hover:text-neutral-900 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500'
              >
                <Pencil size={16} />
                Update shop
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default MyProfile