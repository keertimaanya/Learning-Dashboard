import { cn } from "@/lib/utils";
import { SkeletonTileProps } from "@/lib/types";

/**
 * SkeletonTile — Loading placeholder with pulse animation.
 *
 * Matches the dimensions of real tiles to prevent layout shifts (CLS = 0).
 * Uses CSS keyframes animation (not Framer Motion) because this
 * renders in loading.tsx which is a Server Component.
 */
export function SkeletonTile({ className }: SkeletonTileProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-surface-border bg-background-card animate-skeleton-pulse",
        className
      )}
    />
  );
}
