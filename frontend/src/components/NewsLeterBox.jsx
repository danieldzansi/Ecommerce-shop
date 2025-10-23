import React from 'react'

const NewsLeterBox = () => {
  return (
    <div className='text-center'>
      <p className='text-2xl font-medium text-gray-800'>Subscribe now and get 20% off</p>
      <p className='text-gray-400 mt-3'>
        Stay in the loop! Subscribe to our newsletter for exclusive deals, style tips, and updates on our latest collections.
      </p>
      <form className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3 '>
         <input className='w-full sm:flex outline' type="email" placeholder='Enter your email' required />
        <button className='bg-black text-white text-xs px-10 py-4' type='submit'>SUBSCRIBE</button>
      </form>
     
    </div>
  )
}

export default NewsLeterBox
