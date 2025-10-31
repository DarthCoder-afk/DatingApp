"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import Image from "next/image";
import NavBar from "@/src/components/NavBar";

interface Message {
  id?: number;
  content: string;
  sender: {
    id: number;
    profile: { name: string; photoUrl?: string | null };
  };
  createdAt: string;
}

const socket = io(process.env.NEXT_PUBLIC_API_URL!, { autoConnect: false });

export default function ChatPage() {
  const { matchId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const userId = getUserIdFromToken(token);

  // Fetch past messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if(!matchId) return;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages/${matchId}`, {

          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setMessages(data);
      } catch (err: any) {
        toast.error(err.message || "You cannot access this chat.");
      } finally {
        setLoading(false);
      }
    };
    if (token && matchId) fetchMessages();
  }, [matchId, token]);

  // Setup socket connection
  useEffect(() => {
    if (!matchId || !userId) return;

    socket.connect();
    socket.emit("joinMatch", matchId);

   socket.on("receiveMessage", (message: Message) => {
      console.log("📩 New message received:", message);
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.disconnect();
      socket.off("receiveMessage");
    };
  }, [matchId, userId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages/${matchId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newMessage }),
      });
      const savedMessage = await res.json();

      if (!res.ok) throw new Error(savedMessage.message);

      socket.emit("sendMessage", { matchId, message: savedMessage });
      setMessages((prev) => [...prev, savedMessage]);
      setNewMessage("");
    } catch (err: any) {
      toast.error(err.message || "Failed to send message");
    }
  };

  // 🔹 Format date nicely
  const formatTimestamp = (isoString: string) => {
    const date = new Date(isoString);
    const options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    };
    return date.toLocaleString(undefined, options);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner text-rose-600"></span>
      </div>
    );

  return (
    <div className="min-h-screen">
        <NavBar/>
        <div className="flex flex-col h-screen bg-base-200">
            <div className="p-4 bg-rose-600 text-white text-lg font-semibold sticky top-0 z-10">
                Chat 💬
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => {
                const isMine = msg.sender.id === userId;
                return (
                    <div key={idx} className={`chat ${isMine ? "chat-end" : "chat-start"}`}>
                    <div className="chat-image avatar">
                        <div className="w-10 rounded-full">
                        <Image
                            src={msg.sender.profile.photoUrl || "/default/default_profile.svg"}
                            alt={msg.sender.profile.name}
                            width={120}
                            height={120}
                        />
                        </div>
                    </div>
                    <div
                        className={`chat-bubble ${
                        isMine ? "chat-bubble-primary" : "chat-bubble-secondary"
                        }`}
                    >
                        <span className="block text-xs opacity-70 mb-1">
                        {isMine ? "You:" : `${msg.sender.profile.name}:`}
                        </span>
                        <p>{msg.content}</p>
                    </div>
                    <div className="chat-footer text-[10px] opacity-60 mt-1">
                        {formatTimestamp(msg.createdAt)}
                    </div>
                    </div>
                );
                })}
                <div ref={messagesEndRef}></div>
            </div>

            {/* Input Field */}
            <form onSubmit={handleSend} className="p-4 bg-base-100 border-t flex gap-2">
                <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="input input-bordered w-full"
                />
                <button type="submit" className="btn btn-primary bg-rose-600 hover:bg-rose-700">
                Send
                </button>
            </form>
        </div>
    </div>
    
  );
}

// Extract userId from token
function getUserIdFromToken(token: string | null): number | null {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id;
  } catch {
    return null;
  }
}
