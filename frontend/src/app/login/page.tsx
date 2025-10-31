"use client";

import { useState } from "react";
import { apiRequest } from "../../lib/api";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { EyeOff, Eye } from "lucide-react";




export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);



  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await apiRequest("auths/login", "POST", { email, password });
      localStorage.setItem("token", res.token);
      toast.success("Login successful!");
      setTimeout(() =>{
        window.location.href = "/home";
      }, 1500);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Form */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col justify-center items-center w-full md:w-1/2 bg-white/30 px-8 md:px-16"
      >
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">Log In</h2>
        <p className="text-gray-500 text-center mb-8">
          Welcome back! Please enter your details.
        </p>

        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-5">
      
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-rose-500 focus:outline-none"
              required
            />
          </div>

         <div className="relative">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"} // 👈 Toggle type
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-rose-500 focus:outline-none pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)} // 👈 Toggle state
              className="absolute right-3 top-[34px] text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-medium py-2 rounded-lg transition"
          >
            Log In
          </button>


          <p className="text-center text-sm text-gray-500 mt-4">
            Don’t have an account?{" "}
            <Link href="/register" className="text-rose-600 font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </motion.div>

      {/* Right Image */}
     <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden md:flex w-1/2 bg-gradient-to-br from-rose-100 to-pink-400 justify-center items-center flex-col text-center text-gray-800 p-10 rounded-l-[2rem]"
      >
        <Image
          src="/login page/login.svg"
          alt="Login Illustration"
          width={380}
          height={380}
          className="rounded-2xl  mb-6"
        />
        <h2 className="text-3xl font-bold mb-2">Find Your Perfect Match 💕</h2>
        <p className="max-w-md text-md">
          Connect, chat, and match with amazing people nearby. Your next connection might be just one swipe away.
        </p>
      </motion.div>
    </div>
  );
}
