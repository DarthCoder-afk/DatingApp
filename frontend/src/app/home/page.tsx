"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Range } from "react-range";
import { Bell, CircleHelp, Heart, MessageCircle, RotateCcw, SlidersHorizontal, Sparkles, Star, UserRound, UsersRound, X } from "lucide-react";
import NavBar from "@/src/components/NavBar";
import toast from "react-hot-toast";
import SwipeCard from "@/src/components/SwipeCard";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Profile {
  id: number;
  name: string;
  age: number;
  gender?: string;
  bio?: string;
  photoUrl?: string | null;
}

interface MatchCelebration {
  profile: Profile;
  matchId?: number;
}

export default function HomePage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [myProfile, setMyProfile] = useState<Profile | null>(null);
  const [matchCelebration, setMatchCelebration] = useState<MatchCelebration | null>(null);
  const router = useRouter();

  // Filter states
  const [gender, setGender] = useState<string>("all");
  const [ageRange, setAgeRange] = useState<[number, number]>([18, 50]);

  const MIN_AGE = 18;
  const MAX_AGE = 50;

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profiles/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setProfiles(data);
        setFilteredProfiles(data);
      } catch (err) {
        console.error("Error fetching profiles:", err);
        toast.error("Failed to load profiles");
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
    const fetchMyProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profiles/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) setMyProfile(await res.json());
      } catch (err) {
        console.error("Error fetching your profile:", err);
      }
    };
    fetchMyProfile();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = profiles.filter(
      (p) => p.age >= ageRange[0] && p.age <= ageRange[1]
    );

    if (gender !== "all") {
      filtered = filtered.filter(
        (p) => p.gender?.toLowerCase() === gender.toLowerCase()
      );
    }

    setFilteredProfiles(filtered);
    setCurrentIndex(0);
  }, [gender, ageRange, profiles]);

  const handleLike = async (profileId: number) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/likes/${profileId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      const matchedProfile = profiles.find((profile) => profile.id === profileId);
      if (data.match && matchedProfile) setMatchCelebration({ profile: matchedProfile, matchId: data.matchId });

      setProfiles((prev) => prev.filter((profile) => profile.id !== profileId));
    } catch (err) {
      console.error("Error liking user:", err);
      toast.error("Failed to like profile");
    }
  };

  const handlePass = async (profileId: number) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/passes/${profileId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setProfiles((prev) => prev.filter((profile) => profile.id !== profileId));
    } catch (err) {
      console.error("Error passing user:", err);
      toast.error("Failed to pass profile");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-rose-50">
        <NavBar />
        <div className="mx-auto max-w-6xl px-6 py-14 md:px-10">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-rose-100" />
          <div className="mt-3 h-5 w-80 max-w-full animate-pulse rounded-lg bg-rose-100/80" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((item) => <div key={item} className="h-96 animate-pulse rounded-3xl bg-white shadow-sm" />)}
          </div>
        </div>
      </div>
    );

  if (filteredProfiles.length === 0)
    return (
      <div className="min-h-screen bg-rose-50">
        <NavBar />
        <div className="mx-auto flex min-h-[calc(100vh-72px)] max-w-xl flex-col items-center justify-center px-6 text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-100 text-rose-600"><Sparkles size={30} /></div>
          <h1 className="text-3xl font-bold text-gray-900">You&apos;re all caught up</h1>
          <p className="mt-3 leading-7 text-gray-600">There are no profiles that match these filters right now. Try broadening your search and check back soon.</p>
          <button
            onClick={() => { setGender("all"); setAgeRange([MIN_AGE, MAX_AGE]); }}
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-3 font-semibold text-white transition hover:bg-rose-700"
          >
            <RotateCcw size={17} /> Reset filters
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-linear-to-b from-rose-50 via-white to-pink-50">
      <div className="hidden md:block"><NavBar /></div>

      <main className="min-h-screen bg-[#fcfcfc] pb-24 md:hidden">
        <header className="flex items-center justify-between px-5 pb-3 pt-6">
          <button aria-label="Notifications" className="text-rose-500"><Bell size={20} /></button>
          <h1 className="text-xl font-semibold tracking-tight text-gray-900">Discover</h1>
          <button onClick={() => setMobileFiltersOpen((open) => !open)} aria-label="Open filters" className={`rounded-xl p-2 transition ${mobileFiltersOpen ? "bg-rose-100 text-rose-600" : "text-rose-500"}`}><SlidersHorizontal size={21} /></button>
        </header>

        {mobileFiltersOpen && <motion.section initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mx-4 mb-2 rounded-2xl border border-rose-100 bg-white p-4 shadow-lg shadow-rose-100/60">
          <div className="flex items-center justify-between"><p className="font-semibold text-gray-900">Discovery filters</p><button onClick={() => setMobileFiltersOpen(false)} className="text-gray-400"><X size={18} /></button></div>
          <div className="mt-4 grid grid-cols-[1fr_auto] gap-4"><select value={gender} onChange={(e) => setGender(e.target.value)} className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 outline-none"><option value="all">All genders</option><option value="male">Men</option><option value="female">Women</option></select><span className="rounded-xl bg-rose-50 px-3 py-2.5 text-sm font-semibold text-rose-600">{ageRange[0]} – {ageRange[1]}</span></div>
          <div className="mt-5"><Range step={1} min={MIN_AGE} max={MAX_AGE} values={ageRange} onChange={(values) => setAgeRange([values[0], values[1]])} renderTrack={({ props, children }) => <div {...props} className="relative h-2 w-full rounded-full bg-rose-100"><div className="absolute h-2 rounded-full bg-rose-500" style={{ left: `${((ageRange[0] - MIN_AGE) / (MAX_AGE - MIN_AGE)) * 100}%`, width: `${((ageRange[1] - ageRange[0]) / (MAX_AGE - MIN_AGE)) * 100}%` }} />{children}</div>} renderThumb={({ props, index }) => { const { key, ...rest } = props; return <div key={key} {...rest} className="h-5 w-5 rounded-full border-2 border-rose-500 bg-white shadow" />; }} /></div>
        </motion.section>}

        <section className="flex flex-col items-center px-4 pt-3">
          <div className="relative h-[455px] w-[min(82vw,340px)]">
            <AnimatePresence>
              {filteredProfiles.slice(currentIndex, currentIndex + 3).reverse().map((profile, index) => <SwipeCard key={profile.id} profile={profile} stacked stackIndex={index} hideActions onLike={() => handleLike(profile.id)} onPass={() => handlePass(profile.id)} />)}
            </AnimatePresence>
          </div>
          {filteredProfiles[currentIndex] && <div className="mt-5 flex items-center justify-center gap-5">
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => handlePass(filteredProfiles[currentIndex].id)} aria-label="Pass" className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-gray-500 shadow-lg shadow-gray-200"><X size={24} strokeWidth={2.5} /></motion.button>
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => toast("Save this profile for later") } aria-label="Save profile" className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-amber-400 shadow-lg shadow-gray-200"><Star size={22} fill="currentColor" /></motion.button>
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleLike(filteredProfiles[currentIndex].id)} aria-label="Like" className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg shadow-rose-200"><Heart size={25} fill="currentColor" /></motion.button>
          </div>}
        </section>

        <nav className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around rounded-t-2xl border-t border-rose-100 bg-white px-4 py-3 shadow-[0_-8px_24px_rgba(251,113,133,0.08)]">
          <Link href="/home" className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-500 text-white"><Heart size={20} fill="currentColor" /></Link>
          <Link href="/matchlist" aria-label="Matches" className="p-2 text-gray-500"><Heart size={21} /></Link>
          <Link href="/messages" aria-label="Messages" className="p-2 text-gray-500"><MessageCircle size={21} /></Link>
          <Link href="/profile/edit" aria-label="Profile" className="p-2 text-gray-500"><UserRound size={21} /></Link>
        </nav>
      </main>

      <main className="mx-auto hidden max-w-6xl px-5 py-8 md:block md:px-10 md:py-12">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-8 flex flex-col gap-6 rounded-3xl bg-gradient-to-br from-rose-600 to-pink-500 px-6 py-8 text-white shadow-xl shadow-rose-200 md:flex-row md:items-end md:justify-between md:px-10"
        >
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-sm font-medium"><Sparkles size={15} /> Discover people</p>
            <h1 className="text-3xl font-bold md:text-4xl">Find someone who shares your vibe.</h1>
            <p className="mt-3 max-w-xl text-rose-50">Explore thoughtfully selected profiles and make the first move when it feels right.</p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-white/15 px-4 py-3 backdrop-blur-sm">
            <UsersRound size={22} />
            <div><p className="text-xs text-rose-100">Profiles to explore</p><p className="text-xl font-bold">{filteredProfiles.length}</p></div>
          </div>
        </motion.section>

        <section className="mb-10 rounded-3xl border border-rose-100 bg-white/85 p-5 shadow-lg shadow-rose-100/50 backdrop-blur-sm md:p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600"><SlidersHorizontal size={20} /></div>
              <div><h2 className="font-semibold text-gray-900">Refine your discovery</h2><p className="text-sm text-gray-500">Choose who you would like to see.</p></div>
            </div>
            <button onClick={() => { setGender("all"); setAgeRange([MIN_AGE, MAX_AGE]); }} className="inline-flex items-center gap-2 self-start text-sm font-semibold text-rose-600 transition hover:text-rose-700 md:self-auto"><RotateCcw size={15} /> Reset</button>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-[180px_1fr] md:items-end">
            <div>
              <label htmlFor="discover-gender" className="mb-2 block text-sm font-semibold text-gray-700">Interested in</label>
              <select id="discover-gender" className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-100" value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="all">All genders</option>
                <option value="male">Men</option>
                <option value="female">Women</option>
              </select>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between"><label className="text-sm font-semibold text-gray-700">Age range</label><span className="rounded-full bg-rose-50 px-3 py-1 text-sm font-semibold text-rose-600">{ageRange[0]} – {ageRange[1]}</span></div>
              <Range
                step={1}
                min={MIN_AGE}
                max={MAX_AGE}
                values={ageRange}
                onChange={(values) => setAgeRange([values[0], values[1]])}
                renderTrack={({ props, children }) => (
                  <div {...props} className="relative h-2 w-full rounded-full bg-gray-200">
                    <div className="absolute h-2 rounded-full bg-rose-500" style={{ left: `${((ageRange[0] - MIN_AGE) / (MAX_AGE - MIN_AGE)) * 100}%`, width: `${((ageRange[1] - ageRange[0]) / (MAX_AGE - MIN_AGE)) * 100}%` }} />
                    {children}
                  </div>
                )}
                renderThumb={({ props, index }) => {
                  const { key, ...rest } = props;
                  return <div key={key} {...rest} aria-label={index === 0 ? "Minimum age" : "Maximum age"} className="h-5 w-5 rounded-full border-2 border-rose-500 bg-white shadow-md outline-none ring-offset-2 focus:ring-2 focus:ring-rose-300" />;
                }}
              />
            </div>
          </div>
        </section>

      <section>
        <div className="mb-6 flex items-end justify-between">
          <div><p className="text-sm font-semibold uppercase tracking-[0.16em] text-rose-500">Discover</p><h2 className="mt-1 text-2xl font-bold text-gray-900">People you may like</h2></div>
          <div className="group relative hidden sm:block">
            <button type="button" aria-label="How profile actions work" className="flex h-9 w-9 items-center justify-center rounded-full border border-rose-100 bg-white text-gray-400 shadow-sm transition hover:border-rose-200 hover:text-rose-600 focus:outline-none focus:ring-4 focus:ring-rose-100">
              <CircleHelp size={18} />
            </button>
            <div role="tooltip" className="pointer-events-none absolute right-0 top-11 z-20 w-56 translate-y-1 rounded-xl bg-gray-900 px-3 py-2 text-xs leading-5 text-white opacity-0 shadow-lg transition duration-150 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
              Swipe on mobile or use the pass and like controls on each profile.
            </div>
          </div>
        </div>
      <div className="flex flex-col items-center justify-center pb-10">
        {/* Mobile view: swipe stack */}
        <div className="relative h-[520px] w-full max-w-sm md:hidden">
          <AnimatePresence>
            {filteredProfiles
              .slice(currentIndex, currentIndex + 3)
              .reverse()
              .map((profile, index) => (
                <SwipeCard
                  key={profile.id}
                  profile={profile}
                  stacked
                  stackIndex={index}
                  onLike={() => handleLike(profile.id)}
                  onPass={() => handlePass(profile.id)}
                />
              ))}
          </AnimatePresence>
        </div>

        {/* Desktop view: grid */}
        <div className="hidden w-full grid-cols-2 gap-6 lg:grid-cols-3 xl:grid-cols-4 md:grid">
          {filteredProfiles.map((profile) => (
            <div key={profile.id} className="relative">
              <SwipeCard
                profile={profile}
                stacked={false}
                onLike={() => handleLike(profile.id)}
                onPass={() => handlePass(profile.id)}
              />
            </div>
          ))}
        </div>
      </div>
      </section>
      </main>

      <AnimatePresence>
        {matchCelebration && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
          <motion.section initial={{ opacity: 0, scale: 0.9, y: 18 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94, y: 14 }} transition={{ type: "spring", damping: 20, stiffness: 260 }} role="dialog" aria-modal="true" aria-label="It is a match" className="relative w-full max-w-md overflow-hidden rounded-[2rem] bg-[#fffdfd] px-7 pb-8 pt-10 text-center shadow-2xl shadow-rose-950/30 sm:px-10">
            <span className="absolute left-7 top-8 text-2xl text-rose-500">✦</span><span className="absolute right-8 top-16 text-xl text-amber-400">✦</span><span className="absolute bottom-28 right-8 text-2xl text-rose-400">✦</span>
            <div className="relative mx-auto h-40 w-64 sm:h-44 sm:w-72">
              <div className="absolute left-2 top-3 h-32 w-28 -rotate-6 overflow-hidden rounded-2xl bg-rose-100 shadow-lg sm:h-36 sm:w-32"><img src={myProfile?.photoUrl || `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=HeartLink+member&backgroundColor=ffe4e6`} alt="Your profile" className="h-full w-full object-cover" /></div>
              <div className="absolute right-2 top-3 h-32 w-28 rotate-6 overflow-hidden rounded-2xl bg-rose-100 shadow-lg sm:h-36 sm:w-32"><img src={matchCelebration.profile.photoUrl || `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${encodeURIComponent(matchCelebration.profile.name)}&backgroundColor=ffe4e6`} alt={matchCelebration.profile.name} className="h-full w-full object-cover" /></div>
            </div>
            <h2 className="mt-1 text-5xl font-black tracking-tight text-rose-500">Match<span className="text-amber-400">!</span></h2>
            <p className="mt-2 text-sm font-semibold text-slate-700">You and {matchCelebration.profile.name} liked each other.</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">Take the first step with a friendly hello.</p>
            <div className="mt-8 space-y-3"><button onClick={() => matchCelebration.matchId ? router.push(`/messages/${matchCelebration.matchId}`) : router.push("/messages")} className="w-full rounded-full bg-rose-500 px-5 py-3.5 font-semibold text-white shadow-lg shadow-rose-200 transition hover:bg-rose-600">Chat now</button><button onClick={() => setMatchCelebration(null)} className="w-full py-2 text-sm font-medium text-slate-600 underline underline-offset-4 transition hover:text-rose-600">Keep swiping</button></div>
          </motion.section>
        </motion.div>}
      </AnimatePresence>
    </div>
  );
}
