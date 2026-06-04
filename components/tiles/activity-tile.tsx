"use client";

import { motion } from "framer-motion";
import { STAGGER_ITEM } from "@/lib/constants";
import { AnimatedCard } from "@/components/ui/animated-card";
import { cn } from "@/lib/utils";

/**
 * ActivityTile — Mock contribution graph (GitHub-style).
 *
 * Generates a grid of small squares with random opacity
 * to simulate a contribution/activity heatmap.
 * Spans 2 columns on desktop.
 *
 * TWO LEVELS OF STAGGERED ANIMATION:
 *
 * LEVEL 1: Tile-level stagger (via BentoGrid parent)
 * ───────────────────────────────────────────────
 * ActivityTile is typically the last child of BentoGrid.
 * Starts animating ~600-700ms after page load.
 * Animates: opacity 0→1, y 20→0 (same as HeroTile & CourseTiles)
 * Uses: spring physics (stiffness: 300, damping: 20)
 *
 * LEVEL 2: Grid square animation (inside ActivityTile)
 * ────────────────────────────────────────────────────
 * The 140 small squares (20 weeks × 7 days) animate independently.
 * Each square:
 *   - Starts: opacity 0, scale 0 (invisible, tiny)
 *   - Animates to: opacity 1, scale 1 (visible, normal)
 *   - Has staggered delay: transition={{ delay: i * 0.003 }}
 *
 * The delay formula (i * 0.003):
 *   - Square 0:   delay = 0ms      (starts immediately)
 *   - Square 1:   delay = 3ms
 *   - Square 2:   delay = 6ms
 *   - Square 140: delay = 420ms    (last square)
 *
 * Creates a ripple effect: squares fill in sequentially like rain.
 *
 * Full Timeline:
 * ──────────────
 * 200-900ms:    ActivityTile tile animates in (opacity, position)
 * 900-1300ms:   Squares animate in (ripple effect, after tile visible)
 * 1300ms:       Everything complete
 *
 * Result: Professional multi-level animation
 * - Tile slides and fades in
 * - Then grid squares cascade in
 * - Creates visual depth and sophistication
 */

// Generate mock activity data (52 weeks × 7 days)
const WEEKS = 20;
const DAYS = 7;
const activityData = Array.from({ length: WEEKS * DAYS }, () =>
  Math.random()
);

function getActivityColor(value: number): string {
  if (value < 0.2) return "bg-surface";
  if (value < 0.4) return "bg-accent/20";
  if (value < 0.6) return "bg-accent/40";
  if (value < 0.8) return "bg-accent/60";
  return "bg-accent/80";
}

export function ActivityTile() {
  return (
    <motion.div variants={STAGGER_ITEM} className="lg:col-span-2">
      <AnimatedCard className="h-52 flex flex-col overflow-hidden">
        <h3 className="text-sm font-semibold text-text-primary mb-4">
          Learning Activity
        </h3>

        {/* Contribution graph grid */}
        <div className="flex-1 flex items-end">
          <div
            className="grid gap-[3px]"
            style={{
              gridTemplateColumns: `repeat(${WEEKS}, 1fr)`,
              gridTemplateRows: `repeat(${DAYS}, 1fr)`,
            }}
          >
            {activityData.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.003, duration: 0.2 }}
                className={cn(
                  "w-3 h-3 rounded-[2px]",
                  getActivityColor(value)
                )}
              />
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-[10px] text-text-muted">Less</span>
          {[0.1, 0.3, 0.5, 0.7, 0.9].map((v) => (
            <div
              key={v}
              className={cn("w-3 h-3 rounded-[2px]", getActivityColor(v))}
            />
          ))}
          <span className="text-[10px] text-text-muted">More</span>
        </div>
      </AnimatedCard>
    </motion.div>
  );
}
