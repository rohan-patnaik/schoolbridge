import { Globe } from "lucide-react";

const LANGUAGES: Record<string, string> = {
  en: "English",
  es: "Espanol",
  zh: "Chinese",
  ar: "Arabic",
  hi: "Hindi",
  fr: "French",
  vi: "Vietnamese",
  ko: "Korean",
};

interface Props {
  value: string;
  onChange: (lang: string) => void;
}

export default function LanguagePicker({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-2 bg-sage-100 dark:bg-navy-700 rounded-xl px-3 py-1.5">
      <Globe className="w-4 h-4 text-sage-500 dark:text-sage-400" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm bg-transparent text-navy-600 dark:text-sage-200 font-medium focus:outline-none cursor-pointer pr-1"
      >
        {Object.entries(LANGUAGES).map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}
