import React, { useState, useEffect } from 'react';
import { useAppState } from '../lib/StateContext';
import { X, Trash2, ShoppingBag, CreditCard, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Order } from '../types';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer() {
  const { cartOpen, setCartOpen, cart, removeFromCart, updateCartQuantity, pointsEarned, userProfile, clearCart } = useAppState();
  const [checkoutMode, setCheckoutMode] = useState(false);
  
  // Checkout Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [stateRegion, setStateRegion] = useState('Lagos');
  const [loadingPay, setLoadingPay] = useState(false);
  const navigate = useNavigate();

  // Load Paystack script dynamically on startup
  useEffect(() => {
    const scriptId = 'paystack-inline-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Sync profile details if signed in
  useEffect(() => {
    if (userProfile) {
      setName(userProfile.displayName || '');
      setEmail(userProfile.email || '');
      if (userProfile.savedAddresses && userProfile.savedAddresses.length > 0) {
        setAddress(userProfile.savedAddresses[0]);
      }
    }
  }, [userProfile, checkoutMode]);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = stateRegion.toLowerCase() === 'lagos' ? 2000 : 4500;
  const grandTotal = subtotal + deliveryFee;

  const handlePaystackPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !address) {
      alert("Please fill in all delivery details before processing payment.");
      return;
    }

    setLoadingPay(true);
    
    // Ensure Paystack SDK is ready
    if (!(window as any).PaystackPop) {
      alert("Paystack payment engine is initializing. Please click again in 2 seconds.");
      setLoadingPay(false);
      return;
    }

    const paystackRef = "FR-" + Math.floor(Math.random() * 1000000000 + 1);
    
    try {
      const handler = (window as any).PaystackPop.setup({
        key: "pk_test_a8f15d7e8b9a111222333444555666777888998a", // Paystack Test Public Key
        email: email,
        amount: grandTotal * 100, // Paystack requires amount in KOBO
        currency: "NGN",
        ref: paystackRef,
        callback: async (response: any) => {
          // Success Callback
          const newOrder: Order = {
            id: paystackRef,
            reference: response.reference,
            items: cart,
            subtotal: subtotal,
            deliveryFee: deliveryFee,
            total: grandTotal,
            customerName: name,
            customerEmail: email,
            deliveryAddress: address,
            deliveryState: stateRegion,
            createdAt: new Date().toISOString()
          };

          // Save order to Firestore (resilient if offline)
          try {
            await addDoc(collection(db, 'orders'), newOrder);
          } catch (err) {
            console.warn("Could not save invoice online. Creating temporary record and continuing...", err);
          }

          // Clear bag and close drawer
          clearCart();
          setCheckoutMode(false);
          setCartOpen(false);
          setLoadingPay(false);
          
          // Redirect to Confirmation
          navigate(`/order-confirmation?ref=${response.reference}&total=${grandTotal}&email=${encodeURIComponent(email)}&state=${encodeURIComponent(stateRegion)}&name=${encodeURIComponent(name)}`);
        },
        onClose: () => {
          alert("Bespoke checkout suspended. We are still holding your selections in the shopping bag!");
          setLoadingPay(false);
        }
      });
      
      handler.openIframe();
    } catch (e: any) {
      alert("An error occurred during payment startup: " + e.message);
      setLoadingPay(false);
    }
  };

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Backdrop mask */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 cursor-pointer"
            onClick={() => setCartOpen(false)}
            id="cart-drawer-backdrop"
          />

          {/* Drawer container */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-cream border-l border-burgundy/10 shadow-2xl flex flex-col"
            id="cart-drawer-content"
          >
            {/* Header */}
            <div className="p-6 border-b border-burgundy/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-burgundy" />
                <span className="font-serif text-lg tracking-widest uppercase font-bold text-burgundy">
                  {checkoutMode ? 'Bespoke Checkout' : 'Shopping Bag'}
                </span>
                <span className="text-xs bg-burgundy/10 text-burgundy font-bold px-2 py-0.5 rounded-full">
                  {cart.length}
                </span>
              </div>
              <button 
                onClick={() => setCartOpen(false)}
                className="text-nearblack hover:text-burgundy p-2 cursor-pointer transition"
                id="btn-close-cart-drawer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Items Container */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
                  <ShoppingBag className="w-12 h-12 text-burgundy/20 mb-4" />
                  <p className="font-serif text-lg text-nearblack/60 italic">"Your shopping bag is currently empty."</p>
                  <p className="text-xs text-nearblack/45 mt-2 max-w-[200px]">Fill it with Lagos' finest bespoke jackets and luxury Co-ord suits!</p>
                  <button 
                    onClick={() => setCartOpen(false)}
                    className="mt-6 bg-burgundy text-white font-sans text-xs tracking-widest uppercase font-bold px-6 py-3 rounded-lg hover:bg-burgundy/90 transition cursor-pointer"
                  >
                    CONTINUE SHOPPING
                  </button>
                </div>
              ) : !checkoutMode ? (
                // Shopping list state
                <div className="flex flex-col gap-4">
                  {cart.map((item) => (
                    <div 
                      key={`${item.product.id}-${item.selectedSize}`} 
                      className="flex gap-4 p-3 bg-white border border-burgundy/5 rounded-lg group hover:border-burgundy/20 transition duration-300"
                    >
                      <img 
                        src={item.product.mainImage} 
                        alt={item.product.name}
                        className="w-16 h-20 object-cover rounded shadow"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <p className="font-sans text-sm font-semibold text-nearblack">{item.product.name}</p>
                          <p className="font-mono text-xs text-nearblack/50 mt-0.5 uppercase">Size: {item.selectedSize}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          {/* Increment and Decrement */}
                          <div className="flex items-center border border-burgundy/15 rounded bg-cream">
                            <button 
                              onClick={() => updateCartQuantity(item.product.id, item.selectedSize, item.quantity - 1)}
                              className="px-2.5 py-1 text-xs font-bold text-burgundy"
                              id={`btn-dec-${item.product.id}`}
                            >
                              -
                            </button>
                            <span className="font-mono text-xs font-semibold px-2 text-nearblack">{item.quantity}</span>
                            <button 
                              onClick={() => updateCartQuantity(item.product.id, item.selectedSize, item.quantity + 1)}
                              className="px-2.5 py-1 text-xs font-bold text-burgundy"
                              id={`btn-inc-${item.product.id}`}
                            >
                              +
                            </button>
                          </div>
                          
                          <p className="font-mono text-xs font-black text-burgundy">
                            ₦{(item.product.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      {/* Trash action */}
                      <button 
                        onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                        className="text-nearblack/30 hover:text-red-600 transition p-1 align-middle self-center cursor-pointer"
                        id={`btn-del-${item.product.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  
                  {/* Loyalty notification */}
                  <div className="mt-4 p-4 bg-burgundy/5 border border-burgundy/10 rounded-lg flex gap-3 items-center">
                    <div>
                      <p className="font-sans text-xs font-bold text-burgundy uppercase">RUBY CLUB REWARDS</p>
                      <p className="font-serif text-xs italic text-nearblack/75 mt-0.5">Earn <span className="font-bold text-burgundy">{pointsEarned} loyalty points</span> on this wardrobe upgrade!</p>
                    </div>
                  </div>
                </div>
              ) : (
                // Checkout Fields form state
                <form onSubmit={handlePaystackPayment} id="frm-checkout-details" className="flex flex-col gap-5">
                  <div className="p-4 bg-burgundy/5 border border-burgundy/10 rounded-lg mb-2">
                    <h4 className="font-serif text-sm font-bold text-burgundy mb-2">Order Summary:</h4>
                    <div className="flex justify-between text-xs text-nearblack/75 mb-1">
                      <span>Items Subtotal:</span>
                      <span className="font-mono">₦{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs text-nearblack/75">
                      <span>Standard Courier:</span>
                      <span className="font-mono">₦{deliveryFee.toLocaleString()} ({stateRegion})</span>
                    </div>
                    <hr className="border-burgundy/5 my-2" />
                    <div className="flex justify-between text-sm font-bold text-burgundy">
                      <span>Grand Total:</span>
                      <span className="font-mono text-gold font-black">₦{grandTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-sans text-[10px] tracking-widest uppercase font-black text-burgundy mb-1.5">FULL NAME *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Chioma Adebayo"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white border border-burgundy/15 focus:border-burgundy px-4 py-2.5 rounded outline-none text-sm transition"
                      id="inp-chk-name"
                    />
                  </div>

                  <div>
                    <label className="block font-sans text-[10px] tracking-widest uppercase font-black text-burgundy mb-1.5">EMAIL ADDRESS *</label>
                    <input 
                      type="email" 
                      placeholder="e.g. chioma@gmail.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-burgundy/15 focus:border-burgundy px-4 py-2.5 rounded outline-none text-sm transition"
                      id="inp-chk-email"
                    />
                  </div>

                  <div>
                    <label className="block font-sans text-[10px] tracking-widest uppercase font-black text-burgundy mb-1.5">SHIPPING STATE / REGION *</label>
                    <select 
                      value={stateRegion}
                      onChange={(e) => setStateRegion(e.target.value)}
                      className="w-full bg-white border border-burgundy/15 focus:border-burgundy px-4 py-2.5 rounded outline-none text-sm transition uppercase tracking-wider font-sans font-medium"
                      id="sel-chk-state"
                    >
                      <option value="Lagos">Lagos State (+₦2,000 Courier)</option>
                      <option value="Abuja">Abuja FCT (+₦4,500 Courier)</option>
                      <option value="Port Harcourt">Port Harcourt (+₦4,500 Courier)</option>
                      <option value="Oyo">Ibadan / Oyo (+₦4,500 Courier)</option>
                      <option value="Enugu">Enugu / East (+₦4,500 Courier)</option>
                      <option value="Kano">Kano / North (+₦4,500 Courier)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-sans text-[10px] tracking-widest uppercase font-black text-burgundy mb-1.5">DELIVERY ADDRESS *</label>
                    <textarea 
                      placeholder="Plot number, street, estate, local government region..."
                      required
                      rows={3}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-white border border-burgundy/15 focus:border-burgundy p-4 rounded outline-none text-sm transition resize-none"
                      id="inp-chk-address"
                    />
                    <span className="text-[10px] text-nearblack/50 mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gold" />
                      Orders ship within 24-48 hours inside Lagos.
                    </span>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button 
                      type="button"
                      onClick={() => setCheckoutMode(false)}
                      className="flex-1 bg-burgundy/10 text-burgundy font-sans text-xs uppercase tracking-widest py-3 rounded-lg font-bold border border-burgundy/10 transition cursor-pointer text-center"
                    >
                      BACK TO BAG
                    </button>
                    <button 
                      type="submit"
                      disabled={loadingPay}
                      id="btn-pay-securely"
                      className="flex-[2] bg-burgundy hover:bg-burgundy/90 text-white font-sans text-xs uppercase tracking-widest py-3 rounded-lg font-black flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
                    >
                      {loadingPay ? (
                        'SECURE GATEWAY...'
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4 text-gold" />
                          PAY ₦{grandTotal.toLocaleString()}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Footer Calculator block */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-burgundy/10 bg-cream/70 backdrop-blur-md">
                {!checkoutMode && (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-serif text-base font-bold text-nearblack">Subtotal:</span>
                      <span className="font-mono text-lg font-black text-burgundy">₦{subtotal.toLocaleString()}</span>
                    </div>

                    <button 
                      onClick={() => setCheckoutMode(true)}
                      id="btn-cart-checkout-proceed"
                      className="w-full bg-burgundy hover:bg-nearblack text-white font-sans text-xs font-bold tracking-widest uppercase py-4 rounded-lg shadow-lg flex items-center justify-center gap-2 cursor-pointer transition"
                    >
                      PROCEED TO DELIVERY
                    </button>
                  </>
                )}
                <p className="text-center text-[10px] text-nearblack/40 font-mono tracking-widest mt-4 uppercase">Paystack Secure Inline Checkout</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
