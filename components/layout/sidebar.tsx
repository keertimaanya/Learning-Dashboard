"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, GraduationCap } from "lucide-react";
import { navItems } from "@/config/navigation";
import { SidebarItem } from "./sidebar-item";
import { useSidebar } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";

/**
 * Sidebar — Collapsible left navigation panel
 *
 * RESPONSIVE BEHAVIOR:
 * - Mobile (<768px): hidden (md:hidden)
 * - Tablet (768-1023px): shown but compact, auto-collapsed to 72px icon mode
 * - Desktop (1024px+): full sidebar with expand/collapse toggle
 *
 * WIDTH MODES:
 * - Icon-only: 72px (collapsed, tablet default)
 * - Expanded: 256px (shows text labels)
 * - Collapsed: 72px (desktop collapse toggle)
 *
 * ANIMATION BREAKDOWN:
 * 1. WIDTH MORPH: 256px ↔ 72px with spring physics
 * 2. TEXT FADE: Label text fades in/out
 * 3. CHEVRON ROTATION: Arrow rotates 180° to show state
 *
 * WHY auto-collapse on tablet:
 * - 768px width × 256px sidebar = 33% screen taken (too much)
 * - 768px width × 72px sidebar = 9% screen (acceptable)
 * - Users can still expand if needed on larger tablets
 */
export function Sidebar() {
  const { isCollapsed, toggle, width } = useSidebar();
  const [activeItem, setActiveItem] = useState("/");

  return (
    <motion.aside
      animate={{ width }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "hidden md:flex flex-col border-r border-surface-border bg-background-elevated",
        "h-screen sticky top-0 overflow-hidden"
      )}
    >
      {/* Logo area */}
      <header className="flex items-center gap-3 p-4 h-16">
        <GraduationCap className="h-7 w-7 text-accent shrink-0" />
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm font-semibold text-text-primary whitespace-nowrap"
          >
            LearnDash
          </motion.span>
        )}
      </header>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1 px-3 mt-4">
        {navItems.map((item) => (
          <SidebarItem
            key={item.href}
            item={item}
            isActive={activeItem === item.href}
            isCollapsed={isCollapsed}
            onClick={() => setActiveItem(item.href)}
          />
        ))}
      </nav>

      {/* Collapse toggle (desktop only) */}
      <button
        onClick={toggle}
        className="flex items-center justify-center h-12 border-t border-surface-border text-text-muted hover:text-text-primary transition-colors hidden lg:flex"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <motion.div
          animate={{ rotate: isCollapsed ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <ChevronLeft className="h-4 w-4" />
        </motion.div>
      </button>
    </motion.aside>
  );
}
