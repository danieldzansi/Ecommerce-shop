import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'
import AssetImage from './AssetImage'

const ProductItem = ({ id, image, name, price }) => {

    const {currency}=useContext(ShopContext)
  return (
    <Link className='group block cursor-pointer text-[#1d1115]' to={`/product/${id}`}>
       <div className='relative overflow-hidden bg-white'>
        <AssetImage asset={image?.[0]} className='aspect-[3/4] w-full object-cover transition duration-500 group-hover:scale-105' alt={name} />
        <button type='button' className='absolute right-3 top-3 grid h-9 w-9 place-items-center bg-white/90 text-[#5A0019] shadow-sm transition hover:bg-[#DBCCB7]' aria-label='Save item'>
          <svg viewBox='0 0 24 24' className='w-5' fill='none' stroke='currentColor' strokeWidth='1.7'>
            <path d='M20.8 4.6a5.2 5.2 0 0 0-7.4 0L12 6l-1.4-1.4a5.2 5.2 0 0 0-7.4 7.4L12 20.8l8.8-8.8a5.2 5.2 0 0 0 0-7.4Z' />
          </svg>
        </button>
       </div>
       <div className='flex items-start justify-between gap-4 pt-4'>
        <p className='text-sm font-semibold leading-5'>{name}</p>
        <p className='whitespace-nowrap text-sm font-bold'>{currency}{price}</p>
       </div>
    </Link>
  )
}

export default ProductItem
