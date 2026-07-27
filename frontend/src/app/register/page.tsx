"use client";

import { useState } from "react";
import { apiRequest } from "../../lib/api";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowLeft, ChevronDown, Eye, EyeOff, Heart, Upload } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    bio: "",
    email: "",
    password: "",
  });

  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false); // 👈 For toggling visibility
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setPhoto(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // ✅ Password strength validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      toast.error(
        "Password must contain uppercase, lowercase, number, special character, and be at least 8 characters long."
      );
      setLoading(false);
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (photo) data.append("photo", photo);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auths/register`, {
        method: "POST",
        body: data,
      });
      const result = await res.json();

      if (!res.ok) throw new Error(result.message);
      toast.success("Registration successful!");
      localStorage.setItem("token", result.token);
      setTimeout(() => (window.location.href = "/home"), 1500);
    } catch (err: any) {
      console.error("Error message: ", err);
      toast.error("Error: " + (err.message || "Something went wrong"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-rose-50 text-gray-800">
      {/* Left Form Section */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex w-full flex-col justify-center bg-white px-6 py-10 sm:px-10 md:w-1/2 md:px-16"
      >
        <div className="mx-auto w-full max-w-md">
          <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-rose-600">
            <ArrowLeft size={16} /> Back to home
          </Link>
          <div className="mb-7">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-rose-500">Start your story</p>
            <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
            <p className="mt-3 text-gray-500">Tell us a little about yourself and start making meaningful connections.</p>
          </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-semibold text-gray-700">Full name</label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
              placeholder="Your name"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-100"
              required
            />
          </div>

          <div className="flex gap-3">
            <div className="w-1/2">
              <label htmlFor="age" className="mb-2 block text-sm font-semibold text-gray-700">Age</label>
              <input
                id="age"
                name="age"
                type="number"
                min="18"
                value={formData.age}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-100"
                required
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="gender" className="mb-2 block text-sm font-semibold text-gray-700">Gender</label>
              <div className="relative">
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-11 text-gray-900 outline-none transition focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-100"
                  required
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <ChevronDown
                  aria-hidden="true"
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                  size={18}
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="bio" className="mb-2 block text-sm font-semibold text-gray-700">Short bio <span className="font-normal text-gray-400">(optional)</span></label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-100"
              rows={2}
              placeholder="Tell something about yourself..."
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-gray-700">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-100"
              required
            />
          </div>

          {/* Password Field with Show/Hide */}
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-semibold text-gray-700">Password</label>
            <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-12 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-100"
              required
              placeholder="At least 8 characters"
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
            <p className="mt-2 text-xs text-gray-500">Use 8+ characters with uppercase, lowercase, a number, and a symbol.</p>
          </div>

          {/* File Upload Field */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Profile photo <span className="font-normal text-gray-400">(optional)</span></label>
            <div className="flex items-center gap-3 rounded-xl border border-dashed border-rose-200 bg-rose-50/60 p-3">
              <label
                htmlFor="photo-upload"
                className="flex shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-600"
              >
                <Upload size={16} />
                Upload Photo
              </label>
              <input
                id="photo-upload"
                type="file"
                name="photo"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              <span className="truncate text-sm text-gray-600">
                {photo ? photo.name : "No file selected"}
              </span>
            </div>
          
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-rose-600 py-3 font-semibold text-white shadow-lg shadow-rose-200 transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

          <p className="mt-5 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="text-rose-600 font-medium hover:underline">
              Log in
            </Link>
          </p>
        </form>
        </div>
      </motion.div>

      {/* Right Image Section */}
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
          alt="Register Illustration"
          width={380}
          height={380}
          className="relative mb-8 rounded-2xl"
        />
        <p className="relative mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-rose-800">HeartLink</p>
        <h2 className="relative mb-3 text-3xl font-bold">Join HeartLink Today 💖</h2>
        <p className="relative max-w-md text-md leading-7">
          Find love, build friendships, and connect with people who share your vibe.
        </p>
      </motion.div>
    </div>
  );
}
