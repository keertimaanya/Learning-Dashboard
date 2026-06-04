"use client";

import { motion } from "framer-motion";
import { DynamicIcon } from "@/components/ui/dynamic-icon";
import { NavItem } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * SidebarItem — Navigation link with layoutId-based active indicator.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * SHARED LAYOUT ANIMATIONS (layoutId Feature)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * What is layoutId?
 * ────────────────
 * layoutId is a Framer Motion prop that creates "shared layout animations".
 *
 * Key idea: When multiple elements share the same layoutId:
 * - Only ONE of them renders at a time
 * - When switching, animation smoothly morphs from old element to new one
 * - Position and size animate to match the new element
 *
 * Example in code:
 *
 *   <motion.div layoutId="sidebar-active" />  ← Only renders when isActive
 *
 * When isActive changes from item A to item B:
 * 1. Element under item A is visible
 * 2. User clicks item B
 * 3. Element smoothly moves and resizes to match item B position/size
 * 4. Framer Motion tracks: old element position → new element position
 *
 *
 * How Framer Motion Tracks Positions
 * ──────────────────────────────────
 *
 * BEFORE layoutId animation:
 * ─────────────────────────
 *
 * Sidebar rendered:
 *   ┌──────────────────────────┐
 *   │ [Icon] Home              │ ← Item A
 *   │ [Icon] Dashboard         │ ← Item B (blue highlight)
 *   │ [Icon] Settings          │ ← Item C
 *   └──────────────────────────┘
 *
 * Current DOM structure:
 *   <button>                        (Dashboard)
 *     <motion.div layoutId="sidebar-active">
 *       ← Highlight background
 *     </motion.div>
 *     <span>Dashboard icon</span>
 *     <span>Dashboard label</span>
 *   </button>
 *
 * Framer Motion notes:
 *   - layoutId="sidebar-active" element exists
 *   - Position: top: 56px, left: 12px, height: 44px, width: 240px
 *   - Stored in: "Element position snapshot"
 *
 *
 * User clicks Home:
 * ─────────────────
 *
 * React updates:
 *   Dashboard: isActive = false  → layoutId element REMOVED from DOM
 *   Home:      isActive = true   → layoutId element ADDED to DOM
 *
 * New DOM:
 *   <button>                        (Home)
 *     <motion.div layoutId="sidebar-active">
 *       ← Highlight background
 *     </motion.div>
 *     <span>Home icon</span>
 *     <span>Home label</span>
 *   </button>
 *
 * Framer Motion does the magic:
 *   1. Detects: layoutId="sidebar-active" changed location
 *   2. Reads old position snapshot: {top: 56px, height: 44px}
 *   3. Reads new position from Home button: {top: 12px, height: 44px}
 *   4. Recognizes same layoutId, triggers shared layout animation
 *   5. Animates element from {top: 56px} → {top: 12px}
 *   6. Runs over ~300ms (spring physics from transition)
 *   7. Smoothly moves the highlight background
 *
 * Visual result: Blue highlight smoothly slides up from Dashboard to Home
 *
 *
 * Position Tracking Algorithm
 * ──────────────────────────
 *
 * Framer Motion uses the browser's Layout API:
 *
 * Step 1: Snapshot old layout
 *   oldPosition = {
 *     top: 56,
 *     left: 12,
 *     width: 240,
 *     height: 40
 *   }
 *
 * Step 2: Element gets removed, then immediately added in new location
 *   React DOM updated
 *
 * Step 3: Measure new layout
 *   newPosition = {
 *     top: 12,
 *     left: 12,
 *     width: 240,
 *     height: 40
 *   }
 *
 * Step 4: Calculate difference
 *   deltaY = oldPosition.top - newPosition.top
 *          = 56 - 12
 *          = 44 pixels (difference)
 *
 * Step 5: Apply transform to compensate
 *   Initial: transform: translateY(44px)
 *   Animate: transform: translateY(0px)
 *   This makes element appear in old position initially, then slide to new
 *
 * Step 6: Animate transform
 *   Frame 0:   translateY(44px)      (appears at old location)
 *   Frame 10:  translateY(33px)      (sliding up)
 *   Frame 20:  translateY(22px)      (sliding up)
 *   ...
 *   Frame 30:  translateY(0px)       (at new location)
 *
 * Visual effect: Highlight smoothly slides from old to new position
 *
 *
 * Why transformOrigin matters (for more complex animations):
 * ──────────────────────────────────────────────────────────
 *
 * If highlight needed to change size:
 *   Old:  width: 240px
 *   New:  width: 200px
 *
 * Framer Motion would scale transform:
 *   Initial:  scaleX(1.2)    (stretched to 240px)
 *   Animate:  scaleX(1.0)    (shrinks to 200px)
 *
 * transformOrigin: "center" (default):
 *   Shrinks from center (both sides shrink equally)
 *
 * transformOrigin: "left":
 *   Shrinks from left edge (right edge shrinks)
 *
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * LAYOUT ANIMATION LIFECYCLE
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Event: User clicks new navigation item
 * Timeline:
 *
 * T=0ms:   Click detected
 *          onClick handler fires
 *          setActiveItem(newItem) called
 *          React re-renders Sidebar
 *
 * T=1ms:   React DOM update completes
 *          Old layoutId element removed
 *          New layoutId element added at new position
 *          Browser has NOT painted yet
 *
 * T=2ms:   Framer Motion layout detection
 *          Detects: layoutId elements moved
 *          Measures: old position vs new position
 *          Calculates: delta transform needed
 *
 * T=3ms:   Animation setup
 *          Applies compensating transform (hide true position)
 *          Sets up spring animation curve
 *          Caches: animation parameters
 *
 * T=4ms:   Frame 0 of animation
 *          Applies initial transform (shows old position)
 *          Browser paints first frame
 *          User sees highlight at old position
 *
 * T=20ms:  Frame 5 of animation
 *          Transform interpolated to intermediate value
 *          Highlight is moving, halfway between old and new
 *
 * T=304ms: Final frame
 *          Transform: translateY(0) applied
 *          Highlight at final position
 *
 * T=305ms: Animation complete
 *          Element settles
 *          User sees final state: highlight under new item
 *
 * Total animation duration: ~300ms (imperceptible, feels instant)
 *
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * COMPARISON: With vs Without layoutId
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * WITHOUT layoutId (bad):
 * ──────────────────────
 * Code:
 *   {isActive && <div className="bg-blue">Active</div>}
 *
 * User experience:
 *   Click Dashboard → Highlight appears under Dashboard (instant)
 *   Click Home     → Highlight disappears, appears under Home (instant)
 *   Click Settings → Highlight disappears, appears under Settings (instant)
 *
 * Visual: Highlight pops/jumps (feels abrupt, unintuitive)
 *
 *
 * WITH layoutId (good):
 * ────────────────────
 * Code:
 *   {isActive && (
 *     <motion.div layoutId="sidebar-active">
 *       Active background
 *     </motion.div>
 *   )}
 *
 * User experience:
 *   Click Dashboard → Highlight under Dashboard
 *   Click Home     → Highlight smoothly slides up to Home
 *   Click Settings → Highlight smoothly slides down to Settings
 *
 * Visual: Highlight slides smoothly (feels polished, intuitive)
 *
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * IMPLEMENTATION NOTES
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Why only one layoutId element?
 * ──────────────────────────────
 * Multiple elements with same layoutId at same time causes issues.
 * That's why:
 *   {isActive && <motion.div layoutId="sidebar-active" />}
 *
 * Not:
 *   <motion.div layoutId="sidebar-active" opacity={isActive ? 1 : 0} />
 *   ^ This would have element exist but hidden, confusing Framer Motion
 *
 *
 * Why not animate opacity?
 * ────────────────────────
 * Could fade out old, fade in new:
 *   Old item: opacity 1 → 0
 *   New item: opacity 0 → 1
 *
 * But this looks bad:
 *   - Both highlights visible briefly (confusing)
 *   - Fading looks less intentional than sliding
 *   - Harder to track element movement visually
 *
 * layoutId is better:
 *   - Same highlight moves (clear intention)
 *   - Position change obvious (satisfying)
 *   - Professional, polished effect
 *
 *
 * Transition customization:
 * ──────────────────────────
 * Current:
 *   transition={{ type: "spring", stiffness: 300, damping: 25 }}
 *
 * More bouncy:
 *   transition={{ type: "spring", stiffness: 300, damping: 15 }}
 *
 * Faster:
 *   transition={{ type: "spring", stiffness: 400, damping: 30 }}
 *
 * Linear (robot-like):
 *   transition={{ type: "tween", duration: 0.2 }}
 *
 * Elastic (bouncy):
 *   transition={{ type: "spring", stiffness: 200, damping: 10 }}
 *
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * PROFESSIONAL DESIGN INSIGHT
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Layout animations signal intention:
 *
 * Regular web (no animation):
 *   User sees: Highlight jumps around
 *   User thinks: Basic, low-effort design
 *
 * With layout animation:
 *   User sees: Highlight smoothly follows mouse
 *   User thinks: Polished, high-quality design
 *
 * The animation doesn't add functionality.
 * But it adds perceived quality and professionalism.
 * Small detail, big impact.
 *
 * This is why modern design-forward products (Figma, Linear, Vercel)
 * all use layout animations in navigation.
 */
export function SidebarItem({
  item,
  isActive,
  isCollapsed,
  onClick,
}: {
  item: NavItem;
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
        "text-text-secondary hover:text-text-primary",
        isCollapsed && "justify-center px-0"
      )}
    >
      {/* Active indicator — animated with layoutId */}
      {isActive && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute inset-0 rounded-lg bg-surface"
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        />
      )}

      {/* Icon */}
      <span className="relative z-10 shrink-0">
        <DynamicIcon
          name={item.icon}
          size={20}
          className={isActive ? "text-accent" : ""}
        />
      </span>

      {/* Label (hidden when collapsed) */}
      {!isCollapsed && (
        <span className="relative z-10 whitespace-nowrap">{item.label}</span>
      )}
    </button>
  );
}
