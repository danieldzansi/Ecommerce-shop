import React from 'react'
import { assets } from '../assets/assets'


const About = () => {
  const categories = [
    'Luxury handbags',
    'Designer shoes',
    'Wallets & purses',
    'Fashion accessories',
    'Sunglasses',
    'Watches',
    'Travel bags',
    'Perfumes & belts',
    'New arrivals',
  ]

  return (
    <section className="page-x section-y">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="eyebrow">About</p>
          <h1 className="editorial-serif mt-3 text-5xl font-semibold leading-tight md:text-6xl">Elegance meets everyday luxury.</h1>
          <p className="mt-6 leading-7 text-[#6f5860]">
            We believe luxury should be accessible, stylish, and unforgettable. Our carefully selected collection features premium handbags, shoes, accessories, and fashion pieces designed for people who appreciate quality, sophistication, and confidence.
          </p>
          <p className="mt-4 leading-7 text-[#6f5860]">
            Whether you are dressing for work, a special occasion, or everyday elegance, Èclat De Lee brings you pieces that make a lasting impression.
          </p>
        </div>
        <img src={assets.heroSlides?.[1]?.image} alt="" className="h-[520px] w-full object-cover" />
      </div>

      <div className="mt-16 border-t border-[#DBCCB7]/60 pt-12">
        <p className="eyebrow">Categories</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div key={category} className="border border-[#DBCCB7]/70 bg-white px-5 py-4 text-sm font-bold text-[#5A0019]">
              {category}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 grid gap-8 border-t border-[#DBCCB7]/60 pt-12 md:grid-cols-3">
        <div>
          <p className="eyebrow">01</p>
          <h2 className="editorial-serif mt-3 text-2xl font-semibold">Curated quality</h2>
          <p className="mt-4 leading-7 text-[#6f5860]">
            Every product is selected with attention to quality, craftsmanship, and style.
          </p>
        </div>
        <div>
          <p className="eyebrow">02</p>
          <h2 className="editorial-serif mt-3 text-2xl font-semibold">Everyday confidence</h2>
          <p>
            <span className="mt-4 block leading-7 text-[#6f5860]">From handbags to accessories, our pieces are chosen to help you feel polished and prepared.</span>
          </p>
        </div>
        <div>
          <p className="eyebrow">03</p>
          <h2 className="editorial-serif mt-3 text-2xl font-semibold">Reliable service</h2>
          <p className="mt-4 leading-7 text-[#6f5860]">
            Clear checkout, order tracking, and helpful support from browse to delivery.
          </p>
        </div>
      </div>

      <div className="mt-16 bg-[#5A0019] px-6 py-10 text-white md:px-10">
        <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#DBCCB7]">Our promise</p>
        <h2 className="editorial-serif mt-3 text-3xl font-semibold">Luxury. Style. Confidence. Delivered to your door.</h2>
        <p className="mt-4 max-w-3xl leading-7 text-[#DBCCB7]">
          Every piece in our collection is chosen by hand, never in bulk. We check the quality before it is listed and again before it ships. What arrives at your door is exactly what you saw online.
        </p>
      </div>
    </section>
  )
}

export default About
