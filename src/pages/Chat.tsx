import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";

interface Message {
  id: number;
  text: string;
  sender: string;
  time: string;
  isDoctor: boolean;
}

interface Conversation {
  doctor: string;
  lastMessage: string;
  time: string;
  unread: number;
  messages: Message[];
}

const STORAGE_KEY = "chat_conversations";

const SEED: Conversation[] = [
  {
    doctor: "Dr. Rajesh Sharma",
    lastMessage: "Your test results look good. Let's schedule a follow-up next week.",
    time: "2 hours ago",
    unread: 1,
    messages: [
      { id: 1, text: "Hello, I've reviewed your recent blood work.", sender: "Dr. Rajesh Sharma", time: "3 hours ago", isDoctor: true },
      { id: 2, text: "Your test results look good. Let's schedule a follow-up next week.", sender: "Dr. Rajesh Sharma", time: "2 hours ago", isDoctor: true },
    ],
  },
  {
    doctor: "Dr. Priya Patel",
    lastMessage: "Please take the prescribed medication twice daily.",
    time: "1 day ago",
    unread: 0,
    messages: [
      { id: 1, text: "Thank you for your visit today.", sender: "Dr. Priya Patel", time: "1 day ago", isDoctor: true },
      { id: 2, text: "Please take the prescribed medication twice daily.", sender: "Dr. Priya Patel", time: "1 day ago", isDoctor: true },
    ],
  },
  {
    doctor: "Dr. Arjun Singh",
    lastMessage: "Thank you for sharing the symptoms. I'll review and get back to you.",
    time: "3 days ago",
    unread: 0,
    messages: [
      { id: 1, text: "I've been experiencing some headaches lately.", sender: "You", time: "3 days ago", isDoctor: false },
      { id: 2, text: "Thank you for sharing the symptoms. I'll review and get back to you.", sender: "Dr. Arjun Singh", time: "3 days ago", isDoctor: true },
    ],
  },
];

function loadConversations(): Conversation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Conversation[];
  } catch {
    // corrupt or unreadable storage falls back to the seed
  }
  return SEED;
}

function currentUserName(): string {
  if (localStorage.getItem("open_as_guest") === "true") return "Guest";
  try {
    const profile = localStorage.getItem("userProfile");
    if (profile) {
      const parsed = JSON.parse(profile);
      if (parsed?.username) return parsed.username as string;
    }
  } catch {
    // fall through to the default
  }
  return "You";
}

/**
 * Scripted acknowledgement so the thread behaves like a conversation without a
 * backend. Deliberately limited to logistics — nothing here is medical advice.
 */
function acknowledgement(text: string): string {
  const t = text.toLowerCase();
  if (/appointment|book|schedule|slot|reschedul/.test(t)) {
    return "Noted. You can also pick a slot on the Appointments page and I'll confirm it from my side.";
  }
  if (/report|result|test|blood|scan|x-?ray/.test(t)) {
    return "Thanks — I'll pull up your latest reports and come back to you on this.";
  }
  if (/thank|thanks|ok|okay|got it/.test(t)) {
    return "Anytime. Message me here if anything else comes up.";
  }
  return "Thanks for your message. I'll go through it and reply during clinic hours.";
}

const Chat = () => {
  const [selectedConversation, setSelectedConversation] = useState(0);
  const [newMessage, setNewMessage] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>(loadConversations);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  }, [conversations]);

  // Keep the newest message in view, including the scripted reply.
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConversation, conversations]);

  const openConversation = (index: number) => {
    setSelectedConversation(index);
    setConversations((prev) =>
      prev.map((c, i) => (i === index ? { ...c, unread: 0 } : c))
    );
  };

  const appendMessage = (index: number, message: Omit<Message, "id">) => {
    setConversations((prev) =>
      prev.map((c, i) => {
        if (i !== index) return c;
        const id = c.messages.length ? c.messages[c.messages.length - 1].id + 1 : 1;
        return {
          ...c,
          messages: [...c.messages, { ...message, id }],
          lastMessage: message.text,
          time: message.time,
        };
      })
    );
  };

  const handleSendMessage = () => {
    const text = newMessage.trim();
    if (!text) return;

    const index = selectedConversation;
    appendMessage(index, {
      text,
      sender: currentUserName(),
      time: "Just now",
      isDoctor: false,
    });
    setNewMessage("");

    const doctor = conversations[index].doctor;
    window.setTimeout(() => {
      appendMessage(index, {
        text: acknowledgement(text),
        sender: doctor,
        time: "Just now",
        isDoctor: true,
      });
    }, 900);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const active = conversations[selectedConversation];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-1">Messages</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Demo inbox — replies are automated and stored on this device.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Conversations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {conversations.map((conv, index) => (
                  <button
                    key={conv.doctor}
                    type="button"
                    onClick={() => openConversation(index)}
                    className={`w-full text-left p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 ${
                      selectedConversation === index ? "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium">{conv.doctor}</p>
                      {conv.unread > 0 && (
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{conv.lastMessage}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{conv.time}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="flex flex-col h-[32rem]">
            <CardHeader className="shrink-0">
              <CardTitle className="flex items-center">
                <MessageCircle className="h-5 w-5 mr-2" />
                {active.doctor}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col flex-1 min-h-0">
              <div className="flex-1 space-y-3 mb-4 overflow-y-auto pr-1">
                {active.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-3 rounded-lg max-w-xs ${
                      message.isDoctor ? "bg-gray-100 dark:bg-gray-800" : "bg-blue-100 dark:bg-blue-900 ml-auto"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {message.sender} - {message.time}
                    </p>
                  </div>
                ))}
                <div ref={endRef} />
              </div>
              <div className="flex space-x-2 shrink-0">
                <Input
                  placeholder="Type your message..."
                  aria-label="Message"
                  className="flex-1"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <Button size="icon" aria-label="Send message" onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Chat;
