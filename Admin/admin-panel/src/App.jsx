import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Route, Routes } from "react-router-dom";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import Dashboard from "./pages/Dashboard";
import ProductDetails from "./pages/ProductDetails";
import Login from "./components/Login";
import React from "react";
import { ToastContainer } from "react-toastify";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <ToastContainer />
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Navbar
            setToken={setToken}
            onToggleSidebar={() => setSidebarOpen((s) => !s)}
          />

          <div className="relative flex w-full">
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <main className="min-h-[calc(100vh-73px)] flex-1 overflow-hidden border-l border-slate-200 bg-slate-50 px-4 py-6 md:px-8">
              <Routes>
                <Route path="/" element={<Dashboard token={token} />} />
                <Route path="/add" element={<Add token={token} />} />
                <Route path="/list" element={<List token={token} />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/orders" element={<Orders token={token} />} />
              </Routes>
            </main>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
