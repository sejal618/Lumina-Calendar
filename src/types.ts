export interface Note {
  id: string;
  date: string; // ISO string or YYYY-MM-DD
  content: string;
}

export interface DateRange {
  start: Date | null;
  end: Date | null;
}
