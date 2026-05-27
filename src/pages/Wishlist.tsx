import React from 'react';
import { useAppState } from '../lib/StateContext';
import { STATIC_PRODUCTS } from '../lib/seed';
import ProductCard from '../components/ProductCard';
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Wishlist() {
  const { wishlist, addToCart } = useAppState();

  const savedProducts = STATIC_PRODUCTS.filter((p) => wishlist.includes(p.id));

  const handleAddAllToCart = () => {
    for (const p of savedProducts) {
      addToCart(p, p.sizes[0]);
    }
  };

  return (
    <div className="min-h-screen bg-cream py-16 px-6 md:px-12 max-w-7xl mx-auto w-full" id="wishlist-page-root">
      
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-16 gap-4 border-b border-burgundy/10 pb-8">
        <div>
          <span className="font-mono text-xs font-black tracking-widest text-burgundy uppercase mb-2 block">YOUR CURATED DRAWER</span>
          <h1 className="font-serif text-3xl md:text-5xl tracking-tight text-nearblack font-light uppercase">
            Bespoke Wishlist
          </h1>
        </div>
        {savedProducts.length > 0 && (
          <button 
            onClick={handleAddAllToCart}
            id="btn-wishlist-add-all-to-bag"
            className="bg-burgundy hover:bg-nearblack text-white font-sans text-xs uppercase font-black tracking-widest py-3 px-6 rounded-lg shadow cursor-pointer transition"
          >
            ADD ALL TO SHOPPING BAG
          </button>
        )}
      </div>

      {savedProducts.length === 0 ? (
        <div className="text-center py-20 bg-white border border-burgundy/10 rounded-2xl p-8 flex flex-col items-center justify-center">
          <Heart className="w-12 h-12 text-burgundy/20 animate-pulse mb-4" />
          <p className="font-serif text-xl italic text-nearblack/70">"You have not saved any garments to your drawer yet."</p>
          <p className="text-xs text-nearblack/40 mt-1 uppercase max-w-sm">Drape looks in our virtual dress closet or browse silhouettes in the style shop.</p>
          <Link 
            to="/shop"
            className="mt-6 bg-burgundy hover:bg-nearblack text-white font-sans text-xs font-black tracking-widest uppercase px-6 py-3 rounded-xl shadow cursor-pointer transition inline-block text-center"
          >
            EXPLORE THE STYLE CLOSET
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {savedProducts.map((p) => (
            <div key={p.id}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
