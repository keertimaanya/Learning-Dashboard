// ── Framer Motion Shared Configs ──────────────────────────
// Centralizing animation tokens so every component uses
// the same physics. Change once, update everywhere.

/**
 * SPRING_TRANSITION: Physics-based animation (natural, bouncy)
 * 
 * stiffness: 300    → "tight spring" → responsive, snappy
 * damping: 20       → "moderate bounce" → subtle oscillation
 * 
 * This feels more natural than tween (linear) animation.
 * It's the sweet spot for professional dashboards.
 * 
 * Timeline (~300ms):
 *   0ms:   Start moving
 *   100ms: Fast acceleration
 *   200ms: Slight overshoot (spring physics)
 *   300ms: Settles at target
 */
export const SPRING_TRANSITION = {
  type: "spring" as const,
  stiffness: 300,
  damping: 20,
};

/**
 * STAGGER_CONTAINER: Parent variant that orchestrates children
 * 
 * Used by: BentoGrid (motion.section)
 * Purpose: Tell children when to animate and how much to wait between them
 * 
 * delayChildren: 0.2
 *   - Wait 200ms after page load before starting first child
 *   - Lets page settle, doesn't feel chaotic
 *   - User sees layout before animations
 * 
 * staggerChildren: 0.1
 *   - Each child starts 100ms after the previous one
 *   - Smooth cascade effect
 *   - Not too fast (would overlap), not too slow (feels dead)
 * 
 * Timeline calculation:
 *   delayChildren = 200ms
 *   staggerChildren = 100ms
 *   
 *   Child[0] starts at: 200ms (+ 100*0)
 *   Child[1] starts at: 300ms (+ 100*1)
 *   Child[2] starts at: 400ms (+ 100*2)
 *   Child[3] starts at: 500ms (+ 100*3)
 *   Child[4] starts at: 600ms (+ 100*4)
 *   etc.
 * 
 * Formula: startTime = delayChildren + (staggerChildren * childIndex)
 */
export const STAGGER_CONTAINER = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

/**
 * STAGGER_ITEM: Child variant that defines animation behavior
 * 
 * Used by: HeroTile, CourseTile, ActivityTile
 * Purpose: Define what animation each child does
 * 
 * hidden state:
 *   opacity: 0      → Invisible
 *   y: 20          → 20px lower than final position
 * 
 * visible state:
 *   opacity: 1      → Fully visible
 *   y: 0           → At final position
 *   transition: SPRING_TRANSITION → Uses spring physics
 * 
 * Animation sequence:
 * 1. Component renders with hidden state
 * 2. Parent tells it to animate to visible
 * 3. Spring kicks in: opacity 0→1, y 20→0
 * 4. Takes ~300ms (determined by SPRING_TRANSITION)
 * 5. Settles and stays at visible state
 * 
 * Why this combination?
 *   - opacity fade-in = content appears
 *   - y slide-up = slight upward motion = energy, life
 *   - Together = feels like content is emerging/floating up
 */
export const STAGGER_ITEM = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: SPRING_TRANSITION,
  },
};

/**
 * HOVER_SCALE: Hover effect variant for interactive cards
 * 
 * Used by: AnimatedCard (motion.article)
 * Purpose: Slightly enlarge card when user hovers
 * 
 * scale: 1.02       → Grow to 102% of original size
 * transition: SPRING → Smooth spring animation to the scale
 * 
 * Effect:
 *   Idle:    scale 1.0   (normal size)
 *   Hover:   scale 1.02  (slightly bigger)
 *   Unhover: scale 1.0   (back to normal)
 * 
 * Why 1.02 (not 1.1 or 1.2)?
 *   - Professional, subtle (not obvious)
 *   - Shows responsiveness (feels alive)
 *   - Not so big that it looks clickable (it's not, just hover effect)
 */
export const HOVER_SCALE = {
  scale: 1.02,
  transition: SPRING_TRANSITION,
};

/**
 * PROGRESS_BAR_VARIANTS: Animation timing for progress bar updates
 * 
 * Used by: ProgressBar component
 * Purpose: Different delays for initial load vs user action
 * 
 * initial transition:
 *   delay: 0.5       → Wait 500ms after page load
 *   Why? Page is busy with other animations, let it settle first
 * 
 * update transition:
 *   delay: 0         → No delay, immediate response
 *   Why? User just took an action, expects instant feedback
 * 
 * Usage:
 *   On mount: Use initial (delay: 0.5)
 *   On update: Use update (delay: 0)
 */
export const PROGRESS_BAR_VARIANTS = {
  initial: {
    scaleX: 0,
    transition: { ...SPRING_TRANSITION, delay: 0.5 },
  },
  update: {
    transition: { ...SPRING_TRANSITION, delay: 0 },
  },
};

// ── App Constants ─────────────────────────────────────────

export const SIDEBAR_WIDTH = 256; // px — matches w-64
export const SIDEBAR_COLLAPSED_WIDTH = 72; // px — icons-only mode
