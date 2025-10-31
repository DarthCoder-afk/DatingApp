"use client";

import { useState } from "react";
import { apiRequest } from "../../lib/api";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { Eye, EyeOff, Upload } from "lucide-react"; // 👈 Icons

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
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Form Section */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col justify-center items-center w-full md:w-1/2 bg-white px-8 md:px-16 shadow-md"
      >
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">
          Create an Account
        </h2>
        <p className="text-gray-500 text-center mb-8">
          Join HeartLink and start connecting with amazing people today.
        </p>

        <form onSubmit={handleRegister} className="w-full max-w-sm space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-rose-500 focus:outline-none"
              required
            />
          </div>

          <div className="flex gap-3">
            <div className="w-1/2">
              <label className="block text-sm font-medium mb-1">Age</label>
              <input
                name="age"
                type="number"
                min="18"
                value={formData.age}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                required
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                required
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Short Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-rose-500 focus:outline-none"
              rows={2}
              placeholder="Tell something about yourself..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-rose-500 focus:outline-none"
              required
            />
          </div>

          {/* Password Field with Show/Hide */}
          <div className="relative">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-rose-500 focus:outline-none"
              required
              placeholder="At least 8 characters"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[34px] text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* File Upload Field */}
          <div>
            <label className="block text-sm font-medium mb-1">Profile Photo</label>
            <div className="flex items-center gap-3 border border-gray-300 rounded-lg p-2">
              <label
                htmlFor="photo-upload"
                className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium px-4 py-2 rounded-md cursor-pointer transition"
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
              <span className="text-gray-600 text-sm truncate">
                {photo ? photo.name : "No file selected"}
              </span>
            </div>
          
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-medium py-2 rounded-lg transition"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-rose-600 font-medium hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </motion.div>

      {/* Right Image Section */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden md:flex w-1/2 bg-gradient-to-br from-rose-100 to-pink-400 justify-center items-center flex-col text-center text-gray-800 p-10 rounded-l-[2rem]"
      >
        <Image
          src="/login page/login.svg"
          alt="Register Illustration"
          width={380}
          height={380}
          className="rounded-2xl mb-6"
        />
        <h2 className="text-3xl font-bold mb-2">Join HeartLink Today 💖</h2>
        <p className="max-w-md text-md">
          Find love, build friendships, and connect with people who share your vibe.
        </p>
      </motion.div>
    </div>
  );
}
