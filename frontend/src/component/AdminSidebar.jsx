import React, { useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Users, List, ShoppingBag, Package, LogOut, Store } from 'lucide-react'

function AdminSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const role = localStorage.getItem('role')
  const path = location.pathname.toLowerCase()

  const [name, setName] = useState(localStorage.getItem('name') || '')

  useEffect(() => {
    function updateName() {
      setName(localStorage.getItem('name') || '')
    }
    updateName()
    window.addEventListener('name-updated', updateName)
    return () => window.removeEventListener('name-updated', updateName)
  }, [])

  // in pages par sidebar nahi dikhega
  if (
    path === '/' ||
    path === '/login' ||
    path === '/home' ||
    path.startsWith('/create') ||
    path.startsWith('/update')
  ) {
    return null
  }

  const sections = [
    // All Profiles sirf admin ko dikhega
    ...(role === 'admin'
      ? [
          {
            label: 'Overview',
            links: [{ to: '/profile', label: 'All Profiles', icon: Users }],
          },
        ]
      : []),
    {
      label: 'Manage',
      links: [
        { to: '/AllSellers', label: 'All Sellers', icon: List },
        { to: '/AllBuyers', label: 'All Buyers', icon: ShoppingBag },
        { to: '/products', label: 'All Products', icon: Package },
      ],
    },
  ]

  const linkClass = ({ isActive }) =>
    'group relative flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300 ' +
    (isActive
      ? 'bg-white/10 text-white'
      : 'text-blue-200 hover:bg-white/5 hover:text-white')

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('name')
    navigate('/login')
  }

  // Naam na ho to role ek hi dafa dikhao (double "Admin" na aaye)
  const roleLabel = role ? role.charAt(0).toUpperCase() + role.slice(1) : 'User'
  const title = name || roleLabel
  const initial = title.charAt(0).toUpperCase()

  return (
    <aside className='sticky top-0 flex h-screen w-64 shrink-0 flex-col bg-blue-950 p-5 text-white'>

      {/* Brand */}
      <button
        onClick={() => navigate('/')}
        className='mb-8 flex cursor-pointer items-center gap-3 rounded-lg px-1 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-300'
      >
        <span className='flex h-10 w-10 items-center justify-center rounded-full bg-white/15'>
          <Store size={20} />
        </span>
        <span className='text-lg font-bold'>
          Local<span className='text-sky-300'>Mart</span>
        </span>
      </button>

      {/* Profile card */}
      <div className='mb-8 flex items-center gap-3 rounded-2xl bg-white/5 p-3 ring-1 ring-white/10'>
        <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15 text-lg font-bold'>
          {initial}
        </div>
        <div className='min-w-0'>
          <h2 className='truncate text-sm font-semibold'>{title}</h2>
          {name && (
            <span className='mt-0.5 inline-block rounded-full bg-sky-300/15 px-2 py-0.5 text-xs font-medium text-sky-200'>
              {roleLabel}
            </span>
          )}
        </div>
      </div>

      {/* Links */}
      <nav className='flex-1 space-y-6 overflow-y-auto pr-1'>
        {sections.map((section) => (
          <div key={section.label}>
            <p className='mb-2 px-4 text-xs font-semibold text-blue-300/70'>
              {section.label}
            </p>
            <div className='flex flex-col gap-1'>
              {section.links.map(({ to, label, icon: Icon }) => (
                <NavLink key={to} to={to} className={linkClass}>
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className='absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-sky-300' />
                      )}
                      <Icon size={18} />
                      {label}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <button
        onClick={logout}
        className='mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/15 py-2.5 text-sm font-semibold text-blue-100 transition-colors hover:bg-red-500 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300'
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  )
}

export default AdminSidebar