"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Heart, MessageCircle, UserRound } from "lucide-react";

interface Profile {
  id?: number;
  name: string;
  age: number;
  bio?: string;
  gender?: string;
  photoUrl?: string;
}

interface ProfileCardProps {
  profile?: Profile;
  onMessage?: () => void;
  onUnmatch?: () => void;
  buttonLabel: string;
}

export default function ProfileCard({
  profile,
  onUnmatch,
  onMessage,
  buttonLabel,
}: ProfileCardProps) {
  if (!profile) return null;
  const { name, age, bio, photoUrl } = profile;
 
  
    const dicebearUrl = `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${encodeURIComponent(`${name}-${profile.id || age}`)}&backgroundColor=ffe4e6`;
    const hasUploadedPhoto = Boolean(photoUrl && !photoUrl.startsWith("https://api.dicebear.com/"));
    const avatarUrl = photoUrl || dicebearUrl;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group overflow-hidden rounded-[1.75rem] border border-[#eadbd1] bg-[#fffdf9] shadow-[0_14px_32px_rgba(89,55,47,0.1)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#f7dfd2]">
        {hasUploadedPhoto ? (
          <Image src={avatarUrl} alt={name} fill sizes="(min-width: 1024px) 320px, 90vw" className="object-cover transition duration-500 group-hover:scale-[1.04]" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt={`${name}'s generated avatar`} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
        )}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/45 to-transparent" />
        {profile.gender && <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold capitalize text-gray-700"><UserRound size={13} /> {profile.gender}</span>}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3"><div><h2 className="font-serif text-2xl font-semibold text-[#2d2023]">{name}, {age}</h2><p className="mt-1 line-clamp-2 min-h-10 text-sm leading-5 text-[#705b60]">{bio || "A new connection waiting to happen."}</p></div><Heart className="shrink-0 text-[#c95744]" size={20} fill="currentColor" /></div>
        <div className="mt-5 flex gap-2">
          {onMessage ? <button onClick={onMessage} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#c95744] px-3 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#e8b8ab] transition hover:bg-[#a94435]"><MessageCircle size={16} /> Message</button> : <span className="flex flex-1 items-center justify-center rounded-xl bg-[#f7dfd2] px-3 py-2.5 text-sm font-semibold text-[#b64b39]">{buttonLabel}</span>}
          {onUnmatch && <button onClick={onUnmatch} className="rounded-xl border border-rose-200 px-3 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50">Unmatch</button>}
        </div>
      </div>
    </motion.div>
  );
}
