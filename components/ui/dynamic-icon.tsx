"use client";

import { icons } from "lucide-react";
import { DynamicIconProps } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * DynamicIcon — Maps an icon_name string to a Lucide React component.
 *
 * Why this component exists:
 * The database stores icon names as strings (e.g., "BookOpen", "Code2").
 * We need to dynamically resolve these to actual React components at runtime.
 *
 * Lucide's `icons` export is a record of all icons keyed by PascalCase name.
 * We look up the string in that record and render the matching component.
 *
 * Falls back to a generic circle if the icon name doesn't exist.
 */
export function DynamicIcon({ name, size = 24, className }: DynamicIconProps) {
  const LucideIcon = icons[name as keyof typeof icons];

  if (!LucideIcon) {
    // Fallback: render a simple circle if icon name is invalid
    return (
      <div
        className={cn(
          "rounded-full bg-surface-hover",
          className
        )}
        style={{ width: size, height: size }}
      />
    );
  }

  return <LucideIcon size={size} className={className} />;
}
