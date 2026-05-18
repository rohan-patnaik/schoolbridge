import { useState } from "react";
import { Mail, Copy, Check } from "lucide-react";
import { t } from "../i18n/translations";

interface Props {
  draft: string | null;
  language: string;
}

export default function ReplyCard({ draft, language }: Props) {
  const [copied, setCopied] = useState(false);

  if (!draft) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-navy-700 rounded-2xl border border-sage-300/50 dark:border-navy-600/50 shadow-card overflow-hidden">
      <div className="px-5 py-3.5 flex items-center gap-2.5 border-b bg-accent-50/60 dark:bg-accent-900/20 border-accent-100 dark:border-accent-800/30 justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-accent-500 rounded-lg flex items-center justify-center">
            <Mail className="w-3.5 h-3.5 text-white" />
          </div>
          <h2 className="font-semibold text-accent-800 dark:text-accent-300">
            {t(language, "messageBack")}
          </h2>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs font-medium text-accent-600 dark:text-accent-400 hover:text-accent-800 dark:hover:text-accent-300 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-accent-100 dark:hover:bg-accent-900/30"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              {t(language, "copied")}
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              {t(language, "copy")}
            </>
          )}
        </button>
      </div>
      <div className="px-5 py-4">
        <div className="bg-sage-50 dark:bg-navy-800 rounded-xl p-4 text-sm text-navy-500 dark:text-sage-300 whitespace-pre-line font-mono leading-relaxed border border-sage-200/50 dark:border-navy-600/40">
          {draft}
        </div>
        <p className="text-xs text-sage-400 dark:text-sage-500 mt-2.5">
          {t(language, "replyHint")}
        </p>
      </div>
    </div>
  );
}
