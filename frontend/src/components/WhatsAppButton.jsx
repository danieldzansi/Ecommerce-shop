import React from 'react'
import { FaWhatsapp } from 'react-icons/fa'

const WhatsAppButton = () => {
  const phone = '233535364221'
  const message = encodeURIComponent('Hello Eclat De Lee, I need help with shopping or an order.')

  return (
    <a
      href={`https://wa.me/${phone}?text=${message}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-50 grid h-12 w-12 place-items-center rounded-[4px] bg-[#25D366] text-white shadow-[0_12px_30px_rgba(0,0,0,0.22)] transition hover:-translate-y-0.5 hover:bg-[#20bd5a] focus:outline-none focus:ring-4 focus:ring-[#25D366]/25 sm:bottom-6 sm:right-6 sm:h-14 sm:w-14"
    >
      <FaWhatsapp className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden="true" />
    </a>
  )
}

export default WhatsAppButton
