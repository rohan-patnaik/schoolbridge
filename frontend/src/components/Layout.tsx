import { ReactNode } from "react";
import LanguagePicker from "./LanguagePicker";
import { School, Shield } from "lucide-react";

interface Props {
  children: ReactNode;
  language: string;
  onLanguageChange: (lang: string) => void;
}

export default function Layout({ children, language, onLanguageChange }: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-sage-100 text-navy-600">
      <header className="bg-white/80 backdrop-blur-md border-b border-sage-300/40 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-navy-600 to-navy-500 rounded-xl flex items-center justify-center shadow-sm">
              <School className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-navy-600 leading-tight tracking-tight">
                SchoolBridge
              </h1>
              <p className="text-xs text-sage-500 leading-tight">
                Understand every school notice
              </p>
            </div>
          </div>
          <LanguagePicker value={language} onChange={onLanguageChange} />
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8">
        {children}
      </main>

      <footer className="border-t border-sage-300/40 bg-white/60 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-center gap-1.5 text-xs text-sage-400">
          <Shield className="w-3 h-3" />
          <span>
            Powered by Gemma 4 &middot; Running locally via Ollama &middot; Your
            data never leaves your computer
          </span>
        </div>
      </footer>
    </div>
  );
}
