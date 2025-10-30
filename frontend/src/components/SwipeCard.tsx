"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import ProfileCard from "./ProfileCard";

interface SwipeCardProps {
  profile: any;
  onLike: () => void;
  onPass: () => void;
}

export default function SwipeCard({ profile, onLike, onPass }: SwipeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const likeOpacity = useTransform(x, [50, 200], [0, 1]);
  const passOpacity = useTransform(x, [-200, -50], [1, 0]);

  return (
    <motion.div
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.5}
      onDragEnd={(e, info) => {
        if (info.offset.x > 100) onLike();
        else if (info.offset.x < -100) onPass();
      }}
      className="absolute w-full"
    >
      <motion.div
        style={{ opacity: likeOpacity }}
        className="absolute top-10 left-10 text-green-500 text-3xl font-bold z-10"
      >
        ❤️ LIKE
      </motion.div>
      <motion.div
        style={{ opacity: passOpacity }}
        className="absolute top-10 right-10 text-red-500 text-3xl font-bold z-10"
      >
        ❌ PASS
      </motion.div>

      <ProfileCard profile={profile} onLike={onLike} onPass={onPass} />
    </motion.div>
  );
}
