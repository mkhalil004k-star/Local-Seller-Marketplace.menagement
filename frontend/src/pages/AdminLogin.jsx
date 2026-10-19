import React, { useState } from 'react'
import axios from "axios"
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, AlertCircle, ShieldCheck } from 'lucide-react'

function AdminLogin() {

  let Navigate = useNavigate()

  let [formData, setFormData] = useState({ email: "", password: "" })
  let [showPassword, setShowPassword] = useState(false)
  let [loading, setLoading] = useState(false)
  let [error, setError] = useState("")

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")

    try {
      setLoading(true)

      let base = import.meta.env.VITE_beckend_base_URL

      let response = await axios.post(
        base + "/auth/admin-login",
        formData,
        { withCredentials: true }
      )

      if (response.data.success === true) {

        if (response.data.role !== "admin") {
          setError("Email or password is not correct")
          return
        }

        localStorage.setItem("token", response.data.token)
        localStorage.setItem("role", "admin")

        if (response.data.name) {
          localStorage.setItem("name", response.data.name)
        }

        Navigate("/profile")

      } else {
        setError(response.data.message || "Could not sign in")
      }

    } catch (error) {
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
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">

      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-950 text-white">
            <ShieldCheck size={22} />
          </span>
          <h1 className="text-2xl font-extrabold text-blue-950">Admin Sign in</h1>
        </div>

        {error && (
          <p role="alert" className="mb-5 flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            {error}
          </p>
        )}

        <div className="space-y-5">

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-slate-700">
              Email address
            </label>
            <div className="relative">
              <Mail size={18} className={iconClass} />
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={function (e) {
                  setFormData({ ...formData, email: e.target.value })
                }}
                className={inputClass + " pr-4"}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-slate-700">
              Password
            </label>
            <div className="relative">
              <Lock size={18} className={iconClass} />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={function (e) {
                  setFormData({ ...formData, password: e.target.value })
                }}
                className={inputClass + " pr-12"}
              />
              <button
                type="button"
                onClick={function () { setShowPassword(!showPassword) }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full rounded-xl bg-blue-950 py-3.5 text-base font-semibold text-white transition-colors hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

      </form>

    </div>
  )
}

export default AdminLogin