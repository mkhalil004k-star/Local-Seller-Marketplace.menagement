import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, MapPin, Phone, Home as HomeIcon, Pencil, Trash2, User } from 'lucide-react'

function AllBuyers() {

  let Navigate = useNavigate()
  let [buyer, setBuyer] = useState([])
  let [search, setSearch] = useState('')

  async function get() {
    try {

      let response = await axios.get(
        import.meta.env.VITE_beckend_base_URL + "/buyers/buyerAll",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          },
          withCredentials: true
        }
      )

      let buyers = response.data?.data

      setBuyer(Array.isArray(buyers) ? buyers : [])

    } catch (error) {

      console.error("Failed to load buyers", error)

      setBuyer([])

    }
  }


  async function deleteBuyer(id) {
    try {

      let response = await axios.post(
        import.meta.env.VITE_beckend_base_URL + "/buyers/buyerDelete",
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

      console.error("Failed to delete buyer", error)

      alert(
        error.response?.data?.message ||
        "Failed to delete buyer"
      )

    }
  }


  useEffect(() => {
    get()
  }, [])


  // stats

  let totalBuyers = buyer.length

  let totalCities = new Set(
    buyer
      .map((b) => b.city)
      .filter(Boolean)
  ).size

  let withImage = buyer.filter(
    (b) => b.imageUrl
  ).length


  let stats = [
    { label: 'Total buyers', value: totalBuyers },
    { label: 'Cities covered', value: totalCities },
    { label: 'With photo', value: withImage },
  ]


  // Search: name, city or address
  let text = search.trim().toLowerCase()

  let visibleBuyers = buyer.filter((b) => {
    return (
      (b.name ?? '').toLowerCase().includes(text) ||
      (b.city ?? '').toLowerCase().includes(text) ||
      (b.address ?? '').toLowerCase().includes(text)
    )
  })


  return (

    <div className='min-h-screen w-full bg-slate-50 p-6 md:p-10'>

      {/* Header */}

      <div className='mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>

        <div>
          <h1 className='text-3xl font-extrabold text-blue-950'>
            All Buyers
          </h1>
          <p className='mt-1 text-slate-600'>
            Every buyer registered on LocalMart.
          </p>
        </div>

        <button
          onClick={function () {
            Navigate('/CreateBuyer')
          }}
          className='flex w-fit cursor-pointer items-center gap-2 rounded-xl bg-blue-950 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
        >
          <Plus size={18} />
          Add buyer
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

      {buyer.length > 0 && (
        <div className='relative mb-6 w-full sm:max-w-sm'>
          <Search size={18} className='pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400' />
          <input
            value={search}
            onChange={function (e) {
              setSearch(e.target.value)
            }}
            placeholder='Search by name, city or address'
            aria-label='Search buyers'
            className='w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100'
          />
        </div>
      )}


      {/* Empty states */}

      {buyer.length === 0 && (

        <div className='rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center'>
          <h3 className='text-lg font-semibold text-blue-950'>
            No buyers yet
          </h3>
          <p className='mt-1 text-sm text-slate-500'>
            Click "Add buyer" above to create the first one.
          </p>
        </div>

      )}

      {buyer.length > 0 && visibleBuyers.length === 0 && (

        <div className='rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center'>
          <h3 className='text-lg font-semibold text-blue-950'>
            No buyers match your search
          </h3>
          <p className='mt-1 text-sm text-slate-500'>
            Try a different name, city or address.
          </p>
        </div>

      )}


      {/* Buyer cards */}

      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3'>

        {visibleBuyers.map((eachData, index) => {

          return (

            <div
              key={eachData._id || index}
              className='flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200'
            >

              {/* Image (placeholder if missing) */}

              {eachData.imageUrl ? (
                <img
                  src={eachData.imageUrl}
                  alt={'Photo of ' + eachData.name}
                  className='h-44 w-full bg-slate-200 object-cover'
                />
              ) : (
                <div className='flex h-44 w-full items-center justify-center bg-blue-50 text-blue-300'>
                  <User size={44} />
                </div>
              )}


              <div className='flex flex-1 flex-col gap-3 p-5'>

                {/* Name + city */}

                <div className='flex items-start justify-between gap-3'>

                  <h2 className='truncate text-lg font-bold text-blue-950'>
                    {eachData.name}
                  </h2>

                  {eachData.city && (
                    <span className='flex shrink-0 items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700'>
                      <MapPin size={12} />
                      {eachData.city}
                    </span>
                  )}

                </div>


                {/* Phone + address */}

                <div className='flex flex-col gap-1.5 text-sm text-slate-600'>
                  <p className='flex items-center gap-2'>
                    <Phone size={15} className='shrink-0 text-slate-400' />
                    {eachData.phone}
                  </p>
                  <p className='flex items-start gap-2'>
                    <HomeIcon size={15} className='mt-0.5 shrink-0 text-slate-400' />
                    {eachData.address}
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
                      Navigate(`/UpdateBuyer/${eachData._id}`)
                    }}
                    className='flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-950 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                  >
                    <Pencil size={15} />
                    Update
                  </button>

                  <button
                    onClick={function () {
                      if (window.confirm('Delete "' + eachData.name + '"? This cannot be undone.')) {
                        deleteBuyer(eachData._id)
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

    </div>

  )
}

export default AllBuyers