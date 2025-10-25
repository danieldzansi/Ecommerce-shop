import React, { useContext, useEffect, useState } from 'react'

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
    <div>
      
    </div>
  )
}

export default Cart
