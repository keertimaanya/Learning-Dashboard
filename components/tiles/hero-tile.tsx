"use client";

import { motion } from "framer-motion";
import { STAGGER_ITEM } from "@/lib/constants";
import { AnimatedCard } from "@/components/ui/animated-card";
import { StreakIndicator } from "@/components/ui/streak-indicator";

/**
 * HeroTile — Large greeting tile with daily learning streak.
 *
 * Spans 2 columns in the Bento grid on desktop.
 * Mock data for name and streak (not in Supabase schema).
 *
 * STAGGERED ANIMATION:
 * This is a child of BentoGrid (motion.section with STAGGER_CONTAINER).
 *
 * Timeline:
 *   0-200ms:    Delay (delayChildren: 0.2)
 *   200ms:      HeroTile starts animating (first child)
 *   200-500ms:  Spring animation runs
 *               opacity: 0 → 1
 *               y: 20 → 0 (slides up)
 *   500ms:      Done, next CourseTile starts
 *
 * How it works:
 * 1. BentoGrid has variants={STAGGER_CONTAINER}
 * 2. STAGGER_CONTAINER says: wait 200ms, then start children,
 *    spacing them 100ms apart
 * 3. This HeroTile has variants={STAGGER_ITEM}
 * 4. STAGGER_ITEM defines: opacity 0→1, y 20→0
 * 5. When BentoGrid's animate="visible" triggers:
 *    - Parent waits 200ms (delayChildren)
 *    - Tells HeroTile: "Animate now"
 *    - HeroTile applies STAGGER_ITEM.visible
 *    - Spring physics fade in and slide up
 *    - Next child waits 100ms (staggerChildren) and starts
 *
 * Result: Tiles cascade in like dominoes
 */
interface HeroTileProps {
  name?: string;
}

export function HeroTile({ name = "Learner" }: HeroTileProps) {
  return (
    <motion.div variants={STAGGER_ITEM} className="lg:col-span-2">
      <AnimatedCard className="relative h-48 flex flex-col justify-between overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-accent-secondary/10 pointer-events-none" />

        <div className="relative z-10">
          <p className="text-sm text-text-secondary">Good evening</p>
          <h1 className="text-2xl font-bold text-text-primary mt-1">
            Welcome back, {name} 👋
          </h1>
          <p className="text-sm text-text-muted mt-2">
            You&apos;re making great progress. Keep it up!
          </p>
        </div>

        <div className="relative z-10">
          <StreakIndicator days={12} />
        </div>
      </AnimatedCard>
    </motion.div>
  );
}
