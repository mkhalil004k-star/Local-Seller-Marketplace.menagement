import React, { useState } from 'react'
import axios from "axios"
import { useNavigate, Link } from 'react-router-dom'

function Registration() {

  let Navigate = useNavigate()

  let [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNo: "",
    cnicNo: "",
    role: "",
    password: ""
  })

  async function handleSubmite() {

    try {

      let response = await axios.post(
        import.meta.env.VITE_beckend_base_URL + "/auth/registration",
        formData,
        { withCredentials: true }
      )

      console.log(response.data)

      if (response.data.success == true) {

        localStorage.setItem("token", response.data.token)
        localStorage.setItem("role", response.data.role)

        // role ke hisaab se redirect
        if (response.data.role === "seller") {
          Navigate("/CreateSeller")
        } else {
          Navigate("/CreateBuyer")
        }

      } else {
        alert(response.data.message)
      }

    } catch (error) {

      console.log(error)

      if (error.response) {
        console.log(error.response.data)
        alert(error.response.data.message || "Something went wrong")
      } else {
        alert("Something went wrong")
      }

    }
  }

  let inputClass =
    "w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-600 transition-colors"

  return (

    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center p-6">

      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-lg p-8">

        {/* Heading */}

        <div className="text-center mb-8">

          <h1 className="text-3xl font-bold text-gray-900">
            Registration
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Local Seller Marketplace
          </p>

        </div>


        <div className="flex flex-col gap-4">

          {/* Name */}

          <input
            type="text"
            name="name"
            autoComplete="name"
            placeholder="Name"
            value={formData.name}
            onChange={function (event) {

              setFormData({
                ...formData,
                name: event.target.value
              })

            }}
            className={inputClass}
          />


          {/* Email */}

          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Email"
            value={formData.email}
            onChange={function (event) {

              setFormData({
                ...formData,
                email: event.target.value
              })

            }}
            className={inputClass}
          />


          {/* Phone */}

          <input
            type="text"
            name="phoneNo"
            autoComplete="tel"
            placeholder="Phone (03XXXXXXXXX)"
            value={formData.phoneNo}
            onChange={function (event) {

              setFormData({
                ...formData,
                phoneNo: event.target.value
              })

            }}
            className={inputClass}
          />


          {/* CNIC */}

          <input
            type="text"
            name="cnicNo"
            autoComplete="off"
            placeholder="CNIC (13 digits)"
            value={formData.cnicNo}
            onChange={function (event) {

              setFormData({
                ...formData,
                cnicNo: event.target.value
              })

            }}
            className={inputClass}
          />


          {/* Password */}

          <input
            type="password"
            name="password"
            autoComplete="new-password"
            placeholder="Password"
            value={formData.password}
            onChange={function (event) {

              setFormData({
                ...formData,
                password: event.target.value
              })

            }}
            className={inputClass}
          />


          {/* Role */}

          <select
            required
            value={formData.role}
            onChange={function (event) {

              setFormData({
                ...formData,
                role: event.target.value
              })

            }}
            className={inputClass + " text-gray-600"}
          >

            <option value="">
              Select Role
            </option>

            <option value="seller">
              Seller
            </option>

            <option value="buyer">
              Buyer
            </option>

          </select>


          {/* Register Button */}

          <button
            onClick={handleSubmite}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg text-sm transition-colors cursor-pointer"
          >
            Register
          </button>


          {/* Login */}

          <p className="text-center text-sm text-gray-500">

            Pehle se account hai?{" "}

            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Login Page
            </Link>

          </p>

        </div>

      </div>

    </div>
  )
}

export default Registration