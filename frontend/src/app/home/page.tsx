"use client";

import { useEffect, useState } from "react";
import {  AnimatePresence } from "framer-motion";
import NavBar from "@/src/components/NavBar";
import toast from "react-hot-toast";
import SwipeCard from "@/src/components/SwipeCard";

interface Profile {
  id: number;
  name: string;
  age: number;
  bio?: string;
  photoUrl?: string | null;
}

export default function HomePage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

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
      } catch (err) {
        console.error("Error fetching profiles:", err);
        toast.error("Failed to load profiles");
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  const handleLike = async (profileId: number) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/likes/${profileId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      if (data.match) toast.success("It's a match!");

      setProfiles(prev => prev.filter(profile => profile.id !== profileId));
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

        setProfiles(prev => prev.filter(profile => profile.id !== profileId));
    } catch (err) {
        console.error("Error passing user:", err);
        toast.error("Failed to pass profile");
        }
    };

  if (loading) return <p className="text-center text-gray-500 mt-10">Loading profiles...</p>;
  if (currentIndex >= profiles.length)
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-300 flex flex-col">
         <NavBar />
        <div className="flex-grow flex flex-col items-center justify-center">
              <p className="text-gray-600 text-xl mt-8">No more profiles to show.</p>
        </div>
      </div>
    );

  return (
   <div className="min-h-screen bg-gradient-to-br from-rose-100 to-pink-400">
      <NavBar />
      <div className="flex flex-col items-center justify-center py-10 px-4">
          {/* Mobile view: swipe stack */}
          <div className="w-full max-w-sm h-[500px] relative md:hidden">
            <AnimatePresence>
              {profiles.slice(currentIndex, currentIndex + 3).reverse().map((profile) => (
                <SwipeCard
                  key={profile.id}
                  profile={profile}
                  onLike={() => handleLike(profile.id)}
                  onPass={() => handlePass(profile.id)}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Desktop view: grid */}
          <div className="hidden md:grid md:grid-cols-4 md:gap-9 w-full max-w-5xl">
            {profiles.map((profile) => (
              <div key={profile.id} className="relative">
                <SwipeCard profile={profile} onLike={() => handleLike(profile.id)} onPass={() => handlePass(profile.id)} />
              </div>
            ))}
          </div>
    </div>
  </div>
  );
}
