import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'
import AssetImage from './AssetImage'
import { FiArrowUpRight, FiHeart } from 'react-icons/fi'

const ProductItem = ({ id, image, name, price, compareAtPrice, onSale }) => {

  const {currency}=useContext(ShopContext)
  const numericPrice = Number(price || 0)
  const numericCompareAtPrice = Number(compareAtPrice || 0)
  const hasSalePrice = (onSale === true || onSale === 'true' || numericCompareAtPrice > numericPrice) && numericCompareAtPrice > numericPrice
  const discountPercent = hasSalePrice ? Math.round(((numericCompareAtPrice - numericPrice) / numericCompareAtPrice) * 100) : 0
  const primaryImage = image?.[0]
  const hoverImage = image?.[1]

  return (
    <Link className='group block cursor-pointer text-[#1d1115]' to={`/product/${id}`} data-gsap-product>
       <div className='relative overflow-hidden bg-[#f7f3ee]'>
        <AssetImage
          asset={primaryImage}
          className='aspect-[3/4] w-full object-cover transition duration-700 ease-out group-hover:scale-105'
          alt={name}
        />
        {hoverImage && (
          <AssetImage
            asset={hoverImage}
            className='absolute inset-0 aspect-[3/4] h-full w-full object-cover opacity-0 transition duration-700 ease-out group-hover:scale-105 group-hover:opacity-100'
            alt=""
          />
        )}
        <span className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100' />
        {hasSalePrice && (
          <span className='absolute left-3 top-3 rounded-full bg-[#ef3f45] px-3 py-1 text-xs font-extrabold text-white shadow-sm transition duration-300 group-hover:-translate-y-0.5'>
            -{discountPercent}%
          </span>
        )}
        <span className='absolute right-3 top-3 grid h-9 w-9 place-items-center bg-white/90 text-[#5A0019] shadow-sm transition duration-300 group-hover:-translate-y-0.5 group-hover:bg-white' aria-hidden='true'>
          <FiHeart className='h-5 w-5' />
        </span>
        <span className='absolute inset-x-3 bottom-3 flex translate-y-3 items-center justify-between bg-white px-4 py-3 text-xs font-extrabold uppercase tracking-[0.12em] text-[#111111] opacity-0 shadow-sm transition duration-300 group-hover:translate-y-0 group-hover:opacity-100'>
          View product
          <FiArrowUpRight className='h-4 w-4' aria-hidden='true' />
        </span>
       </div>
       <div className='flex items-start justify-between gap-4 pt-4'>
        <p className='text-sm font-semibold leading-5 transition duration-200 group-hover:text-[#5A0019]'>{name}</p>
        <div className='text-right'>
          <p className='whitespace-nowrap text-sm font-bold'>{currency}{price}</p>
          {hasSalePrice && (
            <p className='whitespace-nowrap text-xs font-semibold text-[#8b7b82] line-through'>{currency}{compareAtPrice}</p>
          )}
        </div>
       </div>
    </Link>
  )
}

export default ProductItem
