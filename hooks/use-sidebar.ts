"use client";

import { useState, useCallback, useEffect } from "react";
import { SIDEBAR_WIDTH, SIDEBAR_COLLAPSED_WIDTH } from "@/lib/constants";

/**
 * Custom hook for sidebar state management.
 *
 * RESPONSIVE BEHAVIOR:
 * - Mobile (<768px): Sidebar hidden (md:hidden in CSS)
 * - Tablet (768-1023px): Auto-collapsed to 72px icon mode
 * - Desktop (1024px+): User can toggle between 256px and 72px
 *
 * Why a hook instead of useState in the component?
 * 1. Encapsulates responsive logic away from UI component
 * 2. Reusable across multiple components
 * 3. Media query listening happens once, not per component render
 * 4. Testable logic separate from React internals
 *
 * AUTO-COLLAPSE LOGIC:
 * On tablet (768-1023px):
 * - Sidebar auto-collapses to save screen space
 * - Users can manually expand via toggle button
 * - Returns to auto-collapsed on resize back to tablet
 * - On desktop, user has full control
 */
export function useSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  const toggle = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  const collapse = useCallback(() => setIsCollapsed(true), []);
  const expand = useCallback(() => setIsCollapsed(false), []);

  // Auto-collapse on tablet breakpoint (md: 768px)
  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const tabletQuery = window.matchMedia("(min-width: 768px) and (max-width: 1023px)");

    const handleDesktopChange = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches);
      // On desktop, user keeps their toggle preference
      // On tablet, auto-collapse
      if (!e.matches) {
        setIsCollapsed(true);
      }
    };

    const handleTabletChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        // Entering tablet mode
        setIsCollapsed(true);
      }
    };

    // Set initial state
    setIsDesktop(desktopQuery.matches);
    if (tabletQuery.matches) {
      setIsCollapsed(true);
    }

    desktopQuery.addEventListener("change", handleDesktopChange);
    tabletQuery.addEventListener("change", handleTabletChange);
    
    return () => {
      desktopQuery.removeEventListener("change", handleDesktopChange);
      tabletQuery.removeEventListener("change", handleTabletChange);
    };
  }, []);

  return {
    isCollapsed,
    toggle,
    collapse,
    expand,
    width: isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH,
  };
}
