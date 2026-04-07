export interface Note {
  id: string;
  dateKey: string; // YYYY-MM-DD or YYYY-MM for monthly
  content: string;
  type: 'day' | 'range' | 'month';
  range?: { start: string; end: string };
}

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface Holiday {
  date: string; // YYYY-MM-DD
  name: string;
}

export type ThemeColor = {
  primary: string;
  secondary: string;
  accent: string;
  bg: string;
  text: string;
};
