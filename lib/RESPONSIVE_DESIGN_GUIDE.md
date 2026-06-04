/**
 * ═══════════════════════════════════════════════════════════════════════════
 * RESPONSIVE DESIGN GUIDE
 * Mobile-First Strategy & Breakpoint Architecture
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════
// PART 1: CURRENT RESPONSIVE STATE
// ═══════════════════════════════════════════════════════════════════════════

/*
EXISTING BREAKPOINTS (Tailwind CSS):

sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px

CURRENT USAGE IN DASHBOARD:

app/layout.tsx:
  Sidebar: hidden lg:flex
  Mobile nav: lg:hidden
  Result: Sidebar hides below 1024px

components/layout/bento-grid.tsx:
  Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-4
  Result: 1 col (mobile), 2 col (tablet), 4 col (desktop)

CURRENT STATE:
✅ Tablet view (md breakpoint) exists
✅ Mobile view (base, no breakpoint) works
✅ Desktop view (lg breakpoint) optimized
❌ Mobile navigation (bottom nav) NOT implemented
❌ Tablet sidebar (icon-only) NOT implemented


WHAT'S NEEDED:

Current:
  Mobile: No sidebar (just mobile nav placeholder)
  Tablet: No sidebar (just mobile nav placeholder)
  Desktop: Full sidebar at 1024px+

Target:
  Mobile: Bottom navigation (all content above)
  Tablet: Icon-only sidebar (hover shows labels)
  Desktop: Full sidebar with labels


*/

// ═══════════════════════════════════════════════════════════════════════════
// PART 2: BREAKPOINT STRATEGY (Mobile-First Design)
// ═══════════════════════════════════════════════════════════════════════════

/*
MOBILE-FIRST PRINCIPLE:

Definition:
  Design for smallest screen first.
  Add complexity as screen gets larger.
  Use `@media (min-width: ...)` to add features.

Why Mobile-First?
  ✅ Forces focus on essential content
  ✅ Progressive enhancement (baseline works for all)
  ✅ Better performance (less CSS initially)
  ✅ Touch-friendly by default
  ✅ Easier to scale up than down

Tailwind CSS approach (mobile-first by default):
  base styles apply to all sizes
  sm: ... applies at 640px and up
  md: ... applies at 768px and up
  lg: ... applies at 1024px and up
  xl: ... applies at 1280px and up


BREAKPOINT PHILOSOPHY:

Don't use breakpoints for device types:
  ❌ "This is for iPad"
  ❌ "This is for iPhone"
  Reason: Device sizes vary, spec changes

Use breakpoints for content:
  ✅ "Content needs 2 columns here"
  ✅ "Navigation fits in sidebar here"
  ✅ "Touch targets need 44px here"
  Reason: Content determines layout


OUR DASHBOARD BREAKPOINTS:

Mobile (320px - 639px):
  Target: iPhone, small Android
  Sidebar: Hidden (use bottom nav)
  Navigation: Bottom tabs
  Grid: 1 column
  Typography: Smaller, compact

Tablet (640px - 1023px):
  Target: iPad, large Android tablets
  Sidebar: Icon-only (72px width)
  Navigation: Collapsed sidebar
  Grid: 2 columns
  Typography: Medium

Desktop (1024px+):
  Target: Laptops, large screens
  Sidebar: Full (256px width)
  Navigation: Full labels visible
  Grid: 4 columns
  Typography: Full size

Widescreen (1920px+):
  Target: Ultra-wide monitors, 4K
  Sidebar: Full
  Navigation: Full
  Grid: 5+ columns (optional)
  Typography: Generous spacing


*/

// ═══════════════════════════════════════════════════════════════════════════
// PART 3: RESPONSIVE NAVIGATION PATTERNS
// ═══════════════════════════════════════════════════════════════════════════

/*
THREE NAVIGATION STATES:

STATE 1: MOBILE (< 640px)
─────────────────────────

Layout:
  ┌─────────────────────────┐
  │ Page Content            │
  │                         │
  │ (all the way to bottom) │
  │                         │
  ├─────────────────────────┤
  │ [📚]  [🎯]  [⚙️]  [📊] │  ← Bottom Nav (fixed)
  └─────────────────────────┘

Features:
  - Content takes full width
  - Navigation fixed at bottom
  - Easy thumb reach (bottom nav)
  - Compact icons + labels
  - No sidebar (takes space)

Implementation:
  position: fixed
  bottom: 0
  left: 0
  right: 0
  z-index: 50
  height: 56px
  display: flex
  justify-content: space-around

Navigation items:
  Icon centered
  Label below icon (or hidden)
  Touch target: 44px × 44px minimum


STATE 2: TABLET (640px - 1023px)
────────────────────────────────

Layout:
  ┌─────────┬─────────────────────────┐
  │ [📚]    │ Page Content            │
  │ [🎯]    │                         │
  │ [⚙️]    │ (with margin for nav)   │
  │ [📊]    │                         │
  │         │                         │
  └─────────┴─────────────────────────┘

Features:
  - Sidebar collapses to icons (72px)
  - Currently implemented with toggle
  - Main content gets margin-left: 72px
  - Icons always visible
  - Labels hidden (space constraints)
  - Hover shows label in tooltip (optional)

Implementation:
  Sidebar width: 72px (icon mode)
  Content margin-left: 72px
  Icons centered in 72px container
  Labels hidden (or tooltip on hover)


STATE 3: DESKTOP (1024px+)
──────────────────────────

Layout:
  ┌──────────────┬────────────────────────────┐
  │ 🎓 LearnDash │ Page Content               │
  │              │                            │
  │ [📚] Courses │ (with margin for sidebar)  │
  │ [🎯] Goals   │                            │
  │ [⚙️] Settings│ (all content visible)      │
  │ [📊] Analytics
  │              │                            │
  │              │ ◄─ Sidebar                 │
  │ [◄] Collapse │                            │
  └──────────────┴────────────────────────────┘

Features:
  - Full sidebar (256px)
  - Logo visible
  - Labels visible
  - Collapse button at bottom
  - Current implementation: working

Implementation:
  Sidebar width: 256px
  Content margin-left: 256px
  Icons + labels visible
  Collapse animation working (already implemented)


*/

// ═══════════════════════════════════════════════════════════════════════════
// PART 4: RESPONSIVE GRID SYSTEMS
// ═══════════════════════════════════════════════════════════════════════════

/*
TAILWIND CSS GRID APPROACH:

Syntax:
  grid-cols-1      = 1 column
  grid-cols-2      = 2 columns
  grid-cols-3      = 3 columns
  grid-cols-4      = 4 columns
  grid-cols-6      = 6 columns
  grid-cols-12     = 12 columns
  gap-2            = 8px gap
  gap-4            = 16px gap
  gap-6            = 24px gap

Mobile-first means: Start with smallest, add larger

Base (mobile):
  grid-cols-1  (one column)

Breakpoint adjustments:
  sm:grid-cols-2   (2 columns at 640px)
  md:grid-cols-2   (2 columns at 768px)
  lg:grid-cols-4   (4 columns at 1024px)
  xl:grid-cols-4   (4 columns at 1280px)
  2xl:grid-cols-5  (5 columns at 1536px)


CURRENT BENTO GRID:

Code:
  grid grid-cols-1
  md:grid-cols-2
  lg:grid-cols-4
  gap-4

Result:
  Mobile (< 640px):      1 column, 16px gap
  Tablet (640-1023px):   2 columns, 16px gap
  Desktop (1024+px):     4 columns, 16px gap

Issues:
  ✅ Responsive works
  ❌ No xl/2xl optimizations
  ❌ Gap is same for all sizes (could be smaller on mobile)

Enhanced version:
  grid grid-cols-1
  sm:grid-cols-1
  md:grid-cols-2
  lg:grid-cols-4
  xl:grid-cols-4
  2xl:grid-cols-5
  gap-3
  md:gap-4
  lg:gap-5

Benefits:
  ✅ Smaller gap on mobile (saves space)
  ✅ Larger gap on desktop (breathing room)
  ✅ Handles ultra-wide screens
  ✅ Progressive enhancement


RESPONSIVE SPACING:

Mobile (tight):
  Gap: 12px
  Padding: 16px
  Margin: 8px

Tablet (medium):
  Gap: 16px
  Padding: 20px
  Margin: 12px

Desktop (generous):
  Gap: 20px
  Padding: 24px
  Margin: 16px

Ultra-wide (luxurious):
  Gap: 24px
  Padding: 32px
  Margin: 20px

Implementation in Tailwind:
  gap-3 md:gap-4 lg:gap-5 xl:gap-6
  p-4 md:p-5 lg:p-6 xl:p-8
  m-2 md:m-3 lg:m-4 xl:m-5


*/

// ═══════════════════════════════════════════════════════════════════════════
// PART 5: TOUCH-FRIENDLY DESIGN
// ═══════════════════════════════════════════════════════════════════════════

/*
MINIMUM TOUCH TARGETS:

Apple guideline: 44×44 points
Android guideline: 48×48 dp
Web standard: 44×44 px

Apply to:
  Buttons: All interactive buttons
  Links: Especially navigation
  Icons: If clickable
  Form fields: Input, select, checkbox

Current dashboard:
  Buttons: Various sizes (need audit)
  Navigation items: 40px height (should be 44px minimum)
  Form inputs: 40px height (should be 44px minimum)
  Icons: 20-24px (only clickable if in button)


HOVER vs TAP INTERACTIONS:

Desktop (hover-based):
  button:hover { scale: 1.02 }
  navigation:hover { highlight }
  Result: Visual feedback on mouse over

Mobile (tap-based):
  No :hover state (30ms delay)
  Use :active instead (immediate)
  Use :focus instead (visible after tap)
  Result: Visual feedback on tap

CSS media query (new):
  @media (hover: hover) {
    button:hover { transform: scale(1.02) }
  }
  
  @media (hover: none) {
    button { border: 2px solid transparent }
    button:focus { border-color: accent }
  }

Tailwind approach:
  hover:scale-102  (desktop)
  focus:ring-2     (mobile + keyboard)


RESPONSIVE TYPOGRAPHY:

Desktop:
  Heading 1: 32px
  Heading 2: 24px
  Body: 16px
  Small: 14px

Tablet:
  Heading 1: 28px
  Heading 2: 20px
  Body: 14px (might be cramped)
  Small: 12px

Mobile:
  Heading 1: 24px
  Heading 2: 18px
  Body: 14px
  Small: 12px

Tailwind:
  text-2xl md:text-3xl lg:text-4xl
  text-base md:text-lg
  text-sm md:text-base


SAFE AREAS (Notches):

Modern phones (iPhone X+, Android):
  Top notch: 44px
  Bottom safe area: 34px (iPhone) or 0px (Android)

Implementation:
  iOS: padding-top: env(safe-area-inset-top)
  iOS: padding-bottom: env(safe-area-inset-bottom)
  Android: No special handling needed

For bottom nav:
  padding-bottom: max(16px, env(safe-area-inset-bottom))
  Result: Extra space on notched devices


*/

// ═══════════════════════════════════════════════════════════════════════════
// PART 6: RESPONSIVE IMAGE & MEDIA
// ═══════════════════════════════════════════════════════════════════════════

/*
CONTAINER QUERIES (Modern CSS):

Traditional media query:
  @media (max-width: 640px) { ... }
  Applies to: Entire viewport

Container query:
  @container (max-width: 640px) { ... }
  Applies to: Specific container, regardless of viewport

Use case:
  Same component used in different contexts
  Component might be full width on mobile
  Component might be sidebar on desktop
  Component needs different layout in each context

Dashboard might use:
  BentoGrid tiles in grid: full width at md, half width at lg
  Using container queries: 1 column in narrow container, 2 in wide

Tailwind support:
  @supports (container-type: inline-size) {
    @container (max-width: 40rem) { ... }
  }


RESPONSIVE IMAGES:

Current: No images in dashboard (all tiles are text/progress)

When we add images:
  Use srcset for different sizes
  Serve different dimensions for different screens

Example:
  <img
    src="course-cover.png"
    srcset="
      course-cover-sm.png 300w,
      course-cover-md.png 600w,
      course-cover-lg.png 1200w
    "
    sizes="
      (max-width: 640px) 100vw,
      (max-width: 1024px) 50vw,
      33vw
    "
    alt="Course cover"
  />

What it does:
  Mobile: Load 300w image (100vw container width)
  Tablet: Load 600w image (50vw container width)
  Desktop: Load 1200w image (33vw container width)
  Result: Appropriate size for each device


ASPECT RATIO:

Tailwind:
  aspect-video      (16:9)
  aspect-square     (1:1)
  aspect-[4/3]      (custom ratio)
  aspect-[3/2]      (custom ratio)

Usage:
  <div class="aspect-video bg-gray-200">
    <img class="w-full h-full object-cover" />
  </div>

Benefit: Prevents layout shift while image loads


*/

// ═══════════════════════════════════════════════════════════════════════════
// PRODUCTION CHECKLIST: RESPONSIVE DESIGN
// ═══════════════════════════════════════════════════════════════════════════

/*
✅ Mobile Design (< 640px):
  - [ ] Navigation: Bottom nav or hamburger menu
  - [ ] Content: Full width with padding
  - [ ] Touch targets: Minimum 44×44px
  - [ ] Text: Readable without zoom (16px minimum)
  - [ ] Images: Fit within viewport
  - [ ] Tested on: iPhone 12/13, Android phone

✅ Tablet Design (640px - 1023px):
  - [ ] Navigation: Icon-only or collapsible sidebar
  - [ ] Layout: 2-column grid for content
  - [ ] Spacing: Balanced padding and gaps
  - [ ] Touch targets: Comfortable for tablet use
  - [ ] Tested on: iPad, Android tablet

✅ Desktop Design (1024px+):
  - [ ] Navigation: Full sidebar with labels
  - [ ] Layout: 4-column grid or larger
  - [ ] Typography: Comfortable line length (50-75 chars)
  - [ ] Spacing: Generous whitespace
  - [ ] Tested on: 1080p, 1440p, 1920p screens

✅ Touch Interactions:
  - [ ] Hover effects not breaking mobile view
  - [ ] :active states for mobile feedback
  - [ ] :focus-visible for keyboard navigation
  - [ ] Safe areas respected (notches)

✅ Accessibility:
  - [ ] Text readable at all sizes
  - [ ] Color contrast sufficient (WCAG AA)
  - [ ] Interactive elements keyboard accessible
  - [ ] Tested with screen reader

✅ Performance:
  - [ ] Images optimized for all sizes
  - [ ] CSS doesn't exceed 300KB
  - [ ] Layout shifts minimized
  - [ ] Lighthouse score 90+

*/
