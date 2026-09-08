import React from 'react'
import { Link } from 'react-router-dom'
import { FaInstagram } from 'react-icons/fa'
import { FiArrowUpRight, FiMail, FiMapPin, FiPhone } from 'react-icons/fi'
import { assets } from '../assets/assets'
import { paymentMethods } from '../assets/paymentMethods'

const informationLinks = [
  ['About Us', '/about'],
  ['Contact us', '/contact'],
  ['Shop', '/collection'],
  ['Track Order', '/orders'],
]

const customerLinks = [
  ['Shipping & Returns', '/shipping-returns'],
  ['Orders FAQs', '/faq'],
  ['Contact Support', '/contact'],
]

const socialLinks = [
  { label: 'Instagram', href: 'https://www.instagram.com/eclatdelee', Icon: FaInstagram },
]

const Footer = () => {
  return (
    <footer className='border-t border-[#e8e2da] bg-white text-[#161616]'>
      <div className='mx-auto grid w-full max-w-6xl gap-12 px-7 py-16 sm:grid-cols-2 sm:px-10 lg:grid-cols-[1.05fr_1.25fr_0.85fr_1fr] lg:gap-16 lg:px-12 lg:py-20' data-gsap-reveal>
         <div className='max-w-xs'>
            <img src={assets.logo} alt="Èclat De Lee logo" className='mb-5 h-12 w-auto object-contain' />
            <p className='max-w-xs text-[15px] leading-7 text-[#4b4650]'>
              Elegance, style, and everyday luxury delivered with care.
            </p>
            <div className='mt-8 border-t border-[#e8e2da] pt-6'>
              <p className='mb-4 text-sm font-bold'>Find us here:</p>
              <div className='flex flex-wrap gap-2.5'>
                {socialLinks.map(({ label, href, Icon }) => {
                  const SocialIcon = Icon

                  return (
                    <a
                      key={label}
                      href={href}
                      target='_blank'
                      rel='noreferrer'
                      aria-label={label}
                      className='inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#161616] text-[#161616] transition hover:border-[#5A0019] hover:bg-[#5A0019] hover:text-white'
                    >
                      <SocialIcon className='h-4 w-4' aria-hidden='true' />
                    </a>
                  )
                })}
              </div>
            </div>
         </div>
         <div className='max-w-sm'>
            <p className='mb-5 text-[15px] font-extrabold'>Contact</p>
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
         </div>
         <div>
            <p className='mb-5 text-[15px] font-extrabold'>Information</p>
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
      </div>

      <div className='mx-auto flex w-full max-w-6xl flex-col gap-5 border-t border-[#e8e2da] px-7 py-5 text-[13px] text-[#4b4650] sm:px-10 md:flex-row md:items-center md:justify-between lg:px-12'>
        <div className='flex flex-wrap items-center gap-x-8 gap-y-3'>
          <p>©{new Date().getFullYear()} Èclat De Lee. All Rights Reserved.</p>
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
