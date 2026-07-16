import React from 'react'
import { assets } from '../assets/assets'
import AssetImage from './AssetImage'

const OurPolicy = () => {
  return (
    <section className='page-x grid gap-6 border-y border-[#DBCCB7]/60 py-12 text-sm text-[#1d1115] md:grid-cols-3'>
      <div className='flex items-start gap-4'>  
        <AssetImage asset={assets.exchange_icon} className='mt-1 w-8' alt="Exchange" />
        <div>
       <p className='font-extrabold'>Easy exchanges</p>
       <p className='mt-2 leading-6 text-[#6f5860]'>A smoother way to swap sizes, colors, or styles.</p>
        </div>
      </div>
      <div className='flex items-start gap-4'>  
        <AssetImage asset={assets.quality_icon} className='mt-1 w-8' alt="Quality" />
        <div>
       <p className='font-extrabold'>Curated quality</p>
       <p className='mt-2 leading-6 text-[#6f5860]'>Every drop is selected for finish, feel, and everyday wear.</p>
        </div>
      </div>
      <div className='flex items-start gap-4'>  
        <AssetImage asset={assets.support_img} className='mt-1 w-8' alt="Support" />
        <div>
       <p className='font-extrabold'>Helpful support</p>
       <p className='mt-2 leading-6 text-[#6f5860]'>Questions before checkout or after delivery? We are here.</p>
        </div>
      </div>
    </section>
  )
}

export default OurPolicy
