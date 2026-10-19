import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Phone, CreditCard, Lock, Eye, EyeOff, ArrowLeft, Store, AlertCircle } from 'lucide-react'

const steps = [
  'Create your account',
  'Add your shop details',
  'Get approved by the admin',
  'List products and receive orders',
]

// One reusable input with label, icon and error message.
// It lives OUTSIDE SellerRegister so inputs don't lose focus while typing.
function Field({ label, name, icon: Icon, error, hint, right, ...inputProps }) {
  return (
    <div>
      <label htmlFor={name} className='mb-1.5 block text-sm font-semibold text-slate-700'>
        {label}
      </label>
      <div className='relative'>
        <Icon size={18} className='pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400' />
        <input
          id={name}
          name={name}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${name}-error` : undefined}
          className={`w-full rounded-xl border bg-white py-3 pl-11 ${right ? 'pr-12' : 'pr-4'} text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
              : 'border-slate-300 focus:border-blue-600 focus:ring-blue-100'
          }`}
          {...inputProps}
        />
        {right}
      </div>
      {error ? (
        <p id={`${name}-error`} className='mt-1.5 text-sm text-red-600'>{error}</p>
      ) : (
        hint && <p className='mt-1.5 text-sm text-slate-500'>{hint}</p>
      )}
    </div>
  )
}

function SellerRegister() {

  const navigate = useNavigate()
  const base = import.meta.env.VITE_beckend_base_URL

  const [form, setForm] = useState({ name: '', email: '', phoneNo: '', cnicNo: '', password: '' })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  function validate() {
    const e = {}
    const phoneDigits = form.phoneNo.replace(/\D/g, '')
    const cnicDigits = form.cnicNo.replace(/\D/g, '')

    if (!form.name.trim()) e.name = 'Full name is required'
    if (!form.email.trim()) e.email = 'Email is required'

    if (!form.phoneNo.trim()) e.phoneNo = 'Phone number is required'
    else if (phoneDigits.length !== 11 || !phoneDigits.startsWith('03')) e.phoneNo = 'Enter 11 digits starting with 03'

    if (!form.cnicNo.trim()) e.cnicNo = 'CNIC is required'
    else if (cnicDigits.length !== 13) e.cnicNo = 'CNIC must be 13 digits'

    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setServerError('')

    const found = validate()
    setErrors(found)
    if (Object.keys(found).length > 0) return

    try {
      setLoading(true)

      const response = await axios.post(
        base + '/auth/registration',
        {
          name: form.name,
          email: form.email,
          phoneNo: form.phoneNo,
          cnicNo: form.cnicNo,
          password: form.password,
          role: 'seller',
        },
        { withCredentials: true }
      )

      if (response.data.success === true) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('role', response.data.role)
        navigate('/CreateSeller')
      } else {
        setServerError(response.data.message || 'Could not create the account')
      }
    } catch (error) {
      setServerError(error.response?.data?.message || 'Could not create the account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen w-full bg-white lg:grid lg:grid-cols-[5fr_6fr]'>

      {/* ============ Left panel (desktop only) ============ */}
      <aside className='hidden bg-blue-950 p-12 text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-between'>

        <button onClick={() => navigate('/')} className='flex w-fit cursor-pointer items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white'>
          <span className='flex h-11 w-11 items-center justify-center rounded-full bg-white/15'>
            <Store size={22} />
          </span>
          <span className='text-xl font-bold'>
            Local<span className='text-sky-300'>Mart</span>
          </span>
        </button>

        <div>
          <h2 className='max-w-md text-4xl font-extrabold leading-tight xl:text-5xl'>
            Open your shop on LocalMart
          </h2>
          <p className='mt-4 max-w-sm text-lg leading-relaxed text-blue-100/80'>
            Reach buyers in your own city. Orders come with Cash on Delivery, so there is no online payment to set up.
          </p>

          <ol className='mt-10 space-y-5'>
            {steps.map((text, i) => (
              <li key={text} className='flex items-center gap-4'>
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    i === 0 ? 'bg-white text-blue-950' : 'border border-white/30 text-blue-200'
                  }`}
                >
                  {i + 1}
                </span>
                <span className={i === 0 ? 'font-semibold text-white' : 'text-blue-200'}>{text}</span>
              </li>
            ))}
          </ol>
        </div>

        <p className='text-sm text-blue-200/70'>© {new Date().getFullYear()} Local Seller Marketplace</p>
      </aside>

      {/* ============ Right side: form ============ */}
      <main className='flex min-h-screen flex-col px-6 py-8 sm:px-12 lg:px-16'>

        <div className='flex items-center justify-between'>
          <button
            onClick={() => navigate('/')}
            className='flex cursor-pointer items-center gap-2 rounded-lg text-sm font-semibold text-blue-950 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600'
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>

          {/* Logo shows only on mobile, where the left panel is hidden */}
          <span className='flex items-center gap-2 font-bold text-blue-950 lg:hidden'>
            <span className='flex h-8 w-8 items-center justify-center rounded-full bg-blue-950 text-white'>
              <Store size={16} />
            </span>
            Local<span className='-ml-1.5 text-blue-600'>Mart</span>
          </span>
        </div>

        <div className='flex flex-1 items-center justify-center py-10'>
          <form onSubmit={handleSubmit} className='w-full max-w-lg' noValidate>

            <h1 className='text-3xl font-extrabold text-blue-950 md:text-4xl'>Create your seller account</h1>
            <p className='mb-8 mt-2 text-slate-600'>It takes a minute. You will add your shop details next.</p>

            {serverError && (
              <p role='alert' className='mb-5 flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700'>
                <AlertCircle size={18} className='mt-0.5 shrink-0' />
                {serverError}
              </p>
            )}

            <div className='space-y-5'>
              <Field
                label='Full name'
                name='name'
                icon={User}
                autoComplete='name'
                placeholder='Your full name'
                value={form.name}
                onChange={handleChange}
                error={errors.name}
              />

              <Field
                label='Email address'
                name='email'
                type='email'
                icon={Mail}
                autoComplete='email'
                placeholder='you@example.com'
                value={form.email}
                onChange={handleChange}
                error={errors.email}
              />

              <div className='grid gap-5 sm:grid-cols-2'>
                <Field
                  label='Phone number'
                  name='phoneNo'
                  icon={Phone}
                  inputMode='numeric'
                  maxLength={13}
                  autoComplete='tel'
                  placeholder='03XX XXXXXXX'
                  value={form.phoneNo}
                  onChange={handleChange}
                  error={errors.phoneNo}
                />

                <Field
                  label='CNIC'
                  name='cnicNo'
                  icon={CreditCard}
                  inputMode='numeric'
                  maxLength={15}
                  placeholder='13-digit CNIC'
                  value={form.cnicNo}
                  onChange={handleChange}
                  error={errors.cnicNo}
                />
              </div>

              <Field
                label='Password'
                name='password'
                type={showPassword ? 'text' : 'password'}
                icon={Lock}
                autoComplete='new-password'
                placeholder='Create a password'
                hint='At least 6 characters'
                value={form.password}
                onChange={handleChange}
                error={errors.password}
                right={
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer rounded text-slate-400 hover:text-slate-600 focus-visible:outline-2 focus-visible:outline-blue-600'
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                }
              />
            </div>

            <button
              type='submit'
              disabled={loading}
              className='mt-8 w-full cursor-pointer rounded-xl bg-blue-950 py-3.5 text-base font-semibold text-white transition-colors hover:bg-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-60'
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>

            <p className='mt-6 text-center text-slate-600'>
              Already have an account?{' '}
              <button
                type='button'
                onClick={() => navigate('/login')}
                className='cursor-pointer font-semibold text-blue-700 hover:underline'
              >
                Sign in
              </button>
            </p>
          </form>
        </div>
      </main>
    </div>
  )
}

export default SellerRegister