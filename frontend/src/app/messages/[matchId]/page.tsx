"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import toast from "react-hot-toast";
import NavBar from "@/src/components/NavBar";
import { ArrowLeft, MessageCircle, SendHorizontal, Sparkles } from "lucide-react";

interface Message {
  id?: number;
  content: string;
  sender: {
    id: number;
    profile: { name: string; photoUrl?: string | null };
  };
  createdAt: string;
}

export default function ChatPage() {
  const { matchId } = useParams();
  const router = useRouter();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const userId = getUserIdFromToken(token);
  const otherParticipant = messages.find((message) => message.sender.id !== userId)?.sender.profile;

  // ✅ Initialize socket after token is ready
  useEffect(() => {
    if (!token || socketRef.current) return;
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
    });

    socketRef.current = newSocket;

    newSocket.on("connect", () => console.log("✅ Connected to socket server"));
    newSocket.on("connect_error", (err) =>
      console.error("❌ Connection error:", err.message, newSocket)
    );

    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, [token]);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!matchId || !token) return;
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/messages/${matchId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setMessages(data);
      } catch (err: any) {
        toast.error(err.message || "You cannot access this chat.");
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [matchId, token]);

  // Join room and listen to messages
  useEffect(() => {
    if (!socket || !matchId || !userId) return;

    socket.emit("joinRoom", matchId);

    const handleReceive = (message: Message) => {
      console.log("📩 New message received:", message);
      setMessages((prev) => [...prev, message]);
    };

    socket.off("receiveMessage", handleReceive); // ✅ prevent duplicates
    socket.on("receiveMessage", handleReceive);

    return () => {
      socket.off("receiveMessage", handleReceive); // ✅ clean up
    };
  }, [socket, matchId, userId]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const handleSend = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!newMessage.trim() || !token) return;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/messages/${matchId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newMessage }),
      }
    );

    const savedMessage = await res.json();
    if (!res.ok) throw new Error(savedMessage.message);

    // ✅ Only emit — don’t append manually
    socket?.emit("sendMessage", { matchId, content: newMessage });
    setNewMessage("");
  } catch (err: any) {
    toast.error(err.message || "Failed to send message");
  }
};

  if (loading)
    return (
      <div className="min-h-screen bg-rose-50"><NavBar /><div className="mx-auto max-w-5xl px-6 py-10"><div className="h-[calc(100vh-150px)] animate-pulse rounded-3xl bg-white" /></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-linear-to-b from-rose-50 via-white to-pink-50">
      <div className="hidden md:block"><NavBar /></div>
      <main className="mx-auto flex h-screen max-w-5xl flex-col md:h-[calc(100vh-72px)] md:px-8 md:py-6">
        <section className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white md:rounded-3xl md:border md:border-rose-100 md:shadow-xl md:shadow-rose-100/60">
          <header className="flex items-center justify-between border-b border-rose-100 bg-white px-5 py-4 md:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <button onClick={() => router.push("/messages")} aria-label="Back to messages" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-gray-500 transition hover:bg-rose-50 hover:text-rose-600"><ArrowLeft size={20} /></button>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-600"><MessageCircle size={20} /></div>
              <div className="min-w-0"><h1 className="truncate font-bold text-gray-900">{otherParticipant?.name || "Your conversation"}</h1><p className="text-xs text-gray-500">A space for a real connection</p></div>
            </div>
            <span className="hidden items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 sm:inline-flex"><Sparkles size={14} /> Matched</span>
          </header>

        <div className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top_right,_rgba(251,113,133,0.12),_transparent_32%),linear-gradient(to_bottom,_#fff7f8,_#fff)] px-4 py-6 md:px-7">
          {messages.length === 0 ? <div className="flex h-full flex-col items-center justify-center text-center"><div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-rose-100 text-rose-600"><MessageCircle size={26} /></div><h2 className="mt-5 text-xl font-bold text-gray-900">Start the conversation</h2><p className="mt-2 max-w-sm text-sm leading-6 text-gray-600">Try a thoughtful hello, a shared interest, or something that made you smile today.</p></div> : <div className="space-y-5">
          {messages.map((msg, idx) => {
            const isMine = msg.sender.id === userId;
            const avatarUrl = msg.sender.profile.photoUrl || `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${encodeURIComponent(`${msg.sender.profile.name}-${msg.sender.id}`)}&backgroundColor=ffe4e6`;
            return (
              <div
                key={msg.id ?? `${msg.createdAt}-${idx}`}
                className={`flex items-end gap-2.5 ${isMine ? "justify-end" : "justify-start"}`}
              >
                {!isMine && <img src={avatarUrl} alt={msg.sender.profile.name} className="h-9 w-9 shrink-0 self-end rounded-xl border border-rose-100 bg-rose-50 object-cover" />}
                <div className={`max-w-[78%] md:max-w-[65%] ${isMine ? "items-end" : "items-start"}`}>
                  {!isMine && <p className="mb-1 px-1 text-xs font-semibold text-gray-500">{msg.sender.profile.name}</p>}
                  <div className={`rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${isMine ? "rounded-br-md bg-rose-600 text-white shadow-rose-200" : "rounded-bl-md border border-rose-100 bg-white text-gray-700"}`}><p className="break-words">{msg.content}</p></div>
                  <p className={`mt-1 px-1 text-[11px] text-gray-400 ${isMine ? "text-right" : "text-left"}`}>{formatTimestamp(msg.createdAt)}</p>
                </div>
              </div>
            );
          })}
          </div>}
          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={handleSend}
          className="flex gap-3 border-t border-rose-100 bg-white p-4 md:p-5"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Write a message..."
            className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-100"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            aria-label="Send message"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-600 text-white shadow-lg shadow-rose-200 transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <SendHorizontal size={19} />
          </button>
        </form>
        </section>
      </main>
    </div>
  );
}

// Helper
function getUserIdFromToken(token: string | null): number | null {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id;
  } catch {
    return null;
  }
}

function formatTimestamp(isoString: string) {
  const date = new Date(isoString);
  return date.toLocaleString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
  });
}
