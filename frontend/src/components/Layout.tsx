import { ReactNode } from "react";
import LanguagePicker from "./LanguagePicker";
import { School } from "lucide-react";

interface Props {
  children: ReactNode;
  language: string;
  onLanguageChange: (lang: string) => void;
}

export default function Layout({ children, language, onLanguageChange }: Props) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-brand-600 rounded-lg flex items-center justify-center">
              <School className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">
                SchoolBridge
              </h1>
              <p className="text-xs text-gray-500 leading-tight">
                Understand every school notice
              </p>
            </div>
          </div>
          <LanguagePicker value={language} onChange={onLanguageChange} />
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {children}
      </main>

      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-3 text-center text-xs text-gray-400">
          Powered by Gemma 4 &middot; Running locally via Ollama &middot; Your
          data never leaves your computer
        </div>
      </footer>
    </div>
  );
}
