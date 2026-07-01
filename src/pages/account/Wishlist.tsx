import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { PageHeader } from "../../components/layout/PageHeader";
import { ProductCard } from "../../components/common/ProductCard";
import { EmptyState } from "../../components/common/EmptyState";
import { useWishlist } from "../../context/WishlistContext";
import { products } from "../../data/products";

export default function Wishlist() {
  const navigate = useNavigate();
  const { wishlist } = useWishlist();

  // Filter products by wishlist keys
  const likedProducts = useMemo(() => {
    return products.filter((p) => wishlist.includes(p.id));
  }, [wishlist]);

  return (
    <div className="flex-grow flex flex-col bg-white animate-fade-up-enter pb-10">
      <PageHeader
        title="Wishlist"
        right={
          <div className="relative p-1">
            <Heart className="w-5 h-5 text-blue" strokeWidth={2.2} />
            {likedProducts.length > 0 && (
              <span className="absolute -top-1 -right-1.5 bg-blue text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                {likedProducts.length}
              </span>
            )}
          </div>
        }
      />

      {/* Wishlist Main content */}
      <div className="p-5 flex-1 flex flex-col">
        {likedProducts.length > 0 ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs text-gray2 font-medium px-1 mb-2">
              <span>{likedProducts.length} items saved</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {likedProducts.map((prod) => (
                <div key={prod.id} className="flex">
                  <ProductCard product={prod} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-grow flex items-center justify-center py-10 animate-fade-up-enter">
            <EmptyState
              icon={<Heart className="h-7 w-7" strokeWidth={2.2} />}
              title="Your Wishlist is Empty"
              description="Heart items while exploring to keep track of your favorites.."
              actionText="Get back to shopping"
              onAction={() => navigate("/")}
            />
          </div>
        )}
      </div>
    </div>
  );
}
