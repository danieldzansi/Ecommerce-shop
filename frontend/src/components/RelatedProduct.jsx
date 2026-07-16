import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItem from './ProductItem'

const RelatedProduct = ({ category, subCategory }) => {
  const { products } = useContext(ShopContext)
  const [related, setRelated] = useState([])

  useEffect(() => {
    if (products.length > 0) {
      let filtered = products.filter(item => item.category === category && item.subCategory === subCategory)
      setRelated(filtered.slice(0, 5))
    }
  }, [products, category, subCategory])

  return (
    <section className='mt-24 border-t border-[#DBCCB7]/60 pt-14'>
      <div className='mb-10'>
        <Title text1={'You may also like'} text2={'Complete the look'} />
      </div>

      <div className='grid grid-cols-2 gap-5 gap-y-10 md:grid-cols-3 lg:grid-cols-5'>
        {related.map((item, index) => (
          <ProductItem 
            key={index} 
            id={item._id} 
            name={item.name} 
            price={item.price} 
            image={item.image}
          />
        ))}
      </div>
    </section>
  )
}

export default RelatedProduct
