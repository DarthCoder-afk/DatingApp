"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";    
import NavBar from "@/src/components/NavBar";

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
      <div className="flex flex-col justify-center items-center h-screen text-center">
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
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-300">
        <NavBar/>
        <div className="py-6 px-4 md:px-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center md:text-left">
                Messages 💌
            </h1>

            <div className="bg-white shadow-md rounded-xl divide-y divide-gray-200 max-w-3xl mx-auto">
                {conversations.map((conv) => (
                <button
                    key={conv.matchId}
                    onClick={() => router.push(`/messages/${conv.matchId}`)}
                    className="w-full text-left flex items-center gap-4 p-4 hover:bg-rose-50 transition"
                >
                    <div className="avatar">
                    <div className="w-14 h-14 rounded-full ring ring-rose-500 ring-offset-base-100 ring-offset-2">
                        <Image
                        src={conv.user.profile.photoUrl || "/default/default_profile.svg"}
                        alt={conv.user.profile.name}
                        width={120}
                        height={120}
                        />
                    </div>
                    </div>

                    <div className="flex-1 overflow-hidden">
                    <h3 className="font-semibold text-gray-800 truncate">
                        {conv.user.profile.name}
                    </h3>
                    <p className="text-gray-600 text-sm truncate">
                        {conv.lastMessage
                        ? conv.lastMessage.sender.id === getUserIdFromToken(token)
                            ? `You: ${conv.lastMessage.content}`
                            : `${conv.lastMessage.sender.profile.name}: ${conv.lastMessage.content}`
                        : "Say hi 👋"}
                    </p>
                    </div>

                    {conv.lastMessage && (
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                        {formatTimestamp(conv.lastMessage.createdAt)}
                    </span>
                    )}
                </button>
                ))}
            </div>
        </div>
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
