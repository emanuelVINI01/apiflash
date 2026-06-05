"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  fetchAiUsage,
  generateRequestFromPrompt,
  analyzeResponse,
  generateClientCode,
  type AiUsageSummary,
  type AnalyzeRequestPayload,
  type ClientCodeRequestPayload,
} from "@/services/ai-client";
import { getErrorMessage } from "@/utils/error-message";

export function useAiUsage() {
  const [usage, setUsage] = useState<AiUsageSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { status } = useSession();

  const refetch = useCallback(async () => {
    if (status !== "authenticated") return;
    setIsLoading(true);
    setError("");
    try {
      const data = await fetchAiUsage();
      setUsage(data);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to load usage summary"));
    } finally {
      setIsLoading(false);
    }
  }, [status]);

  useEffect(() => {
    if (status === "authenticated") {
      refetch();
    }
  }, [status, refetch]);

  return { usage, isLoading, error, refetch };
}

export function useAiActions() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);

  const generateRequest = useCallback(async (promptText: string, locale: string) => {
    setIsGenerating(true);
    try {
      const res = await generateRequestFromPrompt(promptText, locale);
      return res;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const analyze = useCallback(async (reqResData: AnalyzeRequestPayload, locale: string, forceRefresh?: boolean) => {
    setIsAnalyzing(true);
    try {
      const res = await analyzeResponse(reqResData, locale, forceRefresh);
      return res;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const generateCode = useCallback(async (reqData: ClientCodeRequestPayload, language: string) => {
    setIsGeneratingCode(true);
    try {
      const res = await generateClientCode(reqData, language);
      return res.code;
    } finally {
      setIsGeneratingCode(false);
    }
  }, []);

  return {
    generateRequest,
    analyze,
    generateCode,
    isGenerating,
    isAnalyzing,
    isGeneratingCode,
  };
}
