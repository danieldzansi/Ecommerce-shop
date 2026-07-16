import React from 'react'

const WhatsAppButton = () => {
  const phone = '233535364221'
  const message = encodeURIComponent('Hello Eclat De Lee, I need help with shopping or an order.')

  return (
    <a
      href={`https://wa.me/${phone}?text=${message}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-[4px] bg-[#25D366] text-white shadow-[0_12px_30px_rgba(0,0,0,0.22)] transition hover:-translate-y-0.5 hover:bg-[#20bd5a] focus:outline-none focus:ring-4 focus:ring-[#25D366]/25"
    >
      <svg
        viewBox="0 0 32 32"
        aria-hidden="true"
        className="h-7 w-7"
        fill="none"
      >
        <path
          d="M8.9 24.2 6.5 25l.8-2.3a10.4 10.4 0 1 1 1.6 1.5Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12.2 11.7c.2-.5.4-.6.8-.6h.6c.2 0 .5 0 .7.5l.9 2c.1.3.1.5 0 .7l-.6.8c-.1.2-.2.4 0 .7.3.5.9 1.4 1.8 2.1 1 .9 1.9 1.2 2.5 1.4.3.1.5.1.7-.1l.9-1c.2-.2.5-.3.8-.2l1.9.9c.4.2.5.4.5.7 0 .6-.4 1.6-1.1 2.1-.8.6-2.1.7-4.2-.2-3.5-1.4-6.3-4.2-7.7-7.6-.8-1.9-.4-3.1.2-3.9.4-.5.8-.8 1.3-.9Z"
          fill="currentColor"
        />
      </svg>
    </a>
  )
}

export default WhatsAppButton
