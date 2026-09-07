import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

const usePageAnimations = () => {
  const location = useLocation()

  useLayoutEffect(() => {
    let ctx
    let refresh
    let isMounted = true
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ]).then(([gsapModule, scrollTriggerModule]) => {
      if (!isMounted) return

      const gsap = gsapModule.gsap || gsapModule.default
      const { ScrollTrigger } = scrollTriggerModule

      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        const revealItems = gsap.utils.toArray('[data-gsap-reveal]')
        const productItems = gsap.utils.toArray('[data-gsap-product]')

        if (prefersReducedMotion) {
          gsap.set([...revealItems, ...productItems], { clearProps: 'all' })
          return
        }

        revealItems.forEach((item) => {
          gsap.fromTo(
            item,
            { autoAlpha: 0, y: 24 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: item,
                start: 'top 88%',
                once: true,
              },
            }
          )
        })

        ScrollTrigger.batch(productItems, {
          start: 'top 90%',
          once: true,
          onEnter: (batch) => {
            gsap.fromTo(
              batch,
              { autoAlpha: 0, y: 28, scale: 0.98 },
              {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                duration: 0.7,
                stagger: 0.08,
                ease: 'power3.out',
              }
            )
          },
        })
      })

      refresh = window.setTimeout(() => ScrollTrigger.refresh(), 80)
    })

    return () => {
      isMounted = false
      window.clearTimeout(refresh)
      ctx?.revert()
    }
  }, [location.pathname, location.search])
}

export default usePageAnimations
