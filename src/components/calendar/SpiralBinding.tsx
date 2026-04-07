import React from 'react';

export const SpiralBinding: React.FC = () => {
  return (
    <div className="absolute -top-4 left-0 right-0 flex justify-around px-8 z-20 pointer-events-none">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center">
          {/* The ring */}
          <div className="w-1.5 h-10 bg-gradient-to-b from-zinc-400 via-zinc-200 to-zinc-400 rounded-full shadow-md border border-zinc-500/30 dark:from-zinc-600 dark:via-zinc-400 dark:to-zinc-600" />
          {/* The hole in the paper */}
          <div className="w-3 h-3 -mt-2 bg-zinc-800 rounded-full border border-zinc-600 shadow-inner dark:bg-black" />
        </div>
      ))}
    </div>
  );
};
