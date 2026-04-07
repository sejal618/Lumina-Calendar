import React, { useState } from 'react';
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
  currentDate: Date;
  accentColor: string;
}

export const NotesPanel: React.FC<NotesPanelProps> = ({
  notes,
  range,
  onAddNote,
  onDeleteNote,
  currentDate,
  accentColor
}) => {
  const [newNote, setNewNote] = useState('');
  const monthKey = format(currentDate, 'yyyy-MM');

  const filteredNotes = notes.filter(n => {
    if (n.type === 'month') return n.dateKey === monthKey;
    if (range.start && range.end) {
      return n.type === 'range' && n.range?.start === format(range.start, 'yyyy-MM-dd') && n.range?.end === format(range.end, 'yyyy-MM-dd');
    }
    if (range.start) {
      return n.type === 'day' && n.dateKey === format(range.start, 'yyyy-MM-dd');
    }
    return false;
  });

  const handleAdd = () => {
    if (!newNote.trim()) return;
    
    let type: Note['type'] = 'month';
    let dateKey = monthKey;
    let rangeData: Note['range'] | undefined;

    if (range.start && range.end) {
      type = 'range';
      dateKey = `range-${format(range.start, 'yyyyMMdd')}-${format(range.end, 'yyyyMMdd')}`;
      rangeData = { start: format(range.start, 'yyyy-MM-dd'), end: format(range.end, 'yyyy-MM-dd') };
    } else if (range.start) {
      type = 'day';
      dateKey = format(range.start, 'yyyy-MM-dd');
    }

    onAddNote(newNote, type, dateKey, rangeData);
    setNewNote('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-lg", accentColor)}>
            <StickyNote size={16} />
          </div>
          <h2 className="font-bold uppercase tracking-widest text-xs text-zinc-500 dark:text-zinc-400">
            {range.start ? (range.end ? 'Range Notes' : 'Day Notes') : 'Monthly Memos'}
          </h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {filteredNotes.length === 0 ? (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-zinc-400 italic py-4"
            >
              No notes for this {range.start ? 'selection' : 'month'}.
            </motion.p>
          ) : (
            filteredNotes.map(note => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group relative p-4 bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl shadow-sm hover:shadow-md transition-all"
              >
                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed pr-6">
                  {note.content}
                </p>
                <button
                  onClick={() => onDeleteNote(note.id)}
                  className="absolute top-4 right-4 text-zinc-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <div className="relative">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Type a note..."
          className="w-full p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:focus:ring-zinc-700 transition-all resize-none min-h-[100px]"
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
            "absolute bottom-3 right-3 p-2 rounded-xl text-white transition-all shadow-lg",
            accentColor,
            !newNote.trim() && "opacity-50 cursor-not-allowed"
          )}
        >
          <Plus size={18} />
        </button>
      </div>
      
      {range.start && (
        <button 
          onClick={() => {}} // This could clear range if we pass the setter
          className="mt-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-600 transition-colors"
        >
          <CalendarIcon size={12} />
          {format(range.start, 'MMM d')}
          {range.end && ` — ${format(range.end, 'MMM d')}`}
        </button>
      )}
    </div>
  );
};
