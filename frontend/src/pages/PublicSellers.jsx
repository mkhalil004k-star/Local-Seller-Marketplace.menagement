import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
    Store, Menu, X, ArrowLeftRight, MapPin, Search, Users,
    Phone, MessageCircle, Package, ChevronLeft, ChevronRight, SearchX
} from 'lucide-react'
import Footer from '../component/Footer'

const PER_PAGE = 9

function PublicSellers() {

    const navigate = useNavigate()
    const base = import.meta.env.VITE_beckend_base_URL
    const [params] = useSearchParams()

    const [sellers, setSellers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    const [search, setSearch] = useState(params.get('search') || '')
    const [city, setCity] = useState(params.get('city') || '')
    const [sort, setSort] = useState('products')
    const [page, setPage] = useState(1)

    useEffect(() => {
        async function getData() {
            try {
                setLoading(true)
                setError(false)
                const res = await axios.get(base + '/sellers/public')
                setSellers(Array.isArray(res.data?.data) ? res.data.data : [])
            } catch (err) {
                console.error('Failed to load sellers', err)
                setError(true)
            } finally {
                setLoading(false)
            }
        }
        getData()
        window.scrollTo(0, 0)
    }, [])

    // 03XX... -> 92XX... (WhatsApp format)
    function whatsappLink(phone) {
        const digits = String(phone).replace(/\D/g, '')
        const intl = digits.startsWith('0') ? '92' + digits.slice(1) : digits
        return 'https://wa.me/' + intl
    }

    function initials(name) {
        return String(name || '?')
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((w) => w[0].toUpperCase())
            .join('')
    }

    const cities = [...new Set(sellers.map((s) => s.city).filter(Boolean))]

    // Filter
    let list = sellers.filter((s) => {
        const text = ((s.shopName || '') + ' ' + (s.ownerName || '')).toLowerCase()
        if (search && !text.includes(search.toLowerCase())) return false
        if (city && s.city !== city) return false
        return true
    })

    // Sort
    list = [...list].sort((a, b) => {
        if (sort === 'name') return (a.shopName || '').localeCompare(b.shopName || '')
        if (sort === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        return (b.products?.length || 0) - (a.products?.length || 0)
    })

    const totalPages = Math.max(1, Math.ceil(list.length / PER_PAGE))
    const currentPage = Math.min(page, totalPages)
    const visible = list.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)
    const hasFilters = search || city

    function clearAll() {
        setSearch('')
        setCity('')
        setPage(1)
    }

    function onFilter(setter) {
        return function (e) {
            setter(e.target.value)
            setPage(1)
        }
    }

    function goToPage(n) {
        setPage(n)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const navLinkClass =
        'text-sm font-semibold text-slate-700 transition-colors hover:text-blue-700 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded'
    const selectClass =
        'cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20'

    return (
        <div className='min-h-screen w-full bg-slate-50 text-slate-900'>

            {/* ================= Navbar ================= */}
            <header className='sticky top-3 z-50 mx-3 sm:mx-6'>
                <nav className='mx-auto max-w-7xl rounded-2xl bg-white/95 px-5 py-3 shadow-lg shadow-slate-900/10 backdrop-blur'>
                    <div className='flex items-center justify-between'>
                        <button onClick={() => navigate('/Home')} className='flex cursor-pointer items-center gap-3'>
                            <span className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-950 text-white'>
                                <Store size={20} />
                            </span>
                            <span className='text-lg font-bold text-blue-950'>
                                Local<span className='text-blue-600'>Mart</span>
                            </span>
                        </button>

                        <div className='hidden items-center gap-8 md:flex'>
                            <button onClick={() => navigate('/Home')} className={navLinkClass}>Home</button>
                            <button onClick={() => navigate('/shop')} className={navLinkClass}>Products</button>
                            <button onClick={() => navigate('/sellers')} className={navLinkClass + ' !text-blue-700'}>Sellers</button>
                        </div>

                        <button
                            onClick={() => navigate('/seller-register')}
                            className='hidden cursor-pointer items-center gap-2 rounded-xl bg-blue-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 md:flex'
                        >
                            <ArrowLeftRight size={16} />
                            Switch to Seller
                        </button>

                        <button onClick={() => setMenuOpen(!menuOpen)} className='cursor-pointer text-blue-950 md:hidden' aria-label='Menu'>
                            {menuOpen ? <X size={26} /> : <Menu size={26} />}
                        </button>
                    </div>

                    {menuOpen && (
                        <div className='mt-4 flex flex-col gap-4 border-t border-slate-100 pt-4 md:hidden'>
                            <button onClick={() => navigate('/Home')} className={navLinkClass + ' text-left'}>Home</button>
                            <button onClick={() => navigate('/shop')} className={navLinkClass + ' text-left'}>Products</button>
                            <button onClick={() => navigate('/sellers')} className={navLinkClass + ' text-left !text-blue-700'}>Sellers</button>
                            <button onClick={() => navigate('/seller-register')} className='rounded-xl bg-blue-900 py-2.5 text-sm font-semibold text-white'>
                                Switch to Seller
                            </button>
                        </div>
                    )}
                </nav>
            </header>

            {/* ================= Hero + search ================= */}
            <section className='mx-auto mt-6 max-w-7xl px-4 sm:px-6 md:px-10'>
                <div className='relative overflow-hidden rounded-3xl bg-blue-950 px-6 py-10 text-white md:px-12 md:py-14'>
                    <div className='pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-blue-800/40' />
                    <div className='pointer-events-none absolute -bottom-24 right-32 h-56 w-56 rounded-full bg-blue-900/60' />

                    <div className='relative'>
                        <h1 className='text-3xl font-extrabold tracking-tight md:text-5xl'>Local sellers</h1>
                        <p className='mt-3 max-w-xl text-base text-blue-200 md:text-lg'>
                            {loading
                                ? 'Loading shops...'
                                : `${sellers.length} shops near you. Find one and contact them directly.`}
                        </p>

                        <div className='mt-8 flex flex-col gap-3 md:flex-row'>
                            <label className='flex flex-1 items-center gap-3 rounded-full bg-white px-5 py-3.5 shadow-lg shadow-blue-950/30 focus-within:ring-2 focus-within:ring-blue-400 md:max-w-xl'>
                                <Search size={18} className='shrink-0 text-slate-400' />
                                <input
                                    value={search}
                                    onChange={onFilter(setSearch)}
                                    placeholder='Search by shop or owner name'
                                    className='w-full bg-transparent text-slate-800 placeholder:text-slate-400 outline-none'
                                />
                                {search && (
                                    <button type='button' onClick={() => { setSearch(''); setPage(1) }} aria-label='Clear search' className='cursor-pointer text-slate-400 hover:text-slate-600'>
                                        <X size={16} />
                                    </button>
                                )}
                            </label>

                            <div className='relative'>
                                <MapPin size={16} className='pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400' />
                                <select
                                    value={city}
                                    onChange={onFilter(setCity)}
                                    className='w-full cursor-pointer appearance-none rounded-full bg-white py-3.5 pl-10 pr-10 text-slate-800 shadow-lg shadow-blue-950/30 outline-none focus:ring-2 focus:ring-blue-400 md:w-56'
                                >
                                    <option value=''>All cities</option>
                                    {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <main className='mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 md:px-10'>

                {/* Toolbar */}
                <div className='mb-6 flex flex-wrap items-center justify-between gap-3'>
                    <div className='flex items-center gap-4'>
                        <p className='text-sm font-medium text-slate-600'>
                            {!loading && !error && `${list.length} ${list.length === 1 ? 'seller' : 'sellers'}`}
                        </p>
                        {hasFilters && (
                            <button
                                onClick={clearAll}
                                className='flex cursor-pointer items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-100'
                            >
                                <X size={12} /> Clear filters
                            </button>
                        )}
                    </div>

                    <div className='flex items-center gap-2'>
                        <label htmlFor='sort' className='text-sm text-slate-500'>Sort by</label>
                        <select id='sort' value={sort} onChange={(e) => setSort(e.target.value)} className={selectClass}>
                            <option value='products'>Most products</option>
                            <option value='newest'>Newest</option>
                            <option value='name'>Name (A to Z)</option>
                        </select>
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className='animate-pulse overflow-hidden rounded-3xl border border-slate-200 bg-white'>
                                <div className='h-40 bg-slate-200' />
                                <div className='space-y-3 p-5 pt-10'>
                                    <div className='h-4 w-3/4 rounded bg-slate-200' />
                                    <div className='h-3 w-1/2 rounded bg-slate-200' />
                                    <div className='h-10 w-full rounded-xl bg-slate-100' />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className='rounded-3xl border border-red-100 bg-white py-16 text-center'>
                        <SearchX className='mx-auto mb-3 text-red-300' size={40} />
                        <p className='font-semibold text-slate-800'>Could not load sellers</p>
                        <p className='mt-1 text-sm text-slate-500'>Check your connection and try again.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className='mt-5 cursor-pointer rounded-xl bg-blue-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-800'
                        >
                            Try again
                        </button>
                    </div>
                )}

                {/* Empty */}
                {!loading && !error && list.length === 0 && (
                    <div className='rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center'>
                        <span className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100'>
                            <Users className='text-slate-400' size={28} />
                        </span>
                        <p className='text-lg font-semibold text-slate-800'>No sellers found</p>
                        <p className='mt-1 text-sm text-slate-500'>Try a different name or choose another city.</p>
                        {hasFilters && (
                            <button
                                onClick={clearAll}
                                className='mt-6 cursor-pointer rounded-xl bg-blue-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800'
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                )}

                {/* Seller cards */}
                {!loading && !error && list.length > 0 && (
                    <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                        {visible.map((s) => (
                            <article
                                key={s._id}
                                className='group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5'
                            >
                                {/* Cover */}
                                <div className='relative h-36 overflow-hidden bg-gradient-to-br from-blue-900 to-blue-950'>
                                    {s.imageUrl && (
                                        <img
                                            src={s.imageUrl}
                                            alt={s.shopName}
                                            loading='lazy'
                                            className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
                                        />
                                    )}
                                    {s.city && (
                                        <span className='absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm'>
                                            <MapPin size={12} className='text-blue-700' /> {s.city}
                                        </span>
                                    )}
                                </div>

                                {/* Avatar overlapping the cover */}
                                <div className='relative px-5'>
                                    <div className='-mt-8 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-blue-100 text-lg font-bold text-blue-900 shadow-md'>
                                        {s.imageUrl
                                            ? <img src={s.imageUrl} alt='' className='h-full w-full object-cover' />
                                            : initials(s.shopName)}
                                    </div>
                                </div>

                                <div className='flex flex-1 flex-col px-5 pb-5 pt-3'>
                                    <h3 className='truncate text-lg font-bold text-blue-950' title={s.shopName}>{s.shopName}</h3>
                                    <p className='mt-0.5 text-sm text-slate-500'>
                                        Owned by <span className='font-medium text-slate-700'>{s.ownerName}</span>
                                    </p>

                                    <p className='mt-3 line-clamp-2 min-h-[2.5rem] text-sm leading-5 text-slate-500'>
                                        {s.notes || 'No description added yet.'}
                                    </p>

                                    <div className='mt-4 flex items-center gap-2 border-t border-slate-100 pt-4'>
                                        <span className='flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800'>
                                            <Package size={13} />
                                            {s.products?.length || 0} {(s.products?.length || 0) === 1 ? 'product' : 'products'}
                                        </span>
                                    </div>

                                    {s.phone ? (
                                        <div className='mt-4 grid grid-cols-2 gap-3'>
                                            <a
                                                href={'tel:' + s.phone}
                                                className='flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800'
                                            >
                                                <Phone size={15} /> Call
                                            </a>
                                            <a
                                                href={whatsappLink(s.phone)}
                                                target='_blank'
                                                rel='noreferrer'
                                                className='flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700'
                                            >
                                                <MessageCircle size={15} /> WhatsApp
                                            </a>
                                        </div>
                                    ) : (
                                        <p className='mt-4 rounded-xl bg-slate-50 py-2.5 text-center text-sm text-slate-400'>
                                            No contact number
                                        </p>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {!loading && !error && totalPages > 1 && (
                    <nav className='mt-10 flex flex-wrap items-center justify-center gap-2' aria-label='Pagination'>
                        <button
                            disabled={currentPage <= 1}
                            onClick={() => goToPage(currentPage - 1)}
                            className='flex h-10 cursor-pointer items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40'
                        >
                            <ChevronLeft size={16} /> Previous
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                            <button
                                key={n}
                                onClick={() => goToPage(n)}
                                aria-current={n === currentPage ? 'page' : undefined}
                                className={
                                    'h-10 w-10 cursor-pointer rounded-xl text-sm font-semibold transition-colors ' +
                                    (n === currentPage
                                        ? 'bg-blue-900 text-white'
                                        : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100')
                                }
                            >
                                {n}
                            </button>
                        ))}

                        <button
                            disabled={currentPage >= totalPages}
                            onClick={() => goToPage(currentPage + 1)}
                            className='flex h-10 cursor-pointer items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40'
                        >
                            Next <ChevronRight size={16} />
                        </button>
                    </nav>
                )}
            </main>

            <Footer />
        </div>
    )
}

export default PublicSellers