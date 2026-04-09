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
              className="group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className={cn(
                  "text-lg font-black tracking-tight transition-colors",
                  theme.accent
                )}>
                  {format(monthDate, 'MMMM')}
                </h3>
                <div className="w-8 h-px bg-zinc-100 dark:bg-zinc-800 group-hover:w-12 transition-all duration-300" />
              </div>

              <div className="grid grid-cols-7 gap-1">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                  <div key={i} className="text-[8px] font-black text-zinc-300 dark:text-zinc-700 text-center py-1">
                    {d}
                  </div>
                ))}
                {days.map((day, dayIdx) => {
                  const isCurrentMonth = isSameMonth(day, monthDate);
                  const isToday = isSameDay(day, new Date());
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
                        "aspect-square flex items-center justify-center text-[10px] rounded-sm transition-colors relative",
                        !isCurrentMonth && "text-transparent pointer-events-none",
                        isCurrentMonth && "text-zinc-500 dark:text-zinc-500",
                        isToday && "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold"
                      )}
                    >
                      {isCurrentMonth ? format(day, 'd') : ''}
                      
                      {isCurrentMonth && holiday && (
                        <div className={cn(
                          "absolute top-0.5 right-0.5 w-0.5 h-0.5 rotate-45",
                          holiday.type === 'public' ? "bg-indigo-500" : "bg-cyan-500"
                        )} />
                      )}
                      
                      {isCurrentMonth && dayNotes.length > 0 && (
                        <div className="absolute bottom-0.5 flex gap-px justify-center w-full">
                          {dayNotes.slice(0, 2).map(n => (
                            <div 
                              key={n.id}
                              className="w-0.5 h-0.5 rounded-full"
                              style={{ backgroundColor: n.color || 'var(--primary)' }}
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
