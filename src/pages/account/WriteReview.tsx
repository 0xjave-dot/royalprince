import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import { PageHeader } from "../../components/layout/PageHeader";
import { BackButton } from "../../components/layout/BackButton";
import { products } from "../../data/products";
import { useSettings } from "../../context/SettingsContext";
import { useToast } from "../../context/ToastContext";
import { setUserAccountDoc } from "../../lib/userAccount";

export default function WriteReview() {
  const { id } = useParams(); // Product ID
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const { userProfile, firebaseUser, account } = useSettings();

  // Find associated product details
  const product = useMemo(() => {
    return products.find((p) => p.id === id);
  }, [id]);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      pushToast("Please draft comments before submitting");
      return;
    }

    if (!firebaseUser) {
      pushToast("Please sign in to submit a review");
      navigate("/login");
      return;
    }

    const newReview = {
      id: `rev-added-${Date.now()}`,
      productId: id || "",
      userName: userProfile.name || "Your name",
      rating,
      comment: comment.trim(),
      timeAgo: "Just now"
    };

    const nextReviews = [newReview, ...account.reviews.items];
    await setUserAccountDoc(firebaseUser.uid, {
      reviews: { items: nextReviews },
    });
    pushToast("Review logged! Thank you 🌟");
    navigate(`/orders/${id}/review/done`);
  };

  if (!product) {
    return (
      <div className="p-5 text-center flex flex-col justify-center items-center h-[50vh]">
        <h3 className="title-md font-display">Product Not Found</h3>
        <button onClick={() => navigate("/")} className="btn-primary mt-4">
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col bg-white animate-fade-up-enter min-h-screen pb-10">
      <PageHeader title="Write Review" left={<BackButton />} />

      <form onSubmit={handleSubmit} className="p-5 space-y-6 flex-1 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Product Header */}
          <div className="flex gap-4 p-4.5 bg-gray rounded-std border border-black/[0.03] select-none">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-16 h-20 rounded-std object-cover bg-gray border border-gray3/20 flex-shrink-0"
            />
            <div>
              <h4 className="font-display font-bold text-[15px] text-dark leading-tight line-clamp-2">
                {product.name}
              </h4>
              <p className="font-sans text-xs text-gray2 mt-1 uppercase tracking-tight">
                {product.category}
              </p>
            </div>
          </div>

          {/* Interactive Star Inputs */}
          <div className="text-center py-2.5">
            <p className="font-display font-semibold text-[14.5px] text-dark mb-3 select-none">
              How was your experience?
            </p>
            <div className="flex gap-2 justify-center select-none">
              {[1, 2, 3, 4, 5].map((starIdx) => {
                const filled = starIdx <= rating;
                return (
                  <button
                    key={starIdx}
                    type="button"
                    onClick={() => setRating(starIdx)}
                    className="p-1 hover:scale-115 active:scale-95 transition-transform focus:outline-none cursor-pointer"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        filled ? "fill-[#FFB800] text-[#FFB800]" : "text-[#ddd]"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comments inputs */}
          <div className="input-wrap text-left">
            <label className="input-label font-display font-semibold text-xs text-dark mb-1.5 block select-none">
              Your Review
            </label>
            <textarea
              className="input-field w-full min-h-[120px] bg-gray rounded-[12px] p-4 font-sans text-sm outline-none border border-transparent focus:border-blue/20 resize-none leading-relaxed"
              placeholder="Tell others what you think about this product's fit, fabric, material, and look..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-6">
          <button
            type="submit"
            className="btn-primary w-full h-[58px] bg-blue text-white rounded-std text-[15px] font-display font-extrabold shadow-std active:scale-[0.98] transition-transform flex items-center justify-center cursor-pointer focus:outline-none"
          >
            Submit Review
          </button>
        </div>
      </form>
    </div>
  );
}
