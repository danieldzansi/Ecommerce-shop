import React, { useState } from 'react'
import {assets} from '../assets/assets'
import { NavLink ,Link} from 'react-router-dom'


const Navbar = () => {
    const [visible, setVisible] = useState(false);

  return (
    <div className='flex items-center justify-between py-5 font-medium'>
      <img src={assets.logo} className='w-36' alt="" />

      <ul className='hidden sm:flex gap-5 text-sm text-gray-700 '>
      <NavLink to='/' className='flex flex-col items-center gap-1'>
         <p>HOME</p>
         <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
      </NavLink>

      <NavLink to='/collection' className='flex flex-col items-center gap-1'>
         <p>COLLECTION</p>
         <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
      </NavLink>

      <NavLink to='/about' className='flex flex-col items-center gap-1'>
         <p>ABOUT</p>
         <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
      </NavLink>
      <NavLink to='/contact' className='flex flex-col items-center gap-1'>
         <p>CONTACT</p>
         <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
      </NavLink>
    
      </ul>

    <div className='flex items-center gap-6'>
        <img src={assets.search_icon} className='w-5 cursor-pointer' alt="" />

        <Link to='/cart' className='relative'>
          <img src={assets.cart_icon} className='w-5 min-w-5' alt="" />
          <p className='absolute right-[-px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>5</p>
        </Link>
        <img onClick={()=>setVisible(true)} src={assets.menu_icon} className='w-5 cursor-pointer sm:hidden'alt="" />
    </div>
    <div className={`absolute top-0 right-0 button-0 overflow-hidden bg-white transition-all ${visible ? 'w-full':'w-0'}`}>

    </div>
    </div>
  )
}

export default Navbar
