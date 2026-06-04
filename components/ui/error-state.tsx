"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { SPRING_TRANSITION } from "@/lib/constants";

/**
 * ErrorState — Display errors with recovery options
 *
 * WHAT ERRORS TO SHOW:
 * - Network failures (timeout, connection lost)
 * - Database errors (5xx server errors)
 * - Permission errors (403 Forbidden)
 * - Invalid queries (400 Bad Request)
 *
 * RECOVERY OPTIONS:
 * - onRetry: Manual retry button
 * - autoRetryIn: Auto-retry countdown (ms)
 * - contactSupport: Show support link for critical errors
 */
export function ErrorState({
  title = "Something went wrong",
  message = "Please check your connection and try again.",
  onRetry,
  autoRetryIn,
  isRetrying = false,
  contactSupport = false,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
  autoRetryIn?: number;
  isRetrying?: boolean;
  contactSupport?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={SPRING_TRANSITION}
      className="flex flex-col items-center justify-center rounded-2xl border border-surface-border bg-background-card p-8 text-center"
    >
      {/* Error Icon */}
      <div className="mb-4 rounded-full bg-red-500/10 p-3">
        <AlertCircle className="h-8 w-8 text-red-500" />
      </div>

      {/* Title */}
      <h2 className="text-xl font-semibold text-text-primary mb-2">{title}</h2>

      {/* Message */}
      <p className="text-sm text-text-muted max-w-md mb-6">{message}</p>

      {/* Auto-Retry Countdown */}
      {autoRetryIn && (
        <p className="text-xs text-text-muted mb-4">
          Retrying in {Math.ceil(autoRetryIn / 1000)}s...
        </p>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 w-full max-w-xs">
        {/* Retry Button */}
        {onRetry && (
          <button
            onClick={onRetry}
            disabled={isRetrying}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
              isRetrying
                ? "bg-surface text-text-muted cursor-not-allowed"
                : "bg-accent text-white hover:bg-accent/90 active:scale-95"
            }`}
          >
            <RefreshCw className="h-4 w-4" />
            {isRetrying ? "Retrying..." : "Try Again"}
          </button>
        )}

        {/* Contact Support Link */}
        {contactSupport && (
          <a
            href="mailto:support@learndash.com"
            className="px-4 py-2.5 rounded-lg text-accent border border-accent/30 hover:bg-accent/5 transition-all"
          >
            Contact Support
          </a>
        )}
      </div>

      {/* Error Code (for debugging) */}
      {process.env.NODE_ENV === "development" && (
        <p className="text-xs text-text-muted mt-6 font-mono">
          {title.toLowerCase().replace(/\s+/g, "_")}
        </p>
      )}
    </motion.div>
  );
}
