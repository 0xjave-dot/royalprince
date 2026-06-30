import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { getCategoriesForMode } from "../../data/categories";
import { useBrowseMode } from "../../context/BrowseModeContext";

export interface FilterState {
  category: string;
  maxPrice: number;
  size: string;
  color: string;
  sortBy: string;
  subTypes?: string[];
}

interface FilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onApply: (newFilters: FilterState) => void;
}

export function FilterSheet({ isOpen, onClose, filters, onApply }: FilterSheetProps) {
  const { browseMode } = useBrowseMode();
  const categories = getCategoriesForMode(browseMode);
  const [localCategory, setLocalCategory] = useState(filters.category);
  const [localMaxPrice, setLocalMaxPrice] = useState(filters.maxPrice);
  const [localSize, setLocalSize] = useState(filters.size);
  const [localColor, setLocalColor] = useState(filters.color);
  const [localSortBy, setLocalSortBy] = useState(filters.sortBy);
  const [localSubTypes, setLocalSubTypes] = useState<string[]>(filters.subTypes ?? []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setLocalCategory(filters.category);
    setLocalMaxPrice(filters.maxPrice);
    setLocalSize(filters.size);
    setLocalColor(filters.color);
    setLocalSortBy(filters.sortBy);
    setLocalSubTypes(filters.subTypes ?? []);
  }, [filters.category, filters.color, filters.maxPrice, filters.size, filters.sortBy, filters.subTypes, isOpen]);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply({
      category: localCategory,
      maxPrice: localMaxPrice,
      size: localSize,
      color: localColor,
      sortBy: localSortBy,
      subTypes: localSubTypes,
    });
    onClose();
  };

  const handleReset = () => {
    setLocalCategory("all");
    setLocalMaxPrice(100000);
    setLocalSize("");
    setLocalColor("");
    setLocalSortBy("popular");
    setLocalSubTypes([]);
  };

  const handleToggleSubType = (val: string) => {
    if (localSubTypes.includes(val)) {
      setLocalSubTypes(localSubTypes.filter((t) => t !== val));
    } else {
      setLocalSubTypes([...localSubTypes, val]);
    }
  };

  const availableSubTypes =
    browseMode === "men"
      ? [
          { value: "tops", label: "Tops" },
          { value: "pants", label: "Pants" },
          { value: "shoes", label: "Shoes" },
        ]
      : [
          { value: "dress", label: "Dresses" },
          { value: "two-piece", label: "Two-Pieces" },
          { value: "casual", label: "Casual" },
        ];

  // Color Swatches
  const availableColors = [
    { value: "#FF5790", label: "Pink" },
    { value: "#004CFF", label: "Blue" },
    { value: "#202020", label: "Dark" },
    { value: "#F5F5F5", label: "White", border: true },
    { value: "#5D4037", label: "Brown" },
  ];

  // Sizes Available
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  return (
    <div className="fixed inset-0 bg-black/45 z-[210] flex items-end justify-center animate-fade-in">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Sheet Frame */}
      <div className="sheet relative w-full max-w-[420px] bg-white rounded-t-[20px] p-5 shadow-std max-h-[85vh] overflow-y-auto z-[220] flex flex-col">
        <div className="sheet-handle w-10 h-1 bg-gray3 rounded-2xl mx-auto mb-4" />

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="font-display font-bold text-[18px] text-dark">Filter Options</span>
          <div className="flex items-center gap-4">
            <button
              onClick={handleReset}
              className="text-xs font-display font-semibold text-blue"
            >
              Reset
            </button>
            <button onClick={onClose} className="p-1 text-dark hover:opacity-70">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="divider h-[1px] bg-gray3 my-1" />

        {/* Scrollable Filters */}
        <div className="space-y-4 py-2 flex-grow overflow-y-auto no-scrollbar">
          {/* Category Chip List */}
          <div>
            <h4 className="title-sm text-[14px] font-display font-bold mb-2">Category</h4>
            <div className="flex flex-wrap gap-[6px]">
              <button
              onClick={() => setLocalCategory("all")}
                className={`px-3.5 py-1.5 rounded-full border text-[12px] font-display font-semibold transition-all ${
                  localCategory === "all"
                    ? "border-blue bg-blue-light text-blue"
                    : "border-gray3 text-dark bg-white"
                }`}
              >
                All
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setLocalCategory(c.id)}
                  className={`px-3.5 py-1.5 rounded-full border text-[12px] font-display font-semibold transition-all ${
                    localCategory === c.id
                      ? "border-blue bg-blue-light text-blue"
                      : "border-gray3 text-dark bg-white"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div className="divider h-[1px] bg-gray3" />

          {/* Item Type Selector */}
          <div>
            <h4 className="title-sm text-[14px] font-display font-bold mb-2">Item Type</h4>
            <div className="flex flex-wrap gap-[6px]">
              {availableSubTypes.map((st) => {
                const isActive = localSubTypes.includes(st.value);
                return (
                  <button
                    key={st.value}
                    onClick={() => handleToggleSubType(st.value)}
                    type="button"
                    className={`px-3.5 py-1.5 rounded-full border text-[12px] font-display font-semibold transition-all cursor-pointer ${
                      isActive
                        ? "border-blue bg-blue-light text-blue"
                        : "border-gray3 text-dark bg-white"
                    }`}
                  >
                    {st.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="divider h-[1px] bg-gray3" />

          {/* Price Range Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <h4 className="title-sm text-[14px] font-display font-bold">Max Price</h4>
              <span className="font-display font-bold text-[14px] text-blue">₦{localMaxPrice}</span>
            </div>
            <input
              type="range"
              min="10"
              max="100000"
              value={localMaxPrice}
              onChange={(e) => setLocalMaxPrice(Number(e.target.value))}
              className="w-full h-1.5 bg-gray3 rounded-lg appearance-none cursor-pointer accent-blue"
            />
            <div className="flex justify-between text-[11px] text-gray2 font-display mt-1">
              <span>₦10</span>
              <span>₦50,000</span>
              <span>₦100,000</span>
            </div>
          </div>

          <div className="divider h-[1px] bg-gray3" />

          {/* Size Selectors */}
          <div>
            <h4 className="title-sm text-[14px] font-display font-bold mb-2">Size</h4>
            <div className="flex flex-wrap gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setLocalSize(localSize === s ? "" : s)}
                  className={`w-10 h-10 rounded-lg border font-display text-[13px] font-semibold transition-all ${
                    localSize === s
                      ? "border-blue bg-blue text-white"
                      : "border-gray3 text-dark bg-white"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="divider h-[1px] bg-gray3" />

          {/* Color Dots */}
          <div>
            <h4 className="title-sm text-[14px] font-display font-bold mb-2">Color</h4>
            <div className="flex gap-3.5 items-center">
              {availableColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setLocalColor(localColor === color.value ? "" : color.value)}
                  style={{ backgroundColor: color.value }}
                  className={`w-7 h-7 rounded-full transition-all flex items-center justify-center border-2 ${
                    localColor === color.value ? "border-blue scale-110" : "border-transparent"
                  } ${color.border ? "border-[#ddd]!" : ""}`}
                  title={color.label}
                >
                  {localColor === color.value && (
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        color.label === "White" ? "bg-dark" : "bg-white"
                      }`}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="divider h-[1px] bg-gray3" />

          {/* Sort By Radios */}
          <div>
            <h4 className="title-sm text-[14px] font-display font-bold mb-2">Sort By</h4>
            <div className="flex flex-col gap-2 font-sans text-[14.5px]">
              {[
                { id: "popular", label: "Popular" },
                { id: "newest", label: "Newest" },
                { id: "price-asc", label: "Price: Low to High" },
                { id: "price-desc", label: "Price: High to Low" },
              ].map((opt) => (
                <label key={opt.id} className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="sortBy"
                    checked={localSortBy === opt.id}
                    onChange={() => setLocalSortBy(opt.id)}
                    className="w-4 h-4 accent-blue"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleApply}
          className="btn-primary mt-4 w-full h-[52px] rounded-std bg-blue text-white text-[16px] font-display font-bold shadow-std active:scale-[0.98] transition-transform flex items-center justify-center cursor-pointer"
        >
          Apply Filter
        </button>
      </div>
    </div>
  );
}
