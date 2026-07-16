import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const Hero = () => {
  const [active, setActive] = useState(0)
  const slides = assets.heroSlides || []
  const slide = slides[active] || slides[0]

  const goToSlide = (direction) => {
    setActive((current) => (current + direction + slides.length) % slides.length)
  }

  if (!slide) return null

  return (
    <section className='relative min-h-[560px] overflow-hidden bg-white text-white md:min-h-[620px]'>
      <img
        src={slide.image}
        alt=""
        className='absolute inset-0 h-full w-full object-cover'
      />
      <div className='absolute inset-0 bg-black/30' />

      <button
        type='button'
        onClick={() => goToSlide(-1)}
        className='absolute left-5 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/20 text-white backdrop-blur transition hover:bg-white/35'
        aria-label='Previous hero slide'
      >
        <span className='text-3xl leading-none'>&lsaquo;</span>
      </button>

      <button
        type='button'
        onClick={() => goToSlide(1)}
        className='absolute right-5 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/20 text-white backdrop-blur transition hover:bg-white/35'
        aria-label='Next hero slide'
      >
        <span className='text-3xl leading-none'>&rsaquo;</span>
      </button>

      <div className='relative z-10 mx-auto flex min-h-[560px] max-w-6xl flex-col items-center justify-center px-6 py-20 text-center md:min-h-[620px]'>
        <p className='mb-4 text-xs font-extrabold uppercase tracking-[0.28em] text-white/75'>{slide.eyebrow}</p>
        <h1 className='editorial-serif max-w-5xl text-5xl font-semibold leading-[0.95] text-white sm:text-7xl lg:text-8xl'>
          {slide.title}
        </h1>
        <p className='mt-7 max-w-2xl text-base font-medium text-white/85 sm:text-xl'>
          {slide.text}
        </p>
        <Link to='/collection' className='mt-10 bg-white px-11 py-4 text-sm font-extrabold lowercase tracking-wide text-[#5A0019] transition hover:bg-[#DBCCB7]'>
          {slide.cta}
        </Link>

        <div className='absolute bottom-8 flex items-center gap-2'>
          {slides.map((_, index) => (
            <button
              key={index}
              type='button'
              onClick={() => setActive(index)}
              className={`h-2 rounded-full transition-all ${active === index ? 'w-8 bg-white' : 'w-2 bg-white/50'}`}
              aria-label={`Show hero slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hero
