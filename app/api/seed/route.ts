import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * POST /api/seed
 *
 * Inserts test course data into the Supabase `courses` table.
 * Use this endpoint to quickly populate your dashboard with sample data.
 *
 * Example usage (in browser):
 * - Visit http://localhost:3000/api/seed
 * - Or run: curl -X POST http://localhost:3000/api/seed
 */
export async function POST() {
  try {
    console.log("🌱 Seed: Starting...");
    console.log("NEXT_PUBLIC_SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
    
    const supabase = createClient();
    console.log("🌱 Seed: Supabase client created");

    const { data, error } = await supabase.from("courses").insert([
      { title: "JavaScript Fundamentals", progress: 45, icon_name: "Code2" },
      { title: "React Mastery", progress: 78, icon_name: "Zap" },
      { title: "Web Design Basics", progress: 20, icon_name: "Palette" },
      { title: "Node.js Backend", progress: 90, icon_name: "Server" },
      { title: "TypeScript Advanced", progress: 60, icon_name: "BookOpen" },
    ]);

    if (error) {
      console.error("🌱 Seed error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    console.log("🌱 Seed: Success! Inserted courses:", data);
    return NextResponse.json({
      success: true,
      message: "5 test courses inserted successfully",
      data,
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error";
    console.error("🌱 Seed catch error:", errorMsg, err);
    return NextResponse.json(
      { error: errorMsg },
      { status: 500 }
    );
  }
}
