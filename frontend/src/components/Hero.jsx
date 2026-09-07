import React, { useLayoutEffect, useRef, useState } from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const Hero = () => {
  const [active, setActive] = useState(0)
  const touchStartX = useRef(null)
  const heroRef = useRef(null)
  const imageRef = useRef(null)
  const copyRef = useRef(null)
  const arrowRefs = useRef([])
  const ctaRef = useRef(null)
  const slides = assets.heroSlides || []
  const slide = slides[active] || slides[0]
  const titleLines = slide?.title?.split('. ').filter(Boolean).map((line, index, lines) => (
    `${line}${index < lines.length - 1 ? '.' : ''}`
  )) || []

  const goToSlide = (direction) => {
    setActive((current) => (current + direction + slides.length) % slides.length)
  }

  useLayoutEffect(() => {
    if (!slide) return undefined

    let ctx
    let isMounted = true
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) return undefined

    import('gsap').then((gsapModule) => {
      if (!isMounted) return

      const gsap = gsapModule.gsap || gsapModule.default

      ctx = gsap.context(() => {
        const eyebrow = copyRef.current?.querySelector('[data-hero-eyebrow]')
        const titleItems = gsap.utils.toArray('[data-hero-title-line]')
        const body = copyRef.current?.querySelector('[data-hero-body]')
        const controls = [...arrowRefs.current.filter(Boolean), ctaRef.current].filter(Boolean)

        gsap.timeline()
          .fromTo(
            imageRef.current,
            { scale: 1.08, autoAlpha: 0.82 },
            { scale: 1, autoAlpha: 1, duration: 1.35, ease: 'power2.out' }
          )
          .fromTo(
            eyebrow,
            { autoAlpha: 0, y: 14 },
            { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power3.out' },
            '-=0.85'
          )
          .fromTo(
            titleItems,
            { autoAlpha: 0, yPercent: 110 },
            { autoAlpha: 1, yPercent: 0, duration: 0.9, stagger: 0.12, ease: 'power4.out' },
            '-=0.25'
          )
          .fromTo(
            body,
            { autoAlpha: 0, y: 18 },
            { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power3.out' },
            '-=0.45'
          )
          .fromTo(
            controls,
            { autoAlpha: 0, y: 14 },
            { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.08, ease: 'power3.out' },
            '-=0.2'
          )
      }, heroRef)
    })

    return () => {
      isMounted = false
      ctx?.revert()
    }
  }, [active, slide])

  if (!slide) return null

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0]?.clientX ?? null
  }

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) return

    const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX.current
    const deltaX = touchStartX.current - touchEndX
    touchStartX.current = null

    if (Math.abs(deltaX) < 45) return
    goToSlide(deltaX > 0 ? 1 : -1)
  }

  return (
    <section
      ref={heroRef}
      className='relative min-h-[560px] touch-pan-y overflow-hidden bg-white text-white md:min-h-[620px]'
      style={{ backgroundColor: slide.background || undefined }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <img
        ref={imageRef}
        src={slide.image}
        alt=""
        className='absolute inset-0 h-full w-full object-cover'
        style={{
          objectFit: slide.fit || 'cover',
          objectPosition: slide.position || 'center center',
        }}
      />
      <div className='absolute inset-0 bg-black/30' />

      <button
        ref={(element) => { arrowRefs.current[0] = element }}
        type='button'
        onClick={() => goToSlide(-1)}
        className='absolute left-3 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/25 text-white backdrop-blur transition hover:bg-white/35 sm:left-5 sm:h-12 sm:w-12'
        aria-label='Previous hero slide'
      >
        <span className='text-3xl leading-none'>&lsaquo;</span>
      </button>

      <button
        ref={(element) => { arrowRefs.current[1] = element }}
        type='button'
        onClick={() => goToSlide(1)}
        className='absolute right-3 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/25 text-white backdrop-blur transition hover:bg-white/35 sm:right-5 sm:h-12 sm:w-12'
        aria-label='Next hero slide'
      >
        <span className='text-3xl leading-none'>&rsaquo;</span>
      </button>

      <div ref={copyRef} className='relative z-10 mx-auto flex min-h-[560px] max-w-6xl flex-col items-center justify-center px-6 py-20 text-center md:min-h-[620px]'>
        <p data-hero-eyebrow className='mb-4 text-xs font-extrabold uppercase tracking-[0.28em] text-white/75'>{slide.eyebrow}</p>
        <h1 className='editorial-serif max-w-5xl text-5xl font-semibold leading-[0.95] text-white sm:text-7xl lg:text-8xl'>
          {titleLines.map((line) => (
            <span key={line} className='block overflow-hidden'>
              <span data-hero-title-line className='block will-change-transform'>
                {line}
              </span>
            </span>
          ))}
        </h1>
        <p data-hero-body className='mt-7 max-w-2xl text-base font-medium text-white/85 sm:text-xl'>
          {slide.text}
        </p>
        <Link
          ref={ctaRef}
          to='/collection'
          className='mt-10 bg-white px-11 py-4 text-sm font-extrabold lowercase tracking-wide text-[#5A0019] transition hover:bg-[#DBCCB7]'
        >
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
