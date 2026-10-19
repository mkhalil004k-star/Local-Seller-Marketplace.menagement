import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'

function Profile() {
  const navigate = useNavigate()
  const role = localStorage.getItem('role')

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  // Har role ke badge ka rang
  const roleColors = {
    seller: 'bg-blue-50 text-blue-700 ring-blue-200',
    buyer: 'bg-violet-50 text-violet-700 ring-violet-200',
    admin: 'bg-amber-50 text-amber-700 ring-amber-200',
  }

  useEffect(() => {
    async function getAllProfiles() {
      // 1. Ye page sirf admin ke liye hai, baqi ko unke page par bhej do
      if (role !== 'admin') {
        if (role === 'seller') navigate('/AllSellers')
        else if (role === 'buyer') navigate('/AllBuyers')
        else navigate('/login')
        return
      }

      // 2. Admin hai to server se saari profiles mangwao
      try {
        const response = await axios.get(
          import.meta.env.VITE_beckend_base_URL + '/auth/admin/allProfiles',
          { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } }
        )

        if (response.data.success === true) {
          setUsers(response.data.users)
        }
      } catch (error) {
        console.log(error)
        // Token kharab ho to dobara login karwao
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('role')
          navigate('/login')
        }
      } finally {
        setLoading(false)
      }
    }

    getAllProfiles()
  }, [])

  // Counts for the top strip and filter tabs
  const sellerCount = users.filter((u) => u.role === 'seller').length
  const buyerCount = users.filter((u) => u.role === 'buyer').length

  // Apply the role filter and the search text
  const text = search.trim().toLowerCase()
  const visibleUsers = users.filter((u) => {
    const matchesRole = filter === 'all' || u.role === filter
    const matchesText = (u.name ?? '').toLowerCase().includes(text) || (u.email ?? '').toLowerCase().includes(text)
    return matchesRole && matchesText
  })

  const tabs = [
    { key: 'all', label: 'All', count: users.length },
    { key: 'seller', label: 'Sellers', count: sellerCount },
    { key: 'buyer', label: 'Buyers', count: buyerCount },
  ]

  return (
    <div className='min-h-screen flex-1 bg-slate-50 p-6 md:p-10'>

      {/* Heading */}
      <div className='mb-8'>
        <h1 className='text-3xl font-extrabold text-blue-950'>All Profiles</h1>
        <p className='mt-1 text-slate-600'>Every seller and buyer registered on LocalMart.</p>
      </div>

      {/* Count strip */}
      <div className='mb-8 grid grid-cols-3 divide-x divide-slate-200 rounded-2xl bg-white py-5 shadow-sm ring-1 ring-slate-200'>
        <div className='px-6'>
          <p className='text-3xl font-extrabold text-blue-950'>{users.length}</p>
          <p className='text-sm text-slate-500'>Total users</p>
        </div>
        <div className='px-6'>
          <p className='text-3xl font-extrabold text-blue-700'>{sellerCount}</p>
          <p className='text-sm text-slate-500'>Sellers</p>
        </div>
        <div className='px-6'>
          <p className='text-3xl font-extrabold text-violet-700'>{buyerCount}</p>
          <p className='text-sm text-slate-500'>Buyers</p>
        </div>
      </div>

      {/* Search + role filter */}
      <div className='mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div className='relative w-full sm:max-w-sm'>
          <Search size={18} className='pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400' />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search by name or email'
            aria-label='Search profiles'
            className='w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100'
          />
        </div>

        <div role='tablist' aria-label='Filter by role' className='inline-flex w-fit rounded-full bg-slate-200/70 p-1'>
          {tabs.map((t) => (
            <button
              key={t.key}
              role='tab'
              aria-selected={filter === t.key}
              onClick={() => setFilter(t.key)}
              className={
                'cursor-pointer rounded-full px-4 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ' +
                (filter === t.key ? 'bg-blue-950 text-white shadow' : 'text-slate-600 hover:text-blue-950')
              }
            >
              {t.label} <span className='opacity-70'>{t.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className='overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-slate-200'>
        <table className='w-full min-w-[640px]'>

          <thead>
            <tr className='border-b border-slate-200 bg-slate-100/70 text-left text-sm font-semibold text-slate-600'>
              <th className='w-16 px-6 py-3.5'>#</th>
              <th className='px-6 py-3.5'>Name</th>
              <th className='px-6 py-3.5'>Email</th>
              <th className='px-6 py-3.5'>Role</th>
            </tr>
          </thead>

          <tbody className='divide-y divide-slate-100'>

            {loading && (
              <tr>
                <td colSpan='4' className='py-12 text-center text-slate-500'>Loading profiles...</td>
              </tr>
            )}

            {!loading && visibleUsers.length === 0 && (
              <tr>
                <td colSpan='4' className='py-12 text-center text-slate-500'>
                  {users.length === 0 ? 'No profiles yet.' : 'No profiles match your search.'}
                </td>
              </tr>
            )}

            {!loading && visibleUsers.map((user, index) => (
              <tr key={user._id} className='transition-colors hover:bg-slate-50'>
                <td className='px-6 py-4 text-sm text-slate-400'>{index + 1}</td>

                <td className='px-6 py-4'>
                  <div className='flex items-center gap-3'>
                    {/* Naam ka pehla harf gol circle mein */}
                    <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-800'>
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className='font-semibold text-blue-950'>{user.name}</span>
                  </div>
                </td>

                <td className='px-6 py-4 text-slate-600'>{user.email}</td>

                <td className='px-6 py-4'>
                  <span
                    className={
                      'rounded-full px-3 py-1 text-sm font-semibold capitalize ring-1 ring-inset ' +
                      (roleColors[user.role] ?? 'bg-slate-50 text-slate-700 ring-slate-200')
                    }
                  >
                    {user.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  )
}

export default Profile