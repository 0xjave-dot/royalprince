import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Heart, ShoppingBag, Star, Share2, Plus, Minus, X, ChevronLeft, ChevronRight } from "lucide-react";
import { PageHeader } from "../../components/layout/PageHeader";
import { products } from "../../data/products";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useToast } from "../../context/ToastContext";
import { useSettings } from "../../context/SettingsContext";
import { DetailSkeleton } from "../../components/common/Skeleton";
import { brandName } from "../../data/brand";

function upsertMetaTag(selector: string, attrName: "property" | "name", attrValue: string, content: string) {
  let tag = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attrName, attrValue);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addItem, items: cartItems } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { pushToast } = useToast();
  const { currencySymbol } = useSettings();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [id]);

  // Load the product details
  const product = useMemo(() => {
    return products.find((p) => p.id === id);
  }, [id]);

  // Selected values
  const [selectedSize, setSelectedSize] = useState(() => {
    if (product) {
      return product.sizes.includes("S") ? "S" : product.sizes[0] || "";
    }
    return "";
  });

  const [selectedColor, setSelectedColor] = useState(() => {
    if (product) {
      return product.colors[0] || "";
    }
    return "";
  });

  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);

  const isLiked = product ? isInWishlist(product.id) : false;
  const isSharedPreview = new URLSearchParams(location.search).get("share") === "1";
  const pageShellClass = isSharedPreview
    ? "flex-1 flex flex-col bg-[radial-gradient(circle_at_top,_#f7fbff_0%,_#eef4fb_48%,_#e9eef6_100%)] animate-fade-up-enter min-h-screen relative pb-[86px]"
    : "flex-1 flex flex-col bg-white animate-fade-up-enter min-h-screen relative pb-[86px]";
  const contentShellClass = isSharedPreview
    ? "mx-auto w-full max-w-[860px] p-3 sm:p-4 md:p-5"
    : "p-5";

  useEffect(() => {
    setActiveImageIndex(0);
    setIsImageViewerOpen(false);
  }, [id]);

  useEffect(() => {
    if (!product) {
      return;
    }

    const previousTitle = document.title;
    const previousOgTitle = document.head.querySelector('meta[property="og:title"]')?.getAttribute("content") ?? "";
    const previousOgDescription = document.head.querySelector('meta[property="og:description"]')?.getAttribute("content") ?? "";
    const previousOgImage = document.head.querySelector('meta[property="og:image"]')?.getAttribute("content") ?? "";
    const previousTwitterTitle = document.head.querySelector('meta[name="twitter:title"]')?.getAttribute("content") ?? "";
    const previousTwitterDescription = document.head.querySelector('meta[name="twitter:description"]')?.getAttribute("content") ?? "";
    const previousTwitterImage = document.head.querySelector('meta[name="twitter:image"]')?.getAttribute("content") ?? "";

    document.title = `${product.name} | ${brandName}`;
    upsertMetaTag('meta[property="og:title"]', "property", "og:title", product.name);
    upsertMetaTag('meta[property="og:description"]', "property", "og:description", product.description);
    upsertMetaTag('meta[property="og:image"]', "property", "og:image", product.images[0]);
    upsertMetaTag('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    upsertMetaTag('meta[name="twitter:title"]', "name", "twitter:title", product.name);
    upsertMetaTag('meta[name="twitter:description"]', "name", "twitter:description", product.description);
    upsertMetaTag('meta[name="twitter:image"]', "name", "twitter:image", product.images[0]);

    return () => {
      document.title = previousTitle;
      upsertMetaTag('meta[property="og:title"]', "property", "og:title", previousOgTitle);
      upsertMetaTag('meta[property="og:description"]', "property", "og:description", previousOgDescription);
      upsertMetaTag('meta[property="og:image"]', "property", "og:image", previousOgImage);
      upsertMetaTag('meta[name="twitter:title"]', "name", "twitter:title", previousTwitterTitle);
      upsertMetaTag('meta[name="twitter:description"]', "name", "twitter:description", previousTwitterDescription);
      upsertMetaTag('meta[name="twitter:image"]', "name", "twitter:image", previousTwitterImage);
    };
  }, [product]);

  if (!product) {
    return (
      <div className="p-5 text-center flex flex-col justify-center items-center min-h-[50vh]">
        <h3 className="title-md font-display font-bold">Product Not Found</h3>
        <button onClick={() => navigate("/")} className="btn-primary mt-4">
          Go Home
        </button>
      </div>
    );
  }

  const handleLike = () => {
    toggleWishlist(product.id);
    if (!isLiked) {
      pushToast("Added to wishlist ❤️");
    } else {
      pushToast("Removed from wishlist");
    }
  };

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      size: selectedSize,
      color: selectedColor,
      qty: quantity
    });

    pushToast(`Added ${quantity}x to Bag! 🛍️`);
  };

  const handleShare = async () => {
    const productUrl = `${window.location.origin}/product/${product.id}?share=1`;
    const sharePayload = {
      title: product.name,
      text: `${productUrl}\n${product.name}\n${currencySymbol}${product.price.toFixed(2)}`,
      url: productUrl,
    };

    try {
      const imageResponse = await fetch(product.images[0], { mode: "cors" });
      const imageBlob = await imageResponse.blob();
      const mimeType = imageBlob.type || "image/jpeg";
      const extension = mimeType.split("/")[1] || "jpg";
      const shareFile = new File([imageBlob], `${product.id}.${extension}`, { type: mimeType });

      if (navigator.share && navigator.canShare?.({ files: [shareFile] })) {
        await navigator.share({
          ...sharePayload,
          files: [shareFile],
        });
        return;
      }
    } catch {
      // Fall back to the text-only share path below.
    }

    if (navigator.share) {
      navigator.share(sharePayload).catch(console.error);
      return;
    }

    try {
      await navigator.clipboard.writeText(`${productUrl}\n${product.name}\n${currencySymbol}${product.price.toFixed(2)}`);
      pushToast("Link copied to clipboard! 🔗");
    } catch {
      pushToast("Sharing is not available in this browser.");
    }
  };

  const galleryImages = product.images.length > 0 ? product.images : [product.images[0]];
  const activeImage = galleryImages[activeImageIndex] ?? galleryImages[0];
  const openImageViewer = () => setIsImageViewerOpen(true);
  const closeImageViewer = () => setIsImageViewerOpen(false);
  const stepImage = (direction: 1 | -1) => {
    setActiveImageIndex((current) => {
      const next = (current + direction + galleryImages.length) % galleryImages.length;
      return next;
    });
  };

  return (
    <div className={pageShellClass}>
      {/* Product Header */}
      <PageHeader
        title={isSharedPreview ? "Shared Preview" : "Product Detail"}
        left={
          <button
            onClick={() => navigate(-1)}
            className="font-display font-semibold text-[15px] text-dark hover:opacity-80 active:scale-95 transition-all py-1"
          >
            Back
          </button>
        }
        right={
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-1.5 bg-gray hover:bg-gray3/30 rounded-full focus:outline-none cursor-pointer"
            >
              <Share2 className="w-[18px] h-[18px] text-dark" />
            </button>
            <button
              onClick={handleLike}
              className="p-1.5 bg-gray hover:bg-gray3/30 rounded-full focus:outline-none cursor-pointer"
            >
              <Heart
                className={`w-[18px] h-[18px] ${
                  isLiked ? "fill-pink text-pink" : "text-[#aaa]"
                }`}
              />
            </button>
          </div>
        }
      />

      {/* Responsive Row Layout Container */}
      {isLoading ? (
        <DetailSkeleton />
      ) : (
        <div className={contentShellClass}>
          <div className={isSharedPreview ? "rounded-[30px] border border-black/5 bg-white/92 p-3 sm:p-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl" : ""}>
            {isSharedPreview && (
              <div className="mb-3 flex items-center justify-between gap-3 rounded-[22px] border border-blue/12 bg-gradient-to-r from-blue-light/35 to-white px-4 py-3">
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-2 rounded-full bg-blue/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.22em] text-blue">
                    Shared preview
                  </div>
                  <h2 className="mt-2 font-display text-[20px] font-black tracking-tight text-dark sm:text-[22px]">
                    {product.name}
                  </h2>
                  <p className="mt-1 max-w-[34rem] font-sans text-[12.5px] leading-relaxed text-gray2">
                    Tap through to view details, or share the link to let someone open the product with the right preview image.
                  </p>
                </div>
                <div className="hidden shrink-0 rounded-[18px] bg-white px-3 py-2 text-right shadow-sm sm:block">
                  <div className="font-display text-[10px] font-black uppercase tracking-[0.2em] text-gray2">
                    From
                  </div>
                  <div className="mt-0.5 font-display text-[13px] font-bold text-blue">
                    {brandName}
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col md:flex-row md:items-start md:gap-8">
              {/* Main image gallery card */}
              <div className="w-full md:w-[45%] space-y-3 flex-shrink-0">
              <div className="group relative aspect-[4/5] md:aspect-square bg-gray flex items-center justify-center max-h-[320px] md:max-h-[440px] overflow-hidden border border-black/5 rounded-[24px] shadow-subtle cursor-zoom-in">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300"
                onClick={openImageViewer}
              />
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <div className="absolute top-3 left-3 bg-gradient-to-l from-pink to-red text-white font-display text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
                  Sale Offer
                </div>
              )}
            </div>

            <div className="grid grid-cols-4 gap-2.5">
              {galleryImages.map((image, index) => (
                <button
                  key={`${product.id}-thumb-${index}`}
                  type="button"
                  onClick={() => setActiveImageIndex(index)}
                  className={`relative aspect-square overflow-hidden rounded-[14px] border transition-all cursor-pointer ${
                    activeImageIndex === index
                      ? "border-blue ring-2 ring-blue/15"
                      : "border-black/5 hover:border-blue/25"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
              </div>

              {/* Info & selectors column */}
              <div className="flex-grow flex flex-col justify-between space-y-5 pt-4 md:pt-0">
          {/* Title, rating, prices */}
          <div>
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <span className="tag tag-new inline-block bg-blue-light/40 text-blue font-display text-[10px] font-bold px-2 py-0.5 rounded-[12px] mb-2 uppercase">
                  {product.category} Collection
                </span>
                <h2 className="font-display font-black text-[22px] tracking-tight text-dark leading-tight mt-1">
                  {product.name}
                </h2>
              </div>
              <div className="text-right">
                <div className="price text-[22px] text-blue font-display">
                  {currencySymbol}
                  {product.price.toFixed(2)}
                </div>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <div className="font-display text-xs text-gray2 line-through mt-0.5">
                    {currencySymbol}
                    {product.compareAtPrice.toFixed(2)}
                  </div>
                )}
              </div>
            </div>

            {/* Star review redirect links */}
            <div
              onClick={() => navigate(`/product/${product.id}/reviews`)}
              className="flex items-center gap-1.5 mt-3 text-xs font-semibold cursor-pointer group hover:opacity-90 inline-flex"
            >
              <div className="flex gap-0.5 text-[#FFB800]">
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
              </div>
              <span className="font-display text-blue group-hover:underline">
                {product.rating} ({product.reviewCount} Reviews)
              </span>
            </div>
          </div>

          <div className="divider h-[1px] bg-gray3 my-1" />

          {/* Copy text */}
          <div>
            <h3 className="font-display font-bold text-xs uppercase text-gray2 mb-1.5">Description</h3>
            <p className="font-sans text-[13.5px] leading-relaxed text-[#555]">
              {product.description}
            </p>
          </div>

          <div className="divider h-[1px] bg-gray3 my-1" />

          {/* Sizes Swatches */}
          <div>
            <div className="flex justify-between items-center mb-2.5">
              <h3 className="font-display font-bold text-xs uppercase text-gray2">Select Size</h3>
              <span
                onClick={() => navigate("/settings/sizes")}
                className="text-[12px] font-display font-semibold text-blue cursor-pointer hover:underline"
              >
                Size Guide
              </span>
            </div>
            <div className="flex gap-2">
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`size-btn w-[42px] h-[40px] rounded-lg border font-display text-[13.5px] font-bold tracking-tight transition-all cursor-pointer ${
                    selectedSize === sz
                      ? "border-blue bg-blue text-white shadow-sm"
                      : "border-gray3 text-dark bg-white hover:bg-gray"
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Color Swatches */}
          {product.colors.length > 0 && product.colors[0] !== "One Size" && (
            <div>
              <h3 className="font-display font-bold text-xs uppercase text-gray2 mb-2.5">Color</h3>
              <div className="flex gap-3.5 items-center">
                {product.colors.map((col) => (
                  <button
                    key={col}
                    onClick={() => setSelectedColor(col)}
                    style={{ backgroundColor: col }}
                    className={`color-dot w-7 h-7 rounded-full transition-all flex items-center justify-center border-2 border-transparent ${
                      selectedColor === col ? "border-blue scale-110" : ""
                    }`}
                  >
                    {selectedColor === col && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white mix-blend-difference" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="divider h-[1px] bg-gray3 my-1" />

          {/* Quantity control steppers */}
          <div className="flex items-center justify-between pb-3">
            <span className="font-display font-bold text-sm text-dark">Quantity</span>
            <div className="flex items-center gap-4 bg-gray px-3.5 py-1.5 rounded-full border border-gray3/30">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-1 hover:opacity-75 bg-white rounded-full flex items-center justify-center shadow-sm cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5 text-dark" strokeWidth={2.5} />
              </button>
              <span className="font-display font-bold text-[16px] text-dark w-6 text-center select-none">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="p-1 hover:opacity-75 bg-blue text-white rounded-full flex items-center justify-center shadow-sm cursor-pointer animate-[pulse_2s_infinite]"
              >
                <Plus className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
              </button>
            </div>
          </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating CTA details at the absolute bottom */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] md:max-w-[768px] lg:max-w-[1024px] bg-white border-t border-black/10 flex gap-4 p-4 z-[100] shadow-[0_-2px_10px_rgba(0,0,0,0.04)] transition-all">
        <button
          onClick={() => navigate("/cart")}
          className="w-14 h-14 bg-blue-light/40 flex items-center justify-center rounded-std text-blue hover:bg-blue-light/75 active:scale-95 transition-all focus:outline-none cursor-pointer"
        >
          <ShoppingBag className="w-5.5 h-5.5 text-blue" strokeWidth={2} />
        </button>
        <button
          onClick={handleAddToCart}
          className="btn-primary flex-1 h-14 rounded-std bg-blue text-white font-display font-extrabold text-[15px] shadow-std active:scale-[0.98] transition-transform flex items-center justify-center cursor-pointer"
        >
          Add to Bag — {currencySymbol}
          {(product.price * quantity).toFixed(2)}
        </button>
      </div>

      {isImageViewerOpen && (
        <div
          className="fixed inset-0 z-[220] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeImageViewer}
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeImageViewer}
              className="absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"
              aria-label="Close image viewer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-black shadow-2xl">
              <button
                type="button"
                onClick={() => stepImage(-1)}
                className="absolute left-3 top-1/2 z-10 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                type="button"
                onClick={() => stepImage(1)}
                className="absolute right-3 top-1/2 z-10 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              <img
                src={activeImage}
                alt={product.name}
                className="max-h-[80vh] w-full object-contain bg-black/70"
              />
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2.5 sm:gap-3">
              {galleryImages.map((image, index) => (
                <button
                  key={`viewer-thumb-${product.id}-${index}`}
                  type="button"
                  onClick={() => setActiveImageIndex(index)}
                  className={`relative aspect-square overflow-hidden rounded-[16px] border transition-all cursor-pointer ${
                    activeImageIndex === index
                      ? "border-white ring-2 ring-white/40"
                      : "border-white/15 hover:border-white/40"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} preview ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
