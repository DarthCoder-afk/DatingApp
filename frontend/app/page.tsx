"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

const MotionImage = motion(Image);

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-between bg-linear-to-b from-pink-200 to-rose-50 text-gray-800 overflow-hidden">
      {/* Header */}
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex justify-between items-center px-8 py-5"
      >
        <div
          className="flex items-center gap-2 text-2xl font-bold text-rose-600"
         
        >
          <Heart className="text-rose-500" size={28} />
          <span>HeartLink</span>
        </div>

        <nav className="flex items-center gap-6">
          <Link href="/login" className="text-gray-700 hover:text-rose-500">
            Login
          </Link>
          <Link
            href="/register"
            className="bg-rose-500 text-white px-5 py-2 rounded-full hover:bg-rose-600 transition"
          >
            Register
          </Link>
        </nav>
      </motion.header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 px-6 md:px-10 py-16 md:py-20 -m-t-12 md:-mt-20">
        {/* Left text content */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-xl space-y-6 text-center md:text-left md:mr-10"
        >
          <p className="text-md text-gray-700">
            Find meaningful connections.
          </p>

          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            Find Your <span className="text-rose-600">Perfect Match</span>
          </h1>
          <p className="text-lg text-gray-700">
            Connect with amazing people nearby. Chat, match, and fall in love — all in one app.
          </p>
          <div className="order-1 md:order-2 flex justify-center md:justify-start gap-4">
            <Link
              href="/register"
              className="bg-rose-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-rose-700 transition"
            >
              Get Started
            </Link>
          
          </div>
        </motion.div>

        {/* Right illustration */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="order-2 md:order-1 mt-10 md:mt-0 md:ml-5"
        >
          <MotionImage
            src="/landing page/dating.svg"
            alt="Dating Illustration"
            width={450}
            height={450}
            className="w-[350px] md:w-[450px]"
            animate={{ y: [0, -10, 0] }}
            transition={{
              repeat: Infinity,
              duration: 3,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="text-center text-sm text-gray-500 py-6"
      >
        © {new Date().getFullYear()} HeartLink. All rights reserved.
      </motion.footer>
    </main>
    
  );
}
