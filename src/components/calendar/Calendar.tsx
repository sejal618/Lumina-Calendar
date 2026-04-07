import React from 'react';
import { format, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCalendar } from '../../hooks/useCalendar';
import { DayCell } from './DayCell';

export const Calendar: React.FC = () => {
  const {
    currentDate,
    days,
    selectedDate,
    setSelectedDate,
    nextMonth,
    prevMonth,
  } = useCalendar();

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-zinc-800">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex gap-2">
            <button onClick={prevMonth} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={nextMonth} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-4">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
            <div key={day} className="text-center text-xs font-bold text-zinc-400 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => (
            <DayCell
              key={day.toISOString()}
              date={day}
              currentMonth={currentDate}
              isSelected={selectedDate ? isSameDay(day, selectedDate) : false}
              onClick={() => setSelectedDate(day)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
