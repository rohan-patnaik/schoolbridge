import type { ProcessNoticeResponse } from "../types/notice";

const API_BASE = "/api";

export async function processNotice(
  file: File,
  targetLanguage: string
): Promise<ProcessNoticeResponse> {
  const form = new FormData();
  form.append("file", file);
  form.append("target_language", targetLanguage);

  const res = await fetch(`${API_BASE}/process-notice`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Processing failed: ${text}`);
  }

  return res.json();
}
