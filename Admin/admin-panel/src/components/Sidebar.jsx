import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

const Sidebar = ({ open = false, onClose = () => {} }) => {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden transition-opacity ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden={!open}
      />

      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-gray-100 p-4 transform transition-transform md:static md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!open && "true"}
      >
        <div className="flex items-center justify-end md:hidden mb-4">
          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-gray-200"
            aria-label="Close menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col gap-4">
          <NavLink
            to="/add"
            onClick={() => onClose()}
            className="flex items-center gap-3 px-3 py-2 border border-gray-300 rounded hover:bg-gray-200 transition"
          >
            <img className="w-5 h-5" src={assets.add_icon} alt="" />
            <p className={`${open ? "block" : "hidden"} md:block`}>Add Items</p>
          </NavLink>

          <NavLink
            to="/list"
            onClick={() => onClose()}
            className="flex items-center gap-3 px-3 py-2 border border-gray-300 rounded hover:bg-gray-200 transition"
          >
            <img className="w-5 h-5" src={assets.order_icon} alt="" />
            <p className={`${open ? "block" : "hidden"} md:block`}>
              List Items
            </p>
          </NavLink>

          <NavLink
            to="/orders"
            onClick={() => onClose()}
            className="flex items-center gap-3 px-3 py-2 border border-gray-300 rounded hover:bg-gray-200 transition"
          >
            <img className="w-5 h-5" src={assets.order_icon} alt="" />
            <p className={`${open ? "block" : "hidden"} md:block`}>Orders</p>
          </NavLink>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
