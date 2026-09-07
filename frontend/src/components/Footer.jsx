import React from 'react'
import { Link } from 'react-router-dom'
import { FaFacebookF, FaInstagram, FaPinterestP, FaTiktok } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { FiArrowUpRight, FiChevronDown, FiMail, FiMapPin, FiPhone, FiSend } from 'react-icons/fi'
import { assets } from '../assets/assets'
import { paymentMethods } from '../assets/paymentMethods'

const informationLinks = [
  ['About Us', '/about'],
  ['Our Stories', '/about'],
  ['Size Guide', '/faq'],
  ['Contact us', '/contact'],
  ['Career', '/about'],
  ['My Account', '/orders'],
]

const customerLinks = [
  ['Shipping', '/shipping-returns'],
  ['Return & Refund', '/shipping-returns'],
  ['Privacy Policy', '/faq'],
  ['Terms & Conditions', '/faq'],
  ['Orders FAQs', '/faq'],
  ['My Wishlist', '/collection'],
]

const socialLinks = [
  { label: 'Facebook', href: 'https://www.facebook.com', Icon: FaFacebookF },
  { label: 'X', href: 'https://www.x.com', Icon: FaXTwitter },
  { label: 'Instagram', href: 'https://www.instagram.com/eclatdelee', Icon: FaInstagram },
  { label: 'TikTok', href: 'https://www.tiktok.com', Icon: FaTiktok },
  { label: 'Pinterest', href: 'https://www.pinterest.com', Icon: FaPinterestP },
]

const Footer = () => {
  return (
    <footer className='border-t border-[#e8e2da] bg-white text-[#161616]'>
      <div className='page-x grid gap-8 border-b border-[#e8e2da] py-12 text-center md:grid-cols-4'>
        <div>
          <p className='text-xl font-semibold'>14-Day Returns</p>
          <p className='mt-3 text-[15px] leading-6 text-[#66616a]'>Risk-free shopping with easy returns.</p>
        </div>
        <div>
          <p className='text-xl font-semibold'>Free Shipping</p>
          <p className='mt-3 text-[15px] leading-6 text-[#66616a]'>No extra costs on selected Accra orders.</p>
        </div>
        <div>
          <p className='text-xl font-semibold'>24/7 Support</p>
          <p className='mt-3 text-[15px] leading-6 text-[#66616a]'>WhatsApp support, always close by.</p>
        </div>
        <div>
          <p className='text-xl font-semibold'>Member Discounts</p>
          <p className='mt-3 text-[15px] leading-6 text-[#66616a]'>Special prices for loyal customers.</p>
        </div>
      </div>

      <div className='page-x grid gap-12 py-16 lg:grid-cols-[1.45fr_0.75fr_0.9fr_1.55fr]'>
         <div>
            <img src={assets.logo} alt="Èclat De Lee logo" className='mb-5 h-12 w-auto object-contain' />
            <p className='max-w-xs text-[15px] leading-7 text-[#4b4650]'>
              36 Asafoatse Kukudabi ST, Tse-Addo, Accra
            </p>
            <a
              href='https://maps.google.com/?q=36%20Asafoatse%20Kukudabi%20ST%20Tse-Addo'
              target='_blank'
              rel='noreferrer'
              className='mt-4 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.12em] transition hover:text-[#5A0019]'
            >
              Get Direction
              <FiArrowUpRight className='h-4 w-4' aria-hidden='true' />
            </a>

            <ul className='mt-6 space-y-4 text-[15px] text-[#333036]'>
              <li>
                <a href='mailto:eclatdelee26@gmail.com' className='inline-flex items-center gap-4 transition hover:text-[#5A0019]'>
                  <FiMail className='h-5 w-5' aria-hidden='true' />
                  eclatdelee26@gmail.com
                </a>
              </li>
              <li>
                <a href='tel:0535364221' className='inline-flex items-center gap-4 transition hover:text-[#5A0019]'>
                  <FiPhone className='h-5 w-5' aria-hidden='true' />
                  053 536 4221
                </a>
              </li>
              <li className='flex items-start gap-4'>
                <FiMapPin className='mt-0.5 h-5 w-5' aria-hidden='true' />
                Opposite the Goil Filling Station
              </li>
            </ul>

            <div className='mt-7 flex flex-wrap gap-2.5'>
              {socialLinks.map(({ label, href, Icon }) => {
                const SocialIcon = Icon

                return (
                  <a
                    key={label}
                    href={href}
                    target='_blank'
                    rel='noreferrer'
                    aria-label={label}
                    className='inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#161616] text-[#161616] transition hover:border-[#5A0019] hover:bg-[#5A0019] hover:text-white'
                  >
                    <SocialIcon className='h-4 w-4' aria-hidden='true' />
                  </a>
                )
              })}
            </div>
         </div>
         <div>
            <p className='mb-5 text-[15px] font-extrabold'>Infomation</p>
            <ul className='flex flex-col gap-3.5 text-[15px] text-[#4b4650]'>
              {informationLinks.map(([label, to]) => (
                <li key={label}><Link to={to} className='transition hover:text-[#5A0019]'>{label}</Link></li>
              ))}
            </ul>
         </div>
         <div>
            <p className='mb-5 text-[15px] font-extrabold'>Customer Services</p>
            <ul className='flex flex-col gap-3.5 text-[15px] text-[#4b4650]'>
              {customerLinks.map(([label, to]) => (
                <li key={label}><Link to={to} className='transition hover:text-[#5A0019]'>{label}</Link></li>
              ))}
            </ul>
         </div>
         <div>
            <p className='mb-5 text-[15px] font-extrabold'>Newsletter</p>
            <p className='max-w-md text-[15px] leading-7 text-[#4b4650]'>
              Sign up for our newsletter and get 10% off your first purchase.
            </p>
            <form className='mt-5 flex max-w-md items-center rounded-full border border-[#161616] bg-white p-1'>
              <input
                type='email'
                placeholder='Enter your e-mail'
                className='min-w-0 flex-1 rounded-full border-0 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-[#9a949b]'
                aria-label='Email address'
              />
              <button type='submit' className='inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#111111] text-white' aria-label='Subscribe'>
                <FiSend className='h-5 w-5' aria-hidden='true' />
              </button>
            </form>
            <label className='mt-5 flex max-w-md items-start gap-3 text-[13px] leading-6 text-[#161616]'>
              <input type='checkbox' className='mt-1 h-4 w-4 shrink-0 border-[#ddd7cf]' />
              <span>
                By clicking subscribe, you agree to the <Link to='/faq' className='font-bold underline'>Terms of Service</Link> and <Link to='/faq' className='font-bold underline'>Privacy Policy</Link>.
              </span>
            </label>
         </div>
      </div>

      <div className='page-x flex flex-col gap-5 border-t border-[#e8e2da] py-5 text-[13px] text-[#4b4650] md:flex-row md:items-center md:justify-between'>
        <div className='flex flex-wrap items-center gap-x-8 gap-y-3'>
          <p>©{new Date().getFullYear()} Èclat De Lee. All Rights Reserved.</p>
          <button className='inline-flex items-center gap-2' type='button'>
            <span>GHS</span>
            <FiChevronDown className='h-4 w-4' aria-hidden='true' />
          </button>
          <button className='inline-flex items-center gap-2' type='button'>
            <span>English</span>
            <FiChevronDown className='h-4 w-4' aria-hidden='true' />
          </button>
        </div>
        <div className='flex flex-wrap items-center gap-3'>
          <span>Payment:</span>
          {paymentMethods.map((method) => (
            <span key={method.name} className='inline-flex h-7 min-w-10 items-center justify-center rounded-sm border border-[#ece7df] bg-white px-2'>
              <img
                src={method.logo}
                alt={method.name}
                className={`${method.className} max-h-5 max-w-[58px] object-contain`}
                loading='lazy'
              />
            </span>
          ))}
        </div>
      </div>
    </footer>
  )
}

export default Footer
