import React, { useContext } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'

const PlaceOrder = () => {
  const { navigate } = useContext(ShopContext)

  const handleSubmit = (e) => {
    e.preventDefault() 
    navigate('/orders')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[800vh] border-t'
    >
      
      <div className='flex flex-col gap-4 w-full sm-max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>

        <div className='flex gap-3'>
            <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full'type='text' placeholder='First Name'required/>
            <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full'type='text' placeholder='Last Name'required/>
        </div>

         <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full'type='email' placeholder='Email'required/>
          <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full'type='text' placeholder='street'required/>

        <div className='flex gap-3'>
            <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full'type='text' placeholder='City'required/>
            <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full'type='text' placeholder='State'required/>
        </div>

        <div className='flex gap-3'>
          <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full'type='number' placeholder='Zipcode'required/>
          <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full'type='text' placeholder='Country'required/>
        </div>

        <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='number' placeholder='Phone'required/>
      </div>

     
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>

        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHOD'} />
          <div className='flex gap-3 flex-col lg:flex-row'>
            <div className='flex items-center gap-3 p-2 px-3 cursor-pointer'>
              <img className='h-5 mx-5' src={assets.stripe_logo} alt='' />
            </div>
            <div className='flex items-center gap-3 p-2 px-3 cursor-pointer'>
              <img className='h-5 mx-5' src={assets.razorpay_logo} alt='' />
            </div>
            <div className='flex items-center gap-3 p-2 px-3 cursor-pointer'>
              <p className='text-gray-500 text-sm font-medium mx-4'>
                CASH ON DELIVERY
              </p>
            </div>
          </div>

          <div className='w-full text-end mt-8'>
            <button type='submit' className='bg-black text-white text-sm my-8 px-8 py-3'>
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
