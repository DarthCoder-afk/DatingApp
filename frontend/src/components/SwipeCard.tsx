"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { Heart, MapPin, X } from "lucide-react";

interface Profile { id: number; name: string; age: number; gender?: string; bio?: string; photoUrl?: string | null; }
interface Props { profile: Profile; onLike: () => void; onPass: () => void; stacked?: boolean; stackIndex?: number; hideActions?: boolean; }

export default function SwipeCard({ profile, onLike, onPass, stacked = false, stackIndex = 0, hideActions = false }: Props) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-180, 180], [-5, 5]);
  const likeOpacity = useTransform(x, [35, 130], [0, 1]);
  const passOpacity = useTransform(x, [-130, -35], [1, 0]);
  const avatar = profile.photoUrl || `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${encodeURIComponent(`${profile.name}-${profile.id}`)}&backgroundColor=fae7df`;
  return <motion.article
    style={stacked ? { x, rotate, y: stackIndex * 8, scale: 1 - stackIndex * .025 } : undefined}
    drag={stacked ? "x" : false} dragConstraints={{ left: 0, right: 0 }} dragElastic={.16}
    onDragEnd={(_, info) => { if (info.offset.x > 112) onLike(); if (info.offset.x < -112) onPass(); }}
    className={stacked ? "absolute inset-x-0 touch-pan-y" : "w-full"}
  >
    <div className="discover-card">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={avatar} alt={`${profile.name}'s profile`} className="discover-image" />
      <div className="discover-scrim" />
      {stacked && <><motion.span style={{ opacity: passOpacity }} className="swipe-signal swipe-pass">NOPE</motion.span><motion.span style={{ opacity: likeOpacity }} className="swipe-signal swipe-like">LIKE</motion.span></>}
      <div className="discover-copy"><p className="eyebrow-light">Now nearby <MapPin size={13} /></p><h2>{profile.name}<span>, {profile.age}</span></h2><p className="line-clamp-2">{profile.bio || "Here for a good conversation and a connection that feels easy."}</p></div>
    </div>
    {!hideActions && <div className="card-actions"><button onClick={onPass} aria-label={`Pass on ${profile.name}`} className="action-button action-pass"><X size={23} /></button><button onClick={onLike} aria-label={`Like ${profile.name}`} className="action-button action-like"><Heart size={21} fill="currentColor" /></button></div>}
  </motion.article>;
}
