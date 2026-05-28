import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Smartphone, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

export default function OrderConfirmation() {
  const [searchParams] = useSearchParams();
  const ref = searchParams.get('ref') || 'FR-' + Math.floor(Math.random() * 100000);
  const total = Number(searchParams.get('total')) || 45000;
  const name = searchParams.get('name') || 'Valued Patron';
  const email = searchParams.get('email') || '';
  const stateVal = searchParams.get('state') || 'Lagos';

  const dateStr = new Date().toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const whatsappMessage = `Hi Fab Ruby Clothiers! I just completed checkout for my fashion order on reference: ${ref}. My name is ${name}. Please check the payment and details. Let's coordinate delivery. Thank you!`;
  const whatsappUrl = `https://wa.me/2348028598695?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="min-h-screen bg-cream py-20 px-6 md:px-12 max-w-2xl mx-auto w-full flex flex-col items-center justify-center text-center" id="confirmation-page-root">
      
      {/* Visual Icon card badge */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-20 h-20 rounded-full bg-burgundy flex items-center justify-center border-4 border-gold shadow-lg mb-8"
      >
        <CheckCircle className="w-10 h-10 text-gold animate-bounce" />
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-serif text-3xl md:text-5xl font-light text-nearblack uppercase leading-tight mb-4"
      >
        Bespoke Order <br />
        <span className="italic font-normal text-gold">Confirmed.</span>
      </motion.h1>

      <p className="text-sm text-nearblack/75 max-w-md leading-relaxed mb-8">
        Thank you, <span className="font-bold text-burgundy">{name}</span>. Your billing has been successfully processed by Paystack secure inline. A private notification has been sent to your email database {email}.
      </p>

      {/* DETAILED RECEIPT DETAILS */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full bg-white border border-burgundy/10 rounded-2xl p-6 text-left space-y-4 shadow-xl mb-8"
      >
        <div className="flex justify-between items-baseline border-b border-burgundy/5 pb-3">
          <span className="font-sans text-[10px] tracking-widest font-black uppercase text-burgundy">ORDER REGISTER REF:</span>
          <span className="font-mono text-sm font-black text-burgundy">{ref}</span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs font-sans leading-relaxed text-nearblack/75">
          <div>
            <span className="text-[9px] tracking-wider text-nearblack/40 font-mono uppercase block">TRANSACTION DATE</span>
            <span className="font-bold">{dateStr}</span>
          </div>
          <div>
            <span className="text-[9px] tracking-wider text-nearblack/40 font-mono uppercase block">SHIPPING REGION</span>
            <span className="font-bold uppercase">{stateVal}</span>
          </div>
          <div>
            <span className="text-[9px] tracking-wider text-nearblack/40 font-mono uppercase block">SHIPPING COURIER</span>
            <span className="font-bold">Fab Ruby Logistics</span>
          </div>
          <div>
            <span className="text-[9px] tracking-wider text-nearblack/40 font-mono uppercase block">GRAND TOTAL</span>
            <span className="font-mono font-bold text-burgundy">₦{total.toLocaleString()}</span>
          </div>
        </div>

        <div className="p-3 bg-burgundy/5 border border-burgundy/15 rounded-lg text-[10px] text-nearblack/60 italic font-serif">
          * Courier orders processed inside Lagos ship within 24-48 hours. Please keep your coordinate reference handy.
        </div>
      </motion.div>

      {/* WHATSAPP TRIGGER */}
      <div className="flex flex-col gap-3 w-full max-w-sm">
        <a 
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          id="btn-whatsapp-confirm"
          className="bg-[#25D366] hover:bg-[#128C7E] text-white font-sans text-xs tracking-widest uppercase font-black py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:scale-101 transition duration-300"
        >
          <Smartphone className="w-5 h-5 text-white" />
          CONFIRM ORDER ON WHATSAPP
        </a>

        <Link 
          to="/shop"
          className="bg-burgundy hover:bg-nearblack text-white font-sans text-xs tracking-widest uppercase font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 border border-gold/15 transition duration-300"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> RETURN TO BOUTIQUE Archives
        </Link>
      </div>

    </div>
  );
}
