import React from 'react'

const NewsLeterBox = () => {
  const onSubmitHandler=(event)=>{
      event.preventDefault()
  }
  return (
    <section className='page-x section-y text-center'>
      <p className='eyebrow'>Private list</p>
      <h2 className='editorial-serif mx-auto mt-3 max-w-2xl text-4xl font-semibold leading-tight text-[#1d1115] md:text-5xl'>First look at the next edit</h2>
      <p className='mx-auto mt-4 max-w-xl text-sm leading-6 text-[#6f5860]'>
        Get early access to new drops, quiet restocks, and styling notes made for a more intentional wardrobe.
      </p>
      <form onSubmit={onSubmitHandler} className='mx-auto mt-8 flex w-full max-w-xl flex-col border border-[#DBCCB7] bg-white p-2 sm:flex-row'>
         <input className='min-h-12 flex-1 px-4 outline-none' type="email" placeholder='Email address' required />
        <button className='btn-primary' type='submit'>Join the list</button>
      </form>
     
    </section>
  )
}

export default NewsLeterBox
