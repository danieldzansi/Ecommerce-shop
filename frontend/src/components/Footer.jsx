import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <footer className='bg-[#5A0019] text-white'>
      <div className='page-x grid gap-12 py-16 md:grid-cols-[2fr_1fr_1fr]'>
         <div>
            <img src={assets.logo} alt="Èclat De Lee logo" className='mb-8 h-16 w-auto bg-white object-contain p-2' />
            <p className='max-w-xl text-sm leading-7 text-[#DBCCB7]'>
                 Elegance and style for polished everyday dressing. Discover pieces that feel effortless, intentional, and ready for the moments you are dressing for.
            </p>
         </div>
         <div>
            <p  className='mb-5 text-xs font-extrabold uppercase tracking-[0.2em] text-[#DBCCB7]'>Company</p>
            <ul className='flex flex-col gap-3 text-sm text-white/80'>
               <li>Home</li>
               <li>About</li>
               <li>Shop</li>
               <li>Track order</li>
            </ul>
         </div>
         <div>
            <p className='mb-5 text-xs font-extrabold uppercase tracking-[0.2em] text-[#DBCCB7]'>Get in touch</p>
            <ul className='flex flex-col gap-3 text-sm text-white/80'>
                <li>+233552973298</li>
                <li>danieldzansi96@gmail.com</li>
            </ul>
         </div>
      </div>
      <div className='page-x border-t border-[#DBCCB7]/25 py-5 text-xs uppercase tracking-[0.16em] text-[#DBCCB7]'>
        © {new Date().getFullYear()} Èclat De Lee. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
