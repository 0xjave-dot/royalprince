import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-nearblack text-cream pt-16 pb-24 md:pb-12 px-6 md:px-16 mt-20 font-sans border-t border-gold/15">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        
        {/* Brand Column */}
        <div className="md:col-span-1.5 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <img 
              src="https://i.ibb.co/G4BYJN9h/Gemini-Generated-Image-j1yadkj1yadkj1ya-removebg-preview.png" 
              alt="Fab Ruby Logo" 
              className="w-11 h-11 object-contain"
              referrerPolicy="no-referrer"
            />
            <span className="font-logo text-xl tracking-[0.05em] font-bold uppercase text-brightred">Fab Ruby</span>
          </div>
          <p className="text-cream/60 text-sm leading-relaxed max-w-sm">
            Lagos' finest curated runway couture, tailored coord sets, luxury statement blazers, and custom dresses. Empowering modern African women with unmatched wardrobe statements.
          </p>
          <div className="flex items-center gap-2 text-gold mt-2">
            <span className="text-xs uppercase tracking-widest font-bold">Proudly Lagosian, Globally Elegant</span>
          </div>
        </div>

        {/* Links Column */}
        <div>
          <h4 className="font-serif text-base tracking-widest uppercase font-semibold text-gold mb-6">EXPLORE</h4>
          <ul className="flex flex-col gap-3 text-sm text-cream/70">
            <li><Link to="/shop" className="hover:text-gold transition">All Collections</Link></li>
            <li><Link to="/shop?category=Dresses" className="hover:text-gold transition">Luxury Dresses</Link></li>
            <li><Link to="/shop?category=Co-ords" className="hover:text-gold transition">Co-ord Matches</Link></li>
            <li><Link to="/shop?category=Blazers" className="hover:text-gold transition">Power Blazers</Link></li>
            <li><Link to="/shop?category=Bags" className="hover:text-gold transition">Designer Bags</Link></li>
          </ul>
        </div>

        {/* Boutiques */}
        <div>
          <h4 className="font-serif text-base tracking-widest uppercase font-semibold text-gold mb-6">EXPERIENCE</h4>
          <p className="text-sm text-cream/80 leading-relaxed mb-4 font-semibold">Flagship Boutique:</p>
          <p className="text-sm text-cream/60 leading-relaxed mb-4">
            Plot 12, Gbagada Phase II,<br />Gbagada, Lagos
          </p>
          <p className="text-sm text-cream/80 leading-relaxed mb-4 font-semibold">VIP Styling Suite:</p>
          <p className="text-sm text-cream/60 leading-relaxed">
            Victoria Island, Lagos<br />
            <span className="text-gold font-sans font-bold text-xs uppercase tracking-widest block mt-1">(By Appointment Only)</span>
          </p>
        </div>

        {/* Newsletter Column */}
        <div>
          <h4 className="font-serif text-base tracking-widest uppercase font-semibold text-gold mb-6">Bespoke Club</h4>
          <p className="text-sm text-cream/60 leading-relaxed mb-4">
            Subscribe to receive private previews, invitations to Lagos trunk shows, and custom styling updates.
          </p>
          {subscribed ? (
            <div className="p-4 bg-burgundy/25 border border-gold/30 rounded text-gold text-xs font-serif font-bold animate-pulse">
              ✓ Welcome to the inner circle. Your private invite is en route.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <input 
                type="email"
                placeholder="YOUR EMAIL..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border border-white/20 focus:border-gold px-4 py-2.5 outline-none rounded text-white text-xs placeholder:text-white/40 tracking-wider transition uppercase"
                required
                id="inp-newsletter-email"
              />
              <button 
                type="submit"
                id="btn-newsletter-submit"
                className="bg-burgundy hover:bg-burgundy/80 text-white font-sans text-xs tracking-widest uppercase font-bold py-2.5 rounded transition cursor-pointer"
              >
                JOIN THE CLUB
              </button>
            </form>
          )}
          <div className="mt-6 text-cream/40 text-xs flex flex-col gap-1">
            <p>Hotline: +234 818 000 0000</p>
            <p>Support: boutique@fabruby.com</p>
          </div>
        </div>

      </div>

      <hr className="border-white/10 my-8" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-xs text-cream/40">
        <p>© 2026 Fab Ruby Clothiers. Registered in Nigeria.</p>
        <div className="flex gap-6 mt-4 md:mt-0 font-sans tracking-wide">
          <span className="hover:text-gold cursor-pointer">PRIVACY POLICY</span>
          <span className="hover:text-gold cursor-pointer">TERMS OF SERVICE</span>
          <span className="hover:text-gold cursor-pointer">PAYSTACK SECURED PAYMENT</span>
        </div>
      </div>
    </footer>
  );
}
