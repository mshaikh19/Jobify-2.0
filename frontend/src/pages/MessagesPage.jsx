import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { messagesAPI } from "../services/api";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function MessagesPage({
  currentRole = "job_seeker",
  initialThreadId = null,
  onNavigate,
  user,
}) {
  const token = localStorage.getItem("jobify_token");
  const currentUser =
    user ||
    (localStorage.getItem("jobify_user")
      ? JSON.parse(localStorage.getItem("jobify_user"))
      : null);
  const currentUserName = currentUser?.full_name || "You";
  const currentUserId = currentUser?.id || "";

  const [socket, setSocket] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [inputText, setInputText] = useState("");
  const [unreadTotal, setUnreadTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    const newSocket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
    });
    newSocket.on("connect", () => {
      console.log("Socket.IO connected");
      fetchConversations();
    });
    newSocket.on("disconnect", () => {
      console.log("Socket.IO disconnected");
    });
    newSocket.on("new_message", (msg) => {
      if (activeConversation && msg.conversation_id === activeConversation.id) {
        setMessages((prev) => [...prev, msg]);
        scrollToBottom();
      }
      fetchConversations();
    });
    newSocket.on("error", (err) => {
      console.error("Socket error:", err);
      setError(err.message || "Socket connection error");
    });
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, [token, activeConversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchConversations = async () => {
    try {
      const res = await messagesAPI.getConversations();
      setConversations(res.data || []);
      const unreadRes = await messagesAPI.getTotalUnread();
      setUnreadTotal(unreadRes.data?.total_unread || 0);
    } catch (err) {
      console.error("Failed to fetch conversations:", err);
      setError("Failed to load conversations");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const res = await messagesAPI.getMessages(conversationId, { limit: 100 });
      setMessages(res.data || []);
      setTimeout(scrollToBottom, 100);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  const selectConversation = (conv) => {
    setActiveConversation(conv);
    setMessages([]);
    if (socket) {
      socket.emit("join_room", {
        conversation_id: conv.id,
        user_id: currentUserId,
      });
    }
    fetchMessages(conv.id);
  };

  useEffect(() => {
    if (initialThreadId && conversations.length > 0 && !activeConversation) {
      const conv = conversations.find((c) => c.id === initialThreadId);
      if (conv) selectConversation(conv);
    }
  }, [initialThreadId, conversations.length, activeConversation]);

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeConversation || !socket) return;
    const messageData = {
      conversation_id: activeConversation.id,
      sender_id: currentUserId,
      sender_name: currentUserName,
      sender_role: currentRole,
      text: inputText.trim(),
    };
    socket.emit("send_message", messageData);
    messagesAPI
      .sendMessage(activeConversation.id, messageData)
      .catch((err) => console.error("Failed to persist:", err));
    setInputText("");
  };

  const formatTime = (isoString) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const formatDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const now = new Date();
    return date.toDateString() === now.toDateString()
      ? "Today"
      : date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  if (loading) {
    return (
      <div className="w-full pt-24 pb-16 bg-background min-h-screen px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-center h-96">
          <span className="material-symbols-outlined text-3xl text-secondary-container animate-spin">
            cloud
          </span>
        </div>
      </div>
    );
  }

  const unreadConversations = conversations.filter(
    (c) => (c.unread_count || 0) > 0,
  );

  return (
    <div className="w-full pt-24 pb-16 bg-background min-h-screen px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-xl text-xs">
          {error}
        </div>
      )}

      <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 border border-surface-container-high shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/20 text-secondary-container text-xs font-bold uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-sm">lock</span>{" "}
              Verified Channel
            </div>
            <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold">
              Direct Hiring Communication
            </h1>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
              Encrypted end-to-end messaging with hiring managers and enterprise
              talent partners.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low border border-surface-container-high text-xs">
              <span className="{socket ? bg-emerald-500 : bg-rose-500} w-2 h-2 rounded-full animate-pulse"></span>
              <span className="font-semibold text-on-surface">
                {socket ? "Online" : "Connecting..."}
              </span>
            </div>
            <span className="px-3 py-1.5 rounded-full bg-secondary-container/20 text-on-secondary-container text-xs font-bold">
              {unreadConversations.length} Unread
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 sm:px-0">
        <div className="flex items-center gap-3 text-xs text-on-surface-variant">
          <span>Logged in as:</span>
          <span className="font-bold text-primary">{currentUserName}</span>
          <span className="text-[10px] uppercase tracking-wider opacity-60">
            ({currentRole.replace("_", " ")})
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-surface-container-low">
            <h2 className="font-headline-sm text-sm font-bold text-primary">
              Recruiter Messages
            </h2>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-xs">
                search
              </span>
              <input
                type="text"
                placeholder="Search recruiters or conversations..."
                className="w-full px-3 py-1.5 rounded-lg border border-surface-container-high bg-surface-container-low text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-on-surface-variant mb-3">
            <span>All Inquiries</span>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Unread</span>
              <span>Offers</span>
            </div>
          </div>
          <div className="space-y-2">
            {conversations.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-2xl p-8 text-center border border-surface-container-high shadow-xs">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-3">
                  chat_bubble_outline
                </span>
                <h3 className="font-headline-sm text-sm font-bold text-primary">
                  No conversations yet
                </h3>
                <p className="text-xs text-on-surface-variant mt-1">
                  Start a conversation with a recruiter to begin messaging.
                </p>
              </div>
            ) : (
              conversations.map((conv) => {
                const isActive = activeConversation?.id === conv.id;
                const otherName =
                  conv.participant_names.find(
                    (_, i) => conv.participant_ids[i] !== currentUserId,
                  ) || "Unknown";
                const otherRole =
                  conv.participant_roles.find(
                    (_, i) => conv.participant_ids[i] !== currentUserId,
                  ) || "";
                const company = conv.company_name || "";
                const unread = conv.unread_count || 0;
                return (
                  <button
                    key={conv.id}
                    onClick={() => selectConversation(conv)}
                    className={
                      isActive
                        ? "w-full p-4 rounded-2xl border border-primary bg-primary/10 text-primary transition-all hover:border-primary/40 hover:shadow-md"
                        : "w-full p-4 rounded-2xl border border-surface-container-high/80 text-on-surface transition-all hover:bg-surface-container-low"
                    }
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center shrink-0">
                        {otherName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <h4 className="font-bold text-sm truncate">
                            {otherName}
                          </h4>
                          {unread > 0 && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-[10px] font-bold text-emerald-900">
                              {unread}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-on-surface-variant/80 truncate">
                          {otherRole}
                          {company ? " • " + company : ""}
                        </p>
                        <p
                          className={
                            isActive
                              ? "text-[10px] font-medium truncate text-primary"
                              : "text-[10px] font-medium truncate text-on-surface-variant"
                          }
                        >
                          {conv.last_message || "No messages yet"}
                        </p>
                        <p className="text-[10px] text-on-surface-variant/60">
                          {conv.last_message_at
                            ? formatDate(conv.last_message_at)
                            : ""}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
