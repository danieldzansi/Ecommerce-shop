import React, { useContext, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import ProductItem from './ProductItem'

const tabs = [
  {
    id: 'new',
    label: 'New Arrivals',
    emptyTitle: 'New arrivals are coming soon.',
    emptyText: 'Fresh pieces are being prepared for the next drop. Check back shortly for the latest edit.',
  },
  {
    id: 'best',
    label: 'Best Seller',
    emptyTitle: 'Customer favorites are coming soon.',
    emptyText: 'Our most-loved pieces will appear here once the collection is ready.',
  },
  {
    id: 'sale',
    label: 'On Sale',
    emptyTitle: 'No sale pieces right now.',
    emptyText: 'Special offers will appear here when selected items are marked down.',
  },
]

const isBestSeller = (product) => product?.bestseller === true || product?.bestseller === 'true'

const isOnSale = (product) => {
  const originalPrice = Number(product?.originalPrice || product?.oldPrice || product?.compareAtPrice)
  const price = Number(product?.price)

  return product?.onSale === true || product?.sale === true || product?.discountPercent > 0 || originalPrice > price
}

const ProductTabs = () => {
  const { products } = useContext(ShopContext)
  const [activeTab, setActiveTab] = useState('new')
  const gridRef = useRef(null)

  const tabProducts = useMemo(() => {
    const sortedProducts = [...products].sort((a, b) => Number(b.date || 0) - Number(a.date || 0))

    return {
      new: sortedProducts.slice(0, 8),
      best: sortedProducts.filter(isBestSeller).slice(0, 8),
      sale: sortedProducts.filter(isOnSale).slice(0, 8),
    }
  }, [products])

  const activeProducts = tabProducts[activeTab] || []
  const activeTabDetails = tabs.find((tab) => tab.id === activeTab) || tabs[0]

  useLayoutEffect(() => {
    const grid = gridRef.current
    if (!grid || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    let ctx
    let isMounted = true

    import('gsap').then((gsapModule) => {
      if (!isMounted) return

      const gsap = gsapModule.gsap || gsapModule.default

      ctx = gsap.context(() => {
        gsap.fromTo(
          grid.children,
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.07, ease: 'power3.out' }
        )
      }, grid)
    })

    return () => {
      isMounted = false
      ctx?.revert()
    }
  }, [activeTab, activeProducts.length])

  return (
    <section className='page-x section-y border-b border-[#DBCCB7]/60 bg-white' data-gsap-reveal>
      <div className='mb-10 flex justify-center'>
        <div className='flex flex-wrap items-center justify-center gap-x-10 gap-y-4'>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type='button'
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2 text-2xl font-semibold transition sm:text-3xl ${
                activeTab === tab.id
                  ? 'border-b-2 border-[#161616] text-[#161616]'
                  : 'border-b-2 border-transparent text-[#4b4650] hover:text-[#161616]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeProducts.length > 0 ? (
        <div ref={gridRef} className='grid grid-cols-2 gap-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4'>
          {activeProducts.map((item) => (
            <ProductItem
              key={item._id || item.id}
              id={item._id || item.id}
              image={item.image}
              name={item.name}
              price={item.price}
              compareAtPrice={item.compareAtPrice}
              onSale={item.onSale}
            />
          ))}
        </div>
      ) : (
        <div ref={gridRef} className='mx-auto max-w-xl border border-[#DBCCB7]/70 bg-white px-6 py-12 text-center'>
          <p className='text-lg font-semibold text-[#1d1115]'>{activeTabDetails.emptyTitle}</p>
          <p className='mt-3 text-sm leading-6 text-[#6f5860]'>
            {activeTabDetails.emptyText}
          </p>
        </div>
      )}
    </section>
  )
}

export default ProductTabs
