/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LAYOUT ANIMATIONS GUIDE
 * Shared Layout Animations with layoutId in Framer Motion
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════
// PART 1: THE MAGIC OF layoutId
// ═══════════════════════════════════════════════════════════════════════════

/*
What is layoutId?
─────────────────

layoutId is a Framer Motion feature that creates "shared layout animations".

Simple definition:
  When two elements share the same layoutId:
  - Only ONE is visible at a time
  - When switching, position/size animates smoothly
  - Looks like one element is morphing

Real-world analogy:
  Imagine a spotlight on a stage
  Spotlight moves from dancer A to dancer B
  Only one dancer is "highlighted" at a time
  But spotlight smoothly transitions between them
  layoutId is that spotlight


Visual Example - Active Navigation:
───────────────────────────────────

Without layoutId:
  ┌──────────────────────────────┐
  │ [Icon] Home                  │
  │ [Icon] Dashboard ◄ Active    │  ← Highlight jumps instantly
  │ [Icon] Settings              │
  └──────────────────────────────┘
  User clicks Home:
  ┌──────────────────────────────┐
  │ [Icon] Home          ◄ Active │  ← Highlight appears here instantly
  │ [Icon] Dashboard             │
  │ [Icon] Settings              │
  └──────────────────────────────┘

Result: Abrupt, jarring (feels cheap)


With layoutId:
  ┌──────────────────────────────┐
  │ [Icon] Home                  │
  │ [Icon] Dashboard ◄ Active    │  ← Initial position
  │ [Icon] Settings              │
  └──────────────────────────────┘
  User clicks Home:
  ┌──────────────────────────────┐
  │ [Icon] Home        ↓ Active   │  ← Highlight smoothly slides up
  │ [Icon] Dashboard             │
  │ [Icon] Settings              │
  └──────────────────────────────┘

Result: Smooth transition (feels professional)


*/

// ═══════════════════════════════════════════════════════════════════════════
// PART 2: HOW FRAMER MOTION TRACKS POSITIONS
// ═══════════════════════════════════════════════════════════════════════════

/*
The Core Algorithm:
──────────────────

Framer Motion uses the browser's LAYOUT API to:
1. Measure element position BEFORE change
2. Measure element position AFTER change
3. Calculate difference
4. Animate from old to new


Step-by-Step Position Tracking:
───────────────────────────────

STEP 1: Element A is active
────────────────────────────

Code:
  {isActive && (
    <motion.div layoutId="sidebar-active">
      Highlight
    </motion.div>
  )}

Dashboard button is active, so element renders:
  <button>                     ← Dashboard nav item
    <motion.div layoutId="sidebar-active">
      ← Element exists here
    </motion.div>
  </button>

Framer Motion measures:
  position: { top: 56px, left: 12px }
  size:     { width: 240px, height: 40px }
  snapshot: Position stored in memory


STEP 2: User clicks Home
────────────────────────

Event: onClick handler fires
setActiveItem("home") called
React re-renders

New state:
  Dashboard: isActive = false
  Home:      isActive = true

React updates DOM:
  Dashboard button:
    layoutId element REMOVED
  Home button:
    layoutId element ADDED


STEP 3: Framer Motion detects change
───────────────────────────────────

After React updates DOM, Framer Motion:

1. Sees: layoutId="sidebar-active" still exists
   (same ID as before)

2. Checks: Did element move?
   Old position: top: 56px
   New position: top: 12px (Home is above Dashboard)
   Result: YES, moved!

3. Calculates: How far did it move?
   delta = oldPosition - newPosition
   deltaY = 56px - 12px = 44px
   Translation needed: move down 44px to show old position

4. Reads: Current dimensions
   New width: 240px (same)
   New height: 40px (same)
   No resize needed


STEP 4: Animation setup
──────────────────────

Framer Motion prepares animation:

1. Current DOM state: Element at top: 12px (new position)
2. Apply compensating transform: translateY(44px)
3. This makes element APPEAR at old position (top: 56px)
4. Browser hasn't painted yet, appears seamless

Before first frame:
  Visual position: 56px (old location) via transform
  Actual DOM position: 12px (new location)
  User sees: Highlight at old position

5. Set up animation:
   Initial: translateY(44px)
   Animate: translateY(0px)
   Duration: 300ms
   Physics: Spring


STEP 5: Animation runs
──────────────────────

Frame 0 (T=0ms):
  translateY: 44px
  Visual position: 56px (top of Dashboard)
  User sees: Highlight under Dashboard

Frame 10 (T=50ms):
  translateY: 30px
  Visual position: 42px (between Dashboard and Home)
  User sees: Highlight moving up

Frame 20 (T=100ms):
  translateY: 16px
  Visual position: 28px (getting closer to Home)
  User sees: Highlight sliding up

Frame 30 (T=300ms):
  translateY: 0px
  Visual position: 12px (Home button)
  User sees: Highlight at Home

Result: Smooth slide animation from Dashboard to Home


Position Measurement Mechanics:
───────────────────────────────

Framer Motion uses getBoundingClientRect():

Home button layout:
  ┌─────────────────────┐
  │ [Icon] Home         │
  │ top: 12px          │
  │ left: 12px         │
  │ width: 240px       │
  │ height: 40px       │
  └─────────────────────┘

Dashboard button layout:
  ┌─────────────────────┐
  │ [Icon] Dashboard    │
  │ top: 56px          │
  │ left: 12px         │
  │ width: 240px       │
  │ height: 40px       │
  └─────────────────────┘

Delta calculation:
  oldTop = 56px
  newTop = 12px
  delta = oldTop - newTop = 44px

Transform compensation:
  To make new element appear in old position:
  apply: translateY(44px)
  This visually moves it down 44px
  Placing it at: 12px + 44px = 56px (old position)


More Complex Example: Size Change
──────────────────────────────────

What if Home button is wider than Dashboard?

Dashboard:
  width: 240px
  height: 40px

Home (stretched):
  width: 280px
  height: 40px

Framer Motion would:

1. Calculate position delta: deltaY = 44px
2. Calculate scale delta: scaleX = 240 / 280 = 0.857

Animation:
  Initial: scaleX(0.857) translateY(44px)
  Animate: scaleX(1.0) translateY(0px)

Visual result:
  Element slides up AND grows horizontally
  Smoothly morphs into new position/size


*/

// ═══════════════════════════════════════════════════════════════════════════
// PART 3: WHEN ONLY ONE ELEMENT EXISTS AT A TIME
// ═══════════════════════════════════════════════════════════════════════════

/*
Why layoutId Elements Are Conditional:
───────────────────────────────────────

Code pattern:
  {isActive && (
    <motion.div layoutId="sidebar-active">
      Highlight
    </motion.div>
  )}

NOT:
  <motion.div layoutId="sidebar-active" opacity={isActive ? 1 : 0}>
    Highlight
  </motion.div>

Why the distinction?

First pattern (good):
  Active:   <motion.div> exists in DOM
  Inactive: <motion.div> removed from DOM
  Result: When switching, Framer Motion morphs position

Second pattern (bad):
  Active:   <motion.div opacity="1">
  Inactive: <motion.div opacity="0">
  Result: Both elements always exist, hidden one confuses layoutId


The Problem with Always-Existing Elements:
────────────────────────────────────────

Code:
  <motion.div
    layoutId="sidebar-active"
    opacity={isActive ? 1 : 0}
  >

What happens:
  1. Home and Dashboard buttons both exist
  2. Dashboard button has layoutId element (visible)
  3. Home button has layoutId element (hidden, opacity: 0)
  4. Framer Motion sees TWO layoutId elements
  5. Gets confused: "Which one should animate?"
  6. No animation runs
  7. Both elements exist, hidden one wastes memory

Browser sees:
  ┌─────────────────────────────┐
  │ Home                        │
  │ <motion.div opacity={0}>    │ ← Hidden, confusing
  │
  │ Dashboard (active)          │
  │ <motion.div opacity={1}>    │ ← Visible
  └─────────────────────────────┘

Framer Motion confused: Which one should have the layoutId animation?


The Better Pattern (Conditional Rendering):
─────────────────────────────────────────

Code:
  {isActive && (
    <motion.div layoutId="sidebar-active">
      Highlight
    </motion.div>
  )}

What happens:
  1. Home and Dashboard buttons both exist
  2. Dashboard button has layoutId element (visible)
  3. Home button has NO layoutId element (doesn't exist)
  4. Framer Motion sees ONE layoutId element
  5. When switching:
     - Dashboard's element removed
     - Home's element added
     - Framer Motion animates position change
  6. Clean, efficient

Browser sees:
  ┌─────────────────────────────┐
  │ Home                        │
  │ (no element)                │
  │
  │ Dashboard (active)          │
  │ <motion.div>                │ ← Only active one exists
  └─────────────────────────────┘

Framer Motion clear: Only one layoutId element, animate its position.


Memory impact:
──────────────

Always-existing (bad):
  Home layoutId element: 500 bytes
  Dashboard layoutId element: 500 bytes
  Hidden elements on every nav item: 5 × 500 bytes = 2.5KB
  Plus: opacity state tracking = overhead

Conditional (good):
  Only active layoutId element: 500 bytes
  Removed elements: 0 bytes
  Total: Just 500 bytes


*/

// ═══════════════════════════════════════════════════════════════════════════
// PART 4: ANIMATION LIFECYCLE WITH layoutId
// ═══════════════════════════════════════════════════════════════════════════

/*
Timing Event (User Clicks Navigation):
──────────────────────────────────────

T=0ms:
  User clicks "Home" link
  onClick handler fires

T=1ms:
  setActiveItem("home") called
  React begins re-render

T=2ms:
  Dashboard: isActive = false
    Dashboard's layoutId element will be removed
  Home: isActive = true
    Home's layoutId element will be added

T=3ms:
  React DOM updates complete
  Dashboard's motion.div removed from DOM
  Home's motion.div added to DOM
  Framer Motion notified of DOM change

T=4ms:
  Framer Motion detects layoutId="sidebar-active" moved
  Old position (Dashboard): top 56px
  New position (Home): top 12px
  Delta: 44px downward

T=5ms:
  Framer Motion applies compensating transform:
    Initial state: translateY(44px)
  This makes Home button's element APPEAR at Dashboard position
  From user's perspective: Highlight still at Dashboard (no jump)

T=6ms:
  Framer Motion sets up spring animation:
    from: translateY(44px)
    to: translateY(0px)
    duration: ~300ms
    transition: spring physics

T=7ms:
  First frame of animation renders
  translateY(44px) applied
  User sees: Highlight at Dashboard position (old location)

T=10ms:
  Animation 1/3 complete
  translateY: 44px → 30px
  User sees: Highlight sliding upward

T=160ms:
  Animation 2/3 complete
  translateY: 22px
  User sees: Highlight halfway between Dashboard and Home

T=300ms:
  Animation nearly complete
  translateY: 2px
  User sees: Highlight almost at Home

T=305ms:
  Animation complete
  translateY: 0px
  User sees: Highlight fully at Home

T=306ms+:
  Animation settled
  Layout stable
  Highlight rests at Home


Multi-Tap Test (Click Multiple Times):
──────────────────────────────────────

User rapidly clicks: Dashboard → Settings → Home

First click (Dashboard → Settings):
  Animation: Dashboard (top 56px) → Settings (top 100px)
  Duration: 300ms
  Running at T=0-300ms

User clicks Settings at T=100ms (animation in progress):
  New animation: Settings (current) → Home (top 12px)
  Framer Motion:
    Stops old animation
    Measures new position
    Starts new animation from current position
    Result: Smooth transition continues

Settings animation: 200ms in (halfway to 100px, at top 78px)
Home animation starts: from top 78px to top 12px
  Delta: 66px
  New animation runs: 300ms

Result: Smooth cascade of animations
        User can see multiple transitions chained
        Feels responsive and fluid


*/

// ═══════════════════════════════════════════════════════════════════════════
// PART 5: CONFIGURATION OPTIONS
// ═══════════════════════════════════════════════════════════════════════════

/*
Transition Customization:
──────────────────────────

Current (Balanced):
  transition={{ type: "spring", stiffness: 300, damping: 25 }}
  Duration: ~300ms
  Feel: Natural, professional

Faster (Snappy):
  transition={{ type: "spring", stiffness: 400, damping: 30 }}
  Duration: ~200ms
  Feel: Quick, responsive
  Best for: Fast-paced apps, traders

Slower (Leisurely):
  transition={{ type: "spring", stiffness: 200, damping: 20 }}
  Duration: ~400ms
  Feel: Relaxed, emphasizes movement
  Best for: Marketing, creative sites

Bouncy (Playful):
  transition={{ type: "spring", stiffness: 300, damping: 15 }}
  Duration: ~350ms
  Feel: Elastic, fun
  Best for: Games, playful apps
  Bad for: Serious dashboards

Linear (Tween, robot-like):
  transition={{ type: "tween", duration: 0.25 }}
  Duration: 250ms (exact)
  Feel: Mechanical, artificial
  Bad for: Most use cases (lacks natural feel)

Custom Easing:
  transition={{
    type: "tween",
    duration: 0.3,
    ease: "easeInOutCubic"
  }}
  Duration: 300ms (controlled by ease function)
  Feel: Customizable
  Options: easeIn, easeOut, easeInOut, linear, etc.


layoutId Naming:
────────────────

Current:
  layoutId="sidebar-active"

Guidelines:
  - Use descriptive names
  - Include component context (sidebar)
  - Include state (active, selected, highlighted)
  - Avoid generic names (animation-1, highlight)

Good names:
  layoutId="navigation-active"
  layoutId="menu-selected"
  layoutId="tab-indicator"
  layoutId="modal-backdrop"
  layoutId="dropdown-hover"

Bad names:
  layoutId="motion"
  layoutId="anim1"
  layoutId="highlight"


Multiple layoutIds (Advanced):
──────────────────────────────

You can have multiple different layoutId groups on same page:

Navigation bar:
  layoutId="nav-active"  (only one visible at a time)

Tab switcher:
  layoutId="tab-active"  (different group)

Filter bar:
  layoutId="filter-active"  (different group)

Each layoutId group animates independently:
  Switching nav doesn't affect tab animation
  Both can run simultaneously
  Different transition speeds allowed


z-index Considerations:
────────────────────────

Highlight element needs to be:
  - Behind text content (z-index: 0)
  - Above background (z-index: -1 might hide it)

Current code:
  Text/icons: relative z-10 (on top)
  Background: absolute inset-0 (behind, fills container)
  Highlight: automatically behind (position: absolute)

Visual layering:
  ┌─────────────────────┐
  │ [z-10] Icon & Text  │
  │ [z-0]  Highlight    │
  │ [z-1]  Bg gradient  │
  └─────────────────────┘


Transform Origin for Scaling:
──────────────────────────────

If nav item sizes change (wider/narrower):

Framer Motion animates scaleX:
  From: 240px button
  To:   280px button
  scaleX: 240/280 = 0.857

transformOrigin matters:
  "center": Scales from middle (both sides shrink)
  "left": Scales from left (right side shrinks)
  "right": Scales from right (left side shrinks)

Default (center) usually correct for navigation:
  Center is most visually balanced


*/

// ═══════════════════════════════════════════════════════════════════════════
// PART 6: ADVANCED PATTERNS
// ═══════════════════════════════════════════════════════════════════════════

/*
Layout Animations with Scroll:
───────────────────────────────

layoutId animates position changes in response to:
  ✅ Click events
  ✅ Hover
  ✅ Prop changes
  ✅ Any reason position changes

Problem: Scroll causes position change
  User scrolls page down
  Navigation stays fixed (position: sticky)
  But highlight might jump (if not handled)

Solution: Use absolute positioning + calculatePosition
  Or: Use fixed positioning for nav container
  Or: Reset highlight on scroll


Combining with Variant Animations:
──────────────────────────────────

Layout animation (morphing position):
  layoutId element changes position

Variant animation (entrance):
  variants={{ hidden, visible }}

Both can coexist:

  <motion.div
    layoutId="active-bg"
    variants={fadeInVariants}
    initial="hidden"
    animate="visible"
  >

When element first mounts:
  1. Variant animation plays (fade in)
  2. Position animates (slide to place)
  3. Both run simultaneously
  4. Creates rich, layered animation


Exit Animation (Leaving):
─────────────────────────

When active element unmounts (layoutId element removed):

Code:
  {isActive && (
    <motion.div
      layoutId="active-bg"
      exit={{ opacity: 0 }}
    >
  )}

Wrapped in AnimatePresence:
  <AnimatePresence mode="wait">
    {isActive && (
      <motion.div layoutId="active-bg" exit={{ opacity: 0 }} />
    )}
  </AnimatePresence>

When isActive becomes false:
  1. exit animation runs (fade out, 300ms)
  2. Then element unmounts
  3. Then next element mounts and layoutId animates position

Result: Smooth transition chain


*/

// ═══════════════════════════════════════════════════════════════════════════
// PART 7: TROUBLESHOOTING
// ═══════════════════════════════════════════════════════════════════════════

/*
Animation Not Running (Common Issues):
───────────────────────────────────────

Issue: Click navigation, highlight doesn't animate

Check #1: layoutId specified?
  ❌ <motion.div> (no layoutId)
  ✅ <motion.div layoutId="sidebar-active">

Check #2: Only one element with this layoutId exists?
  ❌ Both active and hidden elements have layoutId
  ✅ Only active element renders layoutId element

Check #3: Element position actually changes?
  ❌ Position calculated same before/after
  ✅ Different button, different position

Check #4: Transition prop present?
  ❌ <motion.div layoutId="..." />
  ✅ <motion.div layoutId="..." transition={{ ... }} />

Check #5: Parent container changes?
  If parent container size changes (sidebar collapse):
  - Might affect position calculation
  - Add position: relative to parent container


Animation Jumpy (Doesn't Morph Smoothly):
──────────────────────────────────────────

Cause: Transition too short
  transition={{ type: "spring", stiffness: 500, damping: 50 }}
  Duration: ~100ms (too fast)
  Looks: Jumpy, abrupt

Fix: Adjust spring physics
  transition={{ type: "spring", stiffness: 300, damping: 25 }}
  Duration: ~300ms (optimal)
  Looks: Smooth, intentional


Animation Overshoots (Element bounces past target):
─────────────────────────────────────────────────

Cause: Damping too low
  transition={{ type: "spring", stiffness: 300, damping: 10 }}
  Element bounces past, comes back
  Looks: Bouncy, unprofessional

Fix: Increase damping
  transition={{ type: "spring", stiffness: 300, damping: 25 }}
  Reduces overshoot
  Looks: Controlled, professional


Wrong Elements Animating:
──────────────────────────

Issue: Multiple elements have same layoutId

Debug:
  Check all components for layoutId="sidebar-active"
  Should only be used in SidebarItem
  Unique ID per layout animation group

Fix:
  Use unique layoutIds:
    layoutId="sidebar-active" (navigation)
    layoutId="tab-active" (tabs)
    layoutId="modal-active" (modals)


*/

// ═══════════════════════════════════════════════════════════════════════════
// SUMMARY: WHY LAYOUT ANIMATIONS MATTER
// ═══════════════════════════════════════════════════════════════════════════

/*
User Experience Without Layout Animation:
──────────────────────────────────────────

Navigation clicks:
  "Home" → Highlight jumps to Home instantly
  "Dashboard" → Highlight jumps to Dashboard instantly
  "Settings" → Highlight jumps to Settings instantly

User feeling: "This is basic, no effort put into polish"


User Experience With Layout Animation:
──────────────────────────────────────

Navigation clicks:
  "Home" → Highlight smoothly slides from old to new location
  "Dashboard" → Highlight smoothly slides again
  "Settings" → Smooth transition every time

User feeling: "This is polished, well-designed, professional"


The Reality:
────────────

Functionality: Same (navigation still works)
Code complexity: Slight increase (layoutId + transition)
Animation time: 300ms (imperceptible)
User perception: 10x more polished

This is WHY modern design tools (Figma, Linear, Vercel, Stripe)
all use layout animations in their navigation.

It's a small detail that signals quality.
Professional design is often about these small touches.

*/
