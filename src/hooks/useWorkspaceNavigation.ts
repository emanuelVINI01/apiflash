"use client";

import { useEffect, useState } from "react";

export interface WorkspaceNavSection {
  id: string;
  label: string;
}

export function useWorkspaceNavigation(sections: readonly WorkspaceNavSection[]) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);
        if (visibleEntry) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      { rootMargin: "-28% 0px -58% 0px", threshold: 0.01 }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections]);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return {
    activeSection,
    scrollToSection,
  };
}

