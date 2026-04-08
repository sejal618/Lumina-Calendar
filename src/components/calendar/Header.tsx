import React from 'react';
import { ChevronLeft, ChevronRight, Download, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  handlePrev: () => void;
  handleNext: () => void;
  handleDownload: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  handlePrev,
  handleNext,
  handleDownload,
  isDarkMode,
  setIsDarkMode
}) => {
  return (
    <div className="absolute top-0 left-0 right-0 flex flex-col md:flex-row pointer-events-none z-50">
      <div className="w-full md:w-[40%] lg:w-[35%] h-full" /> {/* Spacer for Hero Section */}
      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="flex-1 p-8 md:p-12 pointer-events-auto">
          <div className="flex items-center justify-between gap-4 md:gap-8 lg:gap-12">
            <div className="flex items-center gap-4 flex-shrink-0">
              <button
                onClick={handlePrev}
                className="p-2 bg-zinc-100/50 dark:bg-zinc-800/50 backdrop-blur-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full transition-all text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 border border-zinc-200/50 dark:border-zinc-700/50 flex-shrink-0"
              >
                <ChevronLeft size={24} />
              </button>
              
              {/* Spacer for the flipping title */}
              <div className="w-[200px] md:w-[280px]" />

              <button
                onClick={handleNext}
                className="p-2 bg-zinc-100/50 dark:bg-zinc-800/50 backdrop-blur-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full transition-all text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 border border-zinc-200/50 dark:border-zinc-700/50 flex-shrink-0"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                title="Download Calendar"
                className="p-2 bg-zinc-100/50 dark:bg-zinc-800/50 backdrop-blur-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl text-zinc-500 dark:text-zinc-400 hover:scale-110 transition-transform border border-zinc-200/50 dark:border-zinc-700/50 flex-shrink-0"
              >
                <Download size={20} />
              </button>

              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 bg-zinc-100/50 dark:bg-zinc-800/50 backdrop-blur-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl text-zinc-500 dark:text-zinc-400 hover:scale-110 transition-transform border border-zinc-200/50 dark:border-zinc-700/50 flex-shrink-0"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </div>
        {/* Spacer for Notes Panel to ensure alignment on large screens */}
        <div className="hidden lg:block lg:w-[320px] xl:w-[380px]" />
      </div>
    </div>
  );
};
