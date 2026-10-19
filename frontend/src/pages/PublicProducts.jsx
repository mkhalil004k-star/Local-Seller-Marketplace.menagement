import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Store, Menu, X, ArrowLeftRight, MapPin, Search, Package, SlidersHorizontal } from 'lucide-react'
import Footer from '../component/Footer'

const PER_PAGE = 9

function PublicProducts() {

    const navigate = useNavigate()
    const base = import.meta.env.VITE_beckend_base_URL

    // Home ke Search button se aane wale filters URL se mil jate hain: /shop?category=Clothing&city=Bannu
    const [params] = useSearchParams()

    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [menuOpen, setMenuOpen] = useState(false)
    const [showFilters, setShowFilters] = useState(false)

    const [search, setSearch] = useState(params.get('search') || '')
    const [category, setCategory] = useState(params.get('category') || '')
    const [city, setCity] = useState(params.get('city') || '')
    const [minPrice, setMinPrice] = useState('')
    const [maxPrice, setMaxPrice] = useState('')
    const [sort, setSort] = useState('newest')
    const [page, setPage] = useState(1)

    useEffect(() => {
        async function getData() {
            try {
                setLoading(true)
                const res = await axios.get(base + '/product/public')
                setProducts(Array.isArray(res.data?.products) ? res.data.products : [])
            } catch (error) {
                console.error('Failed to load products', error)
            } finally {
                setLoading(false)
            }
        }
        getData()
        window.scrollTo(0, 0)
    }, [])

    // filters ki list products se hi bana lete hain
    const categories = [...new Set(products.map((p) => p.category).filter(Boolean))]
    const cities = [...new Set(products.map((p) => p.seller?.city).filter(Boolean))]

    // Filter
    let list = products.filter((p) => {
        if (search && !p.title?.toLowerCase().includes(search.toLowerCase())) return false
        if (category && p.category !== category) return false
        if (city && p.seller?.city !== city) return false
        if (minPrice !== '' && Number(p.price) < Number(minPrice)) return false
        if (maxPrice !== '' && Number(p.price) > Number(maxPrice)) return false
        return true
    })

    // Sort
    list = [...list].sort((a, b) => {
        if (sort === 'price_asc') return Number(a.price) - Number(b.price)
        if (sort === 'price_desc') return Number(b.price) - Number(a.price)
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    })

    const totalPages = Math.max(1, Math.ceil(list.length / PER_PAGE))
    const currentPage = Math.min(page, totalPages)
    const visible = list.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)

    const hasFilters = search || category || city || minPrice || maxPrice

    function clearAll() {
        setSearch('')
        setCategory('')
        setCity('')
        setMinPrice('')
        setMaxPrice('')
        setPage(1)
    }

    // filter badalne par page 1 par wapas
    function onFilter(setter) {
        return function (e) {
            setter(e.target.value)
            setPage(1)
        }
    }

    const navLinkClass =
        'text-sm font-semibold text-slate-700 hover:text-blue-700 transition-colors cursor-pointer'
    const fieldClass =
        'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 transition focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100'

    return (
        <div className='min-h-screen w-full bg-slate-50 text-slate-900'>

            {/* ================= Navbar ================= */}
            <header className='anim-fade-down sticky top-3 z-50 mx-3 sm:mx-6'>
                <nav className='mx-auto max-w-7xl rounded-2xl bg-white px-5 py-3 shadow-lg shadow-slate-900/10'>
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
                            <button onClick={() => navigate('/shop')} className={navLinkClass + ' !text-blue-700'}>Products</button>
                            <button onClick={() => navigate('/Home')} className={navLinkClass}>Sellers</button>
                        </div>

                        <button
                            onClick={() => navigate('/seller-register')}
                            className='hidden cursor-pointer items-center gap-2 rounded-xl bg-blue-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 active:scale-95 md:flex'
                        >
                            <ArrowLeftRight size={16} />
                            Switch to Seller
                        </button>

                        <button onClick={() => setMenuOpen(!menuOpen)} className='cursor-pointer text-blue-950 md:hidden' aria-label='Menu'>
                            {menuOpen ? <X size={26} /> : <Menu size={26} />}
                        </button>
                    </div>

                    {menuOpen && (
                        <div className='anim-fade-in mt-4 flex flex-col gap-4 border-t border-slate-100 pt-4 md:hidden'>
                            <button onClick={() => navigate('/Home')} className={navLinkClass + ' text-left'}>Home</button>
                            <button onClick={() => navigate('/shop')} className={navLinkClass + ' text-left'}>Products</button>
                            <button onClick={() => navigate('/seller-register')} className='rounded-xl bg-blue-900 py-2.5 text-sm font-semibold text-white'>
                                Switch to Seller
                            </button>
                        </div>
                    )}
                </nav>
            </header>

            {/* ================= Heading + search ================= */}
            <section className='mx-auto mt-6 max-w-7xl px-6 md:px-10'>
                <div className='anim-fade-up rounded-3xl bg-blue-950 px-6 py-10 text-white md:px-10'>
                    <h1 className='text-3xl font-extrabold md:text-5xl'>All products</h1>
                    <p className='mt-2 text-blue-200'>
                        {loading ? 'Load ho raha hai...' : list.length + ' products aapke sheher ke sellers se'}
                    </p>

                    <div className='mt-6 flex max-w-xl items-center gap-3 rounded-full bg-white px-5 py-3 transition focus-within:ring-4 focus-within:ring-blue-400/40'>
                        <Search size={18} className='text-slate-400' />
                        <input
                            value={search}
                            onChange={onFilter(setSearch)}
                            placeholder='Product ka naam likhein'
                            className='w-full bg-transparent text-slate-800 outline-none'
                        />
                    </div>
                </div>
            </section>

            <main className='mx-auto grid max-w-7xl gap-8 px-6 pb-16 pt-8 md:px-10 lg:grid-cols-[250px_1fr]'>

                {/* ================= Filters ================= */}
                <aside
                    style={{ animationDelay: '150ms' }}
                    className='anim-fade-up h-fit rounded-3xl bg-white p-5 shadow-sm'
                >
                    <div className='flex items-center justify-between'>
                        <h2 className='text-lg font-bold text-blue-950'>Filters</h2>
                        <div className='flex items-center gap-3'>
                            {hasFilters && (
                                <button onClick={clearAll} className='anim-fade-in cursor-pointer text-sm font-medium text-blue-700 hover:underline'>
                                    Clear all
                                </button>
                            )}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className='cursor-pointer text-blue-950 lg:hidden'
                                aria-label='Filters'
                            >
                                <SlidersHorizontal size={20} />
                            </button>
                        </div>
                    </div>

                    <div className={(showFilters ? 'anim-fade-in block' : 'hidden') + ' mt-5 space-y-5 lg:block'}>
                        <div>
                            <label className='mb-1 block text-sm font-medium text-slate-500'>Category</label>
                            <select value={category} onChange={onFilter(setCategory)} className={fieldClass}>
                                <option value=''>All categories</option>
                                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className='mb-1 block text-sm font-medium text-slate-500'>City</label>
                            <select value={city} onChange={onFilter(setCity)} className={fieldClass}>
                                <option value=''>All cities</option>
                                {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className='mb-1 block text-sm font-medium text-slate-500'>Price (Rs)</label>
                            <div className='flex gap-2'>
                                <input type='number' min='0' placeholder='Min' value={minPrice} onChange={onFilter(setMinPrice)} className={fieldClass} />
                                <input type='number' min='0' placeholder='Max' value={maxPrice} onChange={onFilter(setMaxPrice)} className={fieldClass} />
                            </div>
                        </div>
                    </div>
                </aside>

                {/* ================= Results ================= */}
                <section>
                    <div className='mb-5 flex items-center justify-between'>
                        <p className='text-sm text-slate-500'>{!loading && list.length + ' results'}</p>
                        <select value={sort} onChange={(e) => setSort(e.target.value)} className={fieldClass + ' !w-auto'}>
                            <option value='newest'>Newest</option>
                            <option value='price_asc'>Price: low to high</option>
                            <option value='price_desc'>Price: high to low</option>
                        </select>
                    </div>

                    {loading && (
                        <div className='grid gap-6 sm:grid-cols-2 xl:grid-cols-3'>
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className='animate-pulse overflow-hidden rounded-3xl bg-white shadow-sm'>
                                    <div className='h-48 bg-slate-200' />
                                    <div className='space-y-3 p-5'>
                                        <div className='h-4 w-3/4 rounded bg-slate-200' />
                                        <div className='h-4 w-1/3 rounded bg-slate-200' />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && list.length === 0 && (
                        <div className='anim-zoom-in rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center'>
                            <Package className='mx-auto mb-2 text-slate-300' size={36} />
                            <p className='font-semibold text-slate-700'>Koi product nahi mila</p>
                            <p className='mt-1 text-sm text-slate-500'>Filters kam karke dobara dekhein.</p>
                            {hasFilters && (
                                <button
                                    onClick={clearAll}
                                    className='mt-5 cursor-pointer rounded-xl bg-blue-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 active:scale-95'
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>
                    )}

                    {!loading && list.length > 0 && (
                        <div className='grid gap-6 sm:grid-cols-2 xl:grid-cols-3'>
                            {visible.map((p, i) => (
                                <div
                                    key={p._id}
                                    style={{ animationDelay: i * 60 + 'ms' }}
                                    onClick={() => navigate('/product/' + p._id)}
                                    className='anim-fade-up group flex cursor-pointer flex-col overflow-hidden rounded-3xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg'
                                >
                                    <div className='h-48 overflow-hidden bg-blue-950'>
                                        {p.imageUrl ? (
                                            <img
                                                src={p.imageUrl}
                                                alt={p.title}
                                                className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
                                            />
                                        ) : (
                                            <div className='flex h-full items-center justify-center text-blue-300'>No image</div>
                                        )}
                                    </div>

                                    <div className='flex flex-1 flex-col p-5'>
                                        {p.category && (
                                            <span className='w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700'>
                                                {p.category}
                                            </span>
                                        )}
                                        <h3 className='mt-2 line-clamp-1 text-lg font-bold text-blue-950'>{p.title}</h3>
                                        <p className='mt-1 text-xl font-extrabold text-blue-700'>Rs {Number(p.price).toLocaleString()}</p>
                                        <p className='mt-2 text-sm text-slate-500'>{p.seller?.name || 'Local Seller'}</p>
                                        {p.seller?.city && (
                                            <p className='mt-1 flex items-center gap-1 text-sm text-slate-500'>
                                                <MapPin size={14} /> {p.seller.city}
                                            </p>
                                        )}
                                        <button className='mt-4 w-full cursor-pointer rounded-xl bg-blue-900 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 active:scale-95'>
                                            View details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {!loading && totalPages > 1 && (
                        <div className='mt-8 flex items-center justify-center gap-4'>
                            <button
                                disabled={currentPage <= 1}
                                onClick={() => {
                                    setPage(currentPage - 1)
                                    window.scrollTo({ top: 0, behavior: 'smooth' })
                                }}
                                className='cursor-pointer rounded-xl bg-white px-5 py-2.5 text-sm font-semibold shadow-sm transition hover:bg-slate-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40'
                            >
                                Previous
                            </button>
                            <span className='text-sm text-slate-600'>Page {currentPage} of {totalPages}</span>
                            <button
                                disabled={currentPage >= totalPages}
                                onClick={() => {
                                    setPage(currentPage + 1)
                                    window.scrollTo({ top: 0, behavior: 'smooth' })
                                }}
                                className='cursor-pointer rounded-xl bg-white px-5 py-2.5 text-sm font-semibold shadow-sm transition hover:bg-slate-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40'
                            >
                                Next
                            </button>
                        </div>
                    )}
                </section>
            </main>

            {/* ================= Footer ================= */}
            <Footer />
        </div>
    )
}

export default PublicProducts