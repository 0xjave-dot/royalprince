import { useRef, useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon, Clock, Camera } from "lucide-react";
import { BackButton } from "../../components/layout/BackButton";
import { useToast } from "../../context/ToastContext";
import { searchCatalogByImage } from "../../lib/imageSearch";
import { products } from "../../data/products";

export default function Search() {
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const [query, setQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isImageScanning, setIsImageScanning] = useState(false);

  const recentSearches = ["Summer dress", "Handbag leather"];
  const trendingTags = ["Dresses", "Two-Pieces", "Shoes", "Bags", "Sale"];

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search/results?q=${encodeURIComponent(query.trim())}`);
  };

  const handleTagClick = (tag: string) => {
    navigate(`/search/results?q=${encodeURIComponent(tag)}`);
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleImagePick = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      pushToast("Please choose an image file.");
      return;
    }

    setIsImageScanning(true);

    try {
      const result = await searchCatalogByImage(file, products);
      pushToast(
        result.provider === "gemini"
          ? `Searching by image with Gemini for ${result.label}.`
          : `Searching by image for ${result.label}.`
      );
      navigate("/search/results", { state: { imageSearch: result } });
    } catch {
      pushToast("That image could not be scanned. Please try a different one.");
    } finally {
      setIsImageScanning(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white animate-fade-up-enter min-h-screen">
      <div className="sticky top-0 z-[70] flex-none px-4 sm:px-5 py-2.5 bg-white/92 backdrop-blur-xl border-b border-black/5 shadow-[0_4px_18px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-3">
          <BackButton />
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <input
              className="w-full h-11 bg-gray rounded-full px-11 font-display font-medium text-[14px] text-dark outline-none border border-transparent focus:border-blue/20"
              placeholder="Search products"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray2" />
          </form>
        </div>
      </div>

      <div className="flex-1 p-4 sm:p-5 space-y-6">
        <section className="rounded-[26px] bg-[#0f172a] text-white p-5 sm:p-6 shadow-[0_14px_40px_rgba(15,23,42,0.16)]">
          <p className="font-display text-[10px] uppercase tracking-[0.25em] text-white/60">Search your style</p>
          <h2 className="font-display font-black text-[24px] sm:text-[28px] leading-tight mt-2">
            Find the next piece that fits your look
          </h2>
          <p className="font-sans text-sm text-white/70 mt-2 max-w-[420px]">
            Search by product name, category, or trend. Use the suggestions below for a faster start.
          </p>
        </section>

        <div>
          <h3 className="font-display font-bold text-xs text-gray2 uppercase mb-2">
            Recent Searches
          </h3>
          <div className="space-y-1">
            {recentSearches.map((term) => (
              <button
                key={term}
                onClick={() => handleTagClick(term)}
                className="w-full flex items-center gap-2.5 py-3 border-b border-gray/50 cursor-pointer hover:bg-gray/10 group rounded-md px-1 text-left"
              >
                <Clock className="w-4 h-4 text-gray2" />
                <span className="font-sans text-[14.5px] text-dark group-hover:text-blue transition-colors">
                  {term}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-display font-bold text-xs text-gray2 uppercase mb-3">Trending</h3>
          <div className="flex flex-wrap gap-2">
            {trendingTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className="filter-chip px-3.5 py-1.5 rounded-full border border-gray3 font-display text-[12.5px] font-semibold text-dark bg-white hover:border-blue hover:text-blue hover:bg-blue-light/10 active:scale-95 transition-all cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-display font-bold text-xs text-gray2 uppercase mb-3">
            Image Search
          </h3>
          <button
            onClick={handleCameraClick}
            disabled={isImageScanning}
            className="w-full border-2 border-dashed border-gray3 rounded-[24px] p-6 text-center cursor-pointer hover:border-blue hover:bg-blue-light/10 transition-colors group flex flex-col items-center justify-center select-none disabled:cursor-progress disabled:opacity-75"
          >
            <div className="w-14 h-14 rounded-full bg-blue-light flex items-center justify-center mb-3 text-2xl group-hover:scale-110 transition-transform">
              {isImageScanning ? (
                <div className="w-6 h-6 rounded-full border-[3px] border-blue border-t-transparent animate-spin" />
              ) : (
                <Camera className="w-6 h-6 text-blue" />
              )}
            </div>
            <p className="font-display font-semibold text-[14.5px] text-dark">
              {isImageScanning ? "Scanning photo..." : "Upload a photo"}
            </p>
            <p className="font-sans text-xs text-gray2 mt-1">
              Preview matching garments from the catalog.
            </p>
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImagePick}
      />
    </div>
  );
}
