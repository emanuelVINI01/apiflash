"use client";

import { useMemo } from "react";
import { Braces, FileCode2, Gauge, ListChecks, PanelRight, Rocket, Save } from "lucide-react";
import AppChrome from "@/components/AppChrome";
import PresetCards from "@/components/home/PresetCards";
import WorkbenchSection from "@/components/workspace/WorkbenchSection";
import WorkspaceBottomShortcuts from "@/components/workspace/WorkspaceBottomShortcuts";
import WorkspaceHero from "@/components/workspace/WorkspaceHero";
import WorkspaceOverview from "@/components/workspace/WorkspaceOverview";
import WorkspaceSideNav, { type WorkspaceNavigationItem } from "@/components/workspace/WorkspaceSideNav";
import WorkspaceTips from "@/components/workspace/WorkspaceTips";
import { useLanguage } from "@/context/LanguageContext";
import { useRequestWorkbench } from "@/hooks/useRequestWorkbench";
import { useWorkspaceNavigation } from "@/hooks/useWorkspaceNavigation";
import type { RequestDraft } from "@/lib/request-model";

export default function WorkspacePage() {
  const { t } = useLanguage();
  const workbench = useRequestWorkbench();
  const sections = useMemo<WorkspaceNavigationItem[]>(
    () => [
      { id: "workspace-overview", label: t.workspacePage.sections.overview, icon: Gauge },
      { id: "workspace-presets", label: t.workspacePage.sections.presets, icon: Rocket },
      { id: "workspace-request", label: t.workspacePage.sections.request, icon: PanelRight },
      { id: "workspace-settings", label: t.workspacePage.sections.settings, icon: ListChecks },
      { id: "workspace-body", label: t.workspacePage.sections.body, icon: Braces },
      { id: "workspace-export", label: t.workspacePage.sections.export, icon: Save },
      { id: "workspace-response", label: t.workspacePage.sections.response, icon: FileCode2 },
    ],
    [t.workspacePage.sections]
  );
  const navigation = useWorkspaceNavigation(sections);

  const applyPreset = (draft: RequestDraft) => {
    workbench.applyDraft(draft);
    window.setTimeout(() => navigation.scrollToSection("workspace-request"), 0);
  };

  return (
    <AppChrome>
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-28 pt-10 sm:px-6 sm:pt-14">
        <WorkspaceHero
          badge={t.workspacePage.badge}
          title={t.workspacePage.title}
          subtitle={t.workspacePage.subtitle}
          actionLabel={t.workspacePage.openRequest}
          onOpenRequest={() => navigation.scrollToSection("workspace-request")}
        />

        <div className="grid gap-6 lg:grid-cols-[13.5rem_minmax(0,1fr)]">
          <WorkspaceSideNav
            title={t.workspacePage.navTitle}
            items={sections}
            activeId={navigation.activeSection}
            onSelect={navigation.scrollToSection}
          />

          <div className="grid min-w-0 gap-7">
            <WorkspaceOverview workbench={workbench} labels={t.workspacePage.metrics} />

            <section id="workspace-presets" className="scroll-mt-24">
              <PresetCards onApply={applyPreset} />
            </section>

            <WorkbenchSection workbench={workbench} />
            <WorkspaceTips title={t.workspacePage.tipsTitle} tips={t.workspacePage.tips} />
          </div>
        </div>
      </main>

      <WorkspaceBottomShortcuts
        label={t.workspacePage.mobileNavLabel}
        items={sections}
        activeId={navigation.activeSection}
        onSelect={navigation.scrollToSection}
      />
    </AppChrome>
  );
}

