import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import ProductItem from '../components/ProductItem'
import { useSearchParams } from 'react-router-dom'

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

const isOnSale = (product) => {
  const originalPrice = Number(product?.originalPrice || product?.oldPrice || product?.compareAtPrice)
  const price = Number(product?.price)

  return product?.onSale === true || product?.onSale === 'true' || product?.sale === true || product?.discountPercent > 0 || originalPrice > price
}

const Collection = () => {
  const { products, search,  } = useContext(ShopContext)
  const [searchParams] = useSearchParams()
  const [showFilter, setShowFilter] = useState(false)
  const [filterProduct, setFilterProducts] = useState([])
  const saleOnly = searchParams.get('sale') === 'true'
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedSubCategories, setSelectedSubCategories] = useState([])
  const activeCategoryGroup = productCategoryGroups.find((item) => item.name === selectedCategory)
  const visibleSubCategories = activeCategoryGroup
    ? activeCategoryGroup.subCategories
    : Array.from(new Set(productCategoryGroups.flatMap((item) => item.subCategories)))

  useEffect(() => {
    const category = searchParams.get('category')
    const subCategory = searchParams.get('subcategory')

    setSelectedCategory(category || '')
    setSelectedSubCategories(subCategory ? [subCategory] : [])
  }, [searchParams])

  const toggleSubCategory = (value) => {
    if (selectedSubCategories.includes(value)) {
      setSelectedSubCategories(prev => prev.filter(item => item !== value))
    } else {
      setSelectedSubCategories(prev => [...prev, value])
    }
  }

  const chooseCategory = (value) => {
    setSelectedCategory((current) => (current === value ? '' : value))
    setSelectedSubCategories([])
  }

  const clearFilters = () => {
    setSelectedCategory('')
    setSelectedSubCategories([])
  }

useEffect(() => {
  let productsCopy = products.slice();

  
  if (search.trim() !== "") {
    productsCopy = productsCopy.filter(item =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  
  if (selectedCategory) {
    productsCopy = productsCopy.filter(item => item.category === selectedCategory);
  }

  if (selectedSubCategories.length > 0) {
    productsCopy = productsCopy.filter(item => selectedSubCategories.includes(item.subCategory));
  }

  if (saleOnly) {
    productsCopy = productsCopy.filter(isOnSale);
  }

  setFilterProducts(productsCopy);
}, [selectedCategory, selectedSubCategories, search, products, saleOnly]);

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
          <button onClick={clearFilters} className={`pb-3 ${!selectedCategory && selectedSubCategories.length === 0 ? 'border-b-2 border-[#5A0019] text-[#5A0019]' : ''}`}>All</button>
          {featuredCategories.map((item) => (
            <button
              key={item}
              onClick={() => chooseCategory(item)}
              className={`pb-3 ${selectedCategory === item ? 'border-b-2 border-[#5A0019] text-[#5A0019]' : ''}`}
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
          <div className='grid gap-6 md:grid-cols-[220px_1fr]'>
            <div>
              <p className='mb-3 text-xs font-extrabold uppercase tracking-[0.18em]'>Category</p>
              <div className='grid gap-2 text-sm text-[#6f5860]'>
                {productCategoryGroups.map((item) => (
                  <label key={item.name} className='flex items-center gap-2'>
                    <input
                      className='accent-[#5A0019]'
                      type="radio"
                      name="collection-category"
                      value={item.name}
                      checked={selectedCategory === item.name}
                      onChange={() => chooseCategory(item.name)}
                    />
                    {item.name}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className='mb-3 text-xs font-extrabold uppercase tracking-[0.18em]'>Sub categories</p>
              <div className='flex flex-wrap gap-3 text-sm text-[#6f5860]'>
                {visibleSubCategories.map((item) => (
                  <label key={item} className='flex items-center gap-2'>
                    <input
                      className='accent-[#5A0019]'
                      type="checkbox"
                      value={item}
                      checked={selectedSubCategories.includes(item)}
                      onChange={() => toggleSubCategory(item)}
                    />
                    {item}
                  </label>
                ))}
              </div>
              {selectedCategory && (
                <p className='mt-3 text-xs text-[#9aa2b2]'>
                  Showing subcategories under {selectedCategory}.
                </p>
              )}
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
