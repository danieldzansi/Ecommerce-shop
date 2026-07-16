import React from 'react'

const Title = ({text1 ,text2 }) => {
  return (
    <div className='mb-3'>
      <p className='eyebrow mb-3'>{text1}</p>
      <h2 className='editorial-serif text-3xl font-semibold tracking-[-0.01em] text-[#1d1115] sm:text-4xl'>
        {text2}
      </h2>
    </div>
  )
}

export default Title
