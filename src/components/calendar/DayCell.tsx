import React, { useRef, useState } from 'react';
import { format, isSameMonth, isSameDay, isBefore, startOfToday } from 'date-fns';
import { useGesture } from '@use-gesture/react';
import { motion, AnimatePresence } from 'framer-motion';
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
  isDragging: boolean;
  onClick: () => void;
  onFocus: () => void;
  onLongPress: () => void;
  onDragEnter: () => void;
  onDragEnd: () => void;
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
  isDragging,
  onClick,
  onFocus,
  onLongPress,
  onDragEnter,
  onDragEnd,
  accentColor,
  rangeColor
}) => {
  const isCurrentMonth = isSameMonth(date, currentMonth);
  const isToday = isSameDay(date, new Date());
  const isPast = isBefore(date, startOfToday());
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const bind = useGesture(
    {
      onDrag: ({ active, first, last, movement: [mx], direction: [dx], velocity: [vx] }) => {
        if (first) {
          if (window.navigator.vibrate) {
            window.navigator.vibrate(50);
          }
          onLongPress();
        }
        if (last) {
          onDragEnd();
        }
      },
      onPointerEnter: () => {
        if (isDragging) {
          onDragEnter();
        }
        setShowTooltip(true);
      },
      onPointerLeave: () => {
        setShowTooltip(false);
      },
      onClick: () => {
        if (!isDragging) {
          onClick();
          // Toggle tooltip on mobile tap if it has content
          if (holiday || (hasNote && noteContent)) {
            setShowTooltip(!showTooltip);
          }
        }
      }
    },
    {
      drag: { 
        delay: 500, // Long press threshold
        triggerAllEvents: true,
        threshold: 10
      }
    }
  );

  return (
    <button
      ref={buttonRef}
      onFocus={() => {
        onFocus();
        setShowTooltip(true);
      }}
      onBlur={() => setShowTooltip(false)}
      {...bind()}
      disabled={!isCurrentMonth}
      className={cn(
        "relative aspect-square flex flex-col items-center justify-center text-sm transition-all duration-300 rounded-2xl group overflow-visible touch-pan-y",
        !isCurrentMonth && "text-zinc-300 dark:text-zinc-700 opacity-0 pointer-events-none",
        isCurrentMonth && "text-zinc-600 dark:text-zinc-400 hover:bg-[var(--primary-light)] dark:hover:bg-[var(--primary-dark)]/20",
        isPast && isCurrentMonth && !isSelected && !isInRange && "opacity-40 grayscale-[0.5]",
        isInRange && !isSelected && isCurrentMonth && "bg-[var(--range-bg)] text-zinc-900 dark:text-zinc-100",
        isSelected && "bg-[var(--primary)] text-[var(--range-text)] shadow-xl z-10 scale-105",
        isToday && !isSelected && "ring-2 ring-inset ring-zinc-200 dark:ring-zinc-700 font-bold",
        isFocused && !isSelected && "ring-2 ring-zinc-400 dark:ring-zinc-500 ring-offset-2 dark:ring-offset-zinc-900",
        isDragging && isCurrentMonth && "cursor-crosshair"
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
          "absolute top-2 right-2 w-1.5 h-1.5 rounded-full transition-colors duration-300",
          isSelected ? "bg-white/60" : holiday.type === 'public' ? "bg-red-500" : "bg-orange-400"
        )} />
      )}

      {hasNote && !isSelected && (
        <div className={cn("absolute bottom-2 w-1 h-1 rounded-full bg-zinc-400 dark:bg-zinc-600")} />
      )}

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (holiday || (hasNote && noteContent)) && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 z-[100] pointer-events-none"
          >
            <div className="bg-zinc-900/90 dark:bg-zinc-100/90 backdrop-blur-md text-white dark:text-zinc-900 text-[10px] font-bold px-3 py-1.5 rounded-full shadow-2xl whitespace-nowrap border border-white/10 dark:border-zinc-900/10 flex items-center gap-2">
              {holiday && (
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  holiday.type === 'public' ? "bg-red-500" : "bg-orange-400"
                )} />
              )}
              {holiday ? holiday.name : noteContent}
            </div>
            {/* Arrow */}
            <div className="w-2 h-2 bg-zinc-900/90 dark:bg-zinc-100/90 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2 border-r border-b border-white/10 dark:border-zinc-900/10" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-zinc-900/0 group-hover:bg-zinc-900/[0.02] dark:group-hover:bg-white/[0.02] transition-colors rounded-2xl" />
    </button>
  );
};
