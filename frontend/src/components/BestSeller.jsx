import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'

const BestSeller = () => {
  const { products } = useContext(ShopContext)
  const [bestSeller, setBestSeller] = useState([]) // ❌ fixed: useState should return [value, setter], not {value, setter}

  useEffect(() => {
    const bestProduct = products.filter((item) => item.bestSeller)
    setBestSeller(bestProduct.slice(0, 5)) // ❌ fixed: use parentheses (), not square brackets []
  }, [products])

  return (
    <div className='my-10'>
      <div className='text-center text-3xl py-8'>
        <Title text1={'BEST'} text2={'SELLERS'} />
        <p className='w-3/4 m-auto text-xs sm:text-base text-gray-600'>
          Our most popular picks — trusted by hundreds of happy customers. Shop the best-selling items everyone’s talking about.
        </p>
      </div>
      
      
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {bestSeller.map((item, index) => (
          <div key={index} className='text-center'>
            <img src={item.image?.[0]} alt={item.name} className='w-full' />
            <p className='pt-2 text-sm font-medium'>{item.name}</p>
            <p className='text-sm text-gray-700'>${item.price}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BestSeller
