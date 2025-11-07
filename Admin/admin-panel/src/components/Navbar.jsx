import React from "react";
import { assets } from "../assets/assets";

const Navbar = ({ setToken, onToggleSidebar }) => {
  return (
    <div className="flex items-center py-2 px-4 justify-between border-b bg-white">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-md hover:bg-gray-100"
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <img className="w-[max(10%,80px)]" src={assets.logo} alt="logo" />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setToken("")}
          className="bg-gray-600 text-white px-4 py-2 rounded-full text-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
