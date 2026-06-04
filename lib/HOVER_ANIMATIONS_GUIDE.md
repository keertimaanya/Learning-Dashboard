/**
 * ═══════════════════════════════════════════════════════════════════════════
 * HOVER ANIMATIONS GUIDE
 * Professional Interactive Effects with GPU Acceleration
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════
// PART 1: TRANSFORM-BASED ANIMATIONS (GPU Accelerated)
// ═══════════════════════════════════════════════════════════════════════════

/*
The Core Principle:
──────────────────
Use GPU-friendly properties for smooth 60fps animations.
Avoid layout-changing properties that cause reflow/repaint.

Transforms that are GPU-accelerated:
✅ transform: scale()
✅ transform: translate()
✅ transform: rotate()
✅ transform: skew()
✅ opacity

Properties that trigger reflow/repaint (BAD):
❌ width / height
❌ margin / padding
❌ left / right / top / bottom (when using position absolute)
❌ font-size
❌ line-height
❌ border-width


Scale Animation (Used in AnimatedCard):
─────────────────────────────────────

Current implementation:
  whileHover={{ scale: 1.02 }}
  transition={SPRING_TRANSITION}

What it does:
  - Idle:  scale(1.0)  → 100% of original size
  - Hover: scale(1.02) → 102% of original size
  - Animation time: ~300ms (spring physics)

Visual effect:
  User hovers over card
  Card smoothly grows to 1.02x size
  Spring physics create slight overshoot/bounce
  Card feels "alive" and responsive

Why 1.02 (not 1.05 or 1.1)?
  - 1.05: Too obvious, feels exaggerated
  - 1.02: Subtle, professional, doesn't look "clickable"
  - 1.1:  Too much, looks like button

Transform origin:
  Default: center
  Card grows from its center point
  Balanced, natural-looking expansion


Transform: scaleX Example:
──────────────────────────

If you wanted only horizontal scale:
  whileHover={{ scaleX: 1.04 }}

Visual:
  Card stretches horizontally
  Height stays same
  Looks like breathing left-right

Rarely used, but useful for:
  - Button width expansion on hover
  - Horizontal menu expansion
  - Creative effects


Transform: translateY Example:
───────────────────────────────

Hover effect that lifts card upward:
  whileHover={{ translateY: -4 }}

Combined with scale:
  whileHover={{ scale: 1.02, translateY: -4 }}

Visual:
  Card grows AND slides up 4px
  Looks like card is "jumping up" on hover
  Creates depth perception (card closer to viewer)

Common in modern design (Vercel, Linear, Figma)


Transform: rotate Example:
──────────────────────────

Subtle rotation on hover:
  whileHover={{ rotate: 1 }}

Visual:
  Card tilts 1 degree
  Very subtle, adds character
  Can feel unprofessional if too much

Better for creative/playful designs
Less suitable for productivity dashboards


Combining Multiple Transforms:
───────────────────────────────

All in one whileHover:
  whileHover={{
    scale: 1.02,
    translateY: -2,
    rotate: 0.5
  }}

GPU handles all transforms simultaneously
No performance penalty for combining
Result: Rich, polished interaction


*/

// ═══════════════════════════════════════════════════════════════════════════
// PART 2: CSS PROPERTIES (Instant, No Animation)
// ═══════════════════════════════════════════════════════════════════════════

/*
Border Color Change:
────────────────────

Current implementation (Tailwind):
  hover:border-accent/30

What it does:
  Idle:  border-surface-border (neutral gray)
  Hover: border-accent/30 (accent color at 30% opacity)

How it works:
  - NOT animated (instant change)
  - CSS applies immediately on :hover
  - No transition prop, so no duration
  - Visual effect: Border "lights up"

Why this approach?
  - Border thickness doesn't change (no reflow)
  - Color change is instant (no animation needed)
  - Matches user expectation (visual feedback = instant)


Box Shadow Glow:
────────────────

Current implementation (Tailwind):
  hover:shadow-glow

Custom shadow defined in tailwind.config.ts:
  shadow-glow: "0 0 20px rgba(accent-color, 0.3)"

What it does:
  Idle:  no shadow
  Hover: glowing shadow around card edges

Visual effect:
  Card gets a subtle glow
  Looks like card is emitting light
  Creates "selection" feeling

CSS Transition (Optional):
  transition-all duration-300

Makes shadow fade in smoothly (300ms)
If removed: shadow appears instantly

Why use box-shadow?
  - Doesn't affect layout (no reflow)
  - Adds depth perception
  - Professional, polished effect


Text Color Changes:
──────────────────

Not used in AnimatedCard, but common pattern:

  hover:text-text-primary
  transition-colors duration-300

Idle:  text-text-secondary (gray)
Hover: text-text-primary (white)

Duration 300ms means:
  Color gradually transitions from gray to white
  Smooth appearance over 300ms
  Feels intentional, not jarring


Background Color Shift:
──────────────────────

If you wanted background change:

  hover:bg-surface-elevated

Idle:  bg-background-card (dark)
Hover: bg-surface-elevated (slightly lighter)

Visual effect:
  Card background lightens on hover
  Looks like card is highlighted
  Common in tables and lists


*/

// ═══════════════════════════════════════════════════════════════════════════
// PART 3: GPU ACCELERATION DEEP DIVE
// ═══════════════════════════════════════════════════════════════════════════

/*
Compositing Layers:
──────────────────

Modern browsers optimize rendering with layers:

Normal rendering (no transforms):
  ┌─────────────────────────────────┐
  │ Browser Window                  │
  │                                 │
  │ [Card Element]                  │
  │ - In main document flow         │
  │ - Part of page layout           │
  │ - Reflows with page             │
  │                                 │
  └─────────────────────────────────┘

With transform or will-change:
  ┌─────────────────────────────────┐
  │ Browser Window                  │
  │                                 │
  │ [Main Document Layer]           │
  │ - Page layout, static content   │
  │                                 │
  │ [Compositing Layer (GPU)]       │
  │ - [Card Element]                │
  │ - Rendered to GPU texture       │
  │ - Transform applied on GPU      │
  │ - Independent of page layout    │
  │                                 │
  └─────────────────────────────────┘

Benefit: Card transforms don't affect page layout
         Page reflow unaffected by card animation


CPU vs GPU Timeline:
───────────────────

Animation: scale(1) → scale(1.02) over 300ms

Width animation (BAD):
  CPU: Calculate layout (20ms)
  CPU: Paint content (15ms)
  GPU: Render (2ms)
  TOTAL: 37ms per frame
  FPS: 1000ms ÷ 37ms = 27 fps (FRAME DROP)

Scale animation (GOOD):
  CPU: None (layout already calculated)
  CPU: None (content already painted)
  GPU: Render with transform (1ms)
  TOTAL: 1ms per frame
  FPS: Locked 60fps

Result: 33fps improvement!


Reflow Waterfall Effect:
───────────────────────

When one element causes reflow, it affects siblings:

Bad example (width animation):
  Card A: width change
    → Browser recalculates layout
    → Affects Card B position
    → Affects Card C position
    → All cards must repaint
    → Cascade of reflows

Result: Multiple elements reflowing = major frame drop


Good example (scale animation):
  Card A: scale transform
    → GPU renders independently
    → Other cards: no layout recalculation
    → Other cards: no repaint
    → Only Card A GPU layer updated

Result: Only one element's GPU layer updated


Paint Layers:
─────────────

After layout is calculated, browser "paints" content:

Paint includes:
  - Background colors
  - Borders
  - Text rendering
  - Box shadows
  - Gradients
  - Images

Paint is expensive: ~50-100ms for complex page

Transform animations:
  - Paint happens ONCE (before animation starts)
  - Transform applied to painted content (GPU)
  - No repaint needed

Width animations:
  - Layout changes every frame
  - Paint recalculated every frame (60x per second)
  - Massive performance cost


*/

// ═══════════════════════════════════════════════════════════════════════════
// PART 4: FRAMER MOTION INTEGRATION
// ═══════════════════════════════════════════════════════════════════════════

/*
whileHover Prop:
────────────────

Code:
  <motion.article whileHover={{ scale: 1.02 }} ... >

What happens:
  1. User hovers element
  2. Framer Motion detects hover event
  3. Applies whileHover animation immediately
  4. User hovers away
  5. Animation reverses to normal state

Timeline:
  0ms:     Hover starts
  10ms:    Animation begins
  200ms:   ~halfway (scale: 1.01)
  300ms:   Completes (scale: 1.02)
  User moves away
  300ms:   Animation reverses
  600ms:   Back to scale: 1.0


Transition Prop:
────────────────

Code:
  <motion.article
    whileHover={{ scale: 1.02 }}
    transition={SPRING_TRANSITION}
  >

SPRING_TRANSITION defines:
  - type: "spring" (physics-based, natural)
  - stiffness: 300 (how fast spring pulls)
  - damping: 20 (how much bounce)
  - duration: ~300ms

Other transition options:

  Linear (tween):
    transition={{ type: "tween", duration: 0.3 }}
    - Constant speed
    - Feels robotic, unnatural

  Ease-in:
    transition={{ type: "tween", duration: 0.3, ease: "easeIn" }}
    - Slow start, fast end
    - Feels like acceleration

  Ease-out:
    transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
    - Fast start, slow end
    - Feels like deceleration

  Elastic spring:
    transition={{ type: "spring", stiffness: 200, damping: 10 }}
    - Bouncy, overshoot
    - Playful, energetic

  Stiff spring:
    transition={{ type: "spring", stiffness: 500, damping: 40 }}
    - Snappy, minimal bounce
    - Direct, immediate


*/

// ═══════════════════════════════════════════════════════════════════════════
// PART 5: PROFESSIONAL DESIGN PATTERNS
// ═══════════════════════════════════════════════════════════════════════════

/*
Elevation on Hover (Lifted Effect):
──────────────────────────────────

Combines multiple effects:

Code:
  whileHover={{
    scale: 1.02,
    translateY: -2,
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
  }}

Visual:
  1. Card grows (scale: 1.02)
  2. Card moves up (translateY: -2)
  3. Shadow increases depth (boxShadow)
  4. Combined = card "floats up" on hover

Feeling: Card is interactive, clickable, responsive


Highlight and Glow:
──────────────────

Combines CSS and Framer Motion:

Code:
  className="hover:border-accent/30 hover:shadow-glow"
  whileHover={{ scale: 1.02 }}
  transition={SPRING_TRANSITION}

Effects:
  1. Border color changes (instant, CSS)
  2. Shadow glows (instant, CSS)
  3. Card grows (300ms, spring)
  4. All combined = interactive highlight

Feeling: Card "wakes up" on hover


Blur Effect on Others (Advanced):
──────────────────────────────────

When hovering one card, dim others:

Code:
  <motion.div
    whileHover={{ opacity: 1 }}
    initial={{ opacity: 0.7 }}
  >
    Card
  </motion.div>

Effect:
  Idle:  all cards at 70% opacity (dimmed)
  Hover: hovered card at 100% (full brightness)
         others stay at 70% (dimmed)

Result: Focus drawn to hovered card
        Creates visual hierarchy


Color Shift on Hover:
────────────────────

Change accent color:

Code:
  whileHover={{
    scale: 1.02,
    color: "#accent-color"
  }}

Framer Motion animates:
  current color → accent color (300ms)

Visual:
  Text brightens on hover
  Creates visual feedback
  Professional, polished


*/

// ═══════════════════════════════════════════════════════════════════════════
// SUMMARY: HOVER ANIMATION BEST PRACTICES
// ═══════════════════════════════════════════════════════════════════════════

/*
✅ DO:

1. Use transforms (scale, translate, rotate)
   → GPU accelerated, 60fps
   → No layout changes
   → Professional feel

2. Use opacity for fade effects
   → GPU accelerated
   → Clean, simple

3. Combine multiple transforms
   → All handled by GPU
   → No performance penalty

4. Use spring physics (not tween)
   → Natural, organic motion
   → Professional, polished
   → Slight overshoot feels good

5. Keep scale values subtle
   → 1.02 - 1.05 range
   → Not obviously "clickable"
   → Professional appearance

6. Add visual feedback
   → Border color change
   → Shadow glow
   → Makes interaction clear

7. Keep hover effects fast
   → 200-400ms range
   → Instant enough to feel responsive
   → Slow enough to look intentional


❌ DON'T:

1. Animate width/height
   → Triggers reflow/repaint
   → Drops frame rate
   → Jank visible

2. Animate position (left/right/top/bottom)
   → Layout changes
   → Expensive calculations
   → Frame drops

3. Use extreme scale values
   → scale: 1.2 looks odd
   → scale: 1.02 is sweet spot
   → Professional guideline

4. Chain animations together
   → "Fade in, then scale up"
   → Use variants or stagger
   → Combined is better

5. Make animations too slow
   → >500ms feels unresponsive
   → User gets impatient
   → Optimal: 300ms

6. Animate color directly
   → Use opacity instead
   → Or use Framer Motion color animation
   → Direct color can be jarring

7. Forget accessibility
   → prefers-reduced-motion: reduce
   → Respect user preferences
   → Disable animations if user disabled


*/
