import { useState, useMemo, useEffect } from 'react';
import { 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval,
  isBefore,
  isSameDay,
  format
} from 'date-fns';

export interface Note {
  id: string;
  dateKey: string;
  content: string;
  type: 'day' | 'range';
  range?: { start: string; end: string };
}

export function useCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [range, setRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
  const [notes, setNotes] = useState<Note[]>([]);

  // Persistence
  useEffect(() => {
    const savedNotes = localStorage.getItem('calendar-notes');
    if (savedNotes) setNotes(JSON.parse(savedNotes));
  }, []);

  useEffect(() => {
    localStorage.setItem('calendar-notes', JSON.stringify(notes));
  }, [notes]);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentDate));
    const end = endOfWeek(endOfMonth(currentDate));
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

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

  return {
    currentDate,
    days,
    range,
    notes,
    handleDateClick,
    addNote,
    deleteNote,
    nextMonth,
    prevMonth,
  };
}
