import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS classes intelligently.
 *
 * Why this exists:
 * - `clsx` handles conditional classes: cn("base", isActive && "active")
 * - `twMerge` resolves conflicts: cn("px-4", "px-6") → "px-6" (not both)
 *
 * This is the industry-standard pattern (used by shadcn/ui, Radix, etc.)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
