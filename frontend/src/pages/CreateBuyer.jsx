import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';


function CreateBuyer() {

  let navigate = useNavigate()
  let [name, setName] = useState("");
  let [phone, setPhone] = useState("");
  let [city, setCity] = useState("");
  let [address, setAddress] = useState("");
  let [imageUrl, setImageUrl] = useState(null);
  let [notes, setNotes] = useState("");


  async function handleSubmite() {

    let formData = new FormData();

    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("city", city);
    formData.append("address", address);
    formData.append("image", imageUrl);
    formData.append("notes", notes);

    try {

      let response = await axios.post(
        import.meta.env.VITE_beckend_base_URL + "/buyers/buyerCreate",
        formData,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          },
          withCredentials: true
        }
      );

      if (response.data.success == true) {
        navigate('/AllBuyers')
      } else {
        alert(response.data.message)
      }

    } catch (error) {
      console.error("Failed to create buyer", error)
      alert(error.response?.data?.message || "Failed to create buyer")
    }
  }

  let inputClass = "w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-600 transition-colors"
  let labelClass = "block text-xs font-semibold text-gray-500 uppercase mb-1"

  return (
    <div className='min-h-screen w-full bg-gray-100 flex items-center justify-center p-6'>

      <div className='w-full max-w-xl bg-white border border-gray-200 rounded-2xl shadow-lg p-8'>

        <h1 className='text-2xl font-bold text-gray-900'>Create Buyer</h1>
        <p className='mt-1 mb-6 text-sm text-gray-500'>Apni details bhariye</p>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>

          <div>
            <label className={labelClass}>Name</label>
            <input
              type="text"
              required
              placeholder='enter name'
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Phone</label>
            <input
              type="text"
              required
              placeholder='enter phone'
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>City</label>
            <input
              type="text"
              required
              placeholder='enter city'
              value={city}
              onChange={(event) => setCity(event.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Address</label>
            <input
              type="text"
              required
              placeholder='enter address'
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              className={inputClass}
            />
          </div>

          <div className='sm:col-span-2'>
            <label className={labelClass}>Buyer Image</label>
            <input
              type="file"
              required
              onChange={(event) => setImageUrl(event.target.files[0])}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-600 cursor-pointer file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-blue-600 file:text-white file:text-xs file:font-semibold hover:file:bg-blue-700"
            />
            {imageUrl && (
              <img
                src={URL.createObjectURL(imageUrl)}
                alt="preview"
                className='mt-3 h-24 w-24 rounded-lg object-cover border border-gray-200'
              />
            )}
          </div>

          <div className='sm:col-span-2'>
            <label className={labelClass}>Notes</label>
            <textarea
              rows="3"
              required
              placeholder='enter notes'
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              className={inputClass}
            />
          </div>

        </div>

        <div className='flex gap-3 mt-6'>
          <button
            onClick={() => navigate('/AllBuyers')}
            className="w-1/3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
          >
            Back
          </button>
          <button
            onClick={handleSubmite}
            className="w-2/3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
          >
            Create Buyer
          </button>
        </div>

      </div>
    </div>
  )
}

export default CreateBuyer;