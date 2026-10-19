import React, { useEffect } from 'react'
import axios from 'axios'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function UpdateBuyer() {

  let params = useParams()
  let Navigate = useNavigate()

  let [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    address: "",
    notes: "",
  })

  let [newImage, setNewImage] = useState(null)


  async function getOneBuyer() {

    try {

      let response = await axios.get(
        import.meta.env.VITE_beckend_base_URL + "/buyers/buyerOne",
        {
          params: {
            id: params.id
          },
          withCredentials: true
        }
      )

      setFormData({
        name: response.data.data.name || "",
        phone: response.data.data.phone || "",
        city: response.data.data.city || "",
        address: response.data.data.address || "",
        notes: response.data.data.notes || "",
      })

    } catch (error) {

      console.error("Failed to load buyer", error)

    }
  }


  useEffect(() => {
    getOneBuyer()
  }, [])


  async function handleSbmit() {

    let data = new FormData()

    data.append("id", params.id)
    data.append("name", formData.name)
    data.append("phone", formData.phone)
    data.append("city", formData.city)
    data.append("address", formData.address)
    data.append("notes", formData.notes)

    if (newImage) {
      data.append("image", newImage)
    }


    try {

      let response = await axios.post(
        import.meta.env.VITE_beckend_base_URL + "/buyers/buyerUpdate",
        data,
        {
          withCredentials: true
        }
      )


      if (response.data.success == true) {

        Navigate('/AllBuyers')

      } else {

        alert(response.data.message)

      }

    } catch (error) {

      console.error("Failed to update buyer", error)

      alert(
        error.response?.data?.message ||
        "Something went wrong"
      )

    }
  }


  let inputClass =
    "w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-600 transition-colors"

  let labelClass =
    "block text-xs font-semibold text-gray-500 uppercase mb-1"


  return (

    <div className='min-h-screen w-full bg-gray-100 flex items-center justify-center p-6'>

      <div className='w-full max-w-xl bg-white border border-gray-200 rounded-2xl shadow-lg p-8'>


        <h1 className='text-2xl font-bold text-gray-900'>
          Update Buyer
        </h1>

        <p className='mt-1 mb-6 text-sm text-gray-500'>
          Edit the details and click Update
        </p>


        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>


          {/* Name */}

          <div>

            <label className={labelClass}>
              Name
            </label>

            <input
              type="text"
              placeholder='enter name'
              value={formData.name}
              onChange={function (event) {

                setFormData({
                  ...formData,
                  name: event.target.value
                })

              }}
              className={inputClass}
            />

          </div>


          {/* Phone */}

          <div>

            <label className={labelClass}>
              Phone
            </label>

            <input
              type="text"
              placeholder='enter phone'
              value={formData.phone}
              onChange={function (event) {

                setFormData({
                  ...formData,
                  phone: event.target.value
                })

              }}
              className={inputClass}
            />

          </div>


          {/* City */}

          <div>

            <label className={labelClass}>
              City
            </label>

            <input
              type="text"
              placeholder='enter city'
              value={formData.city}
              onChange={function (event) {

                setFormData({
                  ...formData,
                  city: event.target.value
                })

              }}
              className={inputClass}
            />

          </div>


          {/* Address */}

          <div>

            <label className={labelClass}>
              Address
            </label>

            <input
              type="text"
              placeholder='enter address'
              value={formData.address}
              onChange={function (event) {

                setFormData({
                  ...formData,
                  address: event.target.value
                })

              }}
              className={inputClass}
            />

          </div>


          {/* Image */}

          <div className='sm:col-span-2'>

            <label className={labelClass}>
              Buyer Image (select only to change)
            </label>

            <input
              type="file"
              onChange={function (event) {

                setNewImage(event.target.files[0])

              }}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-600 cursor-pointer file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-blue-600 file:text-white file:text-xs file:font-semibold hover:file:bg-blue-700"
            />

          </div>


          {/* Notes */}

          <div className='sm:col-span-2'>

            <label className={labelClass}>
              Notes
            </label>

            <textarea
              rows="3"
              placeholder='enter notes'
              value={formData.notes}
              onChange={function (event) {

                setFormData({
                  ...formData,
                  notes: event.target.value
                })

              }}
              className={inputClass}
            />

          </div>

        </div>


        {/* Buttons */}

        <div className='flex gap-3 mt-6'>

          <button
            onClick={function () {
              Navigate('/AllBuyers')
            }}
            className="w-1/3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
          >
            Back
          </button>


          <button
            onClick={handleSbmit}
            className="w-2/3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
          >
            Update Buyer
          </button>

        </div>


      </div>

    </div>

  )
}

export default UpdateBuyer