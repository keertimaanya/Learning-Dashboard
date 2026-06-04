/**
 * ANIMATION REFERENCE GUIDE
 * 
 * This file documents the Framer Motion patterns used in the dashboard.
 * Use this as a reference when implementing new animations.
 */

// ═══════════════════════════════════════════════════════════════════════════
// PATTERN 1: SIDEBAR TOGGLE ANIMATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Demonstrates coordinated multi-element animations.
 * All animations triggered by a single state change (isCollapsed).
 * 
 * Architecture:
 * - useSidebar hook manages state + responsive logic
 * - Sidebar component reads state, updates UI
 * - Framer Motion components animate on prop changes
 * 
 * Three simultaneous animations:
 * 1. Width morphs (256px ← → 72px)
 * 2. Text fades (opacity 0 ← → 1)
 * 3. Chevron rotates (0° ← → 180°)
 */

// From useSidebar hook:
// const { isCollapsed, toggle, width } = useSidebar();
// 
// width = isCollapsed ? 72 : 256

// In Sidebar component:
// <motion.aside animate={{ width }} transition={{ spring physics }}>
//   {/* All children re-render when width changes */}
//   {!isCollapsed && <motion.span>{/* fades in */}</motion.span>}
// </motion.aside>
//
// <motion.div animate={{ rotate: isCollapsed ? 180 : 0 }}>
//   {/* chevron rotates */}
// </motion.div>

/**
 * Timeline of events (in milliseconds):
 * 
 * User clicks toggle button:
 *   0ms  → onClick fires, toggle() called
 *   1ms  → isCollapsed: false → true
 *   5ms  → Sidebar re-renders with new width value
 *   10ms → Framer Motion detects width change
 *   10ms → Spring animation starts (all three elements)
 *   50ms → ~20% complete (width: 256 → 230, opacity: 0 → 0.6, rotate: 0 → 36°)
 *   150ms → ~70% complete (width: 256 → 100, opacity: 1, rotate: 126°)
 *   250ms → ~95% complete (width: 256 → 74, opacity: 1, rotate: 171°)
 *   300ms → Complete (width: 72, opacity: 1, rotate: 180°)
 * 
 * Total duration: ~300ms (feels instantaneous but smooth)
 */

// ═══════════════════════════════════════════════════════════════════════════
// PATTERN 2: PROGRESS BAR UPDATE ANIMATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Demonstrates how to re-trigger animations when data changes.
 * 
 * Problem: If you just change the animate prop, existing animation won't restart.
 * Example:
 *   <motion.div animate={{ scaleX: value / 100 }} />
 *   
 *   Initial render (value = 45):
 *     - initial={{ scaleX: 0 }} applied
 *     - animate{{ scaleX: 0.45 }} takes over
 *     - Animation runs (invisible → 45%)
 *   
 *   Value updates (value = 60):
 *     - animate prop changes to {{ scaleX: 0.60 }}
 *     - BUT animation already finished
 *     - Just jumps to 60% (no animation, bad UX)
 * 
 * Solution: Use a key that changes when progress is meaningful
 */

// From ProgressBar component:
// const progressKey = `progress-${Math.floor(value / 10)}`;
// <motion.div key={progressKey} initial={{ scaleX: 0 }} animate={{ scaleX: value / 100 }} />

/**
 * How the key forces re-animation:
 * 
 * Progress = 45%:
 *   key = "progress-4"
 *   Element mounts
 *   initial applied, then animate
 *   Bar fills from 0 → 45%
 *
 * Progress = 50%:
 *   key = "progress-5" (key changed!)
 *   React says: "This is a different element"
 *   Old element unmounts
 *   New element mounts
 *   initial{{ scaleX: 0 }} applied (bar resets)
 *   animate to 50% (animation restarts)
 *   Bar fills from 0 → 50%
 *
 * Progress = 51%, 52%, 53%... 59%:
 *   key = "progress-5" (key unchanged)
 *   No remount, just animate prop updates
 *   Smooth transitions between values
 *   No jarring re-animation
 *
 * Progress = 60%:
 *   key = "progress-6" (key changed!)
 *   Full re-animation triggers again
 *   Bar fills from 0 → 60%
 */

/**
 * Benefits of this approach:
 * 
 * ✅ Animations trigger on meaningful milestones (every 10%)
 * ✅ Small increments don't waste animation cycles
 * ✅ Users see visual feedback when they progress
 * ✅ Smooth and performant
 * ✅ Works for any value range (0-100, 0-1000, etc.)
 */

// ═══════════════════════════════════════════════════════════════════════════
// PATTERN 3: SPRING PHYSICS COMPARISON
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Your dashboard uses: stiffness: 300, damping: 30
 * 
 * This is a "medium-tight" spring with subtle bounce.
 * Good for professional dashboards (responsive, not bouncy).
 * 
 * Other options:
 */

// Stiff spring (fast, minimal bounce)
const STIFF = {
  type: "spring",
  stiffness: 500,  // Higher = faster
  damping: 40,     // Higher = less bounce
};
// Visual: ▃▄▅█ (quick, professional)

// Medium spring (balanced, moderate bounce)
const MEDIUM = {
  type: "spring",
  stiffness: 300,  // Your dashboard's choice
  damping: 30,
};
// Visual: ▃▄▅███▅▄ (bouncy but controlled)

// Loose spring (slow, elastic bounce)
const LOOSE = {
  type: "spring",
  stiffness: 100,
  damping: 10,
};
// Visual: ▂▃▄█▇▆▅▄▃ (very bouncy, playful)

// Tween (not spring, linear over time)
const TWEEN = {
  type: "tween",
  duration: 0.5,
  ease: "easeInOut",
};
// Visual: ▁▂▃▄▅▆▇█ (predictable, robotic)

/**
 * Recommendation:
 * - Dashboard/business apps → Medium spring (stiffness: 300, damping: 30)
 * - Gaming/entertainment → Loose spring (stiffness: 100, damping: 10)
 * - Precise timing needed → Tween (duration: 0.5, ease: easeInOut)
 */

// ═══════════════════════════════════════════════════════════════════════════
// PATTERN 4: INITIAL VS UPDATE ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Different delays for initial load vs user-triggered updates.
 * 
 * INITIAL LOAD:
 * - User just opened the page
 * - Lots of elements animating in (staggered)
 * - Add 0.5s delay so it doesn't feel chaotic
 * - delay: 0.5
 * 
 * UPDATE:
 * - User just clicked something
 * - Expects immediate visual feedback
 * - No delay, instant animation
 * - delay: 0
 */

// ProgressBar on page load (initial load):
// <motion.div
//   initial={{ scaleX: 0 }}
//   animate={{ scaleX: value / 100 }}
//   transition={{ ...SPRING, delay: 0.5 }}  // Wait 500ms
// />

// ProgressBar when updated (user action):
// Removed from "progress-4" key, now "progress-5"
// New element mounts:
// <motion.div
//   initial={{ scaleX: 0 }}
//   animate={{ scaleX: value / 100 }}
//   transition={{ ...SPRING, delay: 0 }}  // No delay, immediate
// />

/**
 * Why this matters:
 * - On page load: Staggered animations look intentional and polished
 * - On user action: No delay makes the app feel responsive and snappy
 */

// ═══════════════════════════════════════════════════════════════════════════
// PATTERN 5: KEY CHANGES FOR RE-ANIMATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * React's reconciliation algorithm:
 * 
 * Without key change:
 * <motion.div animate={{ scaleX: 0.45 }} />  // Animation runs
 * <motion.div animate={{ scaleX: 0.60 }} />  // Just updates, no animation
 * 
 * With key change:
 * <motion.div key="progress-4" animate={{ scaleX: 0.45 }} />  // Animation runs
 * <motion.div key="progress-6" animate={{ scaleX: 0.60 }} />  // NEW element, animation runs
 * 
 * The key change forces React to treat it as a different element,
 * triggering mount lifecycle and Framer Motion animations.
 */

// ═══════════════════════════════════════════════════════════════════════════
// IMPLEMENTATION CHECKLIST
// ═══════════════════════════════════════════════════════════════════════════

/**
 * When adding animations to your dashboard, ask yourself:
 * 
 * [ ] Am I using motion components? (motion.div, motion.span, etc.)
 * [ ] Do I have an initial state? (initial prop)
 * [ ] Do I have an animate state? (animate prop)
 * [ ] Is my transition appropriate? (spring vs tween, right stiffness/damping)
 * [ ] Is the animation re-triggering correctly? (key change if needed)
 * [ ] Does it feel natural? (not too fast, not too slow)
 * [ ] Is it purposeful? (advances the UX, not just flashy)
 * [ ] Does it sync with other animations? (staggered entrance, coordinated actions)
 * [ ] Will it work on slow devices? (test on mobile)
 * [ ] Is it accessible? (avoid motion if user prefers reduced motion)
 * 
 * Pro tip: Use your dashboard's animations as reference.
 * They're production-grade patterns.
 */
