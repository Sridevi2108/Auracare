import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, MessageSquare, X, Minimize, Maximize, MicIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const welcomeMessage: Message = {
  id: 0,
  text: "Hi there! I'm AuraCare, your mental wellness companion. How are you feeling today?",
  sender: 'bot',
  timestamp: new Date(),
};

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message to chat
    const userMessage: Message = {
      id: messages.length,
      text: input.trim(),
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const payload = {
      sender: "user",
      message: userMessage.text,
    };

    try {
      const response = await fetch("http://localhost:5005/webhooks/rest/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.length > 0) {
        const botMessages = data.map((msg, index) => ({
          id: messages.length + index + 1,
          text: msg.text || "I'm here to assist you!",
          sender: "bot",
          timestamp: new Date(),
        }));
        setMessages(prev => [...prev, ...botMessages]);
      }
    } catch (error) {
      console.error("Error connecting to Rasa:", error);
      setMessages(prev => [
        ...prev,
        { id: messages.length + 1, text: "Error: Unable to connect to the server.", sender: "bot", timestamp: new Date() },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <Button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-plum hover:bg-plum-light animate-pulse-glow z-50 shadow-lg"
        >
          <MessageSquare className="w-6 h-6 text-white" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card 
          className={`fixed z-50 shadow-2xl transition-all duration-300 ${
            isExpanded 
              ? 'top-4 right-4 left-4 bottom-4 md:left-auto md:bottom-4 md:right-4 md:top-4 md:w-[700px] md:h-[90vh]' 
              : 'bottom-6 right-6 w-[350px] md:w-[400px] h-[500px]'
          }`}
        >
          <CardHeader className="bg-gradient-to-r from-plum to-plum-light text-white rounded-t-lg p-4 flex flex-row items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-3 border-2 border-white">
                <AvatarImage src="/placeholder.svg" alt="AuraCare" />
                <AvatarFallback className="bg-primary-foreground text-primary">AC</AvatarFallback>
              </Avatar>
              <CardTitle className="text-lg">AuraCare Assistant</CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              <Button onClick={toggleExpand} className="h-8 w-8 text-white hover:bg-white/20">
                {isExpanded ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>
              <Button onClick={toggleChat} className="h-8 w-8 text-white hover:bg-white/20">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <ScrollArea className="flex-1 p-4 h-[calc(100%-135px)]">
            <div className="space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-2xl p-3 ${
                      message.sender === 'user' 
                        ? 'bg-plum text-white ml-auto' 
                        : 'bg-muted border border-border'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-2xl p-3 bg-muted border border-border">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 rounded-full bg-plum animate-bounce"></div>
                      <div className="h-2 w-2 rounded-full bg-plum animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="h-2 w-2 rounded-full bg-plum animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <CardFooter className="border-t p-4">
            <div className="flex w-full items-center space-x-2">
              <Input ref={inputRef} placeholder="Type a message..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} className="flex-1 input-glow" />
              <Button className="bg-plum hover:bg-plum-light" onClick={handleSendMessage}><Send className="h-4 w-4" /></Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </>
  );
};

export default ChatBot;
