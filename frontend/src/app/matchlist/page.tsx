"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import toast from "react-hot-toast";
import Navbar from "@/src/components/NavBar";

interface Profile {
  id: number;
  name: string;
  age: number;
  bio?: string;
  gender?: string;
  photoUrl?: string;
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
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading matches...
      </div>
    );

  return (
    <div className="min-h-screen bg-rose-50">
        <Navbar />
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8 mt-8">
        Your Match List 💞
      </h1>

      {/* Tabs */}
      <div className="flex justify-center mb-6 gap-3">
        {["mutual", "given", "received"].map((key) => (
          <button
            key={key}
            onClick={() => setTab(key as any)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              tab === key
                ? "bg-rose-600 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {key === "mutual" && "💞 Matches"}
            {key === "given" && "❤️ Liked"}
            {key === "received" && "💌 Liked You"}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {tab === "mutual" &&
            mutualLikes.map((match) => (
                <ProfileCard
                key={match.matchId}
                profile={match.users[0]?.profile}
                onUnmatch={() => handleUnmatch(match.matchId)}
                buttonLabel="Unmatch"
                />
        ))}

        {tab === "given" &&
          likesGiven.map((like) => (
            <ProfileCard
              key={like.id}
              profile={like.to?.profile}
              buttonLabel="Liked"
            />
          ))}

        {tab === "received" &&
          likesReceived.map((like) => (
            <ProfileCard
              key={like.id}
              profile={like.from?.profile}
              buttonLabel="Liked You"
            />
          ))}
      </motion.div>
    </div>
  );
}

function ProfileCard({
  profile,
  onUnmatch,
  buttonLabel,
}: {
  profile?: Profile;
  onUnmatch?: () => void;
  buttonLabel: string;
}) {
  if (!profile) return null;
  const { name, age, bio, photoUrl } = profile;
  const imgSrc = photoUrl || "/default/default_profile.svg";

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-white shadow-md rounded-xl p-4 text-center flex flex-col items-center"
    >
      <Image
        src={imgSrc}
        alt={name}
        width={120}
        height={120}
        className="w-28 h-28 object-cover rounded-full mb-3"
      />
      <h3 className="text-lg font-semibold text-gray-800">
        {name}, {age}
      </h3>
      <p className="text-gray-500 text-sm mb-3 line-clamp-2">{bio}</p>

      <button
        onClick={onUnmatch}
        disabled={!onUnmatch}
        className={`px-4 py-2 rounded-full text-sm font-medium ${
          onUnmatch
            ? "bg-rose-600 text-white hover:bg-rose-700 transition"
            : "bg-gray-200 text-gray-600 cursor-default"
        }`}
      >
        {buttonLabel}
      </button>
    </motion.div>
  );
}
