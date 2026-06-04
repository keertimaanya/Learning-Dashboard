"use client";

import { motion } from "framer-motion";
import { STAGGER_ITEM } from "@/lib/constants";
import { AnimatedCard } from "@/components/ui/animated-card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { DynamicIcon } from "@/components/ui/dynamic-icon";
import { CourseTileProps } from "@/lib/types";

/**
 * CourseTile — Displays a single course fetched from Supabase.
 *
 * Receives course data as props (passed from Server Component).
 * Renders: dynamic icon, title, animated progress bar.
 * Each tile has a subtle gradient mesh background.
 *
 * STAGGERED ANIMATION (Multiple Instances):
 * This appears multiple times via .map() in BentoGrid.
 * Each instance is a separate child element.
 *
 * Timeline (assuming 3 courses):
 *   200ms:      HeroTile starts (delayChildren: 0.2)
 *   300ms:      CourseTile #1 starts (200 + staggerChildren*1)
 *   400ms:      CourseTile #2 starts (200 + staggerChildren*2)
 *   500ms:      CourseTile #3 starts (200 + staggerChildren*3)
 *   600ms:      ActivityTile starts
 *
 * Each CourseTile:
 * - Starts invisible (opacity: 0) and 20px lower (y: 20)
 * - When its turn arrives, animates to visible (opacity: 1, y: 0)
 * - Uses spring physics for natural, bouncy feel
 * - Takes ~300ms to complete
 *
 * Important: React renders all children immediately.
 * Framer Motion staggers WHEN each animation STARTS.
 * The .map() doesn't need to know about timing.
 * BentoGrid's parent variants handle all orchestration.
 *
 * Result: Courses cascade in top-to-bottom, creating flow
 */
export function CourseTile({ course }: CourseTileProps) {
  return (
    <motion.div variants={STAGGER_ITEM}>
      <AnimatedCard className="relative h-44 flex flex-col justify-between overflow-hidden">
        {/* Subtle gradient mesh background */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent-secondary/5 pointer-events-none" />

        <div className="relative z-10">
          {/* Icon + Title */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <DynamicIcon
                name={course.icon_name}
                size={20}
                className="text-accent"
              />
            </div>
            <h3 className="text-sm font-semibold text-text-primary leading-tight">
              {course.title}
            </h3>
          </div>
        </div>

        {/* Progress section */}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-text-muted">Progress</span>
            <span className="text-xs font-medium text-text-secondary">
              {course.progress}%
            </span>
          </div>
          <ProgressBar value={course.progress} />
        </div>
      </AnimatedCard>
    </motion.div>
  );
}
