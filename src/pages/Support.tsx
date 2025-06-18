
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { HelpCircle, Phone, Mail, MessageSquare, Send, X } from "lucide-react";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";

const Support = () => {
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: "Hello! How can I help you today?", sender: "support", timestamp: new Date() }
  ]);
  const [chatInput, setChatInput] = useState("");
  const { toast } = useToast();

  const supportOptions = [
    {
      title: "Call Support",
      description: "Speak with our support team",
      icon: Phone,
      action: "Call Now",
      handler: () => {
        // Open phone dialer
        window.location.href = "tel:+1-800-SUPPORT";
        toast({
          title: "Opening Phone Dialer",
          description: "Calling +1-800-SUPPORT",
        });
      }
    },
    {
      title: "Email Support", 
      description: "Send us an email",
      icon: Mail,
      action: "Send Email",
      handler: () => {
        // Open email client
        const subject = "Support Request";
        const body = "Please describe your issue here...";
        window.location.href = `mailto:support@healthapp.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        toast({
          title: "Opening Email Client",
          description: "Composing email to support@healthapp.com",
        });
      }
    },
    {
      title: "Live Chat",
      description: "Chat with support agent",
      icon: MessageSquare, 
      action: "Start Chat",
      handler: () => {
        setShowChat(true);
        toast({
          title: "Chat Started",
          description: "A support agent will be with you shortly",
        });
      }
    }
  ];

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const newMessage = {
      id: chatMessages.length + 1,
      text: chatInput,
      sender: "user",
      timestamp: new Date()
    };

    setChatMessages([...chatMessages, newMessage]);
    setChatInput("");

    // Simulate support response
    setTimeout(() => {
      const supportResponse = {
        id: chatMessages.length + 2,
        text: "Thank you for your message. A support agent will review your request and respond shortly.",
        sender: "support",
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, supportResponse]);
    }, 1000);
  };

  const faqs = [
    {
      question: "How do I book an appointment?",
      answer: "You can book an appointment through the Appointments section or by calling our support line."
    },
    {
      question: "How can I access my test results?",
      answer: "Test results are available in the Tests section once they are processed by your doctor."
    },
    {
      question: "Can I reschedule my appointment?",
      answer: "Yes, you can reschedule appointments up to 24 hours before the scheduled time."
    }
  ];

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Support Center</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {supportOptions.map((option, index) => (
            <Card key={index}>
              <CardContent className="p-6 text-center">
                <option.icon className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="font-medium mb-2">{option.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{option.description}</p>
                <Button variant="outline" className="w-full" onClick={option.handler}>
                  {option.action}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <HelpCircle className="h-5 w-5 mr-2" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0">
                  <h4 className="font-medium mb-2">{faq.question}</h4>
                  <p className="text-sm text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Live Chat Modal */}
        {showChat && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md h-96 flex flex-col">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-semibold">Live Support Chat</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowChat(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto space-y-2">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                        message.sender === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t flex gap-2">
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button onClick={handleSendMessage} size="sm">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Support;
