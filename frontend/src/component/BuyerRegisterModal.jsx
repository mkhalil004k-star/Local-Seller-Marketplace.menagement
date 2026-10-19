import React, { useState } from 'react'
import axios from 'axios'
import { X, User, Mail, Phone, MapPin, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'

function BuyerRegisterModal({ onClose, onSuccess }) {
  const base = import.meta.env.VITE_beckend_base_URL

  // 'register' ya 'login'
  const [mode, setMode] = useState('register')

  const [form, setForm] = useState({
    name: '',
    email: '',
    phoneNo: '',
    location: '',
    password: '',
  })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function switchMode(next) {
    setMode(next)
    setError('')
  }

  // ---------- Registration ----------
  async function handleRegister() {
    setError('')

    if (!form.name || !form.email || !form.phoneNo || !form.location || !form.password) {
      setError('Sab fields bharna zaroori hai.')
      return
    }
    if (form.password.length < 6) {
      setError('Password kam az kam 6 characters ka ho.')
      return
    }

    try {
      setLoading(true)

      // 1. account banao
      const reg = await axios.post(base + '/auth/registration', {
        ...form,
        role: 'buyer',
      })

      if (reg.data.success !== true) {
        setError(reg.data.message || 'Registration nahi ho saki.')
        return
      }

      // 2. seedha login karo
      const login = await axios.post(
        base + '/auth/login',
        { email: form.email, password: form.password },
        { withCredentials: true }
      )

      if (login.data.success === true) {
        localStorage.setItem('token', login.data.token)
        localStorage.setItem('role', login.data.role)
        localStorage.setItem('name', form.name)
        onSuccess()
      } else {
        // account ban gaya, ab sign in wale form pe le jao
        setMode('login')
        setError('Account ban gaya. Ab sign in karein.')
      }
    } catch (err) {
      console.log(err)
      setError(err.response?.data?.message || 'Kuch masla aa gaya.')
    } finally {
      setLoading(false)
    }
  }

  // ---------- Sign In (popup ke andar) ----------
  async function handleLogin() {
    setError('')

    if (!form.email || !form.password) {
      setError('Email aur password likhein.')
      return
    }

    try {
      setLoading(true)

      const res = await axios.post(
        base + '/auth/login',
        { email: form.email, password: form.password },
        { withCredentials: true }
      )

      if (res.data.success !== true) {
        setError(res.data.message || 'Sign in nahi ho saka.')
        return
      }

      // Order sirf buyer account se ho sakta hai
      if (res.data.role !== 'buyer') {
        setError('Ye buyer account nahi hai. Order ke liye buyer account se sign in karein.')
        return
      }

      localStorage.setItem('token', res.data.token)
      localStorage.setItem('role', res.data.role)
      if (res.data.name) {
        localStorage.setItem('name', res.data.name)
      } else {
        localStorage.removeItem('name')
      }

      onSuccess() // seedha checkout
    } catch (err) {
      console.log(err)
      setError(err.response?.data?.message || 'Email ya password theek nahi.')
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { name: 'name', placeholder: 'Full Name', icon: User, type: 'text' },
    { name: 'email', placeholder: 'Email Address', icon: Mail, type: 'email' },
    { name: 'phoneNo', placeholder: '03XX XXXXXXX', icon: Phone, type: 'text' },
    { name: 'location', placeholder: 'Location (e.g. Bannu, Main Bazaar)', icon: MapPin, type: 'text' },
  ]

  const inputClass =
    'w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-3 text-sm focus:border-blue-600 focus:outline-none'

  const isLogin = mode === 'login'

  return (
    <div
      onClick={onClose}
      className='fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4'
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className='relative max-h-[95vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl'
      >
        <button
          onClick={onClose}
          className='absolute right-4 top-4 cursor-pointer text-gray-400 hover:text-gray-700'
          aria-label='Band karein'
        >
          <X size={22} />
        </button>

        <h2 className='text-2xl font-bold text-gray-900'>
          {isLogin ? 'Sign In' : 'Buyer Account'}
        </h2>
        <p className='mb-5 mt-1 text-sm text-gray-500'>
          {isLogin
            ? 'Order karne ke liye apne buyer account se sign in karein'
            : 'Order karne ke liye pehle account banayein'}
        </p>

        {error && (
          <p role='alert' className='mb-4 flex items-start gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-700'>
            <AlertCircle size={16} className='mt-0.5 shrink-0' />
            {error}
          </p>
        )}

        <div className='flex flex-col gap-3'>
          {/* Register mode mein saari fields, login mein sirf email */}
          {(isLogin ? fields.filter((f) => f.name === 'email') : fields).map(
            ({ name, placeholder, icon: Icon, type }) => (
              <div key={name} className='relative'>
                <Icon size={18} className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
                <input
                  name={name}
                  type={type}
                  value={form[name]}
                  onChange={change}
                  placeholder={placeholder}
                  className={inputClass}
                />
              </div>
            )
          )}

          <div className='relative'>
            <Lock size={18} className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
            <input
              name='password'
              type={showPass ? 'text' : 'password'}
              value={form.password}
              onChange={change}
              onKeyDown={(e) => e.key === 'Enter' && (isLogin ? handleLogin() : handleRegister())}
              placeholder={isLogin ? 'Password' : 'Password (min. 6 characters)'}
              className='w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-10 text-sm focus:border-blue-600 focus:outline-none'
            />
            <button
              type='button'
              onClick={() => setShowPass(!showPass)}
              className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400'
              aria-label={showPass ? 'Password chhupayein' : 'Password dikhayein'}
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            onClick={isLogin ? handleLogin : handleRegister}
            disabled={loading}
            className='mt-1 w-full cursor-pointer rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60'
          >
            {loading
              ? isLogin ? 'Sign in ho raha hai...' : 'Account ban raha hai...'
              : isLogin ? 'Sign In' : 'Create Account'}
          </button>

          <p className='text-center text-sm text-gray-500'>
            {isLogin ? 'Account nahi hai?' : 'Pehle se account hai?'}{' '}
            <button
              onClick={() => switchMode(isLogin ? 'register' : 'login')}
              className='cursor-pointer font-semibold text-blue-600'
            >
              {isLogin ? 'Create Account' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default BuyerRegisterModal