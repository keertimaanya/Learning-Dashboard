"use client";

import { motion } from "framer-motion";
import { SPRING_TRANSITION } from "@/lib/constants";
import { LucideIcon } from "lucide-react";

/**
 * EmptyState — Display when no results found
 *
 * WHEN TO USE:
 * - Query returns empty array
 * - No data in database
 * - Filtered results are empty
 * - User hasn't created anything yet
 *
 * DO NOT USE FOR:
 * - Errors (use ErrorState)
 * - Loading states (use skeletons)
 */
export function EmptyState({
  icon: Icon,
  title = "No results",
  description = "Get started by creating something new.",
  action,
}: {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={SPRING_TRANSITION}
      className="flex flex-col items-center justify-center rounded-2xl border border-surface-border bg-background-card p-12 text-center"
    >
      {/* Icon */}
      {Icon && (
        <div className="mb-4 rounded-full bg-accent/10 p-3">
          <Icon className="h-8 w-8 text-accent" />
        </div>
      )}

      {/* Title */}
      <h2 className="text-xl font-semibold text-text-primary mb-2">
        {title}
      </h2>

      {/* Description */}
      <p className="text-sm text-text-muted max-w-md mb-6">{description}</p>

      {/* Action Button */}
      {action && <div className="mt-4">{action}</div>}
    </motion.div>
  );
}
