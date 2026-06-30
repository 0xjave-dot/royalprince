import { useState, useEffect, useRef } from "react";
import type { FormEvent } from "react";
import { Send, Bot } from "lucide-react";
import { PageHeader } from "../../components/layout/PageHeader";
import { BackButton } from "../../components/layout/BackButton";
import { useSettings } from "../../context/SettingsContext";
import { brandName, brandWhatsappUrl } from "../../data/brand";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
}

export default function ChatSupport() {
  const { userProfile } = useSettings();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    window.location.replace(brandWhatsappUrl);
  }, []);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Timed bot auto-response
    setTimeout(() => {
      setIsTyping(false);
      const botMsg: Message = {
        id: `msg-${Date.now()}-reply`,
        sender: "bot",
        text: "Thank you for the update! 💖 One of our elite fashion consultants is checking inventory metrics and will respond shortly via push channels.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col bg-white animate-fade-up-enter min-h-screen relative pb-[76px]">
      <PageHeader title={`${brandName} Chat`} left={<BackButton />} />

      {/* Message Feed container */}
      <div className="flex-1 px-5 py-4 overflow-y-auto space-y-4">
        {messages.map((m) => {
          const isBot = m.sender === "bot";
          return (
            <div
              key={m.id}
              className={`flex items-end gap-2.5 ${isBot ? "justify-start" : "justify-end"} animate-fade-up-enter`}
            >
              {isBot && (
                <div className="w-[30px] h-[30px] rounded-full bg-blue-light/50 flex items-center justify-center flex-shrink-0 border border-blue/10">
                  <Bot className="w-4 h-4 text-blue" />
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-[16px] px-4 py-3 text-left shadow-subtle ${
                  isBot
                    ? "bg-gray rounded-bl-none text-dark border border-black/5"
                    : "bg-blue rounded-br-none text-white font-medium"
                }`}
              >
                <p className="font-sans text-[13.5px] leading-relaxed">{m.text}</p>
                <span
                  className={`block text-[10px] mt-1.5 text-right font-sans ${
                    isBot ? "text-gray2" : "text-white/75"
                  }`}
                >
                  {m.time}
                </span>
              </div>

              {!isBot && (
                <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-blue to-pink flex items-center justify-center font-display font-bold text-xs text-white border border-white flex-shrink-0">
                  {userProfile.name[0] || "S"}
                </div>
              )}
            </div>
          );
        })}

        {/* Typing Bubble */}
        {isTyping && (
          <div className="flex items-center gap-2.5 justify-start">
            <div className="w-[30px] h-[30px] rounded-full bg-blue-light/50 flex items-center justify-center flex-shrink-0 border border-blue/10">
              <Bot className="w-4 h-4 text-blue" />
            </div>
            <div className="bg-gray border border-black/5 rounded-[16px] rounded-bl-none px-4 py-3 flex gap-1 select-none">
              <div className="w-1.5 h-1.5 bg-gray2 rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-gray2 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 bg-gray2 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message input tray */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] bg-white border-t border-black/10 py-3 px-4 z-[99] flex items-center gap-2.5">
        <form onSubmit={handleSendMessage} className="flex-grow flex items-center gap-2">
          <input
            className="flex-grow h-11 bg-gray rounded-full px-5 font-sans text-sm text-dark outline-none border border-transparent focus:border-blue/15"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            className="w-11 h-11 rounded-full bg-blue text-white flex items-center justify-center cursor-pointer active:scale-90 hover:opacity-90 transition-transform focus:outline-none"
          >
            <Send className="w-4.5 h-4.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
