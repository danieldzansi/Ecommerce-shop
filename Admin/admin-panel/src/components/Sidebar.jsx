import React from "react";
import { NavLink } from "react-router-dom";
import { FiBarChart2, FiBox, FiClock, FiGrid, FiPlusCircle, FiX } from "react-icons/fi";

const links = [
  { to: "/", label: "Dashboard", icon: FiGrid },
  { to: "/list", label: "View Products", icon: FiBox },
  { to: "/add", label: "Add Product", icon: FiPlusCircle },
  { to: "/orders", label: "Orders", icon: FiClock },
];

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
        className={`fixed left-0 top-0 z-40 flex h-full w-64 transform flex-col overflow-y-auto border-r border-slate-200 bg-white p-4 transition-transform md:sticky md:top-[73px] md:h-[calc(100vh-73px)] md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!open && "true"}
      >
        <div className="flex items-center justify-end md:hidden mb-4">
          <button
            onClick={onClose}
            className="rounded-[8px] p-2 text-slate-700 hover:bg-slate-100"
            aria-label="Close menu"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-3">
          {links.map((link) => {
            const Icon = link.icon;
            return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              onClick={() => onClose()}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-[8px] border px-3 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "border-[#DBCCB7] bg-[#5A0019] text-white shadow-sm"
                    : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-[#5A0019]"
                }`
              }
            >
              <span className="grid h-7 w-7 place-items-center rounded-[8px] bg-slate-100">
                <Icon />
              </span>
              <p className={`${open ? "block" : "hidden"} md:block`}>{link.label}</p>
            </NavLink>
          )})}
        </nav>
        <div className="mt-auto rounded-[8px] border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <FiBarChart2 className="text-[#5A0019]" />
            Store console
          </div>
          <p className="mt-2 text-xs leading-5 text-slate-500">
            Products, orders, and revenue are loaded from your backend.
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
