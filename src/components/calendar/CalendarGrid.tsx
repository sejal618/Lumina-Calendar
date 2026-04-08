import React from 'react';
import { format, isSameDay } from 'date-fns';
import { DayCell } from './DayCell';
import { Holiday, Note, DateRange } from '../../types/calendar';
import { HOLIDAYS } from '../../constants/calendar';

interface CalendarGridProps {
  days: Date[];
  currentDate: Date;
  range: DateRange;
  notes: Note[];
  focusedDate: Date;
  isDragging: boolean;
  handleDateClick: (date: Date) => void;
  setFocusedDate: (date: Date) => void;
  setRangeStart: (date: Date) => void;
  updateRangeEnd: (date: Date) => void;
  endDragging: () => void;
  isInRange: (date: Date) => boolean;
  isRangeStart: (date: Date) => boolean;
  isRangeEnd: (date: Date) => boolean;
}

export const CalendarGrid: React.FC<CalendarGridProps> = React.memo(({
  days,
  currentDate,
  range,
  notes,
  focusedDate,
  isDragging,
  handleDateClick,
  setFocusedDate,
  setRangeStart,
  updateRangeEnd,
  endDragging,
  isInRange,
  isRangeStart,
  isRangeEnd
}) => {
  return (
    <div className="flex-1 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-zinc-100 dark:border-zinc-800">
      {/* Navigation Header - Grouped < Month Year > */}
      <div className="flex items-center justify-between gap-4 md:gap-8 lg:gap-12 mb-12">
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Invisible spacers to maintain layout relative to static buttons */}
          <div className="w-10 h-10 flex-shrink-0" />
          
          <div className="w-[200px] md:w-[280px] text-center">
            <h2 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight truncate">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
          </div>

          <div className="w-10 h-10 flex-shrink-0" />
        </div>

        {/* Invisible spacer for theme toggle and download button group */}
        <div className="w-[88px] h-10 flex-shrink-0" />
      </div>

      <div className="grid grid-cols-7 gap-2 mb-6">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-[10px] font-black text-zinc-300 dark:text-zinc-700 uppercase tracking-[0.3em] py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const holiday = HOLIDAYS.find(h => h.date === dateKey);
          
          // Check for any note that applies to this day
          const dayNotes = notes.filter(n => {
            if (n.type === 'day') return n.dateKey === dateKey;
            if (n.type === 'range' && n.range) {
              return dateKey >= n.range.start && dateKey <= n.range.end;
            }
            return false;
          });
          
          const hasNote = dayNotes.length > 0;
          const noteContent = dayNotes[0]?.content;
          const noteColor = dayNotes[0]?.color;

          return (
            <DayCell
              key={day.toISOString()}
              date={day}
              currentMonth={currentDate}
              isSelected={isRangeStart(day) || isRangeEnd(day)}
              isInRange={isInRange(day)}
              isRangeStart={isRangeStart(day)}
              isRangeEnd={isRangeEnd(day)}
              holiday={holiday}
              hasNote={hasNote}
              noteContent={noteContent}
              noteColor={noteColor}
              isFocused={isSameDay(day, focusedDate)}
              isDragging={isDragging}
              onClick={() => handleDateClick(day)}
              onFocus={() => setFocusedDate(day)}
              onLongPress={() => setRangeStart(day)}
              onDragEnter={() => updateRangeEnd(day)}
              onDragEnd={endDragging}
              accentColor="bg-[var(--primary)]"
              rangeColor="bg-[var(--range-bg)]"
            />
          );
        })}
      </div>
    </div>
  );
});
