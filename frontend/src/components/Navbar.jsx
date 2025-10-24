import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const {setShowSearch}=useContext(ShopContext)

  return (
    <div className='flex items-center justify-between py-5 font-medium relative'>
      {/* Logo */}
      <Link to='/'><img src={assets.logo} className='w-36' alt="Logo" /></Link>

      {/* Desktop Navigation Links */}
      <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
        <NavLink to='/' className='flex flex-col items-center gap-1'>
          <p>HOME</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>

        <NavLink to='/collection' className='flex flex-col items-center gap-1'>
          <p>COLLECTION</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>

        <NavLink to='/about' className='flex flex-col items-center gap-1'>
          <p>ABOUT</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>

        <NavLink to='/contact' className='flex flex-col items-center gap-1'>
          <p>CONTACT</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
      </ul>

      {/* Icons Section */}
      <div className='flex items-center gap-6'>
        {/* Search Icon */}
        <img onClick={()=>setShowSearch(true)} src={assets.search_icon} className='w-5 cursor-pointer' alt="Search" />

        {/* Cart Icon with badge */}
        <Link to='/cart' className='relative'>
          <img src={assets.cart_icon} className='w-5 min-w-5' alt="Cart" />
          <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>
            5
          </p>
        </Link>

        {/* Menu Icon (mobile only) */}
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className='w-5 cursor-pointer sm:hidden'
          alt="Menu"
        />
      </div>

      {/* Mobile Menu */}
      <div className={`fixed top-0 right-0 h-full bg-white transition-all duration-300 ${visible ? 'w-full' : 'w-0'} overflow-y-auto z-50`}> 
        <div className='flex flex-col text-gray-600'>
          {/* Back Button */}
          <div
            onClick={() => setVisible(false)}
            className ='flex items-center gap-2 p-3 cursor-pointer'
          >
            <img src={assets.dropdown_icon} className='h-4 rotate-180' alt="Back" />
            <p>Back</p>
          </div>
          <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border'  to='/'>HOME</NavLink>
          <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border'  to='/collection'>COLLECTION</NavLink>
          <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border'  to='/about'>ABOUT</NavLink>
          <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border'  to='/contact'>CONTACT</NavLink> 
        </div>
      </div>
    </div>
  )
}

export default Navbar
