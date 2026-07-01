import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { products } from "../../data/products";
import { brandName, brandTheme } from "../../data/brand";
import { rgbaFromHex } from "../../lib/colorTheme";

interface PromoSlide {
  productId: string;
}

const slideBlueprints: PromoSlide[] = [
  { productId: "summer-floral-dress" },
  { productId: "classic-heels" },
  { productId: "leather-tote" },
  { productId: "white-sneakers" },
];

export function DailyPromoCarousel() {
  const navigate = useNavigate();
  const theme = useMemo(() => brandTheme, []);
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = useMemo(() => {
    return slideBlueprints
      .map((slide) => products.find((item) => item.id === slide.productId))
      .filter((product): product is (typeof products)[number] => Boolean(product));
  }, []);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 10000);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    if (activeSlide >= slides.length) {
      setActiveSlide(0);
    }
  }, [activeSlide, slides.length]);

  if (slides.length === 0) {
    return null;
  }

  const current = slides[activeSlide] ?? slides[0];

  return (
    <div
      className="relative overflow-hidden rounded-[24px] min-h-[150px] sm:min-h-[180px] cursor-pointer select-none border border-black/5"
      style={{
        background: theme.shellBackground,
        boxShadow: `0 14px 34px ${rgbaFromHex(theme.accent, 0.14)}`,
      }}
      onClick={() => navigate(`/product/${current.id}`)}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.55)_0%,_transparent_42%)] pointer-events-none" />
      <div
        className="absolute inset-y-0 left-0 w-2/5 pointer-events-none"
        style={{
          background: `linear-gradient(90deg, ${rgbaFromHex(theme.accent, 0.24)} 0%, rgba(255,255,255,0) 100%)`,
        }}
      />
      <div
        className="absolute -right-8 bottom-[-28px] h-40 w-40 rounded-full blur-2xl pointer-events-none"
        style={{ backgroundColor: rgbaFromHex(theme.accent, 0.22) }}
      />

      <div key={activeSlide} className="relative h-full min-h-[150px] sm:min-h-[180px] animate-fade-up-enter">
        <img
          src={current.images[0]}
          alt={current.name}
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/28 via-transparent to-transparent" />
        <div className="absolute inset-0 ring-1 ring-white/20" />
        <div className="absolute left-4 top-4 sm:left-5 sm:top-5">
          <span
            className="inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-white shadow-[0_10px_22px_rgba(0,0,0,0.16)]"
            style={{ backgroundColor: theme.accent }}
          >
            New from {brandName}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 max-w-[72%] rounded-[18px] bg-white/78 px-4 py-3 backdrop-blur-md border border-white/60 shadow-[0_10px_24px_rgba(0,0,0,0.08)]">
          <p className="font-display text-[10px] font-black uppercase tracking-[0.24em] text-gray2">
            
          </p>
          <p className="mt-1 font-display text-[18px] font-black uppercase tracking-tight text-dark leading-none">
            
          </p>
        </div>
      </div>
    </div>
  );
}
