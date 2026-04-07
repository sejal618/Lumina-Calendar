import React from 'react';
import { format, isSameDay, isWithinInterval } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCalendar } from '../../hooks/useCalendar';
import { DayCell } from './DayCell';
import { NotesPanel } from './NotesPanel';

export const Calendar: React.FC = () => {
  const {
    currentDate,
    days,
    range,
    notes,
    handleDateClick,
    addNote,
    deleteNote,
    nextMonth,
    prevMonth,
  } = useCalendar();

  const isInRange = (date: Date) => {
    if (range.start && range.end) {
      return isWithinInterval(date, { start: range.start, end: range.end });
    }
    return false;
  };

  const isSelected = (date: Date) => 
    (range.start && isSameDay(date, range.start)) || 
    (range.end && isSameDay(date, range.end));

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4 md:p-8">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-5xl flex flex-col md:flex-row overflow-hidden border border-zinc-100">
        {/* Calendar Grid */}
        <div className="flex-1 p-8 md:p-12 border-b md:border-b-0 md:border-r border-zinc-100">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-black text-zinc-900 tracking-tight">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <div className="flex gap-3">
              <button onClick={prevMonth} className="p-3 hover:bg-zinc-100 rounded-2xl transition-all active:scale-95">
                <ChevronLeft className="w-6 h-6 text-zinc-600" />
              </button>
              <button onClick={nextMonth} className="p-3 hover:bg-zinc-100 rounded-2xl transition-all active:scale-95">
                <ChevronRight className="w-6 h-6 text-zinc-600" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-6">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em] py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {days.map((day) => {
              const dateKey = format(day, 'yyyy-MM-dd');
              const hasNote = notes.some(n => n.dateKey === dateKey);
              
              return (
                <DayCell
                  key={day.toISOString()}
                  date={day}
                  currentMonth={currentDate}
                  isSelected={isSelected(day) || false}
                  isInRange={isInRange(day)}
                  hasNote={hasNote}
                  onClick={() => handleDateClick(day)}
                />
              );
            })}
          </div>
        </div>

        {/* Notes Panel */}
        <div className="w-full md:w-[350px] p-8 md:p-12 bg-zinc-50/50">
          <NotesPanel
            notes={notes}
            range={range}
            onAddNote={addNote}
            onDeleteNote={deleteNote}
            currentDate={currentDate}
            accentColor="bg-zinc-900"
          />
        </div>
      </div>
    </div>
  );
};
