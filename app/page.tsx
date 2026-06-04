import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { BentoGrid } from "@/components/layout/bento-grid";
import { HeroTile } from "@/components/tiles/hero-tile";
import { CourseTile } from "@/components/tiles/course-tile";
import { ActivityTile } from "@/components/tiles/activity-tile";
import { EmptyState } from "@/components/ui/empty-state";
import { getCourses } from "@/lib/supabase/queries";
import { BookOpen } from "lucide-react";

/**
 * DashboardPage — Main dashboard Server Component
 *
 * RESPONSIVE LAYOUT:
 * - Mobile (<768px): Sidebar hidden, MobileNav (bottom navigation)
 * - Tablet (768-1023px): Sidebar icon-only (72px), MobileNav above lg
 * - Desktop (1024px+): Full Sidebar (256px collapsed, 72px expanded)
 *
 * ERROR HANDLING LAYERS:
 * 1. getCourses() throws error → caught by error.tsx
 * 2. Empty array (no courses) → show EmptyState with message
 * 3. Successful fetch → render with data
 */
export default async function DashboardPage() {
  // ── Fetch courses from Supabase (throws on error) ──────────
  const courses = await getCourses();

  // ── Your name (change this to your name) ──────────────────
  const userName = "user";

  // ── Render ──────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen pb-16 md:pb-0">
      {/* Desktop/Tablet Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <BentoGrid>
          <HeroTile name={userName} />

          {/* Empty State: No courses found */}
          {courses.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="No courses yet"
              description="Start learning by creating your first course to track progress."
              action={
                <a
                  href="/courses/new"
                  className="inline-block px-4 py-2.5 rounded-lg bg-accent text-white hover:bg-accent/90 transition-all font-medium text-sm"
                >
                  Create Course
                </a>
              }
            />
          ) : (
            /* Course List */
            courses.map((course) => (
              <CourseTile key={course.id} course={course} />
            ))
          )}

          <ActivityTile />
        </BentoGrid>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}
