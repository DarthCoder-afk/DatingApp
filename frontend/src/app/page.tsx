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
    <main className="min-h-screen overflow-hidden bg-[#f8f2eb] text-[#2d2023]">
      {/* Header */}
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10"
      >
        <div
          className="flex items-center gap-2 font-serif text-2xl font-semibold text-[#2d2023]"
         
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#c95744] text-white shadow-lg shadow-[#e8b8ab]"><Heart fill="currentColor" size={20} /></span>
          <span>HeartLink</span>
        </div>

        <nav className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-medium text-[#5f4a4f] hover:text-[#c65743]">
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-[#c95744] px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-[#e8b8ab] transition hover:bg-[#a94435]"
          >
            Register
          </Link>
        </nav>
      </motion.header>

      {/* Hero Section */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-6 pb-20 pt-10 md:grid-cols-[0.9fr_1.1fr] md:px-10 md:pb-28 md:pt-14">
        {/* Left text content */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-xl space-y-6 text-center md:text-left"
        >
          <p className="inline-flex items-center gap-2 rounded-full border border-[#eadbd1] bg-[#fffaf4] px-4 py-2 text-sm font-medium text-[#a94435] shadow-sm">
            <HeartPlus size={16} /> Find meaningful connections
          </p>

          <h1 className="font-serif text-5xl font-semibold leading-[0.96] tracking-[-0.045em] text-[#2d2023] md:text-7xl">
            A good story begins with <span className="text-[#c65743]">hello.</span>
          </h1>
          <p className="max-w-lg text-lg leading-8 text-[#705b60]">
            Meet people who feel like possibility. Discover, match, and take your time getting to know what could be.
          </p>
          <div className="order-1 md:order-2 flex justify-center md:justify-start gap-4">
            <Link
              href="/register"
              className="rounded-full bg-[#c95744] px-6 py-3 text-lg font-semibold text-white shadow-xl shadow-[#e8b8ab] transition hover:bg-[#a94435]"
            >
              Create your profile <ArrowRight className="inline-block" size={18} />
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-[#dfcfc5] bg-[#fffaf4] px-6 py-3 text-lg font-medium text-[#694b50] transition hover:border-[#d79a89] hover:bg-white"
            >
              I have an account
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="relative order-2 overflow-hidden rounded-[2.2rem] shadow-[0_28px_72px_rgba(78,42,45,0.2)] md:order-1"
        >
          <div className="absolute inset-0 z-10 bg-linear-to-t from-[#2d2023]/45 via-transparent to-transparent" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/heartlink-landing-editorial.png" alt="Two people enjoying a coffee date" className="aspect-[4/3] w-full object-cover" />
          <div className="absolute bottom-6 left-6 z-20 rounded-2xl border border-white/20 bg-[#2d2023]/65 px-4 py-3 text-white backdrop-blur"><p className="text-xs uppercase tracking-[0.18em] text-[#f5c5b5]">HeartLink note</p><p className="mt-1 font-serif text-xl">Make room for magic.</p></div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20 pt-8 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="rounded-[2rem] border border-[#eadbd1] bg-[#fffdf9] px-6 py-10 shadow-[0_16px_44px_rgba(89,55,47,0.08)] md:px-10"
        >
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#c65743]">Made for connection</p>
            <h2 className="font-serif text-3xl font-semibold text-[#2d2023] md:text-4xl">Every detail gives connection room to grow</h2>
            <p className="mt-4 text-[#705b60]">HeartLink keeps the experience simple, thoughtful, and focused on people—not endless scrolling.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map(({ icon: Icon, title, description }, index) => (
              <motion.article
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.12, duration: 0.5 }}
                className="rounded-2xl border border-[#eee2d9] bg-[#fffaf4] p-6 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-[#eadbd1]"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#f7dfd2] text-[#c65743]">
                  <Icon size={22} />
                </div>
                <h3 className="text-lg font-semibold text-[#2d2023]">{title}</h3>
                <p className="mt-2 leading-7 text-[#705b60]">{description}</p>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 pb-20 md:grid-cols-[0.9fr_1.1fr] md:px-10">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="rounded-[2rem] bg-[#3b272d] p-8 text-white shadow-[0_18px_40px_rgba(65,39,45,0.18)] md:p-10"
        >
          <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d66b53] text-white"><Users size={23} /></span>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#f2b9a8]">Your journey, your pace</p>
          <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight">A better way to make the first move.</h2>
          <p className="mt-4 leading-7 text-white/72">Set up your profile, browse thoughtfully, and connect when it feels right. There is no rush—just room for a genuine spark.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col justify-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c65743]">How it works</p>
          <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight text-[#2d2023]">Three easy steps to a new connection</h2>
          <ol className="mt-7 space-y-5">
            {["Create a profile that feels like you.", "Discover people who catch your eye.", "Match, chat, and see where it goes."].map((step, index) => (
              <li key={step} className="flex items-center gap-4 text-[#5f4a4f]">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f7dfd2] font-semibold text-[#c65743]">{index + 1}</span>
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
          className="mx-auto flex max-w-5xl flex-col items-center gap-5 rounded-[2rem] bg-[#3b272d] px-8 py-14 text-center text-white shadow-[0_18px_40px_rgba(65,39,45,0.18)] md:px-14"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#f2b9a8]"><ShieldCheck size={25} /></span>
          <h2 className="font-serif text-4xl font-semibold">Your next connection could start today.</h2>
          <p className="max-w-xl text-white/70">Join HeartLink and make space for the people, conversations, and possibilities that matter.</p>
          <Link href="/register" className="mt-2 rounded-full bg-[#d66b53] px-6 py-3 font-semibold shadow-lg shadow-black/10 transition hover:bg-[#e17b63]">
            Join HeartLink
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="border-t border-[#eadbd1] px-6 py-8 text-center text-sm text-[#827074]"
      >
        © {new Date().getFullYear()} HeartLink. All rights reserved.
      </motion.footer>
    </main>
    
  );
}
