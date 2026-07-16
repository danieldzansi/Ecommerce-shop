import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import { useLocation } from 'react-router-dom';
import AssetImage from './AssetImage';

const SearchBar = () => {

    const {search,setSearch,showSearch,setShowSearch}=useContext(ShopContext);
    const location=useLocation();
    const [visible,setVisible]=useState(false)

    useEffect(()=>{
         if (location.pathname.includes('collection')){
             setVisible(true)
         }
         else{
            setVisible(false)
         }
    }, [location])

  return showSearch && visible ? (
    <div className='page-x border-b border-[#DBCCB7]/60 bg-white py-5 text-center'>
      <div className='mx-auto inline-flex w-full max-w-2xl items-center justify-center border border-[#DBCCB7] bg-white px-5 py-3'>
         <input value={search} onChange={(e)=>setSearch(e.target.value)} className='flex-1 bg-transparent text-sm outline-none' type="text" placeholder='Search the edit' />
         <AssetImage asset={assets.search_icon} className='w-4' alt="Search" />
      </div>
      <AssetImage onClick={()=>setShowSearch(false)} className='ml-4 inline w-4 cursor-pointer align-middle' asset={assets.cross_icon} alt="Close" />
    </div>
  ): null;
}

export default SearchBar
