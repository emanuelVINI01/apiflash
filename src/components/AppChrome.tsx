"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";
import AppHeader from "@/components/layout/AppHeader";
import MobileNav from "@/components/layout/MobileNav";
import { createNavItems } from "@/components/layout/nav-items";
import { useLanguage } from "@/context/LanguageContext";

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const navItems = createNavItems(t.common);

  return (
    <div className="min-h-screen bg-dracula-bg text-dracula-fg">
      <AppHeader
        pathname={pathname}
        navItems={navItems}
        subtitle={t.nav.subtitle}
        loginLabel={t.common.login}
        logoutLabel={t.common.logout}
      />
      <div className="relative z-10 pt-14 sm:pt-16">{children}</div>
      <Footer />
      <MobileNav pathname={pathname} items={navItems} />
    </div>
  );
}
