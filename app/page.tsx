"use client";

import AppChrome from "@/components/AppChrome";
import HomeHero from "@/components/home/HomeHero";
import PresetCards from "@/components/home/PresetCards";
import ResourceLinksSection from "@/components/home/ResourceLinksSection";
import WorkbenchSection from "@/components/home/WorkbenchSection";
import WorkflowSection from "@/components/home/WorkflowSection";
import { useRequestWorkbench } from "@/hooks/useRequestWorkbench";

export default function Home() {
  const workbench = useRequestWorkbench();

  return (
    <AppChrome>
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-12 pt-10 sm:px-6 sm:pt-14">
        <HomeHero method={workbench.method} response={workbench.response} />
        <PresetCards onApply={workbench.applyDraft} />
        <WorkbenchSection workbench={workbench} />
        <ResourceLinksSection />
        <WorkflowSection />
      </main>
    </AppChrome>
  );
}
