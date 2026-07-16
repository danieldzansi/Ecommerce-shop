import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <footer className='bg-[#5A0019] text-white'>
      <div className='page-x grid gap-12 py-16 md:grid-cols-[2fr_1fr_1fr]'>
         <div>
            <img src={assets.logo} alt="Èclat De Lee logo" className='mb-8 h-16 w-auto bg-white object-contain p-2' />
            <p className='max-w-xl text-sm leading-7 text-[#DBCCB7]'>
                 Luxury. Style. Confidence. Delivered to your door.
            </p>
         </div>
         <div>
            <p  className='mb-5 text-xs font-extrabold uppercase tracking-[0.2em] text-[#DBCCB7]'>Company</p>
            <ul className='flex flex-col gap-3 text-sm text-white/80'>
               <li><Link to="/">Home</Link></li>
               <li><Link to="/about">About</Link></li>
               <li><Link to="/collection">Shop</Link></li>
               <li><Link to="/orders">Track order</Link></li>
               <li><Link to="/faq">FAQ</Link></li>
               <li><Link to="/shipping-returns">Shipping & Returns</Link></li>
            </ul>
         </div>
         <div>
            <p className='mb-5 text-xs font-extrabold uppercase tracking-[0.2em] text-[#DBCCB7]'>Get in touch</p>
            <ul className='flex flex-col gap-3 text-sm text-white/80'>
                <li>0535364221</li>
                <li>@eclatdelee</li>
                <li>www.eclatdelee.com</li>
                <li>36 Asafoatse Kukudabi ST, Tse-Addo</li>
                <li>Opposite the Goil Filling Station</li>
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
