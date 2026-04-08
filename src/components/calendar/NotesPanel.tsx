import React, { useState, useMemo } from 'react';
import { StickyNote, Trash2, Plus, X, Calendar as CalendarIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Note, DateRange } from '../../types/calendar';
import { format } from 'date-fns';
import { cn } from '../../lib/utils';

interface NotesPanelProps {
  notes: Note[];
  range: DateRange;
  onAddNote: (content: string, type: Note['type'], dateKey: string, range?: Note['range']) => void;
  onDeleteNote: (id: string) => void;
  onClearRange: () => void;
  currentDate: Date;
  accentColor: string;
}

export const NotesPanel: React.FC<NotesPanelProps> = ({
  notes,
  range,
  onAddNote,
  onDeleteNote,
  onClearRange,
  currentDate,
  accentColor
}) => {
  const [newNote, setNewNote] = useState('');
  const monthKey = format(currentDate, 'yyyy-MM');

  const activeDateKey = range.start && !range.end ? format(range.start, 'yyyy-MM-dd') : null;
  const activeRangeKey = range.start && range.end ? `range-${format(range.start, 'yyyyMMdd')}-${format(range.end, 'yyyyMMdd')}` : null;

  const categorizedNotes = useMemo(() => {
    const month = notes.filter(n => n.type === 'month' && n.dateKey === monthKey);
    const day = notes.filter(n => n.type === 'day' && n.dateKey.startsWith(monthKey));
    const rangeNotes = notes.filter(n => n.type === 'range' && (n.range?.start.startsWith(monthKey) || n.range?.end.startsWith(monthKey)));
    
    return { month, day, range: rangeNotes };
  }, [notes, monthKey]);

  const handleAdd = () => {
    if (!newNote.trim()) return;
    
    let type: Note['type'] = 'month';
    let dateKey = monthKey;
    let rangeData: Note['range'] | undefined;

    if (range.start && range.end) {
      type = 'range';
      dateKey = activeRangeKey!;
      rangeData = { start: format(range.start, 'yyyy-MM-dd'), end: format(range.end, 'yyyy-MM-dd') };
    } else if (range.start) {
      type = 'day';
      dateKey = activeDateKey!;
    }

    onAddNote(newNote, type, dateKey, rangeData);
    setNewNote('');
  };

  const renderNoteList = (title: string, noteList: Note[], icon: React.ReactNode) => {
    if (noteList.length === 0) return null;
    return (
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 px-1">
          <div className="text-zinc-400">{icon}</div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
            {title}
          </h3>
        </div>
        <div className="space-y-2">
          {noteList.map(note => {
            const isActive = (note.type === 'day' && note.dateKey === activeDateKey) || 
                           (note.type === 'range' && note.dateKey === activeRangeKey) ||
                           (note.type === 'month' && !range.start);

            return (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "group relative p-4 rounded-2xl border transition-all duration-300",
                  isActive 
                    ? "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 shadow-md scale-[1.02]" 
                    : "bg-zinc-50/50 dark:bg-zinc-900/30 border-transparent opacity-60 hover:opacity-100"
                )}
              >
                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed pr-6">
                  {note.content}
                </p>
                {note.type === 'range' && note.range && (
                  <p className="text-[10px] font-medium text-zinc-400 mt-2">
                    {format(new Date(note.range.start), 'MMM d')} — {format(new Date(note.range.end), 'MMM d')}
                  </p>
                )}
                {note.type === 'day' && (
                  <p className="text-[10px] font-medium text-zinc-400 mt-2">
                    {format(new Date(note.dateKey), 'MMMM d')}
                  </p>
                )}
                <button
                  onClick={() => onDeleteNote(note.id)}
                  data-export-ignore
                  className="absolute top-4 right-4 text-zinc-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform hover:rotate-3", accentColor)}>
            <StickyNote size={20} />
          </div>
          <div>
            <h2 className="font-black text-zinc-900 dark:text-zinc-100 text-lg tracking-tight">
              Notebook
            </h2>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              {format(currentDate, 'MMMM yyyy')}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {notes.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-300 dark:text-zinc-600 mb-4">
                <Plus size={24} />
              </div>
              <p className="text-sm text-zinc-400 italic">No notes yet. Start writing...</p>
            </motion.div>
          ) : (
            <>
              {renderNoteList('Monthly Memos', categorizedNotes.month, <CalendarIcon size={12} />)}
              {renderNoteList('Range Notes', categorizedNotes.range, <StickyNote size={12} />)}
              {renderNoteList('Day Notes', categorizedNotes.day, <Plus size={12} />)}
            </>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-6 space-y-4" data-export-ignore>
        <div className="relative">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder={range.start ? (range.end ? "Add note for range..." : "Add note for day...") : "Add monthly memo..."}
            className="w-full p-5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-[2rem] text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-4 focus:ring-zinc-100 dark:focus:ring-zinc-800/50 transition-all resize-none min-h-[120px] shadow-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAdd();
              }
            }}
          />
          <button
            onClick={handleAdd}
            disabled={!newNote.trim()}
            className={cn(
              "absolute bottom-4 right-4 p-3 rounded-2xl text-white transition-all shadow-xl active:scale-95",
              accentColor,
              !newNote.trim() && "opacity-50 cursor-not-allowed grayscale"
            )}
          >
            <Plus size={20} />
          </button>
        </div>
        
        {range.start && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between p-3 bg-zinc-100 dark:bg-zinc-800/50 rounded-2xl"
          >
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
              <CalendarIcon size={12} />
              {format(range.start, 'MMM d')}
              {range.end && ` — ${format(range.end, 'MMM d')}`}
            </div>
            <button 
              onClick={onClearRange}
              className="p-1 hover:bg-white dark:hover:bg-zinc-700 rounded-lg transition-colors text-zinc-400 hover:text-zinc-600"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
