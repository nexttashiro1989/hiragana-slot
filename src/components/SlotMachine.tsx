'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { generateRandomString, ALL_CHARS } from '@/lib/hiragana';
import { SlotReel } from './SlotReel';
import { Volume2, Play } from 'lucide-react';

export default function SlotMachine() {
  const [mode, setMode] = useState<number>(3); // Default to 3 chars
  
  // Use static characters initially to prevent SSR hydration mismatch between Server and Client
  const [chars, setChars] = useState<string[]>(['あ', 'そ', 'ぼ']);
  const [lockedChars, setLockedChars] = useState<boolean[]>(Array(5).fill(false));
  const [spinningStates, setSpinningStates] = useState<boolean[]>(Array(5).fill(false));
  const [stoppingStates, setStoppingStates] = useState<boolean[]>(Array(5).fill(false));
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  const handleModeChange = (newMode: number) => {
    if (isAnySpinning || isSynthesizing) return;
    setMode(newMode);
    setChars(generateRandomString(newMode));
    setLockedChars(Array(newMode).fill(false));
    setSpinningStates(Array(newMode).fill(false));
    setStoppingStates(Array(newMode).fill(false));
  };

  const isAnySpinning = spinningStates.some(s => s) || stoppingStates.some(s => s);

  const handleStartSpin = () => {
    if (isAnySpinning) return;
    
    // Only spin unlocked ones
    const newSpinningStates = chars.map((_, i) => !lockedChars[i] && i < mode);
    setSpinningStates(newSpinningStates);
    setStoppingStates(Array(mode).fill(false));

    if (!newSpinningStates.some(s => s)) {
      return; 
    }
  };

  const stopReel = useCallback((index: number) => {
    if (!spinningStates[index] || stoppingStates[index]) return;

    // Start stopping sequence
    setStoppingStates(prev => {
      const next = [...prev];
      next[index] = true;
      return next;
    });

    setTimeout(() => {
      setSpinningStates(prev => {
        const next = [...prev];
        next[index] = false;
        return next;
      });
      setStoppingStates(prev => {
        const next = [...prev];
        next[index] = false;
        return next;
      });

      setChars(prevChars => {
      const currentContext = [...prevChars];
      // We need to pick a valid character for `index` assuming the rest is fixed.
      // This might be tricky if it paints itself into a corner, but since it's only limited rules (no repeat sokuon, no 'ん' at start),
      // we can just pick random characters until valid.
      
      let valid = false;
      let newChar = '';
      while (!valid) {
        newChar = ALL_CHARS[Math.floor(Math.random() * ALL_CHARS.length)];
        currentContext[index] = newChar;
        
        let validSequence = true;
        // Check rule 1
        if (['ん', 'っ', '〜', 'ゃ', 'ゅ', 'ょ'].includes(currentContext[0])) {
           validSequence = false;
        }
        // Check rule 2
        for (let i = 1; i < currentContext.length; i++) {
          const isRestricted = (char: string) => ['ゃ', 'ゅ', 'ょ', 'っ', '〜'].includes(char);
          if (isRestricted(currentContext[i]) && isRestricted(currentContext[i - 1])) {
            validSequence = false;
          }
        }
        if (validSequence) valid = true;
      }

      return currentContext;
    });
    }, 1000); // 1 second slow down before stopping

  }, [spinningStates, stoppingStates]);

  const toggleLock = (index: number) => {
    if (spinningStates[index]) return; // Cannot lock while spinning
    setLockedChars(prev => {
      const copy = [...prev];
      copy[index] = !copy[index];
      return copy;
    });
  };

  const speak = () => {
    if (isSynthesizing || isAnySpinning) return;
    const text = chars.join('').replace(/〜/g, 'ー'); // replace display Choon with actual Choon for TTS
    
    if ('speechSynthesis' in window) {
      setIsSynthesizing(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.8; // Speak slightly slower for toddlers
      utterance.pitch = 1.2; // Slightly higher pitch for child-friendly voice
      
      utterance.onend = () => setIsSynthesizing(false);
      utterance.onerror = () => setIsSynthesizing(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4 md:p-8">
      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-10 bg-white p-2 rounded-2xl shadow-sm border-2 border-indigo-100">
        {[1, 2, 3, 4, 5].map(num => (
          <button
            key={num}
            onClick={() => handleModeChange(num)}
            className={`px-4 py-2 md:px-6 md:py-3 rounded-xl font-bold text-xl transition-all ${
              mode === num 
                ? 'bg-indigo-500 text-white shadow-md scale-105' 
                : 'bg-indigo-50 text-indigo-400 hover:bg-indigo-100'
            } ${(isAnySpinning || isSynthesizing) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {num}もじ
          </button>
        ))}
      </div>

      {/* Slot Machine Display */}
      <div className="flex flex-row justify-center gap-2 md:gap-6 mb-12">
        {Array.from({ length: mode }).map((_, index) => (
          <SlotReel
            key={index}
            index={index}
            char={chars[index]}
            isSpinning={spinningStates[index]}
            isStopping={stoppingStates[index]}
            isLocked={lockedChars[index]}
            onToggleLock={() => toggleLock(index)}
            onStop={() => stopReel(index)}
          />
        ))}
      </div>

      {/* Main Controls */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 w-full">
        <button
          onClick={handleStartSpin}
          disabled={isAnySpinning || lockedChars.every(l => l)}
          className={`flex items-center justify-center gap-3 w-64 py-6 rounded-full font-black text-3xl shadow-[0_8px_0_rgb(185,28,28)] active:shadow-[0_0px_0_rgb(185,28,28)] active:translate-y-2 transition-all ${
            isAnySpinning || lockedChars.every(l => l)
              ? 'bg-gray-400 text-gray-200 shadow-[0_8px_0_rgb(156,163,175)]' 
              : 'bg-red-500 hover:bg-red-400 text-white'
          }`}
        >
          <Play size={36} fill="currentColor" />
          <span>まわす！</span>
        </button>

        <button
          onClick={speak}
          disabled={isAnySpinning || isSynthesizing}
          className={`flex items-center justify-center gap-3 w-64 py-6 rounded-full font-black text-3xl shadow-[0_8px_0_rgb(67,56,202)] active:shadow-[0_0px_0_rgb(67,56,202)] active:translate-y-2 transition-all ${
            isAnySpinning || isSynthesizing
              ? 'bg-gray-400 text-gray-200 shadow-[0_8px_0_rgb(156,163,175)]'
              : 'bg-indigo-500 hover:bg-indigo-400 text-white'
          }`}
        >
          <Volume2 size={36} />
          <span>よむ！</span>
        </button>
      </div>
    </div>
  );
}
