import React, { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { FiChevronRight } from 'react-icons/fi'
import { assets } from '../assets/assets'

const featuredBanners = [
  {
    title: 'Luxury Bags',
    image: assets.categoryBags,
    to: '/collection?subcategory=Bags',
  },
  {
    title: 'Watches',
    image: assets.categoryWatches,
    to: '/collection?subcategory=Watches',
  },
]

const wideBanners = [
  {
    title: 'Season Sale',
    image: assets.categorySale,
    to: '/collection?sale=true',
  },
  {
    title: 'Home Aromatics',
    image: assets.categoryAromatics,
    to: '/collection?category=Home%20Aromatics',
  },
]

const BannerTile = ({ item, large = false }) => (
  <Link
    to={item.to}
    data-category-card
    className='group/category relative block overflow-hidden rounded-[4px] border border-white bg-[#ddd] outline-none'
    aria-label={`Shop ${item.title}`}
  >
    <div className={large ? 'aspect-[5.15/1]' : 'aspect-[2.55/1]'}>
      <img
        src={item.image}
        alt=""
        className='h-full w-full object-cover object-center transition duration-500 group-hover/category:scale-[1.035]'
      />
    </div>
    <div className='absolute inset-0 bg-black/28 transition duration-300 group-hover/category:bg-black/18' aria-hidden='true' />
    <div className='absolute inset-0 flex items-center justify-center px-5 text-center'>
      <h3 className='max-w-full text-3xl font-extrabold uppercase leading-none tracking-[0.08em] text-white drop-shadow-[0_3px_12px_rgba(0,0,0,0.35)] sm:text-4xl'>
        {item.title}
      </h3>
    </div>
  </Link>
)

const CategoryShowcase = () => {
  const sectionRef = useRef(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    let ctx
    let isMounted = true

    Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ]).then(([gsapModule, scrollTriggerModule]) => {
      if (!isMounted) return

      const gsap = gsapModule.gsap || gsapModule.default
      const { ScrollTrigger } = scrollTriggerModule
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        gsap.fromTo(
          '[data-category-card]',
          { autoAlpha: 0, y: 20 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
            ease: 'power3.out',
            stagger: 0.07,
            scrollTrigger: {
              trigger: section,
              start: 'top 84%',
              once: true,
            },
          }
        )
      }, section)
    })

    return () => {
      isMounted = false
      ctx?.revert()
    }
  }, [])

  return (
    <section ref={sectionRef} className='border-b border-[#ded8cf] bg-[#eeeeee] pb-5 pt-8 text-[#111111] sm:pb-6 sm:pt-10'>
      <div className='page-x mx-auto max-w-6xl'>
        <div className='overflow-hidden rounded-[6px] bg-white shadow-[0_1px_4px_rgba(17,17,17,0.08)]'>
          <div className='flex items-center justify-between px-4 py-3'>
            <h2 className='text-lg font-extrabold text-[#1d1115]'>Featured Categories</h2>
            <Link
              to='/collection'
              className='inline-flex items-center gap-1 text-xs font-extrabold uppercase tracking-[0.04em] text-[#5A0019] transition hover:text-[#111111]'
            >
              See All
              <FiChevronRight className='h-4 w-4' aria-hidden='true' />
            </Link>
          </div>

          <div className='grid gap-2 border-t border-[#eee7df] p-2'>
            <div className='grid gap-2 md:grid-cols-2'>
              {featuredBanners.map((item) => (
                <BannerTile key={item.title} item={item} />
              ))}
            </div>

            {wideBanners.map((item) => (
              <BannerTile key={item.title} item={item} large />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CategoryShowcase
