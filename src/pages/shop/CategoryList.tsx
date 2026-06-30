import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import { BackButton } from "../../components/layout/BackButton";
import { PageHeader } from "../../components/layout/PageHeader";
import { ProductCard } from "../../components/common/ProductCard";
import { EmptyState } from "../../components/common/EmptyState";
import { FilterSheet, FilterState } from "../../components/common/FilterSheet";
import { ScrollReveal } from "../../components/common/ScrollReveal";
import { getCategoriesForMode, getCategoryBySlug, getDefaultCategorySlug } from "../../data/categories";
import { products } from "../../data/products";
import { useBrowseMode } from "../../context/BrowseModeContext";

export default function CategoryList() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { browseMode } = useBrowseMode();
  const categories = useMemo(() => getCategoriesForMode(browseMode), [browseMode]);

  // Find the exact category details
  const category = useMemo(() => {
    return getCategoryBySlug(slug, browseMode);
  }, [slug, browseMode]);

  useEffect(() => {
    if (slug && category) {
      return;
    }

    navigate(`/category/${getDefaultCategorySlug(browseMode)}`, { replace: true });
  }, [browseMode, category, navigate, slug]);

  // States
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [quickFilter, setQuickFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>(() => {
    const colCode = searchParams.get("color");
    const parsedColor = colCode ? (colCode.startsWith("#") ? colCode : `#${colCode}`) : "";
    const typeStr = searchParams.get("type");
    const parsedTypes = typeStr ? typeStr.split(",") : [];

    return {
      category: slug ?? "all",
      maxPrice: 100000,
      size: "",
      color: parsedColor,
      sortBy: "popular",
      subTypes: parsedTypes
    };
  });

  // Filter lists
  const filteredProducts = useMemo(() => {
    let list = products.filter((product) => product.audience === browseMode || product.audience === "unisex");
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const activeCat = filters.category !== "all" ? filters.category : slug;
    if (activeCat === "dresses") {
      list = list.filter((p) => p.subType === "dress");
    } else if (activeCat === "two-pieces") {
      list = list.filter((p) => p.subType === "two-piece");
    } else if (activeCat === "shoes") {
      list = list.filter((p) => p.category === "shoes");
    } else if (activeCat === "Accessories") {
      list = list.filter((p) => p.category === "bags");
    } else if (activeCat === "casual-clothes") {
      list = list.filter((p) => p.category === "casual-clothes");
    } else if (activeCat && activeCat !== "all") {
      list = list.filter((p) => p.category === activeCat);
    }

    // Apply quick filters
    if (quickFilter === "new") {
      list = list.filter((p) => p.tags?.includes("New Arrival") || p.tags?.includes("Trending"));
    } else if (quickFilter === "sale") {
      list = list.filter((p) => p.compareAtPrice && p.compareAtPrice > p.price);
    } else if (quickFilter === "popular") {
      list = list.filter((p) => p.rating >= 4.7);
    } else if (quickFilter === "under45k") {
      list = list.filter((p) => p.price <= 45000.0);
    }

    // Apply main filters (except category since we are pre-locked to current slug)
    list = list.filter((p) => p.price <= filters.maxPrice);

    if (filters.size) {
      list = list.filter((p) => p.sizes.includes(filters.size) || p.sizes.includes("One Size"));
    }

    if (filters.color) {
      const targetColor = filters.color.toLowerCase();
      list = list.filter((p) => 
        p.colors.some(c => c.toLowerCase() === targetColor) || 
        (p.colorTag && p.colorTag.toLowerCase() === targetColor)
      );
    }

    if (filters.subTypes && filters.subTypes.length > 0) {
      list = list.filter((p) => p.subType && filters.subTypes.includes(p.subType));
    }

    if (normalizedQuery) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(normalizedQuery) ||
          p.category.toLowerCase().includes(normalizedQuery) ||
          p.subType?.toLowerCase().includes(normalizedQuery) ||
          p.tags?.some((tag) => tag.toLowerCase().includes(normalizedQuery))
      );
    }

    // Sorting
    if (filters.sortBy === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === "newest") {
      list.sort((a, b) => (b.tags?.includes("New") ? 1 : 0) - (a.tags?.includes("New") ? 1 : 0));
    } else {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [slug, quickFilter, filters, searchQuery, browseMode]);

  if (!category) {
    return (
      <div className="p-5 text-center">
        <h3 className="title-md">Category Not Found</h3>
        <button onClick={() => navigate("/")} className="btn-primary mt-4">
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white animate-fade-up-enter min-h-screen">
      <PageHeader
        title={category.name}
        left={<BackButton />}
        right={
          <button
            onClick={() => setIsFilterOpen(true)}
            className="p-1 text-dark hover:opacity-75 focus:outline-none cursor-pointer"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        }
      />

      <div className="flex-grow p-5 space-y-4">
        <div className="md:hidden sticky top-0 z-20 -mx-5 px-5 pt-1 pb-2 bg-white/92 backdrop-blur-xl border-b border-black/5">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray2" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search this category"
              className="w-full h-11 rounded-full border border-gray3 bg-gray pl-11 pr-4 font-display text-[14px] text-dark outline-none focus:border-blue/20"
            />
          </div>
        </div>

        {/* Quick selection chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5 select-none">
          {[
            { id: "all", label: "All" },
            { id: "new", label: "New" },
            { id: "sale", label: "Sale" },
            { id: "popular", label: "Popular" },
            { id: "under45k", label: "Under ₦45k" }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setQuickFilter(item.id)}
              className={`filter-chip px-3.5 py-1.5 rounded-full border font-display text-[12.5px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
                quickFilter === item.id
                  ? "border-blue bg-blue-light text-blue"
                  : "border-gray3 text-[#555] bg-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {searchQuery && (
          <div className="flex items-center justify-between gap-3 rounded-[18px] border border-blue/15 bg-blue-light/20 px-4 py-3">
            <span className="text-xs font-medium text-gray2">
              Search results for <span className="font-semibold text-dark">"{searchQuery}"</span>
            </span>
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="text-xs font-bold text-blue hover:underline"
            >
              Clear
            </button>
          </div>
        )}

        {/* Count list */}
        <div className="flex justify-between items-center text-xs text-gray2 font-medium px-1">
          <span>{filteredProducts.length} items found</span>
        </div>

        {/* Product boards */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((prod, index) => (
              <React.Fragment key={prod.id}>
                <ScrollReveal delay={index * 0.04} className="flex">
                  <ProductCard product={prod} />
                </ScrollReveal>
              </React.Fragment>
            ))}
          </div>
        ) : (
        <EmptyState
          emoji={category.emoji}
          title="Empty Collection"
          description="We are currently stitching new inventory for this fashion category. Explore other collections!"
          actionText="Browse Home"
          onAction={() => navigate("/")}
          />
        )}
      </div>

      {/* Slide overlay sheet for precise filter controls */}
      <FilterSheet
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onApply={(newFilters) => {
          setFilters(newFilters);
          if (newFilters.category && newFilters.category !== "all" && newFilters.category !== slug) {
            navigate(`/category/${newFilters.category}`);
          }
        }}
      />
    </div>
  );
}
