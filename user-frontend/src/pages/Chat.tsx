// AuraCareChat.tsx — full file with Rasa buttons, direct navigation & session deletion
import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SendHorizonal, Trash2 } from "lucide-react";
import DashboardNavbar from "@/components/DashboardNavbar";
import DashboardFooter from "@/components/DashboardFooter";
import { useDarkMode } from "@/components/DarkModeProvider";
import { useNavigate } from "react-router-dom";
import Sentiment from "sentiment";

const sentiment = new Sentiment();

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: string;
  buttons?: { title: string; payload: string }[];
  custom?: { navigate_to?: string; mood?: number; emotion?: string; energyLevel?: number; sleepHours?: number };
}

interface SessionItem {
  id: string;
  created_at: string;
}

const Chat: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // --- Session setup ---
  const [sessionId, setSessionId] = useState(() => {
    const existing = sessionStorage.getItem("sessionId");
    if (existing) return existing;
    const n = uuidv4();
    sessionStorage.setItem("sessionId", n);
    sessionStorage.setItem("createdAt", new Date().toISOString());
    return n;
  });

  const [chatHistory, setChatHistory] = useState<Message[]>(() => {
    const saved = sessionStorage.getItem("chatHistory");
    return saved ? JSON.parse(saved) : [];
  });

  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const getUserEmail = () => localStorage.getItem("userEmail") || "";

  // --- Logging helpers ---
  const logMessage = async (sender: "user" | "bot", text: string, ts = new Date().toISOString()) => {
    const email = getUserEmail();
    if (!email) return;
    const createdAt = sessionStorage.getItem("createdAt")!;
    await fetch("http://localhost:5000/api/log-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        sender,
        message: text,
        timestamp: createdAt,
        session_id: sessionId,
      }),
    });
  };

  const logMood = async (mood: number, emotion?: string, energyLevel?: number, sleepHours?: number) => {
    const email = getUserEmail();
    if (!email) return;
    await fetch("http://localhost:5000/api/mood-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: sessionId,
        email,
        mood,
        emotion,
        energyLevel,
        sleepHours,
        source: "chat",
        timestamp: new Date().toISOString(),
      }),
    });
  };

  const getEmotionFromScore = (score: number) => {
    if (score >= 8) return "Happy";
    if (score >= 5) return "Neutral";
    if (score >= 3) return "Sad";
    return "Anxious";
  };

  // --- Load & switch sessions ---
  useEffect(() => {
    const loadSessions = async () => {
      const email = getUserEmail();
      if (!email) return;
      const res  = await fetch(
        `http://localhost:5000/api/sessions/${encodeURIComponent(email)}`
      );
      const data = await res.json();
      if (!data.success) return;

      // If backend is still returning string[] (old), turn into SessionItem[]
      let list: SessionItem[];
      if (typeof data.sessions[0] === "string") {
        const fallbackTs = sessionStorage.getItem("createdAt") ||
                           new Date().toISOString();
        list = (data.sessions as string[]).map(id => ({
          id,
          created_at: fallbackTs
        }));
      } else {
        // New backend: already [{ id, created_at }]
        list = data.sessions as SessionItem[];
      }

      setSessions(list);
    };

    loadSessions();
  }, []);
  
  const handleSessionClick = async (sid: string) => {
    const res = await fetch("http://localhost:5000/api/session-messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: getUserEmail(), session_id: sid }),
    });
    const body = await res.json();
    const msgs: Message[] = body.messages.map((m: any) => ({
      id: m._id,
      content: m.message,
      sender: m.sender,
      timestamp: m.timestamp,
      buttons: m.buttons,
      custom: m.custom,
    }));
    setSessionId(sid);
    setChatHistory(msgs);
    sessionStorage.setItem("sessionId", sid);
    sessionStorage.setItem("chatHistory", JSON.stringify(msgs));
  };

 // inside your Chat component

// --- Delete session from sidebar, safely switch/regen sessions ---
const handleDeleteSession = (sid: string) => {
  setSessions(curr => {
    // remove the target
    const filtered = curr.filter(s => s.id !== sid);

    // if we still have others, pick the first to become active (if needed)
    if (filtered.length > 0) {
      setSessions(filtered);
      if (sid === sessionId) {
        // if you deleted the open session, switch to the first in the list
        const next = filtered[0];
        setSessionId(next.id);
        // load its history
        handleSessionClick(next.id);
      }
      return filtered;
    }

    // you just deleted the very last session: spawn a brand-new one
    const newId = uuidv4();
    const now   = new Date().toISOString();
    setSessionId(newId);
    setChatHistory([]);
    sessionStorage.setItem("sessionId", newId);
    sessionStorage.setItem("createdAt", now);
    sessionStorage.removeItem("chatHistory");

    // update sidebar to show that new session
    return [{ id: newId, created_at: now }];
  });
};


  const handleNewChat = () => {
    const sid = uuidv4();
    const now = new Date().toISOString();
    setSessionId(sid);
    setChatHistory([]);
    sessionStorage.setItem("sessionId", sid);
    sessionStorage.setItem("createdAt", now);
    sessionStorage.removeItem("chatHistory");
  };

  // --- Send message & handle Rasa reply ---
  const handleSendMessage = async () => {
    if (!message.trim()) return;
    const nowIso = new Date().toISOString();

    // 1) Append user message
    const userMsg: Message = { id: nowIso, content: message, sender: "user", timestamp: nowIso };
    setChatHistory(h => [...h, userMsg]);
    await logMessage("user", message, nowIso);

    // 2) Mood logging
    const result = sentiment.analyze(message);
    const moodScore = Math.min(Math.max(Math.round((result.comparative + 1) * 5), 0), 10);
    await logMood(moodScore, getEmotionFromScore(moodScore));

    // 3) Clear input & show typing
    setMessage("");
    setIsTyping(true);

    // 4) Call Rasa
    try {
      const resp = await fetch("http://localhost:5005/webhooks/rest/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender: "user", message }),
      });
      const data = await resp.json();

      // 5) Handle each bot message
      for (const m of data) {
        const botMsg: Message = {
          id: Date.now().toString() + Math.random(),
          content: m.text || m.custom?.reply || "",
          sender: "bot",
          timestamp: new Date().toISOString(),
          buttons: m.buttons,
          custom: m.custom,
        };
        setChatHistory(h => [...h, botMsg]);
        await logMessage("bot", botMsg.content, botMsg.timestamp);
      }
    } catch {
      setChatHistory(h => [
        ...h,
        { id: Date.now().toString(), content: "⚠️ Bot unreachable.", sender: "bot", timestamp: new Date().toISOString() },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // --- Auto-scroll + persist ---
  useEffect(() => {
    chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: "smooth" });
    sessionStorage.setItem("chatHistory", JSON.stringify(chatHistory));
  }, [chatHistory]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-72 bg-purple-100 p-4">
        <h2 className="text-2xl font-bold text-purple-700 mb-4">AuraCare</h2>
        <Button onClick={handleNewChat} className="w-full mb-4 bg-red-500 hover:bg-red-600 text-white">
          + New Chat
        </Button>
        <div className="overflow-y-auto h-[calc(100vh-160px)] space-y-2">
        {sessions.map(s => {
  const dt = new Date(s.created_at);
  const label =
    dt.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }) +
    " — " +
    dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return (
    <div
      key={s.id}
      className="flex items-center justify-between bg-white rounded shadow hover:bg-purple-50"
    >
      <button
        onClick={() => handleSessionClick(s.id)}
        className="flex-1 text-left p-2"
      >
        {label}
      </button>
      <button
        onClick={() => handleDeleteSession(s.id)}
        className="p-2 hover:bg-red-100 rounded"
      >
        <Trash2 className="w-4 h-4 text-red-500" />
      </button>
    </div>
  );
})}

        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        <DashboardNavbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        <div className="flex-1 overflow-hidden p-4 flex flex-col items-center">
          <Card className="w-full max-w-3xl h-full flex flex-col shadow-lg">
            <CardHeader><CardTitle className="text-center">AuraCare Chatbot</CardTitle></CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-2 space-y-2">
                {chatHistory.map(m => (
                  <div key={m.id} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                    {m.sender === "bot" && (
                      <Avatar className="mr-2">
                        <AvatarImage src="/bot-avatar.png" alt="Bot" />
                        <AvatarFallback>🤖</AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`p-3 rounded-lg ${m.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}>
                      {m.content}

                      {/* ←— RENDER RASA BUTTONS HERE —→ */}
                      {m.buttons?.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {m.buttons.map(b => (
                            <Button
                              key={b.payload}
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                switch (b.payload) {
                                  case "/trigger_game": return navigate("/games");
                                  case "/trigger_music": return navigate("/music");
                                  case "/trigger_quiz":  return navigate("/quiz");
                                  default: return;
                                }
                              }}
                            >
                              {b.title}
                            </Button>
                          ))}
                        </div>
                      )}

                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(m.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                    {m.sender === "user" && (
                      <Avatar className="ml-2">
                        <AvatarImage src="/user-avatar.png" alt="You" />
                        <AvatarFallback>🧑</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isTyping && <div className="text-gray-500">Bot is typing…</div>}
              </div>

              {/* Input area */}
              <div className="flex items-center mt-4 space-x-2">
                <Textarea
                  className="flex-1 rounded border border-gray-300 p-2"
                  placeholder="Type your message…"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyPress={e => e.key === "Enter" && handleSendMessage()}
                />
                <Button onClick={handleSendMessage} className="flex items-center space-x-1">
                  <SendHorizonal className="w-5 h-5" /> <span>Send</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <DashboardFooter />
      </div>
    </div>
  );
};

export default Chat;
