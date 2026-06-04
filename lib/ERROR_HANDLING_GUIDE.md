/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PRODUCTION ERROR HANDLING GUIDE
 * What Can Fail & Graceful Recovery Strategies
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════
// PART 1: FAILURE CATEGORIES
// ═══════════════════════════════════════════════════════════════════════════

/*
In a Next.js dashboard with Supabase, failures occur at multiple levels:

1. DATA FETCHING FAILURES
   └─ Network level, database level, query errors

2. RENDERING FAILURES
   └─ Component errors, missing data, invalid state

3. USER INTERACTION FAILURES
   └─ Form submission, invalid input, permission denied

4. INFRASTRUCTURE FAILURES
   └─ Service unavailable, timeout, rate limiting

Each requires different handling strategies.
*/

// ═══════════════════════════════════════════════════════════════════════════
// PART 2: DATA FETCHING FAILURES (Network & Database)
// ═══════════════════════════════════════════════════════════════════════════

/*
CURRENT ARCHITECTURE:

app/page.tsx (Server Component):
  const courses = await getCourses()
  if (!courses) return <ErrorPage />
  return <BentoGrid>...</BentoGrid>

lib/supabase/queries.ts:
  export async function getCourses() {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false })
      
      if (error) throw error
      return data
    } catch (error) {
      console.error("Failed to fetch courses:", error)
      throw error  // Re-throw to be caught by error boundary
    }
  }


WHAT CAN FAIL:

1. Network Timeout
   Scenario: Slow internet, user on 3G
   Duration: 30+ seconds
   Current handling: Request hangs, page never loads
   Issue: User sees blank page, no feedback

2. Database Connection Error
   Scenario: Supabase server down, credentials invalid
   Status code: 500 / 503
   Current handling: Throws error, cascades up
   Issue: Entire page crashes

3. Invalid Query
   Scenario: Table doesn't exist, column renamed
   Status code: 400 / 422
   Current handling: Throws error
   Issue: Data never loads

4. Rate Limiting
   Scenario: Too many requests in short time
   Status code: 429
   Current handling: Request rejected, no retry
   Issue: User sees error, doesn't know what happened

5. No Results
   Scenario: No courses in database
   Status code: 200 (success!)
   Data: empty array
   Current handling: Still renders, just empty
   Issue: Might be okay, but user confused

6. Permission Denied
   Scenario: Row-Level Security policy blocks query
   Status code: 403
   Current handling: Throws error
   Issue: User sees error, might be security issue


FAILURE CHAIN (What Actually Happens):

User loads dashboard
  ↓
Next.js renders app/page.tsx
  ↓
getCourses() called (Server Component)
  ↓
Supabase.from("courses").select()
  ↓
[NETWORK REQUEST SENT]
  ↓
Network fails
  {Timeout → Error → Re-throw → Error boundary catches → Error page shows}
  or
  {No error → Database down → 500 response → Error thrown}
  or
  {RLS policy blocks → 403 response → Error thrown}
  ↓
React catches error
  ↓
Error boundary (if exists) renders fallback
  ↓
User sees error UI
  or User sees blank page (if no error boundary)

Current state: No error boundary = blank page on failure


ERROR TYPES & STATUS CODES:

PostgreSQL Errors (from Supabase):
  401: Unauthorized (invalid token)
  403: Forbidden (RLS policy denied access)
  404: Not Found (table doesn't exist)
  400: Bad Request (invalid query syntax)
  422: Unprocessable Entity (type mismatch)
  429: Too Many Requests (rate limited)
  500: Internal Server Error (database crash)
  503: Service Unavailable (server down)

Network Errors (from fetch):
  Timeout: Network.request() never completes
  Failed to fetch: Network is down
  CORS error: Browser blocking request
  DNS resolution: Host not found

JavaScript Errors (in application):
  TypeError: Cannot read property of undefined
  ReferenceError: Variable not defined
  SyntaxError: Invalid JSON
  RangeError: Array index out of bounds


HOW TO DETECT & CATEGORIZE:

Supabase errors include:
  error.code: Unique error code
  error.message: Human readable message
  error.status: HTTP status code
  error.details: Additional info

Network errors include:
  error.message: "Failed to fetch"
  error.name: "TypeError"
  error.stack: Stack trace

Example detection:

  try {
    const response = await fetch(url)
    const data = await response.json()
  } catch (error) {
    if (error.message.includes("Failed to fetch")) {
      // Network error (no internet, server unreachable)
      return { type: "NETWORK_ERROR", retry: true }
    }
    
    if (error.message.includes("JSON.parse")) {
      // Invalid response (server returned HTML instead of JSON)
      return { type: "INVALID_RESPONSE", retry: false }
    }
    
    // Unknown error
    return { type: "UNKNOWN", retry: false }
  }

*/

// ═══════════════════════════════════════════════════════════════════════════
// PART 3: RENDERING FAILURES (Component Level)
// ═══════════════════════════════════════════════════════════════════════════

/*
WHAT CAN FAIL:

1. Missing Data
   Code:
     const title = course.title  // But course is undefined
     return <h1>{title}</h1>     // Crash: Cannot read property of undefined
   
   Scenario: Data fetched but null, or undefined in array
   Fix: Validate before rendering
     if (!course) return <CourseSkeleton />
     return <h1>{course.title}</h1>

2. Type Mismatch
   Code:
     const progress = course.progress  // Expected number, got string
     <div style={{ width: `${progress}%` }} />  // width: "45%", works
     const filled = progress * 0.01     // 45 * 0.01 = ERROR (string * number)
   
   Scenario: API returns wrong type (number vs string)
   Fix: Type validation or coercion
     const progress = Number(course.progress) || 0

3. Array Out of Bounds
   Code:
     const courses = data || []
     const firstCourse = courses[0]  // Works
     const tenthCourse = courses[10] // undefined (array only has 3 items)
     return <CourseTile course={tenthCourse} /> // Crash
   
   Scenario: Trying to access item that doesn't exist
   Fix: Check length or provide default
     return courses.map((course, i) => ...)

4. Component Throws
   Code:
     export function BrokenComponent() {
       throw new Error("I'm broken!")
     }
   
   Scenario: Developer accidentally left throw statement
   Fix: Error boundary catches this

5. Infinite Loop
   Code:
     while (true) {
       // Oops, forgot break condition
     }
   
   Scenario: Component hangs forever
   Fix: Timeout detection, React strict mode catches duplicate renders


ERROR BOUNDARY CATCHES:

Rendering errors ✅
  - TypeError: Cannot read property
  - ReferenceError: Variable not defined
  - SyntaxError in JSX

Event handler errors ❌ (NOT CAUGHT)
  - onClick throws error
  - Form submission fails
  - Fetch in useEffect

Async errors ❌ (NOT CAUGHT)
  - Promise rejection not handled
  - setTimeout throws error
  - setTimeout inside event handler

Server-side errors ❌ (NOT CAUGHT ON CLIENT)
  - Server Component throws
  - getServerSideProps fails
  - API route fails


SOLUTION:

Error boundaries catch rendering phase errors.
For other errors, need specific try-catch or try-finally.


*/

// ═══════════════════════════════════════════════════════════════════════════
// PART 4: NETWORK ISSUES (Resilience)
// ═══════════════════════════════════════════════════════════════════════════

/*
COMMON SCENARIOS:

Scenario 1: Slow Network (User on 3G)
  Request takes 10+ seconds
  Current behavior: Hangs indefinitely
  User perception: App is broken
  Solution: Timeout + loading state + fallback

  Implementation:
    1. Timeout on fetch (5-10 seconds)
    2. Show loading skeleton while waiting
    3. If timeout, show retry button
    4. User can retry manually or auto-retry


Scenario 2: Connection Lost (WiFi drops)
  Request starts successfully
  Halfway through download, connection cuts
  Current behavior: Request fails, error thrown
  User perception: "My connection is bad"
  Solution: Retry with exponential backoff

  Implementation:
    1. Detect failure (network error)
    2. Wait 1 second, retry
    3. If fails again, wait 2 seconds, retry
    4. If fails again, wait 4 seconds, retry
    5. After 3 retries, show error UI


Scenario 3: Server Temporarily Down
  Supabase experiencing brief outage (5-10 minutes)
  Current behavior: Error on first request, error forever
  User perception: "Supabase is broken"
  Solution: Retry with user awareness

  Implementation:
    1. Detect server error (5xx status)
    2. Show "Server temporarily unavailable"
    3. Auto-retry every 30 seconds
    4. Show countdown: "Retrying in 29s..."
    5. When recovered, seamlessly resume


Scenario 4: User Goes Offline
  User on mobile, goes through tunnel
  Network unavailable
  Current behavior: Request fails immediately
  User perception: "Network is gone"
  Solution: Offline detection + offline cache

  Implementation:
    1. Detect offline (navigator.onLine)
    2. Show "You're offline"
    3. Use cached data if available
    4. Disable submission buttons
    5. Listen for online event
    6. Auto-sync when back online


RETRY STRATEGIES:

No Retry (immediately show error):
  - Invalid input (user's fault)
  - Permission denied (security issue)
  - Not found (content deleted)
  Reason: Retrying won't help

Simple Retry (try again without delay):
  - Network timeout (might be transient)
  - Rare: Use for very short timeouts

Exponential Backoff (wait longer each time):
  Retry 1: Wait 1 second
  Retry 2: Wait 2 seconds
  Retry 3: Wait 4 seconds
  Retry 4: Wait 8 seconds
  After that: Give up
  Reason: Don't hammer the server

Adaptive Retry (respond to server hints):
  Server returns: Retry-After: 120 (seconds)
  Client waits exactly 120 seconds
  Then retries
  Reason: Server knows when it'll be ready

Rate Limiting (429 response):
  Server says: Too many requests
  Wait: Exponential backoff minimum 60 seconds
  Retry: Once
  Reason: Don't repeat the violation


*/

// ═══════════════════════════════════════════════════════════════════════════
// PART 5: ERROR UI PATTERNS
// ═══════════════════════════════════════════════════════════════════════════

/*
ERROR STATES TO SHOW USER:

1. Loading State (Initial Load)
   Duration: 1-3 seconds (typical)
   UI: Skeleton loaders mimicking content
   Message: Subtle "Loading..." or just skeleton
   Action: None (automatic)
   Purpose: User knows something is happening

   When shown:
     - Page first loads
     - User refreshes
     - Manual retry
   
   Code:
     {isLoading && <CourseSkeleton />}
     {!isLoading && <CourseTile course={course} />}


2. Empty State (No Results)
   Duration: Permanent (until data added)
   UI: Centered icon + message
   Message: "No courses yet. Create your first course to get started."
   Action: Create button if applicable
   Purpose: User understands why nothing is shown

   When shown:
     - Query successful but returns 0 results
     - Database empty
     - User's profile has no data
   
   Code:
     {courses.length === 0 && (
       <EmptyState 
         icon={BookOpen}
         title="No courses yet"
         action={<CreateCourseButton />}
       />
     )}


3. Loading Error (Fetch Failed)
   Duration: Permanent until retry succeeds
   UI: Error icon + message + retry button
   Message: "Failed to load courses. Please check your connection."
   Action: Retry button, contact support link
   Purpose: User knows what failed and can take action

   When shown:
     - Network timeout
     - Server error (5xx)
     - Permission denied
   
   Code:
     {error && (
       <ErrorState 
         title="Failed to load"
         message={error.message}
         onRetry={refetch}
         showContactSupport={isServerError}
       />
     )}


4. Partial Error (Some Data Failed)
   Duration: Permanent until retry
   UI: Show loaded data, show error for failed parts
   Message: "3 courses loaded, 1 failed to load"
   Action: Retry failed parts individually
   Purpose: Don't lose data that loaded successfully

   When shown:
     - Batch request: some succeed, some fail
     - Multiple endpoints: one fails
   
   Code:
     <BentoGrid>
       {successfulCourses.map(c => <CourseTile course={c} />)}
       {failedCourses.map(c => (
         <ErrorTile 
           course={c} 
           onRetry={() => retryCourse(c.id)}
         />
       ))}
     </BentoGrid>


5. Timeout Message (Long Wait)
   Duration: After 10+ seconds of loading
   UI: Loading state + message
   Message: "This is taking longer than usual..."
   Action: None (keep waiting)
   Purpose: User knows it's not frozen

   When shown:
     - Network very slow (3G)
     - Server processing slow request
     - User should be aware
   
   Code:
     {isLoading && hasExceededTimeout && (
       <LoadingState 
         message="Taking longer than usual..."
         timeout={30000}
       />
     )}


6. Offline State (No Connection)
   Duration: Until user goes back online
   UI: Network icon + message
   Message: "You're offline. Some features are unavailable."
   Action: None (automatic recovery)
   Purpose: User understands limited functionality

   When shown:
     - navigator.onLine === false
     - Network error while online
   
   Code:
     {!isOnline && (
       <OfflineWarning message="You're offline" />
     )}


7. Server Error (5xx)
   Duration: Until server recovers or user retries
   UI: Error icon + message + retry countdown
   Message: "Server temporarily unavailable. Retrying in 30s..."
   Action: Retry button, or wait for auto-retry
   Purpose: User knows server is down, not their problem

   When shown:
     - 500 Internal Server Error
     - 503 Service Unavailable
     - 502 Bad Gateway
   
   Code:
     {serverError && (
       <ServerErrorState 
         autoRetryIn={30000}
         onRetryNow={refetch}
       />
     )}


SKELETON LOADING:

Current app uses animation-based skeletons (SkeletonTile component exists)

Purpose: Show structure while loading
Benefits:
  - Perceived performance (appears faster)
  - User sees what's coming
  - No "flash" when content appears
  - Professional polish

Best practices:
  - Match actual component shape/size
  - Animate shimmer effect
  - Show multiple skeletons (3-5) if possible
  - Skeleton for each tile, not one generic loader

Example:
  <CourseSkeleton />  (skeleton tile)
  <CourseSkeleton />
  <CourseSkeleton />
  While loading: 3 skeleton tiles show structure
  When loaded: Fade in real data over skeletons


*/

// ═══════════════════════════════════════════════════════════════════════════
// PART 6: IMPLEMENTING ERROR HANDLING
// ═══════════════════════════════════════════════════════════════════════════

/*
LAYERS OF ERROR HANDLING:

Layer 1: Data Fetching (Server Component)
  Where: lib/supabase/queries.ts
  What: Catch errors, categorize, throw with context
  Code:
    try {
      const { data, error } = await supabase.from("courses").select()
      if (error) {
        throw new QueryError(error.message, {
          code: error.code,
          status: error.status,
          table: "courses"
        })
      }
      return data || []
    } catch (error) {
      console.error("Failed to fetch courses:", error)
      throw error  // Let error boundary handle
    }


Layer 2: Page Level (Server Component Error)
  Where: app/page.tsx
  What: Handle data fetching errors, show error UI
  Code:
    try {
      const courses = await getCourses()
      return <BentoGrid courses={courses} />
    } catch (error) {
      return <ErrorPage error={error} />
    }


Layer 3: Component Level (Client Component)
  Where: components/tiles/course-tile.tsx
  What: Handle missing data, invalid props
  Code:
    if (!course) return <CourseSkeleton />
    if (!course.title) return <ErrorTile message="Missing title" />
    return <AnimatedCard>...</AnimatedCard>


Layer 4: Boundary Level (Global Error Catch)
  Where: app/error.tsx
  What: Catch uncaught errors, render fallback
  Code:
    export default function Error({ error, reset }) {
      return (
        <div>
          <h1>Something went wrong</h1>
          <pre>{error.message}</pre>
          <button onClick={reset}>Try again</button>
        </div>
      )
    }


RECOVERY STRATEGIES:

User-Triggered Recovery:
  - Retry button they click
  - Refresh page
  - Navigate to different page
  Advantage: Always works, user in control
  Disadvantage: User must take action

Automatic Recovery:
  - Auto-retry on network error
  - Fallback to cached data
  - Timeout then show error
  Advantage: Seamless for user
  Disadvantage: Might show stale data


MONITORING & LOGGING:

What to log:
  - Error message
  - Error code/status
  - Stack trace
  - User context (if available)
  - Request details (URL, method, body)
  - Response details (status, headers)
  - Timestamp

Where to log:
  - Browser console (dev only)
  - Server logs (CloudWatch, Vercel)
  - Error tracking (Sentry, DataDog)
  - Analytics (track error frequency)

Example:
  console.error({
    message: error.message,
    code: error.code,
    status: error.status,
    url: request.url,
    timestamp: new Date().toISOString(),
    userId: session?.user?.id
  })

*/

// ═══════════════════════════════════════════════════════════════════════════
// PRODUCTION CHECKLIST: ERROR HANDLING
// ═══════════════════════════════════════════════════════════════════════════

/*
✅ Data Fetching Layer:
  - [ ] Try-catch in all query functions
  - [ ] Error categorization (network vs database vs permission)
  - [ ] Meaningful error messages
  - [ ] Error logging to server
  - [ ] Retry logic for retryable errors

✅ Server Component Layer:
  - [ ] Try-catch in page.tsx
  - [ ] Error page component (app/error.tsx)
  - [ ] Graceful fallback UI
  - [ ] User-friendly error messages

✅ Component Layer:
  - [ ] Null checks on all data access
  - [ ] Loading states with skeletons
  - [ ] Empty states when appropriate
  - [ ] Error boundaries for child components

✅ Network Resilience:
  - [ ] Request timeout (10-30 seconds)
  - [ ] Retry on network failure
  - [ ] Exponential backoff for retries
  - [ ] User notification for long waits

✅ User Experience:
  - [ ] Loading state (skeleton)
  - [ ] Empty state (no results)
  - [ ] Error state (with retry button)
  - [ ] Offline state (if applicable)
  - [ ] Timeout message (after 10s)

✅ Monitoring:
  - [ ] Error logging (console + server)
  - [ ] Error tracking (Sentry optional)
  - [ ] Performance monitoring (load times)
  - [ ] User feedback mechanism

*/
