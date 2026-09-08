import React, { useContext, useLayoutEffect, useRef, useState } from 'react';
import { assets } from '../assets/assets';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { useCartStore } from '../store/CartStore';
import { FiChevronDown, FiHome, FiMenu, FiSearch, FiShoppingBag, FiUser, FiX } from 'react-icons/fi';

const navItems = [
  { label: 'Home', to: '/' },
  {
    label: 'Men',
    to: '/collection?category=Men',
    links: [
      ['Bags', '/collection?category=Men&subcategory=Bags'],
      ['Watches', '/collection?category=Men&subcategory=Watches'],
      ['Shoes', '/collection?category=Men&subcategory=Shoes'],
      ['Accessories', '/collection?category=Men&subcategory=Accessories'],
    ],
  },
  {
    label: 'Women',
    to: '/collection?category=Women',
    links: [
      ['Bags', '/collection?category=Women&subcategory=Bags'],
      ['Crossbody Bags', '/collection?category=Women&subcategory=Crossbody%20Bags'],
      ['Tote Bags', '/collection?category=Women&subcategory=Tote%20Bags'],
      ['Top Handle Bags', '/collection?category=Women&subcategory=Top%20Handle%20Bags'],
      ['Clutches', '/collection?category=Women&subcategory=Clutches'],
      ['Shoes', '/collection?category=Women&subcategory=Shoes'],
      ['Watches', '/collection?category=Women&subcategory=Watches'],
      ['Accessories', '/collection?category=Women&subcategory=Accessories'],
    ],
  },
  {
    label: 'Home Aromatics',
    to: '/collection?category=Home%20Aromatics',
    links: [
      ['Candles', '/collection?category=Home%20Aromatics&subcategory=Candles'],
      ['Diffusers', '/collection?category=Home%20Aromatics&subcategory=Diffusers'],
      ['Room Sprays', '/collection?category=Home%20Aromatics&subcategory=Room%20Sprays'],
    ],
  },
  { label: 'Gift Set', to: '/collection?category=Gift%20Sets' },
];

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const drawerRef = useRef(null);
  const { setShowSearch, navigate } = useContext(ShopContext);
  const location = useLocation();

  const cartCount = useCartStore((state) => state.getCartCount());

  const openSearch = () => {
    setShowSearch(true);
    setVisible(false);
    navigate('/collection');
  };

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

          <nav className='hidden items-center gap-7 text-[14px] font-extrabold md:flex'>
            {navItems.map((item) => (
              <div key={item.label} className='group/item flex h-[82px] items-center'>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 transition hover:text-[#5A0019] ${
                      isActive || (item.to.startsWith('/collection') && location.pathname === '/collection') ? 'text-[#5A0019]' : 'text-[#161616]'
                    }`
                  }
                >
                  <span>{item.label}</span>
                  {item.links && <FiChevronDown className='h-4 w-4' aria-hidden='true' />}
                </NavLink>

                {item.links && (
                  <div className='invisible absolute top-full w-56 border border-[#ece7df] bg-white p-4 opacity-0 shadow-[0_18px_35px_rgba(17,17,17,0.08)] transition duration-200 group-hover/item:visible group-hover/item:opacity-100'>
                    <ul className='space-y-3 text-sm font-semibold text-[#4b4650]'>
                      {item.links.map(([label, to]) => (
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
            <button onClick={openSearch} className='inline-flex h-10 w-10 items-center justify-center' aria-label='Search'>
              <FiSearch className='h-6 w-6' aria-hidden='true' />
            </button>
            <Link to='/orders' aria-label='Track order' className='hidden h-10 w-10 items-center justify-center md:inline-flex'>
              <FiUser className='h-6 w-6' aria-hidden='true' />
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

          {[...navItems, { label: 'Track Order', to: '/orders' }, { label: 'Contact', to: '/contact' }].map((item) => (
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
