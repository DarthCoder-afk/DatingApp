"use client";

import Link from "next/link";
import {
  ArrowRight,
  Heart,
  HeartHandshake,
  MessageCircle,
  ShieldCheck,
  HeartPlus,
  WandSparkles,
  Sparkles,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

const MotionImage = motion(Image);

const features = [
  {
    icon: WandSparkles,
    title: "Discover your kind of people",
    description: "Explore profiles that match your preferences, pace, and personality.",
  },
  {
    icon: HeartHandshake,
    title: "Match with intention",
    description: "A match happens when the feeling is mutual—no awkward guesswork needed.",
  },
  {
    icon: MessageCircle,
    title: "Start real conversations",
    description: "Move from a spark to a conversation with private, real-time messaging.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-linear-to-b from-pink-200 via-rose-50 to-white text-gray-800 overflow-hidden">
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
      <section className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-8 px-6 py-16 md:flex-row md:gap-12 md:px-10 md:py-20">
        {/* Left text content */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-xl space-y-6 text-center md:mr-10 md:text-left"
        >
          <p className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-medium text-rose-700 shadow-sm">
            <HeartPlus size={16} /> Find meaningful connections
          </p>

          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            Find Your <span className="text-rose-600">Perfect Match</span>
          </h1>
          <p className="text-lg text-gray-700">
            Meet people who share your vibe. Discover, match, and build a connection at your own pace.
          </p>
          <div className="order-1 md:order-2 flex justify-center md:justify-start gap-4">
            <Link
              href="/register"
              className="bg-rose-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-rose-700 transition"
            >
              Create your profile <ArrowRight className="inline-block" size={18} />
            </Link>
            <Link
              href="/login"
              className="rounded-md border border-rose-200 bg-white/70 px-6 py-3 text-lg font-medium text-rose-700 transition hover:border-rose-300 hover:bg-white"
            >
              I have an account
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

      <section className="mx-auto max-w-6xl px-6 pb-20 pt-8 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl bg-white/75 px-6 py-10 shadow-xl shadow-rose-100/60 backdrop-blur-sm md:px-10"
        >
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">Made for connection</p>
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Everything you need to meet someone new</h2>
            <p className="mt-4 text-gray-600">HeartLink keeps the experience simple, thoughtful, and focused on people—not endless scrolling.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map(({ icon: Icon, title, description }, index) => (
              <motion.article
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.12, duration: 0.5 }}
                className="rounded-2xl border border-rose-100 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-rose-100"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                  <Icon size={22} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <p className="mt-2 leading-7 text-gray-600">{description}</p>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-6 pb-20 md:grid-cols-[1fr_1.1fr] md:px-10">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl bg-rose-600 p-8 text-white shadow-xl shadow-rose-200 md:p-10"
        >
          <Users className="mb-6" size={32} />
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-100">Your journey, your pace</p>
          <h2 className="mt-3 text-3xl font-bold">A better way to make the first move.</h2>
          <p className="mt-4 leading-7 text-rose-50">Set up your profile, browse thoughtfully, and connect when it feels right. There is no rush—just room for a genuine spark.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col justify-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">How it works</p>
          <h2 className="mt-3 text-3xl font-bold text-gray-900">Three easy steps to a new connection</h2>
          <ol className="mt-7 space-y-5">
            {["Create a profile that feels like you.", "Discover people who catch your eye.", "Match, chat, and see where it goes."].map((step, index) => (
              <li key={step} className="flex items-center gap-4 text-gray-700">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-100 font-semibold text-rose-600">{index + 1}</span>
                <span className="font-medium">{step}</span>
              </li>
            ))}
          </ol>
        </motion.div>
      </section>

      <section className="px-6 pb-16 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mx-auto flex max-w-5xl flex-col items-center gap-5 rounded-3xl bg-gray-900 px-8 py-12 text-center text-white md:px-14"
        >
          <ShieldCheck className="text-rose-300" size={30} />
          <h2 className="text-3xl font-bold">Your next connection could start today.</h2>
          <p className="max-w-xl text-gray-300">Join HeartLink and make space for the people, conversations, and possibilities that matter.</p>
          <Link href="/register" className="mt-2 rounded-md bg-rose-500 px-6 py-3 font-semibold transition hover:bg-rose-400">
            Join HeartLink
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="border-t border-rose-100 px-6 py-8 text-center text-sm text-gray-500"
      >
        © {new Date().getFullYear()} HeartLink. All rights reserved.
      </motion.footer>
    </main>
    
  );
}
