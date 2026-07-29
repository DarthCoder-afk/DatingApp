"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";    
import NavBar from "@/src/components/NavBar";
import MobileBottomNav from "@/src/components/MobileBottomNav";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import AppSkeleton from "@/src/components/AppSkeleton";

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
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : "Failed to load conversations");
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
      <div className="app-shell">
        <div className="hidden md:block"><NavBar /></div>
        <main className="app-page">
          <header className="app-page-header">
            <div><p className="eyebrow">Messages</p><h1>Keep the conversation going.</h1><p className="subtle">Thoughtful exchanges, all in one calm place.</p></div>
            <span className="app-page-mark"><MessageCircle size={20} /></span>
          </header>
          <AppSkeleton variant="list" />
        </main>
        <MobileBottomNav />
      </div>
    );

  if (!conversations.length)
    return (
      <div className="app-shell">
        <div className="hidden md:block"><NavBar /></div>
        <main className="app-page">
          <header className="app-page-header">
            <div><p className="eyebrow">Messages</p><h1>Keep the conversation going.</h1><p className="subtle">Thoughtful exchanges, all in one calm place.</p></div>
            <span className="app-page-mark"><MessageCircle size={20} /></span>
          </header>
          <section className="app-empty"><span className="app-empty-icon"><MessageCircle size={25} /></span><h2>No conversations yet.</h2><p>When a match becomes mutual, start with something small and sincere.</p></section>
        </main>
        <MobileBottomNav />
      </div>
    );

  return (
    <div className="app-shell">
        <div className="hidden md:block"><NavBar /></div>
        <main className="app-page">
            <header className="app-page-header">
              <div><p className="eyebrow">Messages</p><h1>Keep the conversation going.</h1><p className="subtle">Thoughtful exchanges, all in one calm place.</p></div>
              <span className="app-page-mark"><MessageCircle size={20} /></span>
            </header>
            <div className="app-panel">
                {conversations.map((conv) => (
                <button
                    key={conv.matchId}
                    onClick={() => router.push(`/messages/${conv.matchId}`)}
                    className="group flex w-full items-center gap-3 border-b border-[#eee5e0] p-4 text-left transition last:border-0 hover:bg-[#f9f1ed] sm:gap-4 sm:p-5"
                >
                    <div className="relative shrink-0">
                    <div className="h-12 w-12 overflow-hidden rounded-2xl border border-[#e8dcd6] bg-[#f2e4de] sm:h-14 sm:w-14">
                        <ConversationAvatar conversation={conv} />
                    </div>
                    </div>

                    <div className="flex-1 overflow-hidden">
                    <h3 className="truncate font-semibold text-[#3a2b31]">
                        {conv.user.profile.name}
                    </h3>
                    <p className="mt-1 truncate text-sm text-[#88777c]">
                        {conv.lastMessage
                        ? conv.lastMessage.sender.id === getUserIdFromToken(token)
                            ? `You: ${conv.lastMessage.content}`
                            : `${conv.lastMessage.sender.profile.name}: ${conv.lastMessage.content}`
                        : "Say hi 👋"}
                    </p>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-2">
                    {conv.lastMessage && <span className="hidden whitespace-nowrap text-xs text-[#a08f94] sm:block">
                        {formatTimestamp(conv.lastMessage.createdAt)}
                    </span>}
                    <ArrowUpRight size={17} className="text-[#c9aaa0] transition group-hover:text-[#a65a55]" />
                    </div>
                </button>
                ))}
            </div>
        </main>
        <MobileBottomNav />
    </div>
    
  );
}

function ConversationAvatar({ conversation }: { conversation: Conversation }) {
  const photoUrl = conversation.user.profile.photoUrl;
  const name = conversation.user.profile.name;
  const dicebearUrl = `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${encodeURIComponent(`${name}-${conversation.user.id}`)}&backgroundColor=ffe4e6`;
  const avatarUrl = photoUrl || dicebearUrl;
  if (avatarUrl.startsWith("https://api.dicebear.com/")) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />;
  }
  return <Image src={avatarUrl} alt={name} width={96} height={96} className="h-full w-full object-cover" />;
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
