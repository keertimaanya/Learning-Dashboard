// ── Database Types ─────────────────────────────────────────
// Matches the Supabase `courses` table schema exactly.

export interface Course {
  id: string;
  title: string;
  progress: number;
  icon_name: string;
  created_at: string;
}

// ── Component Prop Types ───────────────────────────────────

export interface CourseTileProps {
  course: Course;
}

export interface ProgressBarProps {
  /** Progress value from 0 to 100 */
  value: number;
  /** Optional color class override */
  colorClass?: string;
}

export interface DynamicIconProps {
  /** Lucide icon name as a string (e.g., "BookOpen", "Code2") */
  name: string;
  /** Icon size in pixels */
  size?: number;
  /** Optional CSS class */
  className?: string;
}

export interface NavItem {
  label: string;
  icon: string;
  href: string;
}

export interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
}

export interface SkeletonTileProps {
  className?: string;
}
