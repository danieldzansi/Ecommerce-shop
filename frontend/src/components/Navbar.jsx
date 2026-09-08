import React, { useContext, useLayoutEffect, useRef, useState } from 'react';
import { assets } from '../assets/assets';
import { NavLink, Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { useCartStore } from '../store/CartStore';
import AssetImage from './AssetImage';
import { FiChevronDown, FiHeart, FiHome, FiMenu, FiSearch, FiShoppingBag, FiUser, FiX } from 'react-icons/fi';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/collection', hasMenu: true },
  { label: 'About', to: '/about' },
  { label: 'Pages', to: '/faq', hasPages: true },
  { label: 'Track Order', to: '/orders' },
];

const shopColumns = [
  {
    title: 'Men',
    links: [
      ['Bags', '/collection'],
      ['Watches', '/collection'],
      ['Shoes', '/collection'],
      ['Accessories', '/collection'],
    ],
  },
  {
    title: 'Women',
    links: [
      ['Bags', '/collection'],
      ['Crossbody Bags', '/collection'],
      ['Tote Bags', '/collection'],
      ['Top Handle Bags', '/collection'],
      ['Clutches', '/collection'],
      ['Shoes', '/collection'],
      ['Watches', '/collection'],
      ['Accessories', '/collection'],
    ],
  },
  {
    title: 'Home Aromatics',
    links: [
      ['Candles', '/collection'],
      ['Diffusers', '/collection'],
      ['Room Sprays', '/collection'],
      ['Gift Sets', '/collection'],
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
  const drawerRef = useRef(null);
  const { setShowSearch } = useContext(ShopContext);

  const cartCount = useCartStore((state) => state.getCartCount());

  useLayoutEffect(() => {
    const drawer = drawerRef.current;
    if (!drawer || !visible) return undefined;

    let isMounted = true;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    import('gsap').then((gsapModule) => {
      if (!isMounted) return;

      const gsap = gsapModule.gsap || gsapModule.default;

      if (prefersReducedMotion) return;

      gsap.fromTo(
        drawer.querySelectorAll('a'),
        { x: 18, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, duration: 0.45, stagger: 0.04, ease: 'power3.out', delay: 0.12 }
      );
    });

    return () => {
      isMounted = false;
    };
  }, [visible]);

  return (
    <header className='sticky top-0 z-40 bg-white text-[#161616]'>
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
            <Link to='/' aria-label='Home' className='inline-flex h-10 w-10 items-center justify-center md:hidden'>
              <FiHome className='h-6 w-6' aria-hidden='true' />
            </Link>
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

      <button
        type='button'
        onClick={() => setVisible(false)}
        className={`fixed inset-0 z-50 bg-black/30 transition-opacity md:hidden ${
          visible ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-label='Close menu overlay'
        aria-hidden={!visible}
        tabIndex={visible ? 0 : -1}
      />

      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 z-[60] h-screen w-full max-w-sm overflow-hidden bg-white shadow-2xl transition-transform duration-300 ease-out md:hidden ${
          visible ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!visible}
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
