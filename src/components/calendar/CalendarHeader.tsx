import React from 'react';
import { ChevronLeft, ChevronRight, Moon, Sun } from 'lucide-react';
import { format } from 'date-fns';

interface CalendarHeaderProps {
  currentDate: Date;
  onPrev: () => void;
  onNext: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  accentColor: string;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  onPrev,
  onNext,
  isDarkMode,
  onToggleTheme,
  accentColor
}) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <button
          onClick={onPrev}
          className="p-2 hover:bg-[var(--primary-light)] dark:hover:bg-[var(--primary-dark)]/20 rounded-full transition-colors text-zinc-400 hover:text-[var(--primary-dark)] dark:hover:text-[var(--primary-light)]"
        >
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 min-w-[150px] text-center">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <button
          onClick={onNext}
          className="p-2 hover:bg-[var(--primary-light)] dark:hover:bg-[var(--primary-dark)]/20 rounded-full transition-colors text-zinc-400 hover:text-[var(--primary-dark)] dark:hover:text-[var(--primary-light)]"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <button
        onClick={onToggleTheme}
        className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-zinc-500 dark:text-zinc-400 hover:scale-110 transition-transform"
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </div>
  );
};
