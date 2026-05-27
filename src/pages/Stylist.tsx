import React, { useState, useEffect, useRef } from 'react';
import { useAppState } from '../lib/StateContext';
import { STATIC_PRODUCTS } from '../lib/seed';
import { Product } from '../types';
import { MessageSquare, Send, ShoppingBag, ArrowRight, Trash2, Heart, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import VirtualTryOnModal from '../components/VirtualTryOnModal';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  matchedProducts?: Product[];
}

const PRESET_STYLES_PROMPTS = [
  { label: "Owanbe party dress sets", phrase: "I need an elegant outfit for a luxury Lagos wedding Owanbe. What do you recommend?" },
  { label: "Victoria Island Cocktails 🥂", phrase: "Suggest a tailored, classy look for evening drinks in a Victoria Island lounge." },
  { label: "Boardroom Power Blazer Suit 💼", phrase: "I want an ultra-confident, structured power blazer look for an executive board panel." },
  { label: "Lekki Brunch Sets 🌸", phrase: "Show me fluid, matching co-ord items perfect for a breezy weekend VIP brunch." }
];

export default function Stylist() {
  const { addToCart, wishlist, toggleWishlist } = useAppState();
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('fab_ruby_stylist');
    return saved ? JSON.parse(saved) : [
      {
        role: 'assistant',
        content: "Oya fine girl! Welcome to the premium Fab Ruby VIP Styling Lounge. I'm Ruby, your neural high-fashion advisor. Tell me what luxury occasion we are styling you for today... Is it an elite Ikoyi boardroom assembly, an executive Lekki weekend brunch, or a high-society luxury Owanbe wedding? Drop your custom vibe and let me build the perfect drape for you!"
      }
    ];
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // States for try on portal from chat recommendation items
  const [tryOnOpen, setTryOnOpen] = useState(false);
  const [tryOnProduct, setTryOnProduct] = useState<Product | null>(null);

  useEffect(() => {
    localStorage.setItem('fab_ruby_stylist', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const parseRecommendations = (text: string): Product[] => {
    const matches: Product[] = [];
    const lowerText = text.toLowerCase();
    for (const p of STATIC_PRODUCTS) {
      if (lowerText.includes(p.name.toLowerCase())) {
        matches.push(p);
      }
    }
    return matches;
  };

  const handleSendMessage = async (userMessageText: string) => {
    if (!userMessageText.trim() || loading) return;

    const userMsg = userMessageText.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch('/api/stylist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          history: history,
          catalog: STATIC_PRODUCTS
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Network error");
      }

      const matched = parseRecommendations(data.text);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.text,
        matchedProducts: matched.length > 0 ? matched : undefined
      }]);
    } catch (err) {
      console.warn(err);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Aww, darling! My digital wardrobe database is slightly congested at the moment. But trust me, you can never go wrong with our classic **Camel Blazer Set** or a gorgeous **Scarlet Wrap Dress**! Tell me what you think while I reconnect."
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const msg = input.trim();
    setInput('');
    handleSendMessage(msg);
  };

  const handleClearChat = () => {
    localStorage.removeItem('fab_ruby_stylist');
    setMessages([
      {
        role: 'assistant',
        content: "Styling archives refreshed! What luxury looks are we hunting for now, babe?"
      }
    ]);
  };

  const openTryOn = (product: Product) => {
    setTryOnProduct(product);
    setTryOnOpen(true);
  };

  const triggerAddToCart = (product: Product) => {
    addToCart(product, "M", 1);
  };

  return (
    <div className="min-h-screen bg-cream py-10 px-4 md:px-12 flex flex-col font-sans" id="vip-stylist-page">
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
        
        {/* Header Title Hero */}
        <div className="text-center mb-10 flex flex-col items-center">
          <span className="bg-nearblack text-gold text-[9px] font-mono font-black tracking-[0.25em] px-4 py-1.5 rounded-full mb-3 flex items-center gap-1.5 shadow">
            ELITE VIP ATELIER ASSISTANT
          </span>
          <h1 className="font-serif text-3xl md:text-5xl uppercase text-nearblack tracking-tight font-light leading-none">
            Ruby Couture Stylist
          </h1>
          <p className="font-sans text-[11px] text-nearblack/60 tracking-wider max-w-sm uppercase mt-2.5">
            Grounded in our active showroom stock. Talk to our neural designer to curate complete ensembles instantly.
          </p>
          <div className="w-12 h-[2px] bg-gold mt-3" />
        </div>

        {/* Workspace Layout Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch flex-1">
          
          {/* DIGITAL SHOWCASE MANNEQUIN (LEFT PANEL) */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-burgundy/10 shadow-xl flex flex-col justify-between">
            <div>
              <span className="font-mono text-[9px] font-black tracking-widest text-burgundy uppercase block mb-1">VIP ATELIER BOARD</span>
              <h3 className="font-serif text-xl text-nearblack uppercase font-bold tracking-wide">Lagos Wardrobe Dial</h3>
              
              <p className="text-xs text-nearblack/60 mt-3 leading-relaxed mb-6 block">
                Stuck choosing? Tap a curated prompt chip to load suggestions under a second. Our neural engine recommends matching blazers, coordinates, and accessories currently available in the Lagos flagship shop.
              </p>

              {/* Chips panel */}
              <div className="flex flex-col gap-3">
                <span className="font-mono text-[9px] font-bold text-nearblack/40 uppercase tracking-widest">TAP FOR INSTANT ANSWERS:</span>
                {PRESET_STYLES_PROMPTS.map((item, idx) => (
                  <button
                    key={idx}
                    disabled={loading}
                    onClick={() => handleSendMessage(item.phrase)}
                    className="w-full text-left bg-cream/70 hover:bg-burgundy hover:text-white px-4 py-3 rounded-xl border border-burgundy/5 text-xs font-sans tracking-wide font-semibold text-nearblack transition duration-200 cursor-pointer shadow-sm hover:translate-x-1"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear history option */}
            <div className="mt-8 border-t border-burgundy/5 pt-6 flex items-center justify-between">
              <div className="flex flex-col text-left">
                <span className="font-mono text-[8px] tracking-widest text-nearblack/40 uppercase">Dialogue memory</span>
                <span className="font-sans text-[11px] text-nearblack/60 font-semibold uppercase leading-none mt-1">Stitched by Ruby AI</span>
              </div>
              
              <button
                onClick={handleClearChat}
                className="font-sans text-[10px] uppercase font-black tracking-widest text-burgundy/80 hover:text-burgundy flex items-center gap-1.5 cursor-pointer bg-cream py-1.5 px-3 rounded border border-burgundy/5 hover:bg-neutral-100 transition"
                id="btn-stylist-clear"
                title="Clear current conversations archive"
              >
                <Trash2 className="w-3.5 h-3.5" /> Reset Board
              </button>
            </div>
          </div>

          {/* MESSAGES VIEWPORT PORTAL (RIGHT PANEL) */}
          <div className="lg:col-span-8 bg-surface/40 rounded-3xl border border-burgundy/5 shadow-inner p-4 md:p-6 flex flex-col h-[550px] md:h-[650px] overflow-hidden justify-between relative">
            
            {/* Ambient pattern */}
            <div className="absolute inset-0 bg-radial-gradient from-cream/20 to-transparent pointer-events-none" />

            {/* MESSAGE LIST WRAPPER */}
            <div className="flex-1 overflow-y-auto space-y-6 pr-2 mb-4 relative z-10" id="stylist-dialogue-port">
              {messages.map((message, index) => {
                const isUser = message.role === 'user';
                return (
                  <div key={index} className={`flex ${isUser ? 'justify-end' : 'justify-start'} ml-2`}>
                    <div className="max-w-[85%] flex flex-col gap-1.5">
                      
                      {/* Name tag */}
                      <span className={`font-mono text-[8px] tracking-widest uppercase font-black ${
                        isUser ? 'text-burgundy/60 text-right' : 'text-gold'
                      }`}>
                        {isUser ? 'YOU' : 'RUBY ATELIER'}
                      </span>

                      {/* Bubble frame */}
                      <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-md border ${
                        isUser 
                          ? 'bg-burgundy text-cream rounded-tr-none border-gold/10' 
                          : 'bg-white text-nearblack rounded-tl-none border-burgundy/5'
                      }`}>
                        <div className="markdown-body font-sans text-xs md:text-sm whitespace-pre-line leading-relaxed">
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                      </div>

                      {/* MATCHED RETAIL PRODUCTS DRAWER INLINE */}
                      {message.matchedProducts && message.matchedProducts.length > 0 && (
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3.5 animate-fade-in self-start w-full">
                          {message.matchedProducts.map((p) => (
                            <div 
                              key={p.id}
                              className="bg-white rounded-xl border border-gold/15 shadow-lg p-3 flex gap-3.5 items-center justify-between"
                            >
                              <div className="flex items-center gap-2.5">
                                <img 
                                  src={p.mainImage} 
                                  alt={p.name}
                                  className="w-10 h-14 object-cover rounded shadow border border-neutral-100"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="flex flex-col text-left">
                                  <span className="font-serif text-[11px] leading-tight font-bold text-nearblack">{p.name}</span>
                                  <span className="font-mono text-[9px] text-burgundy font-black mt-0.5">₦{p.price.toLocaleString()}</span>
                                  <span className="font-sans text-[8px] text-nearblack/40 uppercase tracking-widest mt-0.5">{p.category}</span>
                                </div>
                              </div>

                              <div className="flex flex-col gap-1.5 shrink-0">
                                <button
                                  onClick={() => openTryOn(p)}
                                  className="bg-nearblack hover:bg-neutral-800 text-white font-mono text-[7px] font-black tracking-widest uppercase p-1.5 rounded-md text-center transition shadow-sm"
                                >
                                  3D TRY ON
                                </button>
                                <button
                                  onClick={() => triggerAddToCart(p)}
                                  className="bg-burgundy hover:bg-gold hover:text-burgundy text-white font-sans text-[7px] font-black tracking-widest uppercase p-1.5 rounded-md text-center transition shadow-sm"
                                >
                                  ADD BAG
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                    </div>
                  </div>
                );
              })}

              {/* Waiting indicator */}
              {loading && (
                <div className="flex justify-start ml-2 items-center gap-2">
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[8px] tracking-widest text-gold uppercase font-black">RUBY ATELIER</span>
                    <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-burgundy/5 text-xs text-nearblack/50 italic flex items-center gap-2 shadow shadow-md">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-burgundy rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                        <span className="w-1.5 h-1.5 bg-burgundy rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <span className="w-1.5 h-1.5 bg-burgundy rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                      </div>
                      <span>Ruby is matching items with real high-fashion fabrics...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* MESSAGE CONTROL SUBMIT BAR */}
            <form onSubmit={handleSubmitForm} className="relative mt-auto z-10 flex gap-2 pt-4 border-t border-burgundy/5 bg-transparent">
              <input 
                type="text"
                placeholder="PROMPT RUBY: 'What matches our burgundy outfit for an Lagos dinner?'"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                className="flex-1 bg-white focus:bg-white text-nearblack outline-none border border-burgundy/10 focus:border-gold rounded-xl px-4 py-3 text-xs md:text-sm shadow-md transition placeholder:text-nearblack/40"
                id="stylist-input-field"
                required
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-burgundy hover:bg-gold disabled:bg-neutral-200 text-white disabled:text-neutral-400 hover:text-burgundy p-3.5 rounded-xl transition shadow-md flex items-center justify-center cursor-pointer shrink-0"
                id="btn-stylist-send"
                aria-label="Send design request"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>

        </div>

      </div>

      {tryOnOpen && tryOnProduct && (
        <VirtualTryOnModal 
          isOpen={tryOnOpen} 
          onClose={() => setTryOnOpen(false)} 
          initialProduct={tryOnProduct}
        />
      )}
    </div>
  );
}
