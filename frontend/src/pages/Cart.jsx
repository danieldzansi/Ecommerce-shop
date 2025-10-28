import React, { useContext, useEffect, useState } from 'react'
import Title from '../components/Title'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets' // assuming your bin icon is here
import CartTotal from '../components/CartTotal'
import { useNavigate } from 'react-router-dom'




const Cart = () => {
  const { products, currency, cartItems, setCartItems } = useContext(ShopContext)
   const navigate = useNavigate()
  const [cartData, setCartData] = useState([])

  // 🧠 Function to increase quantity
  const handleIncrease = (productId, size) => {
    const updatedCart = { ...cartItems }

    if (updatedCart[productId] && updatedCart[productId][size]) {
      updatedCart[productId][size] += 1
    } else {
      if (!updatedCart[productId]) updatedCart[productId] = {}
      updatedCart[productId][size] = 1
    }

    setCartItems(updatedCart)
  }

  // ➖ Function to decrease quantity
  const handleDecrease = (productId, size) => {
    const updatedCart = { ...cartItems }

    if (updatedCart[productId] && updatedCart[productId][size] > 1) {
      updatedCart[productId][size] -= 1
    } else {
      // if quantity is 1, remove that size
      delete updatedCart[productId][size]
      if (Object.keys(updatedCart[productId]).length === 0) {
        delete updatedCart[productId]
      }
    }

    setCartItems(updatedCart)
  }

  // 🗑️ Remove product completely
  const handleRemove = (productId, size) => {
    const updatedCart = { ...cartItems }
    delete updatedCart[productId][size]
    if (Object.keys(updatedCart[productId]).length === 0) {
      delete updatedCart[productId]
    }
    setCartItems(updatedCart)
  }

  // 🧩 Update cart display when items change
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

  // 🛒 Render cart items
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
              className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_2fr_1fr_0.5fr] items-center gap-4'
            >
              {/* 🛍️ Product Info */}
              <div className='flex items-start gap-6'>
                <img className='w-16 sm:w-20' src={productData.image[0]} alt="" />
                <div className='text-xs sm:text-lg font-medium'>
                  <p>{productData.name}</p>
                  <p className='text-gray-500 text-sm'>Size: {item.size}</p>
                  <p className='text-gray-900'>{currency}{productData.price}</p>
                </div>
              </div>

              {/* 🔢 Quantity Counter */}
              <div className='flex items-center gap-2'>
                <button
                  disabled={item.quantity === 1}
                  onClick={() => handleDecrease(item._id, item.size)}
                  className='px-3 py-1 text-lg bg-gray-200 hover:bg-gray-300 rounded-l-lg'
                >
                  −
                </button>
                <div className='px-4 py-1 text-lg border-t border-b border-gray-300'>
                  {item.quantity}
                </div>
                <button
                  onClick={() => handleIncrease(item._id, item.size)}
                  className='px-3 py-1 text-lg bg-gray-200 hover:bg-gray-300 rounded-r-lg'
                >
                  +
                </button>
              </div>

              {/* 💰 Price */}
              <p className='text-sm sm:text-lg font-semibold'>
                {currency}{productData.price * item.quantity}
              </p>

              {/* 🗑️ Bin icon (optional full delete) */}
              <img
                src={assets.bin_icon}
                alt="Remove"
                className="w-5 sm:w-6 cursor-pointer hover:opacity-60"
                onClick={() => handleRemove(item._id, item.size)}
              />
            </div>
          )
        })}
      </div>
      <div className='flex justify-end my-20'> 
        <div className='w-full sm:w-[450px]'>
            <CartTotal/>
            <div className='w-full text-end'>
              <button onClick={()=>navigate('/place-order')} className='bg-black text-white text-sm my-8 px-8 py-3'>PROCEED TO CHECKOUT</button>
            </div>
        </div>
         
      </div>
    </div>
  )
}

export default Cart
