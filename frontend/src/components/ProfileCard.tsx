"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import toast from "react-hot-toast";
import { Heart, UserRound, X } from "lucide-react";

interface ProfileCardProps {
  profile: {
    id: number;
    name: string;
    age: number;
    gender?: string;
    bio?: string;
    photoUrl?: string | null;
  };
  onLike: () => void;
  onPass: () => void;
  hideActions?: boolean;
}

export default function ProfileCard({ profile, onLike, onPass, hideActions = false }: ProfileCardProps) {
  const dicebearUrl = `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${encodeURIComponent(`${profile.name}-${profile.id}`)}&backgroundColor=ffe4e6`;
  const hasUploadedPhoto = Boolean(profile.photoUrl && !profile.photoUrl.startsWith("https://api.dicebear.com/"));
  const avatarUrl = profile.photoUrl || dicebearUrl;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group overflow-hidden rounded-[1.75rem] border border-[#eadbd1] bg-[#fffdf9] shadow-[0_14px_32px_rgba(89,55,47,0.1)]"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#f7dfd2]">
        {hasUploadedPhoto ? (
          <Image src={avatarUrl} alt={`${profile.name}'s profile`} fill sizes="(min-width: 1280px) 280px, (min-width: 768px) 33vw, 100vw" className="object-cover transition duration-500 group-hover:scale-[1.03]" />
        ) : (
          // DiceBear returns a generated SVG; loading it directly avoids Next image-host configuration at runtime.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt={`${profile.name}'s generated avatar`} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
        )}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-gray-950/75 via-gray-950/20 to-transparent" />
        {profile.gender && <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-[#fffdf9]/90 px-2.5 py-1 text-xs font-semibold capitalize text-[#5d494d] shadow-sm backdrop-blur"><UserRound size={13} /> {profile.gender}</span>}
        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <h2 className="font-serif text-3xl font-semibold tracking-tight">{profile.name}, {profile.age}</h2>
          <p className="mt-1 line-clamp-2 text-sm leading-5 text-white/85">{profile.bio || "Here to meet someone genuine and see where the conversation goes."}</p>
        </div>
      </div>

      {!hideActions && <div className="flex items-center justify-between px-5 py-4">
        <span className="text-xs font-medium text-[#9b8987]">Follow your feeling</span>
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => {
              toast.success("You have rejected this person");
              onPass();
            }}
            aria-label={`Pass on ${profile.name}`}
            title="Pass"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#e8ddd5] bg-white text-[#7f6c70] shadow-sm transition hover:border-[#edbaa9] hover:bg-[#fff1e9] hover:text-[#c65743]"
          >
            <X size={21} strokeWidth={2.4} />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => {
              toast.success("You have liked this person");
              onLike();
            }}
            aria-label={`Like ${profile.name}`}
            title="Like"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#c95744] text-white shadow-lg shadow-[#e9b2a4] transition hover:bg-[#a94435]"
          >
            <Heart size={20} fill="currentColor" />
          </motion.button>
        </div>
      </div>}
    </motion.div>
  );
}
