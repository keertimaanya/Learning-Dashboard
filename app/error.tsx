"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { SPRING_TRANSITION } from "@/lib/constants";

/**
 * error.tsx — Next.js App Router Error Boundary
 *
 * This error boundary catches rendering errors in Server/Client Components.
 *
 * ERRORS CAUGHT:
 * ✅ Component render errors (TypeError, ReferenceError, etc.)
 * ✅ Data fetching errors (if thrown, not caught elsewhere)
 * ✅ Invalid prop/state errors
 *
 * ERRORS NOT CAUGHT:
 * ❌ Errors in event handlers (use try-catch in onClick)
 * ❌ Async errors/Promise rejections (use try-catch in async functions)
 * ❌ Server Component data fetching (use try-catch in Server Component)
 *
 * WHAT HAPPENS:
 * 1. Any error thrown during render
 * 2. React catches and bubbles up to this boundary
 * 3. Error boundary renders fallback UI
 * 4. User can click "Try again" to reset
 * 5. Error logged for monitoring (server logs, Sentry, etc.)
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error for monitoring
    console.error("Dashboard error boundary caught:", {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });

    // Optional: Send to error tracking service
    // Sentry.captureException(error)
    // or
    // fetch('/api/errors', { method: 'POST', body: JSON.stringify(error) })
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={SPRING_TRANSITION}
        className="w-full max-w-md"
      >
        <article className="flex flex-col items-center gap-4 rounded-2xl border border-surface-border bg-background-card p-8 text-center">
          {/* Error Icon */}
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
            <AlertCircle className="h-7 w-7 text-red-500" />
          </div>

          {/* Error Title */}
          <h2 className="text-xl font-semibold text-text-primary">
            Something went wrong
          </h2>

          {/* Error Description */}
          <p className="text-sm text-text-muted">
            We couldn&apos;t load your dashboard data. This might be a
            temporary issue with our servers.
          </p>

          {/* Error Details (Dev Only) */}
          {process.env.NODE_ENV === "development" && (
            <details className="w-full text-left text-xs">
              <summary className="cursor-pointer font-semibold text-text-muted mb-2">
                Debug Info
              </summary>
              <pre className="bg-surface rounded p-2 text-xs overflow-auto max-h-40 text-text-muted">
                {error.message}
                {"\n"}
                {error.digest && `Digest: ${error.digest}`}
              </pre>
            </details>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 w-full mt-2">
            {/* Try Again Button */}
            <button
              onClick={reset}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-transform hover:scale-105 active:scale-95"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>

            {/* Home Button */}
            <a
              href="/"
              className="flex-1 flex items-center justify-center rounded-lg bg-surface px-4 py-2.5 text-sm font-medium text-text-primary transition-all hover:bg-surface/80"
            >
              Go Home
            </a>
          </div>

          {/* Support Link */}
          <p className="text-xs text-text-muted mt-4">
            Need help?{" "}
            <a
              href="mailto:support@learndash.com"
              className="text-accent hover:underline"
            >
              Contact support
            </a>
          </p>
        </article>
      </motion.div>
    </div>
  );
}
