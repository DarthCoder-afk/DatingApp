"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";    
import NavBar from "@/src/components/NavBar";
import MobileBottomNav from "@/src/components/MobileBottomNav";
import { ArrowLeft, ArrowUpRight, MessageCircle, Search, Sparkles } from "lucide-react";

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

  const isToday = (iso: string) => new Date(iso).toDateString() === new Date().toDateString();

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
            <section className="md:hidden">
              <header className="flex items-center justify-between"><button onClick={() => router.push("/home")} aria-label="Back to discover" className="-ml-2 rounded-xl p-2 text-slate-800"><ArrowLeft size={22} /></button><h1 className="text-xl font-semibold text-slate-900">Chat</h1><button aria-label="Search conversations" className="-mr-2 rounded-xl p-2 text-slate-800"><Search size={21} /></button></header>

              <div className="mt-5"><p className="text-sm font-medium text-slate-800">Recent match</p><div className="mt-3 flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none]">{conversations.slice(0, 8).map((conv) => <button key={`recent-${conv.matchId}`} onClick={() => router.push(`/messages/${conv.matchId}`)} className="flex w-11 shrink-0 flex-col items-center gap-1.5"><div className="h-11 w-11 overflow-hidden rounded-full bg-rose-100"><ConversationAvatar conversation={conv} /></div><span className="w-full truncate text-center text-[11px] font-medium text-slate-700">{conv.user.profile.name.split(" ")[0]}</span></button>)}</div></div>

              <div className="mt-5 space-y-5">
                {([true, false] as const).map((today) => {
                  const group = conversations.filter((conv) => !conv.lastMessage ? today : isToday(conv.lastMessage.createdAt) === today);
                  if (!group.length) return null;
                  return <section key={today ? "today" : "earlier"}><h2 className="mb-2 text-sm font-medium text-slate-800">{today ? "Today Message" : "Earlier messages"}</h2><div>{group.map((conv) => <button key={conv.matchId} onClick={() => router.push(`/messages/${conv.matchId}`)} className="flex w-full items-center gap-3 py-2.5 text-left"><div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-rose-100"><ConversationAvatar conversation={conv} /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-900">{conv.user.profile.name}</p><p className="mt-1 truncate text-xs text-slate-400">{conv.lastMessage ? `${conv.lastMessage.sender.id === getUserIdFromToken(token) ? "You: " : ""}${conv.lastMessage.content}` : "Say hi 👋"}</p></div><div className="self-start pt-1 text-[10px] text-slate-400">{conv.lastMessage ? formatTimestamp(conv.lastMessage.createdAt).split(",")[0] : ""}</div></button>)}</div></section>;
                })}
                {!conversations.some((conv) => conv.lastMessage) && <p className="pt-8 text-center text-sm text-slate-400">Open a match and send the first hello.</p>}
              </div>
            </section>
            <section className="mb-8 hidden border-b border-rose-100 pb-8 md:block"><p className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1.5 text-sm font-medium text-rose-600"><Sparkles size={15} /> Your inbox</p><h1 className="mt-5 text-3xl font-bold text-gray-900 md:text-4xl">Conversations worth continuing.</h1><p className="mt-3 text-gray-600">Your mutual matches, all in one calm place.</p></section>

            <div className="hidden overflow-hidden rounded-3xl border border-rose-100 bg-white shadow-lg shadow-rose-100/60 md:block">
                {conversations.map((conv) => (
                <button
                    key={conv.matchId}
                    onClick={() => router.push(`/messages/${conv.matchId}`)}
                    className="group flex w-full items-center gap-4 border-b border-rose-50 p-5 text-left transition last:border-0 hover:bg-rose-50/70"
                >
                    <div className="relative shrink-0">
                    <div className="h-14 w-14 overflow-hidden rounded-2xl border border-rose-100 bg-rose-50">
                        <ConversationAvatar conversation={conv} />
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
