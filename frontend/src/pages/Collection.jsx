import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import ProductItem from '../components/ProductItem'

const productCategoryGroups = [
  {
    name: 'Men',
    subCategories: ['Bags', 'Watches', 'Shoes', 'Accessories'],
  },
  {
    name: 'Women',
    subCategories: ['Bags', 'Crossbody Bags', 'Tote Bags', 'Top Handle Bags', 'Clutches', 'Shoes', 'Watches', 'Accessories'],
  },
  {
    name: 'Home Aromatics',
    subCategories: ['Candles', 'Diffusers', 'Room Sprays'],
  },
  {
    name: 'Gift Sets',
    subCategories: ['Gift Sets'],
  },
]

const featuredCategories = productCategoryGroups.map((item) => item.name)
const productCategories = productCategoryGroups.flatMap((item) => [item.name, ...item.subCategories])

const Collection = () => {
  const { products, search,  } = useContext(ShopContext)
  const [showFilter, setShowFilter] = useState(false)
  const [filterProduct, setFilterProducts] = useState([])

  const [Category, setCategory] = useState([])

  const toggleCategory = (e) => {
    if (Category.includes(e.target.value)) {
      setCategory(prev => prev.filter(item => item !== e.target.value))
    } else {
      setCategory(prev => [...prev, e.target.value])
    }
  }

useEffect(() => {
  let productsCopy = products.slice();

  
  if (search.trim() !== "") {
    productsCopy = productsCopy.filter(item =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  
  if (Category.length > 0) {
    productsCopy = productsCopy.filter(item =>
      Category.includes(item.category) || Category.includes(item.subCategory)
    );
  }

  setFilterProducts(productsCopy);
}, [Category, search, products]);

  return (
    <section>
      <div className='page-x border-b border-[#DBCCB7]/60 py-14' data-gsap-reveal>
        <p className='eyebrow'>Collection</p>
        <h1 className='editorial-serif mt-3 text-4xl font-semibold text-[#1d1115] md:text-5xl'>The Collection</h1>
        <p className='mt-4 max-w-2xl leading-7 text-[#6f5860]'>
          Men, women, home aromatics, and gift sets, curated for you and delivered across Ghana.
        </p>
      </div>

      <div className='page-x flex flex-col gap-5 border-b border-[#DBCCB7]/60 py-5 md:flex-row md:items-center md:justify-between' data-gsap-reveal>
        <div className='flex flex-wrap items-center gap-x-8 gap-y-3 text-sm font-semibold text-[#9aa2b2]'>
          <button onClick={() => setCategory([])} className={`pb-3 ${Category.length === 0 ? 'border-b-2 border-[#5A0019] text-[#5A0019]' : ''}`}>All</button>
          {featuredCategories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(Category.includes(item) ? [] : [item])}
              className={`pb-3 ${Category.includes(item) ? 'border-b-2 border-[#5A0019] text-[#5A0019]' : ''}`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className='flex items-center gap-5 text-sm text-[#6f5860]'>
          <button onClick={() => setShowFilter(!showFilter)} className='inline-flex items-center gap-2 font-semibold text-[#5A0019]'>
            <svg viewBox='0 0 24 24' className='w-4' fill='none' stroke='currentColor' strokeWidth='1.8'>
              <path d='M4 7h16M7 12h10M10 17h4' />
            </svg>
            Filter
          </button>
          <span>Sort: <strong className='text-[#5A0019]'>Newest</strong></span>
        </div>
      </div>

      <div className='page-x border-b border-[#DBCCB7]/60 py-4 text-center text-xs font-extrabold uppercase tracking-[0.14em] text-[#5A0019]'>
        Delivery across Ghana · Secure online payment · Order tracking included · WhatsApp support during opening hours
      </div>

      <div className='page-x py-10'>
        <div className={`mb-8 border border-[#DBCCB7] bg-white p-5 ${showFilter ? '' : 'hidden'}`}>
          <div>
            <p className='mb-3 text-xs font-extrabold uppercase tracking-[0.18em]'>Categories</p>
            <div className='flex flex-wrap gap-3 text-sm text-[#6f5860]'>
              {productCategories.map((item, index) => (
                <label key={`${item}-${index}`} className='flex items-center gap-2'>
                  <input className='accent-[#5A0019]' type="checkbox" value={item} checked={Category.includes(item)} onChange={toggleCategory} /> {item}
                </label>
              ))}
            </div>
          </div>
        </div>

        <p className='mb-8 text-sm font-medium text-[#9aa2b2]'>
          {filterProduct.length} {filterProduct.length === 1 ? 'product' : 'products'}
        </p>

        <div className='grid grid-cols-2 gap-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4'>
          {filterProduct.map((item, index) => (
            <ProductItem
              key={index}
              name={item.name}
              id={item._id}
              price={item.price}
              compareAtPrice={item.compareAtPrice}
              onSale={item.onSale}
              image={item.image}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Collection
