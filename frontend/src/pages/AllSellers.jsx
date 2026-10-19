import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, MapPin, Phone, User, Pencil, Trash2, Store } from 'lucide-react'
import Modal from '../component/Modal'
import CreateSeller from './CreateSeller'

function AllSellers() {

  let Navigate = useNavigate()
  let role = localStorage.getItem("role")
  let [seller, setSeller] = useState([])
  let [showCreate, setShowCreate] = useState(false)
  let [search, setSearch] = useState('')


  async function get() {

    try {

      let response = await axios.get(
        import.meta.env.VITE_beckend_base_URL + "/sellers/sellerAll",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          },
          withCredentials: true
        }
      )

      let sellers = response.data?.data

      setSeller(Array.isArray(sellers) ? sellers : [])

    } catch (error) {

      console.error("Failed to load sellers", error)

      setSeller([])

    }

  }



  async function deleteSeller(id) {

    try {

      let response = await axios.post(
        import.meta.env.VITE_beckend_base_URL + "/sellers/sellerDelete",
        {
          id: id
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          },
          withCredentials: true
        }
      )


      if (response.data.success == true) {

        get()

      } else {

        alert(response.data.message)

      }

    } catch (error) {

      console.error("Failed to delete seller", error)

      alert(
        error.response?.data?.message ||
        "Failed to delete seller"
      )

    }

  }



  // Ye page sirf admin ke liye hai, baqi ko bhej do
  useEffect(() => {

    if (role !== "admin") {

      if (role === "seller" || role === "buyer") {
        Navigate("/MyProfile", { replace: true })
      } else {
        Navigate("/login", { replace: true })
      }

      return

    }

    get()

  }, [])


  // Admin nahi hai to kuch bhi dikhao mat
  if (role !== "admin") {
    return null
  }



  // Stats

  let totalSellers = seller.length


  let totalCities = new Set(
    seller
      .map((s) => s.city)
      .filter(Boolean)
  ).size


  let withImage = seller.filter(
    (s) => s.imageUrl
  ).length


  let stats = [
    { label: 'Total sellers', value: totalSellers },
    { label: 'Cities covered', value: totalCities },
    { label: 'With shop image', value: withImage },
  ]


  // Search: shop name, owner name or city
  let text = search.trim().toLowerCase()

  let visibleSellers = seller.filter((s) => {
    return (
      (s.shopName ?? '').toLowerCase().includes(text) ||
      (s.ownerName ?? '').toLowerCase().includes(text) ||
      (s.city ?? '').toLowerCase().includes(text)
    )
  })


  return (

    <div className='min-h-screen w-full bg-slate-50 p-6 md:p-10'>


      {/* Header */}

      <div className='mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>

        <div>
          <h1 className='text-3xl font-extrabold text-blue-950'>
            All Sellers
          </h1>
          <p className='mt-1 text-slate-600'>
            Every shop registered on LocalMart.
          </p>
        </div>

        <button
          onClick={function () {
            setShowCreate(true)
          }}
          className='flex w-fit cursor-pointer items-center gap-2 rounded-xl bg-blue-950 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
        >
          <Plus size={18} />
          Add seller
        </button>

      </div>



      {/* Stats strip */}

      <div className='mb-8 grid grid-cols-3 divide-x divide-slate-200 rounded-2xl bg-white py-5 shadow-sm ring-1 ring-slate-200'>

        {stats.map((s) => (
          <div key={s.label} className='px-4 sm:px-6'>
            <p className='text-3xl font-extrabold text-blue-950'>{s.value}</p>
            <p className='text-sm text-slate-500'>{s.label}</p>
          </div>
        ))}

      </div>



      {/* Search */}

      {seller.length > 0 && (
        <div className='relative mb-6 w-full sm:max-w-sm'>
          <Search size={18} className='pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400' />
          <input
            value={search}
            onChange={function (e) {
              setSearch(e.target.value)
            }}
            placeholder='Search by shop, owner or city'
            aria-label='Search sellers'
            className='w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100'
          />
        </div>
      )}



      {/* Empty states */}

      {seller.length === 0 && (

        <div className='rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center'>
          <h3 className='text-lg font-semibold text-blue-950'>
            No sellers yet
          </h3>
          <p className='mt-1 text-sm text-slate-500'>
            Click "Add seller" above to create the first one.
          </p>
        </div>

      )}

      {seller.length > 0 && visibleSellers.length === 0 && (

        <div className='rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center'>
          <h3 className='text-lg font-semibold text-blue-950'>
            No sellers match your search
          </h3>
          <p className='mt-1 text-sm text-slate-500'>
            Try a different shop name, owner or city.
          </p>
        </div>

      )}



      {/* Seller cards */}

      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3'>

        {visibleSellers.map((eachData, index) => {

          return (

            <div
              key={eachData._id || index}
              className='flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200'
            >

              {/* Image (placeholder if missing) */}

              {eachData.imageUrl ? (
                <img
                  src={eachData.imageUrl}
                  alt={'Photo of ' + eachData.shopName}
                  className='h-44 w-full bg-slate-200 object-cover'
                />
              ) : (
                <div className='flex h-44 w-full items-center justify-center bg-blue-50 text-blue-300'>
                  <Store size={44} />
                </div>
              )}


              <div className='flex flex-1 flex-col gap-3 p-5'>

                {/* Shop name + city */}

                <div className='flex items-start justify-between gap-3'>

                  <h2 className='truncate text-lg font-bold text-blue-950'>
                    {eachData.shopName}
                  </h2>

                  {eachData.city && (
                    <span className='flex shrink-0 items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700'>
                      <MapPin size={12} />
                      {eachData.city}
                    </span>
                  )}

                </div>


                {/* Owner + phone */}

                <div className='flex flex-col gap-1.5 text-sm text-slate-600'>
                  <p className='flex items-center gap-2'>
                    <User size={15} className='text-slate-400' />
                    {eachData.ownerName}
                  </p>
                  <p className='flex items-center gap-2'>
                    <Phone size={15} className='text-slate-400' />
                    {eachData.phone}
                  </p>
                </div>


                {/* Notes */}

                {eachData.notes && (
                  <p className='line-clamp-2 text-sm text-slate-500'>
                    {eachData.notes}
                  </p>
                )}


                {/* Buttons */}

                <div className='mt-auto flex gap-3 pt-3'>

                  <button
                    onClick={function () {
                      Navigate(`/UpdateSeller/${eachData._id}`)
                    }}
                    className='flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-950 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                  >
                    <Pencil size={15} />
                    Update
                  </button>

                  <button
                    onClick={function () {
                      if (window.confirm('Delete "' + eachData.shopName + '"? This cannot be undone.')) {
                        deleteSeller(eachData._id)
                      }
                    }}
                    className='flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-red-300 bg-white py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500'
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>

                </div>

              </div>

            </div>

          )

        })}

      </div>



      {/* Add Seller popup */}

      <Modal
        open={showCreate}
        onClose={function () {
          setShowCreate(false)
        }}
        title="Create seller"
      >

        <CreateSeller
          onDone={function () {
            setShowCreate(false)
            get()
          }}
          onCancel={function () {
            setShowCreate(false)
          }}
        />

      </Modal>


    </div>

  )

}

export default AllSellers