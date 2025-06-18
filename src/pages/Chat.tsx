
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Layout from "@/components/Layout";

interface Message {
  id: number;
  text: string;
  sender: string;
  time: string;
  isDoctor: boolean;
}

const Chat = () => {
  const [selectedConversation, setSelectedConversation] = useState(0);
  const [newMessage, setNewMessage] = useState("");
  const [conversations, setConversations] = useState([
    {
      doctor: "Dr. Rajesh Sharma",
      lastMessage: "Your test results look good. Let's schedule a follow-up next week.",
      time: "2 hours ago",
      unread: 1,
      messages: [
        { id: 1, text: "Hello Tushar, I've reviewed your recent blood work.", sender: "Dr. Rajesh Sharma", time: "3 hours ago", isDoctor: true },
        { id: 2, text: "Your test results look good. Let's schedule a follow-up next week.", sender: "Dr. Rajesh Sharma", time: "2 hours ago", isDoctor: true }
      ]
    },
    {
      doctor: "Dr. Priya Patel",
      lastMessage: "Please take the prescribed medication twice daily.",
      time: "1 day ago", 
      unread: 0,
      messages: [
        { id: 1, text: "Thank you for your visit today.", sender: "Dr. Priya Patel", time: "1 day ago", isDoctor: true },
        { id: 2, text: "Please take the prescribed medication twice daily.", sender: "Dr. Priya Patel", time: "1 day ago", isDoctor: true }
      ]
    },
    {
      doctor: "Dr. Arjun Singh",
      lastMessage: "Thank you for sharing the symptoms. I'll review and get back to you.",
      time: "3 days ago",
      unread: 0,
      messages: [
        { id: 1, text: "I've been experiencing some headaches lately.", sender: "Tushar Mishra", time: "3 days ago", isDoctor: false },
        { id: 2, text: "Thank you for sharing the symptoms. I'll review and get back to you.", sender: "Dr. Arjun Singh", time: "3 days ago", isDoctor: true }
      ]
    }
  ]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const newMsg: Message = {
      id: conversations[selectedConversation].messages.length + 1,
      text: newMessage,
      sender: "Tushar Mishra",
      time: "Just now",
      isDoctor: false
    };

    const updatedConversations = [...conversations];
    updatedConversations[selectedConversation].messages.push(newMsg);
    updatedConversations[selectedConversation].lastMessage = newMessage;
    updatedConversations[selectedConversation].time = "Just now";

    setConversations(updatedConversations);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Conversations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {conversations.map((conv, index) => (
                    <div 
                      key={index} 
                      className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${selectedConversation === index ? 'bg-blue-50 border-blue-200' : ''}`}
                      onClick={() => setSelectedConversation(index)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium">{conv.doctor}</p>
                        {conv.unread > 0 && (
                          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                            {conv.unread}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
                      <p className="text-xs text-gray-400 mt-1">{conv.time}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Card className="h-96">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  {conversations[selectedConversation].doctor}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col h-full">
                <div className="flex-1 space-y-3 mb-4 overflow-y-auto">
                  {conversations[selectedConversation].messages.map((message) => (
                    <div key={message.id} className={`${message.isDoctor ? 'bg-gray-100' : 'bg-blue-100 ml-auto max-w-xs'} p-3 rounded-lg`}>
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs text-gray-500 mt-1">{message.sender} - {message.time}</p>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Input 
                    placeholder="Type your message..." 
                    className="flex-1"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <Button size="icon" onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;
