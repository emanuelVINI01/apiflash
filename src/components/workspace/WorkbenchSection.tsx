"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import AdvancedSettings from "@/components/AdvancedSettings";
import CurlPreview from "@/components/CurlPreview";
import RequestBar from "@/components/RequestBar";
import RequestBodyEditor from "@/components/RequestBodyEditor";
import ResponseViewer from "@/components/ResponseViewer";
import SaveToCollection from "@/components/SaveToCollection";
import { useLanguage } from "@/context/LanguageContext";
import type { RequestWorkbenchController } from "@/hooks/useRequestWorkbench";
import AiGenerateRequestModal from "@/components/modals/AiGenerateRequestModal";
import AiCodeExporter from "@/components/AiCodeExporter";

interface WorkbenchSectionProps {
  workbench: RequestWorkbenchController;
}

export default function WorkbenchSection({ workbench }: WorkbenchSectionProps) {
  const { t } = useLanguage();
  const [generateModalOpen, setGenerateModalOpen] = useState(false);

  return (
    <section id="workbench" className="grid scroll-mt-24 gap-5 xl:grid-cols-[0.96fr_1.04fr]">
      <motion.div
        id="workspace-request"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        className="flex scroll-mt-24 flex-col gap-4 rounded-xl border border-dracula-card bg-dracula-card/20 p-4 backdrop-blur-sm sm:p-6"
      >
        <div className="flex items-center gap-2">
          <div className="h-5 w-1.5 rounded-full bg-dracula-purple" />
          <h2 className="text-sm font-semibold uppercase tracking-widest text-dracula-fg">
            {t.request.sectionTitle}
          </h2>
        </div>

        <RequestBar
          draft={workbench.currentDraft}
          onMethodChange={workbench.setMethod}
          onUrlChange={workbench.setUrl}
          onResponse={workbench.handleResponse}
          onError={workbench.handleError}
          isLoading={workbench.isLoading}
          setIsLoading={workbench.setIsLoading}
          onAiGenerateClick={() => setGenerateModalOpen(true)}
        />

        <div id="workspace-settings" className="scroll-mt-24">
          <AdvancedSettings
            headers={workbench.headers}
            queryParams={workbench.queryParams}
            auth={workbench.auth}
            options={workbench.options}
            bodyType={workbench.bodyType}
            onHeadersChange={workbench.setHeaders}
            onQueryParamsChange={workbench.setQueryParams}
            onAuthChange={workbench.setAuth}
            onOptionsChange={workbench.setOptions}
            onBodyTypeChange={workbench.setBodyType}
          />
        </div>

        <div id="workspace-body" className="scroll-mt-24">
          <RequestBodyEditor
            body={workbench.body}
            method={workbench.method}
            bodyType={workbench.bodyType}
            onChange={workbench.setBody}
          />
        </div>

        <div id="workspace-export" className="grid scroll-mt-24 gap-4">
          <CurlPreview draft={workbench.currentDraft} />
          <AiCodeExporter draft={workbench.currentDraft} />
          <SaveToCollection draft={workbench.currentDraft} />
        </div>
      </motion.div>

      <motion.div
        id="workspace-response"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ delay: 0.06 }}
        className="flex scroll-mt-24 flex-col gap-4 rounded-xl border border-dracula-card bg-dracula-card/20 p-4 backdrop-blur-sm sm:p-6"
      >
        <div className="flex items-center gap-2">
          <div className="h-5 w-1.5 rounded-full bg-dracula-cyan" />
          <h2 className="text-sm font-semibold uppercase tracking-widest text-dracula-fg">{t.common.response}</h2>
        </div>

        <ResponseViewer
          response={workbench.response}
          error={workbench.error}
          isLoading={workbench.isLoading}
          requestData={{
            method: workbench.method,
            url: workbench.url,
            headers: workbench.headers,
            body: workbench.body,
          }}
        />
      </motion.div>

      <AiGenerateRequestModal
        open={generateModalOpen}
        onClose={() => setGenerateModalOpen(false)}
        onApplied={(draft) => workbench.applyDraft(draft)}
      />
    </section>
  );
}

