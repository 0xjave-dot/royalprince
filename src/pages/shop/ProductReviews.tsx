import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import { PageHeader } from "../../components/layout/PageHeader";
import { BackButton } from "../../components/layout/BackButton";
import { products } from "../../data/products";
import { initialReviews } from "../../data/reviews";
import { useSettings } from "../../context/SettingsContext";

export default function ProductReviews() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { account } = useSettings();

  // Load product
  const product = useMemo(() => {
    return products.find((p) => p.id === id);
  }, [id]);

  const allReviews = useMemo(() => {
    return [...initialReviews, ...account.reviews.items];
  }, [account.reviews.items]);

  const productReviews = useMemo(() => {
    return allReviews.filter((r) => r.productId === id);
  }, [id, allReviews]);

  if (!product) {
    return (
      <div className="p-5 text-center">
        <h3 className="title-md">Product Not Found</h3>
        <button onClick={() => navigate("/")} className="btn-primary mt-4">
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col bg-white animate-fade-up-enter min-h-screen relative pb-20">
      <PageHeader title="Customer Reviews" left={<BackButton />} />

      <div className="scroll-content pad p-5">
        {/* Rating Tally Block */}
        <div className="text-center bg-gray/50 rounded-card p-6 border border-[#f0f0f0] mb-6">
          <div className="text-[52px] font-display font-extrabold tracking-tight leading-none text-dark">
            {product.rating}
          </div>
          <div className="flex justify-center gap-0.5 text-[#FFB800] my-2 select-none">
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
          </div>
          <p className="font-sans text-[13px] text-gray2 font-medium">
            Based on {productReviews.length} reviews
          </p>
        </div>

        {/* Reviews List */}
        <h3 className="font-display font-bold text-sm text-dark mb-4">
          Review Feed ({productReviews.length})
        </h3>

        {productReviews.length > 0 ? (
          <div className="space-y-4">
            {productReviews.map((rev) => (
              <div
                key={rev.id}
                className="review-card bg-gray hover:bg-gray/80 transition-colors p-4 rounded-card border border-[#f0f0f0]"
              >
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-display font-bold text-[14px] text-dark">{rev.userName}</span>
                  <span className="font-sans text-xs text-gray2">{rev.timeAgo}</span>
                </div>
                <div className="flex gap-0.5 text-[#FFB800] mb-2 select-none">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating ? "fill-current" : "text-[#ddd]"
                      }`}
                    />
                  ))}
                </div>
                <p className="font-sans text-[13px] leading-relaxed text-[#555]">{rev.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center bg-gray/30 rounded-card border border-[#eaeaea]">
            <p className="font-sans text-sm text-gray2">No reviews yet for this product.</p>
          </div>
        )}
      </div>

      {/* Floating CTA button pointing directly to write review screen */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] bg-white border-t border-black/10 p-4 z-[100] shadow-[0_-2px_10px_rgba(0,0,0,0.04)]">
        <button
          onClick={() => navigate(`/orders/${id}/review`)}
          className="btn-primary w-full h-12 rounded-std bg-blue text-white font-display font-bold text-sm active:scale-95 transition-all text-center flex items-center justify-center cursor-pointer"
        >
          Write a Review
        </button>
      </div>
    </div>
  );
}
