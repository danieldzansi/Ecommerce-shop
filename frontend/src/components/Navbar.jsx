import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { NavLink, Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { useCartStore } from '../store/CartStore';
import AssetImage from './AssetImage';

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const { setShowSearch } = useContext(ShopContext);

  const cartCount = useCartStore((state) => state.getCartCount());

  return (
    <header className='sticky top-0 z-40 border-b border-[#DBCCB7]/70 bg-white/95 backdrop-blur'>
      <div className='page-x flex h-[68px] items-center justify-between'>
      <Link to='/' className='flex items-center gap-3'>
        <img src={assets.logo} className='h-10 w-auto max-w-[180px] object-contain' alt="Èclat De Lee logo" />
      </Link>

      <ul className='hidden items-center gap-9 text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#1d1115] md:flex'>
        <NavLink to='/collection' className='flex flex-col items-center gap-1 hover:text-[#5A0019]'>
          <p>Categories</p>
          <hr className='hidden h-[1.5px] w-2/4 border-none bg-[#5A0019]' />
        </NavLink>

        <NavLink to='/collection' className='flex flex-col items-center gap-1 hover:text-[#5A0019]'>
          <p>Shop</p>
          <hr className='hidden h-[1.5px] w-2/4 border-none bg-[#5A0019]' />
        </NavLink>

        <NavLink to='/orders' className='flex flex-col items-center gap-1 hover:text-[#5A0019]'>
          <p>Track Order</p>
          <hr className='hidden h-[1.5px] w-2/4 border-none bg-[#5A0019]' />
        </NavLink>
      </ul>

      <div className='flex items-center gap-5 text-[#1d1115]'>
        <AssetImage
          onClick={() => setShowSearch(true)}
          asset={assets.search_icon}
          className='w-5 cursor-pointer'
          alt="Search"
        />
        <Link to='/cart' className='relative'>
          <AssetImage asset={assets.cart_icon} className='w-5 min-w-5' alt="Cart" />
          {cartCount > 0 && (
            <p className='absolute right-[-8px] bottom-[-8px] aspect-square w-4 rounded-full bg-[#5A0019] text-center text-[8px] leading-4 text-white'>
              {cartCount}
            </p>
          )}
        </Link>
        <Link to='/collection' aria-label='Wishlist' className='hidden md:block'>
          <svg viewBox='0 0 24 24' className='w-5' fill='none' stroke='currentColor' strokeWidth='1.8'>
            <path d='M20.8 4.6a5.2 5.2 0 0 0-7.4 0L12 6l-1.4-1.4a5.2 5.2 0 0 0-7.4 7.4L12 20.8l8.8-8.8a5.2 5.2 0 0 0 0-7.4Z' />
          </svg>
        </Link>

        <AssetImage
          onClick={() => setVisible(true)}
          asset={assets.menu_icon}
          className='w-5 cursor-pointer md:hidden'
          alt="Menu"
        />
      </div>

      <div
        className={`fixed top-0 right-0 h-screen bg-white shadow-2xl transition-all duration-300 ${
          visible ? 'w-full max-w-sm' : 'w-0'
        } overflow-hidden z-50`}
      >
        <div className='flex flex-col text-[#1d1115]'>
         
          <div
            onClick={() => setVisible(false)}
            className='flex cursor-pointer items-center justify-between border-b border-[#DBCCB7]/70 p-5'
          >
            <p className='editorial-serif text-2xl'>Menu</p>
            <AssetImage asset={assets.cross_icon} className='h-5' alt="Close" />
          </div>

          <NavLink onClick={() => setVisible(false)} className='border-b border-[#DBCCB7]/70 px-6 py-4 text-sm font-bold uppercase tracking-[0.16em]' to='/'>
            Home
          </NavLink>
          <NavLink onClick={() => setVisible(false)} className='border-b border-[#DBCCB7]/70 px-6 py-4 text-sm font-bold uppercase tracking-[0.16em]' to='/collection'>
            Shop
          </NavLink>
          <NavLink onClick={() => setVisible(false)} className='border-b border-[#DBCCB7]/70 px-6 py-4 text-sm font-bold uppercase tracking-[0.16em]' to='/about'>
            About
          </NavLink>
          <NavLink onClick={() => setVisible(false)} className='border-b border-[#DBCCB7]/70 px-6 py-4 text-sm font-bold uppercase tracking-[0.16em]' to='/contact'>
            Contact
          </NavLink>
           <NavLink onClick={() => setVisible(false)} className='border-b border-[#DBCCB7]/70 px-6 py-4 text-sm font-bold uppercase tracking-[0.16em]' to='/orders'>
            Track Order
          </NavLink>

        </div>
      </div>
      </div>
    </header>
  );
};

export default Navbar;
