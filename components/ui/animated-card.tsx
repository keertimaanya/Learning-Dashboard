"use client";

import { motion } from "framer-motion";
import { HOVER_SCALE, SPRING_TRANSITION } from "@/lib/constants";
import { AnimatedCardProps } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * AnimatedCard — Professional hover animations with multiple effects.
 *
 * HOVER EFFECTS (all triggered simultaneously):
 *
 * 1. SCALE (transform)
 *    - Idle:  scale(1.0)
 *    - Hover: scale(1.02) — grows to 102% of original size
 *    - Why transform? See GPU Acceleration section below
 *
 * 2. BORDER GLOW (Tailwind + CSS)
 *    - Idle:  border: 1px solid rgba(surface-border)
 *    - Hover: border: 1px solid rgba(accent / 0.2) — colored border
 *    - CSS handles this (no animation needed, instant change)
 *    - Creates impression that card "activates" on hover
 *
 * 3. SHADOW GLOW (Tailwind)
 *    - Idle:  no shadow
 *    - Hover: shadow-glow (custom shadow with accent color)
 *    - Enhances depth perception
 *    - CSS transition: 300ms makes it fade in smoothly
 *
 * 4. GRADIENT SHIFT (transform-based color animation)
 *    - Idle:  gradient mesh background (static)
 *    - Hover: (available for extension via whileHover)
 *    - Current implementation static, but extensible
 *
 * All effects combined:
 *   - Scale makes it slightly larger
 *   - Border highlights it
 *   - Shadow adds depth
 *   - Creates "card is waking up" sensation
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * WHY TRANSFORMS ARE PREFERRED (NOT WIDTH/HEIGHT CHANGES)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * BAD: Animating width/height
 * ────────────────────────────
 * CSS property: width or height
 * Example: width: 100% → 110%
 *
 * What happens:
 * 1. Browser calculates new layout (reflow)
 * 2. Recalculates all child elements
 * 3. Repaints all affected content
 * 4. Sends to GPU
 * 5. GPU renders
 *
 * Performance: ❌ SLOW
 * - Reflow/repaint happens EVERY FRAME (60fps = 60 reflows/sec)
 * - Can drop to 30fps or worse on slower devices
 * - Jank visible (stuttering animation)
 * - Other page elements may shift (layout thrashing)
 * - CPU-intensive (expensive calculations repeated)
 *
 * Example jank:
 *   width: 100px  (reflow, repaint)
 *   width: 102px  (reflow, repaint)  ← Layout recalculated
 *   width: 104px  (reflow, repaint)  ← Again
 *   width: 106px  (reflow, repaint)  ← And again...
 *
 *
 * GOOD: Animating transforms
 * ─────────────────────────
 * CSS property: transform
 * Example: transform: scale(1) → scale(1.02)
 *
 * What happens:
 * 1. Browser skips layout calculation (no reflow)
 * 2. Skips repaint (no redraw needed)
 * 3. Browser sends transform to GPU immediately
 * 4. GPU handles transform rendering
 * 5. Done
 *
 * Performance: ✅ FAST (60fps locked)
 * - No reflow (layout already calculated, won't change)
 * - No repaint (content doesn't redraw)
 * - GPU handles every frame
 * - CPU is free to do other things
 * - Smooth 60fps animation
 * - No jank, no stuttering
 *
 * Example performance:
 *   transform: scale(1)     (GPU handles instantly)
 *   transform: scale(1.001) (GPU handles instantly)
 *   transform: scale(1.002) (GPU handles instantly)
 *   ... 60 times per second, locked 60fps
 *
 *
 * Other good transforms:
 * ──────────────────────
 * ✅ transform: translateX(10px)  — Move horizontally
 * ✅ transform: translateY(10px)  — Move vertically
 * ✅ transform: rotate(45deg)     — Rotate element
 * ✅ transform: skew(10deg)       — Shear/slant
 * ✅ transform: perspective(100px) — 3D depth
 *
 * Transforms can be combined:
 *   transform: scale(1.02) translateY(-2px) rotate(1deg)
 *   All calculated by GPU simultaneously, no CPU cost
 *
 *
 * Safe CSS properties to animate:
 * ───────────────────────────────
 * ✅ transform (scale, translate, rotate, etc.)
 * ✅ opacity (transparency)
 * ⚠️ box-shadow (moderate cost, acceptable for hover)
 * ⚠️ border-color (instant, no animation)
 * ❌ width / height (layout change, expensive)
 * ❌ margin / padding (layout change, expensive)
 * ❌ left / right / top / bottom (layout change, expensive)
 * ❌ font-size (affects layout, expensive)
 *
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * HOW GPU ACCELERATION WORKS
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * CPU vs GPU Division of Labor:
 * ─────────────────────────────
 *
 * CPU (Main Thread):
 * - Processes JavaScript
 * - Calculates layout (reflow)
 * - Determines what to paint (repaint)
 * - Limited to ~16ms per frame (60fps = 1000ms/60)
 * - Slower but flexible
 *
 * GPU (Graphics Card):
 * - Renders transforms
 * - Renders opacity
 * - Does NOT recalculate layout
 * - Does NOT repaint (uses precomputed content)
 * - Can handle 60fps+ effortlessly
 * - Faster but limited to certain properties
 *
 *
 * Transform Animation Pipeline:
 * ─────────────────────────────
 *
 * BEFORE transform (CSS layout):
 *   ┌─────────────────────────┐
 *   │ Browser Layout Engine   │ ← CPU calculates: width, height, position
 *   ├─────────────────────────┤
 *   │ Paint Layer (bitmap)    │ ← CPU draws: colors, text, images
 *   ├─────────────────────────┤
 *   │ GPU Texture (VRAM)      │ ← GPU stores: compressed image data
 *   └─────────────────────────┘
 *
 * DURING transform animation (60fps):
 *   Frame 1: scale(1.00)       ← GPU: "Render texture at 100% size"
 *   Frame 2: scale(1.00033)    ← GPU: "Render texture at 100.033% size"
 *   Frame 3: scale(1.00066)    ← GPU: "Render texture at 100.066% size"
 *   ...
 *   Frame 60: scale(1.02)      ← GPU: "Render texture at 102% size"
 *
 * Key: Layout and paint happen ONCE (at animation start)
 *      Then GPU repeats render 60 times, with different transforms
 *      No CPU involvement after initial paint
 *
 *
 * Hardware acceleration explained:
 * ────────────────────────────────
 *
 * Unaccelerated animation (width):
 *   CPU: Reflow #1  (expensive) → Paint #1 (expensive) → Render
 *   CPU: Reflow #2  (expensive) → Paint #2 (expensive) → Render
 *   CPU: Reflow #3  (expensive) → Paint #3 (expensive) → Render
 *   ...
 *   Total time: 60 expensive operations × 16ms = frame drop
 *
 * Accelerated animation (transform):
 *   CPU: Reflow (once) → Paint (once) → Create texture
 *   GPU: Render with scale(1.00)      ← Fast
 *   GPU: Render with scale(1.00033)   ← Fast
 *   GPU: Render with scale(1.00066)   ← Fast
 *   ...
 *   Total time: 1 expensive operation + 60 cheap operations
 *
 *
 * Browser compositing layers:
 * ──────────────────────────
 *
 * Modern browsers create "compositing layers" for accelerated properties:
 *
 * will-change: transform;
 *   ↓
 * Browser creates separate GPU layer
 *   ↓
 * Transform animations render on that layer
 *   ↓
 * Main page rendering unaffected
 *   ↓
 * No reflow of page layout
 *   ↓
 * Smooth 60fps
 *
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * PRACTICAL IMPLEMENTATION
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * This component uses:
 * - transform: scale() for size change (GPU accelerated)
 * - opacity changes for fade effects (GPU accelerated)
 * - Tailwind transitions for border/shadow (CSS instant, no animation)
 * - Spring physics for smooth, natural motion (SPRING_TRANSITION)
 *
 * Result: 60fps animations with zero layout shift.
 */
export function AnimatedCard({ children, className }: AnimatedCardProps) {
  return (
    <motion.article
      whileHover={HOVER_SCALE}
      transition={SPRING_TRANSITION}
      className={cn(
        "rounded-2xl border border-surface-border bg-background-card p-5",
        "cursor-pointer transition-all duration-300",
        "hover:shadow-glow hover:border-accent/30",
        "h-full",
        className
      )}
    >
      {children}
    </motion.article>
  );
}
