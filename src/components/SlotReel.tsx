'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Lock, Unlock } from 'lucide-react';

interface SlotReelProps {
  char: string;
  isSpinning: boolean;
  isStopping?: boolean;
  isLocked: boolean;
  onToggleLock: () => void;
  onStop: () => void;
  index: number;
}

const FAKE_SPIN_CHARS = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほ'.split('');

export const SlotReel: React.FC<SlotReelProps> = ({ char, isSpinning, isStopping, isLocked, onToggleLock, onStop, index }) => {
  const controls = useAnimation();
  
  // Create a fast moving blur of characters while spinning
  useEffect(() => {
    if (isStopping) {
      // Slow down animation before completely stopping
      controls.start({
        y: [0, -1000],
        transition: {
          y: {
            repeat: Infinity,
            duration: 1.2 + (index * 0.1), // Much slower
            ease: "linear",
          }
        }
      });
    } else if (isSpinning) {
      // Start vertical infinite loop animation
      controls.start({
        y: [0, -1000],
        transition: {
          y: {
            repeat: Infinity,
            duration: 0.3 + (index * 0.05), // slightly different speeds for each reel
            ease: "linear",
          }
        }
      });
    } else {
      // When stopped, animate slowly for a bit, then settle to the final character
      controls.start({
        y: 0,
        transition: {
          type: "spring",
          stiffness: 100,
          damping: 10,
        }
      });
    }
  }, [isSpinning, isStopping, controls, index]);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Reel Window */}
      <div 
        className="w-24 h-32 md:w-32 md:h-40 bg-white border-4 border-yellow-400 rounded-2xl shadow-inner overflow-hidden flex justify-center items-center relative"
        style={{ boxShadow: 'inset 0 4px 6px rgba(0,0,0,0.1)' }}
      >
        <div className="absolute w-full h-full bg-gradient-to-b from-black/10 via-transparent to-black/10 z-10 pointer-events-none" />
        
        {isSpinning ? (
          <motion.div 
            animate={controls}
            className="flex flex-col text-5xl md:text-7xl font-bold text-gray-800"
          >
            {/* Displaying fake spinning items, just a long list to scroll through */}
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="h-32 md:h-40 flex items-center justify-center">
                 {FAKE_SPIN_CHARS[(index + i) % FAKE_SPIN_CHARS.length]}
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-6xl md:text-8xl font-black text-rose-500 drop-shadow-md"
          >
            {char}
          </motion.div>
        )}
      </div>

      {/* Controls below Reel */}
      <div className="flex flex-col gap-2 w-full justify-center items-center">
        <button
          onClick={isSpinning ? onStop : onToggleLock}
          className={`flex items-center justify-center w-16 h-16 rounded-full transition-transform transform active:scale-95 shadow-md border-4 ${
            isSpinning 
              ? 'bg-red-500 border-red-600 text-white'
              : isLocked 
                ? 'bg-gray-300 border-gray-400 text-gray-600' 
                : 'bg-green-400 border-green-500 text-white'
          }`}
          aria-label={isSpinning ? "ストップ" : isLocked ? "ロック解除" : "ロックする"}
        >
          {isSpinning ? (
            <span className="font-bold text-lg">とまる</span>
          ) : isLocked ? (
            <Lock size={28} />
          ) : (
            <Unlock size={28} />
          )}
        </button>
      </div>
    </div>
  );
};
