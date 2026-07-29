"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Compass, Heart, Menu, MessageCircle, Settings, X } from "lucide-react";
import Image from "next/image";

type Profile = {
  id: number;
  name?: string;
  photoUrl?: string | null;
};

const navigationLinks = [
  { href: "/home", label: "Discover", icon: Compass },
  { href: "/matchlist", label: "Matches", icon: Heart },
  { href: "/messages", label: "Messages", icon: MessageCircle },
];

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <>
      {navigationLinks.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          onClick={onNavigate}
          className={`flex items-center gap-2 rounded-xl px-3 py-2 transition-all duration-200 ${
            pathname === href
              ? "bg-[#f5e8e3] text-[#9f514c] font-semibold"
              : "text-[#6f5d63] hover:bg-[#f8efeb] hover:text-[#9f514c]"
          }`}
        >
          <Icon size={16} strokeWidth={pathname === href ? 2.5 : 2} />
          {label}
        </Link>
      ))}
    </>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [openProfile, setOpenProfile] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setOpenProfile(false);
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  // Fetch profile
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

  const initials = (name?: string) =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join("")
          .toUpperCase()
      : "U";

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-[#eadbd1]/80 bg-[#fffdf9]/90 px-4 py-3 shadow-sm shadow-[#e9ddd4]/60 backdrop-blur-xl md:px-10">
        {/* MOBILE MENU ICON */}
        <button
          className="rounded-xl p-2 text-gray-700 transition hover:bg-rose-50 hover:text-rose-600 md:hidden"
          onClick={() => setOpenMobile((p) => !p)}
          aria-label="Toggle menu"
        >
          {openMobile ? <X size={24} /> : <Menu size={24} />}
        </button>
      {/* LEFT: Logo */}
      <Link href="/home" className="flex items-center gap-2.5">
        <motion.span
          className="inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-[#4a2e3a] shadow-md shadow-[#d8c7c0]"
          whileHover={{ scale: 1.1 }}
        >
          <Image src="/heartlink-icon.png" alt="" width={40} height={40} className="h-full w-full object-cover" />
        </motion.span>
        <span className="font-serif text-2xl font-semibold tracking-tight text-[#2d2023]">HeartLink</span>
      </Link>

      {/* DESKTOP NAV */}
      <div className="hidden items-center gap-1 rounded-2xl border border-[#eadfd9] bg-white/80 p-1 text-sm font-medium shadow-sm md:flex">
        <NavLinks pathname={pathname} />
      </div>

      {/* RIGHT: Profile */}
      <div className="relative flex items-center gap-3">
        {/* Profile Dropdown */}
        <div ref={profileRef}>
          <button
            onClick={() => setOpenProfile((p) => !p)}
            className="flex items-center gap-2 rounded-2xl border border-transparent px-2 py-1.5 transition hover:border-rose-100 hover:bg-rose-50"
          >
            {profile?.photoUrl ? (
              profile.photoUrl.startsWith("https://api.dicebear.com/") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.photoUrl} alt={profile.name || "User"} className="h-9 w-9 rounded-xl border border-rose-200 object-cover" />
              ) : <Image src={profile.photoUrl} alt={profile.name || "User"} className="h-9 w-9 rounded-xl border border-rose-200 object-cover" width={36} height={36} />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-200 bg-rose-100 text-sm font-bold text-rose-700">
                {initials(profile?.name)}
              </div>
            )}
            <span className="hidden max-w-28 truncate text-sm font-semibold text-gray-700 lg:block">{profile?.name || "My profile"}</span>
            <ChevronDown size={16} className={`hidden text-gray-400 transition lg:block ${openProfile ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {openProfile && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-3 w-56 overflow-hidden rounded-2xl border border-rose-100 bg-white p-2 shadow-xl shadow-rose-200/60 z-50"
              >
                <div className="border-b border-rose-100 px-3 py-2.5">
                  <p className="font-semibold text-gray-900">{profile?.name || "HeartLink member"}</p>
                  <p className="mt-0.5 text-xs text-gray-500">Manage your account</p>
                </div>
                <ul className="flex flex-col py-2 text-sm">
                  <li>
                    <Link
                      href="/profile/edit"
                      className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-gray-700 transition hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Settings size={16} /> Edit profile
                    </Link>
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* MOBILE NAV */}
      <AnimatePresence>
        {openMobile && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-full flex w-full flex-col items-center space-y-2 border-t border-rose-100 bg-white/95 px-4 py-4 text-sm text-gray-700 shadow-xl shadow-rose-100/70 backdrop-blur-xl md:hidden z-40"
          >
            <NavLinks pathname={pathname} onNavigate={() => setOpenMobile(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
