"use client";

import { Flame } from "lucide-react";

/**
 * StreakIndicator — Shows daily learning streak count.
 *
 * Displays a fire icon with the streak number.
 * Used in HeroTile.
 */
export function StreakIndicator({ days }: { days: number }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-accent-amber/10 px-3 py-1.5 w-fit">
      <Flame className="h-4 w-4 text-accent-amber" />
      <span className="text-xs font-semibold text-accent-amber">
        {days} day streak
      </span>
    </div>
  );
}
