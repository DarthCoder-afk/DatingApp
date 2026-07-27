"use client";

import { useState } from "react";
import { apiRequest } from "../../lib/api";
import { motion } from "framer-motion";
import Image from "next/image";
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
    <div className="flex min-h-screen bg-rose-50 text-gray-800">
      {/* Left Form */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex w-full flex-col justify-center bg-white px-6 py-10 sm:px-10 md:w-1/2 md:px-16"
      >
        <div className="mx-auto w-full max-w-md">
          <Link href="/" className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-rose-600">
            <ArrowLeft size={16} /> Back to home
          </Link>
          <div className="mb-8">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-rose-500">Welcome back</p>
            <h2 className="text-3xl font-bold text-gray-900">Log in to HeartLink</h2>
            <p className="mt-3 text-gray-500">Pick up where your connections left off.</p>
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
            className="w-full rounded-xl bg-rose-600 py-3 font-semibold text-white shadow-lg shadow-rose-200 transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70"
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
        className="relative hidden w-1/2 flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-rose-200 via-pink-300 to-rose-400 p-10 text-center text-gray-800 md:flex"
      >
        <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-white/20 blur-2xl" />
        <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-rose-600/15 blur-2xl" />
        <Image
          src="/login page/login.svg"
          alt="Login Illustration"
          width={380}
          height={380}
          className="relative mb-8 rounded-2xl"
        />
        <p className="relative mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-rose-800">HeartLink</p>
        <h2 className="relative mb-3 text-3xl font-bold">Find Your Perfect Match 💕</h2>
        <p className="relative max-w-md text-md leading-7">
          Connect, chat, and match with amazing people nearby. Your next connection might be just one swipe away.
        </p>
      </motion.div>
    </div>
  );
}
