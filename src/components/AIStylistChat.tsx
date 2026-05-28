import React, { useState, useEffect, useRef } from 'react';
import { useAppState } from '../lib/StateContext';
import { STATIC_PRODUCTS } from '../lib/seed';
import { Product } from '../types';
import { MessageSquare, Send, X, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  matchedProducts?: Product[];
}

export default function AIStylistChat() {
  const { addToCart, stylistOpen: isOpen, setStylistOpen: setIsOpen } = useAppState();
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('fab_ruby_stylist');
    return saved ? JSON.parse(saved) : [
      {
        role: 'assistant',
        content: "Oya fine girl, welcome to Fab Ruby Styling Lounge! I'm Ruby, your personal luxury fashion whisperer. I can style you for Lagos weddings, Lekki brunch assemblies, board meetings, or weekend getaways. What special look are we hunting for today, babe? Tell me your vibe!"
      }
    ];
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync stylist dialogue to local storage
  useEffect(() => {
    localStorage.setItem('fab_ruby_stylist', JSON.stringify(messages));
  }, [messages]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const parseRecommendations = (text: string): Product[] => {
    // Scan text to match product names from static inventory
    const matches: Product[] = [];
    const lowerText = text.toLowerCase();
    
    for (const p of STATIC_PRODUCTS) {
      if (lowerText.includes(p.name.toLowerCase())) {
        matches.push(p);
      }
    }
    return matches;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const chatHistory = messages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch('/api/stylist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: chatHistory,
          catalog: STATIC_PRODUCTS
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Stylist is taking a sip of champagne. Try checking back in 2 seconds!");
      }

      // Automatically scan and extract card objects
      const matched = parseRecommendations(data.text);

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.text,
        matchedProducts: matched.length > 0 ? matched : undefined
      }]);
    } catch (err: any) {
      console.warn(err);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Babe, I am having a minor fashion-sync issue with my servers! But trust me, you can never go wrong in our *Camel Blazer Set* or *Burgundy Power Set* while I sort this out. Try telling me your vibe again, let me see!" 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    localStorage.removeItem('fab_ruby_stylist');
    setMessages([
      {
        role: 'assistant',
        content: "Fresh wardrobe board initialized! What is are we styling you for today, babe? Spill the tea!"
      }
    ]);
  };

  return (
    <>
      {/* Aligned Floating Action Circles (WhatsApp & Ruby AI) */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3.5 items-center select-none" id="floating-actions-container">
        
        {/* 1. PULSING WHATSAPP FLOAT */}
        <div className="relative w-14 h-14 md:w-[72px] md:h-[72px]">
          {/* Sonar Ping Ring: radiates outward */}
          <div className="absolute inset-1.5 rounded-full bg-[#25D366]/25 pointer-events-none animate-ping duration-1000" />
          
          <a 
            href="https://wa.me/2348028598695?text=Hi%20Fab%20Ruby%20Clothiers!%20I%20am%20interested%20in%20connecting%20about%20your%20collection."
            target="_blank"
            rel="noopener noreferrer"
            id="btn-whatsapp-bubble"
            className="group relative w-14 h-14 md:w-[72px] md:h-[72px] rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 border-2 border-white/20 transition-all duration-300 cursor-pointer"
            title="Chat on WhatsApp"
          >
            {/* WhatsApp Premium SVG path */}
            <svg 
              className="w-7 h-7 md:w-9 md:h-9 fill-current" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12.004 2C6.48 2 2.001 6.477 2.001 12c0 1.892.525 3.66 1.438 5.17l-1.424 5.215 5.34-1.401c1.472.8 3.14 1.26 4.904 1.26 5.524 0 10.003-4.477 10.003-10S17.528 2 12.004 2zm5.72 13.568c-.244.685-1.2 1.265-1.638 1.309-.434.043-.966.195-2.923-.574-2.506-.985-4.104-3.535-4.228-3.702-.125-.166-1.018-1.352-1.018-2.578s.642-1.83.87-2.064c.228-.234.498-.292.664-.292.166 0 .332.003.477.01.15.007.354-.055.553.425.2.485.683 1.663.743 1.785.06.122.09.263.007.426-.08.163-.122.26-.245.405-.122.143-.254.32-.363.43-.122.122-.25.255-.107.498.143.243.636 1.045 1.37 1.7.945.84 1.742 1.1 2.005 1.222.26.126.41.104.563-.07.153-.175.664-.77.842-1.033.178-.263.356-.22.598-.13.243.088 1.543.727 1.808.857.264.13.44.195.503.305.064.11.064.636-.18 1.32z" />
            </svg>
            
            {/* Tooltip hovering */}
            <span className="absolute right-16 md:right-22 bg-nearblack text-white text-[9px] tracking-[0.2em] uppercase py-1.5 px-3 rounded shadow-md border border-gold/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none font-bold">
              WhatsApp Chat
            </span>
          </a>
        </div>

        {/* 2. RUBY STYLIST FLOAT */}
        <div className="relative w-14 h-14 md:w-[72px] md:h-[72px]">
          {/* Sonar Ping Ring: radiates outward */}
          <div className="absolute inset-1.5 rounded-full bg-burgundy/30 pointer-events-none animate-sonar-ping" />
          
          <button 
            onClick={() => setIsOpen(true)}
            id="btn-stylist-bubble"
            className="group relative w-14 h-14 md:w-[72px] md:h-[72px] select-none flex items-center justify-center active:scale-95 transition-all duration-300 cursor-pointer overflow-visible"
            title="Stylist Ruby"
          >
            <img 
              src="https://i.ibb.co/99TKMHkW/Gemini-Generated-Image-v4rgvmv4rgvmv4rg-removebg-preview.png"
              alt="Ruby Stylist Chat"
              className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(107,31,42,0.35)] transition duration-300 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            
            {/* Tooltip hovering */}
            <span className="absolute right-16 md:right-22 bg-nearblack text-white text-[9px] tracking-[0.2em] uppercase py-1.5 px-3 rounded shadow-md border border-gold/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none font-bold">
              Stylist Ruby
            </span>
          </button>
        </div>

      </div>

      {/* Floating sliding lounge */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop cover */}
            <div className="fixed inset-0 z-40 bg-black/45 cursor-pointer" onClick={() => setIsOpen(false)} />
            
            {/* Cabinet */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-cream border-l border-gold/15 shadow-2xl flex flex-col"
              id="stylist-lounge-drawer"
            >
              {/* Header block */}
              <div className="p-5 border-b border-gold/15 bg-burgundy text-cream flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-11 h-11 rounded-full bg-cream flex items-center justify-center overflow-hidden border border-gold/40">
                    <img 
                      src="https://i.ibb.co/99TKMHkW/Gemini-Generated-Image-v4rgvmv4rgvmv4rg-removebg-preview.png"
                      alt="Ruby Chat"
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h3 className="font-serif text-base uppercase tracking-widest font-bold text-gold">Ruby Stylist Suite</h3>
                    <p className="text-[10px] tracking-widest text-cream/75 uppercase leading-none mt-0.5">Bespoke Lagos Advisor</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 text-cream hover:text-gold cursor-pointer" id="btn-close-stylist">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Message scroll list */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-cream/50">
                {messages.map((m, idx) => (
                  <div 
                    key={idx} 
                    className={`flex flex-col gap-1.5 max-w-[85%] ${
                      m.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                    }`}
                  >
                    <div className={`p-4 rounded-xl text-sm leading-relaxed ${
                      m.role === 'user' 
                        ? 'bg-burgundy text-white rounded-br-none shadow-md' 
                        : 'bg-white border border-burgundy/15 text-nearblack rounded-bl-none shadow'
                    }`}>
                      {/* Markdown support specifically rendered as per guidelines */}
                      <div className="markdown-body">
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>
                    </div>

                    {/* Grounded Recommendation slider panel inside chat line */}
                    {m.matchedProducts && m.matchedProducts.length > 0 && (
                      <div className="w-full mt-2 space-y-2">
                        <div className="flex items-center gap-1 text-[10px] tracking-widest font-black text-gold uppercase">
                          <ShoppingBag className="w-3 h-3 text-gold" />
                          RUBY RECOMMENDS:
                        </div>
                        <div className="flex gap-2.5 overflow-x-auto pb-2 horizontal-scroll">
                          {m.matchedProducts.map((p) => (
                            <div 
                              key={p.id} 
                              className="shrink-0 w-36 bg-white border border-burgundy/5 rounded-lg p-2 flex flex-col justify-between shadow-sm"
                            >
                              <img src={p.mainImage} alt={p.name} className="w-full h-24 object-cover rounded" referrerPolicy="no-referrer" />
                              <div className="mt-1.5 flex flex-col">
                                <span className="font-sans text-[10px] font-bold text-nearblack truncate leading-tight">{p.name}</span>
                                <span className="font-mono text-[9px] text-burgundy font-black mt-0.5">₦{p.price.toLocaleString()}</span>
                              </div>
                              <button 
                                onClick={() => addToCart(p, 'M')}
                                className="mt-2 w-full bg-burgundy hover:bg-gold hover:text-burgundy text-[8px] font-sans font-black tracking-widest uppercase py-1.5 rounded text-white flex items-center justify-center gap-1 transition"
                              >
                                BAG IT
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {loading && (
                  <div className="flex flex-col gap-1.5 max-w-[85%] mr-auto items-start p-3 bg-white border border-burgundy/15 rounded-xl rounded-bl-none shadow animate-pulse">
                    <p className="text-xs text-burgundy font-black tracking-widest flex items-center gap-1 uppercase">
                      RUBY IS THINKING...
                    </p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input section */}
              <div className="p-4 border-t border-gold/15 bg-white">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Ask Ruby: 'wedding suit' or 'beach look'..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={loading}
                    className="flex-1 bg-cream/50 focus:bg-white border border-burgundy/10 focus:border-burgundy px-4 py-3 outline-none rounded-lg text-sm text-nearblack transition"
                    id="inp-stylist-message"
                  />
                  <button 
                    type="submit" 
                    id="btn-send-stylist"
                    className="p-3 bg-burgundy hover:bg-nearblack text-gold rounded-lg shadow cursor-pointer transition flex items-center justify-center shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
                <div className="flex justify-between items-center mt-3 px-1 text-[10px] text-nearblack/45">
                  <span className="uppercase font-mono tracking-widest text-[8px]">Curated advice powered by gemini</span>
                  <button onClick={clearChat} className="underline hover:text-burgundy cursor-pointer font-bold uppercase tracking-widest text-[8px]">Reset Board</button>
                </div>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
