/* eslint-disable react-refresh/only-export-components */


import { createContext, useEffect, useState } from "react";
import { products } from "../assets/assets";
import { toast } from "react-toastify"; 
import Cart from "../pages/Cart";

export const ShopContext=createContext();


const ShopContextProvider=(props)=>{
    const currency='₵';
    const delivery_fee =10;
    const [search ,setSearch]=useState('')
    const [showSearch,setShowSearch]=useState(false)
    const [cartItems,setCartItems]=useState({});

    const addToCart=async (itemId,size)=>{
        if (!size){
           toast.error('Select product size');
            return
        } 
           else{
            toast.success('Item added to cart')
           }
         let cartData =structuredClone(cartItems)
         if (cartData[itemId]){
             if (cartData[itemId][size]){
                cartData[itemId][size]+=1;
             }
             else {
                cartData[itemId][size]=1
             }
         }
         else {
            cartData[itemId]={};
            cartData[itemId][size]=1
         }
         setCartItems(cartData)
    }

     const getCartCount = () => {
  let totalCount = 0;

  for (const productId in cartItems) {
    for (const size in cartItems[productId]) {
      const quantity = cartItems[productId][size];
      if (quantity > 0) {
        totalCount += quantity;
      }
    }
  }

  return totalCount;
};

     
    useEffect(()=>{

    },[cartItems])
    const value={
     products, currency,delivery_fee,search,setShowSearch, setSearch,showSearch, cartItems,addToCart,getCartCount 
   

    }
   
    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider