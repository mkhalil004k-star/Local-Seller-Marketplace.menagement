import React, { useEffect } from 'react'
import { X } from 'lucide-react'

function Modal({ open, onClose, title, children }) {

  // Escape dabane par band ho, aur piche ka page scroll na ho
  useEffect(() => {
    if (!open) return

    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      onClick={onClose}
      className='fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4'
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role='dialog'
        aria-modal='true'
        className='relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl'
      >
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-xl font-bold text-gray-900'>{title}</h2>
          <button
            onClick={onClose}
            className='cursor-pointer rounded-full p-1.5 text-gray-500 hover:bg-gray-100'
            aria-label='Band karein'
          >
            <X size={22} />
          </button>
        </div>

        {children}
      </div>
    </div>
  )
}

export default Modal