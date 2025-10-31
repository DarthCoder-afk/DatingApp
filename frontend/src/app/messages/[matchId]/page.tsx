"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { io, Socket } from "socket.io-client";
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

export default function ChatPage() {
  const { matchId } = useParams();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const userId = getUserIdFromToken(token);

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
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner text-rose-600"></span>
      </div>
    );

  return (
    <div className="min-h-screen ">
      <NavBar />
      <div className="flex flex-col h-screen bg-base-200">
        <div className="p-4 bg-rose-600 text-white text-lg font-semibold sticky top-0 z-10">
          Chat 💬
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-br from-rose-50 to-pink-300">
          {messages.map((msg, idx) => {
            const isMine = msg.sender.id === userId;
            return (
              <div
                key={idx}
                className={`chat ${isMine ? "chat-end" : "chat-start"}`}
              >
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    <Image
                      src={
                        msg.sender.profile.photoUrl ||
                        "/default/default_profile.svg"
                      }
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

        <form
          onSubmit={handleSend}
          className="p-4 bg-base-100 border-t flex gap-2"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="input input-bordered w-full"
          />
          <button
            type="submit"
            className="btn btn-primary bg-rose-600 hover:bg-rose-700"
          >
            Send
          </button>
        </form>
      </div>
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
