import React, { useState } from 'react'
import axios from "axios"
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Store, AlertCircle, Banknote, ShieldCheck, Zap } from 'lucide-react'

const points = [
  { icon: Banknote, text: 'Cash on Delivery on every order' },
  { icon: ShieldCheck, text: 'Only admin-approved sellers' },
  { icon: Zap, text: 'Local shops with quick delivery' },
]

function Login() {

  let Navigate = useNavigate()

  let [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  let [showPassword, setShowPassword] = useState(false)
  let [loading, setLoading] = useState(false)
  let [error, setError] = useState("")


  async function handleSubmite(e) {

    e.preventDefault()
    setError("")

    try {

      setLoading(true)

      let base = import.meta.env.VITE_beckend_base_URL

      let response = await axios.post(
        base + "/auth/login",
        formData,
        { withCredentials: true }
      )

      console.log(response.data)

      if (response.data.success == true) {

        let token = response.data.token
        let role = response.data.role

        // Admin is page se andar nahi aa sakta (uska alag chhupa hua login hai)
        if (role !== "seller" && role !== "buyer") {
          setError("Email or password is not correct")
          return
        }

        localStorage.setItem("token", token)
        localStorage.setItem("role", role)

        // Naam: backend bheje to save karo, warna purana naam hata do
        if (response.data.name) {
          localStorage.setItem("name", response.data.name)
        } else {
          localStorage.removeItem("name")
        }

        // seller ya buyer: profile bani hai ya nahi
        let url = role === "seller"
          ? "/sellers/myProfile"
          : "/buyers/myProfile"

        let created = false

        try {

          let check = await axios.get(
            base + url,
            {
              headers: {
                Authorization: "Bearer " + token
              },
              withCredentials: true
            }
          )

          created = check.data.exists === true

        } catch (error) {

          console.log("Profile check failed", error)

        }

        if (role === "seller") {
          Navigate(created ? "/MyProfile" : "/CreateSeller")
        } else {
          Navigate(created ? "/products" : "/CreateBuyer")
        }

      } else {
        setError(response.data.message || "Could not sign in")
      }

    } catch (error) {

      console.log(error)

      if (error.response) {
        console.log(error.response.data)
      }

      setError(
        error.response?.data?.message ||
        "Something went wrong. Please try again."
      )

    } finally {

      setLoading(false)

    }
  }


  let inputClass =
    "w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"

  let iconClass =
    "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"


  return (

    <div className="min-h-screen w-full bg-white lg:grid lg:grid-cols-[5fr_6fr]">

      {/* ============ Left panel (desktop only) ============ */}

      <aside className="hidden bg-blue-950 p-12 text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-between">

        <button
          onClick={function () {
            Navigate("/")
          }}
          className="flex w-fit cursor-pointer items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15">
            <Store size={22} />
          </span>
          <span className="text-xl font-bold">
            Local<span className="text-sky-300">Mart</span>
          </span>
        </button>

        <div>
          <h2 className="max-w-md text-4xl font-extrabold leading-tight xl:text-5xl">
            Welcome back to your local marketplace
          </h2>

          <ul className="mt-10 space-y-5">
            {points.map(function ({ icon: Icon, text }) {
              return (
                <li key={text} className="flex items-center gap-4 text-blue-100">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
                    <Icon size={20} />
                  </span>
                  {text}
                </li>
              )
            })}
          </ul>
        </div>

        <p className="text-sm text-blue-200/70">
          © {new Date().getFullYear()} Local Seller Marketplace
        </p>

      </aside>


      {/* ============ Right side: form ============ */}

      <main className="flex min-h-screen flex-col px-6 py-8 sm:px-12 lg:px-16">

        <div className="flex items-center justify-between">

          <button
            onClick={function () {
              Navigate("/")
            }}
            className="flex cursor-pointer items-center gap-2 rounded-lg text-sm font-semibold text-blue-950 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>

          {/* Logo sirf mobile par (left panel wahan hidden hai) */}
          <span className="flex items-center gap-2 font-bold text-blue-950 lg:hidden">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-950 text-white">
              <Store size={16} />
            </span>
            Local<span className="-ml-1.5 text-blue-600">Mart</span>
          </span>

        </div>


        <div className="flex flex-1 items-center justify-center py-10">

          <form onSubmit={handleSubmite} className="w-full max-w-md">

            <h1 className="text-3xl font-extrabold text-blue-950 md:text-4xl">
              Sign in
            </h1>

            <p className="mb-8 mt-2 text-slate-600">
              Enter your email and password to continue.
            </p>

            {error && (
              <p role="alert" className="mb-5 flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                {error}
              </p>
            )}

            <div className="space-y-5">

              {/* Email */}

              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Email address
                </label>
                <div className="relative">
                  <Mail size={18} className={iconClass} />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={function (event) {
                      setFormData({
                        ...formData,
                        email: event.target.value
                      })
                    }}
                    className={inputClass + " pr-4"}
                  />
                </div>
              </div>


              {/* Password */}

              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <Lock size={18} className={iconClass} />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="current-password"
                    required
                    placeholder="Your password"
                    value={formData.password}
                    onChange={function (event) {
                      setFormData({
                        ...formData,
                        password: event.target.value
                      })
                    }}
                    className={inputClass + " pr-12"}
                  />
                  <button
                    type="button"
                    onClick={function () {
                      setShowPassword(!showPassword)
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer rounded text-slate-400 hover:text-slate-600 focus-visible:outline-2 focus-visible:outline-blue-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

            </div>


            {/* Login Button */}

            <button
              type="submit"
              disabled={loading}
              className="mt-8 w-full cursor-pointer rounded-xl bg-blue-950 py-3.5 text-base font-semibold text-white transition-colors hover:bg-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>


            {/* Registration */}

            <p className="mt-6 text-center text-slate-600">
              Don't have an account?{" "}
              <Link
                to="/registration"
                className="font-semibold text-blue-700 hover:underline"
              >
                Create one
              </Link>
            </p>

          </form>

        </div>

      </main>

    </div>

  )
}

export default Login