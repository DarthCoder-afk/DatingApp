"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import Image from "next/image";
import { Heart, RotateCcw, SlidersHorizontal, Sparkles, X } from "lucide-react";
import toast from "react-hot-toast";
import NavBar from "@/src/components/NavBar";
import MobileBottomNav from "@/src/components/MobileBottomNav";
import SwipeCard from "@/src/components/SwipeCard";

type Profile = { id: number; name: string; age: number; gender?: string; bio?: string; photoUrl?: string | null };
const MIN_AGE = 18, MAX_AGE = 50;

export default function HomePage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [age, setAge] = useState(50); const [gender, setGender] = useState("all");
  const [loading, setLoading] = useState(true); const [filters, setFilters] = useState(false);
  const intro = useRef<HTMLDivElement>(null);
  useEffect(() => { const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches; if (!reduced && intro.current) gsap.fromTo(intro.current.children, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: .62, stagger: .1, ease: "power2.out" }); }, []);
  useEffect(() => { (async () => { try { const token = localStorage.getItem("token"); const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profiles/all`, { headers: { Authorization: `Bearer ${token}` } }); const data = await res.json(); if (!res.ok) throw new Error(data.message); setProfiles(data); } catch { toast.error("We couldn’t load profiles right now."); } finally { setLoading(false); } })(); }, []);
  const shown = profiles.filter(p => p.age >= MIN_AGE && p.age <= age && (gender === "all" || p.gender?.toLowerCase() === gender));
  const act = async (id: number, action: "likes" | "passes") => { try { const token = localStorage.getItem("token"); const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${action}/${id}`, { method: "POST", headers: { Authorization: `Bearer ${token}` } }); const data = await res.json(); if (!res.ok) throw new Error(data.message); setProfiles(current => current.filter(p => p.id !== id)); if (action === "likes" && data.match) toast.success("It’s a match — say hello when you’re ready."); } catch { toast.error("That didn’t go through. Please try again."); } };
  return <div className="app-shell"><div className="hidden md:block"><NavBar /></div><main className="discover-page">
    <header ref={intro} className="discover-header"><div><div className="discover-title-row"><Image src="/heartlink-icon.png" alt="" width={30} height={30} className="home-brand-icon" /><p className="eyebrow">Discover</p></div><h1>Take your time.</h1><p className="subtle">One thoughtful introduction at a time.</p></div><button onClick={() => setFilters(!filters)} aria-expanded={filters} aria-controls="discover-filters" className="filter-button"><SlidersHorizontal size={19} /><span>Filters</span></button></header>
    <AnimatePresence>{filters && <motion.section id="discover-filters" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="filter-panel"><div><label htmlFor="gender">Show me</label><select id="gender" value={gender} onChange={e => setGender(e.target.value)}><option value="all">Everyone</option><option value="female">Women</option><option value="male">Men</option><option value="nonbinary">Non-binary people</option></select></div><div><label htmlFor="age">Up to {age} years old</label><input id="age" type="range" min={MIN_AGE} max={MAX_AGE} value={age} onChange={e => setAge(Number(e.target.value))} /></div><button onClick={() => { setAge(MAX_AGE); setGender("all"); }} className="text-action"><RotateCcw size={15} /> Reset</button></motion.section>}</AnimatePresence>
    {loading ? <div className="profile-skeleton"><i /><i /><i /></div> : shown.length ? <section className="profile-stage"><div className="profile-stack"><AnimatePresence mode="popLayout">{shown.slice(0, 3).reverse().map((profile, i) => <SwipeCard key={profile.id} profile={profile} stacked stackIndex={2 - i} hideActions onLike={() => act(profile.id, "likes")} onPass={() => act(profile.id, "passes")} />)}</AnimatePresence></div><div className="primary-actions"><button onClick={() => act(shown[0].id, "passes")} className="action-button action-pass" aria-label={`Pass on ${shown[0].name}`}><X size={25} /></button><button onClick={() => act(shown[0].id, "likes")} className="action-button action-like" aria-label={`Like ${shown[0].name}`}><Heart size={23} fill="currentColor" /></button></div><p className="gesture-hint">Swipe, or use the buttons. Your choice stays private.</p></section> : <section className="discover-empty"><Sparkles size={28} /><h2>You’re all caught up.</h2><p>There aren’t any new people in this view just now. Try opening up your filters, or come back later.</p><button onClick={() => { setAge(MAX_AGE); setGender("all"); }} className="primary-text-button">Reset filters</button></section>}
  </main><MobileBottomNav /></div>;
}
