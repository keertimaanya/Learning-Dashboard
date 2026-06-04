"use client";

import { motion } from "framer-motion";
import { Wifi } from "lucide-react";
import { SPRING_TRANSITION } from "@/lib/constants";

/**
 * OfflineState — Display when user is offline
 *
 * WHEN TO SHOW:
 * - navigator.onLine === false
 * - Network request fails immediately
 * - User on cellular with no signal
 *
 * RECOVERY:
 * - Show when user comes back online (listener on window 'online' event)
 * - Auto-retry once connection restored
 */
export function OfflineState({
  onRetry,
}: {
  onRetry?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={SPRING_TRANSITION}
      className="flex flex-col items-center justify-center rounded-2xl border border-surface-border bg-background-card p-8 text-center"
    >
      {/* Offline Icon */}
      <div className="mb-4 rounded-full bg-yellow-500/10 p-3">
        <Wifi className="h-8 w-8 text-yellow-500" />
      </div>

      {/* Title */}
      <h2 className="text-xl font-semibold text-text-primary mb-2">
        You're offline
      </h2>

      {/* Message */}
      <p className="text-sm text-text-muted max-w-md mb-6">
        Check your connection and try again when you're back online.
      </p>

      {/* Retry Button */}
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2.5 rounded-lg bg-accent text-white hover:bg-accent/90 transition-all font-medium"
        >
          Try Again
        </button>
      )}
    </motion.div>
  );
}
