import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { isSameDay, isWithinInterval, format, addDays, subDays } from 'date-fns';
import { toPng } from 'html-to-image';
import { useCalendar } from '../../hooks/useCalendar';
import { HeroSection } from './HeroSection';
import { NotesPanel } from './NotesPanel';
import { SpiralBinding } from './SpiralBinding';
import { CalendarGrid } from './CalendarGrid';
import { Header } from './Header';
import { YearlyView } from './YearlyView';
import { MONTH_THEMES } from '../../constants/calendar';
import { extractThemeFromImage, DynamicTheme } from '../../services/themeService';

export const Calendar: React.FC = () => {
  const {
    currentDate,
    days,
    range,
    notes,
    isDarkMode,
    focusedDate,
    isDragging,
    customImages,
    setFocusedDate,
    nextMonth,
    prevMonth,
    goToMonth,
    handleDateClick,
    setRangeStart,
    updateRangeEnd,
    endDragging,
    addNote,
    deleteNote,
    updateNote,
    setIsDarkMode,
    setRange,
    setCustomImage
  } = useCalendar();

  const [view, setView] = useState<'month' | 'year'>('month');
  const [direction, setDirection] = useState(0);
  const calendarRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(async () => {
    if (calendarRef.current === null) return;
    
    try {
      const dataUrl = await toPng(calendarRef.current, {
        cacheBust: true,
        backgroundColor: isDarkMode ? '#09090b' : '#fafafa',
        style: {
          borderRadius: '2.5rem',
        }
      });
      const link = document.createElement('a');
      link.download = `calendar-${format(currentDate, 'yyyy-MM')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download calendar image', err);
    }
  }, [currentDate, isDarkMode]);

  const handleNext = useCallback(() => {
    setDirection(1);
    nextMonth();
  }, [nextMonth]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    prevMonth();
  }, [prevMonth]);

  // Swipe gesture handler
  const handleDragEnd = useCallback((_event: any, info: any) => {
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
  }, [handleNext, handlePrev]);

  const [dynamicTheme, setDynamicTheme] = useState<DynamicTheme | null>(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) return;

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
  }, [focusedDate, currentDate, handleDateClick, handleNext, handlePrev, setFocusedDate]);

  const theme = MONTH_THEMES[currentDate.getMonth()];
  const currentMonthImage = customImages[currentDate.getMonth()] || theme.image;

  // Update dynamic theme when image changes
  useEffect(() => {
    let isMounted = true;
    extractThemeFromImage(currentMonthImage).then(newTheme => {
      if (isMounted) setDynamicTheme(newTheme);
    });
    return () => { isMounted = false; };
  }, [currentMonthImage]);

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

  const isInRange = useCallback((date: Date) => {
    if (range.start && range.end) {
      return isWithinInterval(date, { start: range.start, end: range.end });
    }
    return false;
  }, [range]);

  const isRangeStart = useCallback((date: Date) => range.start && isSameDay(date, range.start), [range.start]);
  const isRangeEnd = useCallback((date: Date) => range.end && isSameDay(date, range.end), [range.end]);

  return (
    <div 
      className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 md:p-8 lg:p-12 transition-colors duration-500"
      style={themeStyles}
    >
      <motion.div
        ref={calendarRef}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-7xl mx-auto relative bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] dark:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] overflow-visible border border-zinc-200 dark:border-zinc-800"
      >
        <SpiralBinding />

        <Header 
          view={view}
          setView={setView}
          handlePrev={handlePrev}
          handleNext={handleNext}
          handleDownload={handleDownload}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />

        <div className="relative" style={{ perspective: 2500 }}>
          <AnimatePresence mode="wait" custom={direction}>
            {view === 'month' ? (
              <motion.div
                key="month-view"
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
                {/* Dynamic Shadow Sweep */}
                <motion.div 
                  className="absolute inset-0 z-40 pointer-events-none rounded-[2.5rem]"
                  initial={{ 
                    opacity: 0, 
                    background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.3) 100%)" 
                  }}
                  animate={{ opacity: 0, transition: { duration: 0.4 } }}
                  exit={{ 
                    opacity: 1, 
                    background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.6) 100%)",
                    transition: { duration: 0.3 }
                  }}
                />
                
                {/* Paper Sheen */}
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
                  <HeroSection 
                    currentDate={currentDate} 
                    customImage={customImages[currentDate.getMonth()]}
                    onImageChange={(url) => setCustomImage(currentDate.getMonth(), url)}
                  />
                </div>

                {/* Right: Calendar & Notes */}
                <div className="flex-1 flex flex-col lg:flex-row">
                  <CalendarGrid 
                    days={days}
                    currentDate={currentDate}
                    range={range}
                    notes={notes}
                    focusedDate={focusedDate}
                    isDragging={isDragging}
                    handleDateClick={handleDateClick}
                    setFocusedDate={setFocusedDate}
                    setRangeStart={setRangeStart}
                    updateRangeEnd={updateRangeEnd}
                    endDragging={endDragging}
                    isInRange={isInRange}
                    isRangeStart={isRangeStart}
                    isRangeEnd={isRangeEnd}
                  />

                  <div className="w-full lg:w-[320px] xl:w-[380px] p-8 md:p-12 bg-zinc-50/50 dark:bg-zinc-900/50 backdrop-blur-sm rounded-br-[2.5rem]">
                    <NotesPanel
                      notes={notes}
                      range={range}
                      onAddNote={addNote}
                      onDeleteNote={deleteNote}
                      onUpdateNote={updateNote}
                      onClearRange={() => setRange({ start: null, end: null })}
                      currentDate={currentDate}
                      accentColor="bg-[var(--primary)]"
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="year-view"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="min-h-[700px]"
              >
                <YearlyView 
                  currentDate={currentDate}
                  notes={notes}
                  onMonthSelect={(index) => {
                    goToMonth(index);
                    setView('month');
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

       {/* Footer Info */}
      <div className="max-w-7xl mx-auto mt-12 flex flex-col md:flex-row items-center justify-between gap-8 px-4 opacity-40 hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-8">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600 mb-2">Edition</span>
            <span className="text-sm font-serif italic text-zinc-500 dark:text-zinc-400">Lumina Professional</span>
          </div>
          <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-800" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600 mb-2">Status</span>
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
