"use client";

import { motion } from "framer-motion";
import { STAGGER_CONTAINER } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * BentoGrid — Responsive CSS Grid container for dashboard tiles
 *
 * LAYOUT STRUCTURE:
 * - Mobile (<640px):        1 column (full width)
 * - Small tablet (640px):   1 column (full width)
 * - Tablet (768-1023px):    2 columns
 * - Desktop (1024px+):      4 columns
 *
 * This layout reflects mobile-first design:
 * - Start with simplest layout (1 column)
 * - Add columns as screen grows
 * - Maintains content hierarchy across breakpoints
 *
 * RESPONSIVE GAPS:
 * - Mobile:   gap-3 (12px - touch-friendly)
 * - Tablet:   gap-4 (16px)
 * - Desktop:  gap-5 (20px)
 *
 * STAGGERED ANIMATION:
 * Orchestrates entrance animation for all children.
 * Each child needs variants={STAGGER_ITEM}:
 * - HeroTile
 * - CourseTile (multiple)
 * - ActivityTile
 *
 * Timeline (5 tiles total):
 *   200ms:  HeroTile starts
 *   300ms:  CourseTile #1 starts
 *   400ms:  CourseTile #2 starts
 *   500ms:  CourseTile #3 starts
 *   600ms:  ActivityTile starts
 *   900ms:  All done (cascade effect)
 */
export function BentoGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      variants={STAGGER_CONTAINER}
      initial="hidden"
      animate="visible"
      className={cn(
        // Mobile first: 1 column, gap 3 (12px)
        "grid grid-cols-1 gap-3",
        // Small: still 1 column
        "sm:grid-cols-1 sm:gap-3",
        // Tablet: 2 columns, gap 4 (16px)
        "md:grid-cols-2 md:gap-4",
        // Desktop: 4 columns, gap 5 (20px)
        "lg:grid-cols-4 lg:gap-5",
        className
      )}
    >
      {children}
    </motion.section>
  );
}
