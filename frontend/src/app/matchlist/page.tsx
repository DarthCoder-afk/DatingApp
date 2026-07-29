"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Navbar from "@/src/components/NavBar";
import MatchCard from "@/src/components/MatchCard";
import { useRouter } from "next/navigation";
import { Heart, Inbox, Send } from "lucide-react";
import MobileBottomNav from "@/src/components/MobileBottomNav";
import AppSkeleton from "@/src/components/AppSkeleton";

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

type MatchTab = "given" | "received" | "mutual";

export default function MatchListPage() {
  const [tab, setTab] = useState<MatchTab>("mutual");
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
      <div className="app-shell">
        <div className="hidden md:block"><Navbar /></div>
        <main className="app-page">
          <header className="app-page-header">
            <div><p className="eyebrow">Connections</p><h1>People who noticed you.</h1><p className="subtle">Your matches and likes are gathering here.</p></div>
            <span className="app-page-mark"><Heart size={20} /></span>
          </header>
          <AppSkeleton variant="cards" />
        </main>
        <MobileBottomNav />
      </div>
    );

  return (
    <div className="app-shell">
        <div className="hidden md:block"><Navbar /></div>
      <main className="app-page">
      <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="app-page-header">
        <div><p className="eyebrow">Connections</p><h1>People who noticed you.</h1><p className="subtle">A quiet place for mutual interest and promising hellos.</p></div>
        <span className="app-page-mark"><Heart size={20} fill="currentColor" /></span>
      </motion.header>

      {/* Tabs */}
      <div className="app-tabs">
        {[
          { key: "mutual", label: "Matches", icon: Heart, count: mutualLikes.length },
          { key: "given", label: "Liked", icon: Send, count: likesGiven.length },
          { key: "received", label: "Liked you", icon: Inbox, count: likesReceived.length },
        ].map(({ key, label, icon: Icon, count }) => (
          <button
            key={key}
            onClick={() => setTab(key as MatchTab)}
            className={`app-tab ${tab === key ? "app-tab-active" : ""}`}
          >
            <Icon size={16} fill={key === "mutual" ? "currentColor" : "none"} /> {label} <span className="app-count">{count}</span>
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <motion.div
        layout
        className="app-card-grid">
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
      {((tab === "mutual" && !mutualLikes.length) || (tab === "given" && !likesGiven.length) || (tab === "received" && !likesReceived.length)) && <div className="app-empty"><span className="app-empty-icon"><Heart size={25} /></span><h2>Nothing here just yet.</h2><p>Keep exploring at your own pace. New connections begin with one thoughtful choice.</p></div>}
      </main>
      <MobileBottomNav />
    </div>
  );
}
