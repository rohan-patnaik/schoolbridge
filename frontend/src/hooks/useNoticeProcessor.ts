import { useState, useCallback } from "react";
import type { ProcessNoticeResponse, AppState } from "../types/notice";
import { processNotice } from "../lib/api";

export function useNoticeProcessor() {
  const [state, setState] = useState<AppState>("idle");
  const [result, setResult] = useState<ProcessNoticeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const process = useCallback(
    async (uploadedFile: File, targetLanguage: string) => {
      setState("processing");
      setError(null);
      setFile(uploadedFile);

      if (uploadedFile.type.startsWith("image/")) {
        setPreview(URL.createObjectURL(uploadedFile));
      } else {
        setPreview(null);
      }

      try {
        const response = await processNotice(uploadedFile, targetLanguage);
        setResult(response);
        setState("done");
      } catch (e) {
        setError(e instanceof Error ? e.message : "An error occurred");
        setState("error");
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState("idle");
    setResult(null);
    setError(null);
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
  }, [preview]);

  return { state, result, error, file, preview, process, reset };
}
