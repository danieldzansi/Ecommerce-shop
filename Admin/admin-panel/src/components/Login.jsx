import axios from "axios";
import React, { useState } from "react";

import { backendUrl } from "../config";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { FiEye, FiEyeOff, FiLock, FiMail } from "react-icons/fi";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(backendUrl + "/api/admin", {
        email,
        password,
      });

      if (response.data.token) {
        setToken(response.data.token);
        toast.success("Login successful!");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#061316] px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-4">
          <div className="grid h-16 w-20 place-items-center rounded-[8px] bg-white p-2">
            <img className="max-h-12 w-full object-contain" src={assets.logo} alt="Eclat logo" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Eclat</h1>
            <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#DBCCB7]">
              Admin Studio
            </p>
          </div>
        </div>

        <div className="rounded-[8px] border border-[#12323a] bg-[#082630] px-8 py-9 shadow-[0_24px_80px_rgba(0,0,0,0.32)]">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-white">Welcome back</h2>
            <p className="mt-2 text-sm text-[#7fb6c3]">
              Sign in to manage products, orders, and store performance.
            </p>
          </div>
          <form onSubmit={onSubmitHandler}>
            <div className="mb-3 min-w-72">
              <p className="mb-2 text-sm font-medium text-[#9fc7d0]">
                Email Address
              </p>
              <div className="flex items-center rounded-[8px] border border-[#DBCCB7]/35 bg-[#eaf1ff] px-4 text-[#061316] focus-within:border-[#DBCCB7]">
                <FiMail className="text-[#5A0019]" />
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  className="w-full bg-transparent px-3 py-3 outline-none"
                  type="email"
                  placeholder="Enter Email"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="mb-3 min-w-72">
              <p className="mb-2 text-sm font-medium text-[#9fc7d0]">Password</p>
              <div className="flex items-center rounded-[8px] border border-[#DBCCB7]/35 bg-[#eaf1ff] px-4 text-[#061316] focus-within:border-[#DBCCB7]">
                <FiLock className="text-[#5A0019]" />
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className="w-full bg-transparent px-3 py-3 outline-none"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="rounded-[8px] p-2 text-slate-600 hover:bg-white/60 hover:text-[#5A0019]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
            <button
              className="mt-5 w-full rounded-[8px] bg-[#5A0019] px-4 py-3 font-bold text-white shadow-lg shadow-[#5A0019]/25 transition hover:bg-[#720022] disabled:cursor-not-allowed disabled:bg-slate-500"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
        <p className="mt-7 text-center text-xs text-[#2f7f91]">Eclat admin 2026</p>
      </div>
    </div>
  );
};

export default Login;
