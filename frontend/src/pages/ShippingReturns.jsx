import React from 'react'
import { Link } from 'react-router-dom'

const shippingSections = [
  {
    title: 'Order processing',
    items: [
      'Orders are processed within 24-48 hours after confirmation.',
      'Orders placed on weekends or public holidays are processed on the next working day.',
      'You will receive confirmation once your order has been placed successfully.',
    ],
  },
  {
    title: 'Delivery within Ghana',
    items: [
      'Greater Accra standard delivery usually takes 1-2 business days.',
      'Selected Greater Accra locations may qualify for same-day delivery when available.',
      'Other regions usually take 2-5 business days depending on location and courier schedules.',
    ],
  },
  {
    title: 'Shipping fees',
    items: [
      'Shipping costs are shown during checkout based on your delivery details.',
      'Free nationwide shipping may be offered during selected promotional periods.',
    ],
  },
  {
    title: 'Order tracking',
    items: [
      'Use the Track Order page to check your order status with your email and order number.',
      'Where available, delivery updates may also be shared by email, SMS, or WhatsApp.',
    ],
  },
  {
    title: 'Failed deliveries',
    items: [
      'Please make sure your delivery address and phone number are correct.',
      'If delivery fails because of incorrect information or recipient unavailability, additional delivery charges may apply.',
    ],
  },
]

const returnSections = [
  {
    title: 'Return eligibility',
    items: [
      'Items may be returned within 7 days of receiving your order.',
      'Items must be unused, unworn, in original packaging, with tags attached and proof of purchase provided.',
    ],
  },
  {
    title: 'Non-returnable items',
    items: [
      'Clearance or sale items.',
      'Gift cards.',
      'Customized or personalized products.',
      'Items damaged after delivery.',
    ],
  },
  {
    title: 'Damaged or incorrect orders',
    items: [
      'Contact us within 48 hours of delivery.',
      'Provide your order number, clear item photos, and packaging photos.',
      'Our team will review your request and arrange a replacement or refund where appropriate.',
    ],
  },
  {
    title: 'Exchanges',
    items: [
      'Eligible items may be exchanged for another size, colour, or product of equal value, subject to availability.',
      'If the replacement item costs more, you only pay the price difference.',
    ],
  },
  {
    title: 'Refund policy',
    items: [
      'Approved refunds are processed within 5-10 business days using the original payment method where applicable.',
      'Shipping charges are only refundable if the error was caused by us.',
    ],
  },
]

const PolicyBlock = ({ title, items }) => (
  <div className="border border-[#DBCCB7]/70 bg-white p-6">
    <h3 className="editorial-serif text-2xl font-semibold">{title}</h3>
    <ul className="mt-4 space-y-3 text-sm leading-6 text-[#6f5860]">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#5A0019]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
)

const ShippingReturns = () => {
  return (
    <section className="page-x section-y">
      <div className="mx-auto max-w-3xl text-center">
        <p className="eyebrow">Policy</p>
        <h1 className="editorial-serif mt-3 text-5xl font-semibold">Shipping & returns</h1>
        <p className="mt-4 leading-7 text-[#6f5860]">
          Every order is carefully packaged and delivered with care so your pieces arrive in excellent condition.
        </p>
      </div>

      <div className="mt-14">
        <p className="eyebrow">Shipping policy</p>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {shippingSections.map((section) => (
            <PolicyBlock key={section.title} {...section} />
          ))}
        </div>
      </div>

      <div className="mt-16">
        <p className="eyebrow">Returns & exchanges</p>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {returnSections.map((section) => (
            <PolicyBlock key={section.title} {...section} />
          ))}
        </div>
      </div>

      <div className="mt-12 bg-[#5A0019] p-8 text-white">
        <h2 className="editorial-serif text-3xl font-semibold">Need help?</h2>
        <p className="mt-3 max-w-3xl leading-7 text-[#DBCCB7]">
          Our customer care team is available Monday to Saturday, 9:00 AM - 6:00 PM GMT, to assist with orders, deliveries, exchanges, and returns.
        </p>
        <Link to="/contact" className="mt-6 inline-flex bg-white px-8 py-3 text-sm font-extrabold uppercase tracking-[0.08em] text-[#5A0019]">
          Contact us
        </Link>
      </div>
    </section>
  )
}

export default ShippingReturns
