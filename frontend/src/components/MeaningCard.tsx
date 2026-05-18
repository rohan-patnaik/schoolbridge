import { BookOpen } from "lucide-react";

interface Props {
  summary: string;
  audioUrl: string | null;
  language: string;
}

export default function MeaningCard({ summary }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-brand-50 border-b border-brand-100 px-5 py-3 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-brand-600" />
        <h2 className="font-semibold text-brand-800">What This Means</h2>
      </div>
      <div className="px-5 py-4">
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {summary}
        </p>
      </div>
    </div>
  );
}
