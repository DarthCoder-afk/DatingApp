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
}

export default function ProfileCard({ profile, onLike, onPass }: ProfileCardProps) {
  const dicebearUrl = `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${encodeURIComponent(`${profile.name}-${profile.id}`)}&backgroundColor=ffe4e6`;
  const imageUrl = profile.photoUrl || dicebearUrl;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group overflow-hidden rounded-[1.75rem] border border-rose-100 bg-white shadow-lg shadow-rose-100/60"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-rose-50">
        <Image
          src={imageUrl}
          alt={`${profile.name}'s profile`}
          fill
          sizes="(min-width: 1280px) 280px, (min-width: 768px) 33vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
          unoptimized={!profile.photoUrl}
        />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-gray-950/75 via-gray-950/20 to-transparent" />
        {profile.gender && <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold capitalize text-gray-700 shadow-sm backdrop-blur"><UserRound size={13} /> {profile.gender}</span>}
        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <h2 className="text-2xl font-bold tracking-tight">{profile.name}, {profile.age}</h2>
          <p className="mt-1 line-clamp-2 text-sm leading-5 text-white/85">{profile.bio || "Here to meet someone genuine and see where the conversation goes."}</p>
        </div>
      </div>

      <div className="flex items-center justify-between px-5 py-4">
        <span className="text-xs font-medium text-gray-400">Choose an action</span>
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => {
              toast.success("You have rejected this person");
              onPass();
            }}
            aria-label={`Pass on ${profile.name}`}
            title="Pass"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
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
            className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-600 text-white shadow-lg shadow-rose-200 transition hover:bg-rose-700"
          >
            <Heart size={20} fill="currentColor" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
