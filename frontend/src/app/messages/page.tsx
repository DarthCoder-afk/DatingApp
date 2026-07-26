"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";    
import NavBar from "@/src/components/NavBar";
import { ArrowUpRight, Bell, MessageCircle, Sparkles } from "lucide-react";
import MobileBottomNav from "@/src/components/MobileBottomNav";

interface Conversation {
  matchId: number;
  user: {
    id: number;
    email: string;
    profile: {
      name: string;
      photoUrl?: string | null;
    };
  };
  lastMessage?: {
    content: string;
    createdAt: string;
    sender: {
      id: number;
      profile: { name: string };
    };
  } | null;
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages/conversations`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setConversations(data);
      } catch (err: any) {
        toast.error(err.message || "Failed to load conversations");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchConversations();
  }, [token]);

  const formatTimestamp = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      month: "short",
      day: "numeric",
    });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner text-rose-600"></span>
      </div>
    );

  if (!conversations.length)
    return (
      <div className="min-h-screen bg-rose-50"><div className="hidden md:block"><NavBar /></div><div className="flex min-h-[calc(100vh-72px)] flex-col items-center justify-center px-6 pb-24 text-center">
        <Image
          src="/default/empty_chat.svg"
          alt="Empty"
          width={180}
          height={180}
          className="mb-6 opacity-80"
        />
        <h2 className="text-xl font-semibold text-gray-700">
          No conversations yet 💬
        </h2>
        <p className="text-gray-500 mt-2 text-sm">
          Start matching to unlock your chat inbox.
        </p>
      </div><MobileBottomNav /></div>
    );

  return (
    <div className="min-h-screen bg-linear-to-b from-rose-50 via-white to-pink-50">
        <div className="hidden md:block"><NavBar/></div>
        <main className="mx-auto max-w-4xl px-5 pb-24 pt-6 md:px-10 md:py-12">
            <header className="mb-6 flex items-center justify-between md:hidden"><button aria-label="Notifications" className="text-rose-500"><Bell size={20} /></button><h1 className="text-xl font-semibold text-slate-900">Messages</h1><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-500"><MessageCircle size={18} /></span></header>
            <section className="mb-8 hidden rounded-3xl bg-gradient-to-br from-rose-600 to-pink-500 px-6 py-8 text-white shadow-xl shadow-rose-200 md:block md:px-10"><p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-sm font-medium"><Sparkles size={15} /> Your inbox</p><h1 className="mt-5 text-3xl font-bold md:text-4xl">Conversations worth continuing.</h1><p className="mt-3 text-rose-50">Your mutual matches, all in one calm place.</p></section>

            <div className="overflow-hidden rounded-3xl border border-rose-100 bg-white shadow-lg shadow-rose-100/60">
                {conversations.map((conv) => (
                <button
                    key={conv.matchId}
                    onClick={() => router.push(`/messages/${conv.matchId}`)}
                    className="group flex w-full items-center gap-4 border-b border-rose-50 p-5 text-left transition last:border-0 hover:bg-rose-50/70"
                >
                    <div className="relative shrink-0">
                    <div className="h-14 w-14 overflow-hidden rounded-2xl border border-rose-100 bg-rose-50">
                        {conv.user.profile.photoUrl?.startsWith("https://api.dicebear.com/") ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={conv.user.profile.photoUrl} alt={conv.user.profile.name} className="h-full w-full object-cover" />
                        ) : <Image src={conv.user.profile.photoUrl || "/default/default_profile.svg"} alt={conv.user.profile.name} width={120} height={120} className="h-full w-full object-cover" />}
                    </div>
                    </div>

                    <div className="flex-1 overflow-hidden">
                    <h3 className="truncate font-semibold text-gray-900">
                        {conv.user.profile.name}
                    </h3>
                    <p className="mt-1 truncate text-sm text-gray-500">
                        {conv.lastMessage
                        ? conv.lastMessage.sender.id === getUserIdFromToken(token)
                            ? `You: ${conv.lastMessage.content}`
                            : `${conv.lastMessage.sender.profile.name}: ${conv.lastMessage.content}`
                        : "Say hi 👋"}
                    </p>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-2">
                    {conv.lastMessage && <span className="whitespace-nowrap text-xs text-gray-400">
                        {formatTimestamp(conv.lastMessage.createdAt)}
                    </span>}
                    <ArrowUpRight size={17} className="text-rose-300 transition group-hover:text-rose-600" />
                    </div>
                </button>
                ))}
            </div>
        </main><MobileBottomNav />
    </div>
    
  );
}

function getUserIdFromToken(token: string | null): number | null {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id;
  } catch {
    return null;
  }
}
