import React from 'react'
import { Link } from 'react-router-dom'

const faqs = [
  {
    question: 'How do I place an order?',
    answer: 'Browse our collections, select your preferred item, choose any available options, add it to your cart, and proceed to checkout.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We currently support cash on delivery for Ghana orders. Any additional secure payment options will appear at checkout when available.',
  },
  {
    question: 'Do you offer delivery?',
    answer: 'Yes. We deliver within Ghana through trusted delivery partners.',
  },
  {
    question: 'How long does delivery take?',
    answer: 'Greater Accra delivery usually takes 1-2 business days. Other regions usually take 2-5 business days, depending on the exact location.',
  },
  {
    question: 'How can I track my order?',
    answer: 'Use the Track Order page with your email address and order number to check your order status.',
  },
  {
    question: 'Can I change or cancel my order?',
    answer: 'Orders can only be changed or cancelled before they have been processed for delivery. Please contact customer support as soon as possible.',
  },
  {
    question: 'Do you accept returns or exchanges?',
    answer: 'Yes. Eligible unused items in their original condition may be returned or exchanged within the return period.',
  },
  {
    question: 'What if I receive a damaged or incorrect item?',
    answer: 'Please contact us within 48 hours of delivery with your order number and clear photos of the item and packaging.',
  },
  {
    question: 'Are your products authentic?',
    answer: 'We are committed to offering high-quality fashion products. Product descriptions reflect each item’s quality, features, and specifications.',
  },
  {
    question: 'Will the product look exactly like the photos?',
    answer: 'We make every effort to display products accurately, but slight color differences can happen because of lighting or screen settings.',
  },
  {
    question: 'Do I need an account to shop?',
    answer: 'No. You can complete checkout with the details requested during order placement.',
  },
  {
    question: 'Do you offer discounts or promotions?',
    answer: 'Yes. We introduce selected promotions and seasonal offers. Check the storefront for current updates.',
  },
]

const FAQ = () => {
  return (
    <section className="page-x section-y">
      <div className="mx-auto max-w-3xl text-center">
        <p className="eyebrow">Help</p>
        <h1 className="editorial-serif mt-3 text-5xl font-semibold">Frequently asked questions</h1>
        <p className="mt-4 leading-7 text-[#6f5860]">
          Clear answers about ordering, delivery, returns, and shopping with Èclat De Lee.
        </p>
      </div>

      <div className="mx-auto mt-14 max-w-4xl divide-y divide-[#DBCCB7]/60 border-y border-[#DBCCB7]/60">
        {faqs.map((item, index) => (
          <details key={item.question} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-left font-extrabold text-[#1d1115]">
              <span>{index + 1}. {item.question}</span>
              <span className="text-2xl text-[#5A0019] group-open:rotate-45">+</span>
            </summary>
            <p className="mt-4 leading-7 text-[#6f5860]">{item.answer}</p>
          </details>
        ))}
      </div>

      <div className="mx-auto mt-12 max-w-4xl bg-[#f7f1ea] p-6 text-center">
        <h2 className="editorial-serif text-2xl font-semibold">Still need help?</h2>
        <p className="mt-3 text-sm leading-6 text-[#6f5860]">
          Our customer care team is happy to assist with orders, deliveries, exchanges, and returns.
        </p>
        <Link to="/contact" className="btn-primary mt-6">
          Contact us
        </Link>
      </div>
    </section>
  )
}

export default FAQ
