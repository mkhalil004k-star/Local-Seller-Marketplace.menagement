import React, { useEffect } from 'react'
import axios from 'axios';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function UpdateSeller() {

  let params = useParams()
  let Navigate = useNavigate();

  let [formData, setFormData] = useState({
    shopName: "",
    ownerName: "",
    phone: "",
    city: "",
    notes: "",
  })

  let [newImage, setNewImage] = useState(null)

  async function getOneSeller() {
    try {
      let response = await axios.get(
        import.meta.env.VITE_beckend_base_URL + "/sellers/sellerOne",
        {
          params: { id: params.id },
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          },
          withCredentials: true
        }
      );

      setFormData({
        shopName: response.data.data.shopName || "",
        ownerName: response.data.data.ownerName || "",
        phone: response.data.data.phone || "",
        city: response.data.data.city || "",
        notes: response.data.data.notes || "",
      })

    } catch (error) {
      console.error("Failed to load seller", error)
    }
  }

  useEffect(() => {
    getOneSeller()
  }, [])

  async function handleSbmit() {

    let data = new FormData();

    data.append("id", params.id);
    data.append("shopName", formData.shopName);
    data.append("ownerName", formData.ownerName);
    data.append("phone", formData.phone);
    data.append("city", formData.city);
    data.append("notes", formData.notes);

    if (newImage) {
      data.append("image", newImage);
    }

    try {

      let response = await axios.post(
        import.meta.env.VITE_beckend_base_URL + "/sellers/sellerUpdate",
        data,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          },
          withCredentials: true
        }
      )

      if (response.data.success == true) {
        Navigate('/AllSellers')
      } else {
        alert(response.data.message)
      }

    } catch (error) {
      console.error("Failed to update seller", error)
      alert(error.response?.data?.message || "Failed to update seller")
    }
  }

  let inputClass = "w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-600 transition-colors"

  let labelClass = "block text-xs font-semibold text-gray-500 uppercase mb-1"

  return (
    <div className='min-h-screen w-full bg-gray-100 flex items-center justify-center p-6'>

      <div className='w-full max-w-xl bg-white border border-gray-200 rounded-2xl shadow-lg p-8'>

        <h1 className='text-2xl font-bold text-gray-900'>
          Update Seller
        </h1>

        <p className='mt-1 mb-6 text-sm text-gray-500'>
          Edit the shop details and click Update
        </p>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>

          <div>
            <label className={labelClass}>Shop Name</label>

            <input
              type="text"
              placeholder='enter shop name'
              value={formData.shopName}
              onChange={function (event) {
                setFormData({
                  ...formData,
                  shopName: event.target.value
                })
              }}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Owner Name</label>

            <input
              type="text"
              placeholder='enter owner name'
              value={formData.ownerName}
              onChange={function (event) {
                setFormData({
                  ...formData,
                  ownerName: event.target.value
                })
              }}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Phone</label>

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

          <div>
            <label className={labelClass}>City</label>

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

          <div className='sm:col-span-2'>

            <label className={labelClass}>
              Shop Image (select only to change)
            </label>

            <input
              type="file"
              onChange={function (event) {
                setNewImage(event.target.files[0])
              }}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-600 cursor-pointer file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-blue-600 file:text-white file:text-xs file:font-semibold hover:file:bg-blue-700"
            />

          </div>

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

        <div className='flex gap-3 mt-6'>

          <button
            onClick={() => Navigate('/AllSellers')}
            className="w-1/3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
          >
            Back
          </button>

          <button
            onClick={handleSbmit}
            className="w-2/3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
          >
            Update Seller
          </button>

        </div>

      </div>

    </div>
  )
}

export default UpdateSeller