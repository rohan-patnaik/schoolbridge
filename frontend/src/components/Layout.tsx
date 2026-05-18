import { ReactNode } from "react";
import LanguagePicker from "./LanguagePicker";
import { School, Shield, Moon, Sun } from "lucide-react";

interface Props {
  children: ReactNode;
  language: string;
  onLanguageChange: (lang: string) => void;
  dark: boolean;
  onToggleDark: () => void;
}

export default function Layout({ children, language, onLanguageChange, dark, onToggleDark }: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-sage-100 text-navy-600 dark:bg-navy-900 dark:text-sage-200 transition-colors duration-300">
      <header className="bg-white/80 dark:bg-navy-800/80 backdrop-blur-md border-b border-sage-300/40 dark:border-navy-600/40 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-navy-600 to-navy-500 dark:from-accent-500 dark:to-accent-600 rounded-xl flex items-center justify-center shadow-sm">
              <School className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-navy-600 dark:text-sage-100 leading-tight tracking-tight">
                SchoolBridge
              </h1>
              <p className="text-xs text-sage-500 dark:text-sage-400 leading-tight">
                Understand every school notice
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleDark}
              className="w-9 h-9 rounded-xl flex items-center justify-center bg-sage-100 dark:bg-navy-700 hover:bg-sage-200 dark:hover:bg-navy-600 transition-colors"
              aria-label="Toggle dark mode"
            >
              {dark ? (
                <Sun className="w-4 h-4 text-accent-400" />
              ) : (
                <Moon className="w-4 h-4 text-navy-400" />
              )}
            </button>
            <LanguagePicker value={language} onChange={onLanguageChange} />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8">
        {children}
      </main>

      <footer className="border-t border-sage-300/40 dark:border-navy-700/60 bg-white/60 dark:bg-navy-800/60 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-center gap-1.5 text-xs text-sage-400 dark:text-sage-500">
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
