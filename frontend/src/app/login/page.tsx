"use client";

import { useState } from "react";
import { apiRequest } from "../../lib/api";
import { motion } from "framer-motion";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowLeft, EyeOff, Eye, Heart, LockKeyhole, Mail } from "lucide-react";




export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);



  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8f2eb] text-[#2d2023]">
      {/* Left Form */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex w-full flex-col justify-center bg-[#fffdf9] px-6 py-10 sm:px-10 md:w-1/2 md:px-16"
      >
        <div className="mx-auto w-full max-w-md">
          <Link href="/" className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-[#827074] transition hover:text-[#c65743]">
            <ArrowLeft size={16} /> Back to home
          </Link>
          <div className="mb-8">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#c65743]">Welcome back</p>
            <h2 className="font-serif text-4xl font-semibold tracking-tight text-[#2d2023]">Your next chapter is waiting.</h2>
            <p className="mt-3 text-[#827074]">Pick up where your connections left off.</p>
          </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-gray-700">Email address</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-100"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

         <div>
            <label htmlFor="password" className="mb-2 block text-sm font-semibold text-gray-700">Password</label>
            <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-12 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-100"
                placeholder="Enter your password"
                required
              />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 transition hover:text-rose-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            </div>
          </div>

          {error && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#c95744] py-3 font-semibold text-white shadow-lg shadow-[#e8b8ab] transition hover:bg-[#a94435] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>


          <p className="mt-5 text-center text-sm text-gray-500">
            Don’t have an account?{" "}
            <Link href="/register" className="text-rose-600 font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </form>
        </div>
      </motion.div>

      {/* Right Image */}
     <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="relative hidden w-1/2 flex-col items-center justify-end overflow-hidden bg-[#2d2023] p-12 text-left text-white md:flex"
      >
        <div className="absolute inset-0 bg-cover bg-center opacity-90" style={{ backgroundImage: "url('/images/heartlink-login-editorial.png')" }} />
        <div className="absolute inset-0 bg-linear-to-t from-[#2d2023] via-[#2d2023]/30 to-transparent" />
        <div className="relative max-w-md"><span className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#d66b53] text-white"><Heart fill="currentColor" size={20} /></span><p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#f4b7a4]">HeartLink</p><h2 className="font-serif text-5xl font-semibold leading-[0.96]">Come back to the good part.</h2><p className="mt-5 max-w-sm leading-7 text-white/75">The next message, match, or moment could be waiting for you.</p></div>
      </motion.div>
    </div>
  );
}
