"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

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

  // Close menus on route change
  useEffect(() => {
    setOpenMobile(false);
    setOpenProfile(false);
  }, [pathname]);

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  // ✅ Handle Messages link click
  const handleMessagesClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // prevent Link default navigation
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Please log in first");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      if (Array.isArray(data) && data.length === 0) {
        toast.error("You need to have a match to unlock this 💔");
      } else {
        router.push("/messages");
      }
    } catch (err) {
      console.error("Error checking matches:", err);
      toast.error("Failed to load messages");
    }
  };
  const NavLinks = () => (
    <>
      {[
        { href: "/home", label: "Discover" },
        { href: "/matchlist", label: "Matches" },
        { href: "/messages", label: "Messages", onClick: handleMessagesClick },
      ].map(({ href, label, onClick }) => (
        <Link
          key={href}
          href={href}
          onClick={onClick}
          className={`px-3 py-2 transition-all duration-200 rounded-md ${
            pathname === href
              ? "text-rose-600 font-semibold bg-rose-100"
              : "text-gray-700 hover:text-rose-600 hover:bg-rose-50"
          }`}
        >
          {label}
        </Link>
      ))}
    </>
  );

  return (
    <nav className="bg-white border-b border-gray-200 px-4 md:px-10 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        {/* MOBILE MENU ICON */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setOpenMobile((p) => !p)}
          aria-label="Toggle menu"
        >
          {openMobile ? <X size={24} /> : <Menu size={24} />}
        </button>
      {/* LEFT: Logo */}
      <Link href="/home" className="flex items-center gap-2">
        <motion.span
          className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-rose-600 text-white font-bold"
          whileHover={{ scale: 1.1 }}
        >
          ♥
        </motion.span>
        <span className="text-xl font-semibold text-gray-800">HeartLink</span>
      </Link>

      {/* DESKTOP NAV */}
      <div className="hidden md:flex items-center gap-4 text-sm font-medium">
        <NavLinks />
      </div>

      {/* RIGHT: Profile */}
      <div className="relative flex items-center gap-3">
        {/* Profile Dropdown */}
        <div ref={profileRef}>
          <button
            onClick={() => setOpenProfile((p) => !p)}
            className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-gray-100 transition"
          >
            {profile?.photoUrl ? (
              <Image
                src={profile.photoUrl}
                alt={profile.name || "User"}
                className="w-9 h-9 rounded-full object-cover border border-gray-300"
                width={36}
                height={36}
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-700 border border-gray-300">
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
                className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden"
              >
                <ul className="flex flex-col py-1 text-sm">
                  <li>
                    <Link
                      href="/profile/edit"
                      className="block px-4 py-2 text-gray-700 hover:bg-rose-50 hover:text-rose-600"
                    >
                      Edit Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50"
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

      {/* MOBILE NAV */}
      <AnimatePresence>
        {openMobile && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-[60px] left-0 w-full bg-white border-t border-gray-200 shadow-md md:hidden flex flex-col items-center py-4 space-y-3 text-gray-700 text-sm z-40"
          >
            <NavLinks />
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
