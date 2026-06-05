"use client";

import AppChrome from "@/components/AppChrome";
import HomeHero from "@/components/home/HomeHero";
import MonitoringPlatformSections from "@/components/home/MonitoringPlatformSections";

export default function HomePage() {
  return (
    <AppChrome>
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-12 pt-10 sm:px-6 sm:pt-14">
        <HomeHero />
        <MonitoringPlatformSections />
      </main>
    </AppChrome>
  );
}
