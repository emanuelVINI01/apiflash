import { BookOpenText, History, Home, Library, PanelsTopLeft, type LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface NavLabels {
  home: string;
  workbench: string;
  collections: string;
  history: string;
  docs: string;
}

export function createNavItems(labels: NavLabels): NavItem[] {
  return [
    { href: "/", label: labels.home, icon: Home },
    { href: "/workspace", label: labels.workbench, icon: PanelsTopLeft },
    { href: "/collections", label: labels.collections, icon: Library },
    { href: "/history", label: labels.history, icon: History },
    { href: "/docs", label: labels.docs, icon: BookOpenText },
  ];
}
