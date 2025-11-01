import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

const Sidebar = () => {
  return (
    <div className="flex">
  <div className="flex flex-col gap-4 w-64 h-screen bg-gray-100 p-4">
    <NavLink to="/add" className="flex items-center gap-3 px-3 py-2 border border-gray-300 rounded-l hover:bg-gray-200 transition" >
      <img className="w-5 h-5" src={assets.add_icon} alt="" />
      <p className="hidden md:block">Add Items</p>
    </NavLink>
    <NavLink to="/list" className="flex items-center gap-3 px-3 py-2 border border-gray-300 rounded-l hover:bg-gray-200 transition" >
      <img className="w-5 h-5" src={assets.order_icon} alt="" />
      <p className="hidden md:block">List Items</p>
    </NavLink>

    <NavLink to="/oders" className="flex items-center gap-3 px-3 py-2 border border-gray-300 rounded-l hover:bg-gray-200 transition" >
      <img className="w-5 h-5" src={assets.order_icon} alt="" />
      <p className="hidden md:block">Orders</p>
    </NavLink>
  </div>

  <div className="flex-1 p-6">

  </div>
</div>

  )
}

export default Sidebar
