import { useState } from "react";
import { Mail, Copy, Check } from "lucide-react";

interface Props {
  draft: string | null;
}

export default function ReplyCard({ draft }: Props) {
  const [copied, setCopied] = useState(false);

  if (!draft) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-violet-50 border-b border-violet-100 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-violet-600" />
          <h2 className="font-semibold text-violet-800">
            Message Back to School
          </h2>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-800 transition-colors px-2 py-1 rounded-lg hover:bg-violet-100"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy
            </>
          )}
        </button>
      </div>
      <div className="px-5 py-4">
        <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-line font-mono leading-relaxed">
          {draft}
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Review and personalize before sending. Replace [Parent Name] and
          [child name] with your details.
        </p>
      </div>
    </div>
  );
}
