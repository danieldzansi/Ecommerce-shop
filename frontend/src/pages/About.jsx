import React from 'react'
import { assets } from '../assets/assets'


const About = () => {
  return (
    <section className="page-x section-y">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="eyebrow">About</p>
          <h1 className="editorial-serif mt-3 text-5xl font-semibold leading-tight md:text-6xl">Curated pieces for an intentional wardrobe.</h1>
          <p className="mt-6 leading-7 text-[#6f5860]">
            Èclat De Lee is built around the finishing touches: the bag, shoe, set, or staple that makes getting dressed feel clear and considered.
          </p>
        </div>
        <img src={assets.heroSlides?.[1]?.image} alt="" className="h-[520px] w-full object-cover" />
      </div>

      <div className="mt-16 grid gap-8 border-t border-[#DBCCB7]/60 pt-12 md:grid-cols-3">
        <div>
          <p className="eyebrow">01</p>
          <h2 className="editorial-serif mt-3 text-2xl font-semibold">Ease first</h2>
          <p className="mt-4 leading-7 text-[#6f5860]">
            We choose pieces that work hard without asking you to. Simple styling, strong impact.
          </p>
        </div>
        <div>
          <p className="eyebrow">02</p>
          <h2 className="editorial-serif mt-3 text-2xl font-semibold">Polished details</h2>
          <p>
            <span className="mt-4 block leading-7 text-[#6f5860]">From texture to finish, every item is selected to bring that last, defining touch.</span>
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
    </section>
  )
}

export default About
