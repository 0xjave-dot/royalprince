import { type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { Product } from "../../data/products";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../lib/auth";
import { useToast } from "../../context/ToastContext";
import { useSettings } from "../../context/SettingsContext";

interface ProductCardProps {
  product: Product;
  widthClass?: string;
}

export function ProductCard({ product, widthClass }: ProductCardProps) {
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { pushToast } = useToast();
  const { currencySymbol } = useSettings();

  const isLiked = isInWishlist(product.id);

  const { user } = useAuth();
  const handleLike = (e: MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      pushToast("Please sign in to add items to your wishlist.");
      navigate("/login");
      return;
    }
    toggleWishlist(product.id);
    if (!isLiked) {
      pushToast("Added to wishlist ❤️");
    } else {
      pushToast("Removed from wishlist");
    }
  };

  // Calculate discount percentage if there's a compareAtPrice
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className={`card product-card cursor-pointer relative overflow-hidden bg-white rounded-[22px] border border-black/5 p-2.5 hover:border-blue/20 transition-all duration-300 hover:shadow-[0_10px_24px_-8px_rgba(0,0,0,0.14)] active:scale-[0.98] ${
        widthClass ?? "w-full"
      }`}
      id={`product-card-${product.id}`}
    >
      {/* Product Image Stage with Bento rounded standard borders */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#f8f8f8] rounded-[18px] flex items-center justify-center">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.08]"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Floating Wishlist Button with Backdrop blur style */}
        <button
          onClick={handleLike}
          className="like absolute top-2.5 right-2.5 w-9 h-9 rounded-full bg-white/88 backdrop-blur-md flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:bg-white transition-all scale-100 hover:scale-110 active:scale-95 focus:outline-none cursor-pointer"
        >
          <Heart
            className={`w-[15px] h-[15px] transition-colors ${
              isLiked ? "fill-pink text-pink" : "text-[#c7c7c7]"
            }`}
          />
        </button>

        {/* Optional Discount Stamp */}
        {hasDiscount && (
        <div className="discount-badge absolute top-2.5 left-2.5 bg-gradient-to-br from-pink to-red text-white font-display text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm">
          -{discountPercent}%
        </div>
      )}
      </div>

      {/* Pricing / Meta Details */}
      <div className="pt-2 px-1 pb-1 w-full flex flex-col justify-between text-left">
        <div className="text-[13px] font-bold text-[#202020] line-clamp-1 mb-0.5 font-sans leading-tight">
          {product.name}
        </div>
        <div className="text-[11px] text-[#555] font-medium leading-none mb-1.5">{product.category}</div>
        <div className="flex items-baseline gap-[6px] mt-auto">
          <span className="text-sm font-extrabold text-blue font-display">
            {currencySymbol}
            {product.price.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="font-display text-[10.5px] text-[#c7c7c7] line-through font-medium">
              {currencySymbol}
              {product.compareAtPrice!.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
