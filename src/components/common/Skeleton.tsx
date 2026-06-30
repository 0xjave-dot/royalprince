import React from "react";

export function SkeletonBase({ className }: { className: string }) {
  return (
    <div className={`animate-pulse bg-[#f2f2f2] dark:bg-gray/50 ${className}`} />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="card product-card overflow-hidden bg-white rounded-[20px] border border-[#e5e5e5] p-2">
      {/* Product Image Stage */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#f8f8f8] rounded-[14px]">
        <SkeletonBase className="w-full h-full rounded-[14px]" />
      </div>

      {/* Pricing / Meta Details */}
      <div className="pt-2 px-1 pb-1 w-full space-y-1.5 text-left">
        <SkeletonBase className="h-4 w-3/4 rounded-md" />
        <SkeletonBase className="h-3 w-1/2 rounded-md" />
        <div className="flex gap-2.5 pt-1">
          <SkeletonBase className="h-4 w-1/3 rounded-md" />
          <SkeletonBase className="h-3.5 w-1/4 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function CategoryItemSkeleton() {
  return (
    <div className="rounded-[20px] border border-[#e5e5e5] bg-[#f8f8f8] p-3.5 flex items-center gap-3">
      <SkeletonBase className="w-[44px] h-[44px] rounded-2xl flex-shrink-0" />
      <div className="space-y-1.5 flex-grow text-left">
        <SkeletonBase className="h-3.5 w-2/3 rounded-md" />
        <SkeletonBase className="h-2.5 w-1/2 rounded-md" />
      </div>
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="flex flex-col md:flex-row md:items-start md:gap-8 p-5">
      <div className="w-full md:w-[45%] aspect-[4/5] md:aspect-square overflow-hidden bg-gray border border-black/5 md:rounded-2xl flex-shrink-0">
        <SkeletonBase className="w-full h-full rounded-b-md md:rounded-2xl" />
      </div>
      <div className="flex-grow flex flex-col space-y-5 pt-4 md:pt-0 w-full text-left">
        <div className="space-y-3">
          <div className="flex justify-between items-start gap-4">
            <SkeletonBase className="h-7 w-2/3 rounded-lg" />
            <SkeletonBase className="h-7 w-12 rounded-full" />
          </div>
          <SkeletonBase className="h-4 w-1/3 rounded-md" />
          <div className="flex gap-3 pt-2">
            <SkeletonBase className="h-5 w-1/4 rounded-md" />
            <SkeletonBase className="h-4 w-1/6 rounded-md" />
          </div>
        </div>
        <div className="space-y-2 pt-2">
          <SkeletonBase className="h-3.5 w-full rounded-md" />
          <SkeletonBase className="h-3.5 w-[90%] rounded-md" />
          <SkeletonBase className="h-3.5 w-[84%] rounded-md" />
        </div>
        <div className="space-y-4 pt-4">
          <div className="space-y-1.5">
            <SkeletonBase className="h-3 w-16 rounded-md" />
            <div className="flex gap-2">
              <SkeletonBase className="h-9 w-12 rounded-lg" />
              <SkeletonBase className="h-9 w-12 rounded-lg" />
              <SkeletonBase className="h-9 w-12 rounded-lg" />
            </div>
          </div>
          <div className="space-y-1.5">
            <SkeletonBase className="h-3 w-20 rounded-md" />
            <div className="flex gap-2">
              <SkeletonBase className="h-8 w-8 rounded-full" />
              <SkeletonBase className="h-8 w-8 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
