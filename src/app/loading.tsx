"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
      {/* Header Skeleton */}
      <div className="flex items-center">
        <Skeleton className="h-8 w-36" />
        <div className="ml-auto flex items-center gap-2">
          <Skeleton className="h-10 w-[260px]" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      {/* Stats Grid Skeleton */}
      <div>
        <Skeleton className="mb-4 h-7 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-[125px] w-full" />
          <Skeleton className="h-[125px] w-full" />
          <Skeleton className="h-[125px] w-full" />
        </div>
      </div>
      
       <div>
        <Skeleton className="mb-4 h-7 w-56" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Skeleton className="h-[125px] w-full" />
          <Skeleton className="h-[125px] w-full" />
          <Skeleton className="h-[125px] w-full" />
          <Skeleton className="h-[125px] w-full" />
          <Skeleton className="h-[125px] w-full" />
        </div>
      </div>


      {/* Chart Skeleton */}
      <div className="grid gap-4 md:gap-8">
        <Skeleton className="h-[340px] w-full" />
      </div>

      {/* Two Column Skeletons */}
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
        <Skeleton className="h-[430px] w-full" />
        <Skeleton className="h-[430px] w-full" />
      </div>
    </main>
  );
}
