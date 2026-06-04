import { SkeletonTile } from "@/components/tiles/skeleton-tile";

export default function Loading() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar skeleton */}
      <aside className="hidden lg:flex w-64 flex-col bg-background-elevated border-r border-surface-border p-4">
        <div className="h-8 w-32 rounded-md bg-surface animate-skeleton-pulse mb-8" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-10 w-full rounded-lg bg-surface animate-skeleton-pulse mb-2"
          />
        ))}
      </aside>

      {/* Main content skeleton grid */}
      <main className="flex-1 p-6 lg:p-8">
        <section className="grid grid-cols-1 md:grid-cols-bento-tablet lg:grid-cols-bento gap-4">
          {/* Hero skeleton — spans 2 columns */}
          <SkeletonTile className="lg:col-span-2 h-48" />
          {/* Course skeletons */}
          <SkeletonTile className="h-44" />
          <SkeletonTile className="h-44" />
          <SkeletonTile className="h-44" />
          {/* Activity skeleton */}
          <SkeletonTile className="lg:col-span-2 h-52" />
        </section>
      </main>
    </div>
  );
}
