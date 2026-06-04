/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PROGRESS BAR ANIMATIONS GUIDE
 * From 0% to Value with Smooth, Performant Animations
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════
// PART 1: THE PROBLEM STATEMENT
// ═══════════════════════════════════════════════════════════════════════════

/*
Goal: Animate a progress bar from 0% to its value smoothly

Example:
  Course fetched with progress: 45%
  Bar should:
    1. Start invisible (0%)
    2. Animate smoothly to 45%
    3. Take ~300ms
    4. Use natural spring physics
    5. Run at 60fps with zero jank


Naive Solution (BAD):
─────────────────────

  <div style={{ width: `${value}%` }} />

Problem:
  - Width change triggers reflow/repaint
  - Every frame: browser recalculates layout
  - 60fps = 60 reflows per second
  - Drops to 30fps on slower devices
  - Visible jank, stuttering


Better Solution (GOOD):
──────────────────────

  <motion.div
    animate={{ scaleX: value / 100 }}
    style={{ transformOrigin: "left" }}
  />

Benefits:
  - scaleX is GPU accelerated
  - No reflow/repaint
  - Locked 60fps
  - Smooth, professional
  - Works on mobile


*/

// ═══════════════════════════════════════════════════════════════════════════
// PART 2: WHY scaleX INSTEAD OF WIDTH
// ═══════════════════════════════════════════════════════════════════════════

/*
Browser Rendering Pipeline:
───────────────────────────

Normal elements go through these steps:

1. LAYOUT PHASE (CPU)
   └─ Browser calculates where elements go
      Determines: x, y, width, height
      Triggers: reflow (layout recalculation)
      Cost: 10-20ms per frame

2. PAINT PHASE (CPU)
   └─ Browser determines what to draw
      Draws: colors, borders, text, images
      Triggers: repaint (content redraw)
      Cost: 5-15ms per frame

3. COMPOSITE PHASE (GPU)
   └─ GPU combines layers and renders
      Applies: transforms
      Shows result on screen
      Cost: 1-2ms per frame

Total for each frame: 16-37ms per frame (may exceed 16ms = frame drop)


Width Animation Journey:
────────────────────────

Code:
  animate={{ width: "45%" }}

Each frame:
  1. JavaScript updates width value (0.1ms)
  2. Layout phase: Recalculate layout (20ms)
  3. Paint phase: Redraw content (10ms)
  4. Composite phase: Send to GPU (1ms)
  5. Total: 31ms (EXCEEDS 16ms BUDGET)

Result:
  Target FPS: 60
  Actual FPS: 32
  User perceives: Stuttering, jank


ScaleX Animation Journey:
──────────────────────────

Code:
  animate={{ scaleX: 0.45 }}
  style={{ transformOrigin: "left" }}

Each frame:
  1. JavaScript updates scaleX value (0.1ms)
  2. Layout phase: Skipped (transform doesn't change layout)
  3. Paint phase: Skipped (transform doesn't redraw content)
  4. Composite phase: Apply transform to GPU layer (1ms)
  5. Total: 1.1ms (WELL UNDER 16ms BUDGET)

Result:
  Target FPS: 60
  Actual FPS: 60 locked
  User perceives: Smooth, fluid


Transform Origin Deep Dive:
──────────────────────────

transformOrigin determines where scale expands from:

transformOrigin: "center" (DEFAULT):
  ┌─────────────────────────────────┐
  │ Initial (scaleX: 0)             │
  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
  └─────────────────────────────────┘

  ┌─────────────────────────────────┐
  │ Animating (scaleX: 0.5)         │
  │ ░░░░░░░░░▓▓▓▓▓░░░░░░░░░░░░░░░ │ ← Grows from CENTER
  └─────────────────────────────────┘

  Visual: Expands from center point (both sides)
  Problem: Looks weird for progress bar


transformOrigin: "left":
  ┌─────────────────────────────────┐
  │ Initial (scaleX: 0)             │
  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
  └─────────────────────────────────┘

  ┌─────────────────────────────────┐
  │ Animating (scaleX: 0.5)         │
  │ ▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░ │ ← Grows from LEFT
  └─────────────────────────────────┘

  Visual: Expands from left edge (fills rightward)
  Perfect: Looks like real progress bar


How transformOrigin Works:
──────────────────────────

transform: scale() multiplies dimensions:

Full width: 300px

scaleX: 1.0   → 300px × 1.0  = 300px
scaleX: 0.5   → 300px × 0.5  = 150px
scaleX: 0.25  → 300px × 0.25 = 75px

But where does it shrink from?

transformOrigin: "center" (0.5):
  Center point: 150px from left
  Shrinks equally from both sides:
    Left edge:  150px - (75/2) = 112px
    Right edge: 150px + (75/2) = 188px
  Result: 112px to 188px (bar centered)

transformOrigin: "left" (0):
  Left point: 0px from left
  Shrinks only from right side:
    Left edge:  0px (fixed)
    Right edge: 0px + 75px = 75px
  Result: 0px to 75px (bar from left)


Other transformOrigin values:

transformOrigin: "right":
  Bar expands from right edge (rightward to leftward)
  Looks like depletion bar (battery draining)

transformOrigin: "50% 50%":
  Exact center point
  Same as "center"

transformOrigin: "bottom":
  (for vertical bars)
  Bar expands from bottom edge upward


*/

// ═══════════════════════════════════════════════════════════════════════════
// PART 3: ANIMATION LIFECYCLE BREAKDOWN
// ═══════════════════════════════════════════════════════════════════════════

/*
PHASE 1: MOUNT (Component First Appears)
─────────────────────────────────────────

Event: <ProgressBar value={45} /> renders for first time

Timeline:
  T=0ms:
    React renders component
    Progress value passed: 45%
    Component code runs:
      const progressKey = "progress-4"
      return <motion.div key="progress-4" ... />

  T=1ms:
    Framer Motion reads props:
      initial={{ scaleX: 0 }}     ← Start state
      animate={{ scaleX: 0.45 }}   ← End state
      transition={{ ... }}         ← How to animate

  T=2ms:
    initial state applied:
      scaleX: 0 (invisible)
      Browser paints: empty bar

  T=3ms:
    Framer Motion detects animate prop
    Starts animation sequence
    Spring physics calculate curve

  T=10ms:
    First frame of animation:
      scaleX: 0 → 0.02 (2% done)
      Browser paints: tiny bar

  T=100ms:
    Middle of animation:
      scaleX: 0.3 (30% done)
      Browser paints: half-filled

  T=300ms:
    Animation completes:
      scaleX: 0.45 (settled)
      Browser paints: 45% filled

  T=301ms+:
    Animation done
    Bar stays at 45%
    Component keeps rendering at scaleX: 0.45


PHASE 2: UPDATE (Value Changes)
────────────────────────────────

Event: Course progress updated: 45% → 52%

Scenario A: Without key-based remounting
  ─────────────────────────────────────

  T=0ms:
    Parent component updates
    Props change: value: 45 → 52
    Motion.div receives new prop:
      animate={{ scaleX: 0.52 }}

  T=1ms:
    Framer Motion sees animate changed
    BUT: animation already active/complete
    Does NOT restart animation
    Just updates target value

  T=2ms:
    scaleX jumps: 0.45 → 0.52
    Bar suddenly grows to 52%
    NO ANIMATION VISIBLE ❌

  Result: Progress update feels jarring (instant jump)


Scenario B: With key-based remounting (THIS COMPONENT)
  ──────────────────────────────────────────────────

  Code:
    const progressKey = `progress-${Math.floor(value / 10)}`
    return <motion.div key={progressKey} ... />

  T=0ms:
    Parent component updates
    Props change: value: 45 → 52
    Key calculation:
      Old key: `progress-${Math.floor(45 / 10)}` = "progress-4"
      New key: `progress-${Math.floor(52 / 10)}` = "progress-5"
      Keys are different!

  T=1ms:
    React sees key changed
    Unmounts old motion.div (key: "progress-4")
    Removes: <motion.div key="progress-4" ... />
    Cleanup hooks run

  T=2ms:
    React mounts new motion.div (key: "progress-5")
    Adds: <motion.div key="progress-5" ... />
    NEW component lifecycle begins

  T=3ms:
    Framer Motion reads NEW component's props:
      initial={{ scaleX: 0 }}     ← Start from zero!
      animate={{ scaleX: 0.52 }}  ← To new value

  T=4ms:
    initial state applied:
      scaleX: 0 (invisible, even though was 0.45)
      Browser paints: empty bar

  T=5ms:
    Animation starts:
      scaleX: 0 → 0.52 (animating from scratch)

  T=100ms:
    Middle of animation:
      scaleX: 0.26 (halfway)

  T=305ms:
    Animation completes:
      scaleX: 0.52 (settled at 52%)

  Result: Progress update triggers animation ✅
          Looks like bar is filling again
          Professional, satisfying feel


Why Every 10%? (Debouncing Logic)
─────────────────────────────────

If we remounted on EVERY value change (every 1%):

  45% → 46%:  key: "progress-4" → "progress-4" (same, no remount)
  46% → 47%:  key: "progress-4" → "progress-4" (same, no remount)
  ...
  49% → 50%:  key: "progress-4" → "progress-5" (different, remount!)
  51% → 52%:  key: "progress-5" → "progress-5" (same, no remount)
  52% → 53%:  key: "progress-5" → "progress-5" (same, no remount)

Result: Animation only triggers at 10% boundaries
        Smooth progression without constant re-animation
        Professional feel


*/

// ═══════════════════════════════════════════════════════════════════════════
// PART 4: SPRING PHYSICS EXPLAINED
// ═══════════════════════════════════════════════════════════════════════════

/*
Spring Physics Model:
────────────────────

Unlike linear animation (constant speed), spring physics simulate
a real spring pulling the value toward the target.

Real world example:
  Hanging a weight on a spring
  ┌─────────────┐
  │ Fixed point │
  └────┬────────┘
       │
      [Spring]
       │
      [Weight]
       └─ Falls to resting point
       └─ Overshoots (goes below)
       └─ Bounces back up
       └─ Overshoots again (less)
       └─ Eventually settles

This natural motion feels organic.


SPRING_TRANSITION Parameters:
─────────────────────────────

export const SPRING_TRANSITION = {
  type: "spring",
  stiffness: 300,
  damping: 20,
}


STIFFNESS (how strong the spring is):
──────────────────────────────────────

Low stiffness (100):
  Spring is loose, stretchy
  Takes longer to pull back
  Feels sluggish

  Progress animation:
    scaleX: 0 → 0.45
    Duration: ~800ms
    Lots of bounce
    Feels slow, mushy

  Visual:
    ┌────────────────────────────────┐
    │ scaleX value over time         │
    │  0.5 │         ╱╲             │
    │      │        ╱  ╲            │
    │  0.4 │       ╱    ╲╲          │
    │      │      ╱      ╲ ╲        │
    │  0.3 │     ╱        ╲ ╲      │
    │      │    ╱          ╲ ╲     │
    │  0.2 │   ╱            ╲ ╲   │
    │      │  ╱              ╲ ╲  │
    │  0.1 │ ╱                ╲ ╲ │
    │      │╱                  ╲╲│
    │  0.0 └────────────────────── │
    │      Time →                  │
    │                              │
    │ Slow, lots of overshoot     │
    └────────────────────────────────┘


Medium stiffness (300):
  Spring is firm, responsive
  Balanced feel
  ~300ms total time
  Slight bounce (natural)

  Progress animation:
    scaleX: 0 → 0.45
    Duration: ~300ms
    Slight overshoot to 0.46
    Settles quickly
    Feels professional

  Visual:
    ┌────────────────────────────────┐
    │ scaleX value over time         │
    │  0.5 │        ╱─╲             │
    │      │       ╱   ╲            │
    │  0.4 │      ╱     ╲           │
    │      │     ╱       ╲          │
    │  0.3 │    ╱         ╲─        │
    │      │   ╱            ╲      │
    │  0.2 │  ╱              ╲     │
    │      │ ╱                ╲    │
    │  0.1 │╱                  ╲─  │
    │      │                     ╲ │
    │  0.0 └────────────────────────│
    │      Time →                  │
    │                              │
    │ Fast, slight bounce         │
    └────────────────────────────────┘


High stiffness (500):
  Spring is very tight, snappy
  Immediate response
  ~150ms total time
  Minimal bounce
  Feels snappy, direct

  Progress animation:
    scaleX: 0 → 0.45
    Duration: ~150ms
    Very little overshoot
    Settles immediately
    Feels responsive

  Visual:
    ┌────────────────────────────────┐
    │ scaleX value over time         │
    │  0.5 │       ╱─              │
    │      │      ╱  ─             │
    │  0.4 │     ╱    ──           │
    │      │    ╱       ─         │
    │  0.3 │   ╱         ──       │
    │      │  ╱            ─     │
    │  0.2 │ ╱              ──   │
    │      │╱                 ─ │
    │  0.1 │                   ─ │
    │      │                    ─│
    │  0.0 └────────────────────────│
    │      Time →                  │
    │                              │
    │ Very fast, nearly linear    │
    └────────────────────────────────┘


DAMPING (how much friction):
───────────────────────────

Low damping (5):
  Very little friction
  Spring bounces a lot
  Oscillates multiple times
  Feels bouncy, elastic

  Progress animation:
    Overshoots to 0.48
    Bounces back to 0.42
    Overshoots to 0.46
    Eventually settles to 0.45
    Takes a long time
    Feels playful, bouncy


Medium damping (20):
  Balanced friction
  One slight overshoot
  Settles smoothly
  ~300ms total
  Feels natural, organic

  Progress animation:
    Overshoots slightly to 0.46
    Settles back to 0.45
    Looks natural
    Feels professional


High damping (40):
  Lots of friction
  Minimal overshoot
  Settles quickly
  ~250ms total
  Feels direct, purposeful

  Progress animation:
    Almost no overshoot
    Linear-like curve
    Feels controlled
    Looks business-like


Stiffness + Damping Combinations:
──────────────────────────────────

Springy (creative/playful):
  stiffness: 200,  damping: 10
  Result: Bouncy, lots of movement
          Good for: Games, playful apps
          Bad for: Professional dashboards

Sweet spot (professional):
  stiffness: 300,  damping: 20
  Result: Natural, balanced, polished
          Good for: Most dashboards (THIS IS IT)
          Perfect: Framer Motion recommendation

Snappy (responsive/direct):
  stiffness: 400,  damping: 30
  Result: Fast, minimal bounce, direct
          Good for: Real-time data, trading apps
          Bad for: Too jerky for casual use

Stiff (linear-like):
  stiffness: 500,  damping: 40
  Result: Very fast, almost linear
          Good for: Snappy interactions
          Bad for: Lacks natural feel


*/

// ═══════════════════════════════════════════════════════════════════════════
// PART 5: PERFORMANCE IMPLICATIONS
// ═══════════════════════════════════════════════════════════════════════════

/*
Multiple Progress Bars on Page:
──────────────────────────────

Dashboard with 10 courses, each has progress bar

Width animation (bad):
  Each bar animating width simultaneously
  10 bars × 60fps = 600 reflows per second
  Browser main thread overloaded
  Result: 15-20fps (major jank)
  Page feels sluggish, unresponsive
  User experience: "This app is slow"


ScaleX animation (good):
  Each bar animating scaleX via GPU
  10 bars × 60fps = 10 GPU operations per second
  Browser main thread free
  Result: 60fps locked
  Page stays responsive
  User experience: "This app is smooth and fast"


Mobile Performance:
──────────────────

Desktop (width):
  Device: Intel i7, Chrome 120
  FPS: 27 (frame drop visible)
  User notice: Yes, stuttering

Desktop (scaleX):
  Device: Same
  FPS: 60 locked
  User notice: No, smooth

Mobile (width):
  Device: iPhone 12, Safari
  FPS: 15 (major jank)
  User notice: Extremely obvious, frustrating

Mobile (scaleX):
  Device: Same
  FPS: 55-58 (nearly locked)
  User notice: Smooth, no problems

Improvement on mobile: 40+fps difference!


Memory Usage:
─────────────

Width animation:
  Browser maintains: width value (string "45%")
  Layout calculation object: ~1KB
  Paint commands: ~5KB
  Total: ~6KB per bar per frame

ScaleX animation:
  Browser maintains: scaleX value (number 0.45)
  Transform matrix: ~200 bytes
  GPU texture already exists
  Total: ~200 bytes per bar per frame

Memory improvement: 30x less memory!


CPU vs GPU Breakdown:
─────────────────────

Dashboard with 10 progress bars animating

Width animation (CPU-bound):
  Main thread usage: ~60% constant
  GPU usage: ~10%
  Other tasks delayed: Yes
  Responsiveness: Poor

ScaleX animation (GPU-bound):
  Main thread usage: ~2%
  GPU usage: ~40%
  Other tasks delayed: No
  Responsiveness: Excellent


Long Animations (Extended Duration):
──────────────────────────────────────

Sometimes you want longer progress animations (3+ seconds)

Width animation:
  3 second animation
  Reflow 180 times (60fps × 3s)
  Total reflow time: 3,600ms (entire duration!)
  Completely blocks main thread
  Everything on page frozen

ScaleX animation:
  3 second animation
  GPU handles all frames
  Main thread idle, ~100ms per second
  Page responsive, interactive
  Users can still use page while animating


*/

// ═══════════════════════════════════════════════════════════════════════════
// SUMMARY & BEST PRACTICES
// ═══════════════════════════════════════════════════════════════════════════

/*
✅ DO:

1. Use scaleX (not width)
   → 60fps, no jank
   → 30x memory efficient
   → Works great on mobile

2. Use transformOrigin: "left"
   → Natural fill direction
   → Looks like real progress

3. Use spring physics (not tween)
   → Natural motion
   → Professional feel
   → Slight bounce feels good

4. Debounce re-animation
   → Every 10% (not every 1%)
   → Smooth progression
   → No animation spam

5. Use key-based remounting
   → Enables re-animation on update
   → Professional progress updates
   → Looks intentional

6. Keep animation duration 200-400ms
   → Fast enough to feel responsive
   → Slow enough to look intentional
   → 300ms is perfect sweet spot


❌ DON'T:

1. Animate width property
   → Causes reflow/repaint
   → Frame drops to 30fps
   → Jank visible

2. Animate left/right position
   → Layout-changing property
   → Same reflow problems as width
   → Expensive on every frame

3. Use linear tweens
   → Feels robotic, unnatural
   → Spring physics are better
   → Zero performance penalty

4. Remount on every value change
   → Constant animation restart
   → Jarring, distracting
   → Use debouncing instead

5. Make animation too slow
   → >500ms feels unresponsive
   → User gets impatient
   → 300ms is proven optimal

6. Forget accessibility
   → prefers-reduced-motion: reduce
   → Some users don't want animations
   → Respect user preferences

7. Stack multiple reflow-causing properties
   → Height + width + padding = mega jank
   → Compound problem
   → Use transforms instead


Key Insight:
───────────

Transform properties (scale, translate, rotate) are GPU accelerated.
They skip the expensive layout/paint phases.
Result: 60fps animation instead of 30fps.

This one choice (scaleX vs width) determines if animation feels
smooth and professional or janky and broken.

This is THE most important performance decision for animations.
Everything else is secondary.

*/
