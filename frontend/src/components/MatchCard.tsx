"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface Profile {
  id?: number;
  name: string;
  age: number;
  bio?: string;
  photoUrl?: string;
}

interface ProfileCardProps {
  profile?: Profile;
  onUnmatch?: () => void;
  buttonLabel: string;
}

export default function ProfileCard({
  profile,
  onUnmatch,
  buttonLabel,
}: ProfileCardProps) {
  if (!profile) return null;
  const { name, age, bio, photoUrl } = profile;
  const imgSrc = photoUrl || "/default/default_profile.svg";

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="card bg-[#f7eeed] shadow-xl hover:shadow-2xl transition-all"
    >
      <figure className="px-10 pt-10">
        <div className="avatar">
          <div className="w-50 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            <Image
              src={imgSrc}
              alt={name}
              width={120}
              height={120}
              className="object-cover"
            />
          </div>
        </div>
      </figure>
      <div className="card-body items-center text-center">
        <h2 className="card-title text-lg font-semibold">
          {name}, {age}
        </h2>
        <p className="text-sm text-gray-500">{bio}</p>
        <div className="card-actions mt-3">
          <button
            onClick={onUnmatch}
            disabled={!onUnmatch}
            className={`btn btn-sm rounded-full ${
              onUnmatch ? "btn-error" : "btn-disabled"
            }`}
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
