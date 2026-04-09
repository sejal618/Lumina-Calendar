import React from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay
} from 'date-fns';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { MONTH_THEMES, HOLIDAYS } from '../../constants/calendar';
import { Note } from '../../types/calendar';

interface YearlyViewProps {
  currentDate: Date;
  notes: Note[];
  onMonthSelect: (monthIndex: number) => void;
}

export const YearlyView: React.FC<YearlyViewProps> = ({ currentDate, notes, onMonthSelect }) => {
  const year = currentDate.getFullYear();
  const months = Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));

  return (
    <div className="p-8 md:p-12">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
          {year} <span className="text-zinc-300 dark:text-zinc-700 font-light">At a Glance</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
        {months.map((monthDate, index) => {
          const monthStart = startOfMonth(monthDate);
          const monthEnd = endOfMonth(monthDate);
          const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
          const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
          const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
          const theme = MONTH_THEMES[index];

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onMonthSelect(index)}
              className={cn(
                "group cursor-pointer p-5 rounded-[2.5rem] transition-all duration-500 hover:shadow-2xl hover:-translate-y-1.5 border border-transparent hover:border-white/20 dark:hover:border-zinc-700/20",
                theme.bg,
                "backdrop-blur-sm"
              )}
            >
              <div className={cn(
                "flex items-center justify-between mb-5 px-4 py-2.5 rounded-2xl transition-colors duration-500",
                theme.secondary,
                "bg-opacity-40 dark:bg-opacity-20"
              )}>
                <h3 className={cn(
                  "text-xs font-black tracking-widest uppercase",
                  theme.accent
                )}>
                  {format(monthDate, 'MMM')}
                </h3>
                <div className={cn("w-1.5 h-1.5 rounded-full", theme.primary, "opacity-40")} />
              </div>

              <div className="grid grid-cols-7 gap-1 px-1">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "text-[7px] font-black text-center py-1 transition-colors duration-500",
                      i >= 5 ? theme.accent : "text-zinc-400 dark:text-zinc-600",
                      i >= 5 && "opacity-60"
                    )}
                  >
                    {d}
                  </div>
                ))}
                {days.map((day, dayIdx) => {
                  const isCurrentMonth = isSameMonth(day, monthDate);
                  const isToday = isSameDay(day, new Date());
                  const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                  const dateKey = format(day, 'yyyy-MM-dd');
                  
                  const holiday = HOLIDAYS.find(h => h.date === dateKey);
                  const dayNotes = notes.filter(n => {
                    if (n.type === 'day') return n.dateKey === dateKey;
                    if (n.type === 'range' && n.range) {
                      return dateKey >= n.range.start && dateKey <= n.range.end;
                    }
                    return false;
                  });

                  return (
                    <div
                      key={dayIdx}
                      className={cn(
                        "aspect-square flex items-center justify-center text-[9px] rounded-lg transition-all relative",
                        !isCurrentMonth && "text-transparent pointer-events-none",
                        isCurrentMonth && !isToday && (isWeekend ? theme.accent : "text-zinc-500 dark:text-zinc-400"),
                        isCurrentMonth && isWeekend && !isToday && "opacity-60",
                        isToday && cn("font-black shadow-md scale-125 z-10 ring-2 ring-offset-2 ring-offset-transparent", theme.secondary, theme.accent, "ring-current")
                      )}
                    >
                      {isCurrentMonth ? format(day, 'd') : ''}
                      
                      {isCurrentMonth && holiday && (
                        <div className={cn(
                          "absolute top-0.5 right-0.5 w-0.5 h-0.5 rotate-45",
                          isToday ? "bg-current" : (holiday.type === 'public' ? "bg-indigo-500/60" : "bg-cyan-500/60")
                        )} />
                      )}
                      
                      {isCurrentMonth && dayNotes.length > 0 && (
                        <div className="absolute bottom-0.5 flex gap-px justify-center w-full">
                          {dayNotes.slice(0, 2).map(n => (
                            <div 
                              key={n.id}
                              className={cn("w-0.5 h-0.5 rounded-full", isToday ? "bg-current" : "opacity-60")}
                              style={!isToday ? { backgroundColor: n.color || 'var(--primary)' } : undefined}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
