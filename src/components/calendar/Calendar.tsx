import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { isSameDay, isWithinInterval, format } from 'date-fns';
import { useCalendar } from '../../hooks/useCalendar';
import { HeroSection } from './HeroSection';
import { CalendarHeader } from './CalendarHeader';
import { DayCell } from './DayCell';
import { NotesPanel } from './NotesPanel';
import { SpiralBinding } from './SpiralBinding';
import { MONTH_THEMES, HOLIDAYS } from '../../constants/calendar';
import { cn } from '../../lib/utils';
import { extractThemeFromImage, DynamicTheme } from '../../services/themeService';

export const Calendar: React.FC = () => {
  const {
    currentDate,
    days,
    range,
    notes,
    isDarkMode,
    focusedDate,
    setFocusedDate,
    nextMonth,
    prevMonth,
    handleDateClick,
    addNote,
    deleteNote,
    setIsDarkMode,
    setRange
  } = useCalendar();

  const [direction, setDirection] = useState(0);
  const [dynamicTheme, setDynamicTheme] = useState<DynamicTheme | null>(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) return;

      const { addDays, subDays } = require('date-fns');
      let newDate = focusedDate;

      switch (e.key) {
        case 'ArrowUp': newDate = subDays(focusedDate, 7); break;
        case 'ArrowDown': newDate = addDays(focusedDate, 7); break;
        case 'ArrowLeft': newDate = subDays(focusedDate, 1); break;
        case 'ArrowRight': newDate = addDays(focusedDate, 1); break;
        case 'Enter': handleDateClick(focusedDate); return;
        default: return;
      }

      e.preventDefault();
      if (newDate.getMonth() !== currentDate.getMonth()) {
        if (newDate > currentDate) handleNext();
        else handlePrev();
      }
      setFocusedDate(newDate);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedDate, currentDate]);

  const theme = MONTH_THEMES[currentDate.getMonth()];

  // Update dynamic theme when image changes
  useEffect(() => {
    let isMounted = true;
    extractThemeFromImage(theme.image).then(newTheme => {
      if (isMounted) setDynamicTheme(newTheme);
    });
    return () => { isMounted = false; };
  }, [theme.image]);

  // CSS Variables for the dynamic theme
  const themeStyles = useMemo(() => {
    if (!dynamicTheme) return {};
    return {
      '--primary': dynamicTheme.primary,
      '--primary-dark': dynamicTheme.primaryDark,
      '--primary-light': dynamicTheme.primaryLight,
      '--range-bg': dynamicTheme.rangeBg,
      '--accent': dynamicTheme.accent,
    } as React.CSSProperties;
  }, [dynamicTheme]);

  const handleNext = () => {
    setDirection(1);
    nextMonth();
  };

  const handlePrev = () => {
    setDirection(-1);
    prevMonth();
  };

  const isInRange = (date: Date) => {
    if (range.start && range.end) {
      return isWithinInterval(date, { start: range.start, end: range.end });
    }
    return false;
  };

  const isRangeStart = (date: Date) => range.start && isSameDay(date, range.start);
  const isRangeEnd = (date: Date) => range.end && isSameDay(date, range.end);

  return (
    <div 
      className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 md:p-8 lg:p-12 transition-colors duration-500"
      style={themeStyles}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-7xl mx-auto relative bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] dark:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] overflow-visible border border-zinc-200 dark:border-zinc-800"
      >
        <SpiralBinding />

        <div className="flex flex-col md:flex-row min-h-[700px]">
          {/* Left: Hero Section */}
          <div className="w-full md:w-[40%] lg:w-[35%]">
            <HeroSection currentDate={currentDate} />
          </div>

          {/* Right: Calendar & Notes */}
          <div className="flex-1 flex flex-col lg:flex-row">
            {/* Calendar Grid */}
            <div className="flex-1 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-zinc-100 dark:border-zinc-800">
              <CalendarHeader
                currentDate={currentDate}
                onPrev={handlePrev}
                onNext={handleNext}
                isDarkMode={isDarkMode}
                onToggleTheme={() => setIsDarkMode(!isDarkMode)}
                accentColor={theme.primary}
              />

              <div className="grid grid-cols-7 gap-2 mb-6">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-[10px] font-black text-zinc-300 dark:text-zinc-700 uppercase tracking-[0.3em] py-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="relative overflow-hidden -m-4 p-4">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentDate.toISOString()}
                    custom={direction}
                    initial={{ 
                      opacity: 0, 
                      x: direction * 50,
                      rotateY: direction * 15
                    }}
                    animate={{ opacity: 1, x: 0, rotateY: 0 }}
                    exit={{ 
                      opacity: 0, 
                      x: direction * -50,
                      rotateY: direction * -15
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="grid grid-cols-7 gap-2"
                    style={{ perspective: 1000 }}
                  >
                    {days.map((day) => {
                      const dateKey = format(day, 'yyyy-MM-dd');
                      const holiday = HOLIDAYS.find(h => h.date === dateKey);
                      const dayNotes = notes.filter(n => n.dateKey === dateKey);
                      const hasNote = dayNotes.length > 0;
                      const noteContent = dayNotes[0]?.content;

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
                          isFocused={isSameDay(day, focusedDate)}
                          onClick={() => handleDateClick(day)}
                          onFocus={() => setFocusedDate(day)}
                          accentColor="bg-[var(--primary)]"
                          rangeColor="bg-[var(--range-bg)]"
                        />
                      );
                    })}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="w-full lg:w-[320px] xl:w-[380px] p-8 md:p-12 bg-zinc-50/50 dark:bg-zinc-900/50 backdrop-blur-sm rounded-br-[2.5rem]">
              <NotesPanel
                notes={notes}
                range={range}
                onAddNote={addNote}
                onDeleteNote={deleteNote}
                onClearRange={() => setRange({ start: null, end: null })}
                currentDate={currentDate}
                accentColor="bg-[var(--primary)]"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Footer Info */}
      <div className="max-w-7xl mx-auto mt-12 flex flex-col md:flex-row items-center justify-between gap-8 px-4 opacity-40 hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-8">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-600 mb-2">Edition</span>
            <span className="text-sm font-serif italic text-zinc-500 dark:text-zinc-400">Lumina Professional</span>
          </div>
          <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-800" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-600 mb-2">Status</span>
            <span className="text-sm font-medium text-zinc-400 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Synced to Local
            </span>
          </div>
        </div>
        
        <div className="text-right hidden md:block">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600 mb-1">Interactive Wall Calendar</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Designed for clarity and focus.</p>
        </div>
      </div>
    </div>
  );
};
