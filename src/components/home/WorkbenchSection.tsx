"use client";

import { motion } from "framer-motion";
import AdvancedSettings from "@/components/AdvancedSettings";
import CurlPreview from "@/components/CurlPreview";
import RequestBar from "@/components/RequestBar";
import RequestBodyEditor from "@/components/RequestBodyEditor";
import ResponseViewer from "@/components/ResponseViewer";
import SaveToCollection from "@/components/SaveToCollection";
import { useLanguage } from "@/context/LanguageContext";
import type { RequestWorkbenchController } from "@/hooks/useRequestWorkbench";

interface WorkbenchSectionProps {
  workbench: RequestWorkbenchController;
}

export default function WorkbenchSection({ workbench }: WorkbenchSectionProps) {
  const { t } = useLanguage();

  return (
    <section id="workbench" className="grid scroll-mt-24 gap-5 lg:grid-cols-[0.96fr_1.04fr]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        className="flex flex-col gap-4 rounded-2xl border border-dracula-card bg-dracula-card/20 p-4 backdrop-blur-sm sm:p-6"
      >
        <div className="flex items-center gap-2">
          <div className="h-5 w-1.5 rounded-full bg-dracula-purple" />
          <h2 className="text-sm font-semibold uppercase tracking-widest text-dracula-fg">
            {t.request.sectionTitle}
          </h2>
        </div>

        <RequestBar
          method={workbench.method}
          url={workbench.url}
          headers={workbench.headers}
          queryParams={workbench.queryParams}
          auth={workbench.auth}
          body={workbench.body}
          bodyType={workbench.bodyType}
          options={workbench.options}
          onMethodChange={workbench.setMethod}
          onUrlChange={workbench.setUrl}
          onResponse={workbench.handleResponse}
          onError={workbench.handleError}
          isLoading={workbench.isLoading}
          setIsLoading={workbench.setIsLoading}
        />

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
        <RequestBodyEditor
          body={workbench.body}
          method={workbench.method}
          bodyType={workbench.bodyType}
          onChange={workbench.setBody}
        />
        <CurlPreview draft={workbench.currentDraft} />
        <SaveToCollection draft={workbench.currentDraft} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ delay: 0.06 }}
        className="flex flex-col gap-4 rounded-2xl border border-dracula-card bg-dracula-card/20 p-4 backdrop-blur-sm sm:p-6"
      >
        <div className="flex items-center gap-2">
          <div className="h-5 w-1.5 rounded-full bg-dracula-cyan" />
          <h2 className="text-sm font-semibold uppercase tracking-widest text-dracula-fg">{t.common.response}</h2>
        </div>

        <ResponseViewer response={workbench.response} error={workbench.error} isLoading={workbench.isLoading} />
      </motion.div>
    </section>
  );
}
