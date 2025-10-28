import React, { useContext, useEffect, useState } from 'react'
import Title from '../components/Title'
import { ShopContext } from '../context/ShopContext'


const Cart = () => {
  const { products, currency, cartItems } = useContext(ShopContext)
  const [cartData, setCartData] = useState([])

  useEffect(() => {
    const tempData = []

    for (const productId in cartItems) {
      for (const size in cartItems[productId]) {
        const quantity = cartItems[productId][size]
        if (quantity > 0) {
          tempData.push({
            _id: productId,
            size: size,
            quantity: quantity
          })
        }
      }
    }

    setCartData(tempData)
  }, [cartItems])

  return (
    <div className='pt-14'>
      <div className='text-2xl mb-3'>
        <Title text1={'YOUR'} text2={'CART'} />
      </div>

      <div>
        {cartData.map((item, index) => {
          const productData = products.find((p) => p._id === item._id)
          if (!productData) return null

          return (
            <div
              key={index}
              className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_2fr_0.5fr] items-center gap-4'
            >
              <div className='flex items-start gap-6'>
                <img className='w-16 sm:w-20' src={productData.image[0]} alt="" />

                <div className='text-xs sm:text-lg font-medium'>
                  <p>{productData.name}</p>
                  <p className='text-gray-500 text-sm'>Size: {item.size}</p>
                  <p className='text-gray-900'>{currency}{productData.price}</p>
                </div>
              </div>

              <p className='text-sm sm:text-lg'>Qty: {item.quantity}</p>

              <p className='text-sm sm:text-lg font-semibold'>
                {currency}{productData.price * item.quantity}
              </p>
              <input className='border max-w-10 sm:max-w-20 py-1' type="number" min={1} defaultValue={item.quantity} />
              <img src="" alt="" />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Cart
