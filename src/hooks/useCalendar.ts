import { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isBefore,
} from 'date-fns';
import { DateRange, Note } from '../types/calendar';

export function useCalendar() {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [notes, setNotes] = useState<Note[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('calendar-theme') === 'dark';
    }
    return false;
  });
  const [focusedDate, setFocusedDate] = useState<Date>(() => new Date());
  const [customImages, setCustomImages] = useState<Record<number, string>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('calendar-custom-images');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  // Initial load
  useEffect(() => {
    const savedNotes = localStorage.getItem('calendar-notes');
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (e) {
        console.error('Failed to parse saved notes', e);
      }
    }
  }, []);

  // Persistence
  useEffect(() => {
    localStorage.setItem('calendar-notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('calendar-theme', isDarkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('calendar-custom-images', JSON.stringify(customImages));
  }, [customImages]);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const nextMonth = useCallback(() => {
    setCurrentDate(prev => {
      const next = addMonths(prev, 1);
      setFocusedDate(startOfMonth(next));
      return next;
    });
  }, []);

  const prevMonth = useCallback(() => {
    setCurrentDate(prev => {
      const prevM = subMonths(prev, 1);
      setFocusedDate(startOfMonth(prevM));
      return prevM;
    });
  }, []);

  const goToMonth = useCallback((monthIndex: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev.getFullYear(), monthIndex, 1);
      setFocusedDate(newDate);
      return newDate;
    });
  }, []);

  const [isDragging, setIsDragging] = useState(false);

  const handleDateClick = useCallback((date: Date) => {
    setRange(prev => {
      if (!prev.start || (prev.start && prev.end)) {
        return { start: date, end: null };
      } else {
        if (isBefore(date, prev.start)) {
          return { start: date, end: prev.start };
        } else {
          return { start: prev.start, end: date };
        }
      }
    });
  }, []);

  const setRangeStart = useCallback((date: Date) => {
    setRange({ start: date, end: null });
    setIsDragging(true);
  }, []);

  const updateRangeEnd = useCallback((date: Date) => {
    setIsDragging(dragging => {
      if (dragging) {
        setRange(prev => {
          if (!prev.start) return prev;
          if (isBefore(date, prev.start)) {
            return { start: date, end: prev.start };
          } else {
            return { start: prev.start, end: date };
          }
        });
      }
      return dragging;
    });
  }, []);

  const endDragging = useCallback(() => {
    setIsDragging(false);
  }, []);

  const addNote = useCallback((content: string, type: Note['type'], dateKey: string, rangeData?: Note['range'], color?: string) => {
    const newNote: Note = {
      id: Math.random().toString(36).substring(2, 11),
      dateKey,
      content,
      type,
      range: rangeData,
      color
    };
    setNotes(prev => [...prev, newNote]);
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  }, []);

  const updateNote = useCallback((id: string, content: string, color?: string) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, content, color } : n));
  }, []);

  const setCustomImage = useCallback((month: number, imageUrl: string) => {
    setCustomImages(prev => ({ ...prev, [month]: imageUrl }));
  }, []);

  return {
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
  };
}
