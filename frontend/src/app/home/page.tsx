"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Range } from "react-range";
import NavBar from "@/src/components/NavBar";
import toast from "react-hot-toast";
import SwipeCard from "@/src/components/SwipeCard";

interface Profile {
  id: number;
  name: string;
  age: number;
  gender?: string;
  bio?: string;
  photoUrl?: string | null;
}

export default function HomePage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

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

      if (data.match) toast.success("It's a match!");

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
    return <p className="text-center text-gray-500 mt-10">Loading profiles...</p>;

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

      {/* Filter Section */}
      <div className="flex flex-col md:flex-row gap-6 justify-center items-center mt-8  mx-4">
        {/* Gender Filter */}
        <select
          className="select select-bordered w-40"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="all">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        {/* Age Range Filter */}
        <div className="flex flex-col items-center">
          <span className="text-gray-700 text-sm font-medium mb-2">
            Age Range: {ageRange[0]} - {ageRange[1]}
          </span>

          <div className="w-64">
            <Range
              step={1}
              min={MIN_AGE}
              max={MAX_AGE}
              values={ageRange}
              onChange={(values) => setAgeRange([values[0], values[1]])}
              renderTrack={({ props, children }) => (
                <div
                  {...props}
                  className="h-2 w-full rounded-full bg-gray-300 relative"
                >
                  <div
                    className="absolute h-2 rounded-full bg-rose-500"
                    style={{
                      left: `${((ageRange[0] - MIN_AGE) / (MAX_AGE - MIN_AGE)) * 100}%`,
                      width: `${((ageRange[1] - ageRange[0]) / (MAX_AGE - MIN_AGE)) * 100}%`,
                    }}
                  />
                  {children}
                </div>
              )}
             renderThumb={({ props, index }) => {
                const { key, ...rest } = props;
                return (
                  <div
                    key={key}
                    {...rest}
                    className="w-5 h-5 bg-white border-2 border-pink-400 rounded-full shadow-md focus:outline-none"
                  />
                );
              }}
            />
          </div>
        </div>
      </div>

      {/* Profiles Section */}
      <div className="flex flex-col items-center justify-center py-10 px-4">
        {/* Mobile view: swipe stack */}
        <div className="w-full max-w-sm h-[500px] relative md:hidden">
          <AnimatePresence>
            {filteredProfiles
              .slice(currentIndex, currentIndex + 3)
              .reverse()
              .map((profile) => (
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
        <div className="hidden md:grid md:grid-cols-4 md:gap-9 w-full max-w-5xl mt-8">
          {filteredProfiles.map((profile) => (
            <div key={profile.id} className="relative">
              <SwipeCard
                profile={profile}
                onLike={() => handleLike(profile.id)}
                onPass={() => handlePass(profile.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
