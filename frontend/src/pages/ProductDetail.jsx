import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import {
    Store, Menu, X, ArrowLeft, ArrowLeftRight, MapPin, Share2, Phone, MessageCircle,
    Calendar, ChevronDown, ChevronUp, Package, Banknote, ShieldCheck, Maximize2,
    Minus, Plus, ImageOff,
} from 'lucide-react'
import BuyerRegisterModal from '../component/BuyerRegisterModal'
import Footer from '../component/Footer'

function ProductDetail() {

    const { id } = useParams()
    const navigate = useNavigate()
    const base = import.meta.env.VITE_beckend_base_URL

    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [menuOpen, setMenuOpen] = useState(false)
    const [tab, setTab] = useState('overview')
    const [readMore, setReadMore] = useState(false)
    const [fullscreen, setFullscreen] = useState(false)
    const [copied, setCopied] = useState(false)
    const [quantity, setQuantity] = useState(1)
    const [showRegister, setShowRegister] = useState(false)

    useEffect(() => {
        async function getData() {
            try {
                setLoading(true)
                const res = await axios.get(base + '/product/public')
                setProducts(Array.isArray(res.data?.products) ? res.data.products : [])
            } catch (error) {
                console.error('Failed to load product', error)
            } finally {
                setLoading(false)
            }
        }
        getData()
        setQuantity(1)
        window.scrollTo(0, 0)
    }, [id])

    // Escape dabane se fullscreen band
    useEffect(() => {
        if (!fullscreen) return
        function onKey(e) {
            if (e.key === 'Escape') setFullscreen(false)
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [fullscreen])

    const product = products.find((p) => p._id === id)

    // Isi category ki baaki products
    const similar = product
        ? products.filter((p) => p._id !== product._id && p.category === product.category).slice(0, 3)
        : []

    async function handleShare() {
        const url = window.location.href
        if (navigator.share) {
            try { await navigator.share({ title: product?.title, url }) } catch { /* user ne cancel kiya */ }
        } else {
            await navigator.clipboard.writeText(url)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    // Buy Now: role ke hisab se kaam
    function handleBuyNow() {
        const token = localStorage.getItem('token')
        const role = localStorage.getItem('role')

        // buyer login hai to seedha checkout
        if (token && role === 'buyer') {
            navigate('/checkout/' + product._id, { state: { quantity } })
            return
        }

        // seller ya admin login hai: logout kar ke buyer account banane ka option
        if (token && (role === 'seller' || role === 'admin')) {
            const ok = window.confirm(
                'You are signed in as a ' + role + '. You need a buyer account to place an order.\n\nSign out and create a buyer account?'
            )
            if (ok) {
                localStorage.removeItem('token')
                localStorage.removeItem('role')
                localStorage.removeItem('name')
                setShowRegister(true)
            }
            return
        }

        // login nahi hai: popup mein registration / sign in dikhao
        setShowRegister(true)
    }

    // 03XX... ko WhatsApp ke format (92XX...) mein badalna
    function whatsappLink(phone) {
        const digits = String(phone).replace(/\D/g, '')
        const intl = digits.startsWith('0') ? '92' + digits.slice(1) : digits
        return 'https://wa.me/' + intl
    }

    const navLinkClass =
        'cursor-pointer rounded-lg text-sm font-semibold text-slate-700 transition-colors hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600'

    const seller = product?.seller
    const sellerPhone = seller?.phoneNo || seller?.phone
    const listedOn = product?.createdAt
        ? new Date(product.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
        : '-'
    const description = product?.description || 'No description has been added for this product yet.'
    const longText = description.length > 160

    // Stock (sirf tab istemal hota hai jab server stock bheje)
    const stock = typeof product?.stock === 'number' ? product.stock : null
    const outOfStock = stock !== null && stock <= 0
    const maxQty = stock !== null ? Math.max(stock, 1) : 99

    let stockInfo = null
    if (stock !== null) {
        if (stock <= 0) stockInfo = { text: 'Out of stock', style: 'text-red-600' }
        else if (stock <= 5) stockInfo = { text: 'Only ' + stock + ' left', style: 'text-amber-600' }
        else stockInfo = { text: 'In stock', style: 'text-emerald-600' }
    }

    return (
        <div className='min-h-screen w-full bg-slate-50 text-slate-900'>

            {/* ================= Navbar ================= */}
            <header className='sticky top-3 z-50 mx-3 sm:mx-6'>
                <nav className='mx-auto max-w-7xl rounded-2xl bg-white/90 px-5 py-3 shadow-lg shadow-slate-900/10 backdrop-blur'>
                    <div className='flex items-center justify-between'>
                        <button
                            onClick={() => navigate('/Home')}
                            className='flex cursor-pointer items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600'
                        >
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
                            <button onClick={() => navigate('/Home')} className={navLinkClass}>Sellers</button>
                        </div>

                        <button
                            onClick={() => navigate('/seller-register')}
                            className='hidden cursor-pointer items-center gap-2 rounded-xl bg-blue-950 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 md:flex'
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
                            <button onClick={() => navigate('/seller-register')} className='rounded-xl bg-blue-950 py-2.5 text-sm font-semibold text-white'>
                                Switch to Seller
                            </button>
                        </div>
                    )}
                </nav>
            </header>

            <main className='mx-auto max-w-7xl px-6 pb-20 pt-8 md:px-10'>

                <button
                    onClick={() => navigate('/shop')}
                    className='flex cursor-pointer items-center gap-2 rounded-lg text-sm font-semibold text-blue-950 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600'
                >
                    <ArrowLeft size={18} />
                    Back to Search
                </button>

                {/* Loading skeleton */}
                {loading && (
                    <div className='mt-6 grid animate-pulse grid-cols-1 gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12' aria-label='Loading product'>
                        <div className='h-80 rounded-3xl bg-slate-200 sm:h-[30rem]' />
                        <div className='space-y-5'>
                            <div className='h-6 w-24 rounded-full bg-slate-200' />
                            <div className='h-10 w-3/4 rounded-xl bg-slate-200' />
                            <div className='h-12 w-1/2 rounded-xl bg-slate-200' />
                            <div className='h-14 w-full rounded-xl bg-slate-200' />
                        </div>
                    </div>
                )}

                {!loading && !product && (
                    <div className='mt-10 rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center'>
                        <Package className='mx-auto mb-2 text-slate-300' size={36} />
                        <p className='font-semibold text-blue-950'>Product not found</p>
                        <p className='mt-1 text-sm text-slate-500'>It may have been removed by the seller.</p>
                        <button
                            onClick={() => navigate('/shop')}
                            className='mt-6 cursor-pointer rounded-xl bg-blue-950 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-900'
                        >
                            Browse products
                        </button>
                    </div>
                )}

                {product && (
                    <>
                        {/* key = product id, taake product badalne par animation dobara chale */}
                        <div key={product._id} className='mt-6 grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12'>

                            {/* ============ Left: image ============ */}
                            <div className='anim-fade-up relative overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200'>
                                {product.imageUrl ? (
                                    <>
                                        <img
                                            src={product.imageUrl}
                                            alt={product.title}
                                            className='h-80 w-full object-contain p-4 sm:h-[30rem]'
                                        />
                                        <button
                                            onClick={() => setFullscreen(true)}
                                            className='absolute right-4 top-4 flex cursor-pointer items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-blue-950 shadow-md ring-1 ring-slate-200 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                                        >
                                            <Maximize2 size={16} />
                                            Fullscreen
                                        </button>
                                    </>
                                ) : (
                                    <div className='flex h-80 w-full flex-col items-center justify-center gap-2 bg-slate-100 text-slate-400 sm:h-[30rem]'>
                                        <ImageOff size={40} />
                                        <span>No image</span>
                                    </div>
                                )}
                            </div>

                            {/* ============ Right: buy panel ============ */}
                            <aside className='anim-fade-up anim-delay-1 space-y-5 lg:sticky lg:top-28'>

                                <div className='rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8'>

                                    <div className='flex items-start justify-between gap-4'>
                                        <div>
                                            {product.category && (
                                                <span className='inline-block rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700'>
                                                    {product.category}
                                                </span>
                                            )}
                                            <h1 className='mt-3 text-3xl font-extrabold leading-tight text-blue-950 md:text-4xl'>
                                                {product.title}
                                            </h1>
                                            {seller?.city && (
                                                <p className='mt-2 flex items-center gap-2 text-slate-500'>
                                                    <MapPin size={16} /> {seller.city}
                                                </p>
                                            )}
                                        </div>

                                        <button
                                            onClick={handleShare}
                                            aria-label='Share this product'
                                            className='flex shrink-0 cursor-pointer items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-blue-950 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                                        >
                                            <Share2 size={16} />
                                            {copied ? 'Copied' : 'Share'}
                                        </button>
                                    </div>

                                    {/* Price */}
                                    <div className='mt-6 flex items-baseline justify-between gap-3'>
                                        <p className='text-4xl font-extrabold text-blue-700'>
                                            Rs {Number(product.price).toLocaleString()}
                                        </p>
                                        {stockInfo && (
                                            <p className={'text-sm font-semibold ' + stockInfo.style}>{stockInfo.text}</p>
                                        )}
                                    </div>

                                    <div className='mt-4 flex flex-wrap gap-2'>
                                        <span className='flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700'>
                                            <Banknote size={16} /> Cash on Delivery
                                        </span>
                                        <span className='flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700'>
                                            <ShieldCheck size={16} /> Verified seller
                                        </span>
                                    </div>

                                    {/* Quantity */}
                                    <div className='mt-6 flex flex-wrap items-center gap-4'>
                                        <span className='text-sm font-semibold text-slate-600'>Quantity</span>
                                        <div className='flex items-center overflow-hidden rounded-xl border border-slate-300'>
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                disabled={quantity <= 1}
                                                aria-label='Decrease quantity'
                                                className='cursor-pointer px-3.5 py-2.5 text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40'
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className='min-w-12 px-3 text-center font-semibold' aria-live='polite'>{quantity}</span>
                                            <button
                                                onClick={() => setQuantity(Math.min(maxQty, quantity + 1))}
                                                disabled={quantity >= maxQty}
                                                aria-label='Increase quantity'
                                                className='cursor-pointer px-3.5 py-2.5 text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40'
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                        {quantity > 1 && (
                                            <span className='text-sm text-slate-500'>
                                                Total: <span className='font-bold text-blue-950'>Rs {(Number(product.price) * quantity).toLocaleString()}</span>
                                            </span>
                                        )}
                                    </div>

                                    <button
                                        onClick={handleBuyNow}
                                        disabled={outOfStock}
                                        className='mt-6 w-full cursor-pointer rounded-xl bg-blue-950 py-3.5 text-base font-semibold text-white transition active:scale-[0.98] hover:bg-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500'
                                    >
                                        {outOfStock ? 'Out of stock' : 'Buy now'}
                                    </button>
                                    <p className='mt-3 text-center text-sm text-slate-500'>You pay when the order reaches you.</p>
                                </div>

                                {/* Seller card */}
                                <div className='rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200'>
                                    <div className='flex items-center gap-4'>
                                        <div className='flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-800'>
                                            {(seller?.name || 'U')[0].toUpperCase()}
                                        </div>
                                        <div className='min-w-0'>
                                            <p className='truncate text-lg font-bold text-blue-950'>{seller?.name || 'Unknown'}</p>
                                            <p className='text-sm text-slate-500'>Local seller{seller?.city ? ' in ' + seller.city : ''}</p>
                                        </div>
                                    </div>

                                    {sellerPhone && (
                                        <div className='mt-5 grid grid-cols-2 gap-3'>
                                            <a
                                                href={'tel:' + sellerPhone}
                                                className='flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-3 py-2.5 text-sm font-semibold text-blue-950 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                                            >
                                                <Phone size={16} /> Call
                                            </a>
                                            <a
                                                href={whatsappLink(sellerPhone)}
                                                target='_blank'
                                                rel='noreferrer'
                                                className='flex items-center justify-center gap-2 rounded-xl border border-emerald-300 px-3 py-2.5 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600'
                                            >
                                                <MessageCircle size={16} /> WhatsApp
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </aside>
                        </div>


                        {/* ============ Tabs ============ */}
                        <section className='mt-12 max-w-3xl'>

                            <div role='tablist' aria-label='Product information' className='flex gap-8 border-b border-slate-200'>
                                {[
                                    { key: 'overview', label: 'Overview' },
                                    { key: 'details', label: 'Details' },
                                ].map((t) => (
                                    <button
                                        key={t.key}
                                        role='tab'
                                        aria-selected={tab === t.key}
                                        onClick={() => setTab(t.key)}
                                        className={
                                            'cursor-pointer border-b-2 px-1 pb-3 text-base font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ' +
                                            (tab === t.key
                                                ? 'border-blue-600 text-blue-700'
                                                : 'border-transparent text-slate-500 hover:text-slate-800')
                                        }
                                    >
                                        {t.label}
                                    </button>
                                ))}
                            </div>

                            {tab === 'overview' && (
                                <div role='tabpanel' className='anim-fade-in pt-6'>
                                    <p className={'leading-relaxed text-slate-700 ' + (!readMore && longText ? 'line-clamp-3' : '')}>
                                        {description}
                                    </p>
                                    {longText && (
                                        <button
                                            onClick={() => setReadMore(!readMore)}
                                            className='mt-3 flex cursor-pointer items-center gap-1 text-sm font-semibold text-blue-700'
                                        >
                                            {readMore ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                            {readMore ? 'Read less' : 'Read more'}
                                        </button>
                                    )}

                                    <p className='mt-6 flex items-center gap-2 text-sm text-slate-500'>
                                        <Calendar size={16} /> Listed on {listedOn}
                                    </p>
                                </div>
                            )}

                            {tab === 'details' && (
                                <dl role='tabpanel' className='anim-fade-in grid grid-cols-1 gap-x-8 gap-y-5 pt-6 sm:grid-cols-2'>
                                    <div>
                                        <dt className='text-sm text-slate-500'>Product name</dt>
                                        <dd className='mt-1 font-semibold'>{product.title}</dd>
                                    </div>
                                    <div>
                                        <dt className='text-sm text-slate-500'>Category</dt>
                                        <dd className='mt-1 font-semibold'>{product.category || '-'}</dd>
                                    </div>
                                    <div>
                                        <dt className='text-sm text-slate-500'>Payment</dt>
                                        <dd className='mt-1 font-semibold'>Cash on Delivery</dd>
                                    </div>
                                    <div>
                                        <dt className='text-sm text-slate-500'>City</dt>
                                        <dd className='mt-1 font-semibold'>{seller?.city || '-'}</dd>
                                    </div>
                                    <div className='sm:col-span-2'>
                                        <dt className='text-sm text-slate-500'>Ordering</dt>
                                        <dd className='mt-1 font-semibold'>A buyer account is needed to place an order.</dd>
                                    </div>
                                </dl>
                            )}
                        </section>


                        {/* ============ Similar products ============ */}
                        {similar.length > 0 && (
                            <section className='mt-16'>
                                <h2 className='text-2xl font-extrabold text-blue-950'>More like this</h2>
                                <div className='mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                                    {similar.map((s) => (
                                        <button
                                            key={s._id}
                                            onClick={() => navigate('/product/' + s._id)}
                                            className='group flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-white text-left shadow-sm ring-1 ring-slate-200 transition duration-200 hover:-translate-y-1 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                                        >
                                            <div className='h-44 w-full overflow-hidden bg-slate-100'>
                                                {s.imageUrl ? (
                                                    <img src={s.imageUrl} alt={s.title} className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105' />
                                                ) : (
                                                    <div className='flex h-full items-center justify-center text-slate-300'>
                                                        <ImageOff size={28} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className='p-4'>
                                                <p className='truncate font-bold text-blue-950'>{s.title}</p>
                                                <p className='mt-1 font-extrabold text-blue-700'>Rs {Number(s.price).toLocaleString()}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </section>
                        )}
                    </>
                )}
            </main>

            {/* Buyer registration / sign in popup */}
            {showRegister && product && (
                <BuyerRegisterModal
                    onClose={() => setShowRegister(false)}
                    onSuccess={() => {
                        setShowRegister(false)
                        navigate('/checkout/' + product._id, { state: { quantity } })
                    }}
                />
            )}

            {/* Fullscreen image */}
            {fullscreen && product?.imageUrl && (
                <div
                    role='dialog'
                    aria-modal='true'
                    aria-label='Product image'
                    onClick={() => setFullscreen(false)}
                    className='anim-fade-in fixed inset-0 z-[100] flex cursor-pointer items-center justify-center bg-black/90 p-4'
                >
                    <button className='absolute right-6 top-6 cursor-pointer text-white' aria-label='Close'>
                        <X size={32} />
                    </button>
                    <img src={product.imageUrl} alt={product.title} className='anim-zoom-in max-h-full max-w-full rounded-xl object-contain' />
                </div>
            )}

            {/* ================= Footer ================= */}
            <Footer />
        </div>
    )
}

export default ProductDetail