import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { isSameDay, isWithinInterval, format } from 'date-fns';
import { ChevronLeft, ChevronRight, Moon, Sun } from 'lucide-react';
import { useCalendar } from '../../hooks/useCalendar';
import { HeroSection } from './HeroSection';
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
    setRangeStart,
    updateRangeEnd,
    endDragging,
    isDragging,
    addNote,
    deleteNote,
    setIsDarkMode,
    setRange
  } = useCalendar();

  const [direction, setDirection] = useState(0);

  const handleNext = () => {
    setDirection(1);
    nextMonth();
  };

  const handlePrev = () => {
    setDirection(-1);
    prevMonth();
  };

  // Swipe gesture handler
  const handleDragEnd = (event: any, info: any) => {
    const threshold = 100;
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    if (Math.abs(offset) > threshold || Math.abs(velocity) > 500) {
      if (offset < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };
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
      '--primary-foreground': dynamicTheme.primaryForeground,
      '--range-bg': dynamicTheme.rangeBg,
      '--range-text': dynamicTheme.rangeText,
      '--accent': dynamicTheme.accent,
    } as React.CSSProperties;
  }, [dynamicTheme]);

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

        {/* Static Header Layer - Navigation Arrows only */}
        <div className="absolute top-0 left-0 right-0 flex flex-col md:flex-row pointer-events-none z-50">
          <div className="w-full md:w-[40%] lg:w-[35%] h-full" /> {/* Spacer for Hero Section */}
          <div className="flex-1 p-8 md:p-12 pointer-events-auto">
            <div className="flex items-center justify-between gap-20">
              <div className="flex items-center gap-4 flex-shrink-0">
                <button
                  onClick={handlePrev}
                  className="p-2 bg-zinc-100/50 dark:bg-zinc-800/50 backdrop-blur-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full transition-all text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 border border-zinc-200/50 dark:border-zinc-700/50 flex-shrink-0"
                >
                  <ChevronLeft size={24} />
                </button>
                
                {/* Spacer for the flipping title */}
                <div className="w-[280px]" />

                <button
                  onClick={handleNext}
                  className="p-2 bg-zinc-100/50 dark:bg-zinc-800/50 backdrop-blur-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full transition-all text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 border border-zinc-200/50 dark:border-zinc-700/50 flex-shrink-0"
                >
                  <ChevronRight size={24} />
                </button>
              </div>

              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 bg-zinc-100/50 dark:bg-zinc-800/50 backdrop-blur-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl text-zinc-500 dark:text-zinc-400 hover:scale-110 transition-transform border border-zinc-200/50 dark:border-zinc-700/50 flex-shrink-0"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </div>

        <div className="relative" style={{ perspective: 2500 }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentDate.toISOString()}
              custom={direction}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              initial={{ 
                rotateX: direction > 0 ? 110 : -110,
                rotateY: direction > 0 ? -2 : 2,
                opacity: 0,
                scale: 0.92,
                z: -100,
                y: 60,
                transformOrigin: "top"
              }}
              animate={{ 
                rotateX: 0,
                rotateY: 0,
                opacity: 1,
                scale: 1,
                z: 0,
                y: 0,
                transformOrigin: "top"
              }}
              exit={{ 
                rotateX: direction > 0 ? -110 : 110,
                rotateY: direction > 0 ? 2 : -2,
                opacity: 0,
                scale: 0.92,
                z: -100,
                y: -60,
                transformOrigin: "top"
              }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 32,
                mass: 1,
                opacity: { duration: 0.2 }
              }}
              className="relative flex flex-col md:flex-row min-h-[700px] preserve-3d"
            >
              {/* Dynamic Shadow Sweep - Simulates light changing as page curves */}
              <motion.div 
                className="absolute inset-0 z-40 pointer-events-none rounded-[2.5rem]"
                initial={{ 
                  opacity: 0, 
                  background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.3) 100%)" 
                }}
                animate={{ 
                  opacity: 0,
                  transition: { duration: 0.4 }
                }}
                exit={{ 
                  opacity: 1, 
                  background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.6) 100%)",
                  transition: { duration: 0.3 }
                }}
              />
              
              {/* Paper Sheen - Subtle highlight that moves across the page */}
              <motion.div 
                className="absolute inset-0 z-40 pointer-events-none rounded-[2.5rem]"
                initial={{ 
                  opacity: 0.4, 
                  background: "linear-gradient(120deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0) 70%)",
                  backgroundSize: "200% 100%",
                  backgroundPosition: "100% 0%"
                }}
                animate={{ 
                  opacity: 0,
                  backgroundPosition: "-100% 0%",
                  transition: { duration: 0.6, ease: "easeOut" }
                }}
              />

              {/* Left: Hero Section */}
              <div className="w-full md:w-[40%] lg:w-[35%]">
                <HeroSection currentDate={currentDate} />
              </div>

              {/* Right: Calendar & Notes */}
              <div className="flex-1 flex flex-col lg:flex-row">
                {/* Calendar Grid */}
                <div className="flex-1 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-zinc-100 dark:border-zinc-800">
                  {/* Navigation Header - Grouped < Month Year > */}
                  <div className="flex items-center justify-between gap-20 mb-12">
                    <div className="flex items-center gap-4 flex-shrink-0">
                      {/* Invisible spacers to maintain layout relative to static buttons */}
                      <div className="w-10 h-10 flex-shrink-0" />
                      
                      <div className="w-[280px] text-center">
                        <h2 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight truncate">
                          {format(currentDate, 'MMMM yyyy')}
                        </h2>
                      </div>

                      <div className="w-10 h-10 flex-shrink-0" />
                    </div>

                    {/* Invisible spacer for theme toggle */}
                    <div className="w-10 h-10 flex-shrink-0" />
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
            </motion.div>
          </AnimatePresence>
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
