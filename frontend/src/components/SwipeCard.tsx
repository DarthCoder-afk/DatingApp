"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import ProfileCard from "./ProfileCard";
import toast from "react-hot-toast";

interface SwipeCardProps {
  profile: any;
  onLike: () => void;
  onPass: () => void;
  stacked?: boolean;
}

export default function SwipeCard({ profile, onLike, onPass, stacked = false }: SwipeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const likeOpacity = useTransform(x, [50, 200], [0, 1]);
  const passOpacity = useTransform(x, [-200, -50], [1, 0]);

  return (
    <motion.div
      style={stacked ? { x, rotate } : undefined}
      drag={stacked ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.5}
      onDragEnd={(e, info) => {
        if (info.offset.x > 100) {
            onLike();
            toast.success("You have liked this person");
        } else if (info.offset.x < -100) {
            onPass()
            toast.success("You have rejected this person");};
      }}
      className={stacked ? "absolute w-full" : "w-full"}
    >
      {stacked && <>
        <motion.div style={{ opacity: likeOpacity }} className="absolute right-5 top-7 z-10 rotate-12 rounded-lg border-2 border-emerald-500 px-3 py-1 text-xl font-bold text-emerald-600">LIKE</motion.div>
        <motion.div style={{ opacity: passOpacity }} className="absolute left-5 top-7 z-10 -rotate-12 rounded-lg border-2 border-rose-500 px-3 py-1 text-xl font-bold text-rose-600">PASS</motion.div>
      </>}

      <ProfileCard profile={profile} onLike={onLike} onPass={onPass} />
    </motion.div>
  );
}
