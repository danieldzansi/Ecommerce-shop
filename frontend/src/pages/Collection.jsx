import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import Title from '../components/Title'
import ProductItem from '../components/ProductItem'

const Collection = () => {
  const { products, search,  } = useContext(ShopContext)
  const [showFilter, setShowFilter] = useState(false)
  const [filterProduct, setFilterProducts] = useState([])

  const [Category, setCategory] = useState([])
  const [subCategory, setSubCategory] = useState([])

  const toggleCategory = (e) => {
    if (Category.includes(e.target.value)) {
      setCategory(prev => prev.filter(item => item !== e.target.value))
    } else {
      setCategory(prev => [...prev, e.target.value])
    }
  }

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory(prev => prev.filter(item => item !== e.target.value))
    } else {
      setSubCategory(prev => [...prev, e.target.value])
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
    productsCopy = productsCopy.filter(item => Category.includes(item.category));
  }

  
  if (subCategory.length > 0) {
    productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory));
  }

  setFilterProducts(productsCopy);
}, [Category, subCategory, search, products]);

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 '>
      <div className='min-w-60'>
        <p
          className='my-2 text-xl flex items-center cursor-pointer gap-2'
          onClick={() => setShowFilter(!showFilter)}
        >
          FILTERS
          <img
            className={`h-3 sm:hidden transition-transform ${showFilter ? 'rotate-90' : ''}`}
            src={assets.dropdown_icon}
            alt="dropdown"
          />
        </p>

        {/* Category Filter */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <label className='flex gap-2'>
              <input className='w-3' type="checkbox" value="Men" onChange={toggleCategory} /> Men
            </label>
            <label className='flex gap-2'>
              <input className='w-3' type="checkbox" value="Women" onChange={toggleCategory} /> Women
            </label>
            <label className='flex gap-2'>
              <input className='w-3' type="checkbox" value="Children" onChange={toggleCategory} /> Children
            </label>
          </div>
        </div>

        {/* Type / SubCategory Filter */}
        <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>TYPE</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <label className='flex gap-2'>
              <input className='w-3' type="checkbox" value="Topwear" onChange={toggleSubCategory} /> Topwear
            </label>
            <label className='flex gap-2'>
              <input className='w-3' type="checkbox" value="Bottomwear" onChange={toggleSubCategory} /> Bottomwear
            </label>
            <label className='flex gap-2'>
              <input className='w-3' type="checkbox" value="Winterwear" onChange={toggleSubCategory} /> Winterwear
            </label>
          </div>
        </div>
      </div>

      <div className='flex-1'>
        <div className='flex justify-between text-base sm:text-2xl mb-4'>
          <Title text1={'All'} text2={'COLLECTIONS'} />
        </div>

        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 gap-y-6'>
          {filterProduct.map((item, index) => (
            <ProductItem
              key={index}
              name={item.name}
              id={item._id}
              price={item.price}
              image={item.image}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Collection
