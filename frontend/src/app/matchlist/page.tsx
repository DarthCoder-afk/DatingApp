"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import toast from "react-hot-toast";
import Navbar from "@/src/components/NavBar";
import MatchCard from "@/src/components/MatchCard";
import { useRouter } from "next/navigation";
import { Bell, Heart, Inbox, Send, Sparkles } from "lucide-react";
import MobileBottomNav from "@/src/components/MobileBottomNav";

interface Profile {
  id: number;
  name: string;
  age: number;
  bio?: string;
  gender?: string;
  photoUrl?: string;
  profile: Profile;
}

interface Like {
  id: number;
  from?: { profile: Profile };
  to?: { profile: Profile };
}

interface Match {
  matchId: number;
  users: Profile[];
  createdAt: string;
}

export default function MatchListPage() {
  const [tab, setTab] = useState<"given" | "received" | "mutual">("mutual");
  const [likesGiven, setLikesGiven] = useState<Like[]>([]);
  const [likesReceived, setLikesReceived] = useState<Like[]>([]);
  const [mutualLikes, setMutualLikes] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchLikes = async () => {
    try {
      const [overviewRes, matchesRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/matches/overview`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/matches/match`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!overviewRes.ok || !matchesRes.ok)
        throw new Error("Failed to load matches");

      const overviewData = await overviewRes.json();
      const matchData = await matchesRes.json();

      setLikesGiven(overviewData.likesGiven || []);
      setLikesReceived(overviewData.likesReceived || []);
      setMutualLikes(matchData || []); // ✅ now using real matches
    } catch (err) {
      console.error("Error fetching matches:", err);
      toast.error("Failed to load matches");
    } finally {
      setLoading(false);
    }
  };
    if (token) fetchLikes();
  }, [token]);

  const fetchMatches = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/matches/match`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setMutualLikes(data);
    };

  const handleUnmatch = async (matchId: number) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/matches/${matchId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to unmatch");

        setMutualLikes((prev) => prev.filter((m) => m.matchId !== matchId));
        fetchMatches();
        toast.success("Unmatched successfully");
    } catch (err) {
        console.error("Error unmatching:", err);
        toast.error("Failed to unmatch");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-rose-50"><Navbar /><div className="mx-auto max-w-6xl px-6 py-12"><div className="h-9 w-48 animate-pulse rounded-lg bg-rose-100" /><div className="mt-8 grid gap-6 md:grid-cols-3">{[1, 2, 3].map((item) => <div key={item} className="h-80 animate-pulse rounded-3xl bg-white" />)}</div></div></div>
    );

  return (
    <div className="min-h-screen bg-linear-to-b from-rose-50 via-white to-pink-50">
        <div className="hidden md:block"><Navbar /></div>
      <main className="mx-auto max-w-6xl px-5 pb-24 pt-6 md:px-10 md:py-12">
      <header className="mb-6 flex items-center justify-between md:hidden"><button aria-label="Notifications" className="text-rose-500"><Bell size={20} /></button><h1 className="text-xl font-semibold text-slate-900">Matches</h1><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-500"><Heart size={18} fill="currentColor" /></span></header>
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-6 hidden border-b border-rose-100 pb-8 md:block">
        <p className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1.5 text-sm font-medium text-rose-600"><Sparkles size={15} /> Your connections</p>
        <div className="mt-5 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"><div><h1 className="text-3xl font-bold text-gray-900 md:text-4xl">The people who felt the spark.</h1><p className="mt-3 max-w-2xl text-gray-600">See who you&apos;ve connected with, revisit likes, and turn a mutual match into a conversation.</p></div><div className="rounded-2xl bg-rose-50 px-4 py-3 text-rose-600"><p className="text-xs text-rose-500">Mutual matches</p><p className="text-2xl font-bold">{mutualLikes.length}</p></div></div>
      </motion.section>

      {/* Tabs */}
      <div className="mb-8 flex w-full gap-2 overflow-x-auto rounded-2xl border border-rose-100 bg-white p-2 shadow-sm md:justify-center">
        {[
          { key: "mutual", label: "Matches", icon: Heart, count: mutualLikes.length },
          { key: "given", label: "Liked", icon: Send, count: likesGiven.length },
          { key: "received", label: "Liked you", icon: Inbox, count: likesReceived.length },
        ].map(({ key, label, icon: Icon, count }) => (
          <button
            key={key}
            onClick={() => setTab(key as any)}
            className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
              tab === key
                ? "bg-rose-600 text-white shadow-md shadow-rose-200"
                : "text-gray-600 hover:bg-rose-50 hover:text-rose-600"
            }`}
          >
            <Icon size={16} fill={key === "mutual" ? "currentColor" : "none"} /> {label} <span className={`rounded-full px-1.5 py-0.5 text-xs ${tab === key ? "bg-white/20" : "bg-rose-50 text-rose-600"}`}>{count}</span>
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <motion.div
        layout
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tab === "mutual" &&
            mutualLikes.map((match) => (
                <MatchCard
                key={match.matchId}
                profile={match.users[0]?.profile}
                onMessage={() => router.push(`/messages/${match.matchId}`)}
                onUnmatch={() => handleUnmatch(match.matchId)}
                buttonLabel="Unmatch"
                />
        ))}

        {tab === "given" &&
          likesGiven.map((like) => (
            <MatchCard
              key={like.id}
              profile={like.to?.profile}
              buttonLabel="Liked"
            />
          ))}

        {tab === "received" &&
          likesReceived.map((like) => (
            <MatchCard
              key={like.id}
              profile={like.from?.profile}
              buttonLabel="Liked You"
            />
          ))}
      </motion.div>
      {((tab === "mutual" && !mutualLikes.length) || (tab === "given" && !likesGiven.length) || (tab === "received" && !likesReceived.length)) && <div className="rounded-3xl border border-dashed border-rose-200 bg-white/70 px-6 py-14 text-center"><Heart className="mx-auto text-rose-300" size={34} /><h2 className="mt-4 text-xl font-bold text-gray-900">Nothing here just yet</h2><p className="mt-2 text-sm text-gray-600">Keep exploring profiles—new connections begin with a small hello.</p></div>}
      </main>
      <MobileBottomNav />
    </div>
  );
}
