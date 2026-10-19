import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Store, Mail, Phone, MapPin, MessageCircle } from 'lucide-react'

// Newer versions of lucide-react have no brand icons, so these SVGs are drawn by hand
function FacebookIcon({ size = 16 }) {
    return (
        <svg width={size} height={size} viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
            <path d='M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8v3h2.7V21h2.8z' />
        </svg>
    )
}

function InstagramIcon({ size = 16 }) {
    return (
        <svg width={size} height={size} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
            <rect x='3' y='3' width='18' height='18' rx='5' />
            <circle cx='12' cy='12' r='4' />
            <circle cx='17.5' cy='6.5' r='1' fill='currentColor' stroke='none' />
        </svg>
    )
}

function Footer() {

    const navigate = useNavigate()

    // After changing the page, scroll back to the top
    function go(path) {
        navigate(path)
        window.scrollTo(0, 0)
    }

    const linkClass =
        'block cursor-pointer py-1 text-left text-slate-400 transition-colors hover:text-white'

    const socialClass =
        'flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-slate-300 hover:bg-blue-700 hover:text-white'

    return (
        <footer className='mt-16 bg-slate-950'>

            <div className='mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-14 text-sm sm:grid-cols-2 md:px-10 lg:grid-cols-4'>

                {/* Brand */}
                <div>
                    <button onClick={() => go('/Home')} className='flex cursor-pointer items-center gap-3'>
                        <span className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-900 text-white'>
                            <Store size={20} />
                        </span>
                        <span className='text-lg font-bold text-white'>
                            Local<span className='text-blue-500'>Mart</span>
                        </span>
                    </button>

                    <p className='mt-4 max-w-xs leading-relaxed text-slate-400'>
                        Browse products from local sellers in your city and place your order. The seller is notified right away.
                    </p>

                    <div className='mt-5 flex items-center gap-3'>
                        <a href='#' aria-label='Facebook' className={socialClass}>
                            <FacebookIcon />
                        </a>
                        <a href='#' aria-label='Instagram' className={socialClass}>
                            <InstagramIcon />
                        </a>
                        <a href='#' aria-label='WhatsApp' className={socialClass}>
                            <MessageCircle size={16} />
                        </a>
                    </div>
                </div>

                {/* Quick links */}
                <div>
                    <p className='mb-3 text-base font-bold text-white'>Quick Links</p>
                    <button onClick={() => go('/Home')} className={linkClass}>Home</button>
                    <button onClick={() => go('/shop')} className={linkClass}>Products</button>
                    <button onClick={() => go('/Home')} className={linkClass}>Sellers</button>
                </div>

                {/* Account */}
                <div>
                    <p className='mb-3 text-base font-bold text-white'>Account</p>
                    <button onClick={() => go('/login')} className={linkClass}>Login</button>
                    <button onClick={() => go('/seller-register')} className={linkClass}>Become a Seller</button>
                </div>

                {/* Contact */}
                <div>
                    <p className='mb-3 text-base font-bold text-white'>Contact</p>
                    <p className='flex items-center gap-2 py-1 text-slate-400'>
                        <Mail size={16} className='shrink-0 text-blue-500' /> support@localmart.com
                    </p>
                    <p className='flex items-center gap-2 py-1 text-slate-400'>
                        <Phone size={16} className='shrink-0 text-blue-500' /> 0300 0000000
                    </p>
                    <p className='flex items-center gap-2 py-1 text-slate-400'>
                        <MapPin size={16} className='shrink-0 text-blue-500' /> Pakistan
                    </p>
                </div>
            </div>

            {/* Bottom bar */}
            <div className='border-t border-slate-800'>
                <div className='mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-5 text-xs text-slate-500 md:flex-row md:px-10'>
                    <span>© {new Date().getFullYear()} Local Seller Marketplace. All rights reserved.</span>
                    <span>Cash on Delivery &bull; Verified sellers &bull; Local delivery</span>
                </div>
            </div>

        </footer>
    )
}

export default Footer