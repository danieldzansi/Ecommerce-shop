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
  const titleLines = slide?.titleLines || slide?.title?.split('. ').filter(Boolean).map((line, index, lines) => (
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
            { scale: 1.08, autoAlpha: 0.88 },
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
            { autoAlpha: 0, y: 46 },
            { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power4.out' },
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
      className='relative touch-pan-y overflow-hidden border-b border-[#e8e2da] bg-white text-[#111111]'
      style={{ backgroundColor: slide.background || undefined }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className='grid min-h-[620px] grid-cols-1 md:grid-cols-[56px_minmax(0,1.2fr)_minmax(450px,1fr)] xl:grid-cols-[64px_minmax(0,1.18fr)_minmax(560px,1fr)]'>
        <aside className='hidden border-r border-[#e8e2da] bg-white md:flex md:flex-col md:items-center md:justify-end md:gap-3 md:pb-24'>
          {['IG', 'WA'].map((item) => (
            <React.Fragment key={item}>
              <span className='text-[10px] font-bold uppercase text-[#4b4650]'>{item}</span>
              {item !== 'WA' && <span className='h-5 w-px bg-[#111111]' aria-hidden='true' />}
            </React.Fragment>
          ))}
        </aside>

        <div className='relative min-h-[420px] overflow-hidden md:min-h-[620px]'>
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
        </div>

        <div className='relative min-h-[420px] overflow-hidden bg-white bg-[radial-gradient(#d8d0c8_1px,transparent_1px)] [background-size:22px_22px] md:min-h-[620px]'>
          <div ref={copyRef} className='relative z-10 flex h-full min-h-[420px] min-w-0 flex-col justify-center px-7 py-16 sm:px-10 md:min-h-[620px] lg:px-12 xl:px-14'>
            <p data-hero-eyebrow className='mb-5 text-[11px] font-extrabold uppercase tracking-[0.28em] text-[#5A0019]'>{slide.eyebrow}</p>
            <h1 className='editorial-serif w-full max-w-full text-5xl font-semibold leading-[1.06] text-[#111111] sm:text-6xl lg:text-[4.5rem] xl:text-[5.15rem]'>
              {titleLines.map((line) => (
                <span key={line} className='block min-w-0 overflow-visible py-1'>
                  <span data-hero-title-line className='block min-w-0 will-change-transform'>
                    {line}
                  </span>
                </span>
              ))}
            </h1>
            <p data-hero-body className='mt-7 max-w-lg text-base font-medium leading-7 text-[#4b4650]'>
              {slide.text}
            </p>
            <Link
              ref={ctaRef}
              to='/collection'
              className='mt-9 inline-flex w-fit items-center justify-center bg-[#111111] px-9 py-4 text-sm font-extrabold text-white transition hover:bg-[#5A0019]'
            >
              {slide.cta}
            </Link>
          </div>
        </div>
      </div>

      <button
        ref={(element) => { arrowRefs.current[0] = element }}
        type='button'
        onClick={() => goToSlide(-1)}
        className='absolute bottom-7 right-24 z-20 grid h-10 w-10 place-items-center text-[#111111] transition hover:text-[#5A0019] md:right-28'
        aria-label='Previous hero slide'
      >
        <span className='text-3xl leading-none'>&larr;</span>
      </button>

      <button
        ref={(element) => { arrowRefs.current[1] = element }}
        type='button'
        onClick={() => goToSlide(1)}
        className='absolute bottom-7 right-8 z-20 grid h-10 w-10 place-items-center text-[#111111] transition hover:text-[#5A0019] md:right-12'
        aria-label='Next hero slide'
      >
        <span className='text-3xl leading-none'>&rarr;</span>
      </button>

      <div className='absolute bottom-9 right-40 z-20 flex items-end gap-1 text-[#111111] md:right-48'>
        <span className='text-2xl font-extrabold leading-none'>{active + 1}</span>
        <span className='mb-1 text-sm font-bold'>/{slides.length}</span>
      </div>

      <div className='absolute right-8 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-center gap-2 md:flex'>
        {slides.map((_, index) => (
          <button
            key={index}
            type='button'
            onClick={() => setActive(index)}
            className={`h-7 w-px transition-all ${active === index ? 'bg-[#111111]' : 'bg-[#b8b0a8]'}`}
            aria-label={`Show hero slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

export default Hero
