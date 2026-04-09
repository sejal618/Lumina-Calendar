import React, { useRef, useState } from 'react';
import { format, isSameMonth, isSameDay, isBefore, startOfToday } from 'date-fns';
import { useGesture } from '@use-gesture/react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Holiday, Note } from '../../types/calendar';

interface DayCellProps {
  date: Date;
  currentMonth: Date;
  isSelected: boolean;
  isInRange: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  holiday?: Holiday;
  dayNotes: Note[];
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

export const DayCell: React.FC<DayCellProps> = React.memo(({
  date,
  currentMonth,
  isSelected,
  isInRange,
  isRangeStart,
  isRangeEnd,
  holiday,
  dayNotes,
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
      onPointerEnter: ({ event }) => {
        if (isDragging) {
          onDragEnter();
        }
        // Only show on hover for mouse
        if ((event as PointerEvent).pointerType === 'mouse') {
          setShowTooltip(true);
        }
      },
      onPointerLeave: ({ event }) => {
        if ((event as PointerEvent).pointerType === 'mouse') {
          setShowTooltip(false);
        }
      },
      onClick: () => {
        if (!isDragging) {
          onClick();
          // Toggle tooltip on click (works for both mobile tap and desktop click)
          if (holiday || dayNotes.length > 0) {
            setShowTooltip(prev => !prev);
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
        <div 
          className={cn(
            "absolute top-2 right-2 w-1.5 h-1.5 rotate-45 transition-all duration-300 shadow-sm",
            isSelected 
              ? "bg-[var(--range-text)] opacity-60" 
              : holiday.type === 'public' 
                ? "bg-indigo-500 dark:bg-indigo-400" 
                : "bg-cyan-500 dark:bg-cyan-400"
          )} 
          title={holiday.name}
        />
      )}

      {dayNotes.length > 0 && !isSelected && (
        <div className="absolute bottom-2 flex gap-0.5 justify-center w-full px-1 overflow-hidden">
          {dayNotes.slice(0, 3).map((note, idx) => (
            <div 
              key={note.id}
              className={cn(
                "w-1.5 h-1.5 rounded-full shadow-sm transition-transform group-hover:scale-125 shrink-0",
                !note.color && "bg-[var(--primary)] opacity-60 dark:opacity-80"
              )} 
              style={note.color ? { backgroundColor: note.color } : undefined}
            />
          ))}
          {dayNotes.length > 3 && (
            <div className="w-1 h-1 rounded-full bg-zinc-400 shrink-0 self-center" />
          )}
        </div>
      )}

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (holiday || dayNotes.length > 0) && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 z-[100] pointer-events-none"
          >
            <div className="bg-zinc-900/90 dark:bg-zinc-100/90 backdrop-blur-md text-white dark:text-zinc-900 text-[10px] font-bold px-3 py-1.5 rounded-2xl shadow-2xl whitespace-nowrap border border-white/10 dark:border-zinc-900/10 flex flex-col gap-1 min-w-[120px]">
              {holiday && (
                <div className="flex items-center gap-2 border-b border-white/10 dark:border-zinc-900/10 pb-1 mb-1">
                  <div className={cn(
                    "w-1.5 h-1.5 rotate-45 shrink-0",
                    holiday.type === 'public' ? "bg-indigo-500" : "bg-cyan-500"
                  )} />
                  <span>{holiday.name}</span>
                </div>
              )}
              {dayNotes.map((note, idx) => (
                <div key={note.id} className="flex items-center gap-2">
                  <div 
                    className="w-1.5 h-1.5 rounded-full shrink-0" 
                    style={{ backgroundColor: note.color || 'var(--primary)' }}
                  />
                  <span className={cn("truncate max-w-[150px]", holiday || idx > 0 ? "opacity-70 font-medium" : "")}>
                    {note.content}
                  </span>
                </div>
              ))}
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
});
