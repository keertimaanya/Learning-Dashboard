/**
 * ═══════════════════════════════════════════════════════════════════════════
 * STAGGERED TILE LOADING GUIDE
 * 
 * Complete reference for how tiles cascade in on page load
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════
// ARCHITECTURE: Parent-Child Variant System
// ═══════════════════════════════════════════════════════════════════════════

/*
BentoGrid (motion.section)
├── variants={STAGGER_CONTAINER}
└── Coordinates all children:
    ├── HeroTile (motion.div with STAGGER_ITEM)
    ├── CourseTile #1 (motion.div with STAGGER_ITEM)
    ├── CourseTile #2 (motion.div with STAGGER_ITEM)
    ├── CourseTile #3 (motion.div with STAGGER_ITEM)
    ├── ... more CourseTiles ...
    └── ActivityTile (motion.div with STAGGER_ITEM)

How it works:
- BentoGrid is the PARENT (orchestra conductor)
- Each tile is a CHILD (musician)
- Parent says: "When I animate, you all animate too"
- Parent says: "But space it out: first you (200ms), then you (100ms later)"
- Each child knows HOW to animate (opacity, y, spring)
- Parent knows WHEN each child animates (timing)
*/

// ═══════════════════════════════════════════════════════════════════════════
// TIMELINE: When Each Tile Starts Animating
// ═══════════════════════════════════════════════════════════════════════════

/*
STAGGER_CONTAINER says:
  delayChildren: 0.2    (200ms initial delay)
  staggerChildren: 0.1  (100ms between each child)

Formula:
  startTime = delayChildren + (staggerChildren * childIndex)

Example with 5 children (HeroTile + 3 CourseTiles + ActivityTile):

  Child[0] (HeroTile):
    startTime = 0.2 + (0.1 * 0) = 0.2s = 200ms
    
  Child[1] (CourseTile #1):
    startTime = 0.2 + (0.1 * 1) = 0.3s = 300ms
    
  Child[2] (CourseTile #2):
    startTime = 0.2 + (0.1 * 2) = 0.4s = 400ms
    
  Child[3] (CourseTile #3):
    startTime = 0.2 + (0.1 * 3) = 0.5s = 500ms
    
  Child[4] (ActivityTile):
    startTime = 0.2 + (0.1 * 4) = 0.6s = 600ms

Timeline visualization:

Time →  0ms  100ms  200ms  300ms  400ms  500ms  600ms  700ms  800ms  900ms
         |     |      |      |      |      |      |      |      |      |
         
Page     ●────────────────────────────────────────────────────────────────
loads

Hero                      ┌─────────────────┐ (200-500ms)
                          │ Fade in + slide │
                          └─────────────────┘

Course 1                         ┌──────────────┐ (300-600ms)
                                 │ Fade + slide │
                                 └──────────────┘

Course 2                              ┌──────────┐ (400-700ms)
                                      │ Fade in  │
                                      └──────────┘

Course 3                                   ┌─────┐ (500-800ms)
                                           │ In  │
                                           └─────┘

Activity                                        ┌──┐ (600-900ms)
                                                │  │
                                                └──┘

Result: Cascading waterfall effect
*/

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATION STATES: What Each Tile Does
// ═══════════════════════════════════════════════════════════════════════════

/*
STAGGER_ITEM defines two states:

hidden (initial):
  opacity: 0    ← Completely transparent
  y: 20         ← Positioned 20px lower

visible (target):
  opacity: 1    ← Fully opaque
  y: 0          ← At normal position

Transition:
  Uses SPRING_TRANSITION
    type: "spring"
    stiffness: 300    ← Fast response
    damping: 20       ← Subtle bounce
  Duration: ~300ms

Animation curve (spring physics):
  
  opacity  │     opacity   ┌─────
           │ 1.0  ┌───────┤     │ (final state)
           │      │     ╱       │
           │      │   ╱         │
           │ 0.5  │ ╱           │
           │      │             │ (overshoots slightly)
           │ 0.0  └─────────────┘
           └──────┴─────────────┴──── time
                200ms    300ms

  y position
           │
          20px │         ╱────
              │       ╱       ╲
               │     ╱         ╲ (bounces back)
              0px │ ╱───────────┘
           │      │
           └──────┴──────────────── time


Together (opacity + y):
  0ms:    Invisible, 20px lower
  100ms:  Fading in, sliding up
  200ms:  Fully visible, slightly bounces
  300ms:  Settles in final position
*/

// ═══════════════════════════════════════════════════════════════════════════
// COORDINATE SYSTEM: How React + Framer Motion Work Together
// ═══════════════════════════════════════════════════════════════════════════

/*
STEP 1: React renders the tree
─────────────────────────────
<motion.section variants={STAGGER_CONTAINER} initial="hidden" animate="visible">
  <motion.div variants={STAGGER_ITEM} />  ← HeroTile
  <motion.div variants={STAGGER_ITEM} />  ← CourseTile #1
  <motion.div variants={STAGGER_ITEM} />  ← CourseTile #2
  ...
</motion.section>

All children render IMMEDIATELY.
All start in "hidden" state (invisible).

STEP 2: Framer Motion reads initial prop
─────────────────────────────────────────
Parent: initial="hidden"
  → Apply STAGGER_CONTAINER.hidden to self
  → Tell children to use "hidden" state too
  → All children: opacity 0, y 20 (invisible, low)

STEP 3: Framer Motion reads animate prop
────────────────────────────────────────
Parent: animate="visible"
  → Read STAGGER_CONTAINER.visible
  → Found: { delayChildren: 0.2, staggerChildren: 0.1 }
  → Tell children: "You animate too, but space it out"

STEP 4: Framer Motion orchestrates children
─────────────────────────────────────────
Parent has staggering config
  → Child[0]: Start immediately (at time 200ms)
  → Child[1]: Wait 100ms, then start (at time 300ms)
  → Child[2]: Wait 200ms, then start (at time 400ms)

Each child runs its own animation:
  → Read its STAGGER_ITEM.visible
  → opacity 0→1, y 20→0
  → With spring transition
  → Duration ~300ms

STEP 5: All animations run in parallel with offsets
──────────────────────────────────────────────────
HeroTile starts at 200ms, finishes at 500ms
  while
CourseTile #1 starts at 300ms, finishes at 600ms
  while
CourseTile #2 starts at 400ms, finishes at 700ms
  etc.

Result: Cascading, overlapping animations
*/

// ═══════════════════════════════════════════════════════════════════════════
// VISUAL RESULT: What the User Sees
// ═══════════════════════════════════════════════════════════════════════════

/*
Time 0ms:
┌─────────────────────────────────────┐
│ Page loads, all tiles invisible      │
│                                      │
└─────────────────────────────────────┘

Time 200ms:
┌─────────────────────────────────────┐
│ ███████████████████████████████      │ ← HeroTile fading in
│                                      │
└─────────────────────────────────────┘

Time 300ms:
┌─────────────────────────────────────┐
│ █████████████████████████████████    │ ← HeroTile mostly done
│ ██████████                           │ ← CourseTile #1 starting
│                                      │
└─────────────────────────────────────┘

Time 400ms:
┌─────────────────────────────────────┐
│ ██████████████████████████████████   │ ← HeroTile done
│ ██████████████████████               │ ← CourseTile #1 mid-animation
│ █████████                            │ ← CourseTile #2 starting
│                                      │
└─────────────────────────────────────┘

Time 500ms:
┌─────────────────────────────────────┐
│ Welcome back, Keerti 👋              │ ← HeroTile done
│ ██████████████████████████████████   │ ← CourseTile #1 done
│ ███████████████████████              │ ← CourseTile #2 mid
│ ██████████                           │ ← CourseTile #3 starting
└─────────────────────────────────────┘

Time 600ms:
┌─────────────────────────────────────┐
│ Welcome back, Keerti 👋              │
│ JavaScript Fundamentals      45%     │
│ React Mastery                78%     │
│ Web Design Basics            20%     │ ← All courses done
│ ██████████                           │ ← ActivityTile starting
└─────────────────────────────────────┘

Time 900ms:
┌─────────────────────────────────────┐
│ Welcome back, Keerti 👋              │
│ JavaScript Fundamentals      45%     │
│ React Mastery                78%     │
│ Web Design Basics            20%     │
│ ███████████████████████████████████  │ ← ActivityTile done
│ [Contribution grid animating in]     │   (grid squares ripple)
└─────────────────────────────────────┘

Time 1200ms:
┌─────────────────────────────────────┐
│ Welcome back, Keerti 👋              │
│ JavaScript Fundamentals      45%     │
│ React Mastery                78%     │
│ Web Design Basics            20%     │
│ Learning Activity             ▓▓▓▓   │ ← Grid squares done
│ [Full contribution heatmap]    ▓▓▓   │
└─────────────────────────────────────┘

Overall effect: Professional cascade, not overwhelming
*/

// ═══════════════════════════════════════════════════════════════════════════
// KEY CONCEPTS
// ═══════════════════════════════════════════════════════════════════════════

/*
1. PARENT CONTROLS TIMING
   - BentoGrid doesn't animate itself
   - It tells children when to start
   - Children don't know about timing
   - Parent coordinates all timing

2. CHILDREN CONTROL BEHAVIOR
   - Each child knows how to animate (opacity, y, spring)
   - Children don't know when to start
   - Parent decides timing
   - Clean separation of concerns

3. VARIANTS ARE BLUEPRINTS
   - STAGGER_CONTAINER is a blueprint for parents
   - STAGGER_ITEM is a blueprint for children
   - Change the blueprint, all components update
   - Reusable everywhere

4. SPRING PHYSICS FEELS NATURAL
   - Tween (linear) feels robotic
   - Spring feels bouncy, alive
   - stiffness: 300 is snappy but not chaotic
   - damping: 20 provides subtle bounce

5. STAGGERING CREATES FLOW
   - All-at-once = chaotic, overwhelming
   - Staggered = guided, polished
   - 100ms between items feels right
   - Not too fast, not too slow

6. REACT RENDERS IMMEDIATELY
   - React doesn't wait for animations
   - All children are in the DOM instantly
   - Framer Motion staggers the visual animation
   - Efficient, no layout thrashing
*/

// ═══════════════════════════════════════════════════════════════════════════
// ADJUSTING THE EFFECT: Customization Guide
// ═══════════════════════════════════════════════════════════════════════════

/*
Want slower cascade? Increase staggerChildren:

export const STAGGER_CONTAINER = {
  visible: {
    transition: {
      staggerChildren: 0.15,  // ← Was 0.1, now 150ms between children
      delayChildren: 0.2,
    },
  },
};

Want faster overall animations? Decrease delayChildren:

export const STAGGER_CONTAINER = {
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,  // ← Was 0.2, now only 50ms initial wait
    },
  },
};

Want bouncier animations? Decrease damping:

export const SPRING_TRANSITION = {
  type: "spring",
  stiffness: 300,
  damping: 15,  // ← Was 20, now more bouncy
};

Want more dramatic initial position? Change y value:

export const STAGGER_ITEM = {
  hidden: { opacity: 0, y: 50 },  // ← Was 20, now starts 50px lower
  visible: { opacity: 1, y: 0 },
};

Want fade-only (no slide)? Remove y:

export const STAGGER_ITEM = {
  hidden: { opacity: 0 },  // ← No y
  visible: { opacity: 1 },
};

Want scale animation instead? Replace y with scale:

export const STAGGER_ITEM = {
  hidden: { opacity: 0, scale: 0.9 },  // ← Starts small
  visible: { opacity: 1, scale: 1.0 }, // ← Scales up
};
*/

// ═══════════════════════════════════════════════════════════════════════════
// SUMMARY
// ═══════════════════════════════════════════════════════════════════════════

/*
Your dashboard implements PROFESSIONAL staggered tile loading:

✅ Parent-child variant coordination
✅ Configurable timing (delayChildren, staggerChildren)
✅ Spring physics for natural feel
✅ Cascading entrance (top-to-bottom flow)
✅ Polished, not chaotic
✅ Efficient (React renders all immediately)
✅ Reusable (one constant update changes everything)

The tiles:
1. HeroTile         → Starts at 200ms
2. CourseTile ×N   → Each starts 100ms after previous
3. ActivityTile     → Starts last, after all courses

Visual effect:
- Tiles cascade in like dominoes
- Creates sense of flow and intentionality
- Users see content appearing gradually (not overwhelming)
- Professional, polished feel

This is production-grade animation architecture.
*/
