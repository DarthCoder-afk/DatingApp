"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import toast from "react-hot-toast";

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
    const getDefaultPhoto = () => {
      if (profile.gender?.toLowerCase() === "male") {
        return "/default/default-male.svg";
      } else if (profile.gender?.toLowerCase() === "female") {
        return "/default/default-female.svg";
      } else {
        return "/default/default_profile.svg"; // neutral or unknown
      }
    };

    const imageUrl = profile.photoUrl || getDefaultPhoto();
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="card card-compact bg-base-100 transition-all border-t-8 border-rose-500  min-h-120"
    >
      {/* Profile Image */}
      <figure className="px-10 pt-10">
        <div className="avatar">
          <div className="w-50 rounded-full ring ring-rose-600 ring-offset-base-100 ring-offset-2">
            <Image
              src={imageUrl}
              alt={profile.name || "Profile Photo"}
              className="object-cover"
              width={128}
              height={128}
            />
          </div>
        </div>
      </figure>

      {/* Card Body */}
      <div className="card-body items-center text-center">
        <h2 className="card-title text-xl font-semibold">
          {profile.name}, {profile.age}
        </h2>
        <p className="text-gray-600 text-sm">{profile.bio || "No bio available"}</p>

        {/* Action Buttons */}
        <div className="card-actions mt-4 flex gap-4">
          <button
            onClick={() => {
              toast.success("You have rejected this person");
              onPass();
            }}
            className="btn btn-outline btn-sm rounded-full"
          >
            ❌ Pass
          </button>
          <button
            onClick={() => {
              toast.success("You have liked this person");
              onLike();
            }}
            className="btn btn-sm btn-error rounded-full"
          >
            ❤️ Like
          </button>
        </div>
      </div>
    </motion.div>
  );
}
