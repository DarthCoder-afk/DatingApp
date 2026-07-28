"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Heart, MessageCircle, UserRound } from "lucide-react";

const links = [
  { href: "/home", label: "Discover", icon: Compass },
  { href: "/matchlist", label: "Matches", icon: Heart },
  { href: "/messages", label: "Messages", icon: MessageCircle },
  { href: "/profile/edit", label: "Profile", icon: UserRound },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Mobile navigation" className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around rounded-t-3xl border-t border-[#eadbd1] bg-[#fffdf9] px-3 py-2.5 shadow-[0_-8px_24px_rgba(89,55,47,0.1)] md:hidden">
      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link key={href} href={href} aria-label={label} className={`flex h-11 w-11 items-center justify-center rounded-full transition ${active ? "bg-[#c95744] text-white shadow-md shadow-[#e8b8ab]" : "text-[#827074]"}`}>
            <Icon size={20} fill={active && href === "/matchlist" ? "currentColor" : "none"} strokeWidth={active ? 2.5 : 2} />
          </Link>
        );
      })}
    </nav>
  );
}
