import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 CDF33 text-small'>
         <div>
            <img src={assets.logo} alt="" className='mb-5 w-32'/>
            <p className='w-full md:w-2/3 text-gray-600'>
                 Bitsend Ecommerce is your trusted destination for quality products at the best prices. 
                 We bring together style, innovation, and convenience — making online shopping simple, 
                 fast, and reliable for everyone.
            </p>
         </div>
         <div>
            <p  className='text-xl font-medium mb-5'>Company</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
               <li>Home</li>
               <li>About us</li>
               <li>Delivery</li>
               <li>Privacy policy</li>
            </ul>
         </div>
         <div>
            <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <li>+233552973298</li>
                <li>danieldzansi96@gmail.com</li>
            </ul>
         </div>
         <div>
            <hr />
            <p className='py-5 text-sm text-center'>
                 © {new Date().getFullYear()} Forever Ecommerce — All rights reserved.
            </p>
         </div>
      </div>
    </div>
  )
}

export default Footer
