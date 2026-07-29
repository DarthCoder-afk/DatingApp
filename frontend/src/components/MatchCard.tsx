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
      whileHover={{ y: -4 }}
      className="group overflow-hidden rounded-[1.5rem] border border-[#e9ded8] bg-[#fffdfb] shadow-[0_12px_30px_rgba(57,37,45,0.08)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#f7dfd2]">
        {hasUploadedPhoto ? (
          <Image src={avatarUrl} alt={name} fill sizes="(min-width: 1024px) 320px, 90vw" className="object-cover transition duration-500 group-hover:scale-[1.04]" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt={`${name}'s generated avatar`} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
        )}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/45 to-transparent" />
        {profile.gender && <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-[#fffdfb]/90 px-2.5 py-1 text-xs font-semibold capitalize text-[#66545b] backdrop-blur"><UserRound size={13} /> {profile.gender}</span>}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3"><div><h2 className="font-serif text-2xl font-semibold text-[#33252b]">{name}, {age}</h2><p className="mt-1 line-clamp-2 min-h-10 text-sm leading-5 text-[#806f73]">{bio || "A new connection waiting to happen."}</p></div><Heart className="shrink-0 text-[#a95550]" size={20} fill="currentColor" /></div>
        <div className="mt-5 flex gap-2">
          {onMessage ? <button onClick={onMessage} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#4a2e3a] px-3 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#d8c7c0] transition hover:bg-[#38212b]"><MessageCircle size={16} /> Message</button> : <span className="flex flex-1 items-center justify-center rounded-xl bg-[#f3e6e1] px-3 py-2.5 text-sm font-semibold text-[#9f514c]">{buttonLabel}</span>}
          {onUnmatch && <button onClick={onUnmatch} className="rounded-xl border border-[#dfcfc8] px-3 py-2.5 text-sm font-semibold text-[#876d74] transition hover:bg-[#f8efeb] hover:text-[#9f514c]">Unmatch</button>}
        </div>
      </div>
    </motion.div>
  );
}
