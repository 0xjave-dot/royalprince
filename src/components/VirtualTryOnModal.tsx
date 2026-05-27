import React, { useState } from 'react';
import { Product } from '../types';
import { useAppState } from '../lib/StateContext';
import { STATIC_PRODUCTS } from '../lib/seed';
import { X, Upload, ArrowRight, ShoppingBag, Eye, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VirtualTryOnModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProduct?: Product;
}

const DEFAULT_MODELS = [
  { id: 'm1', name: 'Sade (Lagos)', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop' },
  { id: 'm2', name: 'Nneka (Enugu)', url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&auto=format&fit=crop' },
  { id: 'm3', name: 'Tayo (Ibiza)', url: 'https://images.unsplash.com/photo-1507152832244-10d45a7e3a93?w=600&auto=format&fit=crop' },
  { id: 'm4', name: 'Amina (Abuja)', url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop' },
];

export default function VirtualTryOnModal({ isOpen, onClose, initialProduct }: VirtualTryOnModalProps) {
  const { addToCart, wishlist, toggleWishlist } = useAppState();
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(initialProduct || STATIC_PRODUCTS[0]);
  const [personImage, setPersonImage] = useState<string>(DEFAULT_MODELS[0].url);
  const [customImageLoaded, setCustomImageLoaded] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  // Generation status
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const steps = [
    "Ruby Stylist AI is analyzing physical curves & contours...",
    "Preserving skin tone & background lighting balances...",
    "Stitching luxury fabrics over shoulders & sleeves...",
    "Refining photorealistic Nigerian boutique presentation...",
  ];

  // Rotate loading text messages
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % steps.length);
      }, 3500);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert("Please upload a valid JPEG/PNG fashion portrait.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPersonImage(e.target.result as string);
        setCustomImageLoaded(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleGenerateTryOn = async () => {
    if (!selectedProduct) return;
    setLoading(true);
    setErrorMsg(null);
    setResultImage(null);

    try {
      // Helper function to convert URL/Base64 image to raw Base64 string for API transfer
      const getBase64Image = async (imgSource: string): Promise<string> => {
        if (imgSource.startsWith('data:image')) {
          return imgSource;
        }
        // If it is an Unsplash URL, load via proxy fetch to convert to Base64
        const response = await fetch(imgSource);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      };

      const base64Person = await getBase64Image(personImage);
      const base64Clothing = await getBase64Image(selectedProduct.mainImage);

      const res = await fetch('/api/tryon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personImage: base64Person,
          clothingImage: base64Clothing
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "The model took too long to stitch this outfit. Please try again in a few moments!");
      }

      setResultImage(data.imageUrl);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to generate try-on. Check that the images are clear and well lit.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10" id="virtual-tryon-stage">
      {/* Absolute dark screen shield */}
      <div className="absolute inset-0 bg-nearblack/85 backdrop-blur-md cursor-pointer" onClick={onClose} />
      
      {/* Modal Stage card */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-5xl bg-cream border border-gold/20 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Header toolbar */}
        <div className="p-5 border-b border-burgundy/10 flex justify-between items-center bg-cream/80 backdrop-blur">
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-xl tracking-widest uppercase font-bold text-burgundy">
              Ruby Virtual Dress Cabinet
            </h2>
            <span className="hidden md:inline bg-burgundy/10 text-burgundy font-sans text-[10px] font-black tracking-widest px-2.5 py-1 rounded">A.I. BETA</span>
          </div>
          <button onClick={onClose} className="p-2 text-nearblack/60 hover:text-burgundy cursor-pointer" id="btn-close-tryon-modal">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Dynamic Splits */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* LEFT SPLIT: Sourcing details */}
          <div className="flex flex-col gap-6">
            
            {/* Step 1: Select model or upload */}
            <div>
              <h3 className="font-sans text-xs tracking-widest uppercase font-black text-burgundy mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-burgundy text-white flex items-center justify-center font-mono text-xs">1</span>
                Sade, Nneka, or Upload Your Photo
              </h3>
              
              <div className="grid grid-cols-4 gap-2 mb-4">
                {DEFAULT_MODELS.map((m) => (
                  <button 
                    key={m.id}
                    onClick={() => {
                      setPersonImage(m.url);
                      setCustomImageLoaded(false);
                      setResultImage(null);
                    }}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer outline-none transition ${
                      personImage === m.url && !customImageLoaded ? 'border-burgundy' : 'border-black/5 hover:border-gold/50'
                    }`}
                  >
                    <img src={m.url} alt={m.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-x-0 bottom-0 bg-nearblack/60 text-white font-sans text-[8px] uppercase tracking-wider py-1 text-center">
                      {m.name.split(' ')[0]}
                    </div>
                  </button>
                ))}
              </div>

              {/* Drag and drop zone */}
              <div 
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-4 text-center transition flex flex-col items-center justify-center gap-2 cursor-pointer ${
                  dragActive ? 'border-burgundy bg-burgundy/5' : 'border-burgundy/15 hover:border-burgundy/40'
                } ${customImageLoaded ? 'bg-burgundy/5 border-burgundy' : ''}`}
              >
                <input 
                  type="file" 
                  id="upld-tryon-file"
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <label htmlFor="upld-tryon-file" className="text-center w-full block cursor-pointer">
                  <Upload className="w-6 h-6 text-burgundy mx-auto mb-2" />
                  <p className="font-sans text-[11px] font-bold text-burgundy uppercase tracking-wider">
                    {customImageLoaded ? 'PERSON PORTRAIT LOCKED' : 'OR DRAG & DROP YOUR PHOTO'}
                  </p>
                  <p className="text-[9px] text-nearblack/50 mt-1 uppercase">Best results: straight-facing view portrait</p>
                </label>
              </div>
            </div>

            {/* Step 2: Select fitting item */}
            <div>
              <h3 className="font-sans text-xs tracking-widest uppercase font-black text-burgundy mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-burgundy text-white flex items-center justify-center font-mono text-xs">2</span>
                Choose Garment to Drape
              </h3>

              <div className="flex gap-4 items-center p-3 bg-white border border-burgundy/10 rounded-xl">
                {selectedProduct ? (
                  <>
                    <img 
                      src={selectedProduct.mainImage} 
                      alt={selectedProduct.name}
                      className="w-14 h-18 object-cover rounded shadow border"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1">
                      <p className="font-sans text-xs uppercase tracking-widest text-burgundy font-black">ACTIVE ITEM</p>
                      <p className="font-serif text-base font-bold text-nearblack">{selectedProduct.name}</p>
                      <p className="font-mono text-xs text-gold mt-1 font-bold">₦{selectedProduct.price.toLocaleString()}</p>
                    </div>
                  </>
                ) : (
                  <p className="font-serif text-sm italic text-nearblack/40">Select a garment first.</p>
                )}

                <button 
                  onClick={() => {
                    // Quick cycle logic through default pieces
                    const curIdx = selectedProduct ? STATIC_PRODUCTS.findIndex(p => p.id === selectedProduct.id) : 0;
                    const nextIdx = (curIdx + 1) % STATIC_PRODUCTS.length;
                    setSelectedProduct(STATIC_PRODUCTS[nextIdx]);
                    setResultImage(null);
                  }}
                  className="px-3 py-1.5 border border-burgundy/15 hover:border-burgundy text-[9px] font-sans font-bold tracking-widest uppercase rounded cursor-pointer transition"
                >
                  NEXT CLOTHES
                </button>
              </div>
            </div>

            {/* Trigger Button */}
            <button 
              onClick={handleGenerateTryOn}
              disabled={loading}
              id="btn-trigger-ai-stitch"
              className="mt-2 w-full bg-burgundy hover:bg-nearblack disabled:bg-burgundy/40 text-white font-sans text-xs uppercase tracking-widest py-3.5 rounded-lg font-black flex items-center justify-center gap-2 shadow-lg cursor-pointer transition"
            >
              {loading ? (
                <span>AI DRESS CABINET ACTIVE...</span>
              ) : (
                <>
                  STITCH APPAREL OVER MODEL
                </>
              )}
            </button>
          </div>

          {/* RIGHT SPLIT: Rendering canvas display */}
          <div className="flex flex-col items-center justify-center border border-burgundy/10 bg-cream/40 rounded-2xl p-6 min-h-[350px] relative">
            <AnimatePresence mode="wait">
              {loading ? (
                // Display beautiful detailed loaders
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center text-center p-8 w-full"
                >
                  {/* Rotating visual elements */}
                  <div className="w-20 h-20 rounded-full border-4 border-burgundy/10 border-t-gold animate-spin mb-6 flex items-center justify-center shadow-inner">
                  </div>
                  <h4 className="font-serif text-lg text-burgundy font-bold animate-pulse">Bespoke Fabric Realization</h4>
                  <p className="text-xs text-nearblack/60 mt-3 max-w-[280px] leading-relaxed italic uppercase font-mono tracking-wider h-12">
                    {steps[loadingStep]}
                  </p>
                </motion.div>
              ) : errorMsg ? (
                // Error screen with helpful instruction
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center p-6 flex flex-col items-center gap-4"
                >
                  <X className="w-12 h-12 text-red-600 border border-red-200 bg-red-50 p-2.5 rounded-full" />
                  <p className="font-serif text-base text-burgundy font-bold">Stitching Cabinet Delayed</p>
                  <p className="text-xs text-nearblack/60 max-w-xs">{errorMsg}</p>
                  <button 
                    onClick={handleGenerateTryOn}
                    className="px-4 py-2 bg-burgundy text-white font-sans text-xs tracking-widest uppercase font-bold rounded cursor-pointer hover:bg-burgundy/80 transition"
                  >
                    RETRY DRAPE
                  </button>
                </motion.div>
              ) : resultImage ? (
                // Super showstopper generated image with interactive 3D comparison flip!
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full flex flex-col items-center gap-4 animate-fade-in"
                >
                  {/* Perspective Stage container */}
                  <div 
                    className="relative w-full max-w-[280px] aspect-[3/4] cursor-pointer"
                    onClick={() => setIsFlipped(!isFlipped)}
                    style={{ perspective: "1000px" }}
                    title="Click to Flip Card in 3D"
                  >
                    <div 
                      className="relative w-full h-full transition-transform duration-700 select-none"
                      style={{
                        transformStyle: "preserve-3d",
                        transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)"
                      }}
                    >
                      {/* FRONT FACE: AI Render */}
                      <div 
                        className="absolute inset-0 w-full h-full rounded-xl overflow-hidden shadow-2xl border border-gold/20 flex flex-col bg-surface"
                        style={{ backfaceVisibility: "hidden" }}
                      >
                        <img 
                          src={resultImage} 
                          alt="AI try-on result" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-3 left-3 bg-burgundy text-gold text-[8px] font-sans font-black tracking-widest uppercase px-2 py-1 rounded shadow-md z-10 font-bold">
                          STITCHED BY AI
                        </div>
                        <div className="absolute bottom-3 right-3 bg-nearblack/80 backdrop-blur-xs text-gold text-[8px] font-sans font-medium tracking-[0.15em] uppercase px-2 py-1 rounded shadow-sm z-10 flex items-center gap-1">
                          TAP TO REVERT ↺
                        </div>
                      </div>

                      {/* BACK FACE: Original model */}
                      <div 
                        className="absolute inset-0 w-full h-full rounded-xl overflow-hidden shadow-2xl border border-nearblack/10 flex flex-col bg-surface"
                        style={{ 
                          backfaceVisibility: "hidden",
                          transform: "rotateY(180deg)"
                        }}
                      >
                        <img 
                          src={personImage} 
                          alt="Original starting photo" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-3 left-3 bg-nearblack text-gold text-[8px] font-sans font-black tracking-widest uppercase px-2 py-1 rounded shadow-md z-10 font-bold">
                          ORIGINAL CANVAS
                        </div>
                        <div className="absolute bottom-3 right-3 bg-burgundy/90 backdrop-blur-xs text-white text-[8px] font-sans font-medium tracking-[0.15em] uppercase px-2 py-1 rounded shadow-sm z-10 flex items-center gap-1">
                          TAP TO CHOOSE SHIFT ↺
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-2 text-center mt-1">
                    <h4 className="font-serif text-base text-nearblack font-bold">
                      {isFlipped ? "Compare Initial Look" : "Perfect Bespoke Drape"}
                    </h4>
                    <p className="font-sans text-[10px] text-nearblack/50 tracking-wider uppercase font-medium">
                      {isFlipped ? "Swipe/Click container again to view styled gown" : "Click image above to spin & view before/after"}
                    </p>
                    <div className="flex gap-2.5 mt-3">
                      <button 
                        onClick={() => {
                          if (selectedProduct) {
                            addToCart(selectedProduct, 'M');
                            onClose();
                          }
                        }}
                        className="bg-burgundy hover:bg-nearblack text-white font-sans text-[11px] uppercase tracking-widest font-black px-6 py-3 rounded-lg flex items-center gap-2 transition hover:scale-102 cursor-pointer shadow-md"
                        id="btn-tryon-add-to-bag"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        ADD FIT TO BAG
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                // Initial prompt state
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center flex flex-col items-center gap-4 p-8"
                >
                  <div className="w-14 h-14 rounded-full bg-burgundy/5 flex items-center justify-center">
                  </div>
                  <p className="font-serif text-lg text-burgundy font-bold">Drape Yourself in Fine Silks</p>
                  <p className="text-xs text-nearblack/60 max-w-[250px] leading-relaxed">
                    Choose Sade or Amina, align your favorite Fab Ruby suit or dress, and let our fashion neural net stitch it onto them instantly.
                  </p>
                  <div className="flex items-center gap-4 justify-center mt-2">
                    <div className="flex flex-col items-center gap-0.5">
                      <img src={personImage} className="w-8 h-8 rounded-full object-cover border" referrerPolicy="no-referrer" />
                      <span className="text-[8px] font-mono text-nearblack/50">MODEL</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-burgundy" />
                    {selectedProduct && (
                      <div className="flex flex-col items-center gap-0.5">
                        <img src={selectedProduct.mainImage} className="w-8 h-8 rounded-full object-cover border" referrerPolicy="no-referrer" />
                        <span className="text-[8px] font-mono text-nearblack/50">GARMENT</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
