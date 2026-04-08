import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Image as ImageIcon } from 'lucide-react';
import { MONTH_THEMES } from '../../constants/calendar';
import { cn } from '../../lib/utils';

interface HeroSectionProps {
  currentDate: Date;
  customImage?: string;
  onImageChange: (url: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ 
  currentDate, 
  customImage, 
  onImageChange
}) => {
  const monthIndex = currentDate.getMonth();
  const theme = MONTH_THEMES[monthIndex];
  const displayImage = customImage || theme.image;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onImageChange(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative h-64 md:h-full md:min-h-[400px] overflow-hidden rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none group">
      <motion.img
        key={displayImage}
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        src={displayImage}
        alt="Calendar Hero"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      
      {/* Controls Container */}
      <div className="absolute top-4 left-4 z-50 flex items-center gap-2">
        {/* Image Change Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => fileInputRef.current?.click()}
          data-export-ignore
          className="p-2 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-full transition-all border border-white/20 opacity-0 group-hover:opacity-100"
          title="Upload Hero Image"
        >
          <ImageIcon size={18} />
        </motion.button>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          className="hidden"
        />
      </div>

      <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 text-white">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-4xl md:text-6xl font-serif font-black tracking-tighter leading-none mb-2">
            {format(currentDate, 'MM')}
          </h1>
          <div className="flex flex-col">
            <span className="text-xl md:text-2xl font-bold uppercase tracking-[0.2em]">
              {format(currentDate, 'MMMM')}
            </span>
            <span className="text-sm md:text-lg font-light opacity-60 tracking-widest">
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
