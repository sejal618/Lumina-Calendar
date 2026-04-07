import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { MONTH_THEMES } from '../../constants/calendar';

interface HeroSectionProps {
  currentDate: Date;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ currentDate }) => {
  const monthIndex = currentDate.getMonth();
  const theme = MONTH_THEMES[monthIndex];

  return (
    <div className="relative h-64 md:h-full md:min-h-[400px] overflow-hidden rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none group">
      <motion.img
        key={theme.image}
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        src={theme.image}
        alt="Calendar Hero"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      
      <div className="absolute bottom-8 left-8 text-white">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-6xl font-serif font-black tracking-tighter leading-none mb-2">
            {format(currentDate, 'MM')}
          </h1>
          <div className="flex flex-col">
            <span className="text-2xl font-bold uppercase tracking-[0.2em]">
              {format(currentDate, 'MMMM')}
            </span>
            <span className="text-lg font-light opacity-60 tracking-widest">
              {format(currentDate, 'yyyy')}
            </span>
          </div>
        </motion.div>
      </div>

      <div className="absolute top-8 right-8 hidden md:block">
        <span className="writing-mode-vertical text-white/30 text-xs font-bold uppercase tracking-[0.5em] select-none">
          Lumina Edition • 2026
        </span>
      </div>
    </div>
  );
};
