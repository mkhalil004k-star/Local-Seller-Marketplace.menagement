import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


// onDone aur onCancel tab aate hain jab ye popup ke andar khula ho.
// /CreateSeller ka alag page pehle ki tarah hi chalta hai.
function CreateSeller({ onDone, onCancel }) {

  let navigate = useNavigate()

  let inModal = Boolean(onDone)

  let [shopName, setShopName] = useState("")
  let [ownerName, setOwnerName] = useState("")
  let [phone, setPhone] = useState("")
  let [city, setCity] = useState("")
  let [imageUrl, setImageUrl] = useState(null)
  let [notes, setNotes] = useState("")


  async function handleSubmite() {

    if (!shopName || !ownerName || !phone || !city || !imageUrl || !notes) {
      alert("Please fill all fields")
      return
    }

    let formData = new FormData()

    formData.append("shopName", shopName)
    formData.append("ownerName", ownerName)
    formData.append("phone", phone)
    formData.append("city", city)
    formData.append("image", imageUrl)
    formData.append("notes", notes)


    try {

      let response = await axios.post(
        import.meta.env.VITE_beckend_base_URL + "/sellers/sellerCreate",
        formData,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          },
          withCredentials: true
        }
      )


      console.log(response.data)


      if (response.data.success == true) {

        alert("Seller created successfully")

        if (inModal) {
          onDone()
        } else {
          navigate("/AllSellers")
        }

      } else {

        alert(response.data.message)

      }


    } catch (error) {

      console.log(error)

      if (error.response) {

        console.log(error.response.data)

        alert(
          error.response.data.message ||
          "Something went wrong"
        )

      } else {

        alert("Something went wrong")

      }

    }

  }


  function handleBack() {

    if (inModal) {
      onCancel && onCancel()
    } else {
      navigate('/AllSellers')
    }

  }


  let inputClass =
    "w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-600 transition-colors"


  let labelClass =
    "block text-xs font-semibold text-gray-500 uppercase mb-1"


  // Popup mein sirf form, alag page par poora card
  let wrapperClass = inModal
    ? ''
    : 'min-h-screen w-full bg-gray-100 flex items-center justify-center p-6'

  let cardClass = inModal
    ? ''
    : 'w-full max-w-xl bg-white border border-gray-200 rounded-2xl shadow-lg p-8'


  return (

    <div className={wrapperClass}>

      <div className={cardClass}>


        {!inModal && (

          <h1 className='text-2xl font-bold text-gray-900'>
            Create Seller
          </h1>

        )}


        <p className={inModal ? 'mb-5 text-sm text-gray-500' : 'mt-1 mb-6 text-sm text-gray-500'}>
          Apni dukaan ki details bhariye
        </p>



        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>


          {/* Shop Name */}

          <div>

            <label className={labelClass}>
              Shop Name
            </label>

            <input
              type="text"
              required
              placeholder='enter shop name'
              value={shopName}
              onChange={(event) => {
                setShopName(event.target.value)
              }}
              className={inputClass}
            />

          </div>



          {/* Owner Name */}

          <div>

            <label className={labelClass}>
              Owner Name
            </label>

            <input
              type="text"
              required
              placeholder='enter owner name'
              value={ownerName}
              onChange={(event) => {
                setOwnerName(event.target.value)
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
              required
              placeholder='enter phone'
              value={phone}
              onChange={(event) => {
                setPhone(event.target.value)
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
              required
              placeholder='enter city'
              value={city}
              onChange={(event) => {
                setCity(event.target.value)
              }}
              className={inputClass}
            />

          </div>



          {/* Image */}

          <div className='sm:col-span-2'>

            <label className={labelClass}>
              Shop Image
            </label>


            <input
              type="file"
              required
              accept="image/*"
              onChange={(event) => {

                setImageUrl(event.target.files[0])

              }}
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



          {/* Notes */}

          <div className='sm:col-span-2'>

            <label className={labelClass}>
              Notes
            </label>


            <textarea
              rows="3"
              required
              placeholder='enter notes'
              value={notes}
              onChange={(event) => {
                setNotes(event.target.value)
              }}
              className={inputClass}
            />

          </div>


        </div>



        {/* Buttons */}

        <div className='flex gap-3 mt-6'>


          <button
            onClick={handleBack}
            className="w-1/3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
          >
            {inModal ? 'Cancel' : 'Back'}
          </button>



          <button
            onClick={handleSubmite}
            className="w-2/3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
          >
            Create Seller
          </button>


        </div>


      </div>

    </div>

  )
}


export default CreateSeller