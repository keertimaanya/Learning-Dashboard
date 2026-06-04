import { createClient } from "./server";
import { Course } from "@/lib/types";

/**
 * Error handling strategy:
 *
 * Server Components propagate errors up to error boundaries.
 * If getCourses() throws, Next.js catches it and shows error.tsx.
 *
 * Why throw instead of returning null?
 * - Null means "no data found" (valid state)
 * - Error means "something broke" (invalid state)
 * - By throwing, we trigger error.tsx, not a blank page
 */

export async function getCourses(): Promise<Course[]> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("courses")
      .select("id, title, progress, icon_name, created_at")
      .order("created_at", { ascending: false });

    // Distinguish between "table doesn't exist" and "no rows"
    if (error) {
      // This error will propagate to error.tsx
      throw new Error(
        `Database error: ${error.message}. ` +
          `(Code: ${error.code})`
      );
    }

    // data can be null if query succeeds but no rows match
    return data || [];
  } catch (err) {
    // Log on server (won't leak to client)
    const message = err instanceof Error ? err.message : String(err);
    console.error("[getCourses] Failed:", message);

    // Re-throw so Next.js error boundary catches it
    throw new Error(`Failed to load courses: ${message}`);
  }
}

/**
 * Fetches a single course by ID.
 *
 * Returns null if not found (valid case).
 * Throws if database error (invalid case).
 */
export async function getCourseById(id: string): Promise<Course | null> {
  if (!id || typeof id !== "string") {
    throw new Error("Invalid course ID");
  }

  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("courses")
      .select("id, title, progress, icon_name, created_at")
      .eq("id", id)
      .single();

    if (error) {
      // PGRST116 = "no rows" (valid, return null)
      // Other codes = actual error (throw)
      if (error.code === "PGRST116") {
        return null;
      }
      throw new Error(`Database error: ${error.message}`);
    }

    return data;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[getCourseById] Failed for ID ${id}:`, message);
    throw new Error(`Failed to load course: ${message}`);
  }
}

/**
 * Advanced: Batch fetch multiple courses by ID
 *
 * Why batch?
 * - Single query with IN clause is faster than N queries
 * - Reduces round trips
 * - Better for displaying related courses
 */
export async function getCoursesByIds(ids: string[]): Promise<Course[]> {
  if (!ids.length) return [];

  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("courses")
      .select("id, title, progress, icon_name, created_at")
      .in("id", ids)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    return data || [];
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[getCoursesByIds] Failed:", message);
    throw new Error(`Failed to load courses: ${message}`);
  }
}
