import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { Store, ArrowLeft, MapPin, Package } from 'lucide-react'

function SellerShop() {
  const { id } = useParams()
  const navigate = useNavigate()
  const base = import.meta.env.VITE_beckend_base_URL

  const [seller, setSeller] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getData() {
      try {
        const sellerRes = await axios.get(base + '/sellers/public')
        const list = Array.isArray(sellerRes.data?.data) ? sellerRes.data.data : []
        setSeller(list.find((s) => s._id === id) || null)

        const productRes = await axios.get(base + '/product/public')
        const all = Array.isArray(productRes.data?.products) ? productRes.data.products : []
        setProducts(
          all.filter((p) => {
            const sellerId = typeof p.seller === 'object' ? p.seller?._id : p.seller
            return sellerId === id
          })
        )
      } catch (error) {
        console.error('Failed to load shop', error)
      }
      setLoading(false)
    }
    getData()
  }, [id])

  return (
    <div className='min-h-screen w-full bg-slate-50 text-slate-900'>

      {/* Top bar */}
      <header className='sticky top-3 z-50 mx-3 sm:mx-6'>
        <nav className='mx-auto flex max-w-7xl items-center justify-between rounded-2xl bg-white px-5 py-3 shadow-lg shadow-slate-900/10'>
          <button onClick={() => navigate('/')} className='flex cursor-pointer items-center gap-3'>
            <span className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-950 text-white'>
              <Store size={20} />
            </span>
            <span className='text-lg font-bold text-blue-950'>
              Local<span className='text-blue-600'>Mart</span>
            </span>
          </button>
          <button
            onClick={() => navigate('/sellers')}
            className='flex cursor-pointer items-center gap-2 text-sm font-semibold text-blue-950 hover:text-blue-700'
          >
            <ArrowLeft size={16} />
            All Sellers
          </button>
        </nav>
      </header>

      <div className='mx-auto max-w-7xl px-6 pb-16 pt-10 md:px-10'>

        {loading && <p className='text-center text-slate-500'>Loading...</p>}

        {!loading && !seller && (
          <div className='rounded-2xl border border-dashed border-slate-300 bg-white py-14 text-center'>
            <p className='text-slate-500'>Shop not found</p>
            <button
              onClick={() => navigate('/sellers')}
              className='mt-4 cursor-pointer rounded-xl bg-blue-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-800'
            >
              Back to sellers
            </button>
          </div>
        )}

        {seller && (
          <>
            {/* Shop header */}
            <div className='flex flex-col gap-6 overflow-hidden rounded-3xl bg-white shadow-md md:flex-row'>
              <div className='h-56 w-full bg-slate-200 md:h-auto md:w-80'>
                {seller.imageUrl ? (
                  <img src={seller.imageUrl} alt={seller.shopName} className='h-full w-full object-cover' />
                ) : (
                  <div className='flex h-full items-center justify-center text-slate-400'>No image</div>
                )}
              </div>
              <div className='flex flex-col justify-center p-6 md:p-8'>
                <h1 className='text-3xl font-extrabold text-blue-950 md:text-4xl'>{seller.shopName}</h1>
                <p className='mt-2 text-slate-600'><span className='text-slate-400'>Owner:</span> {seller.ownerName}</p>
                {seller.city && (
                  <p className='mt-2 flex items-center gap-1 text-slate-600'>
                    <MapPin size={16} /> {seller.city}
                  </p>
                )}
                <span className='mt-4 inline-block w-fit rounded-full bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-800'>
                  {products.length} products
                </span>
              </div>
            </div>

            {/* Products */}
            <h2 className='mb-5 mt-12 text-2xl font-extrabold text-blue-950'>Products</h2>

            {products.length === 0 && (
              <div className='rounded-2xl border border-dashed border-slate-300 bg-white py-14 text-center'>
                <Package className='mx-auto mb-2 text-slate-300' size={32} />
                <p className='text-slate-500'>This shop has no products yet</p>
              </div>
            )}

            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {products.map((p) => (
                <div key={p._id} className='overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm'>
                  <div className='h-48 bg-slate-200'>
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.title} className='h-full w-full object-cover' />
                    ) : (
                      <div className='flex h-full items-center justify-center text-slate-400'>No image</div>
                    )}
                  </div>
                  <div className='p-5'>
                    {p.category && (
                      <span className='rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600'>{p.category}</span>
                    )}
                    <h3 className='mt-2 truncate text-lg font-bold text-blue-950'>{p.title}</h3>
                    <p className='text-xl font-extrabold text-blue-950'>Rs {p.price}</p>
                    <button
                      onClick={() => navigate('/product/' + p._id)}
                      className='mt-4 w-full cursor-pointer rounded-xl bg-blue-900 py-2.5 text-sm font-semibold text-white hover:bg-blue-800'
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default SellerShop