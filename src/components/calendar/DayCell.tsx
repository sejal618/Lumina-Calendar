import React from 'react';
import { format, isSameMonth, isSameDay } from 'date-fns';
import { cn } from '../../lib/utils';

interface DayCellProps {
  date: Date;
  currentMonth: Date;
  isSelected: boolean;
  onClick: () => void;
}

export const DayCell: React.FC<DayCellProps> = ({
  date,
  currentMonth,
  isSelected,
  onClick,
}) => {
  const isCurrentMonth = isSameMonth(date, currentMonth);
  const isToday = isSameDay(date, new Date());

  return (
    <button
      onClick={onClick}
      className={cn(
        "aspect-square flex items-center justify-center text-sm rounded-lg transition-colors",
        !isCurrentMonth && "text-zinc-300",
        isCurrentMonth && "text-zinc-600 hover:bg-zinc-100",
        isSelected && "bg-blue-600 text-white font-bold",
        isToday && !isSelected && "border-2 border-blue-200 text-blue-600 font-bold"
      )}
    >
      {format(date, 'd')}
    </button>
  );
};
