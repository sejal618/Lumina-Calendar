import { Holiday } from '../types/calendar';

export const HOLIDAYS: Holiday[] = [
  { date: '2026-01-01', name: "New Year's Day", type: 'public' },
  { date: '2026-01-14', name: "Makar Sankranti / Pongal", type: 'festival' },
  { date: '2026-01-26', name: "Republic Day", type: 'public' },
  { date: '2026-02-02', name: "Vasant Panchami", type: 'festival' },
  { date: '2026-02-12', name: "Guru Ravidas Jayanti", type: 'festival' },
  { date: '2026-02-14', name: "Valentine's Day", type: 'festival' },
  { date: '2026-02-17', name: "Maha Shivaratri", type: 'festival' },
  { date: '2026-02-19', name: "Chhatrapati Shivaji Maharaj Jayanti", type: 'public' },
  { date: '2026-03-03', name: "Holi", type: 'festival' },
  { date: '2026-03-19', name: "Gudi Padwa / Ugadi", type: 'festival' },
  { date: '2026-03-20', name: "Eid al-Fitr", type: 'festival' },
  { date: '2026-03-28', name: "Ram Navami", type: 'festival' },
  { date: '2026-04-01', name: "Mahavir Jayanti", type: 'festival' },
  { date: '2026-04-03', name: "Good Friday", type: 'public' },
  { date: '2026-04-14', name: "Ambedkar Jayanti / Baisakhi", type: 'public' },
  { date: '2026-05-01', name: "Maharashtra Day / May Day", type: 'public' },
  { date: '2026-05-22', name: "Buddha Purnima", type: 'festival' },
  { date: '2026-05-27', name: "Eid al-Adha", type: 'festival' },
  { date: '2026-06-21', name: "International Yoga Day", type: 'festival' },
  { date: '2026-07-16', name: "Muharram", type: 'public' },
  { date: '2026-08-15', name: "Independence Day", type: 'public' },
  { date: '2026-08-26', name: "Onam", type: 'festival' },
  { date: '2026-08-27', name: "Janmashtami", type: 'festival' },
  { date: '2026-08-28', name: "Raksha Bandhan", type: 'festival' },
  { date: '2026-09-05', name: "Ganesh Chaturthi", type: 'festival' },
  { date: '2026-09-15', name: "Milad-un-Nabi", type: 'festival' },
  { date: '2026-10-02', name: "Gandhi Jayanti", type: 'public' },
  { date: '2026-10-20', name: "Dussehra", type: 'festival' },
  { date: '2026-10-29', name: "Karwa Chauth", type: 'festival' },
  { date: '2026-11-08', name: "Diwali", type: 'festival' },
  { date: '2026-11-10', name: "Govardhan Puja", type: 'festival' },
  { date: '2026-11-11', name: "Bhai Dooj", type: 'festival' },
  { date: '2026-11-16', name: "Chhath Puja", type: 'festival' },
  { date: '2026-11-25', name: "Guru Nanak Jayanti", type: 'festival' },
  { date: '2026-12-25', name: "Christmas Day", type: 'public' },
];

export const MONTH_THEMES: Record<number, { primary: string; secondary: string; range: string; accent: string; bg: string; text: string; image: string }> = {
  0: { // Jan
    primary: 'bg-blue-600',
    secondary: 'bg-blue-50',
    range: 'bg-blue-50 dark:bg-blue-900/40',
    accent: 'text-blue-600',
    bg: 'bg-blue-50/30',
    text: 'text-blue-900',
    image: 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?auto=format&fit=crop&q=80&w=1200'
  },
  1: { // Feb
    primary: 'bg-rose-500',
    secondary: 'bg-rose-50',
    range: 'bg-rose-50 dark:bg-rose-900/40',
    accent: 'text-rose-500',
    bg: 'bg-rose-50/30',
    text: 'text-rose-900',
    image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=1200'
  },
  2: { // Mar
    primary: 'bg-emerald-500',
    secondary: 'bg-emerald-50',
    range: 'bg-emerald-50 dark:bg-emerald-900/40',
    accent: 'text-emerald-500',
    bg: 'bg-emerald-50/30',
    text: 'text-emerald-900',
    image: 'https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?auto=format&fit=crop&q=80&w=1200'
  },
  3: { // Apr
    primary: 'bg-pink-400',
    secondary: 'bg-pink-50',
    range: 'bg-pink-50 dark:bg-pink-900/40',
    accent: 'text-pink-400',
    bg: 'bg-pink-50/30',
    text: 'text-pink-900',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&q=80&w=1200'
  },
  4: { // May
    primary: 'bg-green-500',
    secondary: 'bg-green-50',
    range: 'bg-green-50 dark:bg-green-900/40',
    accent: 'text-green-500',
    bg: 'bg-green-50/30',
    text: 'text-green-900',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200'
  },
  5: { // Jun
    primary: 'bg-amber-400',
    secondary: 'bg-amber-50',
    range: 'bg-amber-50 dark:bg-amber-900/40',
    accent: 'text-amber-400',
    bg: 'bg-amber-50/30',
    text: 'text-amber-900',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200'
  },
  6: { // Jul
    primary: 'bg-sky-500',
    secondary: 'bg-sky-50',
    range: 'bg-sky-50 dark:bg-sky-900/40',
    accent: 'text-sky-500',
    bg: 'bg-sky-50/30',
    text: 'text-sky-900',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200'
  },
  7: { // Aug
    primary: 'bg-orange-500',
    secondary: 'bg-orange-50',
    range: 'bg-orange-50 dark:bg-orange-900/40',
    accent: 'text-orange-500',
    bg: 'bg-orange-50/30',
    text: 'text-orange-900',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1200'
  },
  8: { // Sep
    primary: 'bg-teal-600',
    secondary: 'bg-teal-50',
    range: 'bg-teal-50 dark:bg-teal-900/40',
    accent: 'text-teal-600',
    bg: 'bg-teal-50/30',
    text: 'text-teal-900',
    image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=1200'
  },
  9: { // Oct
    primary: 'bg-orange-700',
    secondary: 'bg-orange-50',
    range: 'bg-orange-50 dark:bg-orange-900/40',
    accent: 'text-orange-700',
    bg: 'bg-orange-50/30',
    text: 'text-orange-950',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1200'
  },
  10: { // Nov
    primary: 'bg-stone-600',
    secondary: 'bg-stone-50',
    range: 'bg-stone-50 dark:bg-stone-900/40',
    accent: 'text-stone-600',
    bg: 'bg-stone-50/30',
    text: 'text-stone-900',
    image: 'https://images.unsplash.com/photo-1445262102387-5fbb30a5e59d?auto=format&fit=crop&q=80&w=1200'
  },
  11: { // Dec
    primary: 'bg-indigo-600',
    secondary: 'bg-indigo-50',
    range: 'bg-indigo-50 dark:bg-indigo-900/40',
    accent: 'text-indigo-600',
    bg: 'bg-indigo-50/30',
    text: 'text-indigo-900',
    image: 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?auto=format&fit=crop&q=80&w=1200'
  },
};
