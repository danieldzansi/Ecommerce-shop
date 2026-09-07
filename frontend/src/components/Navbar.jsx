import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { NavLink, Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { useCartStore } from '../store/CartStore';
import AssetImage from './AssetImage';
import { FiChevronDown, FiHeart, FiMenu, FiSearch, FiShoppingBag, FiUser, FiX } from 'react-icons/fi';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/collection', hasMenu: true },
  { label: 'About', to: '/about' },
  { label: 'Pages', to: '/faq', hasPages: true },
  { label: 'Track Order', to: '/orders' },
];

const shopColumns = [
  {
    title: 'Shop Layout',
    links: [
      ['All Products', '/collection'],
      ['Women', '/collection'],
      ['Men', '/collection'],
      ['Kids', '/collection'],
      ['Bestsellers', '/collection'],
      ['New Arrivals', '/collection'],
    ],
  },
  {
    title: 'Collections',
    links: [
      ['Dresses & Sets', '/collection'],
      ['Tops', '/collection'],
      ['Bottoms', '/collection'],
      ['Bags & Accessories', '/collection'],
      ['Occasion Pieces', '/collection'],
      ['Everyday Edit', '/collection'],
    ],
  },
  {
    title: 'Customer Care',
    links: [
      ['Shipping & Returns', '/shipping-returns'],
      ['Order Tracking', '/orders'],
      ['FAQs', '/faq'],
      ['Contact Us', '/contact'],
      ['Size Help', '/faq'],
      ['WhatsApp Support', '/contact'],
    ],
  },
];

const pageLinks = [
  ['About Us', '/about'],
  ['Contact', '/contact'],
  ['FAQ', '/faq'],
  ['Shipping & Returns', '/shipping-returns'],
  ['My Orders', '/orders'],
];

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const { setShowSearch } = useContext(ShopContext);

  const cartCount = useCartStore((state) => state.getCartCount());

  return (
    <header className='sticky top-0 z-40 bg-white text-[#161616]'>
      <div className='bg-[#111111] text-white'>
        <div className='page-x flex min-h-12 items-center justify-between gap-4 text-[13px] font-medium'>
          <div className='flex flex-wrap items-center gap-x-6 gap-y-2'>
            <a href='tel:0535364221' className='transition hover:text-[#DBCCB7]'>053 536 4221</a>
            <a href='mailto:eclatdelee26@gmail.com' className='transition hover:text-[#DBCCB7]'>eclatdelee26@gmail.com</a>
            <Link to='/collection' className='underline underline-offset-4 transition hover:text-[#DBCCB7]'>Our Store</Link>
          </div>
          <div className='hidden items-center gap-5 sm:flex'>
            <span>GHS</span>
            <span>English</span>
          </div>
        </div>
      </div>

      <div className='group/nav relative border-b border-[#ece7df] bg-white'>
        <div className='page-x flex h-[82px] items-center justify-between'>
          <Link to='/' className='flex items-center gap-3'>
            <img src={assets.logo} className='h-12 w-auto max-w-[190px] object-contain' alt="Èclat De Lee logo" />
          </Link>

          <nav className='hidden items-center gap-7 text-[15px] font-extrabold md:flex'>
            {navItems.map((item) => (
              <div key={item.label} className='group/item flex h-[82px] items-center'>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 transition hover:text-[#5A0019] ${
                      isActive ? 'text-[#5A0019]' : 'text-[#161616]'
                    }`
                  }
                >
                  <span>{item.label}</span>
                  {(item.hasMenu || item.hasPages) && <FiChevronDown className='h-4 w-4' aria-hidden='true' />}
                </NavLink>

                {item.hasMenu && (
                  <div className='invisible absolute left-0 right-0 top-full border-t border-[#f0ebe5] bg-white opacity-0 shadow-[0_22px_45px_rgba(17,17,17,0.08)] transition duration-200 group-hover/item:visible group-hover/item:opacity-100'>
                    <div className='page-x grid gap-10 py-9 lg:grid-cols-[1fr_1fr_1fr_0.9fr]'>
                      {shopColumns.map((column) => (
                        <div key={column.title}>
                          <p className='mb-5 text-[13px] font-extrabold uppercase tracking-[0.08em]'>{column.title}</p>
                          <ul className='space-y-3 text-[15px] font-medium text-[#4b4650]'>
                            {column.links.map(([label, to]) => (
                              <li key={label}>
                                <Link to={to} className='transition hover:text-[#5A0019]'>{label}</Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      <Link to='/collection' className='relative min-h-[260px] overflow-hidden bg-[#efe7dd] text-white'>
                        <AssetImage asset={assets.heroSlides[0].image} alt='' className='absolute inset-0 h-full w-full object-cover' />
                        <div className='absolute inset-0 bg-black/25' />
                        <div className='absolute inset-x-6 top-1/2 -translate-y-1/2 text-center'>
                          <p className='text-3xl font-extrabold leading-tight'>Shop our top picks</p>
                          <p className='mt-3 text-sm font-semibold'>Curated fashion finds</p>
                          <span className='mt-7 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-extrabold text-[#111111]'>
                            Shop Now
                            <span aria-hidden='true'>↗</span>
                          </span>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}

                {item.hasPages && (
                  <div className='invisible absolute top-full w-56 border border-[#ece7df] bg-white p-4 opacity-0 shadow-[0_18px_35px_rgba(17,17,17,0.08)] transition duration-200 group-hover/item:visible group-hover/item:opacity-100'>
                    <ul className='space-y-3 text-sm font-semibold text-[#4b4650]'>
                      {pageLinks.map(([label, to]) => (
                        <li key={label}>
                          <Link to={to} className='transition hover:text-[#5A0019]'>{label}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className='flex items-center gap-4 text-[#111111]'>
            <button onClick={() => setShowSearch(true)} className='inline-flex h-10 w-10 items-center justify-center' aria-label='Search'>
              <FiSearch className='h-6 w-6' aria-hidden='true' />
            </button>
            <Link to='/orders' aria-label='Account' className='hidden h-10 w-10 items-center justify-center md:inline-flex'>
              <FiUser className='h-6 w-6' aria-hidden='true' />
            </Link>
            <Link to='/collection' aria-label='Wishlist' className='hidden h-10 w-10 items-center justify-center md:inline-flex'>
              <FiHeart className='h-6 w-6' aria-hidden='true' />
            </Link>
            <Link to='/cart' className='relative inline-flex h-10 w-10 items-center justify-center' aria-label='Cart'>
              <FiShoppingBag className='h-6 w-6' aria-hidden='true' />
              {cartCount > 0 && (
                <span className='absolute right-1 top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ff334a] px-1 text-[10px] font-extrabold leading-none text-white'>
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setVisible(true)}
              className='inline-flex h-10 w-10 items-center justify-center md:hidden'
              aria-label='Open menu'
            >
              <FiMenu className='h-7 w-7' aria-hidden='true' />
            </button>
          </div>
        </div>
      </div>

      <div
        className={`fixed top-0 right-0 z-50 h-screen overflow-hidden bg-white shadow-2xl transition-all duration-300 ${
          visible ? 'w-full max-w-sm' : 'w-0'
        }`}
      >
        <div className='flex min-w-[320px] flex-col text-[#1d1115]'>
          <button
            onClick={() => setVisible(false)}
            className='flex items-center justify-between border-b border-[#DBCCB7]/70 p-5 text-left'
            aria-label='Close menu'
          >
            <span className='editorial-serif text-2xl'>Menu</span>
            <FiX className='h-6 w-6' aria-hidden='true' />
          </button>

          {[...navItems, { label: 'Contact', to: '/contact' }].map((item) => (
            <NavLink
              key={item.label}
              onClick={() => setVisible(false)}
              className='border-b border-[#DBCCB7]/70 px-6 py-4 text-sm font-bold uppercase tracking-[0.16em]'
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
