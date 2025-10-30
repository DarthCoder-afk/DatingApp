"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface ProfileCardProps {
    profile: {
        id: number;
        name: string;
        age: number;
        bio?: string;
        photoUrl?: string | null;
    };
    onLike: () => void;
    onPass: () => void;
}



export default function ProfileCard({ profile, onLike, onPass }: ProfileCardProps) {
    return (
        <motion.div
        whileHover={{ scale: 1.03 }}
        className="bg-white shadow-md rounded-xl p-4 flex flex-col items-center text-center"
        >
        <Image
            src={profile.photoUrl || "/default-profile.svg"}
            alt={profile.name || "Profile Photo"}
            className="w-32 h-32 object-cover rounded-full mb-4"
            width={128}
            height={128}
        />
        <h3 className="text-xl font-semibold text-gray-800">
            {profile.name}, {profile.age}
        </h3>
        <p className="text-gray-600 text-sm mb-3">{profile.bio || "No bio available"}</p>
        <div className="flex gap-4">
            <button
            onClick={onPass}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-full"
            >
            ❌ Pass
            </button>
            <button
            onClick={onLike}
            className="bg-rose-600 text-white hover:bg-rose-700 px-4 py-2 rounded-full"
            >
            ❤️ Like
            </button>
        </div>
        </motion.div>
  );


  
}
