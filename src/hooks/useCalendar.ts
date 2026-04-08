import { useState, useMemo, useEffect } from 'react';
import { 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  format,
  isSameDay,
  isBefore,
  startOfToday
} from 'date-fns';
import { DateRange, Note } from '../types/calendar';

export function useCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [notes, setNotes] = useState<Note[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('calendar-theme') === 'dark';
    }
    return false;
  });
  const [focusedDate, setFocusedDate] = useState<Date>(new Date());
  const [customImages, setCustomImages] = useState<Record<number, string>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('calendar-custom-images');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  // Persistence
  useEffect(() => {
    const savedNotes = localStorage.getItem('calendar-notes');
    if (savedNotes) setNotes(JSON.parse(savedNotes));
    
    const savedTheme = localStorage.getItem('calendar-theme');
    if (savedTheme) setIsDarkMode(savedTheme === 'dark');
  }, []);

  useEffect(() => {
    localStorage.setItem('calendar-notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('calendar-theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('calendar-custom-images', JSON.stringify(customImages));
  }, [customImages]);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const nextMonth = () => {
    const next = addMonths(currentDate, 1);
    setCurrentDate(next);
    setFocusedDate(startOfMonth(next));
  };
  const prevMonth = () => {
    const prev = subMonths(currentDate, 1);
    setCurrentDate(prev);
    setFocusedDate(startOfMonth(prev));
  };

  const [isDragging, setIsDragging] = useState(false);

  const handleDateClick = (date: Date) => {
    if (!range.start || (range.start && range.end)) {
      setRange({ start: date, end: null });
    } else {
      if (isBefore(date, range.start)) {
        setRange({ start: date, end: range.start });
      } else {
        setRange({ start: range.start, end: date });
      }
    }
  };

  const setRangeStart = (date: Date) => {
    setRange({ start: date, end: null });
    setIsDragging(true);
  };

  const updateRangeEnd = (date: Date) => {
    if (isDragging && range.start) {
      if (isBefore(date, range.start)) {
        setRange({ start: date, end: range.start });
      } else {
        setRange({ start: range.start, end: date });
      }
    }
  };

  const endDragging = () => {
    setIsDragging(false);
  };

  const addNote = (content: string, type: Note['type'], dateKey: string, rangeData?: Note['range']) => {
    const newNote: Note = {
      id: Math.random().toString(36).substr(2, 9),
      dateKey,
      content,
      type,
      range: rangeData
    };
    setNotes(prev => [...prev, newNote]);
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const setCustomImage = (month: number, imageUrl: string) => {
    setCustomImages(prev => ({ ...prev, [month]: imageUrl }));
  };

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
    handleDateClick,
    setRangeStart,
    updateRangeEnd,
    endDragging,
    addNote,
    deleteNote,
    setIsDarkMode,
    setRange,
    setCustomImage
  };
}
