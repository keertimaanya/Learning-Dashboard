"use client";

import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { navItems } from "@/config/navigation";
import { DynamicIcon } from "@/components/ui/dynamic-icon";
import { cn } from "@/lib/utils";
import { SPRING_TRANSITION } from "@/lib/constants";

/**
 * MobileNav — Bottom fixed navigation bar for mobile/tablet
 *
 * RESPONSIVE VISIBILITY:
 * - Mobile (<768px): Shown (fixed bottom)
 * - Tablet (768-1023px): Hidden (sidebar used instead with icon-only)
 * - Desktop (1024px+): Hidden (full sidebar used)
 *
 * FEATURES:
 * - Fixed at bottom with 64px height
 * - Icons with labels (4 max items recommended)
 * - Active indicator with layoutId for smooth animation
 * - Touch-friendly (44px minimum tap target)
 * - Blurred backdrop for iOS aesthetic
 * - Synced with navItems config for consistency
 *
 * LAYOUT CONSIDERATION:
 * - Page needs pb-16 (4rem) or pb-20 (5rem) to avoid content under nav
 * - On tablet/desktop, padding removed with md:pb-0 in page
 */
export function MobileNav() {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavClick = (href: string) => {
    router.push(href);
  };

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={SPRING_TRANSITION}
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 md:hidden",
        "flex items-center justify-around",
        "h-16 border-t border-surface-border bg-background-elevated/80 backdrop-blur-lg"
      )}
    >
      {navItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <motion.button
            key={item.href}
            onClick={() => handleNavClick(item.href)}
            className="relative flex flex-col items-center gap-1 flex-1 h-full"
            whileTap={{ scale: 0.95 }}
          >
            {/* Active Background */}
            {isActive && (
              <motion.div
                layoutId="mobile-nav-active"
                className="absolute inset-0 rounded-lg bg-surface/50 mx-2"
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
            )}

            {/* Icon + Label Container */}
            <div className="relative z-10 flex flex-col items-center gap-1">
              {/* Icon */}
              <DynamicIcon
                name={item.icon}
                size={20}
                className={cn(
                  "transition-colors",
                  isActive ? "text-accent" : "text-text-muted"
                )}
              />

              {/* Label */}
              <span
                className={cn(
                  "text-[10px] font-medium transition-colors",
                  isActive ? "text-accent" : "text-text-muted"
                )}
              >
                {item.label}
              </span>
            </div>
          </motion.button>
        );
      })}
    </motion.nav>
  );
}
