import React, { useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  format, 
  eachDayOfInterval, 
  isSameDay, 
  isToday,
  startOfToday
} from 'date-fns';
import { MessageSquare } from 'lucide-react';
import { DateRange, Note } from '../../types/calendar';
import { cn } from '../../lib/utils';

interface RangeTimelineProps {
  range: DateRange;
  notes: Note[];
  onDateClick: (date: Date) => void;
  accentColor?: string;
}

export const RangeTimeline: React.FC<RangeTimelineProps> = ({
  range,
  notes,
  onDateClick,
  accentColor = 'bg-[var(--primary)]'
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const timelineDays = useMemo(() => {
    if (!range.start || !range.end) return [];
    try {
      return eachDayOfInterval({ start: range.start, end: range.end });
    } catch (e) {
      return [];
    }
  }, [range]);

  useEffect(() => {
    if (timelineDays.length > 0 && scrollRef.current) {
      // Auto-scroll to today if it's in the range, otherwise to the start
      const today = startOfToday();
      const todayIndex = timelineDays.findIndex(day => isSameDay(day, today));
      
      if (todayIndex !== -1) {
        const element = scrollRef.current.children[todayIndex] as HTMLElement;
        if (element) {
          scrollRef.current.scrollTo({
            left: element.offsetLeft - scrollRef.current.offsetWidth / 2 + element.offsetWidth / 2,
            behavior: 'smooth'
          });
        }
      } else {
        scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      }
    }
  }, [timelineDays]);

  if (timelineDays.length === 0) return null;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="mt-8 border-t border-zinc-100 dark:border-zinc-800 pt-8 overflow-hidden"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-600">
          Range Timeline
        </h3>
        <span className="text-[10px] font-bold text-zinc-400">
          {timelineDays.length} Days Selected
        </span>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {timelineDays.map((day) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const dayNotes = notes.filter(n => n.dateKey === dateKey);
          const hasNote = dayNotes.length > 0;
          const isStart = range.start && isSameDay(day, range.start);
          const isEnd = range.end && isSameDay(day, range.end);
          const isCurrentToday = isToday(day);

          return (
            <motion.button
              key={day.toISOString()}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDateClick(day)}
              className={cn(
                "flex-shrink-0 w-20 h-24 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all snap-center relative",
                isStart || isEnd 
                  ? cn(accentColor, "text-white shadow-lg shadow-[var(--primary)]/20")
                  : "bg-zinc-50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800",
                isCurrentToday && !(isStart || isEnd) && "ring-2 ring-[var(--primary)]/30"
              )}
            >
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                {format(day, 'EEE')}
              </span>
              <span className="text-2xl font-black tracking-tighter">
                {format(day, 'd')}
              </span>
              
              {hasNote && (
                <div className={cn(
                  "absolute top-2 right-2 w-2 h-2 rounded-full",
                  isStart || isEnd ? "bg-white" : "bg-[var(--primary)]"
                )} />
              )}

              {dayNotes.length > 0 && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                  {dayNotes.slice(0, 3).map((_, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "w-1 h-1 rounded-full",
                        isStart || isEnd ? "bg-white/40" : "bg-zinc-300 dark:bg-zinc-600"
                      )} 
                    />
                  ))}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};
