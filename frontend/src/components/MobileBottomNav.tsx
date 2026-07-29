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
    <nav aria-label="Primary navigation" className="mobile-nav md:hidden">
      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`nav-item ${active ? "nav-item-active" : ""}`}>
          <Icon size={20} strokeWidth={active ? 2.5 : 2} fill={active && href === "/matchlist" ? "currentColor" : "none"} />
          <span>{label}</span>
        </Link>;
      })}
    </nav>
  );
}
