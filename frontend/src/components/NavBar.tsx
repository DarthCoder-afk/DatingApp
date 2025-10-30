"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";

type Profile = {
  id: number;
  name?: string;
  photoUrl?: string | null;
};

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [openProfile, setOpenProfile] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setOpenMobile(false);
    setOpenProfile(false);
  }, [pathname]);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setOpenProfile(false);
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profiles/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        setProfile({ id: data.id, name: data.name, photoUrl: data.photoUrl || null });
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    })();
  }, []);

  const initials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const NavLinks = () => (
    <>
      <Link href="/home" className={`hover:text-rose-600 ${pathname === "/home" ? "text-rose-600 font-medium" : ""}`}>
        Discover
      </Link>
      <Link href="/matchlist" className={`hover:text-rose-600 ${pathname === "/matchlist" ? "text-rose-600 font-medium" : ""}`}>
        List
      </Link>
      <Link href="/messages" className={`hover:text-rose-600 ${pathname === "/messages" ? "text-rose-600 font-medium" : ""}`}>
        Messages
      </Link>
    </>
  );

  return (
    <nav className="bg-white border-b border-gray-200 px-4 md:px-8 py-3 flex items-center justify-between sticky top-0 z-50">
      {/* LEFT: Logo */}
      <div className="flex items-center gap-2">
        <Link href="/home" className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-rose-600 text-white font-bold">
            ♥
          </span>
          <span className="text-xl font-semibold text-gray-800">HeartLink</span>
        </Link>
      </div>

      {/* DESKTOP NAV */}
      <div className="hidden md:flex items-center gap-8 text-gray-600 text-md font-bold">
        <NavLinks />
      </div>

      {/* RIGHT SIDE: Profile + Hamburger */}
      <div className="flex items-center gap-4">
        {/* Hamburger (visible on mobile) */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setOpenMobile((p) => !p)}
          aria-label="Toggle menu"
        >
          {openMobile ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Profile dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setOpenProfile((p) => !p)}
            className="flex items-center gap-2 border border-gray-200 px-3 py-1 rounded-full hover:shadow-sm"
          >
            {profile?.photoUrl ? (
              <Image
                src={profile.photoUrl}
                alt={profile.name || "User"}
                className="w-8 h-8 rounded-full object-cover"
                width={32}
                height={32}
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-700">
                {initials(profile?.name)}
              </div>
            )}
          </button>

          <AnimatePresence>
            {openProfile && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
              >
                <ul className="flex flex-col py-1">
                  <li>
                    <Link href="/profile/edit" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      Edit Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-gray-50"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* MOBILE NAV (slide down) */}
      <AnimatePresence>
        {openMobile && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-[60px] left-0 w-full bg-white border-t border-gray-200 shadow-md md:hidden flex flex-col items-center py-4 space-y-4 text-gray-700 text-sm z-40"
          >
            <NavLinks />
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
