import React from "react";
import { assets } from "../assets/assets";
import { FiLogOut, FiMenu, FiRefreshCw } from "react-icons/fi";

const Navbar = ({ setToken, onToggleSidebar }) => {
  return (
    <div className="flex h-[73px] items-center justify-between border-b border-slate-200 bg-white px-4 py-2">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="rounded-[8px] p-2 text-slate-700 hover:bg-slate-100 md:hidden"
          aria-label="Toggle menu"
        >
          <FiMenu className="h-6 w-6" />
        </button>

        <div className="flex items-center gap-3">
          <div className="grid h-12 w-16 place-items-center rounded-[8px] bg-white p-1.5 ring-1 ring-slate-200">
            <img className="max-h-10 w-full object-contain" src={assets.logo} alt="Eclat logo" />
          </div>
          <div className="hidden sm:block">
            <p className="text-base font-bold text-slate-950">Eclat</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#5A0019]">
              Admin
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm md:flex">
          <FiRefreshCw className="text-[#5A0019]" />
          Live store dashboard
        </div>
        <button
          onClick={() => setToken("")}
          className="inline-flex items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-800 shadow-sm hover:border-[#5A0019]/30 hover:text-[#5A0019]"
        >
          <FiLogOut />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
