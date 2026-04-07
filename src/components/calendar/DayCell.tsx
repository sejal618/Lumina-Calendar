import React from 'react';
import { format, isSameMonth, isSameDay, isBefore, startOfToday } from 'date-fns';
import { cn } from '../../lib/utils';
import { Holiday } from '../../types/calendar';

interface DayCellProps {
  date: Date;
  currentMonth: Date;
  isSelected: boolean;
  isInRange: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  holiday?: Holiday;
  hasNote: boolean;
  noteContent?: string;
  isFocused: boolean;
  onClick: () => void;
  onFocus: () => void;
  accentColor: string;
  rangeColor: string;
}

export const DayCell: React.FC<DayCellProps> = ({
  date,
  currentMonth,
  isSelected,
  isInRange,
  isRangeStart,
  isRangeEnd,
  holiday,
  hasNote,
  noteContent,
  isFocused,
  onClick,
  onFocus,
  accentColor,
  rangeColor
}) => {
  const isCurrentMonth = isSameMonth(date, currentMonth);
  const isToday = isSameDay(date, new Date());
  const isPast = isBefore(date, startOfToday());

  return (
    <button
      onClick={onClick}
      onFocus={onFocus}
      disabled={!isCurrentMonth}
      className={cn(
        "relative aspect-square flex flex-col items-center justify-center text-sm transition-all duration-300 rounded-2xl group overflow-hidden",
        !isCurrentMonth && "text-zinc-300 dark:text-zinc-700 opacity-0 pointer-events-none",
        isCurrentMonth && "text-zinc-600 dark:text-zinc-400 hover:bg-[var(--primary-light)] dark:hover:bg-[var(--primary-dark)]/20",
        isPast && isCurrentMonth && !isSelected && !isInRange && "opacity-40 grayscale-[0.5]",
        isInRange && !isSelected && isCurrentMonth && "bg-[var(--range-bg)] text-zinc-900 dark:text-zinc-100",
        isSelected && "bg-[var(--primary)] text-white shadow-xl z-10 scale-105",
        isToday && !isSelected && "ring-2 ring-inset ring-zinc-200 dark:ring-zinc-700 font-bold",
        isFocused && !isSelected && "ring-2 ring-zinc-400 dark:ring-zinc-500 ring-offset-2 dark:ring-offset-zinc-900"
      )}
    >
      <span className={cn(
        "font-medium relative z-10 transition-transform duration-300 group-hover:scale-110",
        isSelected && "font-bold"
      )}>
        {format(date, 'd')}
      </span>

      {holiday && (
        <div className={cn(
          "absolute top-2 right-2 w-1.5 h-1.5 rounded-full",
          isSelected ? "bg-white/40" : "bg-red-400"
        )} title={holiday.name} />
      )}

      {hasNote && !isSelected && (
        <div className={cn("absolute bottom-2 w-1 h-1 rounded-full bg-zinc-400 dark:bg-zinc-600")} />
      )}

      {/* Tooltip on hover */}
      {(holiday || (hasNote && noteContent)) && (
        <div className="absolute bottom-full mb-2 hidden group-hover:block z-50">
          <div className="bg-zinc-800 text-white text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap max-w-[150px] truncate">
            {holiday ? holiday.name : noteContent}
          </div>
        </div>
      )}

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-zinc-900/0 group-hover:bg-zinc-900/[0.02] dark:group-hover:bg-white/[0.02] transition-colors" />
    </button>
  );
};
