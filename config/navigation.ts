import { NavItem } from "@/lib/types";

/**
 * Sidebar navigation items.
 *
 * Single source of truth — both Sidebar and MobileNav
 * import from here so they never drift out of sync.
 *
 * `icon` is a Lucide icon name string rendered by DynamicIcon.
 */
export const navItems: NavItem[] = [
  { label: "Dashboard", icon: "LayoutDashboard", href: "/" },
  { label: "Courses", icon: "BookOpen", href: "/courses" },
  { label: "Activity", icon: "Activity", href: "/activity" },
  { label: "Settings", icon: "Settings", href: "/settings" },
];
